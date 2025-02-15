'use client';

import { useState } from 'react';
import { Alert, Button, Form, Input, Typography } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase';
import styles from '../page.module.css';

const { Title } = Typography;

export default function LoginForm() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();
  
  const onFinish = async (values: { email: string; password: string }) => {
    try {
      setLoading(true);
      setError(null);

      const { error: authError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (authError) throw authError;
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <Title level={2} className={styles.title}>
        Welcome Back
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
        form={form}
        name="login"
        onFinish={onFinish}
        layout="vertical"
        className={`${styles.authContainer} ${styles.formStyles}`}
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
            Sign In
          </Button>
        </Form.Item>

        <div className={styles.links}>
          <Button type="link" onClick={() => router.push('/reset-password')}>
            Forgot password?
          </Button>
          <Button type="link" onClick={() => router.push('/signup')}>
            Don't have an account? Sign up
          </Button>
        </div>
      </Form>
    </div>
  );
} 