'use client';

import { Button, Form, Select, Switch, Typography, Space } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import styles from './Steps.module.css';

const { Title, Paragraph } = Typography;
const { Option } = Select;

interface PreferencesStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
  loading: boolean;
}

export default function PreferencesStep({ onNext, onBack, loading }: PreferencesStepProps) {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    onNext(values);
  };

  return (
    <div className={styles.stepContainer}>
      <Title level={3} className={styles.stepTitle}>
        Customize Your Experience
      </Title>
      
      <Paragraph className={styles.stepDescription}>
        Set up your preferences to make QuantumScribe work best for you.
      </Paragraph>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className={styles.form}
        initialValues={{
          defaultView: 'board',
          theme: 'system',
          notifications: true,
          emailUpdates: true,
        }}
      >
        <Form.Item
          label="Default View"
          name="defaultView"
          rules={[{ required: true, message: 'Please select a default view' }]}
        >
          <Select size="large">
            <Option value="board">Board View</Option>
            <Option value="list">List View</Option>
            <Option value="timeline">Timeline View</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Theme Preference"
          name="theme"
          rules={[{ required: true, message: 'Please select a theme preference' }]}
        >
          <Select size="large">
            <Option value="system">System Default</Option>
            <Option value="light">Light Theme</Option>
            <Option value="dark">Dark Theme</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Notifications"
          name="notifications"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="Email Updates"
          name="emailUpdates"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

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
              htmlType="submit"
              loading={loading}
              icon={<RightOutlined />}
              size="large"
            >
              Continue
            </Button>
          </Space>
        </div>
      </Form>
    </div>
  );
} 