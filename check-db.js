const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pcbmjbmejoncljpsshxa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjYm1qYm1lam9uY2xqcHNzaHhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MDU4ODQsImV4cCI6MjA4NjQ4MTg4NH0.xjOeUFaGZigOefey9G0G9Cn9KiJejLQ45rQ1ktt9f1U';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumns() {
    console.log('🔍 Listing columns for admin_templates...');
    try {
        // Check for 'resumes' table existence
        const { error: errorResumes } = await supabase.from('resumes').select('count', { count: 'exact', head: true });
        if (errorResumes) {
            console.error('❌ Database error (resumes):', errorResumes.message);
        } else {
            console.log('✅ Table "resumes" exists.');
        }

        // Check for 'profiles' table
        const { error: errorProfiles } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
        if (errorProfiles) {
            console.error('❌ Database error (profiles):', errorProfiles.message);
        } else {
            console.log('✅ Table "profiles" exists.');
        }

        // Check for 'template_generation_logs' table
        const { error: errorLogs } = await supabase.from('template_generation_logs').select('count', { count: 'exact', head: true });
        if (errorLogs) {
            console.error('❌ Database error (template_generation_logs):', errorLogs.message);
        } else {
            console.log('✅ Table "template_generation_logs" exists.');
        }

        // List admins
        const { data: admins, error: errorAdmins } = await supabase.from('profiles').select('email, is_admin');
        if (errorAdmins) {
            console.error('❌ Database error (profiles/admins):', errorAdmins.message);
        } else {
            console.log('👥 Users in profiles:', admins);
        }

        const { data, error } = await supabase.from('admin_templates').select('*').limit(1);
        if (error) {
            console.error('❌ Database error (admin_templates):', error.message);
        } else {
            console.log('✅ Columns found for admin_templates:', Object.keys(data[0] || {}).join(', '));
        }
    } catch (e) {
        console.error('❌ Script failure:', e);
    }
}

checkColumns();
