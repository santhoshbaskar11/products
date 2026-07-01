import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ytcpotuczcvhcbnflkkj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0Y3BvdHVjemN2aGNibmZsa2tqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4MjcwNDQsImV4cCI6MjA5ODQwMzA0NH0.RYRCnEEsDcQ4fP1e1TK_smA43gAVz4_hl7d_ZmiTRBM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testTableNames() {
  const tables = ['custom_grooming', 'custom_kit_items', 'kit_items', 'custom_items'];
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.log(`Table "${table}": Error: ${error.message} (${error.code})`);
    } else {
      console.log(`Table "${table}": EXISTS (returned ${data.length} row(s))`);
    }
  }
}

testTableNames();
