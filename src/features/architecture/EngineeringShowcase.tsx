"use client";

import { Modal } from "@/components/ui/Modal";
import { useLocale } from "@/hooks/useLocale";
import { useSnappFlowStore } from "@/store/useSnappFlowStore";

export function EngineeringShowcase() {
  const { t } = useLocale();
  const isOpen = useSnappFlowStore((s) => s.isArchModalOpen);
  const setOpen = useSnappFlowStore((s) => s.setArchModalOpen);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setOpen(false)}
      title={t.architecture.title}
      subtitle={t.architecture.subtitle}
      closeLabel={t.architecture.close}
    >
      <div className="space-y-3">
        {t.architecture.items.map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-950/90"
          >
            <h3 className="text-xs font-bold text-brand-600 dark:text-brand-400">{item.title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </Modal>
  );
}