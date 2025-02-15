import { Typography, Card, Row, Col, Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import styles from './page.module.css';

export default function PricingPage() {
  return (
    <div className={styles.pricingPage}>
      <div className={styles.pricingContainer}>
        <Typography.Title level={2}>Pricing</Typography.Title>
        <Row gutter={16}>
          <Col span={8}>
            <Card title="Freemium" bordered={false} className={styles.card}>
              <div className={styles.cardContent}>
                <p>50 Tokens/Month</p>
                <p>Limits:</p>
                <ul className={styles.featureList}>
                  <li className={styles.featureItem}>1 Epic</li>
                  <li className={styles.featureItem}>2 Basic User Stories</li>
                  <li className={styles.featureItem}>3 Tasks</li>
                </ul>
              </div>
              <div className={styles.cardFooter}>
                <Button type="primary" icon={<ArrowRightOutlined />}>
                  Sign Up
                </Button>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Basic (£9.99/mo)" bordered={false} className={styles.card}>
              <div className={styles.cardContent}>
                <p>150 Tokens/Month</p>
                <p>Limits:</p>
                <ul className={styles.featureList}>
                  <li className={styles.featureItem}>Up to 10 Epics</li>
                  <li className={styles.featureItem}>Up to 20 Basic User Stories</li>
                  <li className={styles.featureItem}>Up to 30 Tasks</li>
                  <li className={styles.featureItem}>Optional: +1 token/story for Acceptance Criteria</li>
                </ul>
              </div>
              <div className={styles.cardFooter}>
                <Button type="primary" icon={<ArrowRightOutlined />}>
                  Subscribe
                </Button>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Professional (£19.99/mo)" bordered={false} className={styles.card}>
              <div className={styles.cardContent}>
                <p>300 Tokens/Month</p>
                <p>Limits:</p>
                <ul className={styles.featureList}>
                  <li className={styles.featureItem}>Up to 20 Epics</li>
                  <li className={styles.featureItem}>Up to 50 User Stories</li>
                  <li className={styles.featureItem}>Up to 80 Tasks</li>
                  <li className={styles.featureItem}>Optional: +1 token/story for Acceptance Criteria</li>
                  <li className={styles.featureItem}>No Test Scripts Included</li>
                </ul>
              </div>
              <div className={styles.cardFooter}>
                <Button type="primary" icon={<ArrowRightOutlined />}>
                  Subscribe
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
        <Row gutter={16} className={styles.cardRow}>
          <Col span={8}>
            <Card title="Advanced (£29.99/mo)" bordered={false} className={styles.card}>
              <div className={styles.cardContent}>
                <p>500 Tokens/Month</p>
                <p>Limits:</p>
                <ul className={styles.featureList}>
                  <li className={styles.featureItem}>Up to 20 Epics</li>
                  <li className={styles.featureItem}>Up to 50 User Stories</li>
                  <li className={styles.featureItem}>Up to 80 Tasks</li>
                  <li className={styles.featureItem}>User Stories include Premium Enhancements</li>
                  <li className={styles.featureItem}>Each story: Base (2) + Acceptance Criteria (1) + Test Scripts (2) = 5 tokens</li>
                  <li className={styles.featureItem}>Extended Bulk Cap (up to 10 per transaction)</li>
                  <li className={styles.featureItem}>Advanced Analytics, Priority Support, Integrations</li>
                </ul>
              </div>
              <div className={styles.cardFooter}>
                <Button type="primary" icon={<ArrowRightOutlined />}>
                  Subscribe
                </Button>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Enterprise (Custom)" bordered={false} className={styles.card}>
              <div className={styles.cardContent}>
                <p>Custom Token Allocation (e.g., 500+ tokens/Month)</p>
                <p>Limits: Negotiated per organization/seat</p>
                <ul className={styles.featureList}>
                  <li className={styles.featureItem}>Advanced Admin Tools & Reporting</li>
                  <li className={styles.featureItem}>API Access & White-Label Options</li>
                </ul>
              </div>
              <div className={styles.cardFooter}>
                <Button type="primary" icon={<ArrowRightOutlined />}>
                  Contact Us
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
