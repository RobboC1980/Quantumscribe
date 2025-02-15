'use client';

import { useState } from 'react';
import { Button, Form, Input, Typography, Space, Tag, Alert } from 'antd';
import { LeftOutlined, RightOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';
import styles from './Steps.module.css';

const { Title, Paragraph, Text } = Typography;

interface TeamSetupStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
  loading: boolean;
}

export default function TeamSetupStep({ onNext, onBack, loading }: TeamSetupStepProps) {
  const [form] = Form.useForm();
  const [invites, setInvites] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');

  const handleAddInvite = () => {
    if (!inputValue) {
      return;
    }

    if (!inputValue.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setInputError('Please enter a valid email address');
      return;
    }

    if (invites.includes(inputValue)) {
      setInputError('This email has already been added');
      return;
    }

    setInvites([...invites, inputValue]);
    setInputValue('');
    setInputError('');
  };

  const handleRemoveInvite = (email: string) => {
    setInvites(invites.filter(invite => invite !== email));
  };

  const handleSubmit = () => {
    onNext({ invites });
  };

  return (
    <div className={styles.stepContainer}>
      <Title level={3} className={styles.stepTitle}>
        Invite Your Team
      </Title>
      
      <Paragraph className={styles.stepDescription}>
        Invite team members to collaborate with you on QuantumScribe. You can skip this step and invite them later.
      </Paragraph>

      <div className={styles.inviteSection}>
        <div className={styles.inputGroup}>
          <Input
            size="large"
            placeholder="Enter team member's email"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onPressEnter={handleAddInvite}
            status={inputError ? 'error' : ''}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddInvite}
            size="large"
          >
            Add
          </Button>
        </div>

        {inputError && (
          <Text type="danger" className={styles.errorText}>
            {inputError}
          </Text>
        )}

        {invites.length > 0 && (
          <div className={styles.inviteList}>
            {invites.map(email => (
              <Tag
                key={email}
                closable
                onClose={() => handleRemoveInvite(email)}
                className={styles.inviteTag}
              >
                {email}
              </Tag>
            ))}
          </div>
        )}

        {invites.length > 0 && (
          <Alert
            message="Note"
            description="Team members will receive an email invitation to join your workspace."
            type="info"
            showIcon
            className={styles.alert}
          />
        )}
      </div>

      <div className={styles.stepActions}>
        <Space>
          <Button 
            onClick={onBack}
            icon={<LeftOutlined />}
            size="large"
          >
            Back
          </Button>
          <Button 
            type="primary"
            onClick={handleSubmit}
            loading={loading}
            icon={<RightOutlined />}
            size="large"
          >
            {invites.length > 0 ? 'Send Invites & Finish' : 'Skip & Finish'}
          </Button>
        </Space>
      </div>
    </div>
  );
} 