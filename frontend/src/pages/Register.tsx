import React from 'react';

const Register: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Créer un compte
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Rejoignez notre communauté d'auteurs et de lecteurs
          </p>
        </div>
        {/* Form will be implemented with React Hook Form */}
        <div className="text-center text-gray-500">
          Formulaire d'inscription en cours de développement...
        </div>
      </div>
    </div>
  );
};

export default Register;
