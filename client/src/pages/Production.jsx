import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Search, Plus, Activity, AlertTriangle, CheckCircle2, XCircle, Clock, MoreVertical, LayoutGrid, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

const Production = () => {
    const { success, error: toastError } = useToast();
    const navigate = useNavigate();
    const [logs, setLogs] = useState([]);
    const [resources, setResources] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch Data
    const fetchData = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const token = userInfo ? userInfo.token : null;
            if (!token) return navigate('/login');

            const [resResources, resLogs] = await Promise.all([
                fetch('/api/resources', { headers: { Authorization: `Bearer ${token}` } }),
                fetch('/api/production', { headers: { Authorization: `Bearer ${token}` } })
            ]);

            if (resResources.ok) {
                const data = await resResources.json();
                setResources(data);
            }
            if (resLogs.ok) {
                setLogs(await resLogs.json());
            }

        } catch (error) {
            console.error("Failed to fetch production data", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [navigate]);

    // Log Drawer State
    const [showDrawer, setShowDrawer] = useState(false);
    const [logData, setLogData] = useState({
        resource: '',
        action: 'Start',
        quantityProduced: 0,
        efficiency: 100,
        notes: ''
    });

    // Handle Form Change
    const onChange = e => setLogData({ ...logData, [e.target.name]: e.target.value });

    // Handle Submit
    const onSubmit = async e => {
        e.preventDefault();
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const token = userInfo ? userInfo.token : null;
            if (!token) return;

            const res = await fetch('/api/production', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(logData)
            });

            if (res.ok) {
                fetchData();
                setShowDrawer(false);
                setLogData({ resource: '', action: 'Start', quantityProduced: 0, efficiency: 100, notes: '' });
                success('Production log added successfully');
            } else {
                const data = await res.json();
                toastError(data.message || 'Failed to add log');
            }
        } catch (error) {
            console.error(error);
            toastError('Something went wrong');
        }
    };

    const machines = resources.filter(r => r.type === 'Machine');

    return (
        <div className="min-h-screen text-white flex" style={{ fontFamily: 'var(--font-sans)' }}>
            <Sidebar />

            <div className="flex-1 ml-24 mr-4 my-4 flex flex-col min-w-0 bg-transparent relative">
                {/* Header */}
                <header className="h-20 border-b border-white/[0.05] flex items-center justify-between px-8 bg-[#020617]/70 backdrop-blur-xl sticky top-0 z-20 rounded-t-2xl mx-0">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                            <Activity size={20} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-white">Production Monitor</h1>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">Real-time machine performance</p>
                        </div>
                        <span className="ml-4 flex items-center gap-2 text-[10px] font-bold tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                            SYSTEM LIVE
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowDrawer(true)}
                            className="h-10 px-5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 flex items-center gap-2 transform active:scale-95 ease-out duration-200 cursor-pointer"
                        >
                            <Plus size={18} />
                            Log Event
                        </button>
                    </div>
                </header>

                <div className="flex-1 p-8 space-y-12 overflow-y-auto bg-slate-900/20 backdrop-blur-sm border-x border-b border-white/[0.05] rounded-b-2xl">

                    {/* Active Lines / Machines Status */}
                    <section>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2" style={{ fontFamily: 'var(--font-mono)' }}>
                                <LayoutGrid size={14} className="text-indigo-400" /> Active Lines
                            </h2>
                            <div className="flex p-1 bg-white/[0.03] border border-white/[0.05] rounded-lg">
                                <button className="p-1 px-2.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-bold tracking-wider">GRID</button>
                                <button className="p-1 px-2.5 rounded-md text-slate-600 text-[10px] font-bold tracking-wider hover:text-slate-400 transition-colors">LIST</button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {isLoading ? (
                                [1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-48 rounded-2xl bg-white/[0.02] border border-white/[0.05] animate-pulse" />
                                ))
                            ) : machines.length === 0 ? (
                                <div className="col-span-4 p-12 border border-white/[0.05] border-dashed rounded-2xl text-center bg-white/[0.01]">
                                    <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center mx-auto mb-4 text-slate-600">
                                        <Activity size={20} />
                                    </div>
                                    <h3 className="text-slate-400 font-medium">No machines configured.</h3>
                                    <p className="text-slate-600 text-xs mt-1">Add machines via Registry to see them here.</p>
                                </div>
                            ) : machines.map(machine => (
                                <div key={machine._id} className="group relative p-6 bg-slate-800/30 backdrop-blur-md border border-white/[0.05] rounded-2xl hover:border-indigo-500/30 hover:bg-slate-800/50 transition-all duration-300 shadow-xl overflow-hidden">
                                    <div className={`absolute top-0 left-0 right-0 h-[2px] opacity-40 group-hover:opacity-100 transition-opacity ${machine.status === 'Operational' ? 'bg-emerald-500' :
                                            machine.status === 'Warning' ? 'bg-amber-500' : 'bg-red-500'
                                        }`} />

                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="font-bold text-white tracking-tight">{machine.name}</h3>
                                            <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold" style={{ fontFamily: 'var(--font-mono)' }}>{machine.location || 'SITE-01'}</p>
                                        </div>
                                        <div className={`px-2.5 py-1 rounded-full text-[9px] uppercase font-bold border tracking-wider flex items-center gap-1.5 ${machine.status === 'Operational' ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' :
                                                machine.status === 'Warning' ? 'border-amber-500/20 bg-amber-500/10 text-amber-400' :
                                                    'border-red-500/20 bg-red-500/10 text-red-400'
                                            }`}>
                                            <div className={`w-1 h-1 rounded-full ${machine.status === 'Operational' ? 'bg-emerald-400 shadow-[0_0_4px_rgba(52,211,153,1)]' :
                                                    machine.status === 'Warning' ? 'bg-amber-400' : 'bg-red-400'
                                                }`} />
                                            {machine.status}
                                        </div>
                                    </div>

                                    {/* Uptime Visualization */}
                                    <div className="mt-8 space-y-2.5">
                                        <div className="flex justify-between text-[10px] text-slate-500 uppercase font-bold tracking-widest" style={{ fontFamily: 'var(--font-mono)' }}>
                                            <span>Efficiency</span>
                                            <span className="text-white">92%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-white/[0.05]">
                                            <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 shadow-[0_0_12px_rgba(99,102,241,0.4)] transition-all duration-1000" style={{ width: '92%' }}></div>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-white/[0.04] flex items-center justify-between">
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[8px] font-bold text-slate-500 uppercase">
                                                    U{i}
                                                </div>
                                            ))}
                                        </div>
                                        <button className="p-1.5 text-slate-600 hover:text-white transition-colors cursor-pointer">
                                            <MoreVertical size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Recent Activity Log */}
                    <section>
                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2" style={{ fontFamily: 'var(--font-mono)' }}>
                            <Clock size={14} className="text-indigo-400" /> Production Log
                        </h2>
                        <div className="border border-white/[0.05] rounded-2xl overflow-hidden bg-white/[0.01] shadow-2xl backdrop-blur-sm">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-white/[0.02] text-slate-500 font-bold uppercase text-[10px] tracking-widest border-b border-white/[0.05]">
                                    <tr>
                                        <th className="px-6 py-4 font-bold">Timestamp</th>
                                        <th className="px-6 py-4 font-bold">Resource / Machine</th>
                                        <th className="px-6 py-4 font-bold text-center">Action</th>
                                        <th className="px-6 py-4 font-bold text-right">Output</th>
                                        <th className="px-6 py-4 font-bold text-right">Efficiency</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/[0.04]">
                                    {isLoading ? (
                                        [1, 2, 3].map(i => (
                                            <tr key={i} className="animate-pulse">
                                                <td colSpan="5" className="px-6 py-6 border-b border-white/[0.02]"><div className="h-4 bg-white/[0.02] rounded w-full" /></td>
                                            </tr>
                                        ))
                                    ) : logs.length === 0 ? (
                                        <tr><td colSpan="5" className="p-12 text-center text-slate-600">No activity logs recorded.</td></tr>
                                    ) : logs.map(log => (
                                        <tr key={log._id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-6 py-4 text-slate-500 font-mono text-xs group-hover:text-slate-300 transition-colors">
                                                {new Date(log.createdAt).toLocaleString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-slate-300 group-hover:text-white transition-colors">
                                                {log.resource?.name || 'Unknown'}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${log.action === 'Start' ? 'border-emerald-500/10 bg-emerald-500/5 text-emerald-400' :
                                                        log.action === 'Stop' ? 'border-amber-500/10 bg-amber-500/5 text-amber-400' :
                                                            log.action === 'Issue' ? 'border-red-500/10 bg-red-500/5 text-red-400' : 'border-white/[0.05] bg-white/[0.03] text-slate-400'
                                                    }`}>
                                                    {log.action === 'Start' && <Activity size={10} />}
                                                    {log.action === 'Issue' && <AlertTriangle size={10} />}
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-mono text-slate-400 text-xs">
                                                {log.quantityProduced > 0 ? (
                                                    <span className="text-white font-bold">{log.quantityProduced}</span>
                                                ) : <span className="text-slate-700">-</span>}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 text-xs font-mono">
                                                    <span className={log.efficiency >= 90 ? 'text-emerald-400' : log.efficiency >= 70 ? 'text-amber-400' : 'text-red-400'}>
                                                        {log.efficiency}%
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                </div>
            </div>

            {/* Slide-in Drawer */}
            <div className={`fixed inset-y-0 right-0 w-[28rem] bg-[#020617]/98 border-l border-white/[0.08] shadow-2xl backdrop-blur-2xl transform transition-transform duration-500 ease-out z-50 ${showDrawer ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="h-full flex flex-col">
                    <div className="p-8 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.01]">
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight">Log Event</h2>
                            <p className="text-slate-500 text-xs mt-1 uppercase tracking-widest font-bold" style={{ fontFamily: 'var(--font-mono)' }}>Production Activity</p>
                        </div>
                        <button onClick={() => setShowDrawer(false)} className="text-slate-600 hover:text-white transition-colors bg-white/[0.05] p-2 rounded-xl hover:bg-white/[0.1] cursor-pointer">
                            <XCircle size={20} />
                        </button>
                    </div>
                    <form onSubmit={onSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase text-slate-500 tracking-widest" style={{ fontFamily: 'var(--font-mono)' }}>Machine / Resource</label>
                                <div className="relative">
                                    <select
                                        name="resource"
                                        value={logData.resource}
                                        onChange={onChange}
                                        className="flex h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none appearance-none cursor-pointer"
                                        required
                                    >
                                        <option value="" className="bg-[#020617]">Select Resource</option>
                                        {resources.map(r => (
                                            <option key={r._id} value={r._id} className="bg-[#020617]">{r.name}</option>
                                        ))}
                                    </select>
                                    <MoreVertical className="absolute right-4 top-3.5 h-4 w-4 text-slate-600 rotate-90 pointer-events-none" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase text-slate-500 tracking-widest" style={{ fontFamily: 'var(--font-mono)' }}>Action</label>
                                    <div className="relative">
                                        <select
                                            name="action"
                                            value={logData.action}
                                            onChange={onChange}
                                            className="flex h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none appearance-none cursor-pointer"
                                        >
                                            <option className="bg-[#020617]">Start</option>
                                            <option className="bg-[#020617]">Stop</option>
                                            <option className="bg-[#020617]">Output</option>
                                            <option className="bg-[#020617]">Issue</option>
                                        </select>
                                        <MoreVertical className="absolute right-4 top-3.5 h-4 w-4 text-slate-600 rotate-90 pointer-events-none" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase text-slate-500 tracking-widest" style={{ fontFamily: 'var(--font-mono)' }}>Efficiency (%)</label>
                                    <div className="relative font-mono">
                                        <input
                                            type="number"
                                            name="efficiency"
                                            value={logData.efficiency}
                                            onChange={onChange}
                                            min="0" max="100"
                                            className="flex h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none placeholder:text-slate-800"
                                        />
                                        <span className="absolute right-4 top-3.5 text-slate-600 text-xs shadow-glow-indigo">%</span>
                                    </div>
                                </div>
                            </div>

                            {logData.action === 'Output' && (
                                <div className="space-y-2 animate-fade-in-up">
                                    <label className="text-[10px] font-bold uppercase text-slate-500 tracking-widest" style={{ fontFamily: 'var(--font-mono)' }}>Quantity Produced</label>
                                    <input
                                        type="number"
                                        name="quantityProduced"
                                        value={logData.quantityProduced}
                                        onChange={onChange}
                                        className="flex h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none placeholder:text-slate-800 font-mono"
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase text-slate-500 tracking-widest" style={{ fontFamily: 'var(--font-mono)' }}>Operational Notes</label>
                                <textarea
                                    name="notes"
                                    value={logData.notes}
                                    onChange={onChange}
                                    className="flex min-h-[120px] w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none placeholder:text-slate-800 resize-none"
                                    placeholder="Log observations, downtime reasons, or maintenance requirements..."
                                />
                            </div>
                        </div>
                        <div className="pt-8 border-t border-white/[0.08]">
                            <button type="submit" className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/40 flex items-center justify-center gap-2 transform active:scale-98 transition-transform cursor-pointer">
                                Submit Production Log
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Drawer Backdrop */}
            {showDrawer && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 animate-fade-in" onClick={() => setShowDrawer(false)}></div>
            )}
        </div>
    );
};

export default Production;
