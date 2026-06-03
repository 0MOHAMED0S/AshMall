import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Users, Search, Shield, Store as StoreIcon, User } from "lucide-react";
import { toast } from "sonner";
import { adminListUsers, adminSetRole } from "@/lib/admin.functions";
import { AdminPageHeader, Card, Spinner, EmptyState } from "@/components/ash/AdminUI";

export const Route = createFileRoute("/_authenticated/admin/users")({
  component: UsersAdmin,
});

interface AdminUser {
  id: string; full_name: string | null; phone: string | null; avatar_url: string | null;
  created_at: string; roles: string[];
}

function UsersAdmin() {
  const list = useServerFn(adminListUsers);
  const setRole = useServerFn(adminSetRole);
  const [rows, setRows] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  async function reload() {
    setLoading(true);
    try { const r = await list({ data: { q } }); setRows((r.users ?? []) as AdminUser[]); }
    finally { setLoading(false); }
  }
  useEffect(() => { void reload(); }, []);

  async function toggle(user_id: string, role: "admin" | "store_owner" | "customer", grant: boolean) {
    try {
      await setRole({ data: { user_id, role, grant } });
      setRows((p) => p.map((u) => u.id === user_id ? {
        ...u,
        roles: grant ? Array.from(new Set([...u.roles, role])) : u.roles.filter((r) => r !== role),
      } : u));
      toast.success("تم التحديث");
    } catch (e) { toast.error(e instanceof Error ? e.message : "فشل التحديث"); }
  }

  return (
    <div>
      <AdminPageHeader icon={Users} eyebrow="Users" title="إدارة المستخدمين" description="عرض المستخدمين والتحكم في صلاحياتهم." />

      <Card className="p-3 mb-4">
        <form onSubmit={(e) => { e.preventDefault(); void reload(); }} className="relative max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="بحث بالاسم..."
            className="w-full rounded-full bg-background border border-border ps-4 pe-9 py-2 text-sm focus:border-primary outline-none"
          />
        </form>
      </Card>

      <Card>
        {loading ? <Spinner /> : rows.length === 0 ? (
          <EmptyState icon={Users} title="لا توجد نتائج" />
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((u) => (
              <li key={u.id} className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="h-10 w-10 rounded-full bg-secondary overflow-hidden grid place-items-center shrink-0">
                    {u.avatar_url ? <img src={u.avatar_url} alt="" className="h-full w-full object-cover" /> : <User className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold truncate">{u.full_name ?? "بدون اسم"}</div>
                    <div className="text-[11px] text-muted-foreground tabular-nums truncate">
                      {u.phone ?? "—"} · انضمّ {new Date(u.created_at).toLocaleDateString("ar-EG")}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                  <RoleToggle label="مشرف" icon={Shield} active={u.roles.includes("admin")} onClick={() => toggle(u.id, "admin", !u.roles.includes("admin"))} accent="primary" />
                  <RoleToggle label="صاحب متجر" icon={StoreIcon} active={u.roles.includes("store_owner")} onClick={() => toggle(u.id, "store_owner", !u.roles.includes("store_owner"))} />
                  <RoleToggle label="عميل" icon={User} active={u.roles.includes("customer")} onClick={() => toggle(u.id, "customer", !u.roles.includes("customer"))} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function RoleToggle({ label, icon: Icon, active, onClick, accent }: { label: string; icon: React.ComponentType<{ className?: string }>; active: boolean; onClick: () => void; accent?: "primary" }) {
  const activeCls = accent === "primary"
    ? "bg-primary text-primary-foreground border-primary"
    : "bg-emerald-500/15 text-emerald-600 border-emerald-500/30";
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
        active ? activeCls : "bg-secondary text-muted-foreground border-border hover:text-foreground"
      }`}
    >
      <Icon className="h-3.5 w-3.5" /> {label}
    </button>
  );
}
