"use client";

import { useState, useMemo } from "react";
import {
    Construction,
    MapPin,
    Calendar,
    User,
    ArrowUpRight,
    CheckCircle2,
    Clock,
    AlertCircle,
    Search,
    X,
    Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { Project } from "@/types";

type ProjectWithMeta = Project & {
    title: string;
    location: string;
    budget: string;
    deadline: string;
    type: string;
};

export default function ProjectsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeStatus, setActiveStatus] = useState("All");
    const [isAddingProject, setIsAddingProject] = useState(false);

    const initialProjects: ProjectWithMeta[] = [
        {
            id: "PRJ-2024-001",
            title: "Royal Heights Windows",
            name: "Royal Heights Windows",
            client: "Build Corp India",
            location: "Mumbai, MH",
            progress: 75,
            status: "Ongoing",
            budget: "₹12,40,000",
            deadline: "24 Mar 2026",
            type: "Commercial",
            startDate: "2024-01-01"
        },
        {
            id: "PRJ-2024-002",
            title: "Green Villa Fenestration",
            name: "Green Villa Fenestration",
            client: "Private Residence",
            location: "Pune, MH",
            progress: 100,
            status: "Completed",
            budget: "₹4,50,000",
            deadline: "12 Feb 2026",
            type: "Residential",
            startDate: "2024-01-01"
        },
        {
            id: "PRJ-2024-003",
            title: "Tech Park Partitioning",
            name: "Tech Park Partitioning",
            client: "Innovate Hub",
            location: "Bangalore, KA",
            progress: 30,
            status: "Ongoing", // Mapping 'Delayed' to 'Ongoing' for now or handle distinctively
            budget: "₹8,90,000",
            deadline: "05 Apr 2026",
            type: "Commercial",
            startDate: "2024-01-01"
        },
        {
            id: "PRJ-2024-004",
            title: "Skyline Tower A",
            name: "Skyline Tower A",
            client: "Heritage Group",
            location: "Chennai, TN",
            progress: 55,
            status: "Ongoing",
            budget: "₹24,00,000",
            deadline: "15 May 2026",
            type: "High-rise",
            startDate: "2024-01-01"
        },
    ];

    const statuses = ["All", "Ongoing", "Completed", "On Hold"];

    const filteredProjects = useMemo(() => {
        return initialProjects.filter(p => {
            const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.client.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = activeStatus === "All" || p.status === activeStatus;
            return matchesSearch && matchesStatus;
        });
    }, [searchQuery, activeStatus]);

    return (
        <div className="space-y-10 pb-12">
            <PageHeader
                title="Construction Projects"
                description="Track real-time site progress and installation milestones."
                icon={<Construction size={24} />}
                iconBgColor="bg-indigo-500/10"
                iconColor="text-indigo-600"
            >
                <button
                    onClick={() => setIsAddingProject(true)}
                    className="h-11 px-6 rounded-xl bg-primary text-white hover:bg-primary-light transition-all premium-shadow flex items-center gap-2 text-sm font-bold active:scale-95"
                >
                    <Plus size={20} /> New Construction Site
                </button>
            </PageHeader>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="relative flex-grow w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                    <input
                        type="text"
                        placeholder="Search projects or clients..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-6 py-3 bg-white border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 premium-shadow text-sm"
                    />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                    {statuses.map(status => (
                        <button
                            key={status}
                            onClick={() => setActiveStatus(status)}
                            className={cn(
                                "px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap",
                                activeStatus === status
                                    ? "bg-indigo-600 text-white premium-shadow"
                                    : "bg-white text-text-secondary hover:bg-zinc-50 border border-zinc-100"
                            )}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <AnimatePresence mode="popLayout">
                    {filteredProjects.length > 0 ? filteredProjects.map((project, i) => (
                        <motion.div
                            key={project.id}
                            layout
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white rounded-[2.5rem] border border-zinc-100 premium-shadow p-8 hover:border-indigo-500/20 transition-all flex flex-col gap-6 group relative overflow-hidden"
                        >
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-text-secondary font-mono tracking-tighter bg-zinc-100 px-2 py-0.5 rounded uppercase">
                                            {project.id}
                                        </span>
                                        <span className={cn(
                                            "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest",
                                            project.status === "Completed" ? "bg-emerald-50 text-emerald-600" :
                                                project.status === "On Hold" ? "bg-red-50 text-red-600" :
                                                    "bg-blue-50 text-blue-600"
                                        )}>
                                            {project.status}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-primary group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{project.title}</h3>
                                </div>
                                <button onClick={() => alert(`Opening details for ${project.title}...`)} className="w-10 h-10 rounded-full flex items-center justify-center text-zinc-300 hover:text-primary hover:bg-zinc-50 transition-all">
                                    <ArrowUpRight size={20} />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-y-4">
                                <div className="flex items-center gap-3 text-sm text-text-secondary font-medium">
                                    <User size={16} className="text-zinc-400" /> {project.client}
                                </div>
                                <div className="flex items-center gap-3 text-sm text-text-secondary font-medium">
                                    <MapPin size={16} className="text-zinc-400" /> {project.location}
                                </div>
                                <div className="flex items-center gap-3 text-sm text-text-secondary font-medium">
                                    <Calendar size={16} className="text-zinc-400" /> {project.deadline}
                                </div>
                                <div className="flex items-center gap-3 text-sm text-text-secondary font-medium">
                                    <Construction size={16} className="text-zinc-400" /> {project.type}
                                </div>
                            </div>

                            <div className="space-y-3 pt-2">
                                <div className="flex items-center justify-between text-sm font-bold text-primary px-1">
                                    <span>Installation Progress</span>
                                    <span>{project.progress}%</span>
                                </div>
                                <div className="h-3 w-full bg-zinc-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${project.progress}%` }}
                                        transition={{ duration: 1 }}
                                        className={cn(
                                            "h-full rounded-full",
                                            project.status === "Completed" ? "bg-emerald-500" :
                                                project.status === "On Hold" ? "bg-red-500" :
                                                    "bg-indigo-500"
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-6 pt-4 border-t border-zinc-50">
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Project Value</span>
                                    <span className="text-lg font-bold text-primary">{project.budget}</span>
                                </div>
                                <div className="flex-grow flex justify-end gap-2 text-right">
                                    {project.status === "Completed" ? (
                                        <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl">
                                            <CheckCircle2 size={14} /> Ready for Handover
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1.5 text-xs font-bold text-zinc-600 bg-zinc-50 px-4 py-2 rounded-xl">
                                            {project.status === "On Hold" ? <AlertCircle size={14} className="text-red-500" /> : <Clock size={14} />}
                                            Track Progress
                                        </span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )) : (
                        <div className="col-span-full py-20 text-center text-text-secondary italic">
                            No projects match your search or filter.
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Add Project Modal */}
            <AnimatePresence>
                {isAddingProject && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddingProject(false)}
                            className="absolute inset-0 bg-primary/20 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-white rounded-[2.5rem] w-full max-w-2xl p-10 premium-shadow overflow-hidden"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                                        <Construction size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-primary">New Construction Project</h3>
                                        <p className="text-xs text-text-secondary">Initialize a new site installation record.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsAddingProject(false)}
                                    className="w-10 h-10 rounded-full hover:bg-zinc-100 flex items-center justify-center text-zinc-400 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("New Construction Site Initialized on Server!"); setIsAddingProject(false); }}>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest pl-1">Project Title</label>
                                        <input type="text" className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/10" placeholder="e.g. Marina Bay Tower" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest pl-1">Client Name</label>
                                        <input type="text" className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/10" placeholder="e.g. DLF Group" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest pl-1">Location</label>
                                        <input type="text" className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/10" placeholder="City, State" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest pl-1">Project Type</label>
                                        <select className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/10">
                                            <option>Commercial</option>
                                            <option>Residential</option>
                                            <option>High-rise</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest pl-1">Estimated Budget</label>
                                        <input type="text" className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/10" placeholder="₹ Amount" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest pl-1">Target Deadline</label>
                                        <input type="date" className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/10" />
                                    </div>
                                </div>

                                <button className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all premium-shadow mt-4">
                                    Initialize Construction Site
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
