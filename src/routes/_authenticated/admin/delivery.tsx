import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { adminListDelivery, adminCreateDelivery, adminToggleDelivery, adminDeleteDelivery } from "@/lib/delivery.functions";
import { Bike, Trash2, Copy, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader, Card, Spinner, EmptyState } from "@/components/ash/AdminUI";

export const Route = createFileRoute("/_authenticated/admin/delivery")({
  component: AdminDelivery,
});

function AdminDelivery() {
  const list = useServerFn(adminListDelivery);
  const create = useServerFn(adminCreateDelivery);
  const toggle = useServerFn(adminToggleDelivery);
  const del = useServerFn(adminDeleteDelivery);
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState(""); const [whatsapp, setWhatsapp] = useState("");
  const [phone, setPhone] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function reload() { try { const r = await list(); setRows(r.personnel ?? []); } finally { setLoading(false); } }
  useEffect(() => { void reload(); }, []);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault(); setBusy(true);
    try {
      await create({ data: { name, whatsapp, phone: phone || undefined, email: email || undefined, password: password || undefined } });
      toast.success("تم إضافة الدليفري"); setName(""); setWhatsapp(""); setPhone(""); setEmail(""); setPassword(""); await reload();
    } catch (e) { toast.error(e instanceof Error ? e.message : "فشل"); } finally { setBusy(false); }
  }

  function copy(t: string) { navigator.clipboard.writeText(t); toast.success("تم النسخ"); }

  return (
    <div>
      <AdminPageHeader icon={Bike} eyebrow="Delivery" title="عمال الدليفري" description="إدارة حسابات الدليفري ومتابعتهم." />

      <Card className="p-4 mb-4">
        <h3 className="font-bold mb-3 text-sm">إضافة دليفري جديد</h3>
        <form onSubmit={onCreate} className="grid sm:grid-cols-2 gap-3">
          <input required placeholder="الاسم" value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl bg-background border border-border px-3 py-2 text-sm" />
          <input required placeholder="رقم الواتساب (مع كود الدولة)" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="rounded-xl bg-background border border-border px-3 py-2 text-sm" />
          <input placeholder="رقم الهاتف (اختياري)" value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-xl bg-background border border-border px-3 py-2 text-sm" />
          <input type="email" placeholder="البريد (اختياري — هيتولّد تلقائي)" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl bg-background border border-border px-3 py-2 text-sm" />
          <input placeholder="كلمة المرور (اختياري — هتتولّد تلقائي)" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-xl bg-background border border-border px-3 py-2 text-sm" />
          <button type="submit" disabled={busy} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-2 text-sm font-bold disabled:opacity-50">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} إضافة
          </button>
        </form>
      </Card>

      <Card>
        {loading ? <Spinner /> : rows.length === 0 ? <EmptyState icon={Bike} title="لا يوجد دليفري بعد" /> : (
          <ul className="divide-y divide-border">
            {rows.map((r) => (
              <li key={r.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-bold">{r.name} {!r.active && <span className="text-[10px] text-destructive">(موقوف)</span>}</div>
                  <div className="text-xs text-muted-foreground">📱 {r.whatsapp} {r.phone && `· ${r.phone}`}</div>
                  <div className="mt-1.5 text-xs flex flex-wrap gap-2">
                    <button onClick={() => copy(r.email)} className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 hover:bg-secondary/80"><Copy className="h-3 w-3" /> {r.email}</button>
                    <button onClick={() => copy(r.password)} className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 hover:bg-secondary/80"><Copy className="h-3 w-3" /> {r.password}</button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={async () => { await toggle({ data: { id: r.id, active: !r.active } }); await reload(); }}
                    className="rounded-full border border-border px-3 py-1.5 text-xs hover:bg-secondary">
                    {r.active ? "إيقاف" : "تفعيل"}
                  </button>
                  <button onClick={async () => { if (confirm("حذف نهائياً؟")) { await del({ data: { id: r.id } }); await reload(); } }}
                    className="grid place-items-center h-8 w-8 rounded-full border border-border hover:border-destructive/40 hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
