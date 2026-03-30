"use client";

import { useState, useMemo, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Box, Search, Plus, Upload, Layers, History, MoreVertical, FileDown, ScanBarcode } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/ui/page-header";
import { bulkImportInventory } from "@/app/actions/import-actions";
import Papa from "papaparse";
import ReactBarcode from "react-barcode";
import { cn } from "@/lib/utils";

export default function InventoryPage() {
    const { data: session } = useSession();
    const businessId = session?.user?.businessId;

    const [items, setItems] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [categories, setCategories] = useState<string[]>(["All"]);

    const loadData = async () => {
        if (!businessId) return;
        const { getInventoryItems } = await import("@/app/actions/inventory-actions");
        const res = await getInventoryItems(businessId);
        setItems(res || []);
        
        const cats = new Set<string>((res || []).map((r: any) => {
            const category = r.category;
            return typeof category === 'string' ? category : String(category || '');
        }));
        setCategories(["All", ...Array.from(cats)]);
    };

    useEffect(() => { loadData(); }, [businessId]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length || !businessId) return;
        const file = e.target.files[0];
        Papa.parse(file, {
            header: true,
            complete: async (results) => {
                const data = results.data as any[];
                if (data.length > 0) {
                    const res = await bulkImportInventory(businessId, data);
                    if (res.success) {
                        alert(`Successfully imported ${res.count} items!`);
                        loadData();
                    } else alert("Import failed check console");
                }
            }
        });
    };

    const generateCSVTemplate = () => {
        const headers = "name,category,stock,unit,price,taxRate,barcode\nProfile A,Profiles,100,pcs,1200,18,8901234567890\n";
        const blob = new Blob([headers], { type: "text/csv" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "inventory_bulk_import_template.csv";
        a.click();
    };

    const filteredData = useMemo(() => {
        return items.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || (item.barcode && item.barcode.includes(searchQuery));
            const matchesCategory = activeCategory === "All" || item.category === activeCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, activeCategory, items]);

    return (
        <div className="space-y-8 pb-12">
            <PageHeader title="Enterprise Inventory" description="Real-time stock tracking with Warehouse & Barcode Support." icon={<Box size={24} />} iconBgColor="bg-orange-500/10" iconColor="text-orange-600">
                <div className="flex items-center gap-3">
                    <button onClick={generateCSVTemplate} className="h-11 px-4 rounded-xl border border-zinc-200 hover:bg-zinc-50 flex items-center gap-2 text-sm font-medium text-text-secondary"><FileDown size={18} /> CSV Template</button>
                    <label className="h-11 px-4 rounded-xl border border-zinc-200 hover:bg-zinc-50 flex items-center gap-2 text-sm font-medium text-text-secondary cursor-pointer">
                        <Upload size={18} /> Bulk Import
                        <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
                    </label>
                    <button className="h-11 px-6 rounded-xl bg-primary text-white hover:bg-primary-light transition-all premium-shadow flex items-center gap-2 text-sm font-bold"><Plus size={20} /> Add Item</button>
                </div>
            </PageHeader>

            <div className="bg-white rounded-[3rem] border border-zinc-100 premium-shadow overflow-hidden">
                <div className="p-8 border-b border-zinc-50 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                        <input type="text" placeholder="Search by name or Barcode..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-14 pr-6 py-3.5 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/10 transition-all text-sm" />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto">
                        {categories.map(cat => (
                            <button key={cat as string} onClick={() => setActiveCategory(cat as string)} className={cn("px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap", activeCategory === cat ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-zinc-50 text-text-secondary hover:bg-zinc-100")}>{cat as string}</button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-zinc-50/50 text-left text-xs font-black text-text-secondary uppercase tracking-widest">
                                <th className="px-10 py-5">Item Details</th>
                                <th className="px-6 py-5">Identities & Barcode</th>
                                <th className="px-6 py-5">Stock Availability</th>
                                <th className="px-6 py-5">Unit Price</th>
                                <th className="px-6 py-5">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {filteredData.length > 0 ? filteredData.map((item, i) => (
                                <tr key={item.id} className="hover:bg-zinc-50/50 transition-colors group">
                                    <td className="px-10 py-6">
                                        <div className="font-bold text-primary text-base">{item.name}</div>
                                        <div className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mt-1">{item.category}</div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="space-y-2">
                                            {item.barcode ? (
                                                <div className="overflow-hidden rounded-md border border-zinc-100 inline-block bg-white p-1">
                                                    <ReactBarcode value={item.barcode} height={30} width={1.2} fontSize={10} margin={0} />
                                                </div>
                                            ) : (
                                                <div className="text-[10px] font-bold text-zinc-400 flex items-center gap-1"><ScanBarcode size={12} /> No Barcode</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="font-black text-primary text-lg">{item.stock} <span className="text-[10px] text-text-secondary font-black ml-1 uppercase">{item.unit}</span></div>
                                    </td>
                                    <td className="px-6 py-6 text-sm font-bold text-primary">₹{item.price?.toLocaleString()}</td>
                                    <td className="px-6 py-6">
                                        <div className={cn("inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider", item.status === "In Stock" ? "bg-emerald-50 text-emerald-600" : item.status === "Low Stock" ? "bg-orange-50 text-orange-600" : "bg-red-50 text-red-600")}>
                                            {item.status}
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={5} className="p-10 text-center text-zinc-400 font-bold italic">No inventory items. Use Bulk Import to add items.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
