'use client';

import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
  tip?: string;
}

const LoadingSpinner = ({ tip = 'Loading...' }: LoadingSpinnerProps) => {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  return (
    <div className={styles.spinnerContainer}>
      <Spin 
        indicator={antIcon}
        wrapperClassName={styles.spinnerWrapper}
      >
        <div className={styles.spinnerContent}>
          {tip && <div className={styles.spinnerTip}>{tip}</div>}
        </div>
      </Spin>
    </div>
  );
};

export default LoadingSpinner; 