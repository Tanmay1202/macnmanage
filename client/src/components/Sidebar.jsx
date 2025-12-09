import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { LogOut } from 'lucide-react';

const Sidebar = () => {
    const [user, setUser] = useState({ name: 'Guest', email: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo) {
            setUser(userInfo);
        }
    }, []);

    const logout = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    console.log("Sidebar User State:", user); // Debug Log

    return (
        <aside className="w-64 min-h-screen border-r border-border bg-card hidden md:block relative">
            <div className="p-6">
                <h2 className="text-2xl font-bold tracking-tight text-primary">M / M</h2>
            </div>
            <nav className="space-y-4 p-4">
                <Link to="/" className="flex items-center space-x-2 text-foreground hover:bg-accent/50 p-2 rounded transition-colors bg-accent/20">
                    <span>Dashboard</span>
                </Link>
                <Link to="/inventory" className="flex items-center space-x-2 text-muted-foreground hover:bg-accent/50 p-2 rounded transition-colors">
                    <span>Inventory</span>
                </Link>
                <Link to="/production" className="flex items-center space-x-2 text-muted-foreground hover:bg-accent/50 p-2 rounded transition-colors">
                    <span>Production</span>
                </Link>
                <button onClick={logout} className="flex w-full items-center space-x-2 text-red-500 hover:bg-red-500/10 p-2 rounded transition-colors mt-8">
                    <LogOut size={16} />
                    <span>Logout</span>
                </button>
            </nav>
            {/* User Footer */}
            <div className="absolute bottom-0 p-4 w-64 border-t border-border bg-card">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                            {((user && user.name) ? user.name : 'G').charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate w-24">{user?.name || 'Guest'}</p>
                            <p className="text-xs text-muted-foreground truncate w-24">{user?.email || 'Please Login'}</p>
                        </div>
                    </div>
                    <ThemeToggle />
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
