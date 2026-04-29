 
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from "lucide-react";
import { useProductStore } from "../store/useProductStore";
import { COLORS } from "../constants/theme";

const ICONS: any = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const COLOR_MAP: Record<string, { bg: string; border: string; text: string }> = {
  success: { bg: "#F0FBF2", border: "#86EFAC", text: COLORS.active },
  error: { bg: "#FEF2F2", border: "#FCA5A5", text: "#B91C1C" },
  warning: { bg: "#FFFBEB", border: "#FCD34D", text: COLORS.darkYellow },
  info: { bg: "#EFF6FF", border: "#93C5FD", text: "#1D4ED8" },
};

export function Toasts() {
  const toasts = useProductStore((s: any) => s.toasts);
  const removeToast = useProductStore((s: any) => s.removeToast);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 w-[340px] max-w-[90vw]">
      {toasts.map((t: any) => {
        const Icon = ICONS[t.type];
        const c = COLOR_MAP[t.type];
        return (
          <div
            key={t.id}
            className="flex items-start gap-3 rounded-lg border px-4 py-3 shadow-md animate-in slide-in-from-right"
            style={{ background: c.bg, borderColor: c.border, color: c.text }}
          >
            <Icon className="w-5 h-5 mt-0.5 shrink-0" />
            <span className="text-sm flex-1 leading-snug">{t.message}</span>
            <button
              onClick={() => removeToast(t.id)}
              className="opacity-60 hover:opacity-100 transition"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
