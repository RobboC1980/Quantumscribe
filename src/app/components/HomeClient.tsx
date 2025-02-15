'use client';

import { useState } from 'react';
import { Typography, Button, Card, Input, Select, Switch, Space, Form, Alert, Spin } from 'antd';
import { RocketOutlined, CheckCircleOutlined } from '@ant-design/icons';
import styles from './HomeClient.module.css';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

interface GeneratedContent {
  content: string;
  type: string;
  tokens_used: number;
}

export default function HomeClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [form] = Form.useForm();

  const handleGenerate = async (values: any) => {
    try {
      setLoading(true);
      setError(null);
      setGeneratedContent(null);
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();
      setGeneratedContent(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <Title className={styles.title}>
          Welcome to <span className={styles.highlight}>QuantumScribe</span>
        </Title>
        <Paragraph className={styles.subtitle}>
          Generate Agile Artifacts with the Power of AI
        </Paragraph>
        <Button type="primary" size="large" href="/signup" className={styles.ctaButton}>
          Start Free Trial
        </Button>
      </div>

      <div className={styles.features}>
        <Title level={2} className={styles.sectionTitle}>Key Features</Title>
        <div className={styles.featureGrid}>
          <Card className={styles.featureCard}>
            <CheckCircleOutlined className={styles.featureIcon} />
            <Title level={4}>AI-Powered Generation</Title>
            <Paragraph>Create epics, user stories, and tasks in minutes with advanced AI assistance</Paragraph>
          </Card>
          <Card className={styles.featureCard}>
            <CheckCircleOutlined className={styles.featureIcon} />
            <Title level={4}>Token-Based System</Title>
            <Paragraph>Flexible token system for cost-effective content generation</Paragraph>
          </Card>
          <Card className={styles.featureCard}>
            <CheckCircleOutlined className={styles.featureIcon} />
            <Title level={4}>Real-time Collaboration</Title>
            <Paragraph>Work seamlessly with your team in real-time</Paragraph>
          </Card>
          <Card className={styles.featureCard}>
            <CheckCircleOutlined className={styles.featureIcon} />
            <Title level={4}>Advanced Analytics</Title>
            <Paragraph>Track and optimize your team's performance</Paragraph>
          </Card>
        </div>
      </div>

      <div className={styles.demo}>
        <Title level={2} className={styles.sectionTitle}>Try It Now</Title>
        <Card className={styles.demoCard}>
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
            layout="vertical"
            onFinish={handleGenerate}
            className={styles.form}
          >
            <Form.Item
              name="description"
              label="Project Description"
              rules={[{ required: true, message: 'Please enter your project description' }]}
            >
              <TextArea
                rows={4}
                placeholder="Describe your project requirements..."
                className={styles.textarea}
              />
            </Form.Item>

            <Form.Item
              name="artifactType"
              label="Select Artifact Type"
              rules={[{ required: true, message: 'Please select an artifact type' }]}
            >
              <Select placeholder="Select an artifact type">
                <Select.Option value="epic">Epic</Select.Option>
                <Select.Option value="user_story">User Story</Select.Option>
                <Select.Option value="task">Task</Select.Option>
              </Select>
            </Form.Item>

            <Space direction="vertical" className={styles.options}>
              <Form.Item
                name="includeAcceptanceCriteria"
                valuePropName="checked"
              >
                <Switch /> Include Acceptance Criteria
              </Form.Item>

              <Form.Item
                name="includeTestScripts"
                valuePropName="checked"
              >
                <Switch /> Include Test Scripts (Advanced Tier Only)
              </Form.Item>
            </Space>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<RocketOutlined />}
                loading={loading}
                block
                size="large"
              >
                Generate
              </Button>
            </Form.Item>
          </Form>

          {loading && (
            <div className={styles.loadingContainer}>
              <Spin size="large" tip="Generating content..." />
            </div>
          )}

          {generatedContent && (
            <div className={styles.result}>
              <Title level={4} className={styles.resultTitle}>
                Generated {generatedContent.type}
              </Title>
              <Card className={styles.resultCard}>
                <Text className={styles.resultContent}>
                  {generatedContent.content}
                </Text>
                <div className={styles.tokenInfo}>
                  <Text type="secondary">
                    Tokens used: {generatedContent.tokens_used}
                  </Text>
                </div>
              </Card>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
} 