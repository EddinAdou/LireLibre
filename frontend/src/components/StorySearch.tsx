import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';

interface SearchFilters {
  query: string;
  genre: string;
  status: string;
  sortBy: string;
}

interface Story {
  id: number;
  title: string;
  description: string;
  genre: string;
  status: string;
  author: string;
  createdAt: string;
  views: number;
  likes: number;
}

const StorySearch: React.FC = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    genre: '',
    status: '',
    sortBy: 'recent'
  });
  
  const [results, setResults] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Simuler une recherche avec debounce
  useEffect(() => {
    const searchTimer = setTimeout(() => {
      if (filters.query.length > 2 || filters.genre || filters.status) {
        performSearch();
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(searchTimer);
  }, [filters]);

  const performSearch = async () => {
    setIsLoading(true);
    
    // Simulation d'appel API
    try {
      // TODO: Remplacer par un vrai appel API
      const mockResults: Story[] = [
        {
          id: 1,
          title: "Le Mystère de la Bibliothèque Enchantée",
          description: "Une aventure magique dans une bibliothèque où les livres prennent vie...",
          genre: "Fantastique",
          status: "En cours",
          author: "Marie Dubois",
          createdAt: "2025-01-10",
          views: 1250,
          likes: 89
        },
        {
          id: 2,
          title: "Voyage à Travers les Étoiles",
          description: "Une épopée spatiale collaborative qui vous emmènera aux confins de l'univers...",
          genre: "Science-Fiction",
          status: "Terminée",
          author: "Jean Martin",
          createdAt: "2025-01-05",
          views: 2100,
          likes: 156
        }
      ];

      // Filtrer selon les critères
      let filteredResults = mockResults;
      
      if (filters.query) {
        filteredResults = filteredResults.filter(story =>
          story.title.toLowerCase().includes(filters.query.toLowerCase()) ||
          story.description.toLowerCase().includes(filters.query.toLowerCase())
        );
      }
      
      if (filters.genre) {
        filteredResults = filteredResults.filter(story => story.genre === filters.genre);
      }
      
      if (filters.status) {
        filteredResults = filteredResults.filter(story => story.status === filters.status);
      }

      // Trier les résultats
      switch (filters.sortBy) {
        case 'popular':
          filteredResults.sort((a, b) => b.likes - a.likes);
          break;
        case 'views':
          filteredResults.sort((a, b) => b.views - a.views);
          break;
        case 'recent':
        default:
          filteredResults.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }

      setResults(filteredResults);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      genre: '',
      status: '',
      sortBy: 'recent'
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-manrope">
      {/* Barre de recherche principale */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Rechercher des histoires..."
            value={filters.query}
            onChange={(e) => setFilters({...filters, query: e.target.value})}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-manrope"
          />
        </div>
      </div>

      {/* Filtres et tri */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-manrope font-medium"
        >
          <Filter className="h-4 w-4" />
          Filtres
        </button>

        <select
          value={filters.sortBy}
          onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-manrope"
        >
          <option value="recent">Plus récentes</option>
          <option value="popular">Plus populaires</option>
          <option value="views">Plus vues</option>
        </select>

        {(filters.genre || filters.status) && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 font-manrope"
          >
            <X className="h-4 w-4" />
            Effacer
          </button>
        )}
      </div>

      {/* Panneau de filtres avancés */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-manrope">
                Genre
              </label>
              <select
                value={filters.genre}
                onChange={(e) => setFilters({...filters, genre: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-manrope"
              >
                <option value="">Tous les genres</option>
                <option value="Fantastique">Fantastique</option>
                <option value="Science-Fiction">Science-Fiction</option>
                <option value="Romance">Romance</option>
                <option value="Thriller">Thriller</option>
                <option value="Historique">Historique</option>
                <option value="Aventure">Aventure</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-manrope">
                Statut
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-manrope"
              >
                <option value="">Tous les statuts</option>
                <option value="En cours">En cours</option>
                <option value="Terminée">Terminée</option>
                <option value="En pause">En pause</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Résultats de recherche */}
      <div>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600 font-manrope">Recherche en cours...</p>
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-4">
            <p className="text-gray-600 font-manrope">
              {results.length} histoire(s) trouvée(s)
            </p>
            
            {results.map((story) => (
              <div key={story.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-900 font-manrope">
                    {story.title}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium font-manrope ${
                    story.status === 'Terminée' ? 'bg-green-100 text-green-800' :
                    story.status === 'En cours' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {story.status}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4 font-manrope">
                  {story.description}
                </p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 font-manrope">
                  <span>Par {story.author}</span>
                  <span>•</span>
                  <span>{story.genre}</span>
                  <span>•</span>
                  <span>{story.views} vues</span>
                  <span>•</span>
                  <span>{story.likes} ❤️</span>
                </div>
                
                <div className="mt-4 flex gap-3">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-manrope font-medium">
                    Lire
                  </button>
                  <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 font-manrope font-medium">
                    Favoris
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : filters.query.length > 2 || filters.genre || filters.status ? (
          <div className="text-center py-8">
            <p className="text-gray-600 font-manrope">Aucune histoire trouvée pour ces critères.</p>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 font-manrope">
              Commencez à taper pour rechercher des histoires...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StorySearch;
