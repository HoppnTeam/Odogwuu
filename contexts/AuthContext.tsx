import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { OnboardingData } from '@/types';
import { SecurityService } from '@/lib/security-service';
import { Alert } from 'react-native';

// User type for in-memory storage during onboarding
export interface TempUser {
  id?: string;
  email: string;
  full_name: string;
  onboarding_completed?: boolean;
}

interface AuthContextType {
  // In-memory user during onboarding
  tempUser: TempUser | null;
  setTempUser: (user: TempUser | null) => void;
  
  // Supabase authenticated user
  user: any | null;
  session: any | null;
  loading: boolean;
  
  // Enhanced auth methods with security
  signUp: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  
  // Onboarding completion
  completeOnboarding: (onboardingData: Partial<OnboardingData>) => Promise<boolean>;
  
  // Security methods
  checkSession: () => Promise<boolean>;
  forceLogout: (reason: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [tempUser, setTempUser] = useState<TempUser | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionCheckInterval, setSessionCheckInterval] = useState<ReturnType<typeof setInterval> | null>(null);

  // Session monitoring
  useEffect(() => {
    const checkSessionPeriodically = () => {
      const interval = setInterval(async () => {
        const { isAuthenticated, error } = await SecurityService.checkAuthentication();
        
        if (!isAuthenticated && user) {
          SecurityService.logSecurityEvent('SESSION_EXPIRED', { error });
          await forceLogout('Session expired');
        }
      }, 5 * 60 * 1000); // Check every 5 minutes
      
      setSessionCheckInterval(interval);
    };

    if (user) {
      checkSessionPeriodically();
    }

    return () => {
      if (sessionCheckInterval) {
        clearInterval(sessionCheckInterval);
      }
    };
  }, [user]);

  useEffect(() => {
    // Check for existing session on app start
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user) {
        SecurityService.logSecurityEvent('SESSION_RESTORED', { userId: session.user.id });
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Log security events
        if (event === 'SIGNED_IN' && session?.user) {
          SecurityService.logSecurityEvent('USER_SIGNED_IN', { userId: session.user.id });
        } else if (event === 'SIGNED_OUT') {
          SecurityService.logSecurityEvent('USER_SIGNED_OUT', {});
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          SecurityService.logSecurityEvent('TOKEN_REFRESHED', { userId: session.user.id });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      
      // Validate inputs
      const emailValidation = SecurityService.validateEmail(email);
      if (!emailValidation.isValid) {
        return { success: false, error: emailValidation.error };
      }
      
      const passwordValidation = SecurityService.validatePassword(password);
      if (!passwordValidation.isValid) {
        return { success: false, error: passwordValidation.error };
      }
      
      const nameValidation = SecurityService.validateName(fullName);
      if (!nameValidation.isValid) {
        return { success: false, error: nameValidation.error };
      }
      
      // Sanitize inputs
      const sanitizedEmail = SecurityService.sanitizeInput(email);
      const sanitizedName = SecurityService.sanitizeInput(fullName);
      
      // Create Supabase auth user
      const { data, error } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password,
        options: { data: { full_name: sanitizedName } }
      });
      
      if (error) {
        SecurityService.logSecurityEvent('SIGNUP_FAILED', { error: error.message, email: sanitizedEmail });
        throw error;
      }
      
      // Create user profile in database immediately
      if (data.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: sanitizedEmail,
            full_name: sanitizedName,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (profileError) {
          console.error('Error creating user profile:', profileError);
          SecurityService.logSecurityEvent('PROFILE_CREATION_FAILED', { userId: data.user.id, error: profileError.message });
        }
      }
      
      // Store user info in memory for onboarding
      setTempUser({
        id: data.user?.id,
        email: sanitizedEmail,
        full_name: sanitizedName,
        onboarding_completed: false
      });
      
      SecurityService.logSecurityEvent('SIGNUP_SUCCESS', { userId: data.user?.id, email: sanitizedEmail });
      return { success: true };
    } catch (error: any) {
      console.error('Sign up error:', error);
      SecurityService.logSecurityEvent('SIGNUP_ERROR', { error: error.message });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      
      // Check login attempts
      const loginCheck = SecurityService.checkLoginAttempts(email);
      if (!loginCheck.canAttempt) {
        const remainingMinutes = Math.ceil((loginCheck.remainingTime || 0) / 60000);
        return { 
          success: false, 
          error: `Too many failed attempts. Please try again in ${remainingMinutes} minutes.` 
        };
      }
      
      // Validate email
      const emailValidation = SecurityService.validateEmail(email);
      if (!emailValidation.isValid) {
        SecurityService.recordLoginAttempt(email, false);
        return { success: false, error: emailValidation.error };
      }
      
      // Sanitize email
      const sanitizedEmail = SecurityService.sanitizeInput(email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password
      });
      
      if (error) {
        SecurityService.recordLoginAttempt(sanitizedEmail, false);
        SecurityService.logSecurityEvent('SIGNIN_FAILED', { error: error.message, email: sanitizedEmail });
        throw error;
      }
      
      SecurityService.recordLoginAttempt(sanitizedEmail, true);
      SecurityService.logSecurityEvent('SIGNIN_SUCCESS', { userId: data.user?.id, email: sanitizedEmail });
      return { success: true };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setLoading(true);
      SecurityService.logSecurityEvent('USER_LOGOUT', { userId: user?.id });
      await supabase.auth.signOut();
      setTempUser(null);
      setUser(null);
      setSession(null);
      
      // Clear session check interval
      if (sessionCheckInterval) {
        clearInterval(sessionCheckInterval);
        setSessionCheckInterval(null);
      }
    } catch (error) {
      console.error('Sign out error:', error);
      SecurityService.logSecurityEvent('LOGOUT_ERROR', { error: error });
    } finally {
      setLoading(false);
    }
  };

  const forceLogout = async (reason: string): Promise<void> => {
    await SecurityService.forceLogout(reason);
    await signOut();
  };

  const checkSession = async (): Promise<boolean> => {
    const { isAuthenticated } = await SecurityService.checkAuthentication();
    return isAuthenticated;
  };

  const completeOnboarding = async (onboardingData: Partial<OnboardingData>): Promise<boolean> => {
    try {
      if (!tempUser || !user) {
        throw new Error('No user available for onboarding completion');
      }

      // Validate user permissions
      const hasPermission = await SecurityService.checkPermission(user.id, 'update_own_profile');
      if (!hasPermission) {
        SecurityService.logSecurityEvent('UNAUTHORIZED_ONBOARDING', { userId: user.id });
        throw new Error('Unauthorized to complete onboarding');
      }

      // Import and use the onboarding service
      const { onboardingService } = await import('@/lib/onboarding-service');

      // Save onboarding data to both users and onboarding_data tables
      const result = await onboardingService.saveOnboardingData(user.id, onboardingData);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to save onboarding data');
      }

      // Update temp user with onboarding completion
      const updatedTempUser = { ...tempUser, onboarding_completed: true };
      setTempUser(updatedTempUser);

      // Clear temp user and redirect to home
      setTempUser(null);
      router.replace('/(tabs)');
      
      SecurityService.logSecurityEvent('ONBOARDING_COMPLETED', { userId: user.id });
      return true;
    } catch (error) {
      console.error('Onboarding completion error:', error);
      SecurityService.logSecurityEvent('ONBOARDING_ERROR', { userId: user?.id, error: error });
      return false;
    }
  };

  const value: AuthContextType = {
    tempUser,
    setTempUser,
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    completeOnboarding,
    checkSession,
    forceLogout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 