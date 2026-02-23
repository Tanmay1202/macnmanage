import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Plus, Package, Search, Filter, X, ChevronRight, MoreHorizontal, Trash2, Edit3, Briefcase, Box, Settings2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Inventory = () => {
    const { success, error: toastError } = useToast();
    const [resources, setResources] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showDrawer, setShowDrawer] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        name: '', type: 'Raw Material', quantity: 0, unit: 'kg', pricePerUnit: 0, location: '', status: 'Available'
    });

    const [filterCategory, setFilterCategory] = useState('All Resources');
    const [filterStatus, setFilterStatus] = useState('All');

    const fetchResources = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const token = userInfo ? userInfo.token : null;
            if (!token) return setIsLoading(false);
            const res = await fetch('/api/resources', { headers: { Authorization: `Bearer ${token}` } });
            const data = await res.json();
            if (res.ok) setResources(data);
        } catch (error) {
            console.error("Failed to fetch resources", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchResources(); }, []);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleEdit = (item) => {
        setFormData({ name: item.name, type: item.type, quantity: item.quantity, unit: item.unit, pricePerUnit: item.pricePerUnit, location: item.location, status: item.status });
        setEditingId(item._id);
        setShowDrawer(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Confirm resource deletion? This cannot be undone.")) return;
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const res = await fetch(`/api/resources/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${userInfo.token}` } });
            if (res.ok) { fetchResources(); success('Resource removed'); }
        } catch (error) { toastError('Delete failed'); }
    };

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const url = editingId ? `/api/resources/${editingId}` : '/api/resources';
            const method = editingId ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                fetchResources(); setShowDrawer(false); setEditingId(null);
                setFormData({ name: '', type: 'Raw Material', quantity: 0, unit: 'kg', pricePerUnit: 0, location: '', status: 'Available' });
                success(editingId ? 'Resource updated' : 'Resource added');
            } else { toastError('Operation failed'); }
        } catch (error) { toastError('Internal error'); }
    };

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search')?.toLowerCase() || '';

    const filteredResources = resources.filter(item => {
        const matchesCategory = filterCategory === 'All Resources' || item.type === filterCategory.replace('s', '').replace('Finished Good', 'Finished Good'); // simplified logic
        const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery);
        return matchesCategory && matchesStatus && matchesSearch;
    });

    // Quick counts for badges
    const counts = {
        'All Resources': resources.length,
        'Raw Material': resources.filter(r => r.type === 'Raw Material').length,
        'Tool': resources.filter(r => r.type === 'Tool').length,
        'Machine': resources.filter(r => r.type === 'Machine').length,
        'Finished Good': resources.filter(r => r.type === 'Finished Good').length,
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); document.getElementById('inventory-search').focus(); }
            if (e.key === 'Escape') setShowDrawer(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="min-h-screen text-white flex" style={{ fontFamily: 'var(--font-sans)' }}>
            <Sidebar />

            <div className="flex-1 ml-24 mr-4 my-4 flex rounded-2xl overflow-hidden border border-white/[0.05] bg-slate-900/20 backdrop-blur-sm shadow-2xl relative">
                {/* Left Filter Panel */}
                <aside className="w-64 border-r border-white/[0.05] bg-[#020617]/40 p-6 hidden lg:block sticky top-0 h-full overflow-y-auto">
                    <div className="flex items-center gap-2 mb-10 text-indigo-400">
                        <Settings2 size={16} />
                        <span className="text-[10px] font-bold tracking-widest uppercase" style={{ fontFamily: 'var(--font-mono)' }}>Registry Filters</span>
                    </div>

                    <div className="space-y-10">
                        <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase mb-4 block tracking-widest" style={{ fontFamily: 'var(--font-mono)' }}>Category</label>
                            <div className="space-y-1.5">
                                {[
                                    { id: 'All Resources', label: 'All Assets', icon: LayoutGrid },
                                    { id: 'Raw Material', label: 'Raw Materials', icon: Box },
                                    { id: 'Tool', label: 'Tools & Dies', icon: Briefcase },
                                    { id: 'Machine', label: 'Heavy Machinery', icon: Settings2 },
                                    { id: 'Finished Good', label: 'Finished Goods', icon: Package }
                                ].map((cat) => (
                                    <div
                                        key={cat.id}
                                        onClick={() => setFilterCategory(cat.id)}
                                        className={`flex items-center justify-between group px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${filterCategory === cat.id ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/20' : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]'}`}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <cat.icon size={14} className={filterCategory === cat.id ? 'text-indigo-400' : 'text-slate-600'} />
                                            <span className="text-xs font-medium">{cat.label}</span>
                                        </div>
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${filterCategory === cat.id ? 'bg-indigo-500/20' : 'bg-white/[0.05]'} transition-colors`}>
                                            {counts[cat.id] || 0}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase mb-4 block tracking-widest" style={{ fontFamily: 'var(--font-mono)' }}>Availability Status</label>
                            <div className="space-y-1.5">
                                {['All', 'Available', 'In Use', 'Low Stock', 'Maintenance', 'Operational', 'Warning', 'Critical'].map((status) => (
                                    <div
                                        key={status}
                                        onClick={() => setFilterStatus(status)}
                                        className={`flex items-center gap-2.5 px-3 py-2 cursor-pointer rounded-xl transition-all duration-200 ${filterStatus === status ? 'bg-white/[0.05] text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]'}`}
                                    >
                                        {status !== 'All' && (
                                            <div className={`w-1.5 h-1.5 rounded-full ${['Available', 'Operational'].includes(status) ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]' :
                                                    ['Low Stock', 'Warning'].includes(status) ? 'bg-amber-500' : 'bg-red-500'
                                                }`} />
                                        )}
                                        <span className="text-xs">{status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Table Content */}
                <main className="flex-1 flex flex-col min-w-0 bg-transparent relative">
                    <header className="h-16 border-b border-white/[0.05] flex items-center justify-between px-8 bg-[#020617]/70 backdrop-blur-xl sticky top-0 z-20 shrink-0">
                        <div className="flex items-center gap-4">
                            <h1 className="text-xl font-bold tracking-tight text-white">Registry</h1>
                            <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-bold tracking-widest uppercase">
                                {filteredResources.length} Assets Logged
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    id="inventory-search"
                                    className="h-9 pl-9 pr-4 w-60 rounded-xl border border-white/[0.06] bg-white/[0.03] focus:bg-white/[0.06] focus:border-indigo-500/40 text-sm placeholder:text-slate-700 text-slate-200 transition-all outline-none"
                                    placeholder="Search registry... (⌘K)"
                                />
                            </div>
                            <button
                                onClick={() => { setEditingId(null); setFormData({ name: '', type: 'Raw Material', quantity: 0, unit: 'kg', pricePerUnit: 0, location: '', status: 'Available' }); setShowDrawer(true); }}
                                className="h-9 px-4 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 flex items-center gap-2 transform active:scale-95 cursor-pointer"
                            >
                                <Plus size={14} /> Register Asset
                            </button>
                        </div>
                    </header>

                    <div className="flex-1 p-8 overflow-auto">
                        <div className="border border-white/[0.05] rounded-2xl overflow-hidden bg-white/[0.015] shadow-2xl">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-white/[0.02] text-slate-500 font-bold uppercase text-[10px] tracking-widest border-b border-white/[0.05]">
                                    <tr>
                                        <th className="px-6 py-4">Resource Details</th>
                                        <th className="px-6 py-4">Category</th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                        <th className="px-6 py-4 text-right">Holdings</th>
                                        <th className="px-6 py-4 text-right">Valuation</th>
                                        <th className="px-6 py-4 text-right">Operations</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/[0.04]">
                                    {isLoading ? (
                                        [1, 2, 3].map(i => <tr key={i} className="animate-pulse"><td colSpan="6" className="p-8 border-b border-white/[0.02]"><div className="h-4 bg-white/[0.02] rounded" /></td></tr>)
                                    ) : filteredResources.length === 0 ? (
                                        <tr><td colSpan="6" className="p-16 text-center text-slate-600"><Package size={32} className="mx-auto mb-4 opacity-20" /><p>No matching resources found.</p></td></tr>
                                    ) : (
                                        filteredResources.map((item) => (
                                            <tr key={item._id} className="group hover:bg-white/[0.02] transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3.5">
                                                        <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-slate-500 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-all duration-300">
                                                            <Package size={20} strokeWidth={1.5} />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-200 group-hover:text-white transition-colors">{item.name}</p>
                                                            <p className="text-[10px] text-slate-600 font-mono mt-0.5 tracking-tight uppercase">{item.location || 'UNASSIGNED LOC'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-xs text-slate-500">{item.type}</span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${['Available', 'Operational'].includes(item.status) ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' :
                                                            ['Low Stock', 'Warning'].includes(item.status) ? 'border-amber-500/20 bg-amber-500/10 text-amber-400' :
                                                                'border-red-500/20 bg-red-500/10 text-red-400'
                                                        }`}>
                                                        <div className={`w-1 h-1 rounded-full ${['Available', 'Operational'].includes(item.status) ? 'bg-emerald-400' : ['Low Stock', 'Warning'].includes(item.status) ? 'bg-amber-400' : 'bg-red-400'}`} />
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right font-mono text-xs">
                                                    <span className="text-slate-300 font-bold">{item.quantity}</span>
                                                    <span className="text-slate-600 ml-1 text-[10px] uppercase">{item.unit}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right font-mono text-xs text-slate-500">
                                                    ${item.pricePerUnit}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                                                        <button onClick={() => handleEdit(item)} className="p-2 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all cursor-pointer" title="Edit Asset">
                                                            <Edit3 size={15} />
                                                        </button>
                                                        <button onClick={() => handleDelete(item._id)} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer" title="Archive Asset">
                                                            <Trash2 size={15} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            {/* Slide-in Drawer */}
            <div className={`fixed inset-y-0 right-0 w-[28rem] bg-[#020617]/98 border-l border-white/[0.08] shadow-2xl backdrop-blur-2xl transform transition-transform duration-500 ease-out z-50 ${showDrawer ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="h-full flex flex-col">
                    <div className="p-8 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.01]">
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight">{editingId ? 'Edit Asset' : 'Register New Asset'}</h2>
                            <p className="text-slate-500 text-xs mt-1 uppercase tracking-widest font-bold" style={{ fontFamily: 'var(--font-mono)' }}>System Registry</p>
                        </div>
                        <button onClick={() => setShowDrawer(false)} className="text-slate-600 hover:text-white transition-colors bg-white/[0.05] p-2 rounded-xl hover:bg-white/[0.1] cursor-pointer">
                            <X size={20} />
                        </button>
                    </div>
                    <form onSubmit={onSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase text-slate-500 tracking-widest" style={{ fontFamily: 'var(--font-mono)' }}>Asset Identifier</label>
                                <input name="name" value={formData.name} onChange={onChange} className="flex h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none placeholder:text-slate-800" placeholder="e.g. Grade A Steel Tubing" required />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase text-slate-500 tracking-widest" style={{ fontFamily: 'var(--font-mono)' }}>Category</label>
                                    <div className="relative">
                                        <select name="type" value={formData.type} onChange={onChange} className="flex h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none appearance-none cursor-pointer">
                                            <option className="bg-[#020617]">Raw Material</option>
                                            <option className="bg-[#020617]">Machine</option>
                                            <option className="bg-[#020617]">Tool</option>
                                            <option className="bg-[#020617]">Finished Good</option>
                                        </select>
                                        <ChevronRight className="absolute right-4 top-3.5 h-4 w-4 text-slate-600 rotate-90 pointer-events-none" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase text-slate-500 tracking-widest" style={{ fontFamily: 'var(--font-mono)' }}>Initial Status</label>
                                    <div className="relative">
                                        <select name="status" value={formData.status} onChange={onChange} className="flex h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none appearance-none cursor-pointer">
                                            <option className="bg-[#020617]">Available</option>
                                            <option className="bg-[#020617]">In Use</option>
                                            <option className="bg-[#020617]">Low Stock</option>
                                            <option className="bg-[#020617]">Maintenance</option>
                                            <option className="bg-[#020617]">Operational</option>
                                            <option className="bg-[#020617]">Warning</option>
                                            <option className="bg-[#020617]">Critical</option>
                                        </select>
                                        <ChevronRight className="absolute right-4 top-3.5 h-4 w-4 text-slate-600 rotate-90 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase text-slate-500 tracking-widest" style={{ fontFamily: 'var(--font-mono)' }}>Quantity</label>
                                    <input type="number" name="quantity" value={formData.quantity} onChange={onChange} className="flex h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none placeholder:text-slate-800 font-mono" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase text-slate-500 tracking-widest" style={{ fontFamily: 'var(--font-mono)' }}>Unit of Measure</label>
                                    <input name="unit" value={formData.unit} onChange={onChange} className="flex h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none placeholder:text-slate-800" placeholder="e.g. kg, units, pairs" required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase text-slate-500 tracking-widest" style={{ fontFamily: 'var(--font-mono)' }}>Price Per Unit ($)</label>
                                    <div className="relative font-mono">
                                        <span className="absolute left-4 top-3.5 text-slate-600 text-xs">$</span>
                                        <input type="number" name="pricePerUnit" value={formData.pricePerUnit} onChange={onChange} className="flex h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.02] pl-8 pr-4 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none placeholder:text-slate-800" required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase text-slate-500 tracking-widest" style={{ fontFamily: 'var(--font-mono)' }}>Logical Location</label>
                                    <input name="location" value={formData.location} onChange={onChange} className="flex h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none placeholder:text-slate-800" placeholder="e.g. Warehouse A, Line 2" />
                                </div>
                            </div>
                        </div>
                        <div className="pt-8 border-t border-white/[0.08]">
                            <button type="submit" className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/40 flex items-center justify-center gap-2 transform active:scale-98 transition-transform cursor-pointer">
                                {editingId ? 'Update Registry' : 'Register Asset'}
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

export default Inventory;
