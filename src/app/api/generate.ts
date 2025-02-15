import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const QWEN_API_URL = 'https://api.qwen.ai/v1/completions'; //  REPLACE with actual Qwen endpoint
const QWEN_API_KEY = process.env.QWEN_API_KEY; //  Store your Qwen API key securely

export async function POST(request: Request) {
  const { prompt, artifactType, includeAcceptanceCriteria, includeTestScripts } = await request.json();

  // ... (Supabase authentication and token check) ...
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
    return NextResponse.json({ error: 'Unauthorized or user not found' }, { status: 401 });
  }

    let tokensToDeduct = 1; // Default token deduction
    let note = 'Standard deduction on prompt generation';

    if (artifactType === 'user_story') {
        tokensToDeduct = 2; // Base cost for user stories
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
      tokensToDeduct = 5; // Example cost. Adjust as needed.
      note = "Epic Generation"
    } else if (artifactType === 'task') {
      tokensToDeduct = 1;
      note = "Task Generation"
    }

  if (user.tokens < tokensToDeduct) {
    return NextResponse.json({ error: 'Insufficient tokens. Please upgrade or purchase more tokens.' }, { status: 402 });
  }


  try {
    const aiResponse = await fetch(QWEN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${QWEN_API_KEY}`, //  Add authentication if required
      },
      body: JSON.stringify({
        model: 'qwen-max', //  Specify the Qwen model
        prompt: prompt, //  Your prompt
        //  Add other Qwen API parameters as needed (e.g., temperature, max_tokens)
      }),
    });

    if (!aiResponse.ok) {
      const errorData = await aiResponse.json();
      console.error('Qwen API Error:', errorData);
      return NextResponse.json({ error: 'Failed to generate content from Qwen API' }, { status: aiResponse.status });
    }

    const aiData = await aiResponse.json();

     // ... (Token deduction and ledger update) ...
    const updatedTokens = user.tokens - tokensToDeduct;

    const { error: updateError } = await supabase
        .from('users')
        .update({ tokens: updatedTokens })
        .eq('id', user.id);

    if (updateError) {
        console.error('Token update error:', updateError);
        // Consider rolling back the AI generation if the token update fails.
    }

    await supabase.from('token_ledger').insert([
        {
        user_id: user.id,
        category: artifactType, // Use the artifact type
        tokens_deducted: tokensToDeduct,
        note: note,
        },
    ]);

    return NextResponse.json({ artefacts: aiData, tokensRemaining: updatedTokens });
  } catch (error: any) {
    console.error('Generation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 