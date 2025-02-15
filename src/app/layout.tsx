// src/app/layout.tsx
import '../globals.css';
import type { Metadata } from 'next';
import { ConfigProvider, theme } from 'antd';
import { Space_Mono, Inter } from 'next/font/google';
import { brandIdentity } from '@/theme/themeConfig';

const spaceMono = Space_Mono({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-space-mono'
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: 'QuantumScribe',
  description: 'Intelligent SaaS project management platform'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceMono.variable}`}>
      <body>
        <ConfigProvider
          theme={{
            algorithm: theme.darkAlgorithm,
            token: {
              colorPrimary: brandIdentity.colors.primary,
              colorBgBase: brandIdentity.colors.background,
              colorTextBase: brandIdentity.colors.text,
              fontFamily: brandIdentity.fonts.primary,
              borderRadius: parseInt(brandIdentity.borderRadius.md),
              colorSuccess: brandIdentity.colors.success,
              colorWarning: brandIdentity.colors.warning,
              colorError: brandIdentity.colors.error,
              colorInfo: brandIdentity.colors.accent,
            },
            components: {
              Button: {
                colorPrimary: brandIdentity.colors.primary,
                algorithm: true,
                borderRadius: parseInt(brandIdentity.borderRadius.md),
              },
              Input: {
                colorPrimary: brandIdentity.colors.primary,
                borderRadius: parseInt(brandIdentity.borderRadius.md),
              },
              Card: {
                borderRadius: parseInt(brandIdentity.borderRadius.lg),
              },
            },
          }}
        >
          {children}
        </ConfigProvider>
      </body>
    </html>
  );
}