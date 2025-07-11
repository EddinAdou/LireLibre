import React from 'react';

interface PasswordStrengthProps {
  password: string;
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const calculateStrength = (pwd: string): number => {
    let strength = 0;
    if (pwd.length >= 8) strength += 1;
    if (pwd.match(/[a-z]/)) strength += 1;
    if (pwd.match(/[A-Z]/)) strength += 1;
    if (pwd.match(/[0-9]/)) strength += 1;
    if (pwd.match(/[^a-zA-Z0-9]/)) strength += 1;
    return strength;
  };

  const getStrengthText = (strength: number): string => {
    switch (strength) {
      case 0:
      case 1:
        return 'Très faible';
      case 2:
        return 'Faible';
      case 3:
        return 'Moyen';
      case 4:
        return 'Fort';
      case 5:
        return 'Très fort';
      default:
        return '';
    }
  };

  const getStrengthColor = (strength: number): string => {
    switch (strength) {
      case 0:
      case 1:
        return 'bg-red-500';
      case 2:
        return 'bg-orange-500';
      case 3:
        return 'bg-yellow-500';
      case 4:
        return 'bg-green-500';
      case 5:
        return 'bg-green-600';
      default:
        return 'bg-gray-300';
    }
  };

  const strength = calculateStrength(password);
  const percentage = password ? (strength / 5) * 100 : 0;

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-600">Force du mot de passe</span>
        <span className={`font-medium ${
          strength <= 1 ? 'text-red-600' :
          strength === 2 ? 'text-orange-600' :
          strength === 3 ? 'text-yellow-600' :
          'text-green-600'
        }`}>
          {getStrengthText(strength)}
        </span>
      </div>
      <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(strength)}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="mt-1 text-xs text-gray-500">
        <ul className="list-disc list-inside space-y-1">
          {password.length < 8 && (
            <li className="text-red-600">Au moins 8 caractères</li>
          )}
          {!password.match(/[a-z]/) && (
            <li className="text-red-600">Une lettre minuscule</li>
          )}
          {!password.match(/[A-Z]/) && (
            <li className="text-red-600">Une lettre majuscule</li>
          )}
          {!password.match(/[0-9]/) && (
            <li className="text-red-600">Un chiffre</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default PasswordStrength;
