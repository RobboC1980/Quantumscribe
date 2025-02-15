import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { Card, Typography } from 'antd'; //  Ant Design X components
//     ^^^^  Replace with Ant Design X Card
//             ^^^^^^^^^^ Replace with Ant Design X Typography

interface Epic {
  id: string;
  title: string;
  description: string;
  business_value?: string;
  status: string;
  // Add other epic fields as needed
}

export default async function EpicDetailPage({ params }: { params: { epicId: string } }) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login")
  }

  const { data: epic, error } = await supabase
    .from('epics')
    .select('*')
    .eq('id', params.epicId)
    .single();

  if (error) {
    console.error('Error fetching epic:', error);
  }

  if (!epic) {
    notFound()
  }

  return (
    <div>
      <Card>
        <Typography.Title level={2}>{epic.title}</Typography.Title>
        {/* Ant Design X Typography.Title */}
        <Typography.Paragraph>{epic.description}</Typography.Paragraph>
        {/* Ant Design X Typography.Paragraph */}
        <p>Status: {epic.status}</p>
        {/* Display other epic details here */}
      </Card>
    </div>
  );
} 