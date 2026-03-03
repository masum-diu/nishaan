
import { createClient} from '@supabase/supabase-js'
const supabaseUrl = 'https://yddrboxchjfupzjabxcs.supabase.co'
const supabaseKey ="sb_publishable_iRCYiKDorbjXmRsOircwZA_3PWQnuZ-"
const supabase = createClient(supabaseUrl, supabaseKey)
export default supabase;