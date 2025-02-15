// src/components/TokenTracker.tsx
"use client";
import { useEffect, useState } from 'react';
import { Progress, message } from 'antd';
import axios from 'axios';

interface TokenUsage {
  used: number;
  total: number;
}

export default function TokenTracker() {
  const [usage, setUsage] = useState<TokenUsage>({ used: 0, total: 100 });
  const [loading, setLoading] = useState(true);

  const fetchUsage = async () => {
    try {
      const response = await axios.get<TokenUsage>('/api/usage');
      setUsage(response.data);
    } catch (error) {
      console.error('Error fetching usage:', error);
      message.error('Failed to load token usage');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsage();
    // Refresh token usage every minute
    const interval = setInterval(fetchUsage, 60000);
    return () => clearInterval(interval);
  }, []);

  const percent = Math.min(Math.round((usage.used / usage.total) * 100), 100);
  
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <h3 className="text-lg font-medium mb-2">Token Usage</h3>
      <Progress 
        percent={percent} 
        status={percent > 90 ? 'exception' : 'normal'} 
        showInfo={!loading}
        strokeWidth={8}
      />
      <p className="mt-2 text-sm text-gray-600">
        {loading ? 'Loading...' : `${usage.used.toLocaleString()} of ${usage.total.toLocaleString()} tokens used`}
      </p>
    </div>
  );
}