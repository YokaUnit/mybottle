"use client";

import { useTransition } from "react";
import {
  createStoreBenefitAction,
  deleteStoreBenefitAction,
  toggleStoreBenefitAction,
} from "@/app/(store-manage)/dashboard/actions";
import { BENEFIT_KIND_LABELS, BENEFIT_KIND_PRESETS, type StoreBenefit } from "@/lib/store-manage/types";

type Props = {
  storeId: string;
  benefits: StoreBenefit[];
};

export function StoreManageBenefitsClient({ storeId, benefits }: Props) {
  const [pending, start] = useTransition();

  return (
    <div className="space-y-4">
      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#e2e8f0]">
        <h2 className="text-sm font-extrabold text-[#1e293b]">テンプレから作成</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {BENEFIT_KIND_PRESETS.map((preset) => (
            <button
              key={preset.title}
              type="button"
              disabled={pending}
              onClick={() =>
                start(async () => {
                  const fd = new FormData();
                  fd.set("storeId", storeId);
                  fd.set("title", preset.title);
                  fd.set("description", BENEFIT_KIND_LABELS[preset.kind]);
                  fd.set("benefitKind", preset.kind);
                  fd.set("rewardType", preset.rewardType);
                  fd.set("rewardValue", String(preset.rewardValue));
                  fd.set("conditions", JSON.stringify(preset.conditions));
                  await createStoreBenefitAction(fd);
                })
              }
              className="rounded-full bg-[#f0fdfa] px-3 py-1.5 text-[11px] font-extrabold text-[#0d9488] ring-1 ring-[#99f6e4] disabled:opacity-60"
            >
              + {preset.title}
            </button>
          ))}
        </div>
      </section>

      <div className="space-y-2">
        {benefits.length === 0 ? (
          <p className="rounded-2xl bg-white p-6 text-center text-sm font-bold text-[#64748b] ring-1 ring-[#e2e8f0]">
            特典がまだありません。上のテンプレから追加できます。
          </p>
        ) : (
          benefits.map((benefit) => (
            <article key={benefit.id} className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#e2e8f0]">
              <div className="min-w-0 flex-1">
                <p className="font-extrabold text-[#1e293b]">{benefit.title}</p>
                <p className="mt-0.5 text-xs font-medium text-[#64748b]">
                  {BENEFIT_KIND_LABELS[benefit.benefitKind]}
                  {benefit.description ? ` · ${benefit.description}` : ""}
                </p>
              </div>
              <button
                type="button"
                disabled={pending}
                onClick={() =>
                  start(async () => {
                    const fd = new FormData();
                    fd.set("storeId", storeId);
                    fd.set("benefitId", benefit.id);
                    fd.set("isActive", String(!benefit.isActive));
                    await toggleStoreBenefitAction(fd);
                  })
                }
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-extrabold ${
                  benefit.isActive ? "bg-[#0d9488] text-white" : "bg-[#e2e8f0] text-[#64748b]"
                }`}
              >
                {benefit.isActive ? "ON" : "OFF"}
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={() =>
                  start(async () => {
                    const fd = new FormData();
                    fd.set("storeId", storeId);
                    fd.set("benefitId", benefit.id);
                    await deleteStoreBenefitAction(fd);
                  })
                }
                className="text-xs font-bold text-[#94a3b8]"
              >
                削除
              </button>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
