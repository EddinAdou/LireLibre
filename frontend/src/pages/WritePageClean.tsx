import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Upload, Download, Moon, Sun, Maximize2, Minimize2, Send, Eye, BookOpen, Type, AlignLeft, Bold, Italic, List, Hash, Underline, Heading1, Heading2, Heading3 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useTheme } from '../contexts/ThemeContext';

interface SimpleStory {
  id?: number;
  title: string;
  description: string;
  content: string;
  status: string;
  isPublished?: boolean;
}

const WritePageClean: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode, isFullScreen, toggleFullScreen } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showWritingTools, setShowWritingTools] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [story, setStory] = useState<SimpleStory>({
    title: '',
    description: '',
    content: '',
    status: 'draft',
    isPublished: false
  });

  useEffect(() => {
    if (id && id !== 'new') {
      // Simulation du chargement - remplacez par votre API
      setStory({
        id: parseInt(id),
        title: 'Histoire test',
        description: 'Description test',
        content: 'Contenu test',
        status: 'draft',
        isPublished: false
      });
    }
  }, [id]);

  const handleSave = async () => {
    if (!story.title.trim()) {
      toast.error('Le titre est obligatoire');
      return;
    }

    try {
      setIsLoading(true);
      
      // Préparer les données à envoyer
      const storyData = {
        title: story.title,
        description: story.description,
        content: story.content,
        status: story.status,
        isPublished: story.isPublished || false
      };

      // Simulation de sauvegarde - remplacez par votre API
      console.log('Sauvegarde:', storyData);
      
      // Ici vous pouvez appeler votre API backend
      // await storyService.createOrUpdateStory(storyData);
      
      toast.success('Histoire sauvegardée avec succès !');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!story.title.trim() || !story.content.trim()) {
      toast.error('Le titre et le contenu sont obligatoires pour publier');
      return;
    }

    try {
      setIsPublishing(true);
      // Simulation de publication - remplacez par votre API
      const updatedStory = {
        ...story,
        status: story.isPublished ? 'draft' : 'published',
        isPublished: !story.isPublished
      };
      setStory(updatedStory);
      console.log('Publication:', updatedStory);
      
      toast.success(story.isPublished ? 'Histoire dépubliée !' : 'Histoire publiée avec succès !');
    } catch (error) {
      console.error('Erreur lors de la publication:', error);
      toast.error('Erreur lors de la publication');
    } finally {
      setIsPublishing(false);
    }
  };

  // Fonction pour formater le contenu pour l'aperçu
  const formatContentForPreview = (content: string) => {
    return content
      // Titres
      .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Formatage
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/__(.*?)__/g, '<u>$1</u>')
      // Citations
      .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
      // Séparateurs
      .replace(/^\* \* \*$/gim, '<hr style="margin: 30px 0; border: none; border-top: 2px solid #e5e7eb;">')
      // Sauts de ligne
      .replace(/\n/g, '<br>');
  };

  // Outils d'aide à l'écriture
  const insertText = (textToInsert: string) => {
    const textarea = document.querySelector('textarea[data-content-editor="true"]') as HTMLTextAreaElement;
    if (!textarea) {
      console.error('Textarea introuvable');
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentContent = story.content;
    
    const newContent = currentContent.slice(0, start) + textToInsert + currentContent.slice(end);
    setStory(prev => ({ ...prev, content: newContent }));
    
    // Repositionner le curseur après l'insertion
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + textToInsert.length;
      textarea.focus();
    }, 10);
  };

  const writingPrompts = [
    "Il était une fois, dans un monde où...",
    "Le jour où tout a changé, j'ai découvert que...",
    "Au cœur de la nuit, un bruit étrange me réveilla...",
    "Dans cette ville abandonnée, seul le vent racontait...",
    "Elle ouvrit la lettre avec des mains tremblantes et lut...",
    "Le dernier humain sur Terre venait de comprendre que..."
  ];

  const insertPrompt = () => {
    const randomPrompt = writingPrompts[Math.floor(Math.random() * writingPrompts.length)];
    insertText(randomPrompt + "\n\n");
    toast.success('Prompt d\'écriture ajouté !');
  };

  const insertChapterBreak = () => {
    insertText("\n\n--- Chapitre ---\n\n");
    toast.success('Saut de chapitre ajouté !');
  };

  const insertDialogue = () => {
    insertText('— "');
    toast.success('Format de dialogue ajouté !');
  };

  // Nouvelles fonctions pour les titres et formatage
  const insertHeading = (level: number) => {
    const headingText = `\n${'#'.repeat(level)} `;
    insertText(headingText);
    toast.success(`Titre H${level} ajouté !`);
  };

  const insertUnderline = () => {
    insertText('__texte souligné__ ');
    toast.success('Format souligné ajouté !');
  };

  const insertBold = () => {
    insertText('**texte en gras** ');
    toast.success('Format gras ajouté !');
  };

  const applyFont = (fontFamily: string) => {
    const textarea = document.querySelector('textarea[placeholder*="Il était une fois"]') as HTMLTextAreaElement;
    if (!textarea) return;
    
    textarea.style.fontFamily = fontFamily;
    toast.success(`Police changée : ${fontFamily}`);
  };

  const fonts = [
    { name: 'Georgia (Classique)', value: '"Georgia", "Times New Roman", serif' },
    { name: 'Arial (Moderne)', value: '"Arial", "Helvetica", sans-serif' },
    { name: 'Garamond (Littéraire)', value: '"Garamond", "Times", serif' },
    { name: 'Verdana (Lisible)', value: '"Verdana", "Geneva", sans-serif' },
    { name: 'Courier (Machine à écrire)', value: '"Courier New", "Courier", monospace' },
    { name: 'Palatino (Élégant)', value: '"Palatino", "Book Antiqua", serif' }
  ];

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

  const wordCount = story.content.trim() ? story.content.trim().split(/\s+/).filter(w => w.length > 0).length : 0;
  const charCount = story.content.length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Classes CSS conditionnelles pour le mode sombre et plein écran
  const themeClasses = isDarkMode 
    ? 'bg-gray-900 text-white' 
    : 'bg-white text-black';
  
  const cardClasses = isDarkMode 
    ? 'bg-gray-800 border-gray-700' 
    : 'bg-white border-gray-200';

  const inputClasses = isDarkMode 
    ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-400 focus:border-blue-400' 
    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500';

  const containerClasses = isFullScreen 
    ? 'fixed inset-0 z-50' 
    : 'min-h-screen';

  return (
    <div className={`${containerClasses} ${themeClasses}`}>
      {/* En-tête */}
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-6 py-4`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {!isFullScreen && (
              <button
                onClick={() => navigate('/dashboard')}
                className={`flex items-center gap-2 px-3 py-2 ${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-black hover:bg-gray-100'} rounded-lg transition-colors`}
              >
                <ArrowLeft className="h-4 w-4" />
                Retour
              </button>
            )}
            <div className="flex items-center gap-3">
              {/* Logo LireLibre */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-white">
                    <path fill="currentColor" d="M21,5c-1.11-0.35-2.33-0.5-3.5-0.5c-1.95,0-4.05,0.4-5.5,1.5c-1.45-1.1-3.55-1.5-5.5-1.5 C5.33,4.5,4.11,4.65,3,5v14.65c0,0.25,0.25,0.5,0.5,0.5c0.1,0,0.15-0.05,0.25-0.05c0.85-0.3,2.1-0.5,3.25-0.5 c1.85,0,3.85,0.4,5,1.5c1.15-1.1,3.15-1.5,5-1.5c1.15,0,2.4,0.2,3.25,0.5c0.1,0.05,0.15,0.05,0.25,0.05c0.25,0,0.5-0.25,0.5-0.5V5 z M12,15.5c-1.45-1.1-3.55-1.5-5.5-1.5c-1.05,0-2.05,0.15-3,0.5V7c0.95-0.35,1.95-0.5,3-0.5c1.95,0,4.05,0.4,5.5,1.5V15.5z"/>
                  </svg>
                </div>
                <h1 className="text-xl font-bold">
                  LireLibre
                </h1>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Bouton Outils d'écriture */}
            <button
              onClick={() => setShowWritingTools(!showWritingTools)}
              className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} ${showWritingTools ? (isDarkMode ? 'bg-gray-700' : 'bg-gray-100') : ''}`}
              title="Outils d'aide à l'écriture"
            >
              <Type className="h-4 w-4" />
            </button>

            {/* Bouton Aperçu */}
            <button
              onClick={() => setShowPreview(!showPreview)}
              disabled={!story.content.trim()}
              className={`flex items-center gap-2 px-3 py-2 ${
                showPreview 
                  ? (isDarkMode ? 'bg-blue-700 text-blue-200 hover:bg-blue-600' : 'bg-blue-100 text-blue-700 hover:bg-blue-200')
                  : (isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
              } rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
              title={showPreview ? 'Fermer l\'aperçu' : 'Voir l\'aperçu'}
            >
              <Eye className="h-4 w-4" />
              {showPreview ? 'Fermer aperçu' : 'Aperçu'}
            </button>

            {/* Boutons mode sombre et plein écran */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              title={isDarkMode ? 'Mode clair' : 'Mode sombre'}
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            
            <button
              onClick={toggleFullScreen}
              className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              title={isFullScreen ? 'Quitter plein écran' : 'Mode plein écran'}
            >
              {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
            
            <input
              type="file"
              accept=".txt,.md"
              onChange={handleImportFile}
              className="hidden"
              id="file-import"
            />
            <label htmlFor="file-import">
              <button className={`flex items-center gap-2 px-4 py-2 ${isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} rounded-lg transition-colors`}>
                <Upload className="h-4 w-4" />
                Importer
              </button>
            </label>
            
            <button
              onClick={handleExport}
              disabled={!story.content}
              className={`flex items-center gap-2 px-4 py-2 ${isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Download className="h-4 w-4" />
              Exporter
            </button>
            
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>

            {/* Bouton Publier */}
            <button
              onClick={handlePublish}
              disabled={isPublishing || !story.title.trim() || !story.content.trim()}
              className={`flex items-center gap-2 px-6 py-2 ${
                story.isPublished 
                  ? 'bg-orange-600 hover:bg-orange-700' 
                  : 'bg-green-600 hover:bg-green-700'
              } text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {story.isPublished ? <BookOpen className="h-4 w-4" /> : <Send className="h-4 w-4" />}
              {isPublishing 
                ? (story.isPublished ? 'Dépublication...' : 'Publication...') 
                : (story.isPublished ? 'Dépublier' : 'Publier')
              }
            </button>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className={`${isFullScreen ? 'h-full overflow-auto' : ''} max-w-5xl mx-auto p-8`}>
        {/* Panneau d'outils d'écriture */}
        {showWritingTools && (
          <div className={`${cardClasses} rounded-xl p-6 mb-6 shadow-sm border-l-4 border-blue-500`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-black'} flex items-center gap-2`}>
              <Type className="h-5 w-5 text-blue-500" />
              Outils d'aide à l'écriture
            </h3>
            
            {/* Section Titres */}
            <div className="mb-6">
              <h4 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} flex items-center gap-2`}>
                <Hash className="h-4 w-4 text-purple-500" />
                Titres et Structure
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => insertHeading(1)}
                  className={`flex items-center gap-2 p-3 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'} rounded-lg transition-all duration-200 hover:scale-105`}
                >
                  <Heading1 className="h-4 w-4 text-purple-500" />
                  <span className="font-medium">H1</span>
                </button>
                <button
                  onClick={() => insertHeading(2)}
                  className={`flex items-center gap-2 p-3 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'} rounded-lg transition-all duration-200 hover:scale-105`}
                >
                  <Heading2 className="h-4 w-4 text-purple-500" />
                  <span className="font-medium">H2</span>
                </button>
                <button
                  onClick={() => insertHeading(3)}
                  className={`flex items-center gap-2 p-3 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'} rounded-lg transition-all duration-200 hover:scale-105`}
                >
                  <Heading3 className="h-4 w-4 text-purple-500" />
                  <span className="font-medium">H3</span>
                </button>
                <button
                  onClick={() => insertHeading(4)}
                  className={`flex items-center gap-2 p-3 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'} rounded-lg transition-all duration-200 hover:scale-105`}
                >
                  <Hash className="h-4 w-4 text-purple-500" />
                  <span className="font-medium">H4</span>
                </button>
              </div>
            </div>

            {/* Section Formatage */}
            <div className="mb-6">
              <h4 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} flex items-center gap-2`}>
                <Bold className="h-4 w-4 text-orange-500" />
                Formatage du Texte
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <button
                  onClick={insertBold}
                  className={`flex items-center gap-3 p-3 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'} rounded-lg transition-all duration-200 hover:scale-105`}
                >
                  <Bold className="h-4 w-4 text-orange-500" />
                  <span>**Gras**</span>
                </button>
                <button
                  onClick={() => insertText('*texte italique* ')}
                  className={`flex items-center gap-3 p-3 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'} rounded-lg transition-all duration-200 hover:scale-105`}
                >
                  <Italic className="h-4 w-4 text-blue-500" />
                  <span>*Italique*</span>
                </button>
                <button
                  onClick={insertUnderline}
                  className={`flex items-center gap-3 p-3 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'} rounded-lg transition-all duration-200 hover:scale-105`}
                >
                  <Underline className="h-4 w-4 text-green-500" />
                  <span>__Souligné__</span>
                </button>
              </div>
            </div>

            {/* Section Polices */}
            <div className="mb-6">
              <h4 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} flex items-center gap-2`}>
                <Type className="h-4 w-4 text-indigo-500" />
                Polices d'Écriture
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {fonts.map((font, index) => (
                  <button
                    key={index}
                    onClick={() => applyFont(font.value)}
                    className={`text-left p-3 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'} rounded-lg transition-all duration-200 hover:scale-105`}
                    style={{ fontFamily: font.value }}
                  >
                    {font.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Section Outils d'écriture existants */}
            <div className="mb-6">
              <h4 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} flex items-center gap-2`}>
                <AlignLeft className="h-4 w-4 text-green-500" />
                Outils d'Écriture
              </h4>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Prompts d'écriture */}
              <button
                onClick={insertPrompt}
                className={`flex items-center gap-3 p-4 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'} rounded-lg transition-all duration-200 hover:scale-105`}
              >
                <Hash className="h-5 w-5 text-purple-500" />
                <div className="text-left">
                  <div className="font-medium">Prompt d'écriture</div>
                  <div className="text-sm opacity-75">Idée pour commencer</div>
                </div>
              </button>

              {/* Saut de chapitre */}
              <button
                onClick={insertChapterBreak}
                className={`flex items-center gap-3 p-4 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'} rounded-lg transition-all duration-200 hover:scale-105`}
              >
                <AlignLeft className="h-5 w-5 text-green-500" />
                <div className="text-left">
                  <div className="font-medium">Saut de chapitre</div>
                  <div className="text-sm opacity-75">Nouvelle section</div>
                </div>
              </button>

              {/* Format dialogue */}
              <button
                onClick={insertDialogue}
                className={`flex items-center gap-3 p-4 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'} rounded-lg transition-all duration-200 hover:scale-105`}
              >
                <Bold className="h-5 w-5 text-orange-500" />
                <div className="text-left">
                  <div className="font-medium">Format dialogue</div>
                  <div className="text-sm opacity-75">— "Paroles"</div>
                </div>
              </button>

              {/* Actions de texte */}
              <button
                onClick={() => insertText("*Cursives* ")}
                className={`flex items-center gap-3 p-4 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'} rounded-lg transition-all duration-200 hover:scale-105`}
              >
                <Italic className="h-5 w-5 text-blue-500" />
                <div className="text-left">
                  <div className="font-medium">Texte en italique</div>
                  <div className="text-sm opacity-75">*cursive*</div>
                </div>
              </button>

              {/* Liste */}
              <button
                onClick={() => insertText("\n• ")}
                className={`flex items-center gap-3 p-4 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'} rounded-lg transition-all duration-200 hover:scale-105`}
              >
                <List className="h-5 w-5 text-red-500" />
                <div className="text-left">
                  <div className="font-medium">Liste à puces</div>
                  <div className="text-sm opacity-75">• Élément</div>
                </div>
              </button>

              {/* Séparateur */}
              <button
                onClick={() => insertText("\n\n* * *\n\n")}
                className={`flex items-center gap-3 p-4 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'} rounded-lg transition-all duration-200 hover:scale-105`}
              >
                <AlignLeft className="h-5 w-5 text-indigo-500" />
                <div className="text-left">
                  <div className="font-medium">Séparateur</div>
                  <div className="text-sm opacity-75">* * *</div>
                </div>
              </button>
            </div>
            </div>

            {/* Conseils d'écriture */}
            <div className={`mt-6 p-4 ${isDarkMode ? 'bg-gray-700/50' : 'bg-blue-50'} rounded-lg`}>
              <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                💡 Conseil d'écriture du jour
              </h4>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-blue-700'}`}>
                Écrivez d'abord, révisez ensuite. Laissez vos idées couler sur le papier sans vous autocensurer.
              </p>
            </div>
          </div>
        )}

        {/* Zone titre et description - cachée en mode plein écran */}
        {!isFullScreen && (
          <div className={`${cardClasses} rounded-xl p-8 mb-8 shadow-sm`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                Informations de base
              </h2>
              
              {/* Indicateur de statut */}
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                story.isPublished 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              }`}>
                <div className={`w-2 h-2 rounded-full ${story.isPublished ? 'bg-green-500' : 'bg-gray-400'}`} />
                {story.isPublished ? 'Publiée' : 'Brouillon'}
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Titre */}
              <div>
                <label className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  Titre de l'histoire *
                </label>
                <input
                  type="text"
                  value={story.title}
                  onChange={(e) => setStory(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Donnez un titre captivant à votre histoire..."
                  className={`w-full px-4 py-3 text-lg rounded-lg transition-all ${inputClasses}`}
                  style={{ 
                    direction: 'ltr', 
                    textAlign: 'left',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}
                />
              </div>
              
              {/* Description */}
              <div>
                <label className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  Description (résumé)
                </label>
                <textarea
                  value={story.description}
                  onChange={(e) => setStory(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Décrivez brièvement votre histoire pour attirer les lecteurs..."
                  rows={4}
                  className={`w-full px-4 py-3 rounded-lg resize-none transition-all ${inputClasses}`}
                  style={{ 
                    direction: 'ltr', 
                    textAlign: 'left',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Zone d'écriture avec aperçu intégré */}
        <div className={`${cardClasses} rounded-xl p-8 shadow-sm ${isFullScreen ? 'h-full flex flex-col' : ''}`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>
              {isFullScreen ? 'Mode Écriture Plein Écran' : 'Contenu de l\'histoire'}
            </h2>
            
            {/* Onglets Écrire / Aperçu */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setShowPreview(false)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  !showPreview 
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                ✍️ Écrire
              </button>
              <button
                onClick={() => setShowPreview(true)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  showPreview 
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                👁️ Aperçu
              </button>
            </div>
          </div>
          
          {/* Contenu conditionnel : Éditeur ou Aperçu */}
          {!showPreview ? (
            // Mode Écriture
            <>
              <textarea
                value={story.content}
                onChange={(e) => setStory(prev => ({ ...prev, content: e.target.value }))}
                data-content-editor="true"
                placeholder={isFullScreen 
                  ? "Mode concentration activé. Écrivez votre histoire en toute tranquillité..." 
                  : `Il était une fois... 

Commencez à écrire votre histoire ici. Laissez libre cours à votre imagination !

Utilisez les outils d'aide à l'écriture pour vous inspirer et formater votre texte.`
                }
                rows={isFullScreen ? undefined : 25}
                className={`w-full px-4 py-4 text-base leading-relaxed rounded-lg resize-none transition-all ${inputClasses} ${isFullScreen ? 'flex-1 h-full min-h-0' : ''}`}
                style={{ 
                  direction: 'ltr', 
                  textAlign: 'left',
                  fontFamily: '"Georgia", "Times New Roman", serif',
                  lineHeight: '1.8'
                }}
              />
              
              {/* Statistiques */}
              <div className={`mt-6 flex items-center gap-8 text-sm px-4 py-3 rounded-lg ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-600'}`}>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Mots:</span>
                  <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    {wordCount.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Caractères:</span>
                  <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    {charCount.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Temps de lecture:</span>
                  <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    ~{readingTime} min
                  </span>
                </div>
              </div>
            </>
          ) : (
            // Mode Aperçu
            <div className={`${isFullScreen ? 'flex-1 overflow-auto' : 'min-h-96'} p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              {story.content.trim() ? (
                <div className="prose max-w-none dark:prose-invert">
                  {/* Titre dans l'aperçu */}
                  {story.title && (
                    <h1 className="text-3xl font-bold mb-4 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 pb-2">
                      {story.title}
                    </h1>
                  )}
                  
                  {/* Description dans l'aperçu */}
                  {story.description && (
                    <div className="italic text-gray-600 dark:text-gray-400 mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded">
                      {story.description}
                    </div>
                  )}
                  
                  {/* Contenu formaté */}
                  <div 
                    className="text-lg leading-relaxed"
                    style={{ fontFamily: '"Georgia", "Times New Roman", serif', lineHeight: '1.8' }}
                    dangerouslySetInnerHTML={{ 
                      __html: formatContentForPreview(story.content) 
                    }}
                  />
                  
                  {/* Statistiques de l'aperçu */}
                  <div className={`mt-8 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} text-sm`}>
                    <strong className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                      📊 Statistiques de l'histoire :
                    </strong>
                    <br />
                    📝 {wordCount} mots • 🔤 {charCount} caractères • ⏱️ ~{readingTime} min de lecture
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Aucun contenu à prévisualiser
                  </h3>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Commencez à écrire pour voir l'aperçu de votre histoire
                  </p>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Commencer à écrire
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WritePageClean;
