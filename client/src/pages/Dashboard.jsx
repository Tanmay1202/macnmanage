import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import BentoGrid from '../components/BentoGrid';
import { Search, Plus, Activity, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ totalResources: 0, lowStock: 0, activeProduction: 0, systemStatus: 'Nominal' });
    const [recentLogs, setRecentLogs] = useState([]);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const token = userInfo ? userInfo.token : null;
                if (!token) return navigate('/login');
                if (userInfo?.name) setUserName(userInfo.name.split(' ')[0]);

                const [resResources, resLogs] = await Promise.all([
                    fetch('/api/resources', { headers: { Authorization: `Bearer ${token}` } }),
                    fetch('/api/production', { headers: { Authorization: `Bearer ${token}` } })
                ]);

                if (resResources.ok && resLogs.ok) {
                    const resources = await resResources.json();
                    const logs = await resLogs.json();
                    const lowStockCount = resources.filter(r => ['Low Stock', 'Warning', 'Critical', 'Out of Stock'].includes(r.status)).length;
                    const criticalCount = resources.filter(r => r.status === 'Critical').length;
                    const activeCount = resources.filter(r => r.type === 'Machine' && r.status === 'Operational').length;
                    setStats({
                        totalResources: resources.length,
                        lowStock: lowStockCount,
                        activeProduction: activeCount,
                        systemStatus: criticalCount > 0 ? 'Critical' : lowStockCount > 0 ? 'Warning' : 'Nominal'
                    });
                    setRecentLogs(logs.slice(0, 6));
                }
            } catch (error) {
                console.error('Dashboard fetch error', error);
            }
        };
        fetchData();
    }, [navigate]);

    const statusColor = stats.systemStatus === 'Critical' ? 'bg-red-500' : stats.systemStatus === 'Warning' ? 'bg-amber-500' : 'bg-emerald-500';

    return (
        <div className="min-h-screen text-white flex" style={{ fontFamily: 'var(--font-sans)' }}>
            <Sidebar />

            <main className="flex-1 ml-24 mr-4 my-4 flex flex-col min-h-[calc(100vh-2rem)] rounded-2xl border border-white/[0.05] bg-slate-900/20 backdrop-blur-sm shadow-2xl relative overflow-hidden">

                {/* Top Bar */}
                <header className="h-16 border-b border-white/[0.05] bg-[#020617]/70 backdrop-blur-md sticky top-0 z-30 px-8 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search resources..."
                                className="w-full h-9 pl-9 pr-4 rounded-xl border border-white/[0.06] bg-white/[0.03] focus:bg-white/[0.05] focus:border-indigo-500/40 text-sm transition-all focus:outline-none placeholder:text-slate-600 text-slate-200"
                                onKeyDown={e => { if (e.key === 'Enter') navigate(`/inventory?search=${e.target.value}`); }}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* System status pill */}
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.02]">
                            <span className="relative flex h-2 w-2">
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${statusColor}`} />
                                <span className={`relative inline-flex rounded-full h-2 w-2 ${statusColor}`} />
                            </span>
                            <span className="text-xs text-slate-400" style={{ fontFamily: 'var(--font-mono)' }}>
                                System {stats.systemStatus}
                            </span>
                        </div>

                        {/* User avatar */}
                        {userName && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-indigo-500/20">
                                {userName[0].toUpperCase()}
                            </div>
                        )}
                    </div>
                </header>

                <div className="p-8 overflow-y-auto flex-1">
                    {/* Page header */}
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <p className="text-xs text-slate-500 mb-1" style={{ fontFamily: 'var(--font-mono)' }}>
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </p>
                            <h1 className="text-2xl font-bold tracking-tight text-white">
                                {userName ? `Welcome back, ${userName}` : 'Dashboard Overview'}
                            </h1>
                        </div>
                        <button
                            onClick={() => navigate('/inventory')}
                            className="inline-flex items-center gap-2 h-10 px-5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/35 hover:-translate-y-0.5 cursor-pointer"
                        >
                            <Plus size={16} />
                            Add Resource
                        </button>
                    </div>

                    {/* Stats */}
                    <BentoGrid stats={stats} />

                    {/* Recent Activity */}
                    <div className="rounded-2xl border border-white/[0.05] overflow-hidden bg-white/[0.015]">
                        <div className="px-6 py-4 border-b border-white/[0.05] flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Activity size={14} className="text-indigo-400" strokeWidth={1.8} />
                                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400" style={{ fontFamily: 'var(--font-mono)' }}>
                                    Recent Activity
                                </h2>
                            </div>
                            <button
                                onClick={() => navigate('/production')}
                                className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                            >
                                View all <ArrowRight size={12} />
                            </button>
                        </div>

                        <div className="divide-y divide-white/[0.04]">
                            {recentLogs.length === 0 ? (
                                <div className="p-12 text-center">
                                    <Activity size={28} className="text-slate-700 mx-auto mb-3" />
                                    <p className="text-slate-500 text-sm">No recent activity yet.</p>
                                    <p className="text-slate-600 text-xs mt-1">Log a production event to get started.</p>
                                </div>
                            ) : recentLogs.map((log) => (
                                <div key={log._id} className="flex justify-between items-center px-6 py-3.5 hover:bg-white/[0.02] transition-colors group">
                                    <div className="flex items-center gap-3.5">
                                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${log.action === 'Issue' ? 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]' : log.action === 'Stop' ? 'bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.5)]' : 'bg-indigo-500 shadow-[0_0_6px_rgba(99,102,241,0.5)]'}`} />
                                        <div>
                                            <p className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                                                {log.action} — {log.resource?.name || 'Unknown Resource'}
                                            </p>
                                            <p className="text-[11px] text-slate-600 mt-0.5" style={{ fontFamily: 'var(--font-mono)' }}>
                                                {new Date(log.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {log.quantityProduced > 0 && (
                                            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg" style={{ fontFamily: 'var(--font-mono)' }}>
                                                +{log.quantityProduced}
                                            </span>
                                        )}
                                        <span className="text-[11px] text-slate-500 border border-white/[0.05] px-2 py-0.5 rounded-lg bg-white/[0.02]" style={{ fontFamily: 'var(--font-mono)' }}>
                                            {log.resource?.type || 'Unknown'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
