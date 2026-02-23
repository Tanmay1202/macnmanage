import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, Activity, Database, Cpu } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { email, password } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Something went wrong');
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-[#020617]" style={{ fontFamily: 'var(--font-sans)' }}>
            {/* Left brand panel */}
            <div className="hidden lg:flex w-[45%] flex-col justify-between p-12 border-r border-white/[0.05] relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />

                <div className="relative z-10">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-gradient-to-br from-violet-500 via-indigo-500 to-blue-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30 text-sm">M</div>
                        <span className="font-semibold text-slate-200 tracking-tight text-lg" style={{ fontFamily: 'var(--font-mono)' }}>MacnManage</span>
                    </div>
                </div>

                <div className="relative z-10 space-y-8">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-3 leading-tight">
                            Command your<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">manufacturing floor.</span>
                        </h2>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                            Real-time inventory, production monitoring, and resource management — all in one place.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {[
                            { icon: Database, label: 'Centralized Inventory', sub: 'Raw Materials · Tools · Finished Goods' },
                            { icon: Activity, label: 'Live Production Monitor', sub: 'Machine status & efficiency tracking' },
                            { icon: Cpu, label: 'Event Logging', sub: 'Granular start/stop/output records' },
                        ].map(({ icon: Icon, label, sub }) => (
                            <div key={label} className="flex items-start gap-3 p-3 rounded-xl border border-white/[0.04] bg-white/[0.02]">
                                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                                    <Icon size={15} strokeWidth={1.7} />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-200">{label}</p>
                                    <p className="text-xs text-slate-500" style={{ fontFamily: 'var(--font-mono)' }}>{sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="text-xs text-slate-600 relative z-10" style={{ fontFamily: 'var(--font-mono)' }}>© 2024 MacnManage</p>
            </div>

            {/* Right form panel */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-white mb-1.5">Welcome back</h1>
                        <p className="text-slate-400 text-sm">Enter your credentials to access the command center</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 text-sm text-red-400 bg-red-500/8 border border-red-500/20 rounded-xl flex items-start gap-3">
                            <AlertCircle size={16} className="shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest" htmlFor="email" style={{ fontFamily: 'var(--font-mono)' }}>
                                Email
                            </label>
                            <input
                                type="email" name="email" value={email} onChange={onChange}
                                className="flex h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 text-sm text-white placeholder:text-slate-600 focus:border-indigo-500/60 focus:bg-white/[0.05] focus:ring-1 focus:ring-indigo-500/40 transition-all outline-none"
                                placeholder="name@company.com" required
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest" htmlFor="password" style={{ fontFamily: 'var(--font-mono)' }}>
                                    Password
                                </label>
                                <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Forgot password?</a>
                            </div>
                            <input
                                type="password" name="password" value={password} onChange={onChange}
                                className="flex h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 text-sm text-white placeholder:text-slate-600 focus:border-indigo-500/60 focus:bg-white/[0.05] focus:ring-1 focus:ring-indigo-500/40 transition-all outline-none"
                                placeholder="••••••••" required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-500 mt-6">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium underline underline-offset-4 transition-colors">Register</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
