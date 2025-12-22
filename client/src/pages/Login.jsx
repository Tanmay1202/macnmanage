import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <div className="w-full max-w-md p-8 space-y-8 bg-slate-900/50 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

                <div className="text-center relative z-10">
                    <div className="mx-auto w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-4 text-indigo-400 border border-indigo-500/20">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v8" /><path d="M8 12h8" /></svg>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Welcome Back</h1>
                    <p className="text-slate-400 mt-2 text-sm">Enter your credentials to access the command center</p>
                </div>

                {error && <div className="p-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                    {error}
                </div>}

                <form onSubmit={onSubmit} className="space-y-6 relative z-10">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide" htmlFor="email">Email</label>
                        <input type="email" name="email" value={email} onChange={onChange}
                            className="flex h-11 w-full rounded-lg border border-white/10 bg-slate-950/50 px-4 text-sm text-white placeholder:text-slate-600 focus:border-indigo-500 focus:bg-slate-900 focus:ring-1 focus:ring-indigo-500 transition-all outline-none"
                            placeholder="name@company.com" required />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide" htmlFor="password">Password</label>
                            <a href="#" className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">Forgot password?</a>
                        </div>
                        <input type="password" name="password" value={password} onChange={onChange}
                            className="flex h-11 w-full rounded-lg border border-white/10 bg-slate-950/50 px-4 text-sm text-white placeholder:text-slate-600 focus:border-indigo-500 focus:bg-slate-900 focus:ring-1 focus:ring-indigo-500 transition-all outline-none"
                            placeholder="••••••••" required />
                    </div>

                    <button type="submit" className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 transform hover:-translate-y-0.5">
                        Sign In
                    </button>
                </form>
                <div className="text-center text-sm text-slate-500 relative z-10">
                    Don't have an account? <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline underline-offset-4 ml-1">Register</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
