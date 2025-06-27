import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { OnboardingData } from '@/types';

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
  
  // Simplified auth methods
  signUp: (email: string, password: string, fullName: string) => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  
  // Onboarding completion
  completeOnboarding: (onboardingData: Partial<OnboardingData>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [tempUser, setTempUser] = useState<TempUser | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app start
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Create Supabase auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } }
      });
      
      if (error) throw error;
      
      // Create user profile in database immediately
      if (data.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: email,
            full_name: fullName,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (profileError) {
          console.error('Error creating user profile:', profileError);
          // Don't throw error here, as the auth user was created successfully
        }
      }
      
      // Store user info in memory for onboarding
      setTempUser({
        id: data.user?.id,
        email,
        full_name: fullName,
        onboarding_completed: false
      });
      
      return true;
    } catch (error) {
      console.error('Sign up error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Sign in error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setTempUser(null);
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeOnboarding = async (onboardingData: Partial<OnboardingData>): Promise<boolean> => {
    try {
      if (!tempUser || !user) {
        throw new Error('No user available for onboarding completion');
      }

      // Update temp user with onboarding completion
      const updatedTempUser = { ...tempUser, onboarding_completed: true };
      setTempUser(updatedTempUser);

      // Convert onboarding data to database format
      const dietaryPreferences = onboardingData.dietaryPreferences?.map(pref => pref) || [];
      const spiceTolerance = onboardingData.spiceLevel || 3;

      // Save complete user profile to Supabase (upsert to handle both new and existing profiles)
      const { error } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: tempUser.email,
          full_name: tempUser.full_name,
          dietary_preferences: dietaryPreferences,
          spice_tolerance: spiceTolerance,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        });

      if (error) throw error;

      // Clear temp user and redirect to home
      setTempUser(null);
      router.replace('/(tabs)');
      
      return true;
    } catch (error) {
      console.error('Onboarding completion error:', error);
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
    completeOnboarding
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