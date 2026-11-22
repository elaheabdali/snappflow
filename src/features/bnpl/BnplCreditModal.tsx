"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Modal } from "@/components/ui/Modal";
import { useLocale } from "@/hooks/useLocale";
import { formatCurrency } from "@/lib/format";
import { submitBnplApplication } from "@/lib/mock-api";
import { useSnappFlowStore } from "@/store/useSnappFlowStore";

export function BnplCreditModal() {
  const { locale, t } = useLocale();
  const isOpen = useSnappFlowStore((s) => s.isBnplModalOpen);
  const setOpen = useSnappFlowStore((s) => s.setBnplModalOpen);
  const setBnplCreditLimit = useSnappFlowStore((s) => s.setBnplCreditLimit);

  const [step, setStep] = useState<1 | 2>(1);
  const [referenceCode, setReferenceCode] = useState<string | null>(null);

  const schema = z.object({
    fullName: z.string().min(3, t.bnpl.errors.fullNameMin),
    nationalId: z.string().regex(/^\d{10}$/, t.bnpl.errors.nationalIdInvalid),
    phone: z.string().regex(/^09\d{9}$/, t.bnpl.errors.phoneInvalid),
    monthlyIncome: z.coerce.number().min(5_000_000, t.bnpl.errors.incomeMin),
    requestedLimit: z.coerce.number().min(500_000).max(50_000_000),
  });

  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    trigger,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      nationalId: "",
      phone: "",
      monthlyIncome: 15_000_000,
      requestedLimit: 5_000_000,
    },
  });

  const mutation = useMutation({
    mutationFn: submitBnplApplication,
    onSuccess: (data) => {
      setBnplCreditLimit(data.approvedLimit);
      setReferenceCode(data.referenceCode);
    },
  });

  const handleClose = () => {
    setOpen(false);
    setStep(1);
    setReferenceCode(null);
    reset();
  };

  const handleNextStep = async () => {
    const valid = await trigger(["fullName", "nationalId", "phone"]);
    if (valid) setStep(2);
  };

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t.bnpl.title}
      subtitle={t.bnpl.subtitle}
      closeLabel={t.bnpl.close}
    >
      {referenceCode ? (
        <div className="space-y-4 py-4 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-brand-600 dark:text-brand-400" aria-hidden="true" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">{t.bnpl.successTitle}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">{t.bnpl.successDesc}</p>
          <div className="inline-block rounded-xl border border-slate-200 bg-slate-100 px-4 py-2 font-mono text-xs text-brand-700 dark:border-slate-800 dark:bg-slate-950 dark:text-brand-400">
            {referenceCode}
          </div>
          <div>
            <button
              type="button"
              onClick={handleClose}
              className="mt-2 w-full rounded-xl bg-brand-500 py-2.5 text-sm font-bold text-slate-950 hover:bg-brand-400"
            >
              {t.bnpl.close}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="flex gap-2 text-xs font-semibold">
            <span
              className={`flex-1 rounded-lg px-3 py-1.5 text-center ${
                step === 1
                  ? "bg-brand-500/20 text-brand-700 ring-1 ring-brand-500/40 dark:text-brand-400"
                  : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
              }`}
            >
              1. {t.bnpl.step1Title}
            </span>
            <span
              className={`flex-1 rounded-lg px-3 py-1.5 text-center ${
                step === 2
                  ? "bg-brand-500/20 text-brand-700 ring-1 ring-brand-500/40 dark:text-brand-400"
                  : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
              }`}
            >
              2. {t.bnpl.step2Title}
            </span>
          </div>

          {step === 1 ? (
            <div className="space-y-3">
              <div>
                <label htmlFor="bnpl-name" className="mb-1 block text-xs text-slate-600 dark:text-slate-300">
                  {t.bnpl.fullNameLabel}
                </label>
                <input
                  id="bnpl-name"
                  type="text"
                  placeholder={t.bnpl.fullNamePlaceholder}
                  {...register("fullName")}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
                {errors.fullName && (
                  <p role="alert" className="mt-1 text-xs text-rose-500 dark:text-rose-400">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="bnpl-nid" className="mb-1 block text-xs text-slate-600 dark:text-slate-300">
                  {t.bnpl.nationalIdLabel}
                </label>
                <input
                  id="bnpl-nid"
                  type="text"
                  inputMode="numeric"
                  placeholder={t.bnpl.nationalIdPlaceholder}
                  {...register("nationalId")}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
                {errors.nationalId && (
                  <p role="alert" className="mt-1 text-xs text-rose-500 dark:text-rose-400">
                    {errors.nationalId.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="bnpl-phone" className="mb-1 block text-xs text-slate-600 dark:text-slate-300">
                  {t.bnpl.phoneLabel}
                </label>
                <input
                  id="bnpl-phone"
                  type="tel"
                  inputMode="numeric"
                  placeholder={t.bnpl.phonePlaceholder}
                  {...register("phone")}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
                {errors.phone && (
                  <p role="alert" className="mt-1 text-xs text-rose-500 dark:text-rose-400">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleNextStep}
                className="w-full rounded-xl bg-brand-500 py-2.5 text-sm font-bold text-slate-950 hover:bg-brand-400"
              >
                {t.bnpl.nextStep}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label htmlFor="bnpl-income" className="mb-1 block text-xs text-slate-600 dark:text-slate-300">
                  {t.bnpl.incomeLabel}
                </label>
                <input
                  id="bnpl-income"
                  type="number"
                  {...register("monthlyIncome")}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
                {errors.monthlyIncome && (
                  <p role="alert" className="mt-1 text-xs text-rose-500 dark:text-rose-400">
                    {errors.monthlyIncome.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="bnpl-limit" className="mb-1 block text-xs text-slate-600 dark:text-slate-300">
                  {t.bnpl.requestedLimitLabel}
                </label>
                <select
                  id="bnpl-limit"
                  {...register("requestedLimit")}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                >
                  {[2_000_000, 5_000_000, 10_000_000, 20_000_000].map((val) => (
                    <option key={val} value={val}>
                      {formatCurrency(val, locale)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 rounded-xl border border-slate-300 bg-slate-100 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
                >
                  {t.bnpl.prevStep}
                </button>
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-500 py-2.5 text-sm font-bold text-slate-950 hover:bg-brand-400 disabled:opacity-60"
                >
                  {mutation.isPending && (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  )}
                  <span>
                    {mutation.isPending ? t.bnpl.submitting : t.bnpl.submit}
                  </span>
                </button>
              </div>
            </div>
          )}
        </form>
      )}
    </Modal>
  );
}