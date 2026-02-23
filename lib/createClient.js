
import { createClient} from '@supabase/supabase-js'
const supabaseUrl = 'https://eyxdgomtavknyelgjhfx.supabase.co'
const supabaseKey = "sb_publishable_ZqUHavEtE1D_iUW6M4XQNA_JV5hG5mn"
const supabase = createClient(supabaseUrl, supabaseKey)
export default supabase;