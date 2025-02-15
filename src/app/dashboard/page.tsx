'use client';

import { useState, useEffect } from 'react';
import { Layout, Menu, Button, Typography, Card, Row, Col, Statistic, Alert } from 'antd';
import {
  ProjectOutlined,
  TeamOutlined,
  SettingOutlined,
  PlusOutlined,
  WalletOutlined,
  RocketOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import LoadingSpinner from '@/components/LoadingSpinner';
import ProjectList from './components/ProjectList';
import TokenUsage from './components/TokenUsage';
import RecentActivity from './components/RecentActivity';
import styles from './page.module.css';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

export default function DashboardPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    checkAuth();
    fetchUserData();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          projects:projects(count),
          tokens,
          subscription:subscriptions(tier, status)
        `)
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setUserData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner tip="Loading dashboard..." />;
  }

  return (
    <Layout className={styles.dashboardLayout}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        className={styles.sider}
      >
        <div className={styles.logo}>
          {!collapsed && <span>QuantumScribe</span>}
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={['dashboard']}
          mode="inline"
          items={[
            {
              key: 'dashboard',
              icon: <RocketOutlined />,
              label: 'Dashboard',
            },
            {
              key: 'projects',
              icon: <ProjectOutlined />,
              label: 'Projects',
            },
            {
              key: 'team',
              icon: <TeamOutlined />,
              label: 'Team',
            },
            {
              key: 'settings',
              icon: <SettingOutlined />,
              label: 'Settings',
            },
          ]}
          onSelect={({ key }) => router.push(`/dashboard/${key}`)}
        />
      </Sider>
      
      <Layout>
        <Header className={styles.header}>
          <Title level={4}>Dashboard</Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => router.push('/dashboard/projects/new')}
          >
            New Project
          </Button>
        </Header>

        <Content className={styles.content}>
          {error && (
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
              className={styles.alert}
            />
          )}

          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <Card title="Overview" className={styles.card}>
                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <Statistic
                      title="Active Projects"
                      value={userData?.projects?.count || 0}
                      prefix={<ProjectOutlined />}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Available Tokens"
                      value={userData?.tokens || 0}
                      prefix={<WalletOutlined />}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Subscription"
                      value={userData?.subscription?.tier || 'Free'}
                      prefix={<RocketOutlined />}
                    />
                  </Col>
                </Row>
              </Card>

              <ProjectList className={styles.card} />
            </Col>

            <Col xs={24} lg={8}>
              <TokenUsage className={styles.card} />
              <RecentActivity className={styles.card} />
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
} 