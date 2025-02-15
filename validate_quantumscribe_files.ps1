# Define the expected content for each file
$expectedFiles = @{
    "src/app/admin/index/ledger/page.tsx" = @"
import React from 'react';
import { useEffect, useState } from 'react';
import { Table } from 'antd';
import axios from 'axios';

interface TokenLedgerEntry {
  id: string;
  user_id: string;
  category: string;
  tokens_deducted: number;
  note: string;
  created_at: string;
}

export default function TokenLedgerPage() {
  const [entries, setEntries] = useState<TokenLedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const { data } = await axios.get('/api/admin/ledger');
        setEntries(data);
      } catch (error) {
        console.error('Error fetching token ledger:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'User ID', dataIndex: 'user_id', key: 'user_id' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Tokens Deducted', dataIndex: 'tokens_deducted', key: 'tokens_deducted' },
    { title: 'Note', dataIndex: 'note', key: 'note' },
    { title: 'Created At', dataIndex: 'created_at', key: 'created_at' },
  ];

  return (
    <div>
      <h1>Token Ledger</h1>
      <Table dataSource={entries} columns={columns} loading={loading} />
    </div>
  );
}
"@;

    "src/app/api/create-payment-intent/route.ts" = @"
import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

export async function POST(request: Request) {
  const { items } = await request.json();

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: 'usd',
  });

  return NextResponse.json({
    clientSecret: paymentIntent.client_secret,
  });
}

function calculateOrderAmount(items: any[]) {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
}
"@;

    "src/app/checkout/page.tsx" = @"
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/CheckoutForm';
import { useEffect, useState } from 'react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: [{ id: 'xl-t-shirt' }] }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const options = {
    clientSecret: clientSecret ?? '',
    appearance: {
      theme: 'stripe',
    },
  };

  return (
    <div>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
}
"@;

    "src/app/dashboard/generate/page.tsx" = @"
import { useState } from 'react';
import InputForm from '@/components/InputForm';
import ResultsDisplay from '@/components/ResultsDisplay';
import TokenTracker from '@/components/TokenTracker';

export default function GeneratePage() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = (data: any) => {
    setResults(data.artefacts);
    setLoading(false);
  };

  return (
    <div>
      <h1>Generate Agile Artefacts</h1>
      <TokenTracker />
      <InputForm onSubmit={handleFormSubmit} />
      <ResultsDisplay data={results} loading={loading} error={error} />
    </div>
  );
}
"@;

    "src/app/dashboard/index/page.tsx" = @"
import { Typography, Card, Row, Col, Button } from 'antd';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div style={{ padding: '50px' }}>
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
          <Card title="Generate Artifacts" bordered={false}>
            <p>Generate Agile artefacts</p>
            <Link href="/dashboard/generate" className="ant-btn ant-btn-primary">
              Generate
            </Link>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
"@;

    "src/app/dashboard/usage/page.tsx" = @"
import { useEffect, useState } from 'react';
import { Chart, Bar } from 'react-chartjs-2';
import axios from 'axios';

export default function UsagePage() {
  const [usageData, setUsageData] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const { data } = await axios.get('/api/usage');
        setUsageData(data);
      } catch (error) {
        console.error('Error fetching usage data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsage();
  }, []);

  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Token Usage',
        data: usageData,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (loading) return <p>Loading usage data...</p>;

  return (
    <div>
      <h1>Token Usage & Analytics</h1>
      <Bar data={data} options={options} />
    </div>
  );
}
"@;

    "tsconfig.json" = @"
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@/components/*": ["./src/app/components/*"],
      "@/pages/*": ["./src/app/*"],
      "@/utils/*": ["./src/app/utils/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
"@;

    "src/app/login/page.tsx" = @"
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default function LoginPage() {
  const router = useRouter();

  const handleAuthStateChange = (event: any, session: any) => {
    if (event === 'SIGNED_IN') {
      router.push('/dashboard');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={['google']}
        theme="dark"
        redirectTo="/dashboard"
        onAuthStateChange={handleAuthStateChange}
      />
    </div>
  );
}
"@;

    "src/app/pricing/page.tsx" = @"
import { Typography, Card, Row, Col, Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

export default function PricingPage() {
  return (
    <div style={{ padding: '50px' }}>
      <Typography.Title level={2}>Pricing</Typography.Title>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Freemium" bordered={false}>
            <p>50 Tokens/Month</p>
            <p>Limits:</p>
            <ul>
              <li>1 Epic</li>
              <li>2 Basic User Stories</li>
              <li>3 Tasks</li>
            </ul>
            <Button type="primary" icon={<ArrowRightOutlined />}>
              Sign Up
            </Button>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Basic (£9.99/mo)" bordered={false}>
            <p>150 Tokens/Month</p>
            <p>Limits:</p>
            <ul>
              <li>Up to 10 Epics</li>
              <li>Up to 20 Basic User Stories</li>
              <li>Up to 30 Tasks</li>
              <li>Optional: +1 token/story for Acceptance Criteria</li>
            </ul>
            <Button type="primary" icon={<ArrowRightOutlined />}>
              Subscribe
            </Button>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Professional (£19.99/mo)" bordered={false}>
            <p>300 Tokens/Month</p>
            <p>Limits:</p>
            <ul>
              <li>Up to 20 Epics</li>
              <li>Up to 50 User Stories</li>
              <li>Up to 80 Tasks</li>
              <li>Optional: +1 token/story for Acceptance Criteria</li>
              <li>No Test Scripts Included</li>
            </ul>
            <Button type="primary" icon={<ArrowRightOutlined />}>
              Subscribe
            </Button>
          </Card>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: '20px' }}>
        <Col span={8}>
          <Card title="Advanced (£29.99/mo)" bordered={false}>
            <p>500 Tokens/Month</p>
            <p>Limits:</p>
            <ul>
              <li>Up to 20 Epics</li>
              <li>Up to 50 User Stories</li>
              <li>Up to 80 Tasks</li>
              <li>User Stories include Premium Enhancements</li>
              <li>Each story: Base (2) + Acceptance Criteria (1) + Test Scripts (2) = 5 tokens</li>
              <li>Extended Bulk Cap (up to 10 per transaction)</li>
              <li>Advanced Analytics, Priority Support, Integrations</li>
            </ul>
            <Button type="primary" icon={<ArrowRightOutlined />}>
              Subscribe
            </Button>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Enterprise (Custom)" bordered={false}>
            <p>Custom Token Allocation (e.g., 500+ tokens/Month)</p>
            <p>Limits: Negotiated per organization/seat</p>
            <p>Advanced Admin Tools & Reporting</p>
            <p>API Access & White-Label Options</p>
            <Button type="primary" icon={<ArrowRightOutlined />}>
              Contact Us
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
"@;

    "src/app/reset/page.tsx" = @"
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default function ResetPage() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={['google']}
        theme="dark"
        view="password_recovery"
      />
    </div>
  );
}
"@;

    "src/app/signup/page.tsx" = @"
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default function SignupPage() {
  const router = useRouter();

  const handleAuthStateChange = (event: any, session: any) => {
    if (event === 'SIGNED_UP') {
      router.push('/login');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={['google']}
        theme="dark"
        redirectTo="/login"
        onAuthStateChange={handleAuthStateChange}
      />
    </div>
  );
}
"@;

    "src/app/subscription/page.tsx" = @"
import { Typography, Card, Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

export default function SubscriptionPage() {
  return (
    <div style={{ padding: '50px' }}>
      <Typography.Title level={2}>Manage Subscription</Typography.Title>
      <Card title="Current Plan" bordered={false}>
        <p>Basic (£9.99/mo)</p>
        <p>150 Tokens/Month</p>
        <p>Limits:</p>
        <ul>
          <li>Up to 10 Epics</li>
          <li>Up to 20 Basic User Stories</li>
          <li>Up to 30 Tasks</li>
          <li>Optional: +1 token/story for Acceptance Criteria</li>
        </ul>
        <Button type="primary" icon={<ArrowRightOutlined />}>
          Upgrade
        </Button>
      </Card>
      <Card title="Upgrade Options" bordered={false} style={{ marginTop: '20px' }}>
        <p>Professional (£19.99/mo)</p>
        <p>300 Tokens/Month</p>
        <p>Limits:</p>
        <ul>
          <li>Up to 20 Epics</li>
          <li>Up to 50 User Stories</li>
          <li>Up to 80 Tasks</li>
          <li>Optional: +1 token/story for Acceptance Criteria</li>
          <li>No Test Scripts Included</li>
        </ul>
        <Button type="primary" icon={<ArrowRightOutlined />}>
          Upgrade
        </Button>
      </Card>
    </div>
  );
}
"@;
}

# Function to validate files
function Test-FileValidation {
    $incorrectFiles = @{}

    foreach ($filePath in $expectedFiles.Keys) {
        $fullPath = Join-Path -Path "C:\Projects\quantumscribe" -ChildPath $filePath
        if (Test-Path $fullPath) {
            $currentContent = Get-Content -Path $fullPath -Raw
            if ($currentContent -ne $expectedFiles[$filePath]) {
                $incorrectFiles[$filePath] = @{
                    CurrentContent = $currentContent
                    ExpectedContent = $expectedFiles[$filePath]
                }
            } else {
                Write-Host "$filePath is already correct."
            }
        } else {
            Write-Host "$filePath is missing."
        }
    }

    if ($incorrectFiles.Count -gt 0) {
        Write-Host "`nIncorrect files (need to be updated):"
        foreach ($filePath in $incorrectFiles.Keys) {
            Write-Host "`nFile: $filePath"
            Write-Host "Current Content:"
            Write-Host "------------------"
            Write-Host $incorrectFiles[$filePath].CurrentContent
            Write-Host "`nExpected Content:"
            Write-Host "-------------------"
            Write-Host $incorrectFiles[$filePath].ExpectedContent
        }
    } else {
        Write-Host "`nAll specified files are correct."
    }
}

# Main script execution
Write-Host "Validating files..."
Test-FileValidation