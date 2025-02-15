import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

export const createClient = () => {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

export const formatSupabaseError = (error: { message: string; details: string; hint: string; code: string }) => {
  if (error.code === '23505') return 'This record already exists.';
  if (error.code === '23503') return 'This record is referenced by other records.';
  return error.message || 'An error occurred.';
};

export const handleSupabaseError = (error: unknown) => {
  console.error('Supabase error:', error);
  const message = getErrorMessage(error);
  throw new Error(message);
}; 