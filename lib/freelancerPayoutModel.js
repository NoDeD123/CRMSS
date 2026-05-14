/**
 * Model wypłaty freelancera — ten sam co na stronie kalkulatora.
 * Opłata serwisowa od kwoty wypłaty; zryczałtowany PIT od wypłaty;
 * VAT na fakturze liczony osobno od pozycji.
 */
export const SERVICE_FEE_ON_PAYOUT = 0.09;
export const VAT_RATE = 0.23;
export const PIT_RATE_STANDARD = 0.106;
export const PIT_RATE_COPYRIGHT = 0.064;

export function formatPln(value) {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

export function formatAmountInput(n) {
  if (!Number.isFinite(n) || n < 0) return '';
  return new Intl.NumberFormat('pl-PL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(n);
}

export function parseAmount(raw) {
  const s = String(raw).replace(/\s/g, '').replace(',', '.');
  const n = Number(s);
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

export function sumToInvoiceNet(payout, pitRate) {
  return payout * (1 + pitRate + SERVICE_FEE_ON_PAYOUT);
}

export function payoutFromInvoiceNet(invoiceNet, pitRate) {
  const d = 1 + pitRate + SERVICE_FEE_ON_PAYOUT;
  if (d <= 0) return 0;
  return invoiceNet / d;
}
