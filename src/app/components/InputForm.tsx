"use client";
// src/app/components/InputForm.tsx
import { useState } from 'react';
import { Form, Input, Button, message, Select, Checkbox } from 'antd';
import axios from 'axios';

interface InputFormProps {
  onSubmit: (data: any) => void;
}

const { Option } = Select;

export default function InputForm({ onSubmit }: InputFormProps) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/generate', {
        prompt: values.prompt,
        artifactType: values.artifactType,
        includeAcceptanceCriteria: values.includeAcceptanceCriteria,
        includeTestScripts: values.includeTestScripts,
      });
      message.success('Request processed successfully!');
      onSubmit(response.data);
    } catch (error) {
      message.error('Error processing your request. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item
        name="prompt"
        label="Enter your project description"
        rules={[
          { required: true, message: 'Please enter your prompt' },
          { min: 10, message: 'Minimum 10 characters required' },
        ]}
      >
        <Input.TextArea rows={4} placeholder="Describe your project requirements..." />
      </Form.Item>

      <Form.Item
        name="artifactType"
        label="Select Artifact Type"
        rules={[{ required: true, message: 'Please select an artifact type' }]}
      >
        <Select placeholder="Select an artifact type">
          <Option value="epic">Epic</Option>
          <Option value="user_story">User Story</Option>
          <Option value="task">Task</Option>
        </Select>
      </Form.Item>

      <Form.Item name="includeAcceptanceCriteria" valuePropName="checked">
        <Checkbox>Include Acceptance Criteria</Checkbox>
      </Form.Item>

      <Form.Item name="includeTestScripts" valuePropName="checked">
        <Checkbox>Include Test Scripts (Advanced Tier Only)</Checkbox>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Generate
        </Button>
      </Form.Item>
    </Form>
  );
}