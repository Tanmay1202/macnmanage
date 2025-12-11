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
        <aside className="w-16 min-h-screen border-r border-border bg-card hidden md:flex flex-col items-center py-6 z-40 fixed left-0 top-0 bottom-0 shadow-none">
            <div className="mb-8">
                <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center font-bold text-lg text-primary-foreground">M</div>
            </div>
            <nav className="flex-1 w-full flex flex-col items-center space-y-4">
                <Link
                    to="/dashboard"
                    className={`w-10 h-10 flex items-center justify-center rounded-sm transition-colors group relative ${isActive('/dashboard') ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
                    title="Dashboard"
                >
                    <LayoutDashboard size={20} />
                </Link>
                <Link
                    to="/inventory"
                    className={`w-10 h-10 flex items-center justify-center rounded-sm transition-colors group relative ${isActive('/inventory') ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
                    title="Inventory"
                >
                    <Box size={20} />
                </Link>
                <Link
                    to="/production"
                    className={`w-10 h-10 flex items-center justify-center rounded-sm transition-colors group relative ${isActive('/production') ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
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
