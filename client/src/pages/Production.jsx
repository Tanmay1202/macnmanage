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
        <div className="min-h-screen bg-background text-foreground flex font-sans">
            <Sidebar />

            <div className="flex-1 ml-16 flex flex-col min-w-0 bg-background">
                {/* Header */}
                <header className="h-16 border-b border-border flex items-center justify-between px-8 bg-card/20 sticky top-0 backdrop-blur-sm z-20">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-bold tracking-tight">Production Monitor</h1>
                        <span className="flex items-center gap-2 text-xs font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-sm border border-emerald-500/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            SYSTEM LIVE
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowDrawer(true)}
                            className="h-9 px-4 bg-primary text-primary-foreground text-sm font-medium rounded-sm hover:bg-primary/90 flex items-center gap-2"
                        >
                            <Plus size={16} />
                            Log Event
                        </button>
                    </div>
                </header>

                <div className="flex-1 p-8 space-y-8 overflow-y-auto">

                    {/* Active Lines / Machines Status */}
                    <section>
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Active Lines</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {resources.filter(r => r.type === 'Machine').length === 0 ? (
                                <div className="col-span-4 p-4 border border-border border-dashed rounded-sm text-center text-muted-foreground text-sm">No machines configured.</div>
                            ) : resources.filter(r => r.type === 'Machine').map(machine => (
                                <div key={machine._id} className="p-4 border border-border bg-card rounded-sm flex flex-col gap-3 hover:border-primary/50 transition-colors group">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-medium">{machine.name}</h3>
                                            <p className="text-xs text-muted-foreground">{machine.location || 'Unknown Location'}</p>
                                        </div>
                                        <div className={`px-1.5 py-0.5 rounded-sm text-[10px] uppercase font-bold border ${machine.status === 'Operational' ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-500' :
                                            machine.status === 'Warning' ? 'border-amber-500/50 bg-amber-500/10 text-amber-500' :
                                                'border-slate-700 bg-slate-800 text-slate-400'
                                            }`}>
                                            {machine.status}
                                        </div>
                                    </div>

                                    {/* Uptime Visualization */}
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-[10px] text-muted-foreground uppercase">
                                            <span>Efficiency</span>
                                            <span>92%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-muted rounded-sm overflow-hidden">
                                            <div className="h-full bg-primary w-[92%]"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Recent Activity Log */}
                    <section>
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Production Log</h2>
                        <div className="border border-border rounded-sm overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted/30 text-muted-foreground font-medium uppercase text-xs tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4 border-b border-border font-medium">Time</th>
                                        <th className="px-6 py-4 border-b border-border font-medium">Resource</th>
                                        <th className="px-6 py-4 border-b border-border font-medium">Action</th>
                                        <th className="px-6 py-4 border-b border-border font-medium text-right">Output</th>
                                        <th className="px-6 py-4 border-b border-border font-medium text-right">Efficiency</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border bg-card/20">
                                    {logs.length === 0 ? (
                                        <tr><td colSpan="5" className="p-8 text-center text-muted-foreground">No recent activity logged.</td></tr>
                                    ) : logs.map(log => (
                                        <tr key={log._id} className="hover:bg-muted/30">
                                            <td className="px-6 py-4 text-muted-foreground font-mono text-xs">
                                                {new Date(log.createdAt).toLocaleTimeString()}
                                            </td>
                                            <td className="px-6 py-4 font-medium">{log.resource?.name || 'Unknown'}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 ${log.action === 'Start' ? 'text-emerald-500' :
                                                    log.action === 'Stop' ? 'text-amber-500' :
                                                        log.action === 'Issue' ? 'text-red-500' : 'text-foreground'
                                                    }`}>
                                                    {log.action === 'Start' && <Activity size={14} />}
                                                    {log.action === 'Issue' && <AlertTriangle size={14} />}
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-mono">{log.quantityProduced > 0 ? log.quantityProduced : '-'}</td>
                                            <td className="px-6 py-4 text-right font-mono text-muted-foreground">{log.efficiency}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                </div>
            </div>

            {/* Slide-in Drawer */}
            <div className={`fixed inset-y-0 right-0 w-96 bg-card border-l border-border shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${showDrawer ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="h-full flex flex-col">
                    <div className="p-6 border-b border-border flex items-center justify-between">
                        <h2 className="text-lg font-bold">Log Event</h2>
                        <button onClick={() => setShowDrawer(false)} className="text-muted-foreground hover:text-foreground">
                            <XCircle size={20} />
                        </button>
                    </div>
                    <form onSubmit={onSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-medium uppercase text-muted-foreground">Machine / Resource</label>
                                <select
                                    name="resource"
                                    value={logData.resource}
                                    onChange={onChange}
                                    className="flex h-10 w-full rounded-sm border border-input bg-background/50 px-3 py-2 text-sm focus:ring-1 focus:ring-primary transition-all"
                                    required
                                >
                                    <option value="">Select Resource</option>
                                    {resources.map(r => (
                                        <option key={r._id} value={r._id}>{r.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium uppercase text-muted-foreground">Action</label>
                                <select
                                    name="action"
                                    value={logData.action}
                                    onChange={onChange}
                                    className="flex h-10 w-full rounded-sm border border-input bg-background/50 px-3 py-2 text-sm focus:ring-1 focus:ring-primary transition-all"
                                >
                                    <option>Start</option>
                                    <option>Stop</option>
                                    <option>Output</option>
                                    <option>Issue</option>
                                </select>
                            </div>

                            {logData.action === 'Output' && (
                                <div className="space-y-2">
                                    <label className="text-xs font-medium uppercase text-muted-foreground">Quantity Produced</label>
                                    <input
                                        type="number"
                                        name="quantityProduced"
                                        value={logData.quantityProduced}
                                        onChange={onChange}
                                        className="flex h-10 w-full rounded-sm border border-input bg-background/50 px-3 py-2 text-sm focus:ring-1 focus:ring-primary transition-all"
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-xs font-medium uppercase text-muted-foreground">Efficiency (%)</label>
                                <input
                                    type="number"
                                    name="efficiency"
                                    value={logData.efficiency}
                                    onChange={onChange}
                                    min="0" max="100"
                                    className="flex h-10 w-full rounded-sm border border-input bg-background/50 px-3 py-2 text-sm focus:ring-1 focus:ring-primary transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium uppercase text-muted-foreground">Notes</label>
                                <textarea
                                    name="notes"
                                    value={logData.notes}
                                    onChange={onChange}
                                    className="flex min-h-[80px] w-full rounded-sm border border-input bg-background/50 px-3 py-2 text-sm focus:ring-1 focus:ring-primary transition-all"
                                    placeholder="Optional notes..."
                                />
                            </div>
                        </div>
                        <div className="pt-4">
                            <button type="submit" className="w-full py-2 bg-primary text-primary-foreground font-medium rounded-sm hover:bg-primary/90 transition-colors">
                                Submit Log
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Production;
