import { createClient } from "@supabase/supabase-js";

// No Expo, usamos process.env ou as variáveis carregadas pelo plugin
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";
console.log("Supabase URL:", supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Como o app usa SQLite local, desativamos o persist nativo do Supabase Auth se preferir gerenciar via MMKV
    autoRefreshToken: true,
  },
});
