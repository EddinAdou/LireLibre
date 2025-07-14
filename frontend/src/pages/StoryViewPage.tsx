import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Share2, Heart, Eye, Clock, User, Calendar, BookOpen, Download } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useTheme } from '../contexts/ThemeContext';
import { Story } from '../types/story';

const StoryViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (id) {
      loadStory(id);
    }
  }, [id]);

  const loadStory = async (storyId: string) => {
    try {
      setLoading(true);
      
      // Simulation de données - remplacez par votre API
      const mockStories: Record<string, Story> = {
        '1': {
          id: '1',
          title: 'Les Aventures de Clara',
          description: 'Une jeune fille découvre un monde magique caché derrière son miroir.',
          content: `# Chapitre 1 : Le Miroir Mystérieux

Clara avait toujours trouvé son miroir étrange. Ce n'était pas sa forme ovale ni son cadre doré qui l'intriguait, mais plutôt la façon dont son reflet semblait parfois bouger indépendamment de ses propres mouvements.

Ce matin-là, alors qu'elle se brossait les cheveux devant la glace, quelque chose d'extraordinaire se produisit. Son reflet lui fit un clin d'œil.

"Impossible," murmura Clara en reculant d'un pas.

Mais son reflet, au lieu de reculer également, resta immobile et lui sourit.

## La Découverte

— "N'aie pas peur," dit le reflet d'une voix douce qui semblait venir de très loin. "Je suis toi, mais d'un autre monde."

Clara cligna des yeux plusieurs fois, certaine de rêver. Mais le reflet continua à parler :

— "Derrière ce miroir se cache un royaume où la magie existe encore. Un monde où les rêves prennent vie et où l'impossible devient possible."

Tremblante, Clara tendit la main vers la surface du miroir. Au lieu de toucher du verre froid, sa main traversa une surface liquide et argentée, comme de l'eau enchantée.

> "Parfois, il suffit de croire pour que la magie opère." - Proverbe du Royaume d'Argent

## Le Premier Pas

Sans réfléchir davantage, Clara fit un pas en avant et traversa complètement le miroir. Elle se retrouva dans un monde éblouissant où des cristaux flottants illuminaient un ciel pourpre et où des créatures fantastiques voltigeaient entre des arbres aux feuilles d'or.

* * *

Une aventure extraordinaire commençait...`,
          category: 'Fantasy',
          status: 'published',
          isPublished: true,
          createdAt: new Date('2025-07-09'),
          updatedAt: new Date('2025-07-10'),
          authorId: 'user1',
          author: { id: 'user1', name: 'TestUser' },
          tags: ['aventure', 'magie', 'fantasy', 'jeunesse'],
          views: 156,
          likes: 24,
          estimatedReadingTime: 15,
          language: 'fr',
          source: {
            type: 'user',
            license: 'CC BY-SA 4.0'
          },
          statistics: {
            wordCount: 3247,
            characterCount: 19842,
            readingTime: 15
          }
        },
        '2': {
          id: '2',
          title: 'Mystère à la Bibliothèque',
          description: 'Un bibliothécaire découvre que certains livres cachent des secrets millénaires.',
          content: `# Prologue

La vieille bibliothèque gardait ses secrets depuis des siècles. Entre ses rayonnages poussiéreux et ses volumes anciens, des mystères attendaient d'être découverts.

Théo, le nouveau bibliothécaire, ne savait pas encore qu'il était sur le point de découvrir l'un des plus grands secrets de l'humanité...`,
          category: 'Mystère',
          status: 'draft',
          isPublished: false,
          createdAt: new Date('2025-07-08'),
          updatedAt: new Date('2025-07-11'),
          authorId: 'user1',
          author: { id: 'user1', name: 'TestUser' },
          tags: ['mystère', 'livre', 'secret'],
          views: 89,
          likes: 12,
          estimatedReadingTime: 25,
          language: 'fr',
          source: {
            type: 'user',
            license: 'CC BY-SA 4.0'
          },
          statistics: {
            wordCount: 5234,
            characterCount: 31240,
            readingTime: 25
          }
        }
      };

      const foundStory = mockStories[storyId];
      if (!foundStory) {
        toast.error('Histoire introuvable');
        navigate('/stories');
        return;
      }

      setStory(foundStory);
      // Simuler l'incrémentation des vues
      setStory(prev => prev ? { ...prev, views: prev.views + 1 } : null);
      
    } catch (error) {
      console.error('Erreur lors du chargement de l\'histoire:', error);
      toast.error('Erreur lors du chargement de l\'histoire');
      navigate('/stories');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = () => {
    if (!story) return;
    
    setIsLiked(!isLiked);
    setStory(prev => {
      if (!prev) return null;
      return {
        ...prev,
        likes: isLiked ? prev.likes - 1 : prev.likes + 1
      };
    });
    
    toast.success(isLiked ? 'Like retiré' : 'Histoire ajoutée aux favoris ❤️');
  };

  const handleShare = async () => {
    if (!story) return;
    
    try {
      await navigator.share({
        title: story.title,
        text: story.description,
        url: window.location.href
      });
      toast.success('Histoire partagée avec succès');
    } catch (error) {
      // Fallback pour les navigateurs qui ne supportent pas l'API Share
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Lien copié dans le presse-papiers');
    }
  };

  const handleExport = () => {
    if (!story) return;
    
    const element = document.createElement('a');
    const file = new Blob([`# ${story.title}\n\n${story.description}\n\n${story.content}`], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${story.title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Histoire exportée !');
  };

  const formatContentForDisplay = (content: string) => {
    return content
      // Titres
      .replace(/^#### (.*$)/gim, '<h4 class="text-lg font-semibold mt-6 mb-3 text-red-600 dark:text-red-400">$1</h4>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-8 mb-4 text-green-600 dark:text-green-400">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold mt-10 mb-6 text-purple-600 dark:text-purple-400">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-12 mb-8 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 pb-3">$1</h1>')
      // Formatage
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-gray-100">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-gray-800 dark:text-gray-200">$1</em>')
      .replace(/__(.*?)__/g, '<u class="underline">$1</u>')
      // Citations
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-700 dark:text-gray-300 my-4">$1</blockquote>')
      // Séparateurs
      .replace(/^\* \* \*$/gim, '<hr class="my-8 border-t-2 border-gray-200 dark:border-gray-700">')
      // Sauts de ligne
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br>');
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Chargement de l'histoire...</p>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <h1 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Histoire introuvable
          </h1>
          <button
            onClick={() => navigate('/stories')}
            className="btn-black-large"
          >
            Retour aux histoires
          </button>
        </div>
      </div>
    );
  }

  const themeClasses = isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900';
  const cardClasses = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';

  return (
    <div className={`min-h-screen ${themeClasses}`}>
      {/* En-tête */}
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-50 backdrop-blur-sm`}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/stories')}
              className="btn-black flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour aux histoires
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={handleLike}
                className={`btn-black flex items-center gap-2 ${
                  isLiked ? 'bg-red-600 hover:bg-red-700' : ''
                }`}
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                {story.likes}
              </button>

              <button
                onClick={handleShare}
                className="btn-black flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                Partager
              </button>

              <button
                onClick={handleExport}
                className="btn-black flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Exporter
              </button>

              <button
                onClick={() => navigate(`/write/${story.id}`)}
                className="btn-black flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Modifier
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Informations de l'histoire */}
        <div className={`${cardClasses} rounded-xl p-8 mb-8 shadow-sm border`}>
          <div className="mb-6">
            <h1 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {story.title}
            </h1>
            
            {story.description && (
              <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-6 leading-relaxed`}>
                {story.description}
              </p>
            )}

            {/* Métadonnées */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-blue-500" />
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  Par {story.author.name}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-green-500" />
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  {story.createdAt.toLocaleDateString('fr-FR')}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-500" />
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  ~{story.estimatedReadingTime} min de lecture
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-orange-500" />
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  {story.views} vues
                </span>
              </div>
            </div>

            {/* Tags */}
            {story.tags && story.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {story.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-sm ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Statistiques */}
            <div className={`mt-6 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-500" />
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                    {story.statistics?.wordCount?.toLocaleString()} mots
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">📝</span>
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                    {story.statistics?.characterCount?.toLocaleString()} caractères
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">📂</span>
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                    {story.category}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu de l'histoire */}
        <div className={`${cardClasses} rounded-xl p-8 shadow-sm border`}>
          <div 
            className={`prose max-w-none ${isDarkMode ? 'prose-invert' : ''} text-lg leading-relaxed`}
            style={{ 
              fontFamily: '"Georgia", "Times New Roman", serif',
              lineHeight: '1.8'
            }}
            dangerouslySetInnerHTML={{ 
              __html: '<p class="mb-4">' + formatContentForDisplay(story.content) + '</p>'
            }}
          />
        </div>

        {/* Actions en bas */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={handleLike}
            className={`btn-black-large flex items-center gap-2 ${
              isLiked ? 'bg-red-600 hover:bg-red-700' : ''
            }`}
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
            {isLiked ? 'Aimé' : 'Aimer'} ({story.likes})
          </button>

          <button
            onClick={handleShare}
            className="btn-black-large flex items-center gap-2"
          >
            <Share2 className="h-5 w-5" />
            Partager cette histoire
          </button>

          <button
            onClick={() => navigate('/stories')}
            className="btn-black-large flex items-center gap-2"
          >
            <BookOpen className="h-5 w-5" />
            Découvrir d'autres histoires
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryViewPage;
