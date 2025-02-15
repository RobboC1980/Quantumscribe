import { useState } from 'react';
import { Steps, Button, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import styles from './Steps.module.css';

const { Step } = Steps;
const { Title, Paragraph } = Typography;

const steps = [
  {
    title: 'Welcome',
    content: 'Let\'s set up your QuantumScribe experience',
  },
  {
    title: 'Preferences',
    content: 'Choose your default project settings',
  },
  {
    title: 'Team Setup',
    content: 'Invite team members (optional)',
  },
];

export default function OnboardingFlow() {
  const [current, setCurrent] = useState(0);
  const router = useRouter();

  const completeOnboarding = () => {
    // TODO: Save onboarding state to Supabase
    router.push('/dashboard');
  };

  return (
    <div className={styles.container}>
      <Steps current={current}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      
      <div className={styles.stepsContent}>
        <Title level={3}>{steps[current].title}</Title>
        <Paragraph>{steps[current].content}</Paragraph>
      </div>
      
      <div className={styles.stepsAction}>
        {current > 0 && (
          <Button onClick={() => setCurrent(current - 1)}>
            Previous
          </Button>
        )}
        <Button 
          type="primary" 
          onClick={() => current < steps.length - 1 
            ? setCurrent(current + 1) 
            : completeOnboarding()}
          className={styles.nextButton}
        >
          {current === steps.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </div>
    </div>
  );
} 