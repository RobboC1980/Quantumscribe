// src/app/admin/ledger/page.tsx
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