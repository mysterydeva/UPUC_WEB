"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Warehouse, Plus, ArrowRightLeft, Layers, MapPin } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { motion, AnimatePresence } from "framer-motion";
import { getWarehouses, createWarehouse } from "@/app/actions/warehouse-actions";

export default function WarehousePage() {
    const { data: session } = useSession();
    const businessId = session?.user?.businessId;

    const [warehouses, setWarehouses] = useState<any[]>([]);
    const [showAdd, setShowAdd] = useState(false);

    const loadData = async () => {
        if (!businessId) return;
        const data = await getWarehouses(businessId);
        setWarehouses(data);
    };

    useEffect(() => { loadData(); }, [businessId]);

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!businessId) return;
        const formData = new FormData(e.currentTarget);
        await createWarehouse({
            name: formData.get("name") as string,
            location: formData.get("location") as string,
            businessId
        });
        setShowAdd(false);
        loadData();
    };

    return (
        <div className="space-y-8 pb-12">
            <PageHeader title="Warehouse & Godowns" description="Manage multiple storage locations and inter-godown transfers." icon={<Warehouse size={24} />} iconBgColor="bg-orange-500/10" iconColor="text-orange-500">
                <div className="flex items-center gap-3">
                    <button className="h-11 px-4 rounded-xl border border-zinc-200 hover:bg-zinc-50 flex items-center gap-2 text-sm font-medium text-text-secondary"><ArrowRightLeft size={18} /> Transfer Stock</button>
                    <button onClick={() => setShowAdd(true)} className="h-11 px-6 rounded-xl bg-primary text-white hover:bg-primary-light transition-all premium-shadow flex items-center gap-2 text-sm font-bold"><Plus size={20} /> Add Godown</button>
                </div>
            </PageHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {warehouses.map((wh) => (
                    <div key={wh.id} className="bg-white rounded-[2rem] p-6 border border-zinc-100 premium-shadow hover:border-orange-500/20 transition-all">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                                <Warehouse size={24} />
                            </div>
                            <span className="px-3 py-1 bg-zinc-50 text-zinc-500 text-xs font-bold rounded-lg border border-zinc-100">
                                {wh.inventory?.length || 0} unique items
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-primary mb-1">{wh.name}</h3>
                        <p className="text-sm text-text-secondary flex items-center gap-1.5 mb-6">
                            <MapPin size={14} className="text-zinc-400" /> {wh.location || "No location set"}
                        </p>
                        <div className="pt-4 border-t border-zinc-50">
                            <button className="w-full py-2.5 bg-zinc-50 text-text-secondary text-sm font-bold rounded-xl hover:bg-zinc-100 transition-colors">View Stock</button>
                        </div>
                    </div>
                ))}

                {warehouses.length === 0 && !showAdd && (
                    <div className="col-span-full py-20 text-center text-zinc-400 italic font-bold border-2 border-dashed border-zinc-200 rounded-[2.5rem]">
                        No warehouses created yet. Let's add your first Godown!
                    </div>
                )}
            </div>

            {showAdd && (
                <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2rem] p-8 w-full max-w-md premium-shadow">
                        <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2"><Layers className="text-orange-500" size={20} /> New Godown</h3>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Godown Name</label>
                                <input name="name" required placeholder="Main Warehouse" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Location / Address</label>
                                <input name="location" required placeholder="Industrial Estate, Peenya" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20" />
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowAdd(false)} className="px-6 py-3 rounded-xl text-sm font-bold text-zinc-500 hover:bg-zinc-50 transition-colors">Cancel</button>
                                <button type="submit" className="px-6 py-3 rounded-xl bg-orange-600 text-white text-sm font-bold hover:bg-orange-700 transition-all">Create Godown</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
