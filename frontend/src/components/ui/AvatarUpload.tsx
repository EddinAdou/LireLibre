import React, { useState, useRef } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import UserAvatar from './UserAvatar';

interface User {
  username?: string;
  avatar?: string;
  firstName?: string;
  lastName?: string;
}

interface AvatarUploadProps {
  user?: User | null;
  onAvatarChange: (file: File) => void;
  onAvatarRemove: () => void;
  isUploading?: boolean;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  user,
  onAvatarChange,
  onAvatarRemove,
  isUploading = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      onAvatarChange(file);
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Avatar Display */}
      <div className="relative">
        <UserAvatar user={user} size="lg" className="ring-4 ring-white shadow-lg" />
        
        {/* Remove Avatar Button */}
        {user?.avatar && (
          <button
            onClick={onAvatarRemove}
            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-colors duration-200"
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
          </button>
        )}
        
        {/* Upload Overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 w-full max-w-sm text-center transition-colors duration-200 ${
          dragOver
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />
        
        <div className="flex flex-col items-center space-y-3">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full">
            {dragOver ? (
              <Upload className="h-6 w-6 text-blue-500" />
            ) : (
              <Camera className="h-6 w-6 text-gray-400" />
            )}
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-900">
              {dragOver ? 'Déposez votre photo' : 'Changer la photo de profil'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG jusqu'à 5MB
            </p>
          </div>
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            disabled={isUploading}
          >
            {isUploading ? 'Upload...' : 'Parcourir'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarUpload;
