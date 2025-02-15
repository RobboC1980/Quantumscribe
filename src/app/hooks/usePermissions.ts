import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export type UserRole = 'admin' | 'editor' | 'viewer';

export const useUserPermissions = async () => {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user?.id)
    .single();

  return {
    isAdmin: profile?.role === 'admin',
    isEditor: profile?.role === 'editor',
    canEdit: ['admin', 'editor'].includes(profile?.role || 'viewer')
  };
}; 