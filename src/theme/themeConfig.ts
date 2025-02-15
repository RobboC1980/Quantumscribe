import type { ThemeConfig } from 'antd';

export const brandIdentity = {
  colors: {
    primary: '#2F54EB', // Deep blue
    secondary: '#597EF7', // Medium blue
    accent: '#13C2C2', // Teal
    background: '#F0F5FF', // Light blue background
    text: '#1F1F1F', // Dark gray
    success: '#52C41A',
    warning: '#FAAD14',
    error: '#F5222D',
  },
  fonts: {
    primary: 'Inter, sans-serif',
    secondary: 'Space Mono, monospace'
  },
  logo: '/logo.svg', // Path to logo asset
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  borderRadius: {
    sm: '2px',
    md: '4px',
    lg: '8px',
    xl: '16px',
  },
};

const theme: ThemeConfig = {
  token: {
    fontSize: 16,
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
    Typography: {
      fontFamily: brandIdentity.fonts.primary,
    },
    Card: {
      borderRadius: parseInt(brandIdentity.borderRadius.lg),
    },
  },
};

export default theme; 