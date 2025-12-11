import React from 'react';
import Sidebar from '../components/Sidebar';
import BentoGrid from '../components/BentoGrid';
import { Search, Activity } from 'lucide-react';

const Dashboard = () => {
    return (
        <div className="min-h-screen bg-background text-foreground flex font-sans">
            {/* Sidebar Rail */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 ml-16 flex flex-col min-h-screen transition-all duration-300">

                {/* Top Bar */}
                <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30 px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4 w-1/3">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search resources..."
                                className="w-full h-9 pl-9 pr-4 rounded-sm border border-border bg-background/50 focus:bg-background focus:border-primary text-sm transition-all focus:outline-none placeholder:text-muted-foreground/50"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-sm border border-border bg-background">
                            <div className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </div>
                            <span className="text-xs font-mono text-muted-foreground">System Nominal</span>
                        </div>
                    </div>
                </header>

                <div className="p-6 md:p-8 overflow-y-auto flex-1">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-sm hover:bg-primary/90 transition-colors">
                                Add Resource
                            </button>
                        </div>
                    </div>

                    {/* Bento Grid Stats */}
                    <BentoGrid />

                    {/* Recent Inventory Movement - Dense Table Look */}
                    <div className="bg-card border border-border rounded-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/20">
                            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Recent Activity</h2>
                            <button className="text-xs text-primary hover:underline">View All</button>
                        </div>
                        <div className="divide-y divide-border">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex justify-between items-center px-6 py-3 hover:bg-muted/30 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-primary/50"></div>
                                        <div>
                                            <p className="font-medium text-sm text-foreground">Iron Rods Batch #{100 + i}</p>
                                            <p className="text-xs text-muted-foreground font-mono">UPDATED: 2h ago</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="px-2 py-0.5 rounded text-xs border border-border bg-background text-muted-foreground font-mono">STOCK</span>
                                        <span className="text-sm font-mono text-emerald-500 font-bold">+50 kg</span>
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
