import React from 'react';

// A generic card for the grid
const BentoCard = ({ title, value, subtext, color = "text-foreground", colSpan = "col-span-1" }) => {
    return (
        <div className={`p-6 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors ${colSpan}`}>
            <h3 className="text-muted-foreground text-sm font-medium">{title}</h3>
            <p className={`text-2xl font-bold mt-2 ${color}`}>{value}</p>
            {subtext && <p className="text-xs text-muted-foreground mt-1">{subtext}</p>}
        </div>
    );
};

const BentoGrid = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <BentoCard
                title="Total Resources"
                value={stats?.totalResources || 0}
                subtext="Inventory Items"
            />
            <BentoCard
                title="Low Stock Alerts"
                value={stats?.lowStock || 0}
                color={stats?.lowStock > 0 ? "text-destructive" : "text-foreground"}
                subtext={stats?.lowStock > 0 ? "Requires attention" : "All good"}
            />
            <BentoCard
                title="Active Production"
                value={stats?.activeProduction || 0}
                subtext="Operational Machines"
            />
            <BentoCard
                title="System Status"
                value={stats?.systemStatus || 'Nominal'}
                color={stats?.systemStatus === 'Critical' ? 'text-destructive' : 'text-emerald-500'}
                colSpan="col-span-1"
            />
        </div>
    );
};

export default BentoGrid;
