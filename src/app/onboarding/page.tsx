'use client';

import { useState, useEffect } from 'react';
import { Alert, Steps, Typography } from 'antd';
import { createClient } from '@/utils/supabase';
import { useRouter } from 'next/navigation';
import { LoadingOutlined } from '@ant-design/icons';
import LoadingSpinner from '@/components/LoadingSpinner';
import WelcomeStep from './components/WelcomeStep';
import PreferencesStep from './components/PreferencesStep';
import TeamSetupStep from './components/TeamSetupStep';
import styles from './page.module.css';

const { Title } = Typography;

const steps = [
  {
    title: 'Welcome',
    description: 'Get started with QuantumScribe',
  },
  {
    title: 'Preferences',
    description: 'Customize your experience',
  },
  {
    title: 'Team Setup',
    description: 'Invite your team members',
  }
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [preferences, setPreferences] = useState({});
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleNext = async (stepData: any) => {
    try {
      setLoading(true);
      
      // Save step data
      switch (currentStep) {
        case 0:
          // Welcome step - just proceed
          break;
        case 1:
          // Save preferences
          setPreferences({ ...preferences, ...stepData });
          const { error: prefError } = await supabase
            .from('users')
            .update({ preferences: { ...preferences, ...stepData } })
            .eq('id', (await supabase.auth.getUser()).data.user?.id);
          if (prefError) throw prefError;
          break;
        case 2:
          // Handle team invites
          if (stepData.invites?.length) {
            // TODO: Implement team invite functionality
          }
          // Redirect to dashboard after final step
          router.push('/dashboard');
          return;
      }

      setCurrentStep(prev => prev + 1);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  if (loading) {
    return <LoadingSpinner tip="Loading..." />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Title level={2} className={styles.title}>
          {steps[currentStep].title}
        </Title>

        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            className={styles.alert}
          />
        )}

        <Steps
          current={currentStep}
          items={steps}
          className={styles.steps}
        />

        <div className={styles.stepContent}>
          {currentStep === 0 && (
            <WelcomeStep onNext={handleNext} />
          )}
          {currentStep === 1 && (
            <PreferencesStep 
              onNext={handleNext}
              onBack={handleBack}
              loading={loading}
            />
          )}
          {currentStep === 2 && (
            <TeamSetupStep
              onNext={handleNext}
              onBack={handleBack}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
} 