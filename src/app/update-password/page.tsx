'use client';

import { useState } from 'react';
import { Alert, Button, Form, Input, Typography } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { createClient } from '@/utils/supabase';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

const { Title, Text } = Typography;

export default function UpdatePasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const onFinish = async (values: { password: string; confirmPassword: string }) => {
    try {
      if (values.password !== values.confirmPassword) {
        setError("Passwords don't match");
        return;
      }

      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.updateUser({
        password: values.password
      });

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <Title level={2} className={styles.title}>
            Password Updated
          </Title>
          <Text className={styles.message}>
            Your password has been successfully updated. You will be redirected to the login page in a few seconds.
          </Text>
          <Button type="primary" onClick={() => router.push('/login')} block>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <Title level={2} className={styles.title}>
          Update Password
        </Title>
        <Text className={styles.subtitle}>
          Please enter your new password below.
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
          name="update-password"
          onFinish={onFinish}
          layout="vertical"
          className={styles.authContainer}
        >
          <Form.Item
            label="New Password"
            name="password"
            rules={[
              { required: true, message: 'Please input your new password!' },
              { min: 6, message: 'Password must be at least 6 characters!' },
            ]}
          >
            <Input.Password size="large" />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            rules={[
              { required: true, message: 'Please confirm your password!' },
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
              Update Password
            </Button>
          </Form.Item>

          <Button type="link" block onClick={() => router.push('/login')}>
            Cancel
          </Button>
        </Form>
      </div>
    </div>
  );
} 