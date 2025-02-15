import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import styles from './LoadingSpinner.module.css';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

export default function LoadingSpinner({ tip = 'Loading...' }: { tip?: string }) {
  return (
    <div className={styles.spinnerContainer}>
      <Spin indicator={antIcon} tip={tip} />
    </div>
  );
} 