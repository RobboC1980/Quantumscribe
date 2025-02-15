"use client";

// src/components/ResultsDisplay.tsx
import { List, Card, Spin } from 'antd';

interface ResultsDisplayProps {
  data: any[];
  loading: boolean;
  error: string | null;
}

export default function ResultsDisplay({ data, loading, error }: ResultsDisplayProps) {
  if (loading) return <Spin tip="Loading..." />;
  if (error) return <p>Error loading results: {error}</p>;

  return (
    <List
      grid={{ gutter: 16, column: 4 }}
      dataSource={data}
      renderItem={(item) => (
        <List.Item>
          <Card title={item.title}>{item.description}</Card>
        </List.Item>
      )}
    />
  );
}