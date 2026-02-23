import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { LogOut, LayoutDashboard, Box, Activity } from 'lucide-react';

const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/inventory', icon: Box, label: 'Inventory' },
    { to: '/production', icon: Activity, label: 'Production' },
];

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const logout = () => {
        localStorage.removeItem('userInfo');
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <aside className="w-16 min-h-[calc(100vh-2rem)] my-4 ml-4 rounded-2xl border border-white/[0.06] bg-[#0a0f1e]/80 backdrop-blur-xl hidden md:flex flex-col items-center py-5 z-40 fixed left-0 top-0 shadow-2xl shadow-black/60">

            {/* Logo */}
            <div className="mb-8">
                <div className="w-9 h-9 bg-gradient-to-br from-violet-500 via-indigo-500 to-blue-600 rounded-xl flex items-center justify-center font-bold text-base text-white shadow-lg shadow-indigo-500/30">
                    M
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 w-full flex flex-col items-center gap-1 px-2">
                {navItems.map(({ to, icon: Icon, label }) => (
                    <div key={to} className="relative group w-full flex justify-center">
                        <Link
                            to={to}
                            className={`relative w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer ${isActive(to)
                                    ? 'bg-indigo-500/20 text-indigo-300 glow-indigo'
                                    : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.06]'
                                }`}
                            title={label}
                        >
                            {/* Active indicator bar */}
                            {isActive(to) && (
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-indigo-400 rounded-r-full shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
                            )}
                            <Icon size={18} strokeWidth={isActive(to) ? 2 : 1.7} />
                        </Link>

                        {/* Tooltip */}
                        <span className="pointer-events-none absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md bg-slate-800 border border-white/10 text-xs font-semibold text-slate-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 shadow-xl" style={{ fontFamily: 'var(--font-mono)' }}>
                            {label}
                        </span>
                    </div>
                ))}
            </nav>

            {/* Bottom */}
            <div className="flex flex-col items-center gap-2 mt-auto">
                <div className="scale-75">
                    <ThemeToggle />
                </div>
                <button
                    onClick={logout}
                    className="w-10 h-10 flex items-center justify-center text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200 cursor-pointer"
                    title="Logout"
                >
                    <LogOut size={18} strokeWidth={1.7} />
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
