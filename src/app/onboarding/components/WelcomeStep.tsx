'use client';

import { Button, Typography, Card, List } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import styles from './Steps.module.css';

const { Title, Paragraph } = Typography;

interface WelcomeStepProps {
  onNext: (data: any) => void;
}

export default function WelcomeStep({ onNext }: WelcomeStepProps) {
  const features = [
    {
      title: 'AI-Powered Project Management',
      description: 'Generate epics, user stories, and tasks with advanced AI assistance.',
    },
    {
      title: 'Token-Based System',
      description: 'Flexible token system for AI-powered content generation.',
    },
    {
      title: 'Team Collaboration',
      description: 'Work together seamlessly with your team members.',
    },
    {
      title: 'Real-time Updates',
      description: 'Stay in sync with instant updates and notifications.',
    },
  ];

  return (
    <div className={styles.stepContainer}>
      <Title level={3} className={styles.stepTitle}>
        Welcome to QuantumScribe
      </Title>
      
      <Paragraph className={styles.stepDescription}>
        Let's get you set up with your new AI-powered project management experience.
      </Paragraph>

      <List
        grid={{ gutter: 16, column: 2 }}
        dataSource={features}
        className={styles.featureList}
        renderItem={item => (
          <List.Item>
            <Card className={styles.featureCard}>
              <Title level={4}>{item.title}</Title>
              <Paragraph>{item.description}</Paragraph>
            </Card>
          </List.Item>
        )}
      />

      <div className={styles.stepActions}>
        <Button 
          type="primary" 
          size="large"
          onClick={() => onNext({})}
          icon={<RightOutlined />}
        >
          Get Started
        </Button>
      </div>
    </div>
  );
} 