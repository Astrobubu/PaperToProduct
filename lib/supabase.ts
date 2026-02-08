import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function createSupabaseClient(): SupabaseClient {
  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a dummy client during build time
    return new Proxy({} as SupabaseClient, {
      get: () => () => ({ data: null, error: { message: "Supabase not configured" } }),
    });
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}

function createSupabaseAdminClient(): SupabaseClient {
  if (!supabaseUrl) {
    return new Proxy({} as SupabaseClient, {
      get: () => () => ({ data: null, error: { message: "Supabase not configured" } }),
    });
  }
  return createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey);
}

// Client-side Supabase client (uses anon key)
export const supabase = createSupabaseClient();

// Server-side Supabase client (uses service role key for full access)
export const supabaseAdmin = createSupabaseAdminClient();
