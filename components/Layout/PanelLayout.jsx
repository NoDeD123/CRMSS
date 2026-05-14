import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  LayoutDashboard,
  Files,
  Banknote,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Shield,
  Award,
  UserPlus,
  Receipt,
  ChevronDown,
  Lightbulb,
  Building2,
  Calculator,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import i18n from '@/lib/i18n';
import { BeneficiaryPanelLocaleContext } from '@/contexts/BeneficiaryPanelLocale';

const USER_NAV_STRUCTURE = [
  { id: 'dashboard', href: '/panel/user/dashboard', icon: LayoutDashboard },
  {
    id: 'invoices',
    icon: Receipt,
    submenu: [
      { id: 'invoiceList', href: '/panel/user/invoices' },
      { id: 'newInvoice', href: '/panel/user/invoices/new' },
      { id: 'newCostInvoice', href: '/panel/user/invoices/new-cost' },
    ],
  },
  { id: 'payouts', href: '/panel/user/paychecks', icon: Banknote },
  { id: 'documents', href: '/panel/user/documents', icon: Files },
  { id: 'messages', href: '/panel/user/messages', icon: MessageSquare },
  { id: 'legalHelp', href: '/panel/user/law-request', icon: Shield },
  { id: 'suggestions', href: '/panel/user/suggestions', icon: Lightbulb },
];

const BLOCKED_USER_NAV_STRUCTURE = [
  { id: 'messages', href: '/panel/user/messages', icon: MessageSquare },
];

export const BENEFICIARY_PANEL_LANG_KEY = 'beneficiaryPanelLng';
/** 1 | 0 w localStorage — stały szeroki/wąski sidebar na desktopie */
export const PANEL_SIDEBAR_COLLAPSED_KEY = 'panelSidebarCollapsed';

function persistSidebarCollapsed(collapsed) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PANEL_SIDEBAR_COLLAPSED_KEY, collapsed ? '1' : '0');
  } catch {
    /* ignore quota / private mode */
  }
}

function buildBeneficiaryNavigation(tp, structure) {
  return structure.map((item) => ({
    ...item,
    name: tp(`nav.${item.id}`),
    submenu: item.submenu?.map((sub) => ({
      ...sub,
      name: tp(`nav.${sub.id}`),
    })),
  }));
}

const navStableKey = (item) => item.id ?? item.name;

export default function PanelLayout({ children, role = 'user' }) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [openSubmenuKey, setOpenSubmenuKey] = useState(null);
  const [companyName, setCompanyName] = useState('');
  const [isBlockedForNonPayment, setIsBlockedForNonPayment] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const [beneficiaryLng, setBeneficiaryLng] = useState('pl');

  const beneficiaryTp = useMemo(
    () => i18n.getFixedT(beneficiaryLng, 'panel'),
    [beneficiaryLng]
  );

  const setBeneficiaryPanelLanguage = useCallback((lng) => {
    const next = lng === 'en' ? 'en' : 'pl';
    setBeneficiaryLng(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem(BENEFICIARY_PANEL_LANG_KEY, next);
      document.cookie = `${BENEFICIARY_PANEL_LANG_KEY}=${encodeURIComponent(next)}; path=/; max-age=31536000; SameSite=Lax`;
    }
  }, []);

  const beneficiaryLocaleValue = useMemo(
    () => ({
      lng: beneficiaryLng,
      tp: beneficiaryTp,
      setLng: setBeneficiaryPanelLanguage,
    }),
    [beneficiaryLng, beneficiaryTp, setBeneficiaryPanelLanguage]
  );

  const getCookieValue = (key) => {
    if (typeof document === 'undefined') return null;
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const match = document.cookie.match(new RegExp(`(?:^|; )${escapedKey}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
  };

  const setThemeCookie = (theme) => {
    if (typeof document === 'undefined') return;
    document.cookie = `theme=${encodeURIComponent(theme)}; path=/; max-age=31536000; SameSite=Lax`;
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem(PANEL_SIDEBAR_COLLAPSED_KEY);
      if (saved === '1') setCollapsed(true);
      else if (saved === '0') setCollapsed(false);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const cookieTheme = getCookieValue('theme');
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const selectedTheme = cookieTheme || storedTheme;
    const shouldUseDark = selectedTheme ? selectedTheme === 'dark' : prefersDark;
    setDarkMode(shouldUseDark);
    document.documentElement.classList.toggle('dark', shouldUseDark);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || role !== 'user') return;
    let stored = localStorage.getItem(BENEFICIARY_PANEL_LANG_KEY);
    if (stored !== 'en' && stored !== 'pl') {
      const fromCookie = getCookieValue(BENEFICIARY_PANEL_LANG_KEY);
      if (fromCookie === 'en' || fromCookie === 'pl') {
        stored = fromCookie;
        try {
          localStorage.setItem(BENEFICIARY_PANEL_LANG_KEY, fromCookie);
        } catch {
          /* ignore */
        }
      }
    }
    if (stored === 'en') setBeneficiaryLng('en');
    else if (stored === 'pl') setBeneficiaryLng('pl');
  }, [role]);

  useEffect(() => {
    if (role !== 'user') return;

    const fetchUserCompany = async () => {
      try {
        const response = await fetch('/api/user/profile-summary');
        const payload = await response.json();
        if (response.ok) {
          const name =
            typeof payload?.data?.companyName === 'string' && payload.data.companyName.trim() !== ''
              ? payload.data.companyName
              : '';
          setCompanyName(name);
          setIsBlockedForNonPayment(Boolean(payload?.data?.isBlockedForNonPayment));
        }
      } catch (error) {
        console.error('Nie udało się pobrać nazwy firmy', error);
      }
    };

    fetchUserCompany();
  }, [role]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', next ? 'dark' : 'light');
        setThemeCookie(next ? 'dark' : 'light');
      }
      document.documentElement.classList.toggle('dark', next);
      return next;
    });
  };

  const beneficiaryBuiltNav = useMemo(
    () => buildBeneficiaryNavigation(beneficiaryTp, USER_NAV_STRUCTURE),
    [beneficiaryTp]
  );

  const beneficiaryBlockedNav = useMemo(
    () => buildBeneficiaryNavigation(beneficiaryTp, BLOCKED_USER_NAV_STRUCTURE),
    [beneficiaryTp]
  );

  const effectiveBeneficiaryNavigation = isBlockedForNonPayment
    ? beneficiaryBlockedNav
    : beneficiaryBuiltNav;

  const adminNavigation = [
    { name: 'Zarządzanie', href: '/panel/admin/manage-users', icon: Shield },
    { name: 'Ranking', href: '/panel/admin/ranking', icon: Award },
    { name: 'Dodaj użytkownika', href: '/panel/admin/add-user', icon: UserPlus },
    { name: 'Ogłoszenia', href: '/panel/admin/messages', icon: MessageSquare },
    { name: 'Zapytania prawne', href: '/panel/admin/law-requests', icon: Shield },
    { name: 'Sugestie', href: '/panel/admin/suggestions', icon: Lightbulb },
  ];

  const coordinatorNavigation = [
    { name: 'Dashboard', href: '/panel/coordinator/dashboard', icon: LayoutDashboard },
    { name: 'Moi Beneficjenci', href: '/panel/coordinator/beneficiaries', icon: Users },
    { name: 'Wiadomości', href: '/panel/coordinator/messages', icon: MessageSquare },
  ];

  const accountantNavigation = [
    { name: 'Dashboard', href: '/panel/accountant/dashboard', icon: LayoutDashboard },
    { name: 'Klienci i Faktury', href: '/panel/accountant/clients', icon: Users },
    { name: 'Przelewy', href: '/panel/accountant/transfers', icon: Banknote },
  ];

  const freelancerNavigation = [
    { name: 'Dashboard', href: '/panel/freelancer/dashboard', icon: LayoutDashboard },
    { name: 'Kalkulator', href: '/panel/freelancer/calculator', icon: Calculator },
    {
      name: 'Faktury',
      icon: Receipt,
      submenu: [
        { name: 'Utwórz fakturę', href: '/panel/freelancer/invoices/new' },
        { name: 'Lista faktur', href: '/panel/freelancer/invoices' },
      ],
    },
    { name: 'Wypłaty', href: '/panel/freelancer/paychecks', icon: Banknote },
    { name: 'Ustawienia', href: '/panel/freelancer/settings', icon: Settings },
  ];

  const navigation =
    role === 'admin'
      ? adminNavigation
      : role === 'coordinator'
        ? coordinatorNavigation
        : role === 'accountant'
          ? accountantNavigation
          : role === 'freelancer'
            ? freelancerNavigation
            : effectiveBeneficiaryNavigation;

  const panelHomeHref =
    role === 'admin'
      ? '/panel/admin/dashboard'
      : role === 'coordinator'
        ? '/panel/coordinator/dashboard'
        : role === 'accountant'
          ? '/panel/accountant/dashboard'
          : role === 'freelancer'
            ? '/panel/freelancer/dashboard'
            : '/panel/user/dashboard';

  const collapsedIconColors = [
    'text-blue-600',
    'text-emerald-600',
    'text-amber-600',
    'text-violet-600',
    'text-cyan-600',
    'text-rose-600',
    'text-indigo-600',
    'text-teal-600',
    'text-fuchsia-600',
  ];
  const getCollapsedIconColor = (index, isActive) =>
    isActive
      ? 'text-blue-700 dark:text-blue-300'
      : `${collapsedIconColors[index % collapsedIconColors.length]} dark:text-blue-300`;

  const getActiveSubmenuHref = (submenu, pathname) => {
    const candidates = submenu.filter(
      (sub) => pathname === sub.href || pathname.startsWith(`${sub.href}/`)
    );
    if (candidates.length === 0) return null;
    return candidates.reduce((longest, sub) => (sub.href.length > longest.href.length ? sub : longest))
      .href;
  };

  const navTp = role === 'user' ? beneficiaryTp : null;

  const NavContent = () => (
    <div className="flex flex-col h-full w-full bg-gradient-to-b from-white via-blue-50/70 to-indigo-50/70 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 border-r border-blue-100 dark:border-gray-800 transition-all duration-300">
      <div className="h-16 px-2 md:px-4 flex items-center gap-2 border-b border-blue-100 dark:border-gray-800">
        <Link
          href={panelHomeHref}
          className={`flex items-center min-h-[40px] rounded-md hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 ${collapsed ? 'flex-1 justify-center' : 'min-w-0 flex-1'}`}
          aria-label={
            navTp ? navTp('aria.goToDashboard') : 'Przejdź do pulpitu'
          }
        >
          <Image
            src="/img/logo.png"
            alt="Strefa CRM"
            width={collapsed ? 40 : 140}
            height={40}
            className={
              collapsed
                ? 'h-9 w-auto max-w-[120px] object-contain'
                : 'h-24 w-auto object-contain'
            }
            priority
          />
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setCollapsed((prev) => {
              const next = !prev;
              persistSidebarCollapsed(next);
              return next;
            });
          }}
          className="hidden md:flex shrink-0"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {navigation.map((item, index) => {
          const Icon = item.icon;
          const stableKey = navStableKey(item);

          if (item.submenu) {
            const isSubmenuActive = item.submenu.some(
              (sub) => router.pathname === sub.href || router.pathname.startsWith(`${sub.href}/`)
            );
            const isExpanded = openSubmenuKey === stableKey || isSubmenuActive;
            return (
              <div key={stableKey}>
                <button
                  type="button"
                  onClick={() =>
                    setOpenSubmenuKey((k) => (k === stableKey ? null : stableKey))
                  }
                  className={`w-full flex items-center p-2 rounded-lg transition-colors ${isSubmenuActive ? 'bg-blue-100 text-blue-700 shadow-sm dark:bg-blue-900/50 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50/80 dark:hover:bg-gray-800'}`}
                >
                  <Icon
                    size={20}
                    className={
                      collapsed
                        ? `${getCollapsedIconColor(index, isSubmenuActive)} mx-auto`
                        : `${collapsedIconColors[index % collapsedIconColors.length]} dark:text-blue-300 mr-3`
                    }
                  />
                  {!collapsed && (
                    <div className="flex flex-1 items-center justify-between">
                      <span>{item.name}</span>
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </div>
                  )}
                </button>

                {!collapsed && (
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-64 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}
                  >
                    <div className="pl-9 pr-2 space-y-1">
                      {item.submenu.map((subItem) => {
                        const activeSubHref = getActiveSubmenuHref(
                          item.submenu,
                          router.pathname
                        );
                        const subKey =
                          typeof subItem.id === 'string' ? `${stableKey}.${subItem.id}` : `${stableKey}.${subItem.name}.${subItem.href}`;
                        const isSubActive = activeSubHref === subItem.href;
                        return (
                          <Link
                            key={subKey}
                            href={subItem.href}
                            className={`block p-2 text-sm rounded-md transition-colors ${isSubActive ? 'bg-blue-100 text-blue-700 font-medium dark:bg-blue-900/30 dark:text-blue-300' : 'text-gray-600 hover:text-gray-900 hover:bg-blue-50/80 dark:hover:bg-gray-800 dark:hover:text-gray-300'}`}
                          >
                            {subItem.name}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          }

          const isActive =
            router.pathname === item.href ||
            (item.href && router.pathname.startsWith(`${item.href}/`));
          return (
            <Link
              key={stableKey}
              href={item.href}
              className={`flex items-center p-2 rounded-lg transition-colors ${isActive ? 'bg-blue-100 text-blue-700 shadow-sm dark:bg-blue-900/50 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50/80 dark:hover:bg-gray-800'}`}
            >
              <Icon
                size={20}
                className={
                  collapsed
                    ? `${getCollapsedIconColor(index, isActive)} mx-auto`
                    : `${collapsedIconColors[index % collapsedIconColors.length]} dark:text-blue-300 mr-3`
                }
              />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {role === 'user' && !collapsed && (
        <div className="px-3 pb-3">
          <div className="rounded-xl border border-blue-200/80 dark:border-blue-900/40 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-900/70 p-3 shadow-sm">
            <div className="flex items-start gap-2">
              <div className="mt-0.5 rounded-lg bg-white/80 dark:bg-gray-800 p-1.5 border border-blue-100 dark:border-gray-700">
                <Building2 size={14} className="text-blue-600 dark:text-blue-300" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  {navTp('sidebar.yourCompany')}
                </p>
                <p
                  className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate"
                  title={
                    companyName || navTp('sidebar.companyNotProvided')
                  }
                >
                  {companyName || navTp('sidebar.companyNotProvided')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 border-t dark:border-gray-800">
        <Link
          href="/"
          className="flex items-center p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <LogOut size={20} className={collapsed ? 'mx-auto' : 'mr-3'} />
          {!collapsed && (
            <span>{role === 'user' ? navTp('sidebar.logout') : 'Wyloguj'}</span>
          )}
        </Link>
      </div>
    </div>
  );

  const shell = (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-950 flex ${darkMode ? 'dark' : ''}`}>
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger render={<Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50" />}>
            <Menu />
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>

      <div className={`hidden md:block transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
        <div className={`fixed inset-y-0 left-0 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
          <NavContent />
        </div>
      </div>

      <div className="flex-1 flex flex-col transition-all duration-300">
        <header className="h-16 bg-white dark:bg-gray-900 border-b dark:border-gray-800 flex items-center justify-end px-4 gap-2 sm:gap-4 sticky top-0 z-40 flex-wrap">
          {role === 'user' && (
            <div
              className="mr-auto flex items-center sm:mr-0 md:mr-auto lg:mr-0"
              role="group"
              aria-label={beneficiaryTp('aria.language')}
            >
              <div className="inline-flex h-9 items-stretch rounded-lg border border-blue-100/90 bg-gradient-to-r from-blue-50/90 to-indigo-50/60 p-0.5 shadow-[inset_0_1px_0_rgb(255_255_255/0.6)] backdrop-blur-sm dark:border-gray-700/90 dark:from-gray-900/90 dark:to-gray-900/60 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.04)]">
                {[
                  { code: 'pl', label: 'PL', narrow: beneficiaryTp('aria.langPl') },
                  { code: 'en', label: 'EN', narrow: beneficiaryTp('aria.langEn') },
                ].map(({ code, label, narrow }) => {
                  const active = beneficiaryLng === code;
                  return (
                    <button
                      key={code}
                      type="button"
                      aria-pressed={active}
                      aria-label={narrow}
                      onClick={() => setBeneficiaryPanelLanguage(code)}
                      className={cn(
                        'relative min-h-8 min-w-[2.75rem] shrink-0 rounded-md px-3 text-xs font-semibold tracking-wide uppercase transition-[color,background-color,box-shadow,transform] duration-200',
                        'focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400/80 dark:focus-visible:ring-offset-gray-900',
                        'active:scale-[0.98]',
                        active
                          ? 'bg-white text-blue-700 shadow-[0_1px_2px_rgba(59,130,246,0.12),0_0_0_1px_rgba(59,130,246,0.08)] dark:bg-blue-600 dark:text-white dark:shadow-[0_1px_3px_rgba(0,0,0,0.35)]'
                          : 'text-gray-500 hover:bg-white/60 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-100'
                      )}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {role === 'user' && (
            <Link href="/panel/user/settings">
              <Button
                variant="ghost"
                size="icon"
                aria-label={
                  beneficiaryTp('aria.accountSettings')
                }
              >
                <Settings size={20} />
              </Button>
            </Link>
          )}
          {role === 'freelancer' && (
            <Link href="/panel/freelancer/settings">
              <Button variant="ghost" size="icon" aria-label="Ustawienia konta">
                <Settings size={20} />
              </Button>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            aria-label={
              role === 'user' ? beneficiaryTp('aria.toggleTheme') : 'Przełącz motyw'
            }
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
        </header>

        <main className="flex-1 p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={router.asPath}
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.22, ease: 'easeOut' }}
              className="max-w-7xl mx-auto"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );

  if (role !== 'user') {
    return shell;
  }

  return (
    <BeneficiaryPanelLocaleContext.Provider value={beneficiaryLocaleValue}>
      {shell}
    </BeneficiaryPanelLocaleContext.Provider>
  );
}
