import React, { useState, useEffect, useCallback, useRef } from 'react';
import './StoryReader.css';

interface ReadingProgress {
  characterPosition: number;
  wordPosition: number;
  percentageRead: number;
  lastReadParagraph?: string;
  lastReadAt?: string;
  bookmarks: Bookmark[];
  readingTimeMinutes: number;
}

interface Bookmark {
  title: string;
  position: number;
  excerpt: string;
  createdAt: string;
}

interface StoryReaderProps {
  storyId: number;
  content: string;
  title: string;
  onProgressUpdate?: (progress: ReadingProgress) => void;
}

export const StoryReader: React.FC<StoryReaderProps> = ({
  storyId,
  content,
  title,
  onProgressUpdate
}) => {
  const [progress, setProgress] = useState<ReadingProgress>({
    characterPosition: 0,
    wordPosition: 0,
    percentageRead: 0,
    bookmarks: [],
    readingTimeMinutes: 0
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [showBookmarkDialog, setShowBookmarkDialog] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [selectedPosition, setSelectedPosition] = useState(0);
  const [bookmarkTitle, setBookmarkTitle] = useState('');
  const [startTime] = useState<number>(Date.now());
  
  const contentRef = useRef<HTMLDivElement>(null);

  // Charger le progrès de lecture existant
  useEffect(() => {
    loadProgress();
  }, [storyId]);

  // Sauvegarder automatiquement le progrès toutes les 30 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      saveProgress();
    }, 30000);

    return () => clearInterval(interval);
  }, [progress]);

  // Gérer la sélection de texte pour les marque-pages
  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().length > 0) {
        const range = selection.getRangeAt(0);
        const selectedText = selection.toString();
        const position = getPositionFromRange(range);
        
        setSelectedText(selectedText);
        setSelectedPosition(position);
      }
    };

    document.addEventListener('mouseup', handleSelection);
    return () => document.removeEventListener('mouseup', handleSelection);
  }, []);

  // Sauvegarder le progrès en quittant la page
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveProgress();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [progress]);

  const loadProgress = async () => {
    try {
      const response = await fetch(`/api/reading-progress/${storyId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProgress(data);
        
        // Faire défiler vers la dernière position de lecture
        if (data.characterPosition > 0) {
          setTimeout(() => scrollToPosition(data.characterPosition), 500);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement du progrès:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProgress = useCallback(async () => {
    if (!contentRef.current) return;

    const currentPosition = getCurrentPosition();
    const currentProgress = calculateProgress();
    const readingTime = Math.floor((Date.now() - startTime) / 60000); // en minutes

    const updatedProgress = {
      ...progress,
      ...currentPosition,
      percentageRead: currentProgress,
      readingTimeMinutes: readingTime
    };

    try {
      const response = await fetch(`/api/reading-progress/${storyId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedProgress)
      });

      if (response.ok) {
        setProgress(updatedProgress);
        onProgressUpdate?.(updatedProgress);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du progrès:', error);
    }
  }, [storyId, progress, startTime, onProgressUpdate]);

  const getCurrentPosition = (): { characterPosition: number; wordPosition: number } => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Estimation de la position basée sur le scroll
    const scrollProgress = scrollTop / (documentHeight - windowHeight);
    const characterPosition = Math.floor(content.length * scrollProgress);
    const wordPosition = Math.floor(content.split(/\s+/).length * scrollProgress);

    return { characterPosition, wordPosition };
  };

  const calculateProgress = (): number => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    return Math.min(100, Math.max(0, (scrollTop / (documentHeight - windowHeight)) * 100));
  };

  const scrollToPosition = (characterPosition: number) => {
    const progressRatio = characterPosition / content.length;
    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    const targetScroll = (documentHeight - windowHeight) * progressRatio;
    
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  };

  const getPositionFromRange = (range: Range): number => {
    if (!contentRef.current) return 0;
    
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(contentRef.current);
    preCaretRange.setEnd(range.startContainer, range.startOffset);
    
    return preCaretRange.toString().length;
  };

  const addBookmark = async () => {
    if (!bookmarkTitle || selectedText.length === 0) {
      alert('Veuillez sélectionner du texte et donner un titre au marque-page');
      return;
    }

    try {
      const response = await fetch(`/api/reading-progress/${storyId}/bookmark`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: bookmarkTitle,
          position: selectedPosition,
          excerpt: selectedText.substring(0, 200)
        })
      });

      if (response.ok) {
        const data = await response.json();
        setProgress(prev => ({ ...prev, bookmarks: data.bookmarks }));
        setShowBookmarkDialog(false);
        setBookmarkTitle('');
        setSelectedText('');
        console.log('Marque-page ajouté avec succès');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du marque-page:', error);
      alert('Erreur lors de l\'ajout du marque-page');
    }
  };

  const removeBookmark = async (position: number) => {
    try {
      const response = await fetch(`/api/reading-progress/${storyId}/bookmark/${position}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProgress(prev => ({ ...prev, bookmarks: data.bookmarks }));
        console.log('Marque-page supprimé');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du marque-page:', error);
      alert('Erreur lors de la suppression du marque-page');
    }
  };

  const jumpToBookmark = (position: number) => {
    scrollToPosition(position);
  };

  // Formatter le contenu avec des paragraphes
  const formatContent = (text: string) => {
    return text.split('\n').map((paragraph, index) => (
      <p key={index} className="story-paragraph">
        {paragraph}
      </p>
    ));
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <span className="loading-text">Chargement de votre progression...</span>
      </div>
    );
  }

  return (
    <div className="story-reader">
      {/* Barre de progression */}
      <div className="story-reader-header">
        <div className="story-reader-header-content">
          <h1 className="story-reader-title">{title}</h1>
          <div className="story-reader-controls">
            <div className="progress-container">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress.percentageRead}%` }}
                ></div>
              </div>
              <span className="progress-text">
                {Math.round(progress.percentageRead)}%
              </span>
            </div>
            
            {selectedText && (
              <button
                onClick={() => setShowBookmarkDialog(true)}
                className="bookmark-button"
              >
                Marquer
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="story-content">
        <div
          ref={contentRef}
          className="story-text"
        >
          {formatContent(content)}
        </div>
      </div>

      {/* Sidebar avec marque-pages */}
      {progress.bookmarks.length > 0 && (
        <div className="bookmarks-sidebar">
          <h3 className="bookmarks-title">Marque-pages</h3>
          <div className="bookmarks-list">
            {progress.bookmarks.map((bookmark, index) => (
              <div key={index} className="bookmark-item">
                <div className="bookmark-content">
                  <button
                    onClick={() => jumpToBookmark(bookmark.position)}
                    className="bookmark-link"
                  >
                    <div className="bookmark-title">{bookmark.title}</div>
                    <div className="bookmark-excerpt">
                      {bookmark.excerpt.substring(0, 50)}...
                    </div>
                  </button>
                  <button
                    onClick={() => removeBookmark(bookmark.position)}
                    className="bookmark-delete"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dialog pour ajouter un marque-page */}
      {showBookmarkDialog && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <h3 className="dialog-title">Ajouter un marque-page</h3>
            
            <div className="dialog-field">
              <label className="dialog-label">
                Texte sélectionné :
              </label>
              <div className="dialog-selected-text">
                "{selectedText.substring(0, 200)}"
              </div>
            </div>
            
            <div className="dialog-field">
              <label className="dialog-label">
                Titre du marque-page :
              </label>
              <input
                type="text"
                value={bookmarkTitle}
                onChange={(e) => setBookmarkTitle(e.target.value)}
                className="dialog-input"
                placeholder="Ex: Scène importante..."
              />
            </div>
            
            <div className="dialog-actions">
              <button
                onClick={() => setShowBookmarkDialog(false)}
                className="dialog-button-cancel"
              >
                Annuler
              </button>
              <button
                onClick={addBookmark}
                className="dialog-button-confirm"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
