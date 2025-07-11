import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, User, LoginCredentials, RegisterCredentials } from '../types';
import { authService } from '../services/authService';
import { sessionService } from '../services/sessionService';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials & { rememberMe?: boolean }) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  sessionInfo: {
    isActive: boolean;
    startTime: number | null;
    duration: number;
    rememberMe: boolean;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_TOKEN'; payload: string }
  | { type: 'SET_SESSION_INFO'; payload: any }
  | { type: 'LOGOUT' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'SET_TOKEN':
      return { ...state, token: action.payload };
    case 'LOGOUT':
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  token: sessionService.getStoredToken(),
  isAuthenticated: false,
  isLoading: false,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Initialize session service
    sessionService.initialize({
      onSessionExpired: () => {
        console.log('Session expirée, déconnexion automatique');
        dispatch({ type: 'LOGOUT' });
      },
      onTokenRefreshed: (newToken: string) => {
        console.log('Token rafraîchi automatiquement');
        dispatch({ type: 'SET_TOKEN', payload: newToken });
      }
    });

    const token = sessionService.getStoredToken();
    console.log('AuthContext useEffect - Token found:', !!token);
    
    if (token && sessionService.isSessionValid()) {
      dispatch({ type: 'SET_TOKEN', payload: token });
      // Verify token and get user data
      console.log('Attempting to get current user...');
      authService.getCurrentUser()
        .then(user => {
          console.log('User retrieved successfully:', user);
          dispatch({ type: 'SET_USER', payload: user });
          sessionService.startSession();
        })
        .catch((error) => {
          console.error('Failed to get current user:', error);
          sessionService.endSession();
          dispatch({ type: 'LOGOUT' });
        });
    } else if (token) {
      // Token exists but session is invalid
      console.log('Token exists but session is invalid, cleaning up...');
      sessionService.endSession();
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  const login = async (credentials: LoginCredentials & { rememberMe?: boolean }) => {
    try {
      console.log('Starting login process...', credentials.email);
      dispatch({ type: 'SET_LOADING', payload: true });
      const { user, token, refresh_token } = await authService.login(credentials);
      console.log('Login successful, received:', { user, token: !!token, refresh_token: !!refresh_token });
      
      // Store tokens with session service
      sessionService.storeToken(token, refresh_token, credentials.rememberMe || false);
      sessionService.startSession();
      
      dispatch({ type: 'SET_TOKEN', payload: token });
      dispatch({ type: 'SET_USER', payload: user });
      console.log('Login process completed');
    } catch (error) {
      console.error('Login failed:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { user, token, refresh_token } = await authService.register(credentials);
      
      // Store tokens (default to not remember for registration)
      sessionService.storeToken(token, refresh_token, false);
      sessionService.startSession();
      
      dispatch({ type: 'SET_TOKEN', payload: token });
      dispatch({ type: 'SET_USER', payload: user });
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      sessionService.endSession();
      dispatch({ type: 'LOGOUT' });
    }
  };

  const updateUser = (user: User) => {
    dispatch({ type: 'SET_USER', payload: user });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateUser,
        sessionInfo: sessionService.getSessionInfo(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
