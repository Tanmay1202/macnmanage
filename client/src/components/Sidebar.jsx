import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { LogOut, LayoutDashboard, Box, Activity, Settings } from 'lucide-react';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const logout = () => {
        localStorage.removeItem('userInfo');
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <aside className="w-16 min-h-[calc(100vh-2rem)] my-4 ml-4 rounded-xl border border-white/10 bg-slate-900/50 backdrop-blur-md hidden md:flex flex-col items-center py-6 z-40 fixed left-0 top-0 shadow-2xl shadow-black/50">
            <div className="mb-8">
                <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center font-bold text-lg text-primary-foreground">M</div>
            </div>
            <nav className="flex-1 w-full flex flex-col items-center space-y-4">
                <Link
                    to="/dashboard"
                    className={`relative group w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-300 ${isActive('/dashboard') ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
                    title="Dashboard"
                >
                    <LayoutDashboard size={20} />
                </Link>
                <Link
                    to="/inventory"
                    className={`relative group w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-300 ${isActive('/inventory') ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
                    title="Inventory"
                >
                    <Box size={20} />
                </Link>
                <Link
                    to="/production"
                    className={`relative group w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-300 ${isActive('/production') ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
                    title="Production"
                >
                    <Activity size={20} />
                </Link>
                {/* Added settings or extra link if needed, keeping minimal for now */}
            </nav>
            <div className="mt-auto flex flex-col items-center space-y-4">
                <div className="scale-75">
                    <ThemeToggle />
                </div>
                <button
                    onClick={logout}
                    className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-sm transition-colors"
                    title="Logout"
                >
                    <LogOut size={20} />
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
