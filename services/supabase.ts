import { createClient, type User } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL?.trim() ||
  'https://uqwvecarkaciwqynjsqw.supabase.co';

const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() ||
  'sb_publishable_h381S7z8sWSvrdhYeolBrA_Ak4gnIzr';

export const supabaseConfigured = Boolean(supabaseUrl && supabaseKey);

export const supabase = supabaseConfigured
  ? createClient(supabaseUrl!, supabaseKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export function toAppUser(user: User) {
  const name =
    user.user_metadata?.name ||
    user.user_metadata?.full_name ||
    user.email?.split('@')[0] ||
    'Explorer';

  return {
    id: user.id,
    name,
    email: user.email || '',
    role: user.app_metadata?.role || 'user',
    avatar:
      user.user_metadata?.avatar_url ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    joinedAt: user.created_at,
  };
}
