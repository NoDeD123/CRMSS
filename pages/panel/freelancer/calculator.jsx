import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import PanelLayout from '@/components/Layout/PanelLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowDownUp, CircleHelp, Sparkles } from 'lucide-react';
import {
  SERVICE_FEE_ON_PAYOUT,
  VAT_RATE,
  PIT_RATE_STANDARD,
  PIT_RATE_COPYRIGHT,
  formatPln,
  formatAmountInput,
  parseAmount,
  sumToInvoiceNet,
  payoutFromInvoiceNet
} from '@/lib/freelancerPayoutModel';

function InfoTip({ title, children }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  return (
    <span ref={wrapRef} className="relative inline-flex align-middle">
      <button
        type="button"
        className="ml-1 rounded-full p-0.5 text-blue-400 outline-none ring-offset-2 transition hover:bg-blue-50 hover:text-blue-600 focus-visible:ring-2 focus-visible:ring-blue-400 dark:text-blue-500 dark:hover:bg-blue-950/50 dark:hover:text-blue-300 dark:ring-offset-gray-900"
        aria-expanded={open}
        aria-label={`Więcej: ${title}`}
        onClick={() => setOpen((v) => !v)}
      >
        <CircleHelp className="h-4 w-4" strokeWidth={1.75} />
      </button>
      {open ? (
        <span
          role="tooltip"
          className="absolute left-1/2 top-full z-30 mt-2 w-72 -translate-x-1/2 rounded-xl border border-blue-100 bg-white px-3 py-2.5 text-left text-xs leading-relaxed text-gray-700 shadow-lg shadow-blue-900/10 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:shadow-black/40 sm:w-80"
        >
          <span className="block font-semibold text-blue-900 dark:text-blue-200">{title}</span>
          <span className="mt-1 block">{children}</span>
        </span>
      ) : null}
    </span>
  );
}

const boxBase =
  'rounded-2xl border-2 px-4 py-4 transition-all duration-200 dark:bg-gray-900/40';
const boxInactive =
  'border-blue-100/80 bg-gradient-to-br from-white to-blue-50/30 shadow-sm dark:border-gray-700 dark:from-gray-900/80 dark:to-indigo-950/20';
const boxActive =
  'border-fuchsia-400 bg-gradient-to-br from-fuchsia-50/90 via-white to-indigo-50/80 shadow-md shadow-fuchsia-900/10 ring-2 ring-fuchsia-200/70 dark:border-fuchsia-500 dark:from-fuchsia-950/25 dark:via-gray-900 dark:to-indigo-950/30 dark:ring-fuchsia-800/50';

export default function FreelancerCalculatorPage() {
  const [copyrightTransfer, setCopyrightTransfer] = useState(true);
  const [payoutInput, setPayoutInput] = useState(() => formatAmountInput(2500));
  const [invoiceNetInput, setInvoiceNetInput] = useState(() => formatAmountInput(2885.03));
  const [driver, setDriver] = useState('payout');
  /** true = „Twój klient zapłaci” po lewej, „Ty zarobisz” po prawej */
  const [layoutSwapped, setLayoutSwapped] = useState(false);

  const pitRate = copyrightTransfer ? PIT_RATE_COPYRIGHT : PIT_RATE_STANDARD;

  useEffect(() => {
    if (driver === 'payout') {
      const p = parseAmount(payoutInput);
      if (p != null) {
        setInvoiceNetInput(formatAmountInput(sumToInvoiceNet(p, pitRate)));
      }
    } else {
      const inv = parseAmount(invoiceNetInput);
      if (inv != null) {
        setPayoutInput(formatAmountInput(payoutFromInvoiceNet(inv, pitRate)));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- tylko przy zmianie stawek / opcji prawa autorskiego
  }, [copyrightTransfer, pitRate]);

  const { pit, serviceFee, vat, gross } = useMemo(() => {
    const p = parseAmount(payoutInput) ?? 0;
    const inv = parseAmount(invoiceNetInput) ?? 0;
    const pitAmt = p * pitRate;
    const fee = p * SERVICE_FEE_ON_PAYOUT;
    const vatAmt = inv * VAT_RATE;
    const g = inv + vatAmt;
    return {
      pit: pitAmt,
      serviceFee: fee,
      vat: vatAmt,
      gross: g,
    };
  }, [payoutInput, invoiceNetInput, pitRate]);

  const onPayoutChange = (e) => {
    const v = e.target.value;
    setPayoutInput(v);
    setDriver('payout');
    const p = parseAmount(v);
    if (p != null) {
      setInvoiceNetInput(formatAmountInput(sumToInvoiceNet(p, pitRate)));
    }
  };

  const onInvoiceNetChange = (e) => {
    const v = e.target.value;
    setInvoiceNetInput(v);
    setDriver('invoiceNet');
    const inv = parseAmount(v);
    if (inv != null) {
      setPayoutInput(formatAmountInput(payoutFromInvoiceNet(inv, pitRate)));
    }
  };

  const onPayoutBlur = () => {
    const p = parseAmount(payoutInput);
    if (p != null) setPayoutInput(formatAmountInput(p));
  };

  const onInvoiceBlur = () => {
    const inv = parseAmount(invoiceNetInput);
    if (inv != null) setInvoiceNetInput(formatAmountInput(inv));
  };

  const toggleLayout = () => {
    setLayoutSwapped((s) => !s);
  };

  const payoutColumn = (
    <div className="min-w-0 flex-1 space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-blue-700/90 dark:text-blue-300/90">
        Ty zarobisz na rękę
      </p>
      <div className={`${boxBase} ${driver === 'payout' ? boxActive : boxInactive}`}>
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Wartość wypłaty</p>
        <div className="mt-2 flex items-center gap-2">
          <Input
            type="text"
            inputMode="decimal"
            value={payoutInput}
            onChange={onPayoutChange}
            onBlur={onPayoutBlur}
            onFocus={() => setDriver('payout')}
            className="h-12 min-w-0 flex-1 border-0 bg-transparent p-0 text-2xl font-bold tabular-nums text-gray-900 shadow-none focus-visible:ring-0 dark:text-gray-50 sm:text-3xl"
            aria-label="Kwota wypłaty na rękę"
          />
          <span className="flex shrink-0 items-center gap-1.5 rounded-xl border border-blue-100 bg-white px-2.5 py-1.5 text-xs font-bold text-blue-800 shadow-sm dark:border-gray-600 dark:bg-gray-800 dark:text-blue-200">
            <span aria-hidden>🇵🇱</span> PLN
          </span>
        </div>
      </div>
    </div>
  );

  const invoiceColumn = (
    <div className="min-w-0 flex-1 space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700/90 dark:text-indigo-300/90">
        Twój klient zapłaci
      </p>
      <div className={`${boxBase} ${driver === 'invoiceNet' ? boxActive : boxInactive}`}>
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Kwota na fakturze (wartość zlecenia)</p>
        <div className="mt-2 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Input
              type="text"
              inputMode="decimal"
              value={invoiceNetInput}
              onChange={onInvoiceNetChange}
              onBlur={onInvoiceBlur}
              onFocus={() => setDriver('invoiceNet')}
              className="h-12 min-w-0 flex-1 border-0 bg-transparent p-0 text-2xl font-bold tabular-nums text-gray-900 shadow-none focus-visible:ring-0 dark:text-gray-50 sm:text-3xl"
              aria-label="Wartość netto zlecenia na fakturze"
            />
            <span className="flex shrink-0 items-center gap-1.5 rounded-xl border border-indigo-100 bg-white px-2.5 py-1.5 text-xs font-bold text-indigo-800 shadow-sm dark:border-gray-600 dark:bg-gray-800 dark:text-indigo-200">
              <span aria-hidden>🇵🇱</span> PLN
            </span>
          </div>
          <p className="text-xs font-semibold text-indigo-600/80 dark:text-indigo-400/90">+ VAT ({Math.round(VAT_RATE * 100)}%)</p>
        </div>
      </div>
    </div>
  );

  const layoutSwapControl = (
    <div className="flex w-full shrink-0 flex-col items-stretch justify-center gap-2 lg:w-auto lg:min-w-[7.5rem] lg:max-w-[9rem] lg:px-1">
      <span className="mx-auto hidden h-10 w-px bg-gradient-to-b from-transparent via-blue-200 to-transparent dark:via-gray-600 lg:block" aria-hidden />
      <button
        type="button"
        onClick={toggleLayout}
        className="group flex w-full flex-row items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-blue-200/90 bg-gradient-to-b from-white to-blue-50/60 px-3 py-2.5 text-left shadow-sm transition hover:border-fuchsia-300 hover:from-fuchsia-50/40 hover:to-indigo-50/50 hover:shadow-md dark:border-gray-600 dark:from-gray-900 dark:to-gray-900 dark:hover:border-fuchsia-600/60 dark:hover:to-fuchsia-950/20 lg:flex-col lg:py-4"
        aria-label={layoutSwapped ? 'Przywróć układ: najpierw wypłata, potem faktura' : 'Zamień miejscami: najpierw faktura, potem wypłata'}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 transition group-hover:bg-fuchsia-100 group-hover:text-fuchsia-800 dark:bg-blue-950/80 dark:text-blue-200 dark:group-hover:bg-fuchsia-950/50 dark:group-hover:text-fuchsia-200">
          <ArrowDownUp className="h-4 w-4" strokeWidth={2.25} />
        </span>
        <span className="text-center text-[11px] font-bold uppercase leading-tight tracking-wide text-blue-900 dark:text-blue-100">
          Zamień
          <br className="hidden sm:block" />
          <span className="sm:hidden"> </span>
          miejscami
        </span>
      </button>
      <span className="mx-auto hidden h-10 w-px bg-gradient-to-b from-transparent via-blue-200 to-transparent dark:via-gray-600 lg:block" aria-hidden />
    </div>
  );

  return (
    <PanelLayout role="freelancer">
      <div className="mx-auto w-full max-w-4xl space-y-6 pb-6">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-fuchsia-700 bg-clip-text text-transparent dark:from-blue-300 dark:to-fuchsia-300">
            Kalkulator wynagrodzenia
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-2xl">
            Szacunek kwoty netto na fakturze i wypłaty na rękę — z PIT, VAT i opłatą serwisową przy wypłacie.
          </p>
        </div>

        <Card className="overflow-visible border border-fuchsia-100/80 bg-white shadow-sm dark:border-fuchsia-900/40 dark:bg-gray-950/50">
          <CardContent className="space-y-8 p-5 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:gap-4">
              {!layoutSwapped ? (
                <>
                  {payoutColumn}
                  {layoutSwapControl}
                  {invoiceColumn}
                </>
              ) : (
                <>
                  {invoiceColumn}
                  {layoutSwapControl}
                  {payoutColumn}
                </>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-blue-100/80 bg-blue-50/40 px-4 py-3 dark:border-gray-700 dark:bg-gray-900/50">
              <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-gray-800 dark:text-gray-200">
                <input
                  type="checkbox"
                  checked={copyrightTransfer}
                  onChange={(e) => setCopyrightTransfer(e.target.checked)}
                  className="h-4 w-4 rounded border-blue-300 text-fuchsia-600 focus:ring-fuchsia-500 focus:ring-offset-1 dark:border-gray-600 dark:text-fuchsia-500"
                />
                Przekazanie praw autorskich
              </label>
              <InfoTip title="Przekazanie praw autorskich">
                Gdy przenosisz majątkowe prawa autorskie lub udzielasz licencji, w praktyce bywa niższe obciążenie podatkiem niż przy
                typowej usłudze „jak każda inna”. Dotyczy to prac o wyraźnym, indywidualnym charakterze — nie zastępuje opinii
                księgowej.
              </InfoTip>
            </div>

            <div>
              <div className="mb-4 flex items-center gap-2">
                <span className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-200 to-transparent dark:via-gray-700" />
                <h2 className="shrink-0 text-sm font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                  Co składa się na cenę?
                </h2>
                <span className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-200 to-transparent dark:via-gray-700" />
              </div>
              <ul className="grid gap-3 sm:grid-cols-1">
                <li className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-100/70 bg-gradient-to-r from-white to-blue-50/50 px-4 py-4 dark:border-gray-700 dark:from-gray-900/60 dark:to-blue-950/20">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900/50 dark:text-blue-200">
                      1
                    </span>
                    Podatek dochodowy
                    <InfoTip title="Podatek dochodowy">
                      W modelu uproszczonym przyjmujemy zryczałtowaną część od kwoty przeznaczonej na Twoją wypłatę. Rzeczywisty
                      podatek zależy od formy umowy, skali i bieżących przepisów — traktuj tę wartość jako szkic, nie jako rozliczenie
                      urzędowe.
                    </InfoTip>
                  </span>
                  <span className="text-lg font-bold tabular-nums text-gray-900 dark:text-gray-100">{formatPln(pit)}</span>
                </li>
                <li className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-indigo-100/70 bg-gradient-to-r from-white to-indigo-50/40 px-4 py-4 dark:border-gray-700 dark:from-gray-900/60 dark:to-indigo-950/25">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-200">
                      2
                    </span>
                    Opłata serwisowa
                    <InfoTip title="Opłata serwisowa">
                      Prowizja od kwoty wypłaty ({Math.round(SERVICE_FEE_ON_PAYOUT * 100)}%). W rzeczywistej ofercie może obejmować
                      m.in. obsługę dokumentów i rozliczeń — dokładny zakres zawsze wynika z regulaminu i umowy.
                    </InfoTip>
                  </span>
                  <span className="text-lg font-bold tabular-nums text-gray-900 dark:text-gray-100">{formatPln(serviceFee)}</span>
                </li>
                <li className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-fuchsia-100/80 bg-gradient-to-r from-white via-fuchsia-50/30 to-indigo-50/40 px-4 py-4 dark:border-gray-700 dark:from-gray-900/60 dark:via-fuchsia-950/15 dark:to-indigo-950/20">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-fuchsia-100 text-xs font-bold text-fuchsia-800 dark:bg-fuchsia-900/40 dark:text-fuchsia-200">
                      3
                    </span>
                    VAT
                    <InfoTip title="VAT (płatność brutto)">
                      Naliczany od wartości netto na fakturze ({Math.round(VAT_RATE * 100)}%). Kwota brutto to netto faktury plus VAT —
                      orientacyjnie tyle zleceniodawca przekazuje przy zapłacie, jeśli stawką jest {Math.round(VAT_RATE * 100)}%.
                    </InfoTip>
                  </span>
                  <span className="flex flex-col items-end gap-0.5">
                    <span className="text-lg font-bold tabular-nums text-gray-900 dark:text-gray-100">{formatPln(vat)}</span>
                    <span className="text-xs font-medium text-fuchsia-700/90 dark:text-fuchsia-400/90">
                      brutto: {formatPln(gross)}
                    </span>
                  </span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </PanelLayout>
  );
}
