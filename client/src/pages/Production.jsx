import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Search, Plus, Activity, AlertTriangle, CheckCircle2, XCircle, Clock, MoreVertical } from 'lucide-react';
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

    return (
        <div className="min-h-screen text-white flex font-sans">
            <Sidebar />

            <div className="flex-1 ml-24 mr-4 my-4 flex flex-col min-w-0 bg-transparent relative">
                {/* Header */}
                <header className="h-20 border-b border-indigo-500/10 flex items-center justify-between px-8 bg-[#020617]/60 backdrop-blur-md sticky top-0 z-20 rounded-t-xl mx-0">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold tracking-tight text-white">Production Monitor</h1>
                        <span className="flex items-center gap-2 text-[10px] font-bold tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                            SYSTEM LIVE
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowDrawer(true)}
                            className="h-10 px-5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 flex items-center gap-2 transform active:scale-95 ease-out duration-200"
                        >
                            <Plus size={18} />
                            Log Event
                        </button>
                    </div>
                </header>

                <div className="flex-1 p-8 space-y-10 overflow-y-auto bg-slate-900/30 backdrop-blur-sm border-x border-b border-white/5 rounded-b-xl">

                    {/* Active Lines / Machines Status */}
                    <section>
                        <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Activity size={14} /> Active Lines
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {resources.filter(r => r.type === 'Machine').length === 0 ? (
                                <div className="col-span-4 p-8 border border-white/5 border-dashed rounded-2xl text-center text-slate-500 text-sm bg-white/[0.02]">
                                    No machines configured.
                                </div>
                            ) : resources.filter(r => r.type === 'Machine').map(machine => (
                                <div key={machine._id} className="p-5 border border-white/5 bg-slate-800/40 backdrop-blur-md rounded-2xl flex flex-col gap-4 hover:border-indigo-500/30 hover:bg-slate-800/60 transition-all duration-300 group shadow-lg hover:shadow-xl hover:shadow-indigo-500/5 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-bold text-white text-lg tracking-tight">{machine.name}</h3>
                                            <p className="text-xs text-slate-400 mt-1 font-medium">{machine.location || 'Unknown Location'}</p>
                                        </div>
                                        <div className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold border tracking-wide shadow-sm ${machine.status === 'Operational' ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400 shadow-emerald-500/10' :
                                            machine.status === 'Warning' ? 'border-amber-500/20 bg-amber-500/10 text-amber-400 shadow-amber-500/10' :
                                                'border-red-500/20 bg-red-500/10 text-red-400 shadow-red-500/10'
                                            }`}>
                                            {machine.status}
                                        </div>
                                    </div>

                                    {/* Uptime Visualization */}
                                    <div className="space-y-2 mt-2">
                                        <div className="flex justify-between text-[10px] text-slate-400 uppercase font-semibold tracking-wider">
                                            <span>Efficiency</span>
                                            <span className="text-white">92%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5">
                                            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 w-[92%] shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Recent Activity Log */}
                    <section>
                        <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Clock size={14} /> Production Log
                        </h2>
                        <div className="border border-white/5 rounded-2xl overflow-hidden bg-white/[0.02] shadow-2xl backdrop-blur-sm">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-white/[0.02] text-slate-400 font-semibold uppercase text-[11px] tracking-wider border-b border-white/5">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Time</th>
                                        <th className="px-6 py-4 font-medium">Resource</th>
                                        <th className="px-6 py-4 font-medium">Action</th>
                                        <th className="px-6 py-4 font-medium text-right">Output</th>
                                        <th className="px-6 py-4 font-medium text-right">Efficiency</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {logs.length === 0 ? (
                                        <tr><td colSpan="5" className="p-8 text-center text-slate-500">No recent activity logged.</td></tr>
                                    ) : logs.map(log => (
                                        <tr key={log._id} className="hover:bg-white/[0.03] transition-colors group">
                                            <td className="px-6 py-4 text-slate-400 font-mono text-xs group-hover:text-slate-300 transition-colors">
                                                {new Date(log.createdAt).toLocaleTimeString()}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-slate-200 group-hover:text-white transition-colors">{log.resource?.name || 'Unknown'}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium border ${log.action === 'Start' ? 'border-emerald-500/10 bg-emerald-500/5 text-emerald-400' :
                                                    log.action === 'Stop' ? 'border-amber-500/10 bg-amber-500/5 text-amber-400' :
                                                        log.action === 'Issue' ? 'border-red-500/10 bg-red-500/5 text-red-400' : 'border-white/5 bg-white/5 text-slate-300'
                                                    }`}>
                                                    {log.action === 'Start' && <Activity size={12} />}
                                                    {log.action === 'Issue' && <AlertTriangle size={12} />}
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-mono text-slate-300">{log.quantityProduced > 0 ? log.quantityProduced : <span className="text-slate-600">-</span>}</td>
                                            <td className="px-6 py-4 text-right font-mono text-slate-400">{log.efficiency}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                </div>
            </div>

            {/* Slide-in Drawer */}
            <div className={`fixed inset-y-0 right-0 w-[28rem] bg-[#020617]/95 border-l border-white/10 shadow-2xl backdrop-blur-xl transform transition-transform duration-300 ease-out z-50 ${showDrawer ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="h-full flex flex-col">
                    <div className="p-8 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                        <div>
                            <h2 className="text-xl font-bold text-white">Log Event</h2>
                            <p className="text-slate-400 text-sm mt-1">Record production activity</p>
                        </div>
                        <button onClick={() => setShowDrawer(false)} className="text-slate-500 hover:text-white transition-colors bg-white/5 p-2 rounded-lg hover:bg-white/10">
                            <XCircle size={20} />
                        </button>
                    </div>
                    <form onSubmit={onSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Machine / Resource</label>
                                <div className="relative">
                                    <select
                                        name="resource"
                                        value={logData.resource}
                                        onChange={onChange}
                                        className="flex h-11 w-full rounded-lg border border-white/10 bg-black/20 px-4 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none appearance-none cursor-pointer"
                                        required
                                    >
                                        <option value="" className="bg-slate-900">Select Resource</option>
                                        {resources.map(r => (
                                            <option key={r._id} value={r._id} className="bg-slate-900">{r.name}</option>
                                        ))}
                                    </select>
                                    <MoreVertical className="absolute right-4 top-3.5 h-4 w-4 text-slate-500 rotate-90 pointer-events-none" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Action</label>
                                <div className="relative">
                                    <select
                                        name="action"
                                        value={logData.action}
                                        onChange={onChange}
                                        className="flex h-11 w-full rounded-lg border border-white/10 bg-black/20 px-4 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none appearance-none cursor-pointer"
                                    >
                                        <option className="bg-slate-900">Start</option>
                                        <option className="bg-slate-900">Stop</option>
                                        <option className="bg-slate-900">Output</option>
                                        <option className="bg-slate-900">Issue</option>
                                    </select>
                                    <MoreVertical className="absolute right-4 top-3.5 h-4 w-4 text-slate-500 rotate-90 pointer-events-none" />
                                </div>
                            </div>

                            {logData.action === 'Output' && (
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Quantity Produced</label>
                                    <input
                                        type="number"
                                        name="quantityProduced"
                                        value={logData.quantityProduced}
                                        onChange={onChange}
                                        className="flex h-11 w-full rounded-lg border border-white/10 bg-black/20 px-4 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none placeholder:text-slate-700"
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Efficiency (%)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="efficiency"
                                        value={logData.efficiency}
                                        onChange={onChange}
                                        min="0" max="100"
                                        className="flex h-11 w-full rounded-lg border border-white/10 bg-black/20 px-4 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none placeholder:text-slate-700"
                                    />
                                    <span className="absolute right-4 top-3.5 text-slate-500 text-sm font-mono">%</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Notes</label>
                                <textarea
                                    name="notes"
                                    value={logData.notes}
                                    onChange={onChange}
                                    className="flex min-h-[100px] w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none placeholder:text-slate-700 resize-none"
                                    placeholder="Optional notes..."
                                />
                            </div>
                        </div>
                        <div className="pt-6 border-t border-white/10">
                            <button type="submit" className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 flex items-center justify-center gap-2">
                                Submit Log
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Drawer Backdrop */}
            {showDrawer && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity" onClick={() => setShowDrawer(false)}></div>
            )}
        </div>
    );
};

export default Production;
