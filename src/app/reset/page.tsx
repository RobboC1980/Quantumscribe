'use client';

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createClient } from '@/utils/supabaseClient';
import styles from './page.module.css';

export default function ResetPage() {
  const supabase = createClient();

  return (
    <div className={styles.container}>
      <div className={styles.centerContainer}>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={['google']}
          theme="dark"
          view="update_password"
          redirectTo={`${process.env.NEXT_PUBLIC_BASE_URL}/login`}
          showLinks={false}
          localization={{
            variables: {
              forgotten_password: {
                email_label: 'Email',
                password_label: 'New Password',
                button_label: 'Reset Password',
                loading_button_label: 'Resetting...',
                confirmation_text: 'Check your email for the password reset link',
                link_text: 'Back to Sign In',
              },
            },
          }}
        />
      </div>
    </div>
  );
}
