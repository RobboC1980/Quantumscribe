// src/app/dashboard/epics/page.tsx
import { useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import axios from 'axios';

interface Epic {
  id: string;
  title: string;
  description: string;
  business_value?: string;
  status: string;
  associated_user_stories: string[];
  created_at: string;
  updated_at: string;
}

export default function EpicsPage() {
  const [epics, setEpics] = useState<Epic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEpics = async () => {
      try {
        const { data } = await axios.get('/api/epics');
        setEpics(data);
      } catch (error) {
        console.error('Error fetching epics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEpics();
  }, []);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    { title: 'Actions', key: 'actions', render: (_: any, record: Epic) => <Button onClick={() => handleView(record)}>View</Button> },
  ];

  const handleView = (epic: Epic) => {
    console.log('View epic:', epic);
    // Navigate to epic details page
  };

  return (
    <div>
      <h1>Epics</h1>
      <Table dataSource={epics} columns={columns} loading={loading} />
    </div>
  );
}