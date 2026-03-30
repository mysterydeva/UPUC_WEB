"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { History, ShieldAlert, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { cn } from "@/lib/utils";

export default function AuditPage() {
    const { data: session } = useSession();
    const businessId = session?.user?.businessId;
    const [logs, setLogs] = useState<any[]>([]);

    useEffect(() => {
        if (businessId) {
            import("@/app/actions/audit-actions").then(m => {
                m.getAuditLogs(businessId).then(setLogs);
            }).catch(e => console.error("Audit actions not found", e));
        }
    }, [businessId]);

    return (
        <div className="space-y-8 pb-12">
            <PageHeader title="System Audit Trail" description="Immutable record of all user activities, edits, and deletions across modules." icon={<ShieldAlert size={24} />} iconBgColor="bg-red-500/10" iconColor="text-red-500" />

            <div className="bg-white rounded-[2.5rem] p-8 border border-zinc-100 premium-shadow">
                <div className="space-y-4">
                    {logs.length > 0 ? logs.map((log: any) => (
                        <div key={log.id} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-zinc-50 border border-transparent hover:border-zinc-100 transition-all">
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white", log.action === 'DELETE' ? 'bg-red-500' : log.action === 'UPDATE' ? 'bg-orange-500' : 'bg-emerald-500')}>
                                <History size={18} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <p className="font-bold text-primary text-sm">{log.user?.name || "System Auto"} <span className="text-zinc-500 font-medium ml-1">performed</span> <span className={cn("font-black tracking-wider uppercase text-[10px] px-2 py-0.5 rounded-md ml-1", log.action === 'DELETE' ? 'bg-red-100 text-red-600' : 'bg-zinc-100 text-zinc-600')}>{log.action}</span></p>
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{new Date(log.timestamp).toLocaleString()}</span>
                                </div>
                                <p className="text-sm text-text-secondary mt-1">
                                    Modified <span className="font-bold text-primary">{log.entity}</span> ({log.entityId})
                                </p>
                                {log.details && (
                                    <div className="mt-3 p-3 bg-zinc-50 rounded-xl text-xs font-mono text-zinc-600 border border-zinc-100">
                                        {log.details}
                                    </div>
                                )}
                            </div>
                        </div>
                    )) : (
                        <div className="py-20 text-center text-zinc-400 italic font-bold">No audit logs recorded yet.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
