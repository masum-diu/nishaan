
import { createClient} from '@supabase/supabase-js'
const supabaseUrl = 'https://eyxdgomtavknyelgjhfx.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5eGRnb210YXZrbnllbGdqaGZ4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTc1MTMwMiwiZXhwIjoyMDg3MzI3MzAyfQ.MQSfBq7nkWLCjbi3sG47RUT-Ra6K8uR9qQ8x8ur9F7E"
const supabase = createClient(supabaseUrl, supabaseKey)
export default supabase;