"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
    ShieldCheck,
    UserPlus,
    Settings2,
    Search,
    Mail,
    KeySquare,
    EyeOff,
    Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getUsers, inviteUser, updateUserRole } from "@/app/actions/user-actions";

export default function UsersPage() {
    const { data: session } = useSession();
    const businessId = session?.user?.businessId;

    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showInvite, setShowInvite] = useState(false);

    const availableModules = [
        { id: "leads", name: "Leads & CRM" },
        { id: "quotations", name: "Quotations" },
        { id: "projects", name: "Job Orders & Sites" },
        { id: "inventory", name: "Inventory & Warehousing" },
        { id: "finance", name: "Invoicing & Vouchers" },
        { id: "banking", name: "Banking Ledgers" },
        { id: "reports", name: "Financial Statements" }
    ];

    const [selectedPermissions, setSelectedPermissions] = useState<Record<string, boolean>>({});

    const loadData = async () => {
        if (!businessId) return;
        setLoading(true);
        const data = await getUsers(businessId);
        setUsers(data);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, [businessId]);

    const togglePermission = (id: string) => {
        setSelectedPermissions(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleInvite = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!businessId) return;
        const formData = new FormData(e.currentTarget);
        await inviteUser({
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            role: formData.get("role") as string,
            permissions: JSON.stringify(selectedPermissions),
            businessId
        });
        setShowInvite(false);
        setSelectedPermissions({});
        loadData();
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
                        <ShieldCheck size={24} className="text-accent" />
                        Roles & Access Control
                    </h2>
                    <p className="text-sm text-text-secondary mt-1">
                        Manage team access, invite users, and set granular module permissions.
                    </p>
                </div>
                <button onClick={() => setShowInvite(true)} className="h-10 px-4 rounded-xl bg-primary text-white text-sm font-bold flex items-center gap-2 hover:bg-primary-light transition-all premium-shadow">
                    <UserPlus size={16} /> Invite User
                </button>
            </div>

            <div className="bg-white rounded-[2rem] border border-zinc-100 premium-shadow overflow-hidden">
                <div className="p-6 border-b border-zinc-50 flex items-center justify-between">
                    <h3 className="font-bold text-primary text-lg">Active Users</h3>
                    <div className="relative hidden sm:block">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input type="text" placeholder="Search users..." className="pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 w-64" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-zinc-50/50">
                            <tr>
                                <th className="text-left text-xs font-bold text-zinc-500 uppercase tracking-wider py-4 px-6">User</th>
                                <th className="text-left text-xs font-bold text-zinc-500 uppercase tracking-wider py-4 px-6">Role</th>
                                <th className="text-left text-xs font-bold text-zinc-500 uppercase tracking-wider py-4 px-6">Module Access</th>
                                <th className="text-right text-xs font-bold text-zinc-500 uppercase tracking-wider py-4 px-6">Options</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {users.map((u) => {
                                const perms = u.permissions ? JSON.parse(u.permissions) : {};
                                const activePerms = Object.keys(perms).filter(k => perms[k]);

                                return (
                                    <tr key={u.id} className="hover:bg-zinc-50/50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500">
                                                    {u.image ? <img src={u.image} alt={u.name} className="w-full h-full rounded-full" /> : <Mail size={16} />}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-primary text-sm">{u.name || "Pending Invite"}</p>
                                                    <p className="text-xs text-zinc-400">{u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <select
                                                defaultValue={u.role}
                                                onChange={(e) => updateUserRole(u.id, e.target.value, u.permissions)}
                                                className="bg-zinc-50 border border-zinc-100 px-3 py-1.5 rounded-lg text-xs font-bold text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                                            >
                                                <option value="ADMIN">Admin</option>
                                                <option value="MANAGER">Manager</option>
                                                <option value="USER">User (Restricted)</option>
                                            </select>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-wrap gap-1 max-w-xs">
                                                {u.role === 'ADMIN' ? (
                                                    <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded text-[10px] font-bold uppercase tracking-wider">Full Access</span>
                                                ) : activePerms.length > 0 ? (
                                                    activePerms.map((p: string) => (
                                                        <span key={p} className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold uppercase tracking-wider">
                                                            {p}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="px-2 py-1 bg-red-50 text-red-500 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                                        <EyeOff size={10} /> No Modules
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <button className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-500 hover:text-primary hover:bg-zinc-200 flex items-center justify-center transition-colors">
                                                <Settings2 size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {showInvite && (
                <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2rem] p-8 w-full max-w-md premium-shadow">
                        <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                            <KeySquare className="text-accent" size={20} /> Grant Access
                        </h3>
                        <form onSubmit={handleInvite} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Full Name</label>
                                <input name="name" required placeholder="Dharshan" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Email Address</label>
                                <input name="email" type="email" required placeholder="dharshan@upuc.com" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Base Role</label>
                                <select name="role" required className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20">
                                    <option value="USER">Standard User</option>
                                    <option value="MANAGER">Manager</option>
                                    <option value="ADMIN">Admin (Bypasses Permissions)</option>
                                </select>
                            </div>

                            <div className="pt-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Module Permissions</label>
                                <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                    {availableModules.map(mod => (
                                        <div key={mod.id} onClick={() => togglePermission(mod.id)} className={cn("flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer", selectedPermissions[mod.id] ? "bg-indigo-50 border-indigo-100 text-indigo-700" : "bg-zinc-50 border-zinc-100 text-zinc-500")}>
                                            <span className="text-sm font-bold">{mod.name}</span>
                                            <div className={cn("w-5 h-5 rounded flex items-center justify-center", selectedPermissions[mod.id] ? "bg-indigo-500 text-white" : "bg-zinc-200")}>
                                                {selectedPermissions[mod.id] && <Check size={12} />}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowInvite(false)} className="px-6 py-3 rounded-xl text-sm font-bold text-zinc-500 hover:bg-zinc-50 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="px-6 py-3 rounded-xl bg-accent text-white text-sm font-bold hover:bg-orange-600 transition-all">
                                    Send Invitation
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
