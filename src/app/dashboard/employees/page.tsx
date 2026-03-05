"use client";

import { useState, useMemo } from "react";
import {
    Users,
    Search,
    Mail,
    Phone,
    MapPin,
    MoreHorizontal,
    Plus,
    ArrowUpRight,
    TrendingUp,
    Clock,
    UserCheck,
    X,
    UserPlus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { StatCard } from "@/components/ui/stat-card";
import { AlertItem } from "@/components/ui/alert-item";
import { Employee } from "@/types";
import { cn } from "@/lib/utils";

type EmployeeWithMeta = Employee & { location: string; email: string; phone: string };

import { PageHeader } from "@/components/ui/page-header";

export default function EmployeesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeStatus, setActiveStatus] = useState("All");
    const [isAddingEmployee, setIsAddingEmployee] = useState(false);

    const initialEmployees: EmployeeWithMeta[] = [
        { id: "EMP-001", name: "Dharshan R", role: "Project Manager", status: "Active", department: "Operations", location: "Royal Heights", email: "dharshan@upuc.com", phone: "+91 98765 43210" },
        { id: "EMP-002", name: "Amit Sharma", role: "Site Supervisor", status: "Active", department: "Construction", location: "Green Villa", email: "amit@upuc.com", phone: "+91 98765 43211" },
        { id: "EMP-003", name: "Priya Patel", role: "Design Lead", status: "Active", department: "Design", location: "HQ - Bangalore", email: "priya@upuc.com", phone: "+91 98765 43212" },
        { id: "EMP-004", name: "Rahul Varma", role: "Technician", status: "Active", department: "Maintenance", location: "Moving to Tech Park", email: "rahul@upuc.com", phone: "+91 98765 43213" },
        { id: "EMP-005", name: "Suresh Kumar", role: "Fabrication Lead", status: "Active", department: "Production", location: "Factory Floor", email: "suresh@upuc.com", phone: "+91 98765 43214" },
        { id: "EMP-006", name: "Anjali Rao", role: "HR Manager", status: "On Leave", department: "HR", location: "None", email: "anjali@upuc.com", phone: "+91 98765 43215" },
    ];

    const statuses = ["All", "Active", "On Leave", "Terminated"];

    const filteredEmployees = useMemo(() => {
        return initialEmployees.filter(emp => {
            const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                emp.role.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = activeStatus === "All" || emp.status === activeStatus;
            return matchesSearch && matchesStatus;
        });
    }, [searchQuery, activeStatus]);

    const hrStats = [
        { title: "Active Staff", value: "34", icon: <UserCheck size={20} />, color: "text-blue-600", bg: "bg-blue-50" },
        { title: "On Sites", value: "18", icon: <TrendingUp size={20} />, color: "text-emerald-600", bg: "bg-emerald-50" },
        { title: "Avg Attendance", value: "96%", icon: <Clock size={20} />, color: "text-orange-600", bg: "bg-orange-50" },
    ];

    return (
        <div className="space-y-10 pb-12">
            <PageHeader
                title="Employee Directory"
                description="Manage your workforce, track attendance, and assign roles."
                icon={<Users size={24} />}
                iconBgColor="bg-blue-500/10"
                iconColor="text-blue-600"
            >
                <button
                    onClick={() => setIsAddingEmployee(true)}
                    className="h-11 px-6 rounded-xl bg-primary text-white hover:bg-primary-light transition-all premium-shadow flex items-center gap-2 text-sm font-bold active:scale-95"
                >
                    <Plus size={20} /> Add New Staff
                </button>
            </PageHeader>

            {/* HR Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {hrStats.map((stat, i) => (
                    <StatCard
                        key={i}
                        index={i}
                        {...stat}
                    />
                ))}
            </div>

            {/* Search & Tabs */}
            <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="relative flex-grow w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or job role..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-6 py-3 bg-white border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 premium-shadow text-sm"
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
                                    ? "bg-primary text-white premium-shadow"
                                    : "bg-white text-text-secondary hover:bg-zinc-50 border border-zinc-100"
                            )}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Employee Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                    {filteredEmployees.length > 0 ? filteredEmployees.map((emp, i) => (
                        <motion.div
                            key={emp.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white rounded-[2.5rem] border border-zinc-100 premium-shadow p-8 flex flex-col gap-6 group hover:border-blue-500/20 transition-all"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-300 relative overflow-hidden ring-4 ring-zinc-50 group-hover:ring-blue-100 transition-all">
                                        <Users size={32} />
                                        <div className={cn(
                                            "absolute bottom-0 right-0 w-4 h-4 border-2 border-white rounded-full",
                                            emp.status === "Active" ? "bg-emerald-500" :
                                                emp.status === "On Leave" ? "bg-blue-500" :
                                                    "bg-zinc-300"
                                        )} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-primary">{emp.name}</h3>
                                        <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">{emp.role}</p>
                                    </div>
                                </div>
                                <button className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-300 hover:text-primary transition-all">
                                    <MoreHorizontal size={20} />
                                </button>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm text-text-secondary">
                                    <Mail size={16} className="text-zinc-300" /> {emp.email}
                                </div>
                                <div className="flex items-center gap-3 text-sm text-text-secondary">
                                    <Phone size={16} className="text-zinc-300" /> {emp.phone}
                                </div>
                                <div className="flex items-center gap-3 text-sm text-text-secondary font-medium">
                                    <MapPin size={16} className="text-zinc-300" /> {emp.location}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-zinc-50 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Status</span>
                                    <span className={cn(
                                        "text-xs font-bold",
                                        emp.status === "Active" ? "text-emerald-600" :
                                            emp.status === "On Leave" ? "text-blue-600" :
                                                "text-zinc-400"
                                    )}>{emp.status}</span>
                                </div>
                                <button className="h-9 px-4 rounded-xl bg-zinc-50 text-primary text-xs font-bold flex items-center gap-2 hover:bg-zinc-100 transition-all">
                                    View Profile <ArrowUpRight size={14} />
                                </button>
                            </div>
                        </motion.div>
                    )) : (
                        <div className="col-span-full py-20 text-center text-text-secondary italic">
                            No staff members found.
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Add Employee Modal */}
            <AnimatePresence>
                {isAddingEmployee && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddingEmployee(false)}
                            className="absolute inset-0 bg-primary/20 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-white rounded-[3rem] w-full max-w-xl p-10 premium-shadow overflow-hidden"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-[1.25rem] bg-blue-100 flex items-center justify-center text-blue-600">
                                        <UserPlus size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-primary">Onboard New Employee</h3>
                                        <p className="text-xs text-text-secondary uppercase font-bold tracking-widest mt-1">HR Management System</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsAddingEmployee(false)}
                                    className="w-10 h-10 rounded-full hover:bg-zinc-100 flex items-center justify-center text-zinc-400 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsAddingEmployee(false); }}>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest pl-1">Full Name</label>
                                            <input type="text" className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/5 transition-all" placeholder="Enter name" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest pl-1">Job Role</label>
                                            <input type="text" className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/5 transition-all" placeholder="e.g. Supervisor" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest pl-1">Email Address</label>
                                        <input type="email" className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/5 transition-all" placeholder="example@upuc.com" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest pl-1">Contact Number</label>
                                            <input type="text" className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/5 transition-all" placeholder="+91" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest pl-1">Primary Workshelf</label>
                                            <select className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/5 transition-all">
                                                <option>Main Office (HQ)</option>
                                                <option>Manufacturing Factory</option>
                                                <option>On-Site Installation</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full py-5 bg-primary text-white rounded-[1.5rem] font-bold hover:bg-primary-light transition-all premium-shadow mt-4">
                                    Confirm Onboarding
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
