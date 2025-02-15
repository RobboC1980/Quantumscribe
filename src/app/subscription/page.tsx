'use client';

import { useState, useEffect } from 'react';
import { Typography, Card, Button, Skeleton, Alert, Spin } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import type { Subscription } from '@/types/subscription';
import './page.css';

export default function SubscriptionPage() {
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = async (retries = 3): Promise<void> => {
    try {
      const res = await fetch('/api/subscription');
      
      if (!res.ok) {
        if (res.status >= 500 && retries > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          return fetchSubscription(retries - 1);
        }
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setSubscription(data);
      setError(null);
    } catch (err) {
      console.error('Subscription fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load subscription');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  if (loading) {
    return (
      <div className="subscription-container">
        <Spin tip="Loading subscription...">
          <Skeleton active paragraph={{ rows: 6 }} />
        </Spin>
      </div>
    );
  }

  if (error) {
    return (
      <div className="subscription-container">
        <Alert
          type="error"
          message="Subscription Error"
          description={error}
          showIcon
        />
      </div>
    );
  }

  return (
    <div className="subscription-container">
      <div className="subscription-content">
        <Typography.Title level={2}>Manage Subscription</Typography.Title>
        <Card title="Current Plan" bordered={false}>
          <p>Basic (£9.99/mo)</p>
          <p>150 Tokens/Month</p>
          <p>Limits:</p>
          <ul>
            <li>Up to 10 Epics</li>
            <li>Up to 20 Basic User Stories</li>
            <li>Up to 30 Tasks</li>
            <li>Optional: +1 token/story for Acceptance Criteria</li>
          </ul>
          <Button type="primary" icon={<ArrowRightOutlined />}>
            Upgrade
          </Button>
        </Card>
        <Card title="Upgrade Options" bordered={false} style={{ marginTop: '20px' }}>
          <p>Professional (£19.99/mo)</p>
          <p>300 Tokens/Month</p>
          <p>Limits:</p>
          <ul>
            <li>Up to 20 Epics</li>
            <li>Up to 50 User Stories</li>
            <li>Up to 80 Tasks</li>
            <li>Optional: +1 token/story for Acceptance Criteria</li>
            <li>No Test Scripts Included</li>
          </ul>
          <Button type="primary" icon={<ArrowRightOutlined />}>
            Upgrade
          </Button>
        </Card>
      </div>
    </div>
  );
}

const LoadingIcon = () => (
  <div className="loading-spinner">
    <div className="spinner-sector spinner-red"></div>
    <div className="spinner-sector spinner-blue"></div>
    <div className="spinner-sector spinner-green"></div>
  </div>
);
