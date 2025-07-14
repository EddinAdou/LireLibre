/**
 * RichTextEditor - Éditeur de texte riche pour l'écriture d'histoires
 * Fonctionnalités avancées pour une expérience d'écriture optimale
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Quote, 
  Link,
  Save,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  BookOpen
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  autoSave?: boolean;
  onSave?: () => void;
  readingMode?: boolean;
  onToggleReadingMode?: () => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Commencez à écrire votre histoire...",
  className = "",
  autoSave = false,
  onSave,
  readingMode = false,
  onToggleReadingMode,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [selectedText, setSelectedText] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);

  // Mettre à jour les statistiques
  useEffect(() => {
    const text = value.replace(/<[^>]*>/g, ''); // Retirer le HTML
    const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    const chars = text.length;
    const reading = Math.ceil(words / 200); // 200 mots par minute

    setWordCount(words);
    setCharCount(chars);
    setReadingTime(reading);
  }, [value]);

  // Auto-save
  useEffect(() => {
    if (!autoSave || !onSave) return;

    const timer = setTimeout(() => {
      onSave();
    }, 2000); // Auto-save après 2 secondes d'inactivité

    return () => clearTimeout(timer);
  }, [value, autoSave, onSave]);

  // Gestion des commandes de formatage
  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  // Gestion de la sélection de texte
  const handleSelectionChange = useCallback(() => {
    const selection = window.getSelection();
    if (selection) {
      setSelectedText(selection.toString());
    }
  }, []);

  // Gestion du contenu de l'éditeur
  const handleInput = useCallback(() => {
    if (editorRef.current) {
      // Force la direction LTR après chaque modification
      editorRef.current.style.direction = 'ltr';
      editorRef.current.style.textAlign = 'left';
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  // Force la direction LTR au focus
  const handleFocus = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.style.direction = 'ltr';
      editorRef.current.style.textAlign = 'left';
    }
  }, []);

  // Initialise la direction après montage
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.style.direction = 'ltr';
      editorRef.current.style.textAlign = 'left';
      editorRef.current.setAttribute('dir', 'ltr');
    }
  }, [value]);

  // Raccourcis clavier
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          execCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          execCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          execCommand('underline');
          break;
        case 's':
          e.preventDefault();
          if (onSave) onSave();
          break;
        case 'z':
          e.preventDefault();
          if (e.shiftKey) {
            execCommand('redo');
          } else {
            execCommand('undo');
          }
          break;
      }
    }
  }, [execCommand, onSave]);

  // Mode lecture
  if (readingMode) {
    return (
      <div className={`prose prose-lg max-w-none ${className}`}>
        <div className="flex justify-between items-center mb-6 p-4 bg-amber-50 rounded-lg border">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>📖 Mode lecture</span>
            <span>{wordCount} mots</span>
            <span>{readingTime} min de lecture</span>
          </div>
          <button
            onClick={onToggleReadingMode}
            className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Type className="h-4 w-4" />
            <span>Éditer</span>
          </button>
        </div>
        <div 
          className="leading-relaxed text-gray-800"
          dangerouslySetInnerHTML={{ __html: value }}
        />
      </div>
    );
  }

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}>
      {/* Style global pour forcer LTR */}
      <style>
        {`
          [contenteditable] {
            direction: ltr !important;
            text-align: left !important;
            unicode-bidi: embed !important;
          }
          [contenteditable] * {
            direction: ltr !important;
            text-align: left !important;
          }
        `}
      </style>
      
      {/* Barre d'outils */}
      <div className="bg-gray-50 border-b border-gray-300 p-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Formatage de base */}
          <div className="flex items-center space-x-1 border-r border-gray-300 pr-2">
            <button
              onClick={() => execCommand('bold')}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title="Gras (Ctrl+B)"
            >
              <Bold className="h-4 w-4" />
            </button>
            <button
              onClick={() => execCommand('italic')}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title="Italique (Ctrl+I)"
            >
              <Italic className="h-4 w-4" />
            </button>
            <button
              onClick={() => execCommand('underline')}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title="Souligné (Ctrl+U)"
            >
              <Underline className="h-4 w-4" />
            </button>
          </div>

          {/* Alignement */}
          <div className="flex items-center space-x-1 border-r border-gray-300 pr-2">
            <button
              onClick={() => execCommand('justifyLeft')}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title="Aligner à gauche"
            >
              <AlignLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => execCommand('justifyCenter')}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title="Centrer"
            >
              <AlignCenter className="h-4 w-4" />
            </button>
            <button
              onClick={() => execCommand('justifyRight')}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title="Aligner à droite"
            >
              <AlignRight className="h-4 w-4" />
            </button>
          </div>

          {/* Listes */}
          <div className="flex items-center space-x-1 border-r border-gray-300 pr-2">
            <button
              onClick={() => execCommand('insertUnorderedList')}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title="Liste à puces"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => execCommand('insertOrderedList')}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title="Liste numérotée"
            >
              <ListOrdered className="h-4 w-4" />
            </button>
          </div>

          {/* Éléments spéciaux */}
          <div className="flex items-center space-x-1 border-r border-gray-300 pr-2">
            <button
              onClick={() => execCommand('formatBlock', 'blockquote')}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title="Citation"
            >
              <Quote className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                const url = prompt('URL du lien:');
                if (url) execCommand('createLink', url);
              }}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title="Insérer un lien"
            >
              <Link className="h-4 w-4" />
            </button>
          </div>

          {/* Annuler/Refaire */}
          <div className="flex items-center space-x-1 border-r border-gray-300 pr-2">
            <button
              onClick={() => execCommand('undo')}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title="Annuler (Ctrl+Z)"
            >
              <Undo className="h-4 w-4" />
            </button>
            <button
              onClick={() => execCommand('redo')}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title="Refaire (Ctrl+Shift+Z)"
            >
              <Redo className="h-4 w-4" />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-1">
            {onToggleReadingMode && (
              <button
                onClick={onToggleReadingMode}
                className="flex items-center space-x-1 px-3 py-1 bg-amber-100 text-amber-800 rounded hover:bg-amber-200 transition-colors"
                title="Mode lecture"
              >
                <BookOpen className="h-4 w-4" />
                <span>Lecture</span>
              </button>
            )}
            {onSave && (
              <button
                onClick={onSave}
                className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
                title="Sauvegarder (Ctrl+S)"
              >
                <Save className="h-4 w-4" />
                <span>Sauvegarder</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Éditeur */}
      <div
        ref={editorRef}
        contentEditable
        className="min-h-96 p-6 focus:outline-none prose prose-lg max-w-none"
        onInput={handleInput}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        onMouseUp={handleSelectionChange}
        onKeyUp={handleSelectionChange}
        dangerouslySetInnerHTML={{ __html: value }}
        data-placeholder={placeholder}
        style={{
          lineHeight: '1.8',
          fontSize: '16px',
          direction: 'ltr', // Force left-to-right text direction
          textAlign: 'left', // Force left alignment
          unicodeBidi: 'embed', // Force LTR for mixed content
          writingMode: 'horizontal-tb', // Horizontal writing
        }}
        dir="ltr" // HTML attribute for text direction
      />

      {/* Barre de statut */}
      <div className="bg-gray-50 border-t border-gray-300 px-4 py-2 flex justify-between items-center text-sm text-gray-600">
        <div className="flex items-center space-x-4">
          <span>{wordCount} mots</span>
          <span>{charCount} caractères</span>
          <span>{readingTime} min de lecture</span>
          {selectedText && <span>"{selectedText.slice(0, 20)}..." sélectionné</span>}
        </div>
        <div className="flex items-center space-x-2">
          {autoSave && <span className="text-green-600">✓ Sauvegarde automatique</span>}
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor;
