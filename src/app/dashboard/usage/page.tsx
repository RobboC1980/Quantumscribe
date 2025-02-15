import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default async function UsagePage() {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login")
  }

  const { data: usageData, error } = await supabase
    .from('users')
    .select('tokens, subscription_tier')
    .eq('id', session.user.id)
    .single();

    const { data: ledger } = await supabase
    .from('token_ledger')
    .select('*')
    .eq('user_id', session.user.id)

    if (error) {
      console.error("Error fetching projects", error)
    }

    const totalTokensUsed = ledger?.reduce((acc, entry) => acc + entry.tokens_deducted, 0) || 0;

  if (!usageData) {
    return <p>Loading usage data...</p>;
  }

    const chartData = {
    labels: ['Token Usage'],
    datasets: [
      {
        label: 'Tokens Used',
        data: [totalTokensUsed],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'Tokens Remaining',
        data: [usageData.tokens - totalTokensUsed],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        max: usageData.tokens,
      },
    },
  };

  return (
    <div>
      <h1>Token Usage & Analytics</h1>
      <p>Subscription Tier: {usageData.subscription_tier}</p>
      <Bar data={chartData} options={options} />
      <p>{totalTokensUsed} of {usageData.tokens} tokens used.</p>
    </div>
  );
}
