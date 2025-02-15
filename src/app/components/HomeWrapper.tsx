'use client';

import React from 'react';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/LoadingSpinner';

const HomeClient = dynamic(() => import('./HomeClient'), {
  ssr: false,
  loading: () => <LoadingSpinner tip="Loading..." />
});

export default function HomeWrapper() {
  return (
    <Suspense fallback={<LoadingSpinner tip="Loading..." />}>
      <HomeClient />
    </Suspense>
  );
} 