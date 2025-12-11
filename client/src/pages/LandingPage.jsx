import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Box, Activity, GitBranch, ShieldCheck, Zap, BarChart3 } from 'lucide-react';

const LandingPage = () => {
    // Auth Check
    const navigate = useNavigate();

    React.useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            navigate('/dashboard');
        }
    }, [navigate]);

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
            {/* Navbar */}
            <nav className="border-b border-white/10 bg-background/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded flex items-center justify-center font-bold text-lg text-primary-foreground">M</div>
                        <span className="font-semibold tracking-tight text-lg">MacnManage</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm font-medium">
                        <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors">Log in</Link>
                        <Link to="/register" className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded transition-all flex items-center gap-2">
                            Get Started <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-20 pb-20 border-b border-border">
                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
                    <div className="text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-primary/30 bg-primary/10 text-primary text-xs font-medium mb-8">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            v1.0 Public Beta is Live
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-foreground leading-tight">
                            Operational Control<br />for Modern Manufacturing
                        </h1>
                        <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-lg">
                            Control inventory, production, and workflows.
                            <span className="block mt-2 text-sm text-muted-foreground/80">
                                Open-source resource management for micro-industries.
                            </span>
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 max-w-md">
                            <input
                                type="email"
                                placeholder="work@email.com"
                                className="w-full bg-secondary/50 border border-border rounded-sm px-4 py-3 focus:outline-none focus:border-primary transition-colors text-sm"
                            />
                            <button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-sm font-medium transition-all text-sm whitespace-nowrap">
                                Start Free Trial
                            </button>
                        </div>
                    </div>

                    {/* Right side static dashboard preview */}
                    <div className="relative rounded-lg border border-border bg-card/50 p-2">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none"></div>
                        <div className="aspect-video bg-muted rounded border border-border/50 flex items-center justify-center text-muted-foreground text-sm font-mono overflow-hidden">
                            <img src="https://placehold.co/800x450/0f172a/4f46e5?text=Dashboard+Preview" alt="Dashboard Preview" className="w-full h-full object-cover opacity-80" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Capabilities Grid */}
            <section className="py-24 border-b border-border bg-background">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Box, title: "Resource Tracking", desc: "Real-time inventory management with low-stock alerts and valuation tracking." },
                            { icon: Activity, title: "Production Visibility", desc: "Monitor active production lines, efficiency metrics, and daily output logs." },
                            { icon: GitBranch, title: "Workflow Control", desc: "Define custom operational workflows and assign tasks to specific stations." }
                        ].map((item, i) => (
                            <div key={i} className="group p-8 rounded-lg border border-border hover:border-primary/50 bg-card hover:bg-accent/5 transition-all">
                                <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center mb-6 text-primary">
                                    <item.icon size={20} />
                                </div>
                                <h3 className="text-lg font-semibold mb-3 text-foreground">{item.title}</h3>
                                <p className="text-muted-foreground leading-relaxed text-sm font-mono">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* System Flow */}
            <section className="py-24 border-b border-border bg-card/30">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-stretch justify-between text-center md:text-left border border-border rounded-lg overflow-hidden md:divide-x divide-border divide-y md:divide-y-0">
                        {[
                            { step: "01", title: "Define Resources", sub: "Raw materials" },
                            { step: "02", title: "Track Movement", sub: "Inbound & Outbound" },
                            { step: "03", title: "Monitor Production", sub: "Efficiency tracking" },
                            { step: "04", title: "Analyze Shortages", sub: "Predictive alerts" }
                        ].map((stage, i) => (
                            <div key={i} className="flex-1 p-8 bg-background/50 hover:bg-accent/5 transition-colors group">
                                <div className="text-xs font-mono text-primary mb-2 opacity-70 group-hover:opacity-100 transition-opacity">{stage.step}</div>
                                <h4 className="text-base font-medium mb-1 text-foreground">{stage.title}</h4>
                                <p className="text-xs text-muted-foreground uppercase tracking-widest">{stage.sub}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Product Preview Section */}
            <section className="py-24 border-b border-border">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Operational Dashboard Mock */}
                        <div className="border border-border rounded-lg p-1 bg-card">
                            <div className="bg-muted aspect-[4/3] rounded border border-border/50 flex items-center justify-center overflow-hidden">
                                <img src="https://placehold.co/600x450/0f172a/4f46e5?text=Operational+Dashboard" alt="Operational Dashboard" className="w-full h-full object-cover opacity-80" />
                            </div>
                            <div className="p-4">
                                <h3 className="text-sm font-semibold text-foreground">Operational Dashboard</h3>
                                <p className="text-xs text-muted-foreground mt-1">Real-time metrics and alerts.</p>
                            </div>
                        </div>
                        {/* Inventory Table Mock */}
                        <div className="border border-border rounded-lg p-1 bg-card">
                            <div className="bg-muted aspect-[4/3] rounded border border-border/50 flex items-center justify-center overflow-hidden">
                                <img src="https://placehold.co/600x450/0f172a/4f46e5?text=Inventory+Table" alt="Inventory Table" className="w-full h-full object-cover opacity-80" />
                            </div>
                            <div className="p-4">
                                <h3 className="text-sm font-semibold text-foreground">Inventory Control</h3>
                                <p className="text-xs text-muted-foreground mt-1">Dense data tables with quick actions.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* Footer */}
            <footer className="py-12 bg-background">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-primary/20 rounded-sm flex items-center justify-center font-bold text-xs text-primary">M</div>
                        <span className="font-semibold text-sm text-muted-foreground">MacnManage</span>
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">
                        Built with MERN Stack • Open Source
                    </div>
                    <div className="flex gap-4 opacity-50">
                        {/* Placeholder for social links */}
                        <div className="w-5 h-5 bg-border rounded-sm"></div>
                        <div className="w-5 h-5 bg-border rounded-sm"></div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
