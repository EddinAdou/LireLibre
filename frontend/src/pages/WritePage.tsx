/**
 * WritePage - Page d'écriture et d'édition d'histoires
 * Utilise le RichTextEditor avec sauvegarde automatique
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Eye, Settings, Image, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import { Story, StoryCategory, CreateStoryRequest, UpdateStoryRequest } from '../types/story';
import { storiesService } from '../services/storiesService';
import AdvancedRichTextEditor from '../components/editor/AdvancedRichTextEditor';
import StoryPreview from '../components/StoryPreview';
import TestDescriptionField from '../components/TestDescriptionField';

const WritePage: React.FC = () => {
  const { storyId } = useParams<{ storyId?: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(storyId);

  const [story, setStory] = useState<Story | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<StoryCategory>('Fiction');
  const [tags, setTags] = useState<string[]>([]);
  const [isPublished, setIsPublished] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const categories: StoryCategory[] = [
    'Fiction', 'Non-fiction', 'Poésie', 'Théâtre', 'Science-fiction',
    'Fantasy', 'Romance', 'Mystère', 'Horreur', 'Biographie', 'Histoire',
    'Philosophie', 'Autre'
  ];

  // Charger l'histoire en mode édition
  useEffect(() => {
    if (isEditing && storyId) {
      loadStory();
    }
  }, [isEditing, storyId]);

  const loadStory = async () => {
    try {
      setLoading(true);
      const storyData = await storiesService.getStory(storyId!);
      setStory(storyData);
      setTitle(storyData.title);
      setDescription(storyData.description);
      setContent(storyData.content);
      setCategory(storyData.category);
      setTags(storyData.tags);
      setIsPublished(storyData.isPublished);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'histoire:', error);
      navigate('/stories');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (isDraft = true) => {
    try {
      setSaving(true);

      const storyData = {
        title: title || 'Histoire sans titre',
        description,
        content,
        category,
        tags,
        isPublished: !isDraft, // Publier si ce n'est pas un brouillon
        ...(coverImage && { coverImage }),
      };

      if (isEditing && storyId) {
        const updateData: UpdateStoryRequest = {
          id: storyId,
          ...storyData,
        };
        await storiesService.updateStory(updateData);
        
        // Rediriger vers la page des histoires après publication
        if (!isDraft) {
          navigate('/stories');
        }
      } else {
        const createData: CreateStoryRequest = storyData;
        const newStory = await storiesService.createStory(createData);
        
        // Rediriger après création
        if (isDraft) {
          navigate(`/stories/${newStory.id}/edit`);
        } else {
          navigate('/stories');
        }
      }

      // Afficher une notification de succès
      if (isDraft) {
        toast.success('Brouillon sauvegardé avec succès');
      } else {
        toast.success('Histoire publiée avec succès !');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error(`Erreur lors de la ${isDraft ? 'sauvegarde' : 'publication'}`);
    } finally {
      setSaving(false);
    }
  };

  // Sauvegarde automatique
  const handleAutoSave = async (content: string) => {
    // Sauvegarder seulement si on est en mode édition
    if (isEditing && storyId && title) {
      try {
        const storyData = {
          title,
          description,
          content,
          category,
          tags,
          isPublished: false // Auto-save comme brouillon
        };

        const updateData: UpdateStoryRequest = {
          id: storyId,
          ...storyData,
        };
        
        await storiesService.updateStory(updateData);
        toast.success('Auto-sauvegarde réussie', {
          duration: 2000,
          position: 'bottom-right'
        });
      } catch (error) {
        console.error('Erreur lors de l\'auto-sauvegarde:', error);
      }
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCoverImage(file);
    }
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      setTags([...tags, tag.trim()]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addTag(event.currentTarget.value);
      event.currentTarget.value = '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Composant de test pour diagnostiquer le problème */}
      <TestDescriptionField />
      
      {/* Barre d'outils supérieure */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
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
                {isEditing ? 'Modifier l\'histoire' : 'Nouvelle histoire'}
              </h1>
              {saving && (
                <span className="ml-3 text-sm text-blue-600">Sauvegarde...</span>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`p-2 rounded-lg transition-colors ${
                  showPreview 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                title="Aperçu"
              >
                <Eye className="h-5 w-5" />
              </button>
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="text-gray-500 hover:text-gray-700 p-2"
                title="Paramètres"
              >
                <Settings className="h-5 w-5" />
              </button>
              
              <button
                onClick={() => handleSave(true)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
                disabled={saving}
              >
                <Save className="h-4 w-4 mr-2" />
                Brouillon
              </button>

              <button
                onClick={() => handleSave(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                disabled={saving}
              >
                <Eye className="h-4 w-4 mr-2" />
                Publier
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Zone d'écriture principale */}
          <div className="lg:col-span-3">
            {/* Carte titre et description */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="p-6">
                {/* Titre */}
                <div className="mb-6">
                  <label htmlFor="story-title" className="block text-sm font-medium text-gray-700 mb-2">
                    Titre de l'histoire
                  </label>
                  <input
                    id="story-title"
                    type="text"
                    placeholder="Titre de votre histoire..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-2xl font-bold text-gray-900 placeholder-gray-400 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{
                      direction: 'ltr',
                      textAlign: 'left',
                      pointerEvents: 'auto'
                    }}
                    dir="ltr"
                    autoComplete="off"
                  />
                </div>

                {/* Description */}
                <div className="mb-0">
                  <label htmlFor="story-description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description de l'histoire
                  </label>
                  <textarea
                    id="story-description"
                    placeholder="Brève description de votre histoire... Décrivez l'intrigue, les personnages principaux, l'ambiance..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onFocus={(e) => {
                      console.log('Description field focused');
                      const target = e.target as HTMLTextAreaElement;
                      target.style.direction = 'ltr';
                      target.style.textAlign = 'left';
                    }}
                    onClick={(e) => {
                      console.log('Description field clicked');
                      const target = e.target as HTMLTextAreaElement;
                      target.focus();
                    }}
                    rows={4}
                    className="w-full text-gray-700 placeholder-gray-400 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                    style={{
                      direction: 'ltr',
                      textAlign: 'left',
                      pointerEvents: 'auto',
                      zIndex: 10,
                      cursor: 'text',
                      position: 'relative'
                    }}
                    dir="ltr"
                    autoComplete="off"
                    spellCheck="false"
                  />
                </div>
              </div>
            </div>

            {/* Carte éditeur de contenu */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contenu de l'histoire
                  </label>
                </div>

                {/* Éditeur de contenu ou Aperçu */}
                {showPreview ? (
                  <StoryPreview
                    title={title}
                    description={description}
                    content={content}
                    category={category}
                    tags={tags}
                    coverImage={coverImage || undefined}
                    coverImageUrl={story?.coverImageUrl}
                  />
                ) : (
                  <AdvancedRichTextEditor
                    value={content}
                    onChange={setContent}
                    placeholder="Commencez à écrire votre histoire... Utilisez la barre d'outils pour ajouter des chapitres, sous-titres et formatage."
                    className="w-full"
                    minHeight="500px"
                    autoSave={true}
                    onAutoSave={handleAutoSave}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Panneau latéral - Paramètres */}
          <div className={`lg:col-span-1 ${showSettings ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Paramètres</h3>

              {/* Catégorie */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as StoryCategory)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Tag className="h-4 w-4 inline mr-1" />
                  Mots-clés
                </label>
                <input
                  type="text"
                  placeholder="Ajouter un mot-clé (Entrée)"
                  onKeyPress={handleTagKeyPress}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                />
                <div className="flex flex-wrap gap-1">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs flex items-center"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Image de couverture */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Image className="h-4 w-4 inline mr-1" />
                  Image de couverture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {(coverImage || story?.coverImageUrl) && (
                  <div className="mt-2">
                    <img
                      src={coverImage ? URL.createObjectURL(coverImage) : story?.coverImageUrl}
                      alt="Aperçu"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              {/* Statut de publication */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                  />
                  <span className="text-sm text-gray-700">Publier immédiatement</span>
                </label>
              </div>

              {/* Statistiques (mode édition) */}
              {story && (
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Statistiques</h4>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div>Mots: {story.statistics?.wordCount || 0}</div>
                    <div>Vues: {story.views}</div>
                    <div>J'aime: {story.likes}</div>
                    <div>Créé: {new Date(story.createdAt).toLocaleDateString('fr-FR')}</div>
                    <div>Modifié: {new Date(story.updatedAt).toLocaleDateString('fr-FR')}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Styles CSS pour s'assurer que les champs de texte sont interactifs */}
      <style>{`
        input[type="text"], textarea {
          pointer-events: auto !important;
          user-select: text !important;
          -webkit-user-select: text !important;
          -moz-user-select: text !important;
          -ms-user-select: text !important;
          cursor: text !important;
          touch-action: manipulation !important;
        }
        
        input[type="text"]:focus, textarea:focus {
          outline: 2px solid #3b82f6 !important;
          outline-offset: 2px !important;
        }
        
        /* Force la direction LTR pour les champs de saisie */
        input[type="text"], textarea {
          direction: ltr !important;
          text-align: left !important;
          unicode-bidi: bidi-override !important;
        }
        
        /* S'assurer que les labels sont cliquables */
        label {
          cursor: pointer !important;
        }
      `}</style>
    </div>
  );
};

export default WritePage;
