import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { name, email, password, confirmPassword } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            // Save to local storage (simple auth)
            console.log("Register Success, saving:", data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <div className="w-full max-w-md p-8 space-y-8 bg-slate-900/50 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 relative overflow-hidden my-8">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="text-center relative z-10">
                    <div className="mx-auto w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 text-emerald-400 border border-emerald-500/20">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Create Account</h1>
                    <p className="text-slate-400 mt-2 text-sm">Join the resource management system</p>
                </div>

                {error && <div className="p-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                    {error}
                </div>}

                <form onSubmit={onSubmit} className="space-y-5 relative z-10">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide" htmlFor="name">Full Name</label>
                        <input type="text" name="name" value={name} onChange={onChange}
                            className="flex h-11 w-full rounded-lg border border-white/10 bg-slate-950/50 px-4 text-sm text-white placeholder:text-slate-600 focus:border-emerald-500 focus:bg-slate-900 focus:ring-1 focus:ring-emerald-500 transition-all outline-none"
                            placeholder="John Doe" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide" htmlFor="email">Email</label>
                        <input type="email" name="email" value={email} onChange={onChange}
                            className="flex h-11 w-full rounded-lg border border-white/10 bg-slate-950/50 px-4 text-sm text-white placeholder:text-slate-600 focus:border-emerald-500 focus:bg-slate-900 focus:ring-1 focus:ring-emerald-500 transition-all outline-none"
                            placeholder="john@example.com" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide" htmlFor="password">Password</label>
                        <input type="password" name="password" value={password} onChange={onChange}
                            className="flex h-11 w-full rounded-lg border border-white/10 bg-slate-950/50 px-4 text-sm text-white placeholder:text-slate-600 focus:border-emerald-500 focus:bg-slate-900 focus:ring-1 focus:ring-emerald-500 transition-all outline-none"
                            placeholder="••••••••" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide" htmlFor="confirmPassword">Confirm Password</label>
                        <input type="password" name="confirmPassword" value={confirmPassword} onChange={onChange}
                            className="flex h-11 w-full rounded-lg border border-white/10 bg-slate-950/50 px-4 text-sm text-white placeholder:text-slate-600 focus:border-emerald-500 focus:bg-slate-900 focus:ring-1 focus:ring-emerald-500 transition-all outline-none"
                            placeholder="••••••••" required />
                    </div>

                    <button type="submit" className="w-full h-11 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-all shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/40 transform hover:-translate-y-0.5 mt-2">
                        Create Account
                    </button>
                </form>
                <div className="text-center text-sm text-slate-500 relative z-10">
                    Already have an account? <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium hover:underline underline-offset-4 ml-1">Login</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
