'use client';

import { useState } from 'react';
import { Alert, Button, Form, Input, Typography } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { createClient } from '@/utils/supabase';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

const { Title, Text } = Typography;

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const onFinish = async (values: { email: string }) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) throw error;

      setEmailSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <Title level={2} className={styles.title}>
            Check Your Email
          </Title>
          <Text className={styles.message}>
            We've sent you a password reset link. Please check your email and follow the instructions to reset your password.
          </Text>
          <Button type="primary" onClick={() => router.push('/login')} block>
            Return to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <Title level={2} className={styles.title}>
          Reset Password
        </Title>
        <Text className={styles.subtitle}>
          Enter your email address and we'll send you instructions to reset your password.
        </Text>

        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            className={styles.alert}
          />
        )}

        <Form
          name="reset-password"
          onFinish={onFinish}
          layout="vertical"
          className={styles.authContainer}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              icon={loading ? <LoadingOutlined /> : null}
            >
              Send Reset Link
            </Button>
          </Form.Item>

          <Button type="link" block onClick={() => router.push('/login')}>
            Back to Login
          </Button>
        </Form>
      </div>
    </div>
  );
} 