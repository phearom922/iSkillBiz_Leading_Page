import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create dummy clients if env vars are missing
const createDummyClient = () => {
  console.warn('⚠️ Supabase environment variables are missing. Using dummy client.');
  return createClient('https://dummy.supabase.co', 'dummy-key', {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

// Server-side client with service role (for admin operations)
export const supabaseAdmin = supabaseUrl && (supabaseServiceRoleKey || supabaseAnonKey)
  ? createClient(
      supabaseUrl,
      supabaseServiceRoleKey || supabaseAnonKey!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )
  : createDummyClient();

// Server-side client for user operations
export async function createServerClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return createDummyClient();
  }

  const cookieStore = await cookies();
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        cookie: cookieStore.toString(),
      },
      fetch: (url, options = {}) => {
        // Add timeout to fetch requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
        
        return fetch(url, {
          ...options,
          signal: controller.signal,
        }).finally(() => {
          clearTimeout(timeoutId);
        });
      },
    },
  });
}

