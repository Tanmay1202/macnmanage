import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, ShieldCheck, Zap, GitBranch } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { name, email, password, confirmPassword } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        if (password !== confirmPassword) { setError('Passwords do not match'); return; }
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Something went wrong');
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "flex h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 text-sm text-white placeholder:text-slate-600 focus:border-emerald-500/60 focus:bg-white/[0.05] focus:ring-1 focus:ring-emerald-500/40 transition-all outline-none";
    const labelClass = "text-xs font-semibold text-slate-400 uppercase tracking-widest";

    return (
        <div className="min-h-screen flex bg-[#020617]" style={{ fontFamily: 'var(--font-sans)' }}>
            {/* Left brand panel */}
            <div className="hidden lg:flex w-[45%] flex-col justify-between p-12 border-r border-white/[0.05] relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(16,185,129,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.03) 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-600/8 blur-[100px] rounded-full pointer-events-none" />

                <div className="relative z-10">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-gradient-to-br from-violet-500 via-indigo-500 to-blue-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30 text-sm">M</div>
                        <span className="font-semibold text-slate-200 tracking-tight text-lg" style={{ fontFamily: 'var(--font-mono)' }}>MacnManage</span>
                    </div>
                </div>

                <div className="relative z-10 space-y-8">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-3 leading-tight">
                            Join the platform<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">built for scale.</span>
                        </h2>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                            Get started in minutes. Full access to inventory management, production monitoring, and event logging.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {[
                            { icon: ShieldCheck, label: 'Secure by default', sub: 'JWT auth · Protected API routes' },
                            { icon: Zap, label: '99.9% Uptime', sub: 'Built for production environments' },
                            { icon: GitBranch, label: 'Open Source', sub: 'MIT License · Full transparency' },
                        ].map(({ icon: Icon, label, sub }) => (
                            <div key={label} className="flex items-start gap-3 p-3 rounded-xl border border-white/[0.04] bg-white/[0.02]">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
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
                        <h1 className="text-2xl font-bold text-white mb-1.5">Create your account</h1>
                        <p className="text-slate-400 text-sm">Join the resource management system</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 text-sm text-red-400 bg-red-500/8 border border-red-500/20 rounded-xl flex items-start gap-3">
                            <AlertCircle size={16} className="shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className={labelClass} htmlFor="name" style={{ fontFamily: 'var(--font-mono)' }}>Full Name</label>
                            <input type="text" name="name" value={name} onChange={onChange} className={inputClass} placeholder="John Doe" required />
                        </div>
                        <div className="space-y-2">
                            <label className={labelClass} htmlFor="email" style={{ fontFamily: 'var(--font-mono)' }}>Email</label>
                            <input type="email" name="email" value={email} onChange={onChange} className={inputClass} placeholder="john@company.com" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className={labelClass} htmlFor="password" style={{ fontFamily: 'var(--font-mono)' }}>Password</label>
                                <input type="password" name="password" value={password} onChange={onChange} className={inputClass} placeholder="••••••••" required />
                            </div>
                            <div className="space-y-2">
                                <label className={labelClass} htmlFor="confirmPassword" style={{ fontFamily: 'var(--font-mono)' }}>Confirm</label>
                                <input type="password" name="confirmPassword" value={confirmPassword} onChange={onChange} className={inputClass} placeholder="••••••••" required />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-500 mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium underline underline-offset-4 transition-colors">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
