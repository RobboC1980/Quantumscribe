// src/app/api/admin/ledger/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET() {
  const { data, error } = await supabase.from('token_ledger').select('*');

  if (error) {
    console.error('Error fetching token ledger:', error);
    return NextResponse.json({ error: 'Failed to fetch token ledger' }, { status: 500 });
  }

  return NextResponse.json(data);
}