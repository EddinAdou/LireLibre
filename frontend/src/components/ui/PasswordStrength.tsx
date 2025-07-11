import React from 'react';

interface PasswordStrengthProps {
  password: string;
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const calculateStrength = (pwd: string): number => {
    let score = 0;
    
    // Longueur
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    
    // Caractères spéciaux
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    
    return score;
  };

  const getStrengthLabel = (score: number): { label: string; color: string } => {
    if (score < 2) return { label: 'Très faible', color: 'bg-red-500' };
    if (score < 4) return { label: 'Faible', color: 'bg-yellow-500' };
    if (score < 5) return { label: 'Moyen', color: 'bg-blue-500' };
    return { label: 'Fort', color: 'bg-green-500' };
  };

  const strength = calculateStrength(password);
  const { label, color } = getStrengthLabel(strength);
  const percentage = Math.min((strength / 6) * 100, 100);

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-600">Force du mot de passe:</span>
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="mt-1 text-xs text-gray-500">
        <ul className="list-disc list-inside space-y-1">
          <li className={password.length >= 8 ? 'text-green-600' : 'text-gray-400'}>
            Au moins 8 caractères
          </li>
          <li className={/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-400'}>
            Une majuscule
          </li>
          <li className={/[a-z]/.test(password) ? 'text-green-600' : 'text-gray-400'}>
            Une minuscule
          </li>
          <li className={/[0-9]/.test(password) ? 'text-green-600' : 'text-gray-400'}>
            Un chiffre
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PasswordStrength;
