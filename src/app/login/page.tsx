'use client';

import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/LoadingSpinner';
import styles from './page.module.css';

const LoginForm = dynamic(() => import('./components/LoginForm'), {
  ssr: false,
  loading: () => <LoadingSpinner tip="Loading..." />
});

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <LoginForm />
    </div>
  );
}
