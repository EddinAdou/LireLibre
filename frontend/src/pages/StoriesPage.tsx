/**
 * StoriesPage - Page principale pour les histoires
 * Affichage, écriture, lecture et import d'histoires
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Plus, Search, Filter, Download, Edit, Eye, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
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

  // Recherche en temps réel
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchTerm !== filters.search) {
        setFilters({
          ...filters,
          search: searchTerm || undefined,
        });
      }
    }, 500); // Délai de 500ms pour éviter trop de requêtes

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  // Auto-filtrage par catégorie
  useEffect(() => {
    if (selectedCategory !== 'Tout') {
      setFilters({
        ...filters,
        category: selectedCategory,
      });
    } else {
      const { category, ...filtersWithoutCategory } = filters;
      setFilters(filtersWithoutCategory);
    }
  }, [selectedCategory]);

  const loadStories = async () => {
    try {
      setLoading(true);
      // Simulation de données pour le développement
      const mockStories: Story[] = [
        {
          id: '1',
          title: 'Les Aventures de Clara',
          description: 'Une jeune fille découvre un monde magique caché derrière son miroir.',
          content: '# Chapitre 1\n\nClara avait toujours trouvé son miroir étrange...',
          category: 'Fantasy',
          status: 'published',
          isPublished: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          authorId: 'user1',
          author: { id: 'user1', name: 'TestUser' },
          tags: ['aventure', 'magie'],
          views: 150,
          likes: 23,
          estimatedReadingTime: 15,
          language: 'fr',
          source: {
            type: 'user',
            license: 'CC BY-SA 4.0'
          },
          statistics: {
            wordCount: 3000,
            characterCount: 18000,
            readingTime: 15
          }
        },
        {
          id: '2',
          title: 'Mystère à la Bibliothèque',
          description: 'Un bibliothécaire découvre que certains livres cachent des secrets millénaires.',
          content: '# Prologue\n\nLa vieille bibliothèque gardait ses secrets...',
          category: 'Mystère',
          status: 'draft',
          isPublished: false,
          createdAt: new Date(Date.now() - 86400000), // Hier
          updatedAt: new Date(Date.now() - 3600000), // Il y a 1h
          authorId: 'user1',
          author: { id: 'user1', name: 'TestUser' },
          tags: ['mystère', 'livre'],
          views: 89,
          likes: 12,
          estimatedReadingTime: 25,
          language: 'fr',
          source: {
            type: 'user',
            license: 'CC BY-SA 4.0'
          },
          statistics: {
            wordCount: 5000,
            characterCount: 30000,
            readingTime: 25
          }
        },
        {
          id: '3',
          title: 'Le Voyage Spatial',
          description: 'Une équipe d\'explorateurs découvre une planète habitée par une civilisation avancée.',
          content: '# Mission Alpha\n\nLe vaisseau spatial fendit l\'espace...',
          category: 'Science-fiction',
          status: 'published',
          isPublished: true,
          createdAt: new Date(Date.now() - 172800000), // Il y a 2 jours
          updatedAt: new Date(Date.now() - 7200000), // Il y a 2h
          authorId: 'user1',
          author: { id: 'user1', name: 'TestUser' },
          tags: ['espace', 'futur'],
          views: 234,
          likes: 45,
          estimatedReadingTime: 40,
          language: 'fr',
          source: {
            type: 'user',
            license: 'CC BY-SA 4.0'
          },
          statistics: {
            wordCount: 8000,
            characterCount: 48000,
            readingTime: 40
          }
        }
      ];

      // Filtrer selon les critères
      let filteredStories = mockStories;
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredStories = filteredStories.filter(story => 
          story.title.toLowerCase().includes(searchLower) ||
          story.description.toLowerCase().includes(searchLower) ||
          story.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }
      
      if (filters.category && filters.category !== 'Tout') {
        filteredStories = filteredStories.filter(story => story.category === filters.category);
      }
      
      if (filters.status) {
        filteredStories = filteredStories.filter(story => story.status === filters.status);
      }

      setStories(filteredStories);
    } catch (error) {
      console.error('Erreur lors du chargement des histoires:', error);
      toast.error('Erreur lors du chargement des histoires');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setFilters({
      ...filters,
      search: searchTerm || undefined,
      category: selectedCategory !== 'Tout' ? selectedCategory : undefined,
    });
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSelectedCategory('Tout');
    setFilters({});
  };

  const handleDeleteStory = async (storyId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette histoire ?')) {
      try {
        // Simuler la suppression en supprimant de la liste locale
        setStories(prev => prev.filter(story => story.id !== storyId));
        toast.success('Histoire supprimée avec succès');
      } catch (error: any) {
        console.error('Erreur lors de la suppression:', error);
        toast.error('Erreur lors de la suppression de l\'histoire');
      }
    }
  };

  const handleViewStory = (storyId: string) => {
    const story = stories.find(s => s.id === storyId);
    if (!story) {
      toast.error('Histoire introuvable');
      return;
    }
    
    // Naviguer vers la page de lecture/consultation
    navigate(`/story/${storyId}`);
  };

  const handleEditStory = (storyId: string) => {
    const story = stories.find(s => s.id === storyId);
    if (!story) {
      toast.error('Histoire introuvable');
      return;
    }
    
    // Naviguer vers l'éditeur
    navigate(`/write/${storyId}`);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        return diffMinutes <= 0 ? 'À l\'instant' : `Il y a ${diffMinutes} min`;
      }
      return `Il y a ${diffHours}h`;
    } else if (diffDays === 1) {
      return 'Hier';
    } else if (diffDays < 7) {
      return `Il y a ${diffDays} jours`;
    } else {
      return date.toLocaleDateString('fr-FR');
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
                className="btn-black flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Écrire une histoire
              </button>
              <button
                onClick={() => navigate('/stories/import')}
                className="btn-black flex items-center"
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
                  className="input-white w-full pl-10 pr-4"
                />
              </div>
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as StoryCategory | 'Tout')}
              className="select-white"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <button
              onClick={handleSearch}
              className="btn-black-large flex items-center"
            >
              <Search className="h-5 w-5 mr-2" />
              Rechercher
            </button>

            {(searchTerm || selectedCategory !== 'Tout') && (
              <button
                onClick={clearSearch}
                className="btn-black"
              >
                Effacer
              </button>
            )}

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-black flex items-center"
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

        {/* Résultats de recherche */}
        {(filters.search || filters.category) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-blue-900">
                  Résultats de recherche
                </h3>
                <p className="text-blue-700">
                  {loading ? 'Recherche en cours...' : `${stories.length} histoire(s) trouvée(s)`}
                  {filters.search && ` pour "${filters.search}"`}
                  {filters.category && ` dans la catégorie "${filters.category}"`}
                </p>
              </div>
              <button
                onClick={clearSearch}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Voir toutes les histoires
              </button>
            </div>
          </div>
        )}

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
                className="btn-black-large flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Écrire une histoire
              </button>
              <button
                onClick={() => navigate('/stories/import')}
                className="btn-black-large flex items-center"
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
                        onClick={() => handleViewStory(story.id)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Consulter l'histoire"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditStory(story.id)}
                        className="text-yellow-600 hover:text-yellow-800 p-1"
                        title="Modifier l'histoire"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteStory(story.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Supprimer l'histoire"
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
                      📝 {story.statistics?.wordCount?.toLocaleString() || 0} mots
                    </span>
                    <span>
                      📅 {formatDate(story.updatedAt)}
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
