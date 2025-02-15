// src/app/api/generate/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const QWEN_API_URL = 'https://api.qwen.ai/v2.5/completions';
const QWEN_API_KEY = process.env.QWEN_API_KEY;

export async function POST(request: Request) {
  const { prompt, artifactType, includeAcceptanceCriteria, includeTestScripts } = await request.json();

  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id, tokens, subscription_tier')
    .eq('id', session.user.id)
    .single();

  if (userError || !user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  let tokensToDeduct = 1;
  let note = 'Standard deduction on prompt generation';

  if (artifactType === 'user_story') {
    tokensToDeduct = 2;
    note = 'User story generation';
    if (includeAcceptanceCriteria) {
      tokensToDeduct += 1;
      note += ' with acceptance criteria';
    }
    if (includeTestScripts && user.subscription_tier === 'Advanced') {
      tokensToDeduct += 2;
      note += ' with test scripts';
    }
  } else if (artifactType === 'epic') {
    tokensToDeduct = 5;
    note = "Epic Generation";
  } else if (artifactType === 'task') {
    tokensToDeduct = 1;
    note = "Task Generation";
  }

  if (user.tokens < tokensToDeduct) {
    return NextResponse.json(
      { error: 'Insufficient tokens. Please upgrade or purchase more tokens.' },
      { status: 402 }
    );
  }

  try {
    const qwenResponse = await fetch(QWEN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${QWEN_API_KEY}`
      },
      body: JSON.stringify({
        model: "qwen-2.5-turbo",
        prompt: prompt,
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 1.0,
      })
    });

    if (!qwenResponse.ok) {
      const error = await qwenResponse.json();
      throw new Error(`Qwen API Error: ${error.error.message}`);
    }

    const aiData = await qwenResponse.json();

    // Deduct tokens and log usage
    const { error: updateError } = await supabase
      .from('users')
      .update({ tokens: user.tokens - tokensToDeduct })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating tokens:', updateError);
      return NextResponse.json({ error: 'Failed to update token balance' }, { status: 500 });
    }

    // Log token usage
    const { error: logError } = await supabase
      .from('token_ledger')
      .insert({
        user_id: user.id,
        tokens_deducted: tokensToDeduct,
        artifact_type: artifactType,
        note: note
      });

    if (logError) {
      console.error('Error logging token usage:', logError);
    }

    return NextResponse.json(aiData);
  } catch (error: any) {
    console.error('Generation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}