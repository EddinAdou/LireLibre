import React from 'react';

const WriteStory: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Écrire une nouvelle histoire
        </h1>
        <p className="text-gray-600">
          Donnez vie à votre imagination et partagez votre histoire avec la communauté
        </p>
      </div>
      
      <div className="text-center text-gray-500 py-16">
        Éditeur d'histoire en cours de développement...
      </div>
    </div>
  );
};

export default WriteStory;
