/**
 * StoriesPage - Page principale pour les histoires
 * Affichage, écriture, lecture et import d'histoires
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Plus, Search, Filter, Download, Edit, Eye, Trash2 } from 'lucide-react';
import { Story, StoryFilters, StoryCategory } from '../types/story';
import { storiesService } from '../services/storiesService';

const StoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<StoryFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<StoryCategory | 'Tout'>('Tout');
  const [showFilters, setShowFilters] = useState(false);

  // Charger les histoires
  useEffect(() => {
    loadStories();
  }, [filters]);

  const loadStories = async () => {
    try {
      setLoading(true);
      const response = await storiesService.getStories(filters);
      setStories(response.stories);
    } catch (error) {
      console.error('Erreur lors du chargement des histoires:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setFilters({
      ...filters,
      search: searchTerm,
      category: selectedCategory !== 'Tout' ? selectedCategory : undefined,
    });
  };

  const handleDeleteStory = async (storyId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette histoire ?')) {
      try {
        await storiesService.deleteStory(storyId);
        loadStories();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const categories: (StoryCategory | 'Tout')[] = [
    'Tout', 'Fiction', 'Non-fiction', 'Poésie', 'Théâtre', 'Science-fiction',
    'Fantasy', 'Romance', 'Mystère', 'Horreur', 'Biographie', 'Histoire',
    'Philosophie', 'Autre'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center mb-4 sm:mb-0">
              <Book className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Mes Histoires</h1>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => navigate('/stories/write')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Écrire une histoire
              </button>
              <button
                onClick={() => navigate('/stories/import')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <Download className="h-5 w-5 mr-2" />
                Importer
              </button>
            </div>
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Rechercher dans vos histoires..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as StoryCategory | 'Tout')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Search className="h-5 w-5 mr-2" />
              Rechercher
            </button>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filtres
            </button>
          </div>

          {/* Filtres avancés */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Langue
                  </label>
                  <select
                    value={filters.language || ''}
                    onChange={(e) => setFilters({ ...filters, language: e.target.value || undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Toutes les langues</option>
                    <option value="fr">Français</option>
                    <option value="en">Anglais</option>
                    <option value="es">Espagnol</option>
                    <option value="de">Allemand</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trier par
                  </label>
                  <select
                    value={filters.sortBy || 'createdAt'}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="createdAt">Date de création</option>
                    <option value="updatedAt">Dernière modification</option>
                    <option value="title">Titre</option>
                    <option value="views">Vues</option>
                    <option value="likes">J'aime</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ordre
                  </label>
                  <select
                    value={filters.sortOrder || 'desc'}
                    onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value as 'asc' | 'desc' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="desc">Décroissant</option>
                    <option value="asc">Croissant</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Liste des histoires */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des histoires...</p>
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-12">
            <Book className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Aucune histoire trouvée</h3>
            <p className="text-gray-600 mb-6">
              Commencez par écrire votre première histoire ou importez du contenu existant.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigate('/stories/write')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Écrire une histoire
              </button>
              <button
                onClick={() => navigate('/stories/import')}
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
              >
                <Download className="h-5 w-5 mr-2" />
                Importer du contenu
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <div key={story.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {story.coverImageUrl && (
                  <img
                    src={story.coverImageUrl}
                    alt={story.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {story.title}
                    </h3>
                    <div className="flex space-x-1 ml-2">
                      <button
                        onClick={() => navigate(`/stories/${story.id}`)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Lire"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => navigate(`/stories/${story.id}/edit`)}
                        className="text-yellow-600 hover:text-yellow-800 p-1"
                        title="Modifier"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteStory(story.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {story.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>{story.category}</span>
                    <span>{story.language?.toUpperCase()}</span>
                  </div>
                  
                  {story.tags && story.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {story.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {story.tags.length > 3 && (
                        <span className="text-gray-400 text-xs">+{story.tags.length - 3}</span>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                      {story.statistics?.wordCount || 0} mots
                    </span>
                    <span>
                      {new Date(story.updatedAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  
                  {!story.isPublished && (
                    <div className="mt-2">
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                        Brouillon
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoriesPage;
