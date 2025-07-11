import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Calendar, MapPin, Edit, Save, X, Settings, Shield, Bell } from 'lucide-react';
import AvatarUpload from '../components/ui/AvatarUpload';
import FormField from '../components/ui/FormField';
import { ProfileService, ProfileData } from '../services/profileService';
import { UPLOAD_BASE_URL } from '../config.ts';

interface UserProfile {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  bio: string;
  location: string;
  website: string;
  birthDate: string;
  avatar?: string;
}

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [profile, setProfile] = useState<UserProfile>({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    bio: '',
    location: '',
    website: '',
    birthDate: '',
    avatar: undefined
  });

  const [originalProfile, setOriginalProfile] = useState<UserProfile>(profile);
  const [errors, setErrors] = useState<Partial<UserProfile>>({});

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setLoadingProfile(true);
        const profileData = await ProfileService.getProfile();
        
        const userData: UserProfile = {
          username: profileData.username || '',
          email: profileData.email || '',
          firstName: profileData.firstName || '',
          lastName: profileData.lastName || '',
          bio: profileData.bio || '',
          location: profileData.location || '',
          website: profileData.website || '',
          birthDate: profileData.birthDate || '',
          avatar: profileData.avatar
        };
        
        setProfile(userData);
        setOriginalProfile(userData);
      } catch (error) {
        console.error('Erreur lors du chargement du profil:', error);
        setMessage({
          type: 'error',
          text: 'Erreur lors du chargement du profil'
        });
      } finally {
        setLoadingProfile(false);
      }
    };

    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const handleSave = async () => {
    setErrors({});
    setMessage(null);
    
    // Validation simple
    const newErrors: Partial<UserProfile> = {};
    if (!profile.username.trim()) newErrors.username = 'Le nom d\'utilisateur est requis';
    if (!profile.email.trim()) newErrors.email = 'L\'email est requis';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    
    try {
      const updatedProfile = await ProfileService.updateProfile({
        username: profile.username,
        email: profile.email,
        firstName: profile.firstName || undefined,
        lastName: profile.lastName || undefined,
        bio: profile.bio || undefined,
        location: profile.location || undefined,
        website: profile.website || undefined,
        birthDate: profile.birthDate || undefined
      });

      // Mettre à jour l'état local
      const newProfileData = {
        ...profile,
        username: updatedProfile.username,
        email: updatedProfile.email,
        firstName: updatedProfile.firstName || '',
        lastName: updatedProfile.lastName || '',
        bio: updatedProfile.bio || '',
        location: updatedProfile.location || '',
        website: updatedProfile.website || '',
        birthDate: updatedProfile.birthDate || '',
        avatar: updatedProfile.avatar
      };

      setProfile(newProfileData);
      setOriginalProfile(newProfileData);
      
      // Mettre à jour le contexte d'authentification
      if (user) {
        updateUser({
          ...user,
          username: updatedProfile.username,
          email: updatedProfile.email,
          firstName: updatedProfile.firstName,
          lastName: updatedProfile.lastName,
          avatar: updatedProfile.avatar
        });
      }

      setIsEditing(false);
      setMessage({
        type: 'success',
        text: 'Profil mis à jour avec succès !'
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Erreur lors de la sauvegarde'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setProfile(originalProfile);
    setErrors({});
    setIsEditing(false);
  };

  const handleAvatarChange = async (file: File) => {
    setIsAvatarUploading(true);
    setMessage(null);
    
    try {
      const avatarUrl = await ProfileService.uploadAvatar(file);
      
      // Mettre à jour le profil local
      const updatedProfile = { ...profile, avatar: avatarUrl };
      setProfile(updatedProfile);
      setOriginalProfile(updatedProfile);
      
      // Mettre à jour le contexte d'authentification
      if (user) {
        updateUser({
          ...user,
          avatar: avatarUrl
        });
      }
      
      setMessage({
        type: 'success',
        text: 'Avatar mis à jour avec succès !'
      });
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Erreur lors de l\'upload de l\'avatar'
      });
    } finally {
      setIsAvatarUploading(false);
    }
  };

  const handleAvatarRemove = async () => {
    try {
      await ProfileService.removeAvatar();
      
      // Mettre à jour le profil local
      const updatedProfile = { ...profile, avatar: undefined };
      setProfile(updatedProfile);
      setOriginalProfile(updatedProfile);
      
      // Mettre à jour le contexte d'authentification
      if (user) {
        updateUser({
          ...user,
          avatar: undefined
        });
      }
      
      setMessage({
        type: 'success',
        text: 'Avatar supprimé avec succès !'
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Erreur lors de la suppression de l\'avatar'
      });
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'preferences', label: 'Préférences', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  if (loadingProfile) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Mon profil
        </h1>
        <p className="text-gray-600">
          Gérez vos informations personnelles et vos préférences
        </p>
      </div>

      {/* Messages */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* Avatar Section */}
            <div className="text-center mb-6">
              <AvatarUpload
                user={profile}
                onAvatarChange={handleAvatarChange}
                onAvatarRemove={handleAvatarRemove}
                isUploading={isAvatarUploading}
              />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {profile.firstName || profile.lastName 
                  ? `${profile.firstName} ${profile.lastName}`.trim()
                  : profile.username
                }
              </h3>
              <p className="text-sm text-gray-500">@{profile.username}</p>
            </div>

            {/* Navigation Tabs */}
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {activeTab === 'profile' && (
              <div className="p-6">
                {/* Profile Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Informations personnelles
                  </h2>
                  
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Modifier</span>
                    </button>
                  ) : (
                    <div className="flex space-x-3">
                      <button
                        onClick={handleCancel}
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        <X className="h-4 w-4" />
                        <span>Annuler</span>
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors duration-200"
                      >
                        {isLoading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        <span>{isLoading ? 'Sauvegarde...' : 'Sauvegarder'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Profile Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Nom d'utilisateur"
                    id="username"
                    value={profile.username}
                    onChange={(value) => setProfile(prev => ({ ...prev, username: value }))}
                    placeholder="Votre nom d'utilisateur"
                    required
                    disabled={!isEditing}
                    error={errors.username}
                    icon={<User className="h-5 w-5" />}
                  />

                  <FormField
                    label="Email"
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(value) => setProfile(prev => ({ ...prev, email: value }))}
                    placeholder="votre@email.com"
                    required
                    disabled={!isEditing}
                    error={errors.email}
                    icon={<Mail className="h-5 w-5" />}
                  />

                  <FormField
                    label="Prénom"
                    id="firstName"
                    value={profile.firstName}
                    onChange={(value) => setProfile(prev => ({ ...prev, firstName: value }))}
                    placeholder="Votre prénom"
                    disabled={!isEditing}
                  />

                  <FormField
                    label="Nom"
                    id="lastName"
                    value={profile.lastName}
                    onChange={(value) => setProfile(prev => ({ ...prev, lastName: value }))}
                    placeholder="Votre nom"
                    disabled={!isEditing}
                  />

                  <FormField
                    label="Date de naissance"
                    id="birthDate"
                    type="text"
                    value={profile.birthDate}
                    onChange={(value) => setProfile(prev => ({ ...prev, birthDate: value }))}
                    placeholder="jj/mm/aaaa"
                    disabled={!isEditing}
                    icon={<Calendar className="h-5 w-5" />}
                  />

                  <FormField
                    label="Localisation"
                    id="location"
                    value={profile.location}
                    onChange={(value) => setProfile(prev => ({ ...prev, location: value }))}
                    placeholder="Votre ville, pays"
                    disabled={!isEditing}
                    icon={<MapPin className="h-5 w-5" />}
                  />

                  <div className="md:col-span-2">
                    <FormField
                      label="Site web"
                      id="website"
                      value={profile.website}
                      onChange={(value) => setProfile(prev => ({ ...prev, website: value }))}
                      placeholder="https://votre-site.com"
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <FormField
                      label="Biographie"
                      id="bio"
                      type="textarea"
                      value={profile.bio}
                      onChange={(value) => setProfile(prev => ({ ...prev, bio: value }))}
                      placeholder="Parlez-nous de vous..."
                      disabled={!isEditing}
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Sécurité du compte
                </h2>
                <div className="text-center text-gray-500 py-16">
                  Paramètres de sécurité en cours de développement...
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Préférences
                </h2>
                <div className="text-center text-gray-500 py-16">
                  Préférences en cours de développement...
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Notifications
                </h2>
                <div className="text-center text-gray-500 py-16">
                  Paramètres de notifications en cours de développement...
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
