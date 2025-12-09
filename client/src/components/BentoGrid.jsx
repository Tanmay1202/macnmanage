import React from 'react';

// A generic card for the grid
const BentoCard = ({ title, value, subtext, color = "text-foreground", colSpan = "col-span-1" }) => {
    return (
        <div className={`p-6 bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow ${colSpan}`}>
            <h3 className="text-muted-foreground text-sm font-medium">{title}</h3>
            <p className={`text-2xl font-bold mt-2 ${color}`}>{value}</p>
            {subtext && <p className="text-xs text-muted-foreground mt-1">{subtext}</p>}
        </div>
    );
};

const BentoGrid = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <BentoCard
                title="Total Resources"
                value="1,234"
                subtext="+4% from last month"
            />
            <BentoCard
                title="Low Stock Alerts"
                value="12"
                color="text-destructive"
                subtext="Requires attention"
            />
            <BentoCard
                title="Active Production"
                value="5"
                subtext="Efficient"
            />
            <BentoCard
                title="System Status"
                value="Healthy"
                color="text-primary"
                colSpan="col-span-1"
            />
        </div>
    );
};

export default BentoGrid;
