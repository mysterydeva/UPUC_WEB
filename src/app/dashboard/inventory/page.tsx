"use client";

import { useState, useMemo } from "react";
import {
    Box,
    Search,
    Plus,
    MoreVertical,
    AlertCircle,
    Download,
    X,
    PlusCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { InventoryItem } from "@/types";

export default function InventoryPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [isAddingItem, setIsAddingItem] = useState(false);

    const initialData: (InventoryItem & { price: string })[] = [
        { id: "UPVC-001", name: "UPVC Profile - White", category: "Profiles", stock: 1200, unit: "ft", status: "In Stock", price: "₹45/ft" },
        { id: "UPVC-002", name: "UPVC Profile - Wood Grain", category: "Profiles", stock: 45, unit: "ft", status: "Low Stock", price: "₹65/ft" },
        { id: "HW-402", name: "Heavy Duty Friction Stays", category: "Hardware", stock: 150, unit: "pcs", status: "In Stock", price: "₹280/pc" },
        { id: "GL-101", name: "6mm Toughened Glass", category: "Glass", stock: 800, unit: "sqft", status: "In Stock", price: "₹120/sqft" },
        { id: "HW-901", name: "Multi-point Lock Mechanism", category: "Hardware", stock: 12, unit: "pcs", status: "Out of Stock", price: "₹1,200/pc" },
        { id: "UPVC-005", name: "Beading Profile - Black", category: "Profiles", stock: 450, unit: "ft", status: "In Stock", price: "₹25/ft" },
    ];

    const categories = ["All", "Profiles", "Hardware", "Glass"];

    const filteredData = useMemo(() => {
        return initialData.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.id.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = activeCategory === "All" || item.category === activeCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, activeCategory]);

    return (
        <div className="space-y-8 pb-12">
            <PageHeader
                title="Inventory Management"
                description="Track and manage your UPVC manufacturing raw materials."
                icon={<Box size={24} />}
                iconBgColor="bg-orange-500/10"
                iconColor="text-orange-600"
            >
                <div className="flex items-center gap-3">
                    <button className="h-11 px-4 rounded-xl border border-zinc-200 hover:bg-zinc-50 transition-colors flex items-center gap-2 text-sm font-medium text-text-secondary">
                        <Download size={18} /> Export CSV
                    </button>
                    <button
                        onClick={() => setIsAddingItem(true)}
                        className="h-11 px-6 rounded-xl bg-primary text-white hover:bg-primary-light transition-all premium-shadow flex items-center gap-2 text-sm font-bold active:scale-95"
                    >
                        <Plus size={20} /> Add New Item
                    </button>
                </div>
            </PageHeader>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Total Items", value: initialData.length, sub: `across ${categories.length - 1} categories`, color: "bg-blue-500" },
                    { label: "Low Stock Alert", value: initialData.filter(i => i.status !== "In Stock").length, sub: "Requires immediate reorder", color: "bg-orange-500" },
                    { label: "Value in Hand", value: "₹ 15.4 Lakhs", sub: "Current inventory valuation", color: "bg-emerald-500" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-zinc-100 premium-shadow">
                        <div className="flex items-center gap-4 mb-4">
                            <div className={cn("w-2 h-8 rounded-full", stat.color)} />
                            <span className="text-sm font-bold text-text-secondary uppercase tracking-wider">{stat.label}</span>
                        </div>
                        <div className="text-3xl font-bold text-primary">{stat.value}</div>
                        <p className="text-xs text-text-secondary mt-1">{stat.sub}</p>
                    </div>
                ))}
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-[2.5rem] border border-zinc-100 premium-shadow overflow-hidden">
                <div className="p-6 border-b border-zinc-50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-6 py-2.5 bg-zinc-50 border border-zinc-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/10 focus:border-accent transition-all text-sm"
                        />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
                                    activeCategory === cat
                                        ? "bg-primary text-white premium-shadow"
                                        : "bg-zinc-50 text-text-secondary hover:bg-zinc-100"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-zinc-50 text-left text-xs font-bold text-text-secondary uppercase tracking-widest">
                                <th className="px-8 py-4">Item Details</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Current Stock</th>
                                <th className="px-6 py-4">Unit Price</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {filteredData.length > 0 ? filteredData.map((item, i) => (
                                <motion.tr
                                    key={item.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="hover:bg-zinc-50/50 transition-colors group"
                                >
                                    <td className="px-8 py-5">
                                        <div className="font-bold text-primary">{item.name}</div>
                                        <div className="text-xs text-text-secondary font-mono">{item.id}</div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-medium text-text-secondary bg-zinc-100 px-3 py-1 rounded-full uppercase text-[10px] tracking-wider">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 font-bold text-primary">
                                        {item.stock} <span className="text-xs text-text-secondary font-medium ml-1">{item.unit}</span>
                                    </td>
                                    <td className="px-6 py-5 text-sm font-medium text-primary">{item.price}</td>
                                    <td className="px-6 py-5">
                                        <div className={cn(
                                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase",
                                            item.status === "In Stock" ? "bg-emerald-50 text-emerald-600" :
                                                item.status === "Low Stock" ? "bg-orange-50 text-orange-600" :
                                                    "bg-red-50 text-red-600"
                                        )}>
                                            {item.status === "Low Stock" && <AlertCircle size={12} />}
                                            {item.status}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <button className="p-2 rounded-lg hover:bg-zinc-200/50 text-zinc-300 opacity-0 group-hover:opacity-100 transition-all">
                                            <MoreVertical size={16} />
                                        </button>
                                    </td>
                                </motion.tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="px-8 py-10 text-center text-text-secondary italic">
                                        No items found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Item Modal */}
            <AnimatePresence>
                {isAddingItem && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddingItem(false)}
                            className="absolute inset-0 bg-primary/20 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-white rounded-[2.5rem] w-full max-w-xl p-8 premium-shadow overflow-hidden"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                                        <PlusCircle size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold text-primary">Add New Inventory Item</h3>
                                </div>
                                <button
                                    onClick={() => setIsAddingItem(false)}
                                    className="w-10 h-10 rounded-full hover:bg-zinc-100 flex items-center justify-center text-zinc-400 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsAddingItem(false); }}>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Item Name</label>
                                        <input type="text" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20" placeholder="e.g. Glass Polish" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Category</label>
                                        <select className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20">
                                            <option>Profiles</option>
                                            <option>Hardware</option>
                                            <option>Glass</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Quantity</label>
                                        <input type="number" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20" placeholder="0" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Unit</label>
                                        <input type="text" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20" placeholder="ft, pcs, sqft" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Alert Level</label>
                                        <input type="number" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20" placeholder="50" />
                                    </div>
                                </div>

                                <button className="w-full py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary-light transition-all premium-shadow mt-4">
                                    Save Item to Inventory
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
