/**
 * Kraje UE — kod ISO 3166-1 alpha-2 oraz prefiks VAT (VIES).
 * Grecja: ISO GR, na fakturze prefiks EL.
 */
export const VAT_PREFIX_BY_ISO = {
  AT: 'AT',
  BE: 'BE',
  BG: 'BG',
  HR: 'HR',
  CY: 'CY',
  CZ: 'CZ',
  DK: 'DK',
  EE: 'EE',
  FI: 'FI',
  FR: 'FR',
  DE: 'DE',
  GR: 'EL',
  HU: 'HU',
  IE: 'IE',
  IT: 'IT',
  LV: 'LV',
  LT: 'LT',
  LU: 'LU',
  MT: 'MT',
  NL: 'NL',
  PL: 'PL',
  PT: 'PT',
  RO: 'RO',
  SK: 'SK',
  SI: 'SI',
  ES: 'ES',
  SE: 'SE'
};

export const EU_VAT_ISO_CODES = new Set(Object.keys(VAT_PREFIX_BY_ISO));

/** PL na górze, potem alfabetycznie po kodzie. */
export const EU_VAT_COUNTRIES = [
  { code: 'PL', label: 'PL — Polska' },
  { code: 'AT', label: 'AT — Austria' },
  { code: 'BE', label: 'BE — Belgia' },
  { code: 'BG', label: 'BG — Bułgaria' },
  { code: 'HR', label: 'HR — Chorwacja' },
  { code: 'CY', label: 'CY — Cypr' },
  { code: 'CZ', label: 'CZ — Czechy' },
  { code: 'DK', label: 'DK — Dania' },
  { code: 'EE', label: 'EE — Estonia' },
  { code: 'FI', label: 'FI — Finlandia' },
  { code: 'FR', label: 'FR — Francja' },
  { code: 'DE', label: 'DE — Niemcy' },
  { code: 'GR', label: 'GR — Grecja (VAT: EL)' },
  { code: 'HU', label: 'HU — Węgry' },
  { code: 'IE', label: 'IE — Irlandia' },
  { code: 'IT', label: 'IT — Włochy' },
  { code: 'LV', label: 'LV — Łotwa' },
  { code: 'LT', label: 'LT — Litwa' },
  { code: 'LU', label: 'LU — Luksemburg' },
  { code: 'MT', label: 'MT — Malta' },
  { code: 'NL', label: 'NL — Holandia' },
  { code: 'PT', label: 'PT — Portugalia' },
  { code: 'RO', label: 'RO — Rumunia' },
  { code: 'SK', label: 'SK — Słowacja' },
  { code: 'SI', label: 'SI — Słowenia' },
  { code: 'ES', label: 'ES — Hiszpania' },
  { code: 'SE', label: 'SE — Szwecja' }
];

export function normalizeNationalVatPart(iso, raw) {
  const code = String(iso || '').toUpperCase();
  if (code === 'PL') {
    return String(raw || '').replace(/\D/g, '').slice(0, 10);
  }
  return String(raw || '')
    .replace(/[^A-Za-z0-9]/g, '')
    .toUpperCase()
    .slice(0, 14);
}

export function validateNationalVatPart(iso, national) {
  const code = String(iso || '').toUpperCase();
  if (!EU_VAT_ISO_CODES.has(code)) {
    return { ok: false, error: 'Wybierz kraj z listy UE.' };
  }
  const n = national;
  if (code === 'PL') {
    if (!/^\d{10}$/.test(n)) {
      return { ok: false, error: 'Polski NIP: dokładnie 10 cyfr (bez prefiksu PL).' };
    }
    return { ok: true };
  }
  if (!/^[A-Z0-9]{4,14}$/.test(n)) {
    return {
      ok: false,
      error: 'Numer identyfikacyjny VAT: 4–14 znaków (bez kodu kraju, np. dla DE tylko cyfry).'
    };
  }
  return { ok: true };
}

export function buildFullEuVatId(iso, nationalPart) {
  const code = String(iso || '').toUpperCase();
  const prefix = VAT_PREFIX_BY_ISO[code];
  if (!prefix || !nationalPart) return '';
  return prefix + nationalPart;
}
