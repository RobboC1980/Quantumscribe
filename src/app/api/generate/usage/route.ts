// src/app/api/usage/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: user, error: userError } = await supabase
    .from('users')
    .select('tokens')
    .eq('id', session.user.id)
    .single();

  if (userError || !user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const { data: tokenLedger, error: ledgerError } = await supabase
    .from('token_ledger')
    .select('tokens_deducted')
    .eq('user_id', session.user.id);

  if (ledgerError) {
    console.error('Token ledger error:', ledgerError);
    return NextResponse.json({ error: 'Failed to fetch token usage' }, { status: 500 });
  }

  const totalTokensUsed = tokenLedger?.reduce((acc, entry) => acc + entry.tokens_deducted, 0) || 0;

  return NextResponse.json({ used: totalTokensUsed, total: user.tokens });
}