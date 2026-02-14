import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
    // Use direct client to avoid cookie/auth helper issues for simple connection test
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    try {
        // Attempt to access a public table or just check health
        // Since resumes has RLS, count might return 0 or error, but connection should work
        const { count, error } = await supabase
            .from('resumes')
            .select('*', { count: 'exact', head: true });

        // Even if error is RLS (permission denied) or empty, it means we reached the DB
        if (error) {
            // If relation does not exist
            if (error.code === '42P01') {
                return NextResponse.json({
                    success: true, // Connection is fine!
                    message: 'Connected to Supabase project, but "resumes" table missing.',
                    details: error
                }, { status: 200 });
            }

            // If permission denied (RLS works!)
            if (error.code === '42501' || error.message?.includes('permission')) {
                return NextResponse.json({
                    success: true,
                    message: 'Connected to Supabase! (RLS policies are active)',
                    details: error
                }, { status: 200 });
            }

            return NextResponse.json({ success: false, error: error.message, details: error }, { status: 200 }); // Status 200 to debug JSON
        }

        return NextResponse.json({
            success: true,
            message: 'Database connection verified! Table exists.',
            count: count
        }, { status: 200 });

    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 200 });
    }
}
