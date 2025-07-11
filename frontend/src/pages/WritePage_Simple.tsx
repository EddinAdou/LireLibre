import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
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

const WritePageSimple: React.FC = () => {
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
      const response = await storyService.getStory(storyId);
      setStory(response.story);
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
        await storyService.updateStory(story.id, story);
        toast.success('Histoire mise à jour avec succès !');
      } else {
        const response = await storyService.createStory(story);
        setStory(response.story);
        navigate(`/write/${response.story.id}`, { replace: true });
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Barre d'outils */}
      <div className="border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
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
              <Button variant="outline" size="sm" className="cursor-pointer" asChild>
                <span className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Importer
                </span>
              </Button>
            </label>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={!story.content}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Exporter
            </Button>
            
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4" />
              Sauvegarder
            </Button>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Informations de base */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-black">Informations de base</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Titre *
              </label>
              <Input
                value={story.title}
                onChange={(e) => setStory(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Titre de votre histoire..."
                className="border-gray-300 focus:border-blue-500"
                style={{ direction: 'ltr' }}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Description
              </label>
              <Textarea
                value={story.description}
                onChange={(e) => setStory(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Décrivez votre histoire..."
                rows={3}
                className="border-gray-300 focus:border-blue-500 resize-none"
                style={{ direction: 'ltr' }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Éditeur de contenu */}
        <Card>
          <CardHeader>
            <CardTitle className="text-black">Contenu</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={story.content}
              onChange={(e) => setStory(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Commencez à écrire votre histoire..."
              rows={20}
              className="border-gray-300 focus:border-blue-500 resize-none font-mono"
              style={{ direction: 'ltr' }}
            />
            
            {/* Statistiques */}
            <div className="mt-4 flex gap-6 text-sm text-gray-600">
              <span>Mots: {story.content.split(/\s+/).filter(w => w.length > 0).length}</span>
              <span>Caractères: {story.content.length}</span>
              <span>Temps de lecture: ~{Math.ceil(story.content.split(/\s+/).filter(w => w.length > 0).length / 200)} min</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WritePageSimple;
