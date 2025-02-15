import { Typography, Card, Row, Col, Button } from 'antd';
import Link from 'next/link';
import styles from './page.module.css';
import { usePermissions } from '@/hooks/usePermissions';

export default function DashboardPage() {
    const permissions = usePermissions();

    return (
      <div className={styles.dashboardContainer}>
        <div className={styles.dashboardContent}>
          <Typography.Title level={2}>Dashboard</Typography.Title>
          <Row gutter={16}>
            <Col span={8}>
              <Card title="Projects" bordered={false}>
                <p>Overview of your projects</p>
                <Link href="/dashboard/projects" className="ant-btn ant-btn-primary">
                  View Projects
                </Link>
              </Card>
            </Col>
            <Col span={8}>
              <Card title="Token Usage" bordered={false}>
                <p>Track your token usage</p>
                <Link href="/dashboard/usage" className="ant-btn ant-btn-primary">
                  View Usage
                </Link>
              </Card>
            </Col>
            <Col span={8}>
              {permissions.canEdit && (
                <Card title="Generate Artifacts" bordered={false}>
                  <p>Generate Agile artefacts</p>
                  <Link href="/dashboard/generate" style={{ color: 'var(--primary)' }}>
                    Generate
                  </Link>
                </Card>
              )}
            </Col>
          </Row>
        </div>
      </div>
    );
}
