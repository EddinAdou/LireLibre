import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, PenTool, Users, Star } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Bienvenue sur LireLibre
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              La plateforme collaborative où les histoires prennent vie. 
              Écrivez, partagez et découvrez des récits passionnants créés par notre communauté.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/stories"
                className="bg-white text-primary hover:bg-gray-50 px-8 py-3 rounded-lg font-semibold text-lg inline-flex items-center justify-center"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Découvrir les histoires
              </Link>
              <Link
                to="/register"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-3 rounded-lg font-semibold text-lg inline-flex items-center justify-center"
              >
                <PenTool className="mr-2 h-5 w-5" />
                Commencer à écrire
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Pourquoi choisir LireLibre ?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Une plateforme pensée pour les auteurs et les lecteurs passionnés
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <PenTool className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Écriture simplifiée
            </h3>
            <p className="text-gray-600">
              Un éditeur intuitif pour donner vie à vos idées. 
              Organisez vos chapitres, genres et tags facilement.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Communauté active
            </h3>
            <p className="text-gray-600">
              Échangez avec d'autres auteurs et lecteurs. 
              Recevez des commentaires constructifs sur vos œuvres.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Découverte personnalisée
            </h3>
            <p className="text-gray-600">
              Trouvez des histoires qui vous correspondent grâce à nos filtres 
              et recommandations intelligentes.
            </p>
          </div>
        </div>
      </section>

      {/* Popular Stories Section */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Histoires populaires
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez les récits les plus appréciés par notre communauté
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Placeholder for popular stories */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-400"></div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Histoire exemple {i}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Un aperçu captivant de cette histoire qui donne envie d'en savoir plus...
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Par Auteur{i}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">4.{i + 5}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/stories"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-lg font-semibold inline-flex items-center"
            >
              Voir toutes les histoires
              <BookOpen className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Prêt à partager votre histoire ?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Rejoignez des milliers d'auteurs qui ont déjà publié leurs œuvres sur LireLibre
            </p>
            <Link
              to="/register"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 rounded-lg font-semibold text-lg inline-flex items-center"
            >
              <PenTool className="mr-2 h-5 w-5" />
              Créer mon compte
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
