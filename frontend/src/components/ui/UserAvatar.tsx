import React from 'react';
import { User } from 'lucide-react';
import { UPLOAD_BASE_URL } from '../../config.ts';

interface UserAvatarProps {
  user?: {
    username?: string;
    avatar?: string;
    firstName?: string;
    lastName?: string;
  } | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ user, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-lg'
  };

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    if (user?.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  if (user?.avatar) {
    const avatarUrl = user.avatar.startsWith('http') ? user.avatar : `${UPLOAD_BASE_URL}${user.avatar}`;
    return (
      <img
        src={avatarUrl}
        alt={user.username || 'Avatar utilisateur'}
        className={`${sizeClasses[size]} rounded-full object-cover border-2 border-white shadow-sm ${className}`}
      />
    );
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white font-semibold shadow-sm ${className}`}>
      {user ? getInitials() : <User className="w-1/2 h-1/2" />}
    </div>
  );
};

export default UserAvatar;
