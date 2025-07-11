import React from 'react';

const StoryList: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Découvrir les histoires
        </h1>
        <p className="text-gray-600">
          Explorez notre collection d'histoires créées par la communauté
        </p>
      </div>
      
      {/* Filters and search will be implemented */}
      <div className="text-center text-gray-500 py-16">
        Liste des histoires en cours de développement...
      </div>
    </div>
  );
};

export default StoryList;
