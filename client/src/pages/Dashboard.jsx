import React from 'react';
import Sidebar from '../components/Sidebar';
import BentoGrid from '../components/BentoGrid';

const Dashboard = () => {
    return (
        <div className="min-h-screen bg-background text-foreground flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">Add Resource</button>
                    </div>
                </header>

                {/* Bento Grid Stats */}
                <BentoGrid />

                {/* Recent Activity Table Placeholder */}
                <div className="bg-card border border-border rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-4">Recent Inventory Movement</h2>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex justify-between items-center p-3 hover:bg-muted/50 rounded-lg transition-colors border-b border-border/50 last:border-0">
                                <div>
                                    <p className="font-medium">Iron Rods {i}</p>
                                    <p className="text-sm text-muted-foreground">Updated 2h ago</p>
                                </div>
                                <span className="text-sm font-mono">+50 kg</span>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
