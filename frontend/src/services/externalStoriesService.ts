/**
 * ExternalStoriesService - Intégration avec APIs légales
 * Project Gutenberg, OpenLibrary, Wikisource, etc.
 */

import { GutenbergBook, OpenLibraryWork, WikisourceText, ExternalStoryImport } from '../types/story';

class ExternalStoriesService {
  private readonly GUTENBERG_API = 'https://gutendex.com/books';
  private readonly OPENLIBRARY_API = 'https://openlibrary.org';

  /**
   * Rechercher des livres sur Project Gutenberg
   */
  async searchGutenbergBooks(query: string, limit: number = 20): Promise<GutenbergBook[]> {
    try {
      const searchParams = new URLSearchParams({
        search: query,
        page_size: limit.toString(),
        mime_type: 'text/plain,text/html',
      });

      const response = await fetch(`${this.GUTENBERG_API}?${searchParams}`);
      const data = await response.json();
      
      return data.results || [];
    } catch (error) {
      console.error('Erreur lors de la recherche Gutenberg:', error);
      return [];
    }
  }

  /**
   * Obtenir les détails d'un livre Gutenberg
   */
  async getGutenbergBook(id: number): Promise<GutenbergBook | null> {
    try {
      const response = await fetch(`${this.GUTENBERG_API}/${id}`);
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération du livre Gutenberg:', error);
      return null;
    }
  }

  /**
   * Télécharger le contenu d'un livre Gutenberg
   */
  async downloadGutenbergContent(book: GutenbergBook): Promise<string> {
    try {
      // Priorité: text/plain, puis text/html
      const textUrl = book.formats['text/plain'] || 
                      book.formats['text/plain; charset=utf-8'] ||
                      book.formats['text/html'];

      if (!textUrl) {
        throw new Error('Format texte non disponible');
      }

      const response = await fetch(textUrl);
      return await response.text();
    } catch (error) {
      console.error('Erreur lors du téléchargement du contenu:', error);
      throw error;
    }
  }

  /**
   * Rechercher des œuvres sur OpenLibrary
   */
  async searchOpenLibrary(query: string, limit: number = 20): Promise<OpenLibraryWork[]> {
    try {
      const searchParams = new URLSearchParams({
        q: query,
        limit: limit.toString(),
        fields: 'key,title,author_name,subject,first_publish_date,cover_i',
      });

      const response = await fetch(`${this.OPENLIBRARY_API}/search.json?${searchParams}`);
      const data = await response.json();
      
      return data.docs.map((doc: any) => ({
        key: doc.key,
        title: doc.title,
        authors: doc.author_name?.map((name: string) => ({ name })) || [],
        subjects: doc.subject || [],
        first_publish_date: doc.first_publish_date,
        covers: doc.cover_i ? [doc.cover_i] : [],
      }));
    } catch (error) {
      console.error('Erreur lors de la recherche OpenLibrary:', error);
      return [];
    }
  }

  /**
   * Obtenir les détails d'une œuvre OpenLibrary
   */
  async getOpenLibraryWork(key: string): Promise<OpenLibraryWork | null> {
    try {
      const response = await fetch(`${this.OPENLIBRARY_API}${key}.json`);
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'œuvre OpenLibrary:', error);
      return null;
    }
  }

  /**
   * Obtenir l'URL de couverture OpenLibrary
   */
  getOpenLibraryCoverUrl(coverId: number, size: 'S' | 'M' | 'L' = 'M'): string {
    return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
  }

  /**
   * Rechercher du contenu sur Wikisource
   */
  async searchWikisource(query: string, language: string = 'fr'): Promise<any[]> {
    try {
      const searchParams = new URLSearchParams({
        action: 'query',
        list: 'search',
        srsearch: query,
        srlimit: '20',
        format: 'json',
        origin: '*',
      });

      const response = await fetch(`https://${language}.wikisource.org/w/api.php?${searchParams}`);
      const data = await response.json();
      
      return data.query?.search || [];
    } catch (error) {
      console.error('Erreur lors de la recherche Wikisource:', error);
      return [];
    }
  }

  /**
   * Obtenir le contenu d'une page Wikisource
   */
  async getWikisourceContent(title: string, language: string = 'fr'): Promise<WikisourceText | null> {
    try {
      const searchParams = new URLSearchParams({
        action: 'query',
        prop: 'extracts|info',
        titles: title,
        exintro: 'false',
        explaintext: 'true',
        format: 'json',
        origin: '*',
      });

      const response = await fetch(`https://${language}.wikisource.org/w/api.php?${searchParams}`);
      const data = await response.json();
      
      const pages = data.query?.pages;
      if (!pages) return null;

      const page = Object.values(pages)[0] as any;
      
      return {
        title: page.title,
        author: 'Auteur inconnu', // À améliorer avec parsing
        content: page.extract || '',
        language,
        source_url: `https://${language}.wikisource.org/wiki/${encodeURIComponent(title)}`,
        license: 'Creative Commons',
      };
    } catch (error) {
      console.error('Erreur lors de la récupération du contenu Wikisource:', error);
      return null;
    }
  }

  /**
   * Importer une histoire depuis une source externe
   */
  async importExternalStory(importData: ExternalStoryImport): Promise<any> {
    try {
      let content = '';
      let coverImage = '';
      let metadata = {};

      switch (importData.source) {
        case 'gutenberg':
          const gutenbergBook = await this.getGutenbergBook(parseInt(importData.externalId));
          if (gutenbergBook) {
            content = await this.downloadGutenbergContent(gutenbergBook);
            metadata = {
              subjects: gutenbergBook.subjects,
              languages: gutenbergBook.languages,
              downloadCount: gutenbergBook.download_count,
            };
          }
          break;

        case 'openlibrary':
          const openLibraryWork = await this.getOpenLibraryWork(importData.externalId);
          if (openLibraryWork && openLibraryWork.covers?.[0]) {
            coverImage = this.getOpenLibraryCoverUrl(openLibraryWork.covers[0]);
          }
          break;

        case 'wikisource':
          const wikisourceContent = await this.getWikisourceContent(importData.title, importData.language || 'fr');
          if (wikisourceContent) {
            content = wikisourceContent.content;
          }
          break;
      }

      return {
        title: importData.title,
        author: importData.author,
        description: importData.description || '',
        content,
        coverImage,
        category: importData.category || 'literature',
        language: importData.language || 'fr',
        license: importData.license,
        source: importData.source,
        externalId: importData.externalId,
        metadata,
      };
    } catch (error) {
      console.error('Erreur lors de l\'importation:', error);
      throw error;
    }
  }

  /**
   * Obtenir les catégories populaires par source
   */
  getPopularCategories(): Record<string, string[]> {
    return {
      gutenberg: [
        'Fiction',
        'Literature',
        'Poetry',
        'Philosophy',
        'History',
        'Science',
        'Children\'s Literature',
        'Mystery',
        'Adventure',
        'Romance'
      ],
      openlibrary: [
        'Fiction',
        'Non-fiction',
        'Poetry',
        'Drama',
        'History',
        'Biography',
        'Science',
        'Philosophy',
        'Religion',
        'Art'
      ],
      wikisource: [
        'Littérature française',
        'Poésie',
        'Théâtre',
        'Histoire',
        'Philosophie',
        'Sciences',
        'Droit',
        'Religion',
        'Biographie',
        'Correspondance'
      ]
    };
  }

  /**
   * Vérifier si une source est sous licence libre
   */
}

export const externalStoriesService = new ExternalStoriesService();
export default externalStoriesService;
