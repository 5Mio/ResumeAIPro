'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, Plus, Settings, LogOut, User, GraduationCap, Briefcase } from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();
    const isStudent = pathname?.startsWith('/dashboard/student');

    const professionalNavigation = [
        { name: 'Meine Lebensläufe', href: '/dashboard', icon: FileText },
        { name: 'Neuer Lebenslauf', href: '/dashboard/editor/new', icon: Plus },
        { name: 'Einstellungen', href: '/dashboard/settings', icon: Settings },
    ];

    const studentNavigation = [
        { name: 'Schüler Dashboard', href: '/dashboard/student', icon: FileText },
        { name: 'Neuer Schüler-CV', href: '/dashboard/student/editor/new', icon: Plus },
        { name: 'Einstellungen', href: '/dashboard/settings', icon: Settings },
    ];

    const adminNavigation = [
        { name: 'Admin Dashboard', href: '/dashboard/admin/templates', icon: Briefcase },
        { name: 'Template Generator', href: '/dashboard/admin/templates/create', icon: Plus },
        { name: 'Generation Logs', href: '/dashboard/admin/logs', icon: FileText },
    ];

    const navigation = isStudent ? studentNavigation : professionalNavigation;
    const isAdmin = pathname?.startsWith('/dashboard/admin');

    return (
        <aside className={`fixed inset-y-0 left-0 w-64 bg-white border-r transition-colors duration-300 ${isStudent ? 'border-indigo-100 shadow-xl shadow-indigo-100/20' : 'border-gray-200 shadow-xl shadow-gray-100/20'}`}>
            <div className="flex flex-col h-full">
                {/* Logo Section */}
                <div className={`flex items-center gap-3 px-6 py-6 border-b transition-colors ${isStudent ? 'border-indigo-50' : 'border-gray-100'}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transform rotate-3 active:rotate-0 transition-transform ${isStudent ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-gradient-to-br from-blue-600 to-indigo-700'}`}>
                        {isStudent ? <GraduationCap className="w-6 h-6 text-white" /> : <Briefcase className="w-5 h-5 text-white" />}
                    </div>
                    <div>
                        <span className={`text-xl font-black tracking-tight ${isStudent ? 'text-indigo-900' : 'text-gray-900'}`}>ResumeAI</span>
                        <div className="flex items-center gap-1">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${isStudent ? 'bg-indigo-100 text-indigo-600' : 'bg-blue-100 text-blue-600'}`}>
                                {isStudent ? 'Schüler' : 'Profi'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 px-4 py-8 space-y-2">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group relative overflow-hidden ${isActive
                                    ? (isStudent ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-blue-600 text-white shadow-lg shadow-blue-200')
                                    : 'text-gray-500 hover:bg-gray-50'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 z-10 ${isActive ? 'text-white' : (isStudent ? 'text-indigo-400' : 'text-gray-400')}`} />
                                <span className="font-bold text-sm z-10">{item.name}</span>
                                {isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] animate-[shimmer_2s_infinite]" />
                                )}
                            </Link>
                        );
                    })}

                    {/* Admin Section */}
                    {isAdmin && (
                        <div className="pt-8 pb-4">
                            <p className="px-4 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                Admin Management
                            </p>
                            {adminNavigation.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group relative overflow-hidden mb-2 ${isActive
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                            : 'text-gray-500 hover:bg-gray-50'
                                            }`}
                                    >
                                        <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 z-10 ${isActive ? 'text-white' : 'text-indigo-400'}`} />
                                        <span className="font-bold text-sm z-10">{item.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </nav>

                {/* Mode Switcher Footer */}
                <div className={`p-4 mt-auto border-t transition-colors ${isStudent ? 'border-indigo-50 bg-indigo-50/30' : 'border-gray-100 bg-gray-50/30'}`}>
                    <Link href={isStudent ? '/dashboard' : '/dashboard/student'}>
                        <div className={`p-3 rounded-xl border-2 border-dashed transition-all text-center group cursor-pointer ${isStudent
                            ? 'border-indigo-200 hover:border-indigo-500 hover:bg-white'
                            : 'border-blue-200 hover:border-blue-500 hover:bg-white'
                            }`}>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Modus wechseln</p>
                            <p className={`text-xs font-bold flex items-center justify-center gap-2 ${isStudent ? 'text-indigo-600' : 'text-blue-600'}`}>
                                {isStudent ? <Briefcase className="w-3 h-3" /> : <GraduationCap className="w-4 h-4" />}
                                Zu {isStudent ? 'Profi' : 'Schüler'} &rarr;
                            </p>
                        </div>
                    </Link>

                    {/* User Mini Profile */}
                    <div className="mt-4 flex items-center gap-3 px-2">
                        <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center overflow-hidden bg-white ${isStudent ? 'border-indigo-100' : 'border-gray-200'}`}>
                            <User className={`w-6 h-6 ${isStudent ? 'text-indigo-300' : 'text-gray-300'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">Adnan</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Premium Plan</p>
                        </div>
                        <button className="p-2 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors text-gray-400">
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
}
