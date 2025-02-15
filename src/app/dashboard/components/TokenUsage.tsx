'use client';

import { useState, useEffect } from 'react';
import { Card, Progress, Typography, Button, Tooltip } from 'antd';
import { InfoCircleOutlined, ShoppingOutlined } from '@ant-design/icons';
import { createClient } from '@/utils/supabase';
import { useRouter } from 'next/navigation';
import styles from './TokenUsage.module.css';

const { Text } = Typography;

interface TokenUsageProps {
  className?: string;
}

interface TokenData {
  used: number;
  total: number;
}

export default function TokenUsage({ className }: TokenUsageProps) {
  const [loading, setLoading] = useState(true);
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    fetchTokenUsage();
  }, []);

  const fetchTokenUsage = async () => {
    try {
      const response = await fetch('/api/generate/usage');
      if (!response.ok) throw new Error('Failed to fetch token usage');
      
      const data = await response.json();
      setTokenData(data);
    } catch (error) {
      console.error('Error fetching token usage:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressStatus = (percent: number): "success" | "exception" | "normal" | "active" => {
    if (percent >= 90) return 'exception';
    if (percent >= 75) return 'normal';
    return 'success';
  };

  if (!tokenData) return null;

  const usagePercent = Math.round((tokenData.used / tokenData.total) * 100);

  return (
    <Card 
      title="Token Usage" 
      className={className}
      extra={
        <Tooltip title="Tokens are used for AI-powered content generation">
          <InfoCircleOutlined />
        </Tooltip>
      }
    >
      <div className={styles.tokenInfo}>
        <Progress
          type="circle"
          percent={usagePercent}
          status={getProgressStatus(usagePercent)}
          format={(percent) => (
            <div className={styles.progressContent}>
              <div className={styles.percentValue}>{percent}%</div>
              <div className={styles.tokenValues}>
                <Text type="secondary">
                  {tokenData.used}/{tokenData.total}
                </Text>
              </div>
            </div>
          )}
        />
      </div>

      <div className={styles.tokenDetails}>
        <div>
          <Text>Available Tokens</Text>
          <Text strong>{tokenData.total - tokenData.used}</Text>
        </div>
        <div>
          <Text>Used Tokens</Text>
          <Text strong>{tokenData.used}</Text>
        </div>
      </div>

      {usagePercent >= 75 && (
        <Button
          type="primary"
          icon={<ShoppingOutlined />}
          onClick={() => router.push('/dashboard/subscription')}
          block
          className={styles.upgradeButton}
        >
          Get More Tokens
        </Button>
      )}
    </Card>
  );
} 