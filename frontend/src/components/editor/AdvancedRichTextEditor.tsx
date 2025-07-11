/**
 * AdvancedRichTextEditor - Éditeur de texte enrichi avec fonctionnalités avancées
 * Formatage, direction LTR forcée, sous-titres, numérotation, polices
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, 
  List, ListOrdered, Quote, Heading1, Heading2, Heading3,
  Type, Eye, RotateCcw, RotateCw, Hash, Book
} from 'lucide-react';

interface AdvancedRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
  showToolbar?: boolean;
  autoSave?: boolean;
  onAutoSave?: (content: string) => void;
}

const AdvancedRichTextEditor: React.FC<AdvancedRichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Commencez à écrire votre histoire...',
  className = '',
  minHeight = '400px',
  showToolbar = true,
  autoSave = false,
  onAutoSave
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('system-ui');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [chapterCount, setChapterCount] = useState(0);

  // Force la direction LTR à chaque interaction
  const forceLTRDirection = useCallback(() => {
    if (editorRef.current) {
      const editor = editorRef.current;
      
      // Force la direction LTR de manière agressive
      editor.dir = 'ltr';
      editor.style.direction = 'ltr';
      editor.style.textAlign = 'left';
      editor.style.unicodeBidi = 'bidi-override';
      editor.setAttribute('dir', 'ltr');
      
      // Force pour tous les éléments enfants
      const allElements = editor.querySelectorAll('*');
      allElements.forEach((el: Element) => {
        const htmlEl = el as HTMLElement;
        htmlEl.dir = 'ltr';
        htmlEl.style.direction = 'ltr';
        htmlEl.style.textAlign = 'left';
        htmlEl.style.unicodeBidi = 'bidi-override';
        htmlEl.setAttribute('dir', 'ltr');
      });
      
      // Repositionner le curseur à la fin si nécessaire
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }, []);

  // Calculer les statistiques du texte
  const updateStats = useCallback((content: string) => {
    const plainText = content.replace(/<[^>]*>/g, '').trim();
    const words = plainText ? plainText.split(/\s+/).filter(word => word.length > 0).length : 0;
    const chars = plainText.length;
    const chapters = (content.match(/<h[1-3][^>]*>/g) || []).length;
    
    setWordCount(words);
    setCharCount(chars);
    setChapterCount(chapters);
  }, []);

  // Gestionnaire d'entrée avec force LTR
  const handleInput = useCallback((e: React.FormEvent<HTMLDivElement>) => {
    const content = e.currentTarget.innerHTML;
    onChange(content);
    updateStats(content);
    
    // Force LTR immédiatement et après un délai
    forceLTRDirection();
    setTimeout(forceLTRDirection, 10);
    setTimeout(forceLTRDirection, 50);
    
    // Auto-sauvegarde
    if (autoSave && onAutoSave) {
      setTimeout(() => onAutoSave(content), 1000);
    }
  }, [onChange, updateStats, forceLTRDirection, autoSave, onAutoSave]);

  // Gestionnaires d'événements avec force LTR
  const handleFocus = useCallback(() => {
    forceLTRDirection();
    setTimeout(forceLTRDirection, 10);
  }, [forceLTRDirection]);

  const handleClick = useCallback(() => {
    forceLTRDirection();
    setTimeout(forceLTRDirection, 10);
  }, [forceLTRDirection]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Force LTR avant et après chaque frappe
    forceLTRDirection();
    setTimeout(forceLTRDirection, 0);
    setTimeout(forceLTRDirection, 10);
    
    // Raccourcis clavier
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
          if (onAutoSave) {
            onAutoSave(editorRef.current?.innerHTML || '');
          }
          break;
      }
    }
  }, [forceLTRDirection, onAutoSave]);

  // Exécuter une commande de formatage
  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
      updateStats(content);
    }
    forceLTRDirection();
    setTimeout(forceLTRDirection, 10);
  };

  // Insérer du contenu personnalisé
  const insertContent = (content: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        
        // Créer l'élément avec direction forcée
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        tempDiv.style.direction = 'ltr';
        tempDiv.style.textAlign = 'left';
        tempDiv.setAttribute('dir', 'ltr');
        
        const fragment = range.createContextualFragment(tempDiv.innerHTML);
        range.insertNode(fragment);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      
      const newContent = editorRef.current.innerHTML;
      onChange(newContent);
      updateStats(newContent);
      forceLTRDirection();
    }
  };

  // Insérer des titres numérotés
  const insertNumberedHeading = (level: number) => {
    const existingHeadings = (editorRef.current?.innerHTML.match(new RegExp(`<h${level}[^>]*>.*?</h${level}>`, 'gi')) || []);
    const headingCount = existingHeadings.length + 1;
    
    let headingText;
    switch (level) {
      case 1:
        headingText = `<h1 style="direction: ltr; text-align: left; margin: 2em 0 1em 0; font-size: 1.8em; font-weight: bold; border-bottom: 2px solid #e5e7eb; padding-bottom: 0.3em;" dir="ltr">Chapitre ${headingCount}</h1><p style="direction: ltr; text-align: left;" dir="ltr"><br></p>`;
        break;
      case 2:
        headingText = `<h2 style="direction: ltr; text-align: left; margin: 1.5em 0 0.5em 0; font-size: 1.5em; font-weight: bold; color: #374151;" dir="ltr">${headingCount}. Sous-titre</h2><p style="direction: ltr; text-align: left;" dir="ltr"><br></p>`;
        break;
      case 3:
        headingText = `<h3 style="direction: ltr; text-align: left; margin: 1em 0 0.5em 0; font-size: 1.25em; font-weight: bold; color: #4b5563;" dir="ltr">${headingCount}. Section</h3><p style="direction: ltr; text-align: left;" dir="ltr"><br></p>`;
        break;
      default:
        headingText = `<h2 style="direction: ltr; text-align: left;" dir="ltr">Titre ${headingCount}</h2><p style="direction: ltr; text-align: left;" dir="ltr"><br></p>`;
    }
    
    insertContent(headingText);
  };

  // Insérer un saut de page avec numéro
  const insertPageBreak = () => {
    const pageNumber = Math.floor(wordCount / 250) + 1;
    const pageText = `<div style="direction: ltr; text-align: center; font-weight: bold; margin: 40px 0; page-break-before: always; border-top: 1px solid #ddd; border-bottom: 1px solid #ddd; padding: 20px 0;" dir="ltr">--- Page ${pageNumber} ---</div><p style="direction: ltr; text-align: left;" dir="ltr"><br></p>`;
    insertContent(pageText);
  };

  // Insérer une ligne de séparation
  const insertSeparator = () => {
    const separatorText = `<div style="direction: ltr; text-align: center; margin: 2em 0;" dir="ltr">* * *</div><p style="direction: ltr; text-align: left;" dir="ltr"><br></p>`;
    insertContent(separatorText);
  };

  // Effet pour initialiser l'éditeur
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
      updateStats(value);
      forceLTRDirection();
    }
  }, [value, updateStats, forceLTRDirection]);

  // Force LTR en continu avec intervalle plus fréquent
  useEffect(() => {
    const interval = setInterval(forceLTRDirection, 50);
    return () => clearInterval(interval);
  }, [forceLTRDirection]);

  // Polices disponibles pour l'écriture
  const fonts = [
    { name: 'Système', value: 'system-ui, -apple-system, sans-serif' },
    { name: 'Times New Roman', value: 'Times New Roman, Times, serif' },
    { name: 'Arial', value: 'Arial, Helvetica, sans-serif' },
    { name: 'Georgia', value: 'Georgia, serif' },
    { name: 'Garamond', value: 'Garamond, serif' },
    { name: 'Book Antiqua', value: 'Book Antiqua, Palatino, serif' },
    { name: 'Palatino', value: 'Palatino Linotype, Book Antiqua, serif' },
    { name: 'Century', value: 'Century, serif' },
    { name: 'Trebuchet MS', value: 'Trebuchet MS, sans-serif' },
    { name: 'Verdana', value: 'Verdana, sans-serif' }
  ];

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden bg-white ${className}`}>
      {/* Barre d'outils avancée */}
      {showToolbar && (
        <div className="bg-gray-50 border-b border-gray-300 p-3">
          {/* Première ligne : Formatage principal */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {/* Formatage de base */}
            <div className="flex items-center gap-1 bg-white rounded p-1 border">
              <button
                onClick={() => execCommand('bold')}
                className="p-2 hover:bg-blue-100 rounded transition-colors"
                title="Gras (Ctrl+B)"
              >
                <Bold className="h-4 w-4" />
              </button>
              <button
                onClick={() => execCommand('italic')}
                className="p-2 hover:bg-blue-100 rounded transition-colors"
                title="Italique (Ctrl+I)"
              >
                <Italic className="h-4 w-4" />
              </button>
              <button
                onClick={() => execCommand('underline')}
                className="p-2 hover:bg-blue-100 rounded transition-colors"
                title="Souligné (Ctrl+U)"
              >
                <Underline className="h-4 w-4" />
              </button>
            </div>

            {/* Titres et structure */}
            <div className="flex items-center gap-1 bg-white rounded p-1 border">
              <button
                onClick={() => insertNumberedHeading(1)}
                className="p-2 hover:bg-green-100 rounded transition-colors"
                title="Chapitre principal"
              >
                <Heading1 className="h-4 w-4" />
              </button>
              <button
                onClick={() => insertNumberedHeading(2)}
                className="p-2 hover:bg-green-100 rounded transition-colors"
                title="Sous-titre numéroté"
              >
                <Heading2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => insertNumberedHeading(3)}
                className="p-2 hover:bg-green-100 rounded transition-colors"
                title="Section numérotée"
              >
                <Heading3 className="h-4 w-4" />
              </button>
            </div>

            {/* Alignement */}
            <div className="flex items-center gap-1 bg-white rounded p-1 border">
              <button
                onClick={() => execCommand('justifyLeft')}
                className="p-2 hover:bg-yellow-100 rounded transition-colors"
                title="Aligner à gauche"
              >
                <AlignLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => execCommand('justifyCenter')}
                className="p-2 hover:bg-yellow-100 rounded transition-colors"
                title="Centrer"
              >
                <AlignCenter className="h-4 w-4" />
              </button>
              <button
                onClick={() => execCommand('justifyRight')}
                className="p-2 hover:bg-yellow-100 rounded transition-colors"
                title="Aligner à droite"
              >
                <AlignRight className="h-4 w-4" />
              </button>
            </div>

            {/* Listes et citations */}
            <div className="flex items-center gap-1 bg-white rounded p-1 border">
              <button
                onClick={() => execCommand('insertUnorderedList')}
                className="p-2 hover:bg-purple-100 rounded transition-colors"
                title="Liste à puces"
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => execCommand('insertOrderedList')}
                className="p-2 hover:bg-purple-100 rounded transition-colors"
                title="Liste numérotée"
              >
                <ListOrdered className="h-4 w-4" />
              </button>
              <button
                onClick={() => execCommand('formatBlock', 'blockquote')}
                className="p-2 hover:bg-purple-100 rounded transition-colors"
                title="Citation"
              >
                <Quote className="h-4 w-4" />
              </button>
            </div>

            {/* Utilitaires d'écriture */}
            <div className="flex items-center gap-1 bg-white rounded p-1 border">
              <button
                onClick={insertPageBreak}
                className="p-2 hover:bg-orange-100 rounded transition-colors"
                title="Saut de page numéroté"
              >
                <Hash className="h-4 w-4" />
              </button>
              <button
                onClick={insertSeparator}
                className="p-2 hover:bg-orange-100 rounded transition-colors"
                title="Séparateur de section"
              >
                <Book className="h-4 w-4" />
              </button>
            </div>

            {/* Contrôles d'édition */}
            <div className="flex items-center gap-1 bg-white rounded p-1 border ml-auto">
              <button
                onClick={() => execCommand('undo')}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Annuler"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={() => execCommand('redo')}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Refaire"
              >
                <RotateCw className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsPreview(!isPreview)}
                className={`p-2 rounded transition-colors ${
                  isPreview ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                }`}
                title={isPreview ? 'Mode édition' : 'Mode aperçu'}
              >
                <Eye className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Deuxième ligne : Polices, taille et statistiques */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Police:</label>
              <select
                value={fontFamily}
                onChange={(e) => {
                  setFontFamily(e.target.value);
                  if (editorRef.current) {
                    editorRef.current.style.fontFamily = e.target.value;
                  }
                }}
                className="px-3 py-1 border border-gray-300 rounded text-sm bg-white"
              >
                {fonts.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Type className="h-4 w-4 text-gray-600" />
              <input
                type="range"
                min="12"
                max="24"
                value={fontSize}
                onChange={(e) => {
                  const size = parseInt(e.target.value);
                  setFontSize(size);
                  if (editorRef.current) {
                    editorRef.current.style.fontSize = `${size}px`;
                  }
                }}
                className="w-24"
              />
              <span className="text-sm text-gray-600 w-10">{fontSize}px</span>
            </div>

            <div className="flex items-center gap-4 ml-auto text-sm text-gray-600">
              <span className="bg-blue-50 px-2 py-1 rounded">
                {wordCount} mots
              </span>
              <span className="bg-green-50 px-2 py-1 rounded">
                {charCount} caractères
              </span>
              <span className="bg-purple-50 px-2 py-1 rounded">
                {chapterCount} chapitres
              </span>
              <span className="bg-orange-50 px-2 py-1 rounded">
                {Math.ceil(wordCount / 250)} pages
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Zone d'édition */}
      <div 
        className="relative"
        style={{ minHeight }}
      >
        {isPreview ? (
          <div 
            className="p-6 prose prose-lg max-w-none bg-white"
            dangerouslySetInnerHTML={{ __html: value }}
            style={{
              fontFamily,
              fontSize: `${fontSize}px`,
              direction: 'ltr',
              textAlign: 'left',
              lineHeight: '1.6'
            }}
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onFocus={handleFocus}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            className="p-6 outline-none min-h-full prose prose-lg max-w-none bg-white"
            style={{
              minHeight,
              fontFamily,
              fontSize: `${fontSize}px`,
              direction: 'ltr',
              textAlign: 'left',
              unicodeBidi: 'bidi-override',
              lineHeight: '1.6'
            }}
            dir="ltr"
            data-placeholder={placeholder}
            suppressContentEditableWarning={true}
          />
        )}
      </div>

      {/* Styles CSS injectés pour forcer LTR */}
      <style>{`
        [contenteditable="true"] {
          direction: ltr !important;
          text-align: left !important;
          unicode-bidi: bidi-override !important;
        }
        
        [contenteditable="true"] *,
        [contenteditable="true"] p,
        [contenteditable="true"] div,
        [contenteditable="true"] span,
        [contenteditable="true"] h1,
        [contenteditable="true"] h2,
        [contenteditable="true"] h3,
        [contenteditable="true"] h4,
        [contenteditable="true"] h5,
        [contenteditable="true"] h6,
        [contenteditable="true"] li,
        [contenteditable="true"] ul,
        [contenteditable="true"] ol,
        [contenteditable="true"] blockquote {
          direction: ltr !important;
          text-align: left !important;
          unicode-bidi: bidi-override !important;
        }
        
        [contenteditable="true"]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
          position: absolute;
          direction: ltr !important;
          text-align: left !important;
        }
        
        [contenteditable="true"] h1 {
          font-size: 1.8em;
          font-weight: bold;
          margin: 2em 0 1em 0;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 0.3em;
          direction: ltr !important;
          text-align: left !important;
        }
        
        [contenteditable="true"] h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 1.5em 0 0.5em 0;
          color: #374151;
          direction: ltr !important;
          text-align: left !important;
        }
        
        [contenteditable="true"] h3 {
          font-size: 1.25em;
          font-weight: bold;
          margin: 1em 0 0.5em 0;
          color: #4b5563;
          direction: ltr !important;
          text-align: left !important;
        }
        
        [contenteditable="true"] blockquote {
          border-left: 4px solid #d1d5db;
          padding-left: 1em;
          margin: 1em 0;
          font-style: italic;
          color: #6b7280;
          direction: ltr !important;
          text-align: left !important;
        }
        
        [contenteditable="true"] ul,
        [contenteditable="true"] ol {
          direction: ltr !important;
          text-align: left !important;
          padding-left: 2em;
          margin: 1em 0;
        }
        
        [contenteditable="true"] li {
          direction: ltr !important;
          text-align: left !important;
          margin: 0.5em 0;
        }
        
        [contenteditable="true"] p {
          margin: 0.5em 0;
          direction: ltr !important;
          text-align: left !important;
        }
      `}</style>
    </div>
  );
};

export default AdvancedRichTextEditor;
