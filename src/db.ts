import 'dotenv/config';
import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const supabase = createClient(process.env.SUPABASE_URL, process.env.LOCAL_SUPABASE_SERVICE_ROLE_KEY)

/*
supabase
  .from('countries')
  .select('*')
  .limit(5)
  .then(response => {
    console.log(response)
  });

*/

export default supabase;