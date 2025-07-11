import React from 'react';

const FontDemo: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center font-manrope">
        Démonstration de la police Manrope
      </h1>
      
      <div className="space-y-6">
        {/* Poids de police */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 font-manrope">Poids de police</h2>
          <div className="space-y-3">
            <p className="font-manrope font-extralight text-lg">Extra Light (200) - Le texte le plus léger pour les accents subtils</p>
            <p className="font-manrope font-light text-lg">Light (300) - Parfait pour les sous-titres et descriptions</p>
            <p className="font-manrope font-normal text-lg">Regular (400) - Le poids standard pour le corps de texte</p>
            <p className="font-manrope font-medium text-lg">Medium (500) - Idéal pour mettre en évidence sans être trop fort</p>
            <p className="font-manrope font-semibold text-lg">Semi Bold (600) - Parfait pour les sous-titres importants</p>
            <p className="font-manrope font-bold text-lg">Bold (700) - Pour les titres et éléments importants</p>
            <p className="font-manrope font-extrabold text-lg">Extra Bold (800) - Pour les titres principaux qui attirent l'attention</p>
          </div>
        </section>

        {/* Tailles de texte */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 font-manrope">Tailles de texte</h2>
          <div className="space-y-4">
            <h1 className="font-manrope font-bold text-6xl">Titre Principal (6xl)</h1>
            <h2 className="font-manrope font-semibold text-4xl">Titre Secondaire (4xl)</h2>
            <h3 className="font-manrope font-semibold text-2xl">Sous-titre (2xl)</h3>
            <h4 className="font-manrope font-medium text-xl">Titre de section (xl)</h4>
            <p className="font-manrope font-normal text-lg">Texte large (lg) - Pour les introductions et descriptions importantes</p>
            <p className="font-manrope font-normal text-base">Texte normal (base) - Le texte standard pour le contenu principal</p>
            <p className="font-manrope font-normal text-sm">Texte petit (sm) - Pour les notes et informations secondaires</p>
          </div>
        </section>

        {/* Utilisation dans l'interface */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 font-manrope">Utilisation dans LireLibre</h2>
          
          {/* Simulation d'une carte d'histoire */}
          <div className="border rounded-lg p-4 mb-4">
            <h3 className="font-manrope font-semibold text-xl mb-2">Le Mystère de la Bibliothèque Enchantée</h3>
            <p className="font-manrope font-normal text-gray-600 mb-3">
              Une histoire collaborative fascinante qui vous emmènera dans un monde où les livres prennent vie...
            </p>
            <div className="flex items-center justify-between">
              <span className="font-manrope font-medium text-sm text-gray-500">Par @AuteurMystere</span>
              <span className="font-manrope font-medium text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Fantastique
              </span>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex gap-3">
            <button className="font-manrope font-semibold bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Lire l'histoire
            </button>
            <button className="font-manrope font-medium border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50">
              Ajouter aux favoris
            </button>
          </div>
        </section>

        {/* Lisibilité */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 font-manrope">Test de lisibilité</h2>
          <div className="font-manrope font-normal text-base leading-relaxed">
            <p className="mb-4">
              Manrope est une police sans-serif moderne qui offre une excellente lisibilité à l'écran. 
              Ses formes géométriques douces et ses espaces généreuses en font un choix parfait pour 
              une plateforme de lecture comme LireLibre.
            </p>
            <p className="mb-4">
              La police présente des caractéristiques distinctives : des terminaisons arrondies, 
              des ascendants et descendants équilibrés, et une hauteur d'x optimisée pour la lecture numérique. 
              Ces qualités permettent une lecture confortable même sur de longs textes.
            </p>
            <p>
              Avec ses 8 poids disponibles (de ExtraLight à ExtraBold), Manrope offre une grande 
              flexibilité typographique pour créer une hiérarchie visuelle claire et élégante.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FontDemo;
