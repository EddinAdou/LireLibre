/**
 * SearchPage - Page de recherche publique des histoires
 * Permet de rechercher et découvrir toutes les histoires publiées
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Filter, Book, User, Calendar, Tag, Eye } from 'lucide-react';
import { Story, StoryFilters, StoryCategory } from '../types/story';
import { storiesService } from '../services/storiesService';
import { toast } from 'react-hot-toast';

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState<StoryCategory | 'Tout'>('Tout');
  const [showFilters, setShowFilters] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  // Categories disponibles
  const categories: (StoryCategory | 'Tout')[] = [
    'Tout', 'Fiction', 'Non-fiction', 'Poésie', 'Théâtre', 'Science-fiction',
    'Fantasy', 'Romance', 'Mystère', 'Horreur', 'Biographie', 'Histoire',
    'Philosophie', 'Autre'
  ];

  // Recherche automatique
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      searchStories();
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, selectedCategory]);

  // Charger depuis URL
  useEffect(() => {
    const q = searchParams.get('q');
    const category = searchParams.get('category') as StoryCategory;
    
    if (q) setSearchTerm(q);
    if (category) setSelectedCategory(category);
  }, [searchParams]);

  const searchStories = async () => {
    try {
      setLoading(true);
      
      const filters: StoryFilters = {
        status: 'published', // Seulement les histoires publiées
        search: searchTerm || undefined,
        category: selectedCategory !== 'Tout' ? selectedCategory : undefined,
        limit: 20
      };

      const response = await storiesService.getStories(filters);
      setStories(response.stories);
      setTotalResults(response.total);

      // Mettre à jour l'URL
      const newSearchParams = new URLSearchParams();
      if (searchTerm) newSearchParams.set('q', searchTerm);
      if (selectedCategory !== 'Tout') newSearchParams.set('category', selectedCategory);
      setSearchParams(newSearchParams);
      
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      toast.error('Erreur lors de la recherche des histoires');
    } finally {
      setLoading(false);
    }
  };

  const handleStoryClick = (story: Story) => {
    navigate(`/stories/${story.id}`);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSelectedCategory('Tout');
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Découvrez des histoires incroyables
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explorez notre collection d'histoires écrites par notre communauté d'auteurs talentueux
          </p>
        </div>

        {/* Barre de recherche principale */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
                <input
                  type="text"
                  placeholder="Rechercher des histoires, auteurs, mots-clés..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as StoryCategory | 'Tout')}
              className="px-4 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="border border-gray-300 text-gray-700 px-6 py-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filtres
            </button>
          </div>

          {/* Filtres avancés */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longueur
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="">Toutes</option>
                    <option value="short">Court (moins de 1000 mots)</option>
                    <option value="medium">Moyen (1000-5000 mots)</option>
                    <option value="long">Long (plus de 5000 mots)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Langue
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="">Toutes</option>
                    <option value="fr">Français</option>
                    <option value="en">Anglais</option>
                    <option value="es">Espagnol</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de publication
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="">Toutes</option>
                    <option value="week">Cette semaine</option>
                    <option value="month">Ce mois</option>
                    <option value="year">Cette année</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Résultats */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {loading ? 'Recherche en cours...' : 
                searchTerm || selectedCategory !== 'Tout' ? 
                  `${totalResults} résultat${totalResults !== 1 ? 's' : ''} trouvé${totalResults !== 1 ? 's' : ''}` :
                  'Histoires populaires'
              }
            </h2>
            {(searchTerm || selectedCategory !== 'Tout') && (
              <button
                onClick={clearSearch}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Effacer la recherche
              </button>
            )}
          </div>
          
          {(searchTerm || selectedCategory !== 'Tout') && (
            <p className="text-gray-600 mt-2">
              {searchTerm && `Recherche pour "${searchTerm}"`}
              {searchTerm && selectedCategory !== 'Tout' && ' • '}
              {selectedCategory !== 'Tout' && `Catégorie: ${selectedCategory}`}
            </p>
          )}
        </div>

        {/* Liste des histoires */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="flex space-x-2 mb-4">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : stories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <div
                key={story.id}
                onClick={() => handleStoryClick(story)}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer p-6 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {story.title}
                  </h3>
                  <Book className="h-5 w-5 text-gray-400 flex-shrink-0 ml-2" />
                </div>
                
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                  {story.description || story.content?.substring(0, 150) + '...'}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <span>{story.author?.name || 'Anonyme'}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{new Date(story.createdAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
                
                {story.tags && story.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {story.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs flex items-center"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                    {story.tags.length > 3 && (
                      <span className="text-gray-400 text-xs">+{story.tags.length - 3}</span>
                    )}
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                    {story.category}
                  </span>
                  <div className="flex items-center text-gray-500 text-xs">
                    <Eye className="h-4 w-4 mr-1" />
                    <span>{story.statistics?.wordCount || 0} mots</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Book className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Aucune histoire trouvée
            </h3>
            <p className="text-gray-600">
              {searchTerm || selectedCategory !== 'Tout' 
                ? "Essayez de modifier vos critères de recherche" 
                : "Aucune histoire publiée pour le moment"
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
