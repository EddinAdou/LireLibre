/**
 * TestDescriptionField - Composant de test pour valider le champ description
 */

import React, { useState } from 'react';

const TestDescriptionField: React.FC = () => {
  const [description, setDescription] = useState('');
  const [clicks, setClicks] = useState(0);

  return (
    <div className="fixed top-4 right-4 bg-white border border-red-500 rounded-lg p-4 z-50 shadow-lg">
      <h3 className="text-sm font-bold text-red-600 mb-2">Test Description</h3>
      <textarea
        placeholder="Test de saisie..."
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
          console.log('Description changed:', e.target.value);
        }}
        onClick={() => {
          setClicks(clicks + 1);
          console.log('Description clicked:', clicks + 1);
        }}
        rows={2}
        className="w-full text-sm border border-gray-300 rounded p-2"
        style={{
          direction: 'ltr',
          textAlign: 'left',
          pointerEvents: 'auto',
          cursor: 'text'
        }}
      />
      <div className="text-xs text-gray-600 mt-1">
        Chars: {description.length} | Clicks: {clicks}
      </div>
    </div>
  );
};

export default TestDescriptionField;
