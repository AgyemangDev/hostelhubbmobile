// /firebase/SupabaseConfig.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jfurmjfquvlwoppwdofj.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_itvsj_xsP439VgSska2hhw_27-WvAD6';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);