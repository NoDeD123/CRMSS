import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { EU_VAT_COUNTRIES, normalizeNationalVatPart, validateNationalVatPart } from '@/lib/euVat';
import {
  SERVICE_FEE_ON_PAYOUT,
  PIT_RATE_COPYRIGHT,
  PIT_RATE_STANDARD,
  formatPln,
  formatAmountInput,
  parseAmount,
  payoutFromInvoiceNet,
} from '@/lib/freelancerPayoutModel';
import { useBeneficiaryPanelLocale } from '@/contexts/BeneficiaryPanelLocale';

const INVOICE_LINE_VAT_PCT = 23;
const INVOICE_LINE_VAT_MULTIPLIER = 1 + INVOICE_LINE_VAT_PCT / 100;

function roundMoney(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function grossToInvoiceNet(gross) {
  return roundMoney(gross / INVOICE_LINE_VAT_MULTIPLIER);
}

export default function NewInvoiceContent({ panelBase }) {
  const router = useRouter();
  const { lng, tp } = useBeneficiaryPanelLocale();
  const dateLocale = lng === 'en' ? 'en-GB' : 'pl-PL';
  const invoicesPath = `${panelBase}/invoices`;
  const isFreelancerPanel = typeof panelBase === 'string' && panelBase.includes('freelancer');
  const todayIso = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [items, setItems] = useState([
    { id: 1, name: '', quantity: 1, unit: 'szt.', price: 0, vat: INVOICE_LINE_VAT_PCT },
  ]);

  const [buyerData, setBuyerData] = useState({
    vatCountryCode: 'PL',
    name: '',
    nip: '',
    email: '',
    street: '',
    zip: '',
    city: '',
  });

  const [paymentTermDays, setPaymentTermDays] = useState(7);

  const [copyrightTransfer, setCopyrightTransfer] = useState(true);
  const [invoiceGrossInput, setInvoiceGrossInput] = useState('');
  const [syncInvoiceGrossFromLines, setSyncInvoiceGrossFromLines] = useState(true);

  const getCalculatedDate = (days) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toLocaleDateString(dateLocale);
  };

  const addItem = () => {
    setSyncInvoiceGrossFromLines(true);
    setItems([
      ...items,
      { id: Date.now(), name: '', quantity: 1, unit: 'szt.', price: 0, vat: INVOICE_LINE_VAT_PCT },
    ]);
  };

  const removeItem = (id) => {
    if (items.length > 1) {
      setSyncInvoiceGrossFromLines(true);
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const applyInvoiceGrossToItems = (gross) => {
    const targetNet = grossToInvoiceNet(gross);

    setItems((prevItems) => {
      if (prevItems.length === 0) {
        return [{ id: Date.now(), name: '', quantity: 1, unit: 'szt.', price: targetNet, vat: INVOICE_LINE_VAT_PCT }];
      }

      const currentNet = prevItems.reduce((sum, item) => {
        const quantity = Number(item.quantity) > 0 ? Number(item.quantity) : 1;
        const price = Number(item.price) || 0;
        return sum + quantity * price;
      }, 0);

      if (currentNet <= 0) {
        const firstQuantity = Number(prevItems[0].quantity) > 0 ? Number(prevItems[0].quantity) : 1;
        return prevItems.map((item, index) =>
          index === 0
            ? {
                ...item,
                quantity: firstQuantity,
                price: roundMoney(targetNet / firstQuantity),
                vat: INVOICE_LINE_VAT_PCT,
              }
            : { ...item, vat: INVOICE_LINE_VAT_PCT }
        );
      }

      const lastPricedIndex = prevItems.reduce((lastIndex, item, index) => {
        const quantity = Number(item.quantity) > 0 ? Number(item.quantity) : 1;
        const price = Number(item.price) || 0;
        return quantity * price > 0 ? index : lastIndex;
      }, 0);

      let remainingNet = targetNet;
      return prevItems.map((item, index) => {
        const quantity = Number(item.quantity) > 0 ? Number(item.quantity) : 1;
        const price = Number(item.price) || 0;
        const rowNet =
          index === lastPricedIndex ? remainingNet : roundMoney(targetNet * ((quantity * price) / currentNet));

        remainingNet = roundMoney(remainingNet - rowNet);

        return {
          ...item,
          quantity,
          price: roundMoney(rowNet / quantity),
          vat: INVOICE_LINE_VAT_PCT,
        };
      });
    });
  };

  const [loading, setLoading] = useState(false);

  const totalNet = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const totalVat = items.reduce(
    (sum, item) => sum + item.quantity * item.price * (INVOICE_LINE_VAT_PCT / 100),
    0
  );
  const totalGross = totalNet + totalVat;

  useEffect(() => {
    if (syncInvoiceGrossFromLines) {
      setInvoiceGrossInput(formatAmountInput(totalGross));
    }
  }, [totalGross, syncInvoiceGrossFromLines]);

  const parsedInvoiceGross = useMemo(() => parseAmount(invoiceGrossInput), [invoiceGrossInput]);
  const effectiveInvoiceGross = parsedInvoiceGross != null ? parsedInvoiceGross : totalGross;
  const declaredGrossDiffersFromLines =
    parsedInvoiceGross != null && Math.abs(parsedInvoiceGross - totalGross) >= 0.01;

  const pitRate = copyrightTransfer ? PIT_RATE_COPYRIGHT : PIT_RATE_STANDARD;
  const estimatedPayout =
    isFreelancerPanel && totalNet > 0 ? payoutFromInvoiceNet(totalNet, pitRate) : 0;
  const pitEstimate = estimatedPayout * pitRate;
  const serviceFeeEstimate = estimatedPayout * SERVICE_FEE_ON_PAYOUT;

  const nationalVatOk = validateNationalVatPart(
    buyerData.vatCountryCode,
    normalizeNationalVatPart(buyerData.vatCountryCode, buyerData.nip)
  ).ok;

  const invoiceGrossOk = effectiveInvoiceGross > 0.005;

  const isFormValid =
    buyerData.name.trim().length > 0 &&
    nationalVatOk &&
    buyerData.email.trim().length > 3 &&
    buyerData.street.trim().length > 0 &&
    buyerData.zip.trim().length >= 6 &&
    buyerData.city.trim().length > 0 &&
    items.length > 0 &&
    invoiceGrossOk &&
    items.every(
      (item) =>
        item.name.trim().length > 0 &&
        item.quantity > 0 &&
        String(item.price).trim().length > 0
    );

  const handleGenerateProforma = async () => {
    if (!isFormValid) {
      toast.error(tp('invoicesNew.fillBuyerAndLines'));
      return;
    }

    setLoading(true);
    try {
      const payload = {
        items: items.map((row) => ({ ...row, vat: INVOICE_LINE_VAT_PCT })),
        buyerName: buyerData.name,
        buyerVatCountryCode: buyerData.vatCountryCode,
        buyerVatNationalNumber: normalizeNationalVatPart(buyerData.vatCountryCode, buyerData.nip),
        buyerEmail: buyerData.email,
        buyerStreet: buyerData.street,
        buyerZip: buyerData.zip,
        buyerCity: buyerData.city,
        paymentTermDays,
        declaredInvoiceGrossPln: declaredGrossDiffersFromLines ? parsedInvoiceGross : null,
        ...(isFreelancerPanel ? { freelancerCopyrightTransfer: copyrightTransfer } : {}),
      };

      const res = await fetch('/api/user/invoices/generate-proforma', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let message = tp('invoicesNew.generateFail');
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
          try {
            const errJson = await res.json();
            message = errJson.error || errJson.message || message;
          } catch {
            /* ignore */
          }
        }
        toast.error(message);
        return;
      }

      await res.blob();

      toast.success(tp('invoicesNew.proformaSaved'));
      router.push(invoicesPath);
    } catch (err) {
      console.error(err);
      toast.error(err?.message || tp('invoicesNew.generateFail'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Link href={invoicesPath}>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-blue-50 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1
            className={`text-2xl font-bold ${isFreelancerPanel ? 'bg-gradient-to-r from-blue-700 to-fuchsia-700 bg-clip-text text-transparent dark:from-blue-300 dark:to-fuchsia-300' : ''}`}
          >
            {isFreelancerPanel ? tp('invoicesNew.titleFreelancer') : tp('invoicesNew.titleBeneficiary')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">{tp('invoicesNew.subtitle')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm border border-blue-100 dark:border-gray-800 dark:bg-gray-900/40">
            <CardHeader>
              <CardTitle className="text-lg">{tp('invoicesNew.buyerTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label>{tp('invoicesNew.companyName')}</Label>
                  <Input
                    placeholder={tp('invoicesNew.companyNamePh')}
                    value={buyerData.name}
                    onChange={(e) => setBuyerData({ ...buyerData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>{tp('invoicesNew.vatId')}</Label>
                  <div className="flex max-w-xl flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                    <select
                      className="h-10 w-full shrink-0 rounded-lg border border-input bg-background px-3 text-sm text-foreground transition-colors outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:w-48 dark:bg-input/30 dark:border-input"
                      value={buyerData.vatCountryCode}
                      onChange={(e) => {
                        const code = e.target.value;
                        setBuyerData((prev) => ({
                          ...prev,
                          vatCountryCode: code,
                          nip: normalizeNationalVatPart(code, prev.nip),
                        }));
                      }}
                    >
                      {EU_VAT_COUNTRIES.map(({ code, label }) => (
                        <option key={code} value={code}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <Input
                      className="h-10 flex-1 min-w-0 px-3 py-2 text-sm"
                      placeholder={
                        buyerData.vatCountryCode === 'PL'
                          ? tp('invoicesNew.nipPhPl')
                          : tp('invoicesNew.nipPhEu')
                      }
                      maxLength={buyerData.vatCountryCode === 'PL' ? 10 : 14}
                      inputMode={buyerData.vatCountryCode === 'PL' ? 'numeric' : 'text'}
                      autoComplete="off"
                      spellCheck={false}
                      value={buyerData.nip}
                      onChange={(e) =>
                        setBuyerData({
                          ...buyerData,
                          nip: normalizeNationalVatPart(buyerData.vatCountryCode, e.target.value),
                        })
                      }
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{tp('invoicesNew.vatHint')}</p>
                </div>
                <div className="space-y-2">
                  <Label>{tp('invoicesNew.buyerEmail')}</Label>
                  <Input
                    type="email"
                    placeholder={tp('invoicesNew.buyerEmailPh')}
                    value={buyerData.email}
                    onChange={(e) => setBuyerData({ ...buyerData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{tp('invoicesNew.street')}</Label>
                  <Input
                    placeholder={tp('invoicesNew.streetPh')}
                    value={buyerData.street}
                    onChange={(e) => setBuyerData({ ...buyerData, street: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{tp('invoicesNew.zip')}</Label>
                  <Input
                    placeholder="00-000"
                    maxLength={6}
                    value={buyerData.zip}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, '');
                      if (val.length > 2) {
                        val = `${val.substring(0, 2)}-${val.substring(2, 5)}`;
                      }
                      setBuyerData({ ...buyerData, zip: val });
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{tp('invoicesNew.city')}</Label>
                  <Input
                    placeholder={tp('invoicesNew.cityPh')}
                    value={buyerData.city}
                    onChange={(e) => setBuyerData({ ...buyerData, city: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">{tp('invoicesNew.lineItemsTitle')}</CardTitle>
              <Button
                onClick={addItem}
                size="sm"
                className="h-9 rounded-xl px-4 bg-blue-600 hover:bg-blue-700 text-white dark:text-white shadow-sm"
              >
                <Plus className="mr-2 h-4 w-4" /> {tp('invoicesNew.addLine')}
              </Button>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">{tp('invoicesNew.colService')}</TableHead>
                    <TableHead>{tp('invoicesNew.colQty')}</TableHead>
                    <TableHead>{tp('invoicesNew.colUnit')}</TableHead>
                    <TableHead>{tp('invoicesNew.colNet')}</TableHead>
                    <TableHead className="w-16 whitespace-nowrap text-center">
                      {tp('invoicesNew.colVat')}
                    </TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell className="p-2">
                        <Input
                          placeholder={tp('invoicesNew.servicePh')}
                          value={item.name}
                          onChange={(e) => {
                            const newItems = [...items];
                            newItems[index].name = e.target.value;
                            setItems(newItems);
                          }}
                        />
                      </TableCell>
                      <TableCell className="p-2">
                        <Input
                          type="number"
                          min="1"
                          className="w-20"
                          value={item.quantity}
                          onChange={(e) => {
                            setSyncInvoiceGrossFromLines(true);
                            const newItems = [...items];
                            newItems[index].quantity = parseFloat(e.target.value) || 0;
                            newItems[index].vat = INVOICE_LINE_VAT_PCT;
                            setItems(newItems);
                          }}
                        />
                      </TableCell>
                      <TableCell className="p-2">
                        <select
                          className="h-10 w-full min-w-[4.5rem] rounded-md border border-input bg-background px-2 py-2 text-sm dark:bg-gray-900 dark:border-gray-700"
                          value={item.unit}
                          onChange={(e) => {
                            const newItems = [...items];
                            newItems[index].unit = e.target.value;
                            setItems(newItems);
                          }}
                        >
                          <option value="szt.">{tp('invoicesNew.unitPcs')}</option>
                          <option value="godz.">{tp('invoicesNew.unitHrs')}</option>
                          <option value="usł.">{tp('invoicesNew.unitSrv')}</option>
                        </select>
                      </TableCell>
                      <TableCell className="p-2">
                        <Input
                          type="number"
                          placeholder="0.00"
                          className="w-28"
                          value={item.price || ''}
                          onChange={(e) => {
                            setSyncInvoiceGrossFromLines(true);
                            const newItems = [...items];
                            newItems[index].price = parseFloat(e.target.value) || 0;
                            newItems[index].vat = INVOICE_LINE_VAT_PCT;
                            setItems(newItems);
                          }}
                        />
                      </TableCell>
                      <TableCell className="p-2 text-center align-middle">
                        <span className="inline-flex h-10 min-w-[3rem] items-center justify-center rounded-md border border-input bg-muted/40 px-2 text-sm font-medium tabular-nums text-muted-foreground dark:bg-gray-900/60 dark:border-gray-700">
                          {INVOICE_LINE_VAT_PCT}%
                        </span>
                      </TableCell>
                      <TableCell className="p-2 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeItem(item.id)}
                          disabled={items.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-sm border border-blue-100 dark:border-gray-800 dark:bg-gray-900/40">
            <CardHeader>
              <CardTitle className="text-lg">{tp('invoicesNew.docDetailsTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{tp('invoicesNew.invoiceNumberLabel')}</Label>
                <Input
                  value={tp('invoicesNew.invoiceNumberAutoValue')}
                  disabled
                  readOnly
                  className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 font-semibold"
                />
              </div>
              <div className="space-y-2">
                <Label>{tp('invoicesNew.issueDate')}</Label>
                <Input type="date" defaultValue={todayIso} />
              </div>
              <div className="space-y-2">
                <Label>{tp('invoicesNew.saleDate')}</Label>
                <Input type="date" defaultValue={todayIso} />
              </div>
              <div className="space-y-2">
                <Label>{tp('invoicesNew.paymentDue')}</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-gray-900 dark:border-gray-700 px-3 py-2 text-sm ring-offset-background"
                  value={paymentTermDays}
                  onChange={(e) => setPaymentTermDays(parseInt(e.target.value, 10))}
                >
                  <option value={7}>{tp('invoicesNew.paymentDays', { days: 7, date: getCalculatedDate(7) })}</option>
                  <option value={14}>{tp('invoicesNew.paymentDays', { days: 14, date: getCalculatedDate(14) })}</option>
                  <option value={30}>{tp('invoicesNew.paymentDays', { days: 30, date: getCalculatedDate(30) })}</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-50 dark:bg-gray-900/60 border-2 border-blue-100 dark:border-blue-900/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">{tp('invoicesNew.summaryTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {isFreelancerPanel ? (
                <div className="flex flex-wrap items-center gap-2 rounded-lg border border-blue-100/90 bg-blue-50/50 px-3 py-2.5 dark:border-gray-700 dark:bg-gray-900/50">
                  <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-800 dark:text-gray-200">
                    <input
                      type="checkbox"
                      checked={copyrightTransfer}
                      onChange={(e) => setCopyrightTransfer(e.target.checked)}
                      className="h-4 w-4 rounded border-blue-300 text-fuchsia-600 focus:ring-fuchsia-500 focus:ring-offset-1 dark:border-gray-600 dark:text-fuchsia-500"
                    />
                    {tp('invoicesNew.copyrightTransfer')}
                  </label>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {tp('invoicesNew.copyrightHintBefore')}{' '}
                    <Link
                      href="/panel/freelancer/calculator"
                      className="font-medium text-fuchsia-700 underline underline-offset-2 hover:text-fuchsia-900 dark:text-fuchsia-400 dark:hover:text-fuchsia-300"
                    >
                      {tp('invoicesNew.copyrightCalculator')}
                    </Link>{' '}
                    {tp('invoicesNew.copyrightHintAfter')}
                  </span>
                </div>
              ) : null}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{tp('invoicesNew.netTotal')}</span>
                <span className="font-medium tabular-nums">{totalNet.toFixed(2)} PLN</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{tp('invoicesNew.vatAmount', { pct: INVOICE_LINE_VAT_PCT })}</span>
                <span className="font-medium tabular-nums">{totalVat.toFixed(2)} PLN</span>
              </div>
              <div className="flex justify-between border-t pt-2 mt-1 text-sm">
                <span className="font-medium text-gray-600 dark:text-gray-400">{tp('invoicesNew.grossFromLines')}</span>
                <span className="font-semibold tabular-nums">{totalGross.toFixed(2)} PLN</span>
              </div>
              <div className="space-y-2 rounded-lg border border-dashed border-blue-200/90 bg-white/80 px-3 py-3 dark:border-gray-600 dark:bg-gray-900/40">
                <div className="flex flex-wrap items-end justify-between gap-2">
                  <Label className="text-sm font-medium">{tp('invoicesNew.grossToPay')}</Label>
                  <button
                    type="button"
                    onClick={() => {
                      setSyncInvoiceGrossFromLines(true);
                      setInvoiceGrossInput(formatAmountInput(totalGross));
                    }}
                    className="text-xs font-medium text-blue-600 underline-offset-2 hover:underline dark:text-blue-400"
                  >
                    {tp('invoicesNew.recalcFromLines')}
                  </button>
                </div>
                <Input
                  type="text"
                  inputMode="decimal"
                  className="max-w-[16rem] font-medium tabular-nums"
                  value={invoiceGrossInput}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSyncInvoiceGrossFromLines(false);
                    setInvoiceGrossInput(value);

                    const parsed = parseAmount(value);
                    if (parsed != null) {
                      applyInvoiceGrossToItems(parsed);
                    }
                  }}
                  onBlur={() => {
                    const p = parseAmount(invoiceGrossInput);
                    if (p != null) {
                      applyInvoiceGrossToItems(p);
                      setInvoiceGrossInput(formatAmountInput(p));
                      setSyncInvoiceGrossFromLines(true);
                    }
                  }}
                  placeholder={formatAmountInput(totalGross)}
                />
                {declaredGrossDiffersFromLines ? (
                  <p className="text-xs text-amber-700 dark:text-amber-400/90">{tp('invoicesNew.grossRecalcNote')}</p>
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {tp('invoicesNew.grossHelp', { pct: INVOICE_LINE_VAT_PCT })}
                  </p>
                )}
              </div>
              <div className="flex justify-between border-t pt-2 border-blue-100/80 dark:border-gray-700">
                <span className="font-bold text-lg">{tp('invoicesNew.totalDue')}</span>
                <span className="font-bold text-lg text-blue-600 dark:text-blue-300 tabular-nums">
                  {effectiveInvoiceGross.toFixed(2)} PLN
                </span>
              </div>
              {isFreelancerPanel && totalNet > 0 ? (
                <div className="rounded-lg border border-fuchsia-100/90 bg-gradient-to-br from-fuchsia-50/60 to-white px-3 py-2.5 dark:border-fuchsia-900/40 dark:from-fuchsia-950/20 dark:to-gray-900/40">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{tp('invoicesNew.estNet')}</span>
                    <span className="font-bold tabular-nums text-fuchsia-800 dark:text-fuchsia-300">
                      {formatPln(estimatedPayout)}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[11px] leading-snug text-gray-500 dark:text-gray-400">
                    {tp('invoicesNew.estDisclaimer', {
                      pit: formatPln(pitEstimate),
                      fee: formatPln(serviceFeeEstimate),
                    })}
                  </p>
                </div>
              ) : null}
            </CardContent>
            <CardFooter className="flex-col gap-3">
              <Button
                onClick={handleGenerateProforma}
                disabled={loading || !isFormValid}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:text-white h-12 text-md shadow-sm"
              >
                <Send className="mr-2 h-5 w-5" />{' '}
                {loading ? tp('invoicesNew.submitting') : tp('invoicesNew.submit')}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
