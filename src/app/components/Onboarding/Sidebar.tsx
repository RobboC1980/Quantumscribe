import { Layout, Menu } from 'antd-x';
import Link from 'next/link';
import { brandIdentity } from '@/theme/themeConfig';

const { Sider } = Layout;

export default function Sidebar() {
  return (
    <Sider
      theme="light"
      style={{ 
        background: brandIdentity.colors.background,
        borderRight: `1px solid ${brandIdentity.colors.accent}20`
      }}
    >
      <div className="logo" style={{ padding: '24px' }}>
        <img src={brandIdentity.logo} alt="QuantumScribe" style={{ height: 32 }} />
      </div>
      <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        style={{ borderRight: 0 }}
      >
        {/* Menu items remain same */}
      </Menu>
    </Sider>
  );
} 