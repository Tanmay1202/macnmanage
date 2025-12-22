import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import BentoGrid from '../components/BentoGrid';
import { Search, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalResources: 0,
        lowStock: 0,
        activeProduction: 0,
        systemStatus: 'Nominal'
    });
    const [recentLogs, setRecentLogs] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const token = userInfo ? userInfo.token : null;
                if (!token) return navigate('/login');

                const [resResources, resLogs] = await Promise.all([
                    fetch('/api/resources', { headers: { Authorization: `Bearer ${token}` } }),
                    fetch('/api/production', { headers: { Authorization: `Bearer ${token}` } })
                ]);

                if (resResources.ok && resLogs.ok) {
                    const resources = await resResources.json();
                    const logs = await resLogs.json();

                    // Calculate Stats
                    const lowStockCount = resources.filter(r => ['Low Stock', 'Warning', 'Critical', 'Out of Stock'].includes(r.status)).length;
                    const criticalCount = resources.filter(r => r.status === 'Critical').length;
                    const activeCount = resources.filter(r => r.type === 'Machine' && r.status === 'Operational').length;

                    setStats({
                        totalResources: resources.length,
                        lowStock: lowStockCount,
                        activeProduction: activeCount,
                        systemStatus: criticalCount > 0 ? 'Critical' : lowStockCount > 0 ? 'Warning' : 'Nominal'
                    });

                    setRecentLogs(logs.slice(0, 5));
                }
            } catch (error) {
                console.error("Dashboard fetch error", error);
            }
        };

        fetchData();
    }, [navigate]);

    return (
        <div className="min-h-screen text-white flex font-sans">
            {/* Sidebar Rail */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 ml-24 mr-4 my-4 flex flex-col min-h-[calc(100vh-2rem)] transition-all duration-300 rounded-xl border border-white/5 bg-slate-900/30 backdrop-blur-sm shadow-2xl relative overflow-hidden">

                {/* Top Bar */}
                <header className="h-16 border-b border-indigo-500/10 bg-[#020617]/60 backdrop-blur-md sticky top-0 z-30 px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4 w-1/3">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search resources..."
                                className="w-full h-10 pl-10 pr-4 rounded-lg border border-white/5 bg-slate-800/50 focus:bg-slate-800/80 focus:border-indigo-500/50 text-sm transition-all focus:outline-none placeholder:text-slate-600 text-slate-200"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        navigate(`/inventory?search=${e.target.value}`);
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/5 bg-slate-900/80 ${stats.systemStatus === 'Critical' ? 'border-destructive/30 bg-destructive/10' : ''}`}>
                            <div className="relative flex h-2 w-2">
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${stats.systemStatus === 'Critical' ? 'bg-destructive' : stats.systemStatus === 'Warning' ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                                <span className={`relative inline-flex rounded-full h-2 w-2 ${stats.systemStatus === 'Critical' ? 'bg-destructive' : stats.systemStatus === 'Warning' ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                            </div>
                            <span className="text-xs font-mono text-slate-400">System {stats.systemStatus}</span>
                        </div>
                    </div>
                </header>

                <div className="p-8 overflow-y-auto flex-1">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard Overview</h1>
                        <div className="flex gap-2">
                            <button onClick={() => navigate('/inventory')} className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20">
                                Add Resource
                            </button>
                        </div>
                    </div>

                    {/* Bento Grid Stats */}
                    <BentoGrid stats={stats} />

                    {/* Recent Inventory Movement - Dense Table Look */}
                    <div className="bg-slate-900/40 border border-indigo-500/10 rounded-xl overflow-hidden backdrop-blur-sm">
                        <div className="px-6 py-4 border-b border-indigo-500/10 flex justify-between items-center bg-indigo-500/5">
                            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Recent Activity</h2>
                            <button onClick={() => navigate('/production')} className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline">View All</button>
                        </div>
                        <div className="divide-y divide-indigo-500/5">
                            {recentLogs.length === 0 ? (
                                <div className="p-8 text-center text-slate-500 text-sm">No recent activity.</div>
                            ) : recentLogs.map((log) => (
                                <div key={log._id} className="flex justify-between items-center px-6 py-4 hover:bg-white/5 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-2 h-2 rounded-full ${log.action === 'Issue' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]'}`}></div>
                                        <div>
                                            <p className="font-medium text-sm text-slate-200 group-hover:text-white transition-colors">{log.action} - {log.resource?.name || 'Unknown Resource'}</p>
                                            <p className="text-xs text-slate-500 font-mono mt-0.5">
                                                {new Date(log.createdAt).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        {log.quantityProduced > 0 && <span className="text-sm font-mono text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded text-[11px]">+{log.quantityProduced}</span>}
                                        <span className="text-xs text-slate-500 border border-white/5 px-2 py-1 rounded-sm bg-slate-800/50">{log.resource?.type || 'Unknown'}</span>
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
