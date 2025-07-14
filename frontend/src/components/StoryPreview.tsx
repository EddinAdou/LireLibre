/**
 * StoryPreview - Composant de prévisualisation d'histoire
 * Affiche un aperçu de l'histoire avec statistiques et graphiques
 */

import React, { useMemo } from 'react';
import { BookOpen, Clock, BarChart3, TrendingUp, Users, Heart } from 'lucide-react';

interface StoryPreviewProps {
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  coverImage?: File;
  coverImageUrl?: string;
}

interface TextStatistics {
  wordCount: number;
  characterCount: number;
  paragraphCount: number;
  sentenceCount: number;
  readingTime: number;
  readabilityScore: number;
  averageWordsPerSentence: number;
  averageSentencesPerParagraph: number;
}

const StoryPreview: React.FC<StoryPreviewProps> = ({
  title,
  description,
  content,
  category,
  tags,
  coverImage,
  coverImageUrl,
}) => {
  // Calculer les statistiques du texte
  const textStats: TextStatistics = useMemo(() => {
    const plainText = content.replace(/<[^>]*>/g, ''); // Supprimer HTML
    const words = plainText.trim().split(/\s+/).filter(word => word.length > 0);
    const characters = plainText.length;
    const paragraphs = content.split(/<\/p>|<br\s*\/?>|\n\n/).filter(p => p.trim().length > 0);
    const sentences = plainText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    const wordCount = words.length;
    const readingTime = Math.ceil(wordCount / 200); // 200 mots/minute
    const averageWordsPerSentence = sentences.length > 0 ? wordCount / sentences.length : 0;
    const averageSentencesPerParagraph = paragraphs.length > 0 ? sentences.length / paragraphs.length : 0;
    
    // Score de lisibilité simplifié (basé sur la longueur des phrases)
    const readabilityScore = Math.max(0, Math.min(100, 100 - (averageWordsPerSentence - 15) * 2));

    return {
      wordCount,
      characterCount: characters,
      paragraphCount: paragraphs.length,
      sentenceCount: sentences.length,
      readingTime,
      readabilityScore,
      averageWordsPerSentence,
      averageSentencesPerParagraph,
    };
  }, [content]);

  // Données pour les graphiques
  const chartData = [
    { label: 'Mots', value: textStats.wordCount, color: 'bg-blue-500', max: 2000 },
    { label: 'Paragraphes', value: textStats.paragraphCount, color: 'bg-green-500', max: 50 },
    { label: 'Phrases', value: textStats.sentenceCount, color: 'bg-purple-500', max: 100 },
    { label: 'Lisibilité', value: textStats.readabilityScore, color: 'bg-orange-500', max: 100 },
  ];

  return (
    <div className="space-y-6">
      {/* Header de prévisualisation */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
        <div className="flex items-center space-x-3 mb-4">
          <BookOpen className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Aperçu de votre histoire</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{textStats.wordCount}</div>
            <div className="text-sm text-gray-600">Mots</div>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="text-2xl font-bold text-green-600">{textStats.readingTime}</div>
            <div className="text-sm text-gray-600">Min lecture</div>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="text-2xl font-bold text-purple-600">{textStats.paragraphCount}</div>
            <div className="text-sm text-gray-600">Paragraphes</div>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="text-2xl font-bold text-orange-600">{Math.round(textStats.readabilityScore)}</div>
            <div className="text-sm text-gray-600">Lisibilité</div>
          </div>
        </div>
      </div>

      {/* Graphiques de progression */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          Statistiques visuelles
        </h3>
        
        <div className="space-y-4">
          {chartData.map((item) => (
            <div key={item.label} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">{item.label}</span>
                <span className="text-gray-600">{item.value} / {item.max}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${item.color} transition-all duration-500`}
                  style={{ width: `${Math.min(100, (item.value / item.max) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Aperçu de l'histoire */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Image de couverture */}
        {(coverImage || coverImageUrl) && (
          <div className="h-48 bg-gray-200 overflow-hidden">
            <img
              src={coverImage ? URL.createObjectURL(coverImage) : coverImageUrl}
              alt="Couverture"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {/* Contenu de l'aperçu */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {category}
            </span>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {textStats.readingTime} min
              </span>
              <span className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {textStats.wordCount} mots
              </span>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            {title || 'Titre de votre histoire'}
          </h1>
          
          {description && (
            <p className="text-gray-600 mb-4 italic">
              {description}
            </p>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Contenu (aperçu) */}
          <div className="prose prose-lg max-w-none text-gray-800">
            <div 
              dangerouslySetInnerHTML={{ __html: content || '<p class="text-gray-400 italic">Commencez à écrire pour voir l\'aperçu...</p>' }}
            />
          </div>
        </div>
      </div>

      {/* Analyse avancée */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Analyse de l'écriture
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Mots par phrase (moyenne)</span>
              <span className="text-sm font-medium">{Math.round(textStats.averageWordsPerSentence)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Phrases par paragraphe</span>
              <span className="text-sm font-medium">{Math.round(textStats.averageSentencesPerParagraph)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Caractères (avec espaces)</span>
              <span className="text-sm font-medium">{textStats.characterCount.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Score de lisibilité</span>
              <span className={`text-sm font-medium ${
                textStats.readabilityScore >= 70 ? 'text-green-600' :
                textStats.readabilityScore >= 50 ? 'text-orange-600' : 'text-red-600'
              }`}>
                {Math.round(textStats.readabilityScore)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Niveau estimé</span>
              <span className="text-sm font-medium">
                {textStats.readabilityScore >= 80 ? 'Très facile' :
                 textStats.readabilityScore >= 60 ? 'Facile' :
                 textStats.readabilityScore >= 40 ? 'Moyen' : 'Difficile'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Temps d'écriture estimé</span>
              <span className="text-sm font-medium">{Math.round(textStats.wordCount / 50)} min</span>
            </div>
          </div>
        </div>
      </div>

      {/* Conseils d'amélioration */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border border-yellow-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <Heart className="h-5 w-5 mr-2 text-red-500" />
          Conseils pour améliorer votre histoire
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {textStats.wordCount < 300 && (
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-sm font-medium text-orange-800 mb-1">📝 Développez votre histoire</div>
              <div className="text-xs text-gray-600">Ajoutez plus de détails pour enrichir votre récit</div>
            </div>
          )}
          
          {textStats.averageWordsPerSentence > 25 && (
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-sm font-medium text-blue-800 mb-1">✂️ Phrases trop longues</div>
              <div className="text-xs text-gray-600">Essayez de faire des phrases plus courtes</div>
            </div>
          )}
          
          {textStats.paragraphCount < 3 && textStats.wordCount > 200 && (
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-sm font-medium text-green-800 mb-1">📄 Ajoutez des paragraphes</div>
              <div className="text-xs text-gray-600">Divisez votre texte pour faciliter la lecture</div>
            </div>
          )}
          
          {textStats.readabilityScore >= 70 && (
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-sm font-medium text-purple-800 mb-1">🎉 Excellente lisibilité!</div>
              <div className="text-xs text-gray-600">Votre texte est facile à lire et comprendre</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryPreview;
