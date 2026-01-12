import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zphcotgpqjnfrxmypusw.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_XrthYl1DQat8cSCGhbF0DQ_Y4xwAXoH';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
