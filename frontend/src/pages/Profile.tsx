import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Calendar, MapPin, Edit, Save, X, Settings, Shield, Bell } from 'lucide-react';
import AvatarUpload from '../components/ui/AvatarUpload';
import FormField from '../components/ui/FormField';

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
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  const [profile, setProfile] = useState<UserProfile>({
    username: user?.username || '',
    email: user?.email || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: '',
    location: '',
    website: '',
    birthDate: '',
    avatar: user?.avatar
  });

  const [originalProfile, setOriginalProfile] = useState<UserProfile>(profile);
  const [errors, setErrors] = useState<Partial<UserProfile>>({});

  useEffect(() => {
    // Simuler le chargement des données utilisateur
    const loadUserProfile = async () => {
      setIsLoading(true);
      // Ici vous appelleriez votre API pour récupérer les données complètes
      setTimeout(() => {
        const userData = {
          username: user?.username || '',
          email: user?.email || 'user@example.com',
          firstName: user?.firstName || '',
          lastName: user?.lastName || '',
          bio: 'Passionné de lecture et d\'écriture, j\'aime partager mes histoires.',
          location: 'France',
          website: '',
          birthDate: '1990-01-01',
          avatar: user?.avatar
        };
        setProfile(userData);
        setOriginalProfile(userData);
        setIsLoading(false);
      }, 1000);
    };

    loadUserProfile();
  }, [user]);

  const handleSave = async () => {
    setErrors({});
    
    // Validation simple
    const newErrors: Partial<UserProfile> = {};
    if (!profile.username.trim()) newErrors.username = 'Le nom d\'utilisateur est requis';
    if (!profile.email.trim()) newErrors.email = 'L\'email est requis';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    
    // Simuler la sauvegarde
    setTimeout(() => {
      setOriginalProfile(profile);
      setIsEditing(false);
      setIsLoading(false);
      // Ici vous appelleriez votre API pour sauvegarder
    }, 1500);
  };

  const handleCancel = () => {
    setProfile(originalProfile);
    setErrors({});
    setIsEditing(false);
  };

  const handleAvatarChange = (file: File) => {
    setIsAvatarUploading(true);
    
    // Simuler l'upload
    setTimeout(() => {
      const imageUrl = URL.createObjectURL(file);
      setProfile(prev => ({ ...prev, avatar: imageUrl }));
      setIsAvatarUploading(false);
    }, 2000);
  };

  const handleAvatarRemove = () => {
    setProfile(prev => ({ ...prev, avatar: undefined }));
  };

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'preferences', label: 'Préférences', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  if (isLoading && !profile.username) {
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
