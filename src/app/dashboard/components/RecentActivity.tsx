'use client';

import { useState, useEffect } from 'react';
import { Card, List, Typography, Tag, Empty } from 'antd';
import { createClient } from '@/utils/supabase';
import { formatDistanceToNow } from 'date-fns';
import styles from './RecentActivity.module.css';

const { Text } = Typography;

interface Activity {
  id: string;
  user_id: string;
  tokens_deducted: number;
  artifact_type: 'epic' | 'user_story' | 'task';
  note: string;
  created_at: string;
}

interface RecentActivityProps {
  className?: string;
}

export default function RecentActivity({ className }: RecentActivityProps) {
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);
  const supabase = createClient();

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('token_ledger')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getArtifactColor = (type: string) => {
    switch (type) {
      case 'epic':
        return 'blue';
      case 'user_story':
        return 'green';
      case 'task':
        return 'gold';
      default:
        return 'default';
    }
  };

  return (
    <Card 
      title="Recent Activity" 
      className={className}
    >
      <List
        loading={loading}
        dataSource={activities}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No recent activity"
            />
          )
        }}
        renderItem={(activity) => (
          <List.Item className={styles.activityItem}>
            <div className={styles.activityContent}>
              <div className={styles.activityHeader}>
                <Tag color={getArtifactColor(activity.artifact_type)}>
                  {activity.artifact_type.replace('_', ' ')}
                </Tag>
                <Text type="secondary" className={styles.timestamp}>
                  {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                </Text>
              </div>
              <Text className={styles.note}>{activity.note}</Text>
              <Text type="secondary" className={styles.tokens}>
                {activity.tokens_deducted} tokens used
              </Text>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
} 