import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Box, Activity, ShieldCheck, Zap, Database, Lock, Cpu, GitBranch } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();

    React.useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) navigate('/dashboard');
    }, [navigate]);

    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-indigo-500/30 overflow-x-hidden" style={{ fontFamily: 'var(--font-sans)' }}>

            {/* Background grid */}
            <div className="fixed inset-0 z-0 pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)',
                    backgroundSize: '48px 48px'
                }} />
            {/* Radial glow top center */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none z-0" />

            {/* Floating Navbar */}
            <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-6xl">
                <div className="flex items-center justify-between px-6 h-14 rounded-2xl border border-white/[0.08] bg-[#020617]/80 backdrop-blur-xl shadow-2xl shadow-black/40">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-gradient-to-br from-violet-500 via-indigo-500 to-blue-600 rounded-lg flex items-center justify-center font-bold text-sm text-white shadow-lg shadow-indigo-500/30">
                            M
                        </div>
                        <span className="font-semibold tracking-tight text-slate-200" style={{ fontFamily: 'var(--font-mono)' }}>MacnManage</span>
                    </div>
                    <div className="flex items-center gap-5 text-sm font-medium">
                        <Link to="/login" className="text-slate-400 hover:text-white transition-colors duration-150">Log in</Link>
                        <Link to="/register" className="group inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/20 text-sm font-semibold">
                            Get Started <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-40 pb-28 z-10">
                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-semibold tracking-wide uppercase mb-8" style={{ fontFamily: 'var(--font-mono)' }}>
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
                            </span>
                            v1.0 · Production Ready
                        </div>

                        <h1 className="text-5xl md:text-[4.5rem] font-bold tracking-tight mb-6 text-white leading-[1.05]">
                            Control{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400 text-glow-indigo">
                                Chaos.
                            </span>
                            <br />
                            Optimize Flow.
                        </h1>
                        <p className="text-lg text-slate-400 mb-10 leading-relaxed max-w-lg">
                            The comprehensive resource management system built for high-precision manufacturing environments. Real-time insights, zero guesswork.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 max-w-md">
                            <Link to="/register" className="w-full sm:w-auto h-12 bg-white text-slate-950 hover:bg-slate-100 px-8 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-xl shadow-white/10">
                                Start Free Trial <ArrowRight size={16} />
                            </Link>
                            <Link to="/login" className="w-full sm:w-auto h-12 border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 px-8 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center">
                                Live Demo
                            </Link>
                        </div>

                        <div className="mt-10 flex items-center gap-6 text-sm text-slate-500" style={{ fontFamily: 'var(--font-mono)' }}>
                            <div className="flex items-center gap-2">
                                <ShieldCheck size={14} className="text-emerald-400" />
                                <span>SOC2 Compliant</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Zap size={14} className="text-amber-400" />
                                <span>99.9% Uptime</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <GitBranch size={14} className="text-indigo-400" />
                                <span>Open Source</span>
                            </div>
                        </div>
                    </div>

                    {/* Hero Mockup */}
                    <div className="relative">
                        <div className="absolute -inset-8 bg-indigo-500/10 blur-[60px] rounded-full opacity-50 pointer-events-none" />
                        <div className="relative rounded-2xl border border-white/10 bg-[#080f20]/90 backdrop-blur-sm p-1 shadow-2xl shadow-black/60">
                            {/* Window chrome */}
                            <div className="bg-[#0d1526] rounded-xl border border-white/[0.05] overflow-hidden">
                                <div className="h-10 border-b border-white/[0.05] flex items-center gap-2.5 px-4 bg-[#0a1020]">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-500/60" />
                                        <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                                        <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                                    </div>
                                    <span className="text-[10px] text-slate-600 ml-2" style={{ fontFamily: 'var(--font-mono)' }}>macnmanage — dashboard</span>
                                </div>

                                <div className="p-5 space-y-4" style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                                    {/* Status row */}
                                    <div className="flex justify-between items-center text-slate-500 border-b border-white/[0.04] pb-3">
                                        <span>STATUS: OPERATIONAL</span>
                                        <span className="text-emerald-400 flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                                            LIVE
                                        </span>
                                    </div>

                                    {/* Stat cards */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/15">
                                            <div className="text-indigo-400 text-[10px] mb-1.5 uppercase tracking-wider">Total Output</div>
                                            <div className="text-2xl font-bold text-white">2,450 <span className="text-[9px] text-slate-500">UNITS</span></div>
                                            <div className="text-emerald-400 text-[9px] mt-1">↑ +12.4% this week</div>
                                        </div>
                                        <div className="p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/15">
                                            <div className="text-emerald-400 text-[10px] mb-1.5 uppercase tracking-wider">Efficiency</div>
                                            <div className="text-2xl font-bold text-white">98.2<span className="text-[9px] text-slate-500">%</span></div>
                                            <div className="text-emerald-400 text-[9px] mt-1">↑ All lines nominal</div>
                                        </div>
                                    </div>

                                    {/* Efficiency bar */}
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between text-[9px] text-slate-500 uppercase tracking-wider">
                                            <span>Line Throughput</span><span className="text-slate-300">98%</span>
                                        </div>
                                        <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                                            <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" style={{ width: '98%' }} />
                                        </div>
                                    </div>

                                    {/* Log lines */}
                                    <div className="space-y-1.5 pt-1">
                                        {[
                                            { time: '14:31:02', level: 'INFO', msg: 'Production cycle initiated · Line-1' },
                                            { time: '14:31:18', level: 'INFO', msg: 'Inventory sync complete · 142 items' },
                                            { time: '14:31:45', level: 'WARN', msg: 'Low stock alert · Steel Rod' },
                                        ].map((log, i) => (
                                            <div key={i} className="flex gap-3 items-center text-[10px] text-slate-500">
                                                <span className="opacity-50 shrink-0">{log.time}</span>
                                                <span className={log.level === 'WARN' ? 'text-amber-400' : 'text-indigo-400'}>{log.level}</span>
                                                <span className="truncate">{log.msg}</span>
                                            </div>
                                        ))}
                                        <div className="flex items-center gap-1 text-slate-600 text-[10px] mt-1">
                                            <span className="w-2 h-3 border-r border-slate-500 animate-pulse inline-block" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Bento Section */}
            <section className="py-28 border-t border-white/[0.04] relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <p className="text-xs font-bold text-indigo-400 tracking-widest uppercase mb-3" style={{ fontFamily: 'var(--font-mono)' }}>Platform Capabilities</p>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">Built for precision manufacturing</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                        {/* Large card */}
                        <div className="md:col-span-2 group p-8 rounded-2xl border border-white/[0.06] bg-slate-900/30 hover:bg-slate-900/50 hover:border-indigo-500/30 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
                            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform duration-200">
                                <Database size={22} strokeWidth={1.6} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">Centralized Inventory Core</h3>
                            <p className="text-slate-400 leading-relaxed max-w-lg text-sm">
                                Complete CRUD for Raw Materials, Tools, and Finished Goods. Real-time valuation tracking and automated low-stock alerts ensure zero production downtime.
                            </p>
                            <div className="mt-6 flex gap-2 flex-wrap">
                                {['CRUD Operations', 'Real-time Valuation', 'Low-stock Alerts'].map(tag => (
                                    <span key={tag} className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs" style={{ fontFamily: 'var(--font-mono)' }}>{tag}</span>
                                ))}
                            </div>
                        </div>

                        {/* Tall card */}
                        <div className="md:row-span-2 group p-8 rounded-2xl border border-white/[0.06] bg-slate-900/30 hover:bg-slate-900/50 hover:border-emerald-500/20 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform duration-200">
                                <Activity size={22} strokeWidth={1.6} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">Production Monitor</h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                Visualize active machines with real-time status indicators and efficiency tracking.
                            </p>
                            <div className="space-y-3">
                                {['Live Efficiency Bars', 'Event Logging', 'Downtime Tracking', 'Start/Stop/Output Events'].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 text-sm text-slate-300">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Small card 1 */}
                        <div className="group p-7 rounded-2xl border border-white/[0.06] bg-slate-900/30 hover:bg-slate-900/50 hover:border-violet-500/20 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
                            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400 mb-4 group-hover:scale-110 transition-transform">
                                <Cpu size={18} strokeWidth={1.6} />
                            </div>
                            <h3 className="text-base font-bold mb-2 text-white">Event Logging</h3>
                            <p className="text-sm text-slate-400">Granular tracking of start, stop, and output events per machine.</p>
                        </div>

                        {/* Small card 2 */}
                        <div className="group p-7 rounded-2xl border border-white/[0.06] bg-slate-900/30 hover:bg-slate-900/50 hover:border-amber-500/20 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                                <Lock size={18} strokeWidth={1.6} />
                            </div>
                            <h3 className="text-base font-bold mb-2 text-white">Secure Access</h3>
                            <p className="text-sm text-slate-400">JWT-based authentication with protected API routes.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative z-10">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="relative rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-900/40 via-violet-900/30 to-[#020617] p-14 text-center overflow-hidden">
                        <div className="absolute inset-0 opacity-30" style={{
                            backgroundImage: 'linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px)',
                            backgroundSize: '32px 32px'
                        }} />
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-5 tracking-tight">Ready to optimize?</h2>
                            <p className="text-slate-400 text-lg mb-10 max-w-lg mx-auto">Join manufacturers who have streamlined operations with MacnManage.</p>
                            <Link to="/register" className="inline-flex h-13 items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-3 rounded-2xl font-semibold transition-all duration-200 shadow-2xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-0.5 text-base">
                                Get Started Now <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-10 border-t border-white/[0.04] relative z-10">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-md flex items-center justify-center font-bold text-[10px] text-white">M</div>
                        <span className="font-semibold text-sm text-slate-400" style={{ fontFamily: 'var(--font-mono)' }}>MacnManage</span>
                    </div>
                    <div className="text-[11px] text-slate-600" style={{ fontFamily: 'var(--font-mono)' }}>
                        © 2024 MacnManage · Open Source · MIT License
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
