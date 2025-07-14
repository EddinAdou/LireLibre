/**
 * ImportPage - Page d'importation d'histoires depuis des sources externes
 * Project Gutenberg, OpenLibrary, Wikisource, etc.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Download, Book, Globe, Users, Calendar, Import } from 'lucide-react';
import { externalStoriesService } from '../services/externalStoriesService';
import { GutenbergBook, OpenLibraryWork, ExternalStoryImport } from '../types/story';

interface SearchResult {
  id: string;
  title: string;
  author: string;
  description?: string;
  language: string;
  source: 'gutenberg' | 'openlibrary' | 'wikisource';
  downloadCount?: number;
  subjects?: string[];
  originalData: any;
}

const ImportPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSource, setSelectedSource] = useState<'all' | 'gutenberg' | 'openlibrary' | 'wikisource'>('all');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState<string | null>(null);

  const sources = [
    { id: 'all', name: 'Toutes les sources', icon: Globe },
    { id: 'gutenberg', name: 'Project Gutenberg', icon: Book },
    { id: 'openlibrary', name: 'Open Library', icon: Users },
    { id: 'wikisource', name: 'Wikisource', icon: Calendar },
  ];

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    try {
      setLoading(true);
      setSearchResults([]);

      const results: SearchResult[] = [];

      // Recherche dans Project Gutenberg
      if (selectedSource === 'all' || selectedSource === 'gutenberg') {
        try {
          const gutenbergBooks = await externalStoriesService.searchGutenbergBooks(searchTerm, 20);

          const gutenbergResults: SearchResult[] = gutenbergBooks.map((book: GutenbergBook) => ({
            id: `gutenberg-${book.id}`,
            title: book.title,
            author: book.authors?.[0]?.name || 'Auteur inconnu',
            description: book.subjects?.slice(0, 3).join(', '),
            language: book.languages?.[0] || 'en',
            source: 'gutenberg' as const,
            downloadCount: book.download_count,
            subjects: book.subjects,
            originalData: book,
          }));

          results.push(...gutenbergResults);
        } catch (error) {
          console.error('Erreur recherche Gutenberg:', error);
        }
      }

      // Recherche dans OpenLibrary
      if (selectedSource === 'all' || selectedSource === 'openlibrary') {
        try {
          const openLibraryWorks = await externalStoriesService.searchOpenLibrary(searchTerm);

          const openLibraryResults: SearchResult[] = openLibraryWorks.map((work: OpenLibraryWork) => ({
            id: `openlibrary-${work.key}`,
            title: work.title,
            author: work.authors?.[0]?.name || 'Auteur inconnu',
            description: typeof work.description === 'string' 
              ? work.description 
              : work.description?.value || work.subjects?.slice(0, 3).join(', '),
            language: 'en', // OpenLibrary principalement en anglais
            source: 'openlibrary' as const,
            originalData: work,
          }));

          results.push(...openLibraryResults);
        } catch (error) {
          console.error('Erreur recherche OpenLibrary:', error);
        }
      }

      setSearchResults(results);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (result: SearchResult) => {
    try {
      setImporting(result.id);

      const importData: ExternalStoryImport = {
        source: result.source,
        externalId: result.originalData.id || result.originalData.key,
        title: result.title,
        author: result.author,
        description: result.description,
        language: result.language,
        license: 'Public Domain', // À déterminer selon la source
      };

      const importedStory = await externalStoriesService.importExternalStory(importData);
      
      // Rediriger vers la page d'édition de l'histoire importée
      navigate(`/stories/${importedStory.id}/edit`);
    } catch (error) {
      console.error('Erreur lors de l\'importation:', error);
      alert('Erreur lors de l\'importation. Veuillez réessayer.');
    } finally {
      setImporting(null);
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'gutenberg': return Book;
      case 'openlibrary': return Users;
      case 'wikisource': return Calendar;
      default: return Globe;
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'gutenberg': return 'bg-blue-100 text-blue-800';
      case 'openlibrary': return 'bg-green-100 text-green-800';
      case 'wikisource': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/stories')}
                className="text-gray-500 hover:text-gray-700 mr-4"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                Importer des histoires
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Informations sur l'importation */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <Import className="h-6 w-6 text-blue-600 mr-3 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Importation légale de contenu
              </h3>
              <p className="text-blue-800 mb-4">
                Importez légalement des histoires du domaine public depuis des sources fiables comme 
                Project Gutenberg, OpenLibrary et Wikisource. Tout le contenu importé respecte les 
                droits d'auteur et les licences libres.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <Book className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm text-blue-800">60,000+ livres gratuits</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm text-blue-800">Millions d'œuvres</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm text-blue-800">Textes historiques</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Rechercher par titre, auteur ou sujet..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="input-white-large w-full pl-10 pr-4"
                  />
                </div>
              </div>

              <button
                onClick={handleSearch}
                disabled={loading}
                className="btn-black-large flex items-center disabled:opacity-50"
              >
                <Search className="h-5 w-5 mr-2" />
                {loading ? 'Recherche...' : 'Rechercher'}
              </button>
            </div>

            {/* Sélection de source */}
            <div className="flex flex-wrap gap-2">
              {sources.map((source) => {
                const IconComponent = source.icon;
                return (
                  <button
                    key={source.id}
                    onClick={() => setSelectedSource(source.id as any)}
                    className={`flex items-center px-3 py-2 rounded-lg border transition-colors ${
                      selectedSource === source.id
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent className="h-4 w-4 mr-2" />
                    {source.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Résultats de recherche */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Recherche en cours...</p>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {searchResults.length} résultat(s) trouvé(s)
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {searchResults.map((result) => {
                const SourceIcon = getSourceIcon(result.source);
                return (
                  <div key={result.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h4 className="text-lg font-semibold text-gray-900 mr-3">
                            {result.title}
                          </h4>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getSourceColor(result.source)}`}>
                            <SourceIcon className="h-3 w-3 inline mr-1" />
                            {result.source}
                          </span>
                        </div>

                        <p className="text-gray-600 mb-2">
                          Par {result.author}
                        </p>

                        {result.description && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {result.description}
                          </p>
                        )}

                        <div className="flex items-center text-xs text-gray-500 space-x-4">
                          <span>
                            Langue: {result.language.toUpperCase()}
                          </span>
                          {result.downloadCount && (
                            <span className="flex items-center">
                              <Download className="h-3 w-3 mr-1" />
                              {result.downloadCount.toLocaleString()} téléchargements
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleImport(result)}
                        disabled={importing === result.id}
                        className="ml-4 btn-black flex items-center disabled:opacity-50"
                      >
                        {importing === result.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Importation...
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4 mr-2" />
                            Importer
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : searchTerm && !loading ? (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Aucun résultat trouvé</h3>
            <p className="text-gray-600">
              Essayez des mots-clés différents ou changez de source.
            </p>
          </div>
        ) : (
          <div className="text-center py-12">
            <Globe className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Découvrez des milliers d'histoires gratuites
            </h3>
            <p className="text-gray-600 mb-6">
              Utilisez la barre de recherche ci-dessus pour explorer les bibliothèques numériques 
              du monde entier et importer du contenu légalement dans votre collection.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <Book className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Project Gutenberg</h4>
                <p className="text-sm text-gray-600">
                  Plus de 60,000 ebooks gratuits, principalement des classiques de la littérature
                </p>
              </div>
              <div className="text-center">
                <Users className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Open Library</h4>
                <p className="text-sm text-gray-600">
                  Bibliothèque numérique avec des millions de livres et de documents
                </p>
              </div>
              <div className="text-center">
                <Calendar className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Wikisource</h4>
                <p className="text-sm text-gray-600">
                  Textes sources libres, documents historiques et œuvres originales
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportPage;
