import Sidebar from '@/components/dashboard/Sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen">
            <Sidebar />

            <div className="pl-64">
                <main className="min-h-screen">
                    {children}
                </main>
            </div>
        </div>
    );
}
