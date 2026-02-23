import React from 'react';
import { Box, AlertTriangle, Cpu, Activity } from 'lucide-react';

const cards = [
    {
        key: 'totalResources',
        title: 'Total Resources',
        icon: Box,
        color: 'indigo',
        subtext: 'Inventory items',
        getValue: (s) => s?.totalResources ?? 0,
    },
    {
        key: 'lowStock',
        title: 'Low Stock',
        icon: AlertTriangle,
        color: 'amber',
        getValue: (s) => s?.lowStock ?? 0,
        getSubtext: (s) => (s?.lowStock > 0 ? 'Requires attention' : 'All clear'),
        getColor: (s) => (s?.lowStock > 0 ? 'amber' : 'emerald'),
    },
    {
        key: 'activeProduction',
        title: 'Active Machines',
        icon: Cpu,
        color: 'violet',
        subtext: 'Operational',
        getValue: (s) => s?.activeProduction ?? 0,
    },
    {
        key: 'systemStatus',
        title: 'System Status',
        icon: Activity,
        color: 'emerald',
        getValue: (s) => s?.systemStatus ?? 'Nominal',
        getColor: (s) =>
            s?.systemStatus === 'Critical' ? 'red' : s?.systemStatus === 'Warning' ? 'amber' : 'emerald',
    },
];

const colorMap = {
    indigo: {
        border: 'border-indigo-500/20',
        hoverBorder: 'hover:border-indigo-500/50',
        topBar: 'bg-indigo-500',
        iconBg: 'bg-indigo-500/10',
        iconText: 'text-indigo-400',
        value: 'text-indigo-300',
        glow: 'hover:glow-indigo',
    },
    amber: {
        border: 'border-amber-500/20',
        hoverBorder: 'hover:border-amber-500/50',
        topBar: 'bg-amber-500',
        iconBg: 'bg-amber-500/10',
        iconText: 'text-amber-400',
        value: 'text-amber-300',
        glow: 'hover:glow-amber',
    },
    emerald: {
        border: 'border-emerald-500/20',
        hoverBorder: 'hover:border-emerald-500/50',
        topBar: 'bg-emerald-500',
        iconBg: 'bg-emerald-500/10',
        iconText: 'text-emerald-400',
        value: 'text-emerald-300',
        glow: 'hover:glow-emerald',
    },
    violet: {
        border: 'border-violet-500/20',
        hoverBorder: 'hover:border-violet-500/50',
        topBar: 'bg-violet-500',
        iconBg: 'bg-violet-500/10',
        iconText: 'text-violet-400',
        value: 'text-violet-300',
        glow: 'hover:glow-indigo',
    },
    red: {
        border: 'border-red-500/20',
        hoverBorder: 'hover:border-red-500/50',
        topBar: 'bg-red-500',
        iconBg: 'bg-red-500/10',
        iconText: 'text-red-400',
        value: 'text-red-300',
        glow: 'hover:glow-red',
    },
};

const BentoCard = ({ card, stats }) => {
    const value = card.getValue(stats);
    const colorKey = card.getColor ? card.getColor(stats) : card.color;
    const subtext = card.getSubtext ? card.getSubtext(stats) : card.subtext;
    const c = colorMap[colorKey] || colorMap.indigo;
    const Icon = card.icon;

    return (
        <div
            className={`relative p-6 bg-slate-900/50 backdrop-blur-sm border ${c.border} ${c.hoverBorder} rounded-xl transition-all duration-300 group overflow-hidden hover:-translate-y-0.5`}
        >
            {/* Top accent bar */}
            <div className={`absolute top-0 left-0 right-0 h-[2px] ${c.topBar} opacity-60 group-hover:opacity-100 transition-opacity`} />

            <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg ${c.iconBg} flex items-center justify-center ${c.iconText} group-hover:scale-110 transition-transform duration-200`}>
                    <Icon size={18} strokeWidth={1.8} />
                </div>
            </div>

            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1" style={{ fontFamily: 'var(--font-mono)' }}>
                {card.title}
            </p>
            <p className={`text-3xl font-bold tracking-tight ${c.value} leading-none`} style={{ fontFamily: 'var(--font-mono)' }}>
                {value}
            </p>
            {subtext && (
                <p className="text-[11px] text-slate-500 mt-2">{subtext}</p>
            )}
        </div>
    );
};

const BentoGrid = ({ stats }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {cards.map((card) => (
                <BentoCard key={card.key} card={card} stats={stats} />
            ))}
        </div>
    );
};

export default BentoGrid;
