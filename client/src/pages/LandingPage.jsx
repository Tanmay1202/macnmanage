import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Box, Activity, GitBranch, ShieldCheck, Zap, BarChart3, Database, Lock, Cpu } from 'lucide-react';

const LandingPage = () => {
    // Auth Check
    const navigate = useNavigate();

    React.useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            navigate('/dashboard');
        }
    }, [navigate]);

    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden">
            {/* Background Grid Pattern */}
            <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)', backgroundSize: '50px 50px' }}>
            </div>

            {/* Navbar */}
            <nav className="border-b border-indigo-500/10 bg-[#020617]/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded flex items-center justify-center font-bold text-lg text-white shadow-lg shadow-indigo-500/20">M</div>
                        <span className="font-semibold tracking-tight text-lg text-slate-200">MacnManage</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm font-medium">
                        <Link to="/login" className="text-slate-400 hover:text-white transition-colors">Log in</Link>
                        <Link to="/register" className="group bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-sm transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/10">
                            Get Started <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-24 border-b border-indigo-500/10 z-10">
                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                    <div className="text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-semibold tracking-wide uppercase mb-8">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                            </span>
                            v1.0 Production Ready
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-white leading-[1.1]">
                            Control <span className="text-indigo-500">Chaos.</span><br />
                            Optimize Flow.
                        </h1>
                        <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed max-w-xl">
                            The comprehensive resource management system built for high-precision manufacturing environments.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 max-w-md">
                            <Link to="/register" className="w-full sm:w-auto h-12 bg-white text-slate-950 hover:bg-slate-200 px-8 rounded-sm font-semibold transition-all flex items-center justify-center gap-2">
                                Start Free Trial <ArrowRight size={18} />
                            </Link>
                            <Link to="/login" className="w-full sm:w-auto h-12 border border-slate-800 bg-slate-900/50 hover:bg-slate-900 text-white px-8 rounded-sm font-semibold transition-all flex items-center justify-center">
                                Live Demo
                            </Link>
                        </div>

                        <div className="mt-12 flex items-center gap-6 text-sm text-slate-500 font-mono">
                            <div className="flex items-center gap-2">
                                <ShieldCheck size={16} className="text-emerald-500" />
                                <span>SOC2 Compliant</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Zap size={16} className="text-amber-500" />
                                <span>99.9% Uptime</span>
                            </div>
                        </div>
                    </div>

                    {/* Right side technical visual */}
                    <div className="relative">
                        <div className="absolute -inset-4 bg-indigo-500/20 blur-3xl rounded-full opacity-30"></div>
                        <div className="relative rounded-xl border border-indigo-500/20 bg-[#0B1120]/80 backdrop-blur-sm p-1 shadow-2xl">
                            <div className="bg-[#0f172a] rounded-lg border border-indigo-500/10 overflow-hidden">
                                {/* Visual Header */}
                                <div className="h-10 border-b border-indigo-500/10 flex items-center gap-2 px-4 bg-[#1e293b]/50">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                                        <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                                        <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                                    </div>
                                </div>
                                {/* Visual Body / Code / Graph Placeholder */}
                                <div className="p-6 space-y-4 font-mono text-xs">
                                    <div className="flex justify-between items-center text-slate-400 border-b border-indigo-500/10 pb-2">
                                        <span>STATUS: OPERATIONAL</span>
                                        <span className="text-emerald-500">● LIVE</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-indigo-500/5 rounded border border-indigo-500/20">
                                            <div className="text-indigo-400 mb-1">Total Output</div>
                                            <div className="text-2xl font-bold text-white">2,450 <span className="text-[10px] text-slate-500">UNITS</span></div>
                                        </div>
                                        <div className="p-4 bg-emerald-500/5 rounded border border-emerald-500/20">
                                            <div className="text-emerald-400 mb-1">Efficiency</div>
                                            <div className="text-2xl font-bold text-white">98.2<span className="text-[10px] text-slate-500">%</span></div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="flex gap-3 items-center text-slate-500">
                                                <span className="w-12 opacity-50">10:4{i}:22</span>
                                                <span className="text-indigo-400">INFO</span>
                                                <span>Production cycle initiated on Line-{i}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bento Grid Features */}
            <section className="py-32 border-b border-indigo-500/10 relative z-10 bg-[#020617]">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-16 tracking-tight">System Architecture</h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Large Card */}
                        <div className="md:col-span-2 p-8 rounded-xl border border-indigo-500/10 bg-slate-900/40 hover:bg-slate-900/60 hover:border-indigo-500/30 transition-all group">
                            <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                                <Database size={24} />
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-white">Centralized Inventory Core</h3>
                            <p className="text-slate-400 leading-relaxed max-w-lg">
                                Complete CRUD capability for Raw Materials, Tools, and Finished Goods.
                                Real-time valuation tracking and automated low-stock alerts ensure zero downtime.
                            </p>
                        </div>

                        {/* Tall Card */}
                        <div className="md:row-span-2 p-8 rounded-xl border border-indigo-500/10 bg-slate-900/40 hover:bg-slate-900/60 hover:border-indigo-500/30 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-32 bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-colors"></div>
                            <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6 relative z-10 group-hover:scale-110 transition-transform">
                                <Activity size={24} />
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-white relative z-10">Production Monitor</h3>
                            <p className="text-slate-400 leading-relaxed mb-6 relative z-10">
                                Visualize active machines with real-time status indicators.
                            </p>
                            <div className="space-y-3 relative z-10">
                                {['Live Efficiency', 'Usage Logs', 'Downtime Tracking'].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 text-sm text-slate-300">
                                        <CheckCircle size={14} className="text-indigo-500" /> {item}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Small Card 1 */}
                        <div className="p-8 rounded-xl border border-indigo-500/10 bg-slate-900/40 hover:bg-slate-900/60 hover:border-indigo-500/30 transition-all group">
                            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                                <Cpu size={20} />
                            </div>
                            <h3 className="text-lg font-semibold mb-2 text-white">Event Logging</h3>
                            <p className="text-sm text-slate-400">Granular tracking of start, stop, and output events.</p>
                        </div>

                        {/* Small Card 2 */}
                        <div className="p-8 rounded-xl border border-indigo-500/10 bg-slate-900/40 hover:bg-slate-900/60 hover:border-indigo-500/30 transition-all group">
                            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                                <Lock size={20} />
                            </div>
                            <h3 className="text-lg font-semibold mb-2 text-white">Secure Access</h3>
                            <p className="text-sm text-slate-400">JWT-based authentication with protected API routes.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative z-10">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to optimize?</h2>
                    <p className="text-slate-400 text-lg mb-10">Join the manufacturers who have streamlined their operations with MacnManage.</p>
                    <Link to="/register" className="inline-flex h-14 bg-indigo-600 hover:bg-indigo-500 text-white px-10 rounded-full font-semibold items-center justify-center transition-all shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/40">
                        Get Started Now
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-indigo-500/10 bg-[#020617] relative z-10">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-indigo-500/20 rounded-sm flex items-center justify-center font-bold text-xs text-indigo-400">M</div>
                        <span className="font-semibold text-sm text-slate-400">MacnManage</span>
                    </div>
                    <div className="text-xs text-slate-600 font-mono">
                        © 2024 MacnManage Inc. Open Source.
                    </div>
                </div>
            </footer>
        </div>
    );
};

// Simple Icon component helper if needed or import specifically
const CheckCircle = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
);

export default LandingPage;
