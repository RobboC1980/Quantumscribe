import { useState } from 'react';
import InputForm from '@/components/InputForm';
import ResultsDisplay from '@/components/ResultsDisplay';
import TokenTracker from '@/components/TokenTracker';
import styles from './page.module.css';

export default function GeneratePage() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = (data: any) => {
    setResults(data.artefacts);
    setLoading(false);
  };

  return (
    <div className={styles.generateContainer}>
      <h1>Generate Agile Artefacts</h1>
      <TokenTracker />
      <InputForm onSubmit={handleFormSubmit} />
      <ResultsDisplay data={results} loading={loading} error={error} />
    </div>
  );
}
