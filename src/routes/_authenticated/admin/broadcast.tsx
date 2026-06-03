import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Send, Info, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { adminBroadcast } from "@/lib/admin.functions";
import { AdminPageHeader, Card } from "@/components/ash/AdminUI";

export const Route = createFileRoute("/_authenticated/admin/broadcast")({
  component: BroadcastAdmin,
});

type Type = "info" | "success" | "warning" | "error";
type Audience = "all" | "store_owners" | "customers";

function BroadcastAdmin() {
  const send = useServerFn(adminBroadcast);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [link, setLink] = useState("");
  const [type, setType] = useState<Type>("info");
  const [audience, setAudience] = useState<Audience>("all");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { toast.error("العنوان مطلوب"); return; }
    setBusy(true);
    try {
      const r = await send({ data: { title: title.trim(), body: body.trim() || undefined, link: link.trim() || undefined, type, audience } });
      toast.success(`تم إرسال الإشعار إلى ${r.sent ?? 0} مستخدم`);
      setTitle(""); setBody(""); setLink("");
    } catch (e) { toast.error(e instanceof Error ? e.message : "فشل الإرسال"); }
    finally { setBusy(false); }
  }

  const types: { key: Type; label: string; Icon: typeof Info; cls: string }[] = [
    { key: "info", label: "معلومة", Icon: Info, cls: "text-blue-500 bg-blue-500/15 border-blue-500/30" },
    { key: "success", label: "نجاح", Icon: CheckCircle2, cls: "text-emerald-500 bg-emerald-500/15 border-emerald-500/30" },
    { key: "warning", label: "تنبيه", Icon: AlertTriangle, cls: "text-amber-500 bg-amber-500/15 border-amber-500/30" },
    { key: "error", label: "تحذير", Icon: XCircle, cls: "text-destructive bg-destructive/15 border-destructive/30" },
  ];
  const audiences: { key: Audience; label: string }[] = [
    { key: "all", label: "كل المستخدمين" },
    { key: "store_owners", label: "أصحاب المتاجر" },
    { key: "customers", label: "العملاء" },
  ];

  return (
    <div>
      <AdminPageHeader icon={Send} eyebrow="Broadcast" title="بث إشعار" description="إرسال إشعار جماعي لمستخدمي المنصة." />

      <Card className="p-5">
        <form onSubmit={submit} className="space-y-4">
          <Field label="العنوان *"><input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} className={inputCls} /></Field>
          <Field label="النص"><textarea value={body} onChange={(e) => setBody(e.target.value)} maxLength={500} rows={4} className={inputCls} /></Field>
          <Field label="رابط (اختياري)"><input value={link} onChange={(e) => setLink(e.target.value)} className={inputCls} dir="ltr" placeholder="/orders, /stores/..." /></Field>

          <div>
            <div className="text-[11px] font-semibold text-muted-foreground mb-1.5">النوع</div>
            <div className="flex flex-wrap gap-2">
              {types.map((t) => (
                <button key={t.key} type="button" onClick={() => setType(t.key)}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                    type === t.key ? t.cls : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <t.Icon className="h-3.5 w-3.5" /> {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold text-muted-foreground mb-1.5">الجمهور</div>
            <div className="flex flex-wrap gap-2">
              {audiences.map((a) => (
                <button key={a.key} type="button" onClick={() => setAudience(a.key)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                    audience === a.key ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:opacity-95 disabled:opacity-50 transition">
              <Send className="h-4 w-4" /> {busy ? "جارٍ الإرسال..." : "إرسال"}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}

const inputCls = "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary outline-none";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="block text-[11px] font-semibold text-muted-foreground mb-1">{label}</span>{children}</label>;
}
