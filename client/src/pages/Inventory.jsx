import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Plus, Package, Search, Filter, X, ChevronRight } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Inventory = () => {
    const { success, error: toastError } = useToast();
    const [resources, setResources] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showDrawer, setShowDrawer] = useState(false);

    // Edit State
    const [editingId, setEditingId] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        type: 'Raw Material',
        quantity: 0,
        unit: 'kg',
        pricePerUnit: 0,
        location: '',
        status: 'Available'
    });

    // Filter State
    const [filterCategory, setFilterCategory] = useState('All Resources');
    const [filterStatus, setFilterStatus] = useState('All');

    // Fetch Resources
    const fetchResources = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const token = userInfo ? userInfo.token : null;
            if (!token) { setIsLoading(false); return; }

            const res = await fetch('/api/resources', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setResources(data);
            else console.error("Fetch Error:", data);

        } catch (error) {
            console.error("Failed to fetch resources", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, []);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    // Handle Edit Click
    const handleEdit = (item) => {
        setFormData({
            name: item.name,
            type: item.type,
            quantity: item.quantity,
            unit: item.unit,
            pricePerUnit: item.pricePerUnit,
            location: item.location,
            status: item.status
        });
        setEditingId(item._id);
        setShowDrawer(true);
    };

    // Handle Delete Click
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this resource?")) return;

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const token = userInfo ? userInfo.token : null;
            if (!token) return;

            const res = await fetch(`/api/resources/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                fetchResources();
                success('Resource deleted successfully');
            }
        } catch (error) {
            console.error(error);
            toastError('Failed to delete resource');
        }
    };

    // Handle Create/Update Submit
    const onSubmit = async e => {
        e.preventDefault();
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const token = userInfo ? userInfo.token : null;
            if (!token) return;

            const url = editingId ? `/api/resources/${editingId}` : '/api/resources';
            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                fetchResources();
                setShowDrawer(false);
                setFormData({ name: '', type: 'Raw Material', quantity: 0, unit: 'kg', pricePerUnit: 0, location: '', status: 'Available' });
                setEditingId(null);
                success(editingId ? 'Resource updated successfully' : 'Resource created successfully');
            } else {
                toastError(data.message || 'Operation failed');
            }
        } catch (error) {
            console.error(error);
            toastError('Something went wrong');
        }
    };

    // Filter Logic
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search')?.toLowerCase() || '';

    const filteredResources = resources.filter(item => {
        const matchesCategory = filterCategory === 'All Resources' ||
            (filterCategory === 'Finished Goods' ? item.type === 'Finished Good' :
                filterCategory === 'Raw Materials' ? item.type === 'Raw Material' :
                    filterCategory === 'Machines' ? item.type === 'Machine' :
                        filterCategory === 'Tools' ? item.type === 'Tool' : item.type === filterCategory); // Fallback

        const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery);

        return matchesCategory && matchesStatus && matchesSearch;
    });

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Cmd/Ctrl + K for Search
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                document.getElementById('inventory-search').focus();
            }
            // Esc for Drawer
            if (e.key === 'Escape') {
                setShowDrawer(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="min-h-screen text-white flex font-sans">
            <Sidebar />

            <div className="flex-1 ml-24 mr-4 my-4 flex rounded-xl overflow-hidden border border-white/5 bg-slate-900/30 backdrop-blur-sm shadow-2xl relative">
                {/* Left Filter Panel - Glass glass effect */}
                <aside className="w-64 border-r border-indigo-500/10 bg-slate-900/50 p-6 hidden lg:block sticky top-0 h-full overflow-y-auto">
                    <div className="flex items-center gap-2 mb-8 text-indigo-400">
                        <Filter size={16} />
                        <span className="text-xs font-bold tracking-widest uppercase">Filters</span>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase mb-4 block tracking-wider">Category</label>
                            <div className="space-y-1">
                                {['All Resources', 'Raw Materials', 'Tools', 'Machines', 'Finished Goods'].map((cat, i) => (
                                    <div
                                        key={i}
                                        onClick={() => setFilterCategory(cat)}
                                        className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 ${filterCategory === cat ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 font-medium' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                                    >
                                        <div className={`w-1.5 h-1.5 rounded-full ${filterCategory === cat ? 'bg-white' : 'bg-transparent'}`}></div>
                                        {cat}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase mb-4 block tracking-wider">Status</label>
                            <div className="space-y-1">
                                {['All', 'Available', 'In Use', 'Low Stock', 'Maintenance', 'Operational', 'Warning', 'Critical'].map((status, i) => (
                                    <div
                                        key={i}
                                        onClick={() => setFilterStatus(status)}
                                        className={`flex items-center gap-2 px-3 py-2 cursor-pointer rounded-lg transition-all duration-200 ${filterStatus === status ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5'}`}
                                    >
                                        {status !== 'All' && (
                                            <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_inset] ${status === 'Available' || status === 'Operational' ? 'bg-emerald-500 shadow-emerald-500/50' :
                                                status === 'Low Stock' || status === 'Warning' ? 'bg-amber-500 shadow-amber-500/50' :
                                                    'bg-red-500 shadow-red-500/50'
                                                }`}></div>
                                        )}
                                        <span className={`text-sm ${filterStatus === status ? 'text-white' : 'text-slate-400'}`}>{status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col min-w-0 bg-transparent relative">
                    {/* Header */}
                    <header className="h-16 border-b border-indigo-500/10 flex items-center justify-between px-8 bg-[#020617]/60 backdrop-blur-md sticky top-0 z-20">
                        <div className="flex items-center gap-4">
                            <h1 className="text-xl font-bold tracking-tight text-white">Inventory</h1>
                            <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-mono font-medium">{filteredResources.length} ITEMS</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative group">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    id="inventory-search"
                                    className="h-10 pl-10 pr-4 w-64 rounded-lg border border-white/5 bg-slate-800/50 focus:bg-slate-800 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 text-sm placeholder:text-slate-600 text-slate-200 transition-all outline-none"
                                    placeholder="Search... (Cmd+K)"
                                />
                            </div>
                            <button
                                onClick={() => {
                                    setEditingId(null);
                                    setFormData({ name: '', type: 'Raw Material', quantity: 0, unit: 'kg', pricePerUnit: 0, location: '', status: 'Available' });
                                    setShowDrawer(true);
                                }}
                                className="h-10 px-5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 flex items-center gap-2 transform active:scale-95"
                            >
                                <Plus size={18} />
                                Add Item
                            </button>
                        </div>
                    </header>

                    {/* Data Table */}
                    <div className="flex-1 p-8 overflow-auto">
                        <div className="border border-white/5 rounded-xl overflow-hidden bg-white/[0.02]">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-white/[0.02] text-slate-400 font-semibold uppercase text-[11px] tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Name</th>
                                        <th className="px-6 py-4 font-medium">Type</th>
                                        <th className="px-6 py-4 font-medium">Status</th>
                                        <th className="px-6 py-4 font-medium text-right">Qty</th>
                                        <th className="px-6 py-4 font-medium text-right">Value</th>
                                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {isLoading ? (
                                        <tr><td colSpan="6" className="p-8 text-center text-slate-500">Loading...</td></tr>
                                    ) : filteredResources.length === 0 ? (
                                        <tr><td colSpan="6" className="p-8 text-center text-slate-500">No resources found matching filters.</td></tr>
                                    ) : (
                                        filteredResources.map((item) => (
                                            <tr key={item._id} className="group hover:bg-white/[0.03] transition-colors">
                                                <td className="px-6 py-4 flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-lg bg-slate-800/50 border border-white/5 flex items-center justify-center text-slate-400 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-all">
                                                        <Package size={18} />
                                                    </div>
                                                    <span className="font-medium text-slate-200 group-hover:text-white transition-colors">{item.name}</span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-400">{item.type}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${item.status === 'Available' || item.status === 'Operational' ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' :
                                                        item.status === 'Low Stock' || item.status === 'Warning' ? 'border-amber-500/20 bg-amber-500/10 text-amber-400' :
                                                            'border-red-500/20 bg-red-500/10 text-red-400'
                                                        }`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right font-mono text-slate-300">{item.quantity} <span className="text-slate-600 text-xs ml-0.5">{item.unit}</span></td>
                                                <td className="px-6 py-4 text-right font-mono text-slate-400">${item.pricePerUnit}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => handleEdit(item)} className="text-slate-400 hover:text-indigo-400 transition-colors transform hover:scale-110">
                                                            <div className="text-xs font-bold uppercase tracking-wide">Edit</div>
                                                        </button>
                                                        <span className="text-slate-700">|</span>
                                                        <button onClick={() => handleDelete(item._id)} className="text-slate-400 hover:text-red-400 transition-colors transform hover:scale-110">
                                                            <div className="text-xs font-bold uppercase tracking-wide">Delete</div>
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
            <div className={`fixed inset-y-0 right-0 w-[28rem] bg-[#020617]/95 border-l border-white/10 shadow-2xl backdrop-blur-xl transform transition-transform duration-300 ease-out z-50 ${showDrawer ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="h-full flex flex-col">
                    <div className="p-8 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                        <div>
                            <h2 className="text-xl font-bold text-white">{editingId ? 'Edit Resource' : 'New Resource'}</h2>
                            <p className="text-slate-400 text-sm mt-1">Fill in the details below</p>
                        </div>
                        <button onClick={() => setShowDrawer(false)} className="text-slate-500 hover:text-white transition-colors bg-white/5 p-2 rounded-lg hover:bg-white/10">
                            <X size={20} />
                        </button>
                    </div>
                    <form onSubmit={onSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Name</label>
                                <input name="name" value={formData.name} onChange={onChange} className="flex h-11 w-full rounded-lg border border-white/10 bg-black/20 px-4 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none placeholder:text-slate-700" placeholder="Resource Name" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Type</label>
                                <div className="relative">
                                    <select name="type" value={formData.type} onChange={onChange} className="flex h-11 w-full rounded-lg border border-white/10 bg-black/20 px-4 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none appearance-none cursor-pointer">
                                        <option className="bg-slate-900">Raw Material</option>
                                        <option className="bg-slate-900">Machine</option>
                                        <option className="bg-slate-900">Tool</option>
                                        <option className="bg-slate-900">Finished Good</option>
                                    </select>
                                    <ChevronRight className="absolute right-4 top-3.5 h-4 w-4 text-slate-500 rotate-90 pointer-events-none" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Status</label>
                                <div className="relative">
                                    <select name="status" value={formData.status} onChange={onChange} className="flex h-11 w-full rounded-lg border border-white/10 bg-black/20 px-4 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none appearance-none cursor-pointer">
                                        <option className="bg-slate-900">Available</option>
                                        <option className="bg-slate-900">In Use</option>
                                        <option className="bg-slate-900">Low Stock</option>
                                        <option className="bg-slate-900">Maintenance</option>
                                        <option className="bg-slate-900">Operational</option>
                                        <option className="bg-slate-900">Warning</option>
                                        <option className="bg-slate-900">Critical</option>
                                    </select>
                                    <ChevronRight className="absolute right-4 top-3.5 h-4 w-4 text-slate-500 rotate-90 pointer-events-none" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Quantity</label>
                                    <input type="number" name="quantity" value={formData.quantity} onChange={onChange} className="flex h-11 w-full rounded-lg border border-white/10 bg-black/20 px-4 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none placeholder:text-slate-700" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Unit</label>
                                    <input name="unit" value={formData.unit} onChange={onChange} className="flex h-11 w-full rounded-lg border border-white/10 bg-black/20 px-4 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none placeholder:text-slate-700" placeholder="kg" required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Price/Unit</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3.5 text-slate-500 text-sm">$</span>
                                    <input type="number" name="pricePerUnit" value={formData.pricePerUnit} onChange={onChange} className="flex h-11 w-full rounded-lg border border-white/10 bg-black/20 pl-8 pr-4 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none placeholder:text-slate-700" required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Location</label>
                                <input name="location" value={formData.location} onChange={onChange} className="flex h-11 w-full rounded-lg border border-white/10 bg-black/20 px-4 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none placeholder:text-slate-700" placeholder="Warehouse A" />
                            </div>
                        </div>
                        <div className="pt-6 border-t border-white/10">
                            <button type="submit" className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 flex items-center justify-center gap-2">
                                {editingId ? 'Update Resource' : 'Create Resource'}
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

export default Inventory;
