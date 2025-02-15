'use client';

import { useState } from 'react';
import { Alert, Button, Form, Input, Typography } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { createClient } from '@/utils/supabase';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

const { Title } = Typography;

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: `${window.location.origin}/onboarding`,
        },
      });

      if (error) throw error;

      // Show success message and redirect to onboarding
      router.push('/onboarding');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <Title level={2} className={styles.title}>
          Sign up for QuantumScribe
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

        <Form
          name="signup"
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

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters!' },
            ]}
          >
            <Input.Password size="large" />
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
              Sign Up
            </Button>
          </Form.Item>

          <Button type="link" block onClick={() => router.push('/login')}>
            Already have an account? Log in
          </Button>
        </Form>
      </div>
    </div>
  );
}
