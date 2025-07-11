import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Upload, Download } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { storyService } from '../services/storyService';

interface Story {
  id?: number;
  title: string;
  description: string;
  content: string;
  status: string;
  word_count?: number;
  character_count?: number;
  reading_time?: number;
  language?: string;
}

const WritePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [story, setStory] = useState<Story>({
    title: '',
    description: '',
    content: '',
    status: 'draft'
  });

  useEffect(() => {
    if (id && id !== 'new') {
      loadStory(parseInt(id));
    }
  }, [id]);

  const loadStory = async (storyId: number) => {
    try {
      setIsLoading(true);
      const data = await storyService.getStory(storyId);
      setStory({
        id: data.id,
        title: data.title || '',
        description: data.description || '',
        content: data.content || '',
        status: data.status || 'draft',
        word_count: data.word_count,
        character_count: data.character_count,
        reading_time: data.reading_time,
        language: data.language
      });
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      toast.error('Erreur lors du chargement de l\'histoire');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!story.title.trim()) {
      toast.error('Le titre est obligatoire');
      return;
    }

    try {
      setIsLoading(true);
      
      if (story.id) {
        const updated = await storyService.updateStory({
          ...story,
          id: story.id
        });
        setStory(updated);
        toast.success('Histoire mise à jour avec succès !');
      } else {
        const created = await storyService.createStory({
          title: story.title,
          description: story.description,
          content: story.content,
          genre: 'fiction'
        });
        setStory(created);
        navigate(`/write/${created.id}`, { replace: true });
        toast.success('Histoire créée avec succès !');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setStory(prev => ({
        ...prev,
        content: content,
        title: prev.title || file.name.replace(/\.[^/.]+$/, '')
      }));
      toast.success('Fichier importé avec succès !');
    };
    reader.readAsText(file);
  };

  const handleExport = () => {
    const element = document.createElement('a');
    const file = new Blob([story.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${story.title || 'histoire'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Histoire exportée !');
  };

  const wordCount = story.content.split(/\s+/).filter(w => w.length > 0).length;
  const charCount = story.content.length;
  const readingTime = Math.ceil(wordCount / 200);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-lg text-black">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Barre d'outils */}
      <div className="border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-black rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </button>
            <h1 className="text-xl font-semibold text-black">
              {story.id ? 'Modifier l\'histoire' : 'Nouvelle histoire'}
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept=".txt,.md"
              onChange={handleImportFile}
              className="hidden"
              id="file-import"
            />
            <label htmlFor="file-import">
              <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                <Upload className="h-4 w-4" />
                Importer
              </button>
            </label>
            
            <button
              onClick={handleExport}
              disabled={!story.content}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              Exporter
            </button>
            
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              Sauvegarder
            </button>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Informations de base */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-black mb-4">Informations de base</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Titre *
              </label>
              <input
                type="text"
                value={story.title}
                onChange={(e) => setStory(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Titre de votre histoire..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                style={{ direction: 'ltr', textAlign: 'left' }}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Description
              </label>
              <textarea
                value={story.description}
                onChange={(e) => setStory(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Décrivez votre histoire..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                style={{ direction: 'ltr', textAlign: 'left' }}
              />
            </div>
          </div>
        </div>

        {/* Éditeur de contenu */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-black mb-4">Contenu</h2>
          <textarea
            value={story.content}
            onChange={(e) => setStory(prev => ({ ...prev, content: e.target.value }))}
            placeholder="Commencez à écrire votre histoire..."
            rows={20}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none font-mono"
            style={{ direction: 'ltr', textAlign: 'left' }}
          />
          
          {/* Statistiques */}
          <div className="mt-4 flex gap-6 text-sm text-gray-600">
            <span>Mots: {wordCount}</span>
            <span>Caractères: {charCount}</span>
            <span>Temps de lecture: ~{readingTime} min</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WritePage;
