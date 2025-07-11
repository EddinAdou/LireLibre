import React from 'react';

interface PasswordStrengthIndicatorProps {
  password: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const calculateStrength = (password: string): { score: number; label: string; color: string } => {
    if (!password) return { score: 0, label: '', color: 'bg-gray-200' };

    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Character variety
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^a-zA-Z\d]/.test(password)) score += 1;

    const strengthLevels = [
      { score: 0, label: '', color: 'bg-gray-200' },
      { score: 1, label: 'Très faible', color: 'bg-red-500' },
      { score: 2, label: 'Faible', color: 'bg-red-400' },
      { score: 3, label: 'Moyen', color: 'bg-yellow-500' },
      { score: 4, label: 'Fort', color: 'bg-green-500' },
      { score: 5, label: 'Très fort', color: 'bg-green-600' },
      { score: 6, label: 'Excellent', color: 'bg-green-700' },
    ];

    return strengthLevels.find(level => level.score === Math.min(score, 6)) || strengthLevels[0];
  };

  const strength = calculateStrength(password);

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex items-center space-x-2">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
            style={{ width: `${(strength.score / 6) * 100}%` }}
          />
        </div>
        <span className={`text-xs font-medium ${
          strength.score <= 2 ? 'text-red-600' : 
          strength.score <= 3 ? 'text-yellow-600' : 
          'text-green-600'
        }`}>
          {strength.label}
        </span>
      </div>
      
      {password && strength.score < 4 && (
        <div className="mt-2 text-xs text-gray-600">
          <p className="font-medium">Pour un mot de passe plus sûr :</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            {password.length < 8 && <li>Au moins 8 caractères</li>}
            {!/[a-z]/.test(password) && <li>Une lettre minuscule</li>}
            {!/[A-Z]/.test(password) && <li>Une lettre majuscule</li>}
            {!/\d/.test(password) && <li>Un chiffre</li>}
            {!/[^a-zA-Z\d]/.test(password) && <li>Un caractère spécial</li>}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;
