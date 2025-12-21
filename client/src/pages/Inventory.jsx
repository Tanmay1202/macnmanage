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
        <div className="min-h-screen bg-background text-foreground flex font-sans">
            <Sidebar />

            <div className="flex-1 ml-16 flex">
                {/* Left Filter Panel */}
                <aside className="w-64 border-r border-border bg-card/30 p-6 hidden lg:block sticky top-0 h-screen overflow-y-auto">
                    <div className="flex items-center gap-2 mb-8 text-primary">
                        <Filter size={16} />
                        <span className="text-sm font-semibold tracking-wide uppercase">Filters</span>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="text-xs font-medium text-muted-foreground uppercase mb-3 block">Category</label>
                            <div className="space-y-2">
                                {['All Resources', 'Raw Materials', 'Tools', 'Machines', 'Finished Goods'].map((cat, i) => (
                                    <div
                                        key={i}
                                        onClick={() => setFilterCategory(cat)}
                                        className={`flex items-center gap-2 text-sm px-2 py-1.5 rounded-sm cursor-pointer transition-colors ${filterCategory === cat ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
                                    >
                                        {cat}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-medium text-muted-foreground uppercase mb-3 block">Status</label>
                            <div className="space-y-2">
                                {['All', 'Available', 'In Use', 'Low Stock', 'Maintenance', 'Operational', 'Warning', 'Critical'].map((status, i) => (
                                    <div
                                        key={i}
                                        onClick={() => setFilterStatus(status)}
                                        className={`flex items-center gap-2 px-2 py-1 cursor-pointer rounded-sm ${filterStatus === status ? 'bg-accent text-accent-foreground' : 'hover:bg-muted'}`}
                                    >
                                        {status !== 'All' && (
                                            <div className={`w-3 h-3 border rounded-sm flex items-center justify-center ${status === 'Available' || status === 'Operational' ? 'bg-emerald-500/20 border-emerald-500/50' :
                                                status === 'Low Stock' || status === 'Warning' ? 'bg-amber-500/20 border-amber-500/50' :
                                                    'bg-destructive/20 border-destructive/50'
                                                }`}></div>
                                        )}
                                        <span className={`text-sm ${filterStatus === status ? 'text-foreground' : 'text-muted-foreground'}`}>{status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col min-w-0 bg-background">
                    {/* Header */}
                    <header className="h-16 border-b border-border flex items-center justify-between px-8 bg-card/20 sticky top-0 backdrop-blur-sm z-20">
                        <div className="flex items-center gap-4">
                            <h1 className="text-xl font-bold tracking-tight">Inventory</h1>
                            <span className="px-2 py-0.5 rounded-sm bg-muted text-muted-foreground text-xs font-mono">{filteredResources.length} ITEMS</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <input id="inventory-search" className="h-9 pl-9 pr-4 w-64 rounded-sm border border-border bg-background focus:ring-1 focus:ring-primary focus:border-primary text-sm transition-all" placeholder="Search... (Cmd+K)" />
                            </div>
                            <button
                                onClick={() => {
                                    setEditingId(null);
                                    setFormData({ name: '', type: 'Raw Material', quantity: 0, unit: 'kg', pricePerUnit: 0, location: '', status: 'Available' });
                                    setShowDrawer(true);
                                }}
                                className="h-9 px-4 bg-primary text-primary-foreground text-sm font-medium rounded-sm hover:bg-primary/90 flex items-center gap-2"
                            >
                                <Plus size={16} />
                                Add Item
                            </button>
                        </div>
                    </header>

                    {/* Data Table */}
                    <div className="flex-1 p-8 overflow-auto">
                        <div className="border border-border rounded-sm overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted/30 text-muted-foreground font-medium uppercase text-xs tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4 border-b border-border font-medium">Name</th>
                                        <th className="px-6 py-4 border-b border-border font-medium">Type</th>
                                        <th className="px-6 py-4 border-b border-border font-medium">Status</th>
                                        <th className="px-6 py-4 border-b border-border font-medium text-right">Qty</th>
                                        <th className="px-6 py-4 border-b border-border font-medium text-right">Value</th>
                                        <th className="px-6 py-4 border-b border-border font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border bg-card/20">
                                    {isLoading ? (
                                        <tr><td colSpan="6" className="p-8 text-center text-muted-foreground">Loading...</td></tr>
                                    ) : filteredResources.length === 0 ? (
                                        <tr><td colSpan="6" className="p-8 text-center text-muted-foreground">No resources found matching filters.</td></tr>
                                    ) : (
                                        filteredResources.map((item) => (
                                            <tr key={item._id} className="group hover:bg-muted/30 transition-colors">
                                                <td className="px-6 py-4 flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-sm bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                        <Package size={16} />
                                                    </div>
                                                    <span className="font-medium text-foreground">{item.name}</span>
                                                </td>
                                                <td className="px-6 py-4 text-muted-foreground">{item.type}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-sm text-xs font-medium border ${item.status === 'Available' || item.status === 'Operational' ? 'border-emerald-900 bg-emerald-950/30 text-emerald-500' :
                                                        item.status === 'Low Stock' || item.status === 'Warning' ? 'border-amber-900 bg-amber-950/30 text-amber-500' :
                                                            'border-red-900 bg-destructive/10 text-destructive'
                                                        }`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right font-mono text-foreground">{item.quantity} <span className="text-muted-foreground text-xs">{item.unit}</span></td>
                                                <td className="px-6 py-4 text-right font-mono text-muted-foreground">${item.pricePerUnit}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button onClick={() => handleEdit(item)} className="text-muted-foreground hover:text-primary transition-colors">
                                                            <div className="text-xs font-medium uppercase tracking-wide">Edit</div>
                                                        </button>
                                                        <span className="text-border">|</span>
                                                        <button onClick={() => handleDelete(item._id)} className="text-muted-foreground hover:text-destructive transition-colors">
                                                            <div className="text-xs font-medium uppercase tracking-wide">Delete</div>
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
            <div className={`fixed inset-y-0 right-0 w-96 bg-card border-l border-border shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${showDrawer ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="h-full flex flex-col">
                    <div className="p-6 border-b border-border flex items-center justify-between">
                        <h2 className="text-lg font-bold">{editingId ? 'Edit Resource' : 'New Resource'}</h2>
                        <button onClick={() => setShowDrawer(false)} className="text-muted-foreground hover:text-foreground">
                            <X size={20} />
                        </button>
                    </div>
                    <form onSubmit={onSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-medium uppercase text-muted-foreground">Name</label>
                                <input name="name" value={formData.name} onChange={onChange} className="flex h-10 w-full rounded-sm border border-input bg-background/50 px-3 py-2 text-sm focus:ring-1 focus:ring-primary transition-all" placeholder="Resource Name" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium uppercase text-muted-foreground">Type</label>
                                <select name="type" value={formData.type} onChange={onChange} className="flex h-10 w-full rounded-sm border border-input bg-background/50 px-3 py-2 text-sm focus:ring-1 focus:ring-primary transition-all">
                                    <option>Raw Material</option>
                                    <option>Machine</option>
                                    <option>Tool</option>
                                    <option>Finished Good</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium uppercase text-muted-foreground">Status</label>
                                <select name="status" value={formData.status} onChange={onChange} className="flex h-10 w-full rounded-sm border border-input bg-background/50 px-3 py-2 text-sm focus:ring-1 focus:ring-primary transition-all">
                                    <option>Available</option>
                                    <option>In Use</option>
                                    <option>Low Stock</option>
                                    <option>Maintenance</option>
                                    <option>Operational</option>
                                    <option>Warning</option>
                                    <option>Critical</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium uppercase text-muted-foreground">Quantity</label>
                                    <input type="number" name="quantity" value={formData.quantity} onChange={onChange} className="flex h-10 w-full rounded-sm border border-input bg-background/50 px-3 py-2 text-sm focus:ring-1 focus:ring-primary transition-all" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium uppercase text-muted-foreground">Unit</label>
                                    <input name="unit" value={formData.unit} onChange={onChange} className="flex h-10 w-full rounded-sm border border-input bg-background/50 px-3 py-2 text-sm focus:ring-1 focus:ring-primary transition-all" placeholder="kg" required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium uppercase text-muted-foreground">Price/Unit</label>
                                <input type="number" name="pricePerUnit" value={formData.pricePerUnit} onChange={onChange} className="flex h-10 w-full rounded-sm border border-input bg-background/50 px-3 py-2 text-sm focus:ring-1 focus:ring-primary transition-all" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium uppercase text-muted-foreground">Location</label>
                                <input name="location" value={formData.location} onChange={onChange} className="flex h-10 w-full rounded-sm border border-input bg-background/50 px-3 py-2 text-sm focus:ring-1 focus:ring-primary transition-all" placeholder="Warehouse A" />
                            </div>
                        </div>
                        <div className="pt-4">
                            <button type="submit" className="w-full py-2 bg-primary text-primary-foreground font-medium rounded-sm hover:bg-primary/90 transition-colors">
                                {editingId ? 'Update Resource' : 'Create Resource'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Drawer Backdrop */}
            {showDrawer && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setShowDrawer(false)}></div>
            )}
        </div>
    );
};

export default Inventory;
