// src/app/dashboard/projects/page.tsx
import { Table, Button } from 'antd';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default async function ProjectsPage() {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login")
  }

  const { data: projects, error } = await supabase
    .from('projects')
    .select('*');

  if (error) {
    console.error("Error fetching projects", error)
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    { title: 'Actions', key: 'actions', render: (_: any, record: Project) => <Button onClick={() => handleView(record)}>View</Button> },
  ];

  const handleView = (project: Project) => {
    console.log('View project:', project);
    // Navigate to project details page
  };

  return (
    <div>
      <h1>Projects</h1>
      <Table dataSource={projects || []} columns={columns} />
    </div>
  );
}