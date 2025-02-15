'use client';

import { useState, useEffect } from 'react';
import { Card, List, Tag, Button, Typography, Empty } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { createClient } from '@/utils/supabase';
import { useRouter } from 'next/navigation';
import styles from './ProjectList.module.css';

const { Text } = Typography;

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'archived' | 'deleted';
  created_at: string;
}

interface ProjectListProps {
  className?: string;
}

export default function ProjectList({ className }: ProjectListProps) {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('owner_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'archived':
        return 'warning';
      case 'deleted':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Card 
      title="Recent Projects" 
      className={className}
      extra={
        <Button type="link" onClick={() => router.push('/dashboard/projects')}>
          View All
        </Button>
      }
    >
      <List
        loading={loading}
        dataSource={projects}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No projects yet"
            >
              <Button 
                type="primary"
                onClick={() => router.push('/dashboard/projects/new')}
              >
                Create Project
              </Button>
            </Empty>
          )
        }}
        renderItem={(project) => (
          <List.Item
            className={styles.projectItem}
            actions={[
              <Button 
                key="view" 
                type="link" 
                icon={<RightOutlined />}
                onClick={() => router.push(`/dashboard/projects/${project.id}`)}
              >
                View
              </Button>
            ]}
          >
            <List.Item.Meta
              title={project.name}
              description={
                <div>
                  <Text type="secondary" className={styles.description}>
                    {project.description}
                  </Text>
                  <Tag color={getStatusColor(project.status)} className={styles.status}>
                    {project.status}
                  </Tag>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
} 