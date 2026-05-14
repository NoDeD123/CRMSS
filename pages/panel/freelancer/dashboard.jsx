import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PanelLayout from '@/components/Layout/PanelLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Laptop,
  Mail,
  MailCheck,
  Loader2,
  ShieldAlert,
  Wallet,
  FileText,
  Hourglass,
  CircleCheck,
  Banknote,
  AlertCircle,
  Receipt,
  Calculator,
  ArrowRight,
} from 'lucide-react';

function parseAmount(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function formatPln(value) {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function translateInvoiceStatus(status) {
  switch (status) {
    case 'PENDING':
      return 'Czeka na zatwierdzenie';
    case 'PAID':
      return 'Zapłacone';
    case 'WITHDRAW':
      return 'Wypłacone';
    case 'VERIFIED':
      return 'Zaakceptowana';
    case 'REJECTED':
      return 'Odrzucona';
    default:
      return status;
  }
}

function invoiceTypeLabel(type) {
  if (type === 'SALES') return 'Sprzedaż';
  if (type === 'COST') return 'Koszt';
  return type;
}

function StatCard({ title, value, hint, icon: Icon, className = '' }) {
  return (
    <Card className={`border border-gray-200/90 shadow-sm dark:border-gray-800 ${className}`}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</CardTitle>
        {Icon ? <Icon className="h-4 w-4 text-fuchsia-600 dark:text-fuchsia-400 shrink-0" aria-hidden /> : null}
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">{value}</p>
        {hint ? <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}

export default function FreelancerDashboard() {
  const router = useRouter();
  const [emailVerified, setEmailVerified] = useState(null);
  const [email, setEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState('');
  const [loadError, setLoadError] = useState('');

  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [accountBalance, setAccountBalance] = useState(null);

  const loadStatus = useCallback(async () => {
    setLoadError('');
    try {
      const res = await fetch('/api/freelancer/me', { credentials: 'same-origin' });
      let json = {};
      try {
        json = await res.json();
      } catch {
        setLoadError(
          'Nie udało się odczytać odpowiedzi API (często: Adblock / Privacy Badger na localhost — wyłącz dla tej strony).'
        );
        setEmailVerified(false);
        return;
      }
      if (res.status === 401) {
        router.replace('/panel/freelancer/login');
        return;
      }
      if (res.status === 403) {
        setLoadError(json.message || json.error || 'To nie jest sesja freelancera — zaloguj się przez panel freelancera.');
        setEmailVerified(false);
        return;
      }
      if (!res.ok) {
        setLoadError(json.message || json.error || 'Brak dostępu');
        setEmailVerified(false);
        return;
      }
      const payload = json.data;
      setEmailVerified(Boolean(payload?.emailVerified));
      setEmail(payload?.email || '');
    } catch {
      setLoadError('Nie udało się sprawdzić statusu konta');
      setEmailVerified(false);
    }
  }, [router]);

  const loadDashboardStats = useCallback(async () => {
    setStatsError('');
    setStatsLoading(true);
    try {
      const [invRes, pcRes] = await Promise.all([
        fetch('/api/user/invoices', { credentials: 'same-origin' }),
        fetch('/api/user/paychecks', { credentials: 'same-origin' }),
      ]);

      if (invRes.ok) {
        const invJson = await invRes.json();
        setInvoices(Array.isArray(invJson.data) ? invJson.data : []);
      } else {
        setInvoices([]);
        setStatsError('Nie udało się pobrać listy faktur.');
      }

      if (pcRes.ok) {
        const pcJson = await pcRes.json();
        const bal = pcJson?.data?.accountBalance;
        setAccountBalance(bal != null ? String(bal) : null);
      } else {
        setAccountBalance(null);
      }
    } catch {
      setStatsError('Błąd połączenia przy pobieraniu danych panelu.');
      setInvoices([]);
      setAccountBalance(null);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  useEffect(() => {
    if (router.query.verified === '1') {
      loadStatus();
    }
  }, [router.query.verified, loadStatus]);

  useEffect(() => {
    if (emailVerified === true) {
      loadDashboardStats();
    }
  }, [emailVerified, loadDashboardStats]);

  const metrics = useMemo(() => {
    const sales = invoices.filter((inv) => inv.type === 'SALES');
    const costs = invoices.filter((inv) => inv.type === 'COST');

    const paidLike = sales.filter((inv) => inv.status === 'PAID' || inv.status === 'WITHDRAW');
    const realizedGross = paidLike.reduce((s, inv) => s + parseAmount(inv.grossAmount), 0);

    const awaitingStatuses = new Set(['PENDING', 'VERIFIED']);
    const awaiting = sales.filter((inv) => awaitingStatuses.has(inv.status));
    const awaitingGross = awaiting.reduce((s, inv) => s + parseAmount(inv.grossAmount), 0);

    const paidCount = paidLike.length;
    const rejectedCount = sales.filter((inv) => inv.status === 'REJECTED').length;

    return {
      costCount: costs.length,
      issuedCount: sales.length,
      awaitingCount: awaiting.length,
      awaitingGross,
      paidCount,
      realizedGross,
      rejectedCount,
    };
  }, [invoices]);

  const recentInvoices = useMemo(() => {
    return [...invoices]
      .sort((a, b) => new Date(b.createdAt || b.issueDate) - new Date(a.createdAt || a.issueDate))
      .slice(0, 6);
  }, [invoices]);

  const handleResend = async () => {
    setResendMsg('');
    setResendLoading(true);
    try {
      const res = await fetch('/api/freelancer/resend-mail', {
        method: 'POST',
        credentials: 'same-origin',
      });
      const json = await res.json();
      if (res.ok) {
        setResendMsg('Wysłano wiadomość — sprawdź skrzynkę (także SPAM).');
      } else {
        setResendMsg(json.message || json.error || 'Nie udało się wysłać wiadomości');
      }
    } catch {
      setResendMsg('Błąd połączenia');
    } finally {
      setResendLoading(false);
    }
  };

  const showVerifiedBanner = router.query.verified === '1' && emailVerified === true;
  const showWelcomeOk = router.query.registered === '1' && emailVerified === true;
  const pendingFromQuery = router.query.pendingVerification === '1';

  const balanceDisplay =
    accountBalance != null ? formatPln(parseAmount(accountBalance)) : statsLoading ? '…' : '—';

  return (
    <PanelLayout role="freelancer">
      <div className="space-y-6">
        {loadError && (
          <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
            <CardContent className="pt-6 text-sm text-amber-900 dark:text-amber-200">{loadError}</CardContent>
          </Card>
        )}

        {showVerifiedBanner && (
          <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
            <CardContent className="flex items-center gap-3 pt-6 text-green-900 dark:text-green-200">
              <MailCheck className="h-6 w-6 shrink-0" />
              <p className="text-sm font-medium">Adres e-mail został potwierdzony — masz pełny dostęp do panelu.</p>
            </CardContent>
          </Card>
        )}

        {emailVerified === false && !loadError && (
          <Card className="border-2 border-amber-300 bg-amber-50/90 dark:border-amber-700 dark:bg-amber-950/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-amber-950 dark:text-amber-100">
                <ShieldAlert className="h-6 w-6" />
                {pendingFromQuery ? 'Sprawdź skrzynkę e-mail' : 'Aktywacja konta — potwierdź e-mail'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-amber-950/90 dark:text-amber-100/90 text-sm">
              <p>
                Pełny dostęp do panelu freelancera będzie dostępny po kliknięciu w link aktywacyjny wysłany na adres:{' '}
                <strong className="break-all">{email || '…'}</strong>
              </p>
              <p className="text-xs opacity-90">
                Nie dostałeś wiadomości? Sprawdź folder SPAM lub wyślij ponownie (nie częściej niż raz na 2 minuty).
              </p>
              {resendMsg && <p className="text-sm font-medium text-amber-900 dark:text-amber-50">{resendMsg}</p>}
              <Button
                type="button"
                onClick={handleResend}
                disabled={resendLoading}
                className="bg-fuchsia-700 hover:bg-fuchsia-800 text-white"
              >
                {resendLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Wysyłanie…
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Wyślij ponownie mail aktywacyjny
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {emailVerified === true ? (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">Podsumowanie</h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Faktury sprzedaży — liczby i kwoty z bieżących danych w systemie.
              </p>
            </div>

            <Card className="border border-fuchsia-200/80 bg-gradient-to-r from-fuchsia-50/90 via-white to-indigo-50/80 dark:border-fuchsia-900/40 dark:from-fuchsia-950/20 dark:via-gray-900/40 dark:to-indigo-950/20 shadow-sm">
              <CardContent className="pt-5 pb-5">
                <p className="text-xs font-medium uppercase tracking-wide text-fuchsia-800/90 dark:text-fuchsia-300/90 mb-3">
                  Szybkie przejścia
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link href="/panel/freelancer/calculator">
                    <Button variant="outline" size="sm" className="h-9 border-fuchsia-200 bg-white/80 hover:bg-fuchsia-50 dark:border-fuchsia-900/50 dark:bg-gray-900/60 dark:hover:bg-fuchsia-950/30">
                      <Calculator className="mr-2 h-4 w-4 text-fuchsia-600 dark:text-fuchsia-400" />
                      Kalkulator
                    </Button>
                  </Link>
                  <Link href="/panel/freelancer/paychecks">
                    <Button variant="outline" size="sm" className="h-9 border-fuchsia-200 bg-white/80 hover:bg-fuchsia-50 dark:border-fuchsia-900/50 dark:bg-gray-900/60 dark:hover:bg-fuchsia-950/30">
                      <Banknote className="mr-2 h-4 w-4 text-fuchsia-600 dark:text-fuchsia-400" />
                      Wypłaty
                    </Button>
                  </Link>
                  <Link href="/panel/freelancer/invoices">
                    <Button variant="outline" size="sm" className="h-9 border-fuchsia-200 bg-white/80 hover:bg-fuchsia-50 dark:border-fuchsia-900/50 dark:bg-gray-900/60 dark:hover:bg-fuchsia-950/30">
                      <FileText className="mr-2 h-4 w-4 text-fuchsia-600 dark:text-fuchsia-400" />
                      Lista faktur
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {showWelcomeOk && (
              <p className="text-sm font-medium text-fuchsia-800 dark:text-fuchsia-300">
                Konto jest aktywne — poniżej szybki podgląd rozliczeń.
              </p>
            )}

            {statsError && (
              <Card className="border-amber-200 bg-amber-50/80 dark:bg-amber-950/20">
                <CardContent className="flex items-center gap-2 pt-4 pb-4 text-sm text-amber-900 dark:text-amber-200">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {statsError}
                </CardContent>
              </Card>
            )}

            {statsLoading ? (
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                Ładowanie danych…
              </div>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <StatCard
                title="Twoje zarobki (brutto, opłacone)"
                value={formatPln(metrics.realizedGross)}
                hint="Suma brutto z faktur sprzedaży ze statusem zapłacone / wypłacone."
                icon={Wallet}
              />
              <StatCard
                title="Dostępne saldo"
                value={balanceDisplay}
                hint="Szacunek środków do dyspozycji po uwzględnieniu zleceń wypłat (jak w module wypłat)."
                icon={Banknote}
              />
              <StatCard
                title="Wystawione faktury sprzedaży"
                value={String(metrics.issuedCount)}
                hint="Łączna liczba dokumentów typu sprzedaż (wszystkie statusy)."
                icon={FileText}
              />
              <StatCard
                title="Oczekujące na zapłatę"
                value={String(metrics.awaitingCount)}
                hint={`Łącznie brutto w toku: ${formatPln(metrics.awaitingGross)} (statusy: w przygotowaniu / zaakceptowane).`}
                icon={Hourglass}
              />
              <StatCard
                title="Opłacone"
                value={String(metrics.paidCount)}
                hint="Liczba faktur sprzedaży zakończonych rozliczeniem (zapłacone lub wypłacone)."
                icon={CircleCheck}
              />
              <StatCard
                title="Faktury kosztowe"
                value={String(metrics.costCount)}
                hint="Przesłane dokumenty kosztowe — przydatny skrót pod księgowość."
                icon={Receipt}
              />
            </div>

            {metrics.rejectedCount > 0 && (
              <Card className="border-red-200/80 bg-red-50/50 dark:border-red-900/40 dark:bg-red-950/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-red-900 dark:text-red-200">Faktury odrzucone</CardTitle>
                  <CardDescription className="text-red-800/80 dark:text-red-300/90">
                    {metrics.rejectedCount} — skontaktuj się z koordynatorem, jeśli potrzebujesz wyjaśnień.
                  </CardDescription>
                </CardHeader>
              </Card>
            )}

            <Card className="border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
              <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <CardTitle className="text-base">Ostatnie faktury</CardTitle>
                  <CardDescription>
                    {statsLoading ? 'Ładowanie…' : 'Do 6 ostatnio utworzonych dokumentów — sprzedaż i koszt.'}
                  </CardDescription>
                </div>
                <Link href="/panel/freelancer/invoices" className="shrink-0">
                  <Button variant="ghost" size="sm" className="text-fuchsia-700 hover:text-fuchsia-900 dark:text-fuchsia-400 gap-1">
                    Pełna lista
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="p-0">
                {statsLoading ? (
                  <div className="flex items-center gap-2 p-6 text-sm text-gray-500 dark:text-gray-400">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Wczytywanie faktur…
                  </div>
                ) : recentInvoices.length === 0 ? (
                  <p className="p-6 text-sm text-gray-600 dark:text-gray-400">
                    Nie masz jeszcze faktur w systemie.{' '}
                    <Link
                      href="/panel/freelancer/invoices/new"
                      className="font-medium text-fuchsia-700 underline underline-offset-2 hover:text-fuchsia-900 dark:text-fuchsia-400"
                    >
                      Utwórz pierwszą fakturę
                    </Link>
                    .
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Numer</TableHead>
                          <TableHead>Typ</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead>Kontrahent</TableHead>
                          <TableHead className="text-right">Brutto</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentInvoices.map((inv) => (
                          <TableRow key={inv.id}>
                            <TableCell className="font-mono text-sm whitespace-nowrap">{inv.invoiceNumber}</TableCell>
                            <TableCell className="text-sm">{invoiceTypeLabel(inv.type)}</TableCell>
                            <TableCell className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                              {inv.issueDate ? new Date(inv.issueDate).toLocaleDateString('pl-PL') : '—'}
                            </TableCell>
                            <TableCell className="text-sm max-w-[140px] truncate" title={inv.buyerName}>
                              {inv.buyerName || '—'}
                            </TableCell>
                            <TableCell className="text-right text-sm font-medium whitespace-nowrap">
                              {formatPln(parseAmount(inv.grossAmount))}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="secondary"
                                className={
                                  inv.status === 'REJECTED'
                                    ? 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-200'
                                    : inv.status === 'PAID' || inv.status === 'WITHDRAW'
                                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200'
                                      : inv.status === 'VERIFIED'
                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-200'
                                        : 'bg-amber-100 text-amber-900 dark:bg-amber-950/30 dark:text-amber-100'
                                }
                              >
                                {translateInvoiceStatus(inv.status)}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card
            className={`border-blue-100 dark:border-blue-900/40 ${emailVerified === false && !loadError ? 'pointer-events-none select-none opacity-60' : ''}`}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Laptop className="h-7 w-7 shrink-0 text-fuchsia-600" />
                Panel freelancera
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-gray-600 dark:text-gray-300">
              <p>Witaj w panelu freelancera. Moduły będą sukcesywnie rozszerzane.</p>
              {emailVerified === false && !loadError && (
                <p className="text-sm italic text-gray-500">
                  Zawartość panelu będzie w pełni dostępna po potwierdzeniu adresu e-mail.
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </PanelLayout>
  );
}
