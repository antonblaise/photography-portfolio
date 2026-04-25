import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// This creates a single connection "client" we can use anywhere in the app
export const supabase = createClient(supabaseUrl, supabaseAnonKey)