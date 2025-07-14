import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  User, 
  Calendar, 
  Eye, 
  Heart, 
  Share2, 
  BookOpen,
  Edit3,
  MessageCircle
} from 'lucide-react';
import { Story } from '../types/story';
import { storiesService } from '../services/storiesService';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const StoryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (id) {
      loadStory();
    }
  }, [id]);

  const loadStory = async () => {
    try {
      setLoading(true);
      const storyData = await storiesService.getStory(id!);
      setStory(storyData);
      setLiked(false); // TODO: Vérifier si l'utilisateur a liké l'histoire
    } catch (error) {
      console.error('Erreur lors du chargement de l\'histoire:', error);
      setError('Histoire non trouvée');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error('Vous devez être connecté pour aimer une histoire');
      return;
    }
    
    try {
      // TODO: Implémenter l'API pour liker une histoire
      setLiked(!liked);
      toast.success(liked ? 'Like retiré' : 'Histoire aimée !');
    } catch (error) {
      toast.error('Erreur lors du like');
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: story?.title,
        text: story?.description,
        url: window.location.href,
      });
    } catch (error) {
      // Fallback pour les navigateurs qui ne supportent pas l'API Share
      navigator.clipboard.writeText(window.location.href);
      toast.success('Lien copié dans le presse-papiers');
    }
  };

  const calculateReadingTime = (content: string) => {
    const plainText = content.replace(/<[^>]*>/g, '');
    const wordCount = plainText.trim().split(/\s+/).length;
    return Math.ceil(wordCount / 200); // 200 mots par minute
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Histoire non trouvée</h2>
          <p className="text-gray-600 mb-6">L'histoire que vous cherchez n'existe pas ou a été supprimée.</p>
          <Link
            to="/stories"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux histoires
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Navigation */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="btn-link inline-flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </button>
      </div>

      {/* Header de l'histoire */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        {/* Image de couverture */}
        {story.coverImageUrl && (
          <div className="h-64 bg-gray-200 overflow-hidden">
            <img
              src={story.coverImageUrl}
              alt={story.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="p-6">
          {/* Catégorie et meta */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {story.category}
              </span>
              <div className="flex items-center text-sm text-gray-500 space-x-4">
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {calculateReadingTime(story.content)} min
                </span>
                <span className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  {story.views || 0} vues
                </span>
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(story.createdAt).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center space-x-2">
              {user && user.id.toString() === story.author?.id?.toString() && (
                <Link
                  to={`/stories/${story.id}/edit`}
                  className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Edit3 className="h-4 w-4 mr-1" />
                  Éditer
                </Link>
              )}
              <button
                onClick={handleLike}
                className={`btn-black-small inline-flex items-center ${
                  liked ? 'bg-red-600 hover:bg-red-700' : ''
                }`}
              >
                <Heart className={`h-4 w-4 mr-1 ${liked ? 'fill-current' : ''}`} />
                {story.likes || 0}
              </button>
              <button
                onClick={handleShare}
                className="btn-black-small inline-flex items-center"
              >
                <Share2 className="h-4 w-4 mr-1" />
                Partager
              </button>
            </div>
          </div>

          {/* Titre */}
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {story.title}
          </h1>
          
          {/* Auteur */}
          <div className="flex items-center mb-4">
            <User className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-gray-600">
              Par {story.author?.name || 'Auteur anonyme'}
            </span>
          </div>

          {/* Description */}
          {story.description && (
            <p className="text-gray-600 text-lg italic mb-6 border-l-4 border-blue-500 pl-4">
              {story.description}
            </p>
          )}

          {/* Tags */}
          {story.tags && story.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {story.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contenu de l'histoire */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center mb-6">
          <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Histoire</h2>
        </div>
        
        <div 
          className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
          style={{ 
            direction: 'ltr', 
            textAlign: 'left',
            lineHeight: '1.8'
          }}
          dangerouslySetInnerHTML={{ __html: story.content }}
        />
      </div>

      {/* Section commentaires */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-6">
          <MessageCircle className="h-5 w-5 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Commentaires</h2>
          <span className="ml-2 text-sm text-gray-500">
            (0)
          </span>
        </div>
        
        {/* TODO: Implémenter le système de commentaires */}
        <div className="text-center text-gray-500 py-8">
          <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>Système de commentaires en cours de développement</p>
        </div>
      </div>
    </div>
  );
};

export default StoryDetail;
