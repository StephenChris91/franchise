// utils/supabaseAdmin.js
import { createClient } from "@supabase/supabase-js";
const SupabaseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}`;
const SupabaseAnonKey = `${process.env.SUPABASE_ANON_KEY}`;

export const supabaseAdmin = createClient(SupabaseUrl, SupabaseAnonKey);
