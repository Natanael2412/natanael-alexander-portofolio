const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({path: '.env.local'});
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function test() {
  const { data, error } = await supabase.from('projects').select('*').eq('is_personal_published', true);
  console.log('Data:', data?.length);
  console.log('Error:', error);
}
test();
