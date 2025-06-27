import React, { createContext, useContext, useState, ReactNode } from 'react';
import { OnboardingData } from '@/types';
import { useAuth } from './AuthContext';

interface OnboardingContextType {
  onboardingData: Partial<OnboardingData>;
  updateOnboardingData: (data: Partial<OnboardingData>) => void;
  clearOnboardingData: () => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isCompleted: boolean;
  setIsCompleted: (completed: boolean) => void;
  completeOnboarding: () => Promise<boolean>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

interface OnboardingProviderProps {
  children: ReactNode;
  initialData?: Partial<OnboardingData>;
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ 
  children, 
  initialData = {} 
}) => {
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>(initialData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const { completeOnboarding: authCompleteOnboarding } = useAuth();

  const updateOnboardingData = (data: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...data }));
  };

  const clearOnboardingData = () => {
    setOnboardingData({});
    setCurrentStep(1);
    setIsCompleted(false);
  };

  const completeOnboarding = async (): Promise<boolean> => {
    try {
      const success = await authCompleteOnboarding(onboardingData);
      if (success) {
        setIsCompleted(true);
        clearOnboardingData();
      }
      return success;
    } catch (error) {
      console.error('Error completing onboarding:', error);
      return false;
    }
  };

  const value: OnboardingContextType = {
    onboardingData,
    updateOnboardingData,
    clearOnboardingData,
    currentStep,
    setCurrentStep,
    isCompleted,
    setIsCompleted,
    completeOnboarding,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = (): OnboardingContextType => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}; 