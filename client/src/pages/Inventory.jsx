import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Plus, Package, Search } from 'lucide-react';

const Inventory = () => {
    const [resources, setResources] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);

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

    // Fetch Resources
    const fetchResources = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const token = userInfo ? userInfo.token : null;

            if (!token) {
                setIsLoading(false);
                return;
            }

            const res = await fetch('/api/resources', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await res.json();

            if (!res.ok) {
                console.error("Fetch Error:", data);
                setIsLoading(false);
                return;
            }

            setResources(data);
        } catch (error) {
            console.error("Failed to fetch resources", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, []);

    // Handle Input Change
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    // Handle Submit
    const onSubmit = async e => {
        e.preventDefault();
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const token = userInfo ? userInfo.token : null;

            if (!token) {
                alert("You are not logged in!");
                return;
            }

            const res = await fetch('/api/resources', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                fetchResources(); // Refresh list
                setShowAddForm(false);
                setFormData({ ...formData, name: '', quantity: 0, pricePerUnit: 0, location: '' }); // Reset partial
                alert("Resource added successfully!"); // User feedback
            } else {
                alert(`Error: ${data.message || 'Failed to add resource'}`);
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong. Check console.");
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex">
            <Sidebar />
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Inventory</h1>
                        <p className="text-muted-foreground mt-1">Manage your raw materials and tools.</p>
                    </div>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        <Plus size={20} />
                        {showAddForm ? 'Cancel' : 'Add Resource'}
                    </button>
                </header>

                {/* Add Resource Form (Conditional) */}
                {showAddForm && (
                    <div className="mb-8 p-6 bg-card border border-border rounded-xl shadow-sm animate-accordion-down">
                        <h2 className="text-xl font-semibold mb-4">Add New Resource</h2>
                        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Resource Name</label>
                                <input name="name" value={formData.name} onChange={onChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="e.g. Steel Rods" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Type</label>
                                <select name="type" value={formData.type} onChange={onChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                                    <option>Raw Material</option>
                                    <option>Machine</option>
                                    <option>Tool</option>
                                    <option>Finished Good</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Quantity</label>
                                <input type="number" name="quantity" value={formData.quantity} onChange={onChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Unit</label>
                                <input name="unit" value={formData.unit} onChange={onChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="kg, pcs, liters" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Price Per Unit ($)</label>
                                <input type="number" name="pricePerUnit" value={formData.pricePerUnit} onChange={onChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Location</label>
                                <input name="location" value={formData.location} onChange={onChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Warehouse A" />
                            </div>
                            <div className="md:col-span-2 flex justify-end mt-4">
                                <button type="submit" className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">Save Item</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Inventory Table */}
                <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-border flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <input placeholder="Search resources..." className="pl-9 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
                        </div>
                    </div>

                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm text-left">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Name</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Type</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Status</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Quantity</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Value</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {isLoading ? (
                                    <tr><td colSpan="5" className="p-8 text-center text-muted-foreground">Loading inventory...</td></tr>
                                ) : resources.length === 0 ? (
                                    <tr><td colSpan="5" className="p-8 text-center text-muted-foreground">No resources found. Add one to get started.</td></tr>
                                ) : (
                                    resources.map((item) => (
                                        <tr key={item._id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle font-medium flex items-center gap-2">
                                                <div className="p-2 rounded-md bg-accent/50 text-accent-foreground"><Package size={16} /></div>
                                                {item.name}
                                            </td>
                                            <td className="p-4 align-middle">{item.type}</td>
                                            <td className="p-4 align-middle">
                                                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${item.status === 'Available' ? 'border-transparent bg-green-500/10 text-green-500' : 'border-transparent bg-red-500/10 text-red-500'}`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="p-4 align-middle text-right">{item.quantity} {item.unit}</td>
                                            <td className="p-4 align-middle text-right font-mono">${(item.quantity * item.pricePerUnit).toFixed(2)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Inventory;
