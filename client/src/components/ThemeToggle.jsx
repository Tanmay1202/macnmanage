import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = () => {
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            setTheme(storedTheme);
            document.documentElement.classList.toggle('dark', storedTheme === 'dark');
        } else {
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

    return (
        <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-200 hover:bg-white/[0.06] transition-all duration-200 cursor-pointer"
            title="Toggle Theme"
        >
            <span
                className="transition-transform duration-300"
                style={{ transform: theme === 'dark' ? 'rotate(0deg)' : 'rotate(180deg)' }}
            >
                {theme === 'dark' ? <Sun size={18} strokeWidth={1.7} /> : <Moon size={18} strokeWidth={1.7} />}
            </span>
        </button>
    );
};

export default ThemeToggle;
