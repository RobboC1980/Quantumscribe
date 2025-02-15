import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { Card, Typography } from 'antd';

interface Epic {
  id: string;
  title: string;
  description: string;
  business_value?: string;
  status: string;
}

export default async function EpicPage({ params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: epic, error } = await supabase
    .from('epics')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !epic) {
    notFound();
  }

  return (
    <Card title={epic.title}>
      <Typography.Paragraph>{epic.description}</Typography.Paragraph>
      {epic.business_value && (
        <Typography.Paragraph>
          <strong>Business Value:</strong> {epic.business_value}
        </Typography.Paragraph>
      )}
      <Typography.Text type="secondary">Status: {epic.status}</Typography.Text>
    </Card>
  );
} 