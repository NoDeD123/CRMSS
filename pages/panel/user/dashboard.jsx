import React, { useState, useEffect } from 'react';
import PanelLayout from '@/components/Layout/PanelLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  HandMetal,
  RefreshCcw,
  FolderOpen,
  Wallet,
  Mail,
  Calendar,
  Rocket,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';
import { useBeneficiaryPanelLocale } from '@/contexts/BeneficiaryPanelLocale';

function formatEventCalendarCell(event, locale) {
  const created = event.createdAt ? new Date(event.createdAt) : null;
  if (created && !Number.isNaN(created.getTime())) {
    return {
      day: String(created.getDate()),
      month: created.toLocaleDateString(locale, { month: 'short' }),
    };
  }
  const rawMonth = event.month;
  return {
    day: event.day ?? '—',
    month: typeof rawMonth === 'string' && rawMonth.length > 3 ? rawMonth.substring(0, 3) : rawMonth ?? '',
  };
}

function UserDashboardBody() {
  const { lng, tp } = useBeneficiaryPanelLocale();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/user/dashboard');
        const json = await res.json();
        if (res.ok && json.data) {
          setDashboardData(json.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const dateLocaleTag = lng === 'en' ? 'en-GB' : 'pl-PL';

  const accountBalance = dashboardData?.user?.accountBalance || '0.00';
  const pendingDocuments = dashboardData?.stats?.pendingDocuments || 0;
  const unreadMessages = dashboardData?.stats?.unreadMessages || 0;
  const isNewUser = false;

  const nextPaymentDateRaw = dashboardData?.subscription?.nextPaymentDate;
  const nextPaymentDate =
    typeof nextPaymentDateRaw === 'string' && nextPaymentDateRaw
      ? new Date(nextPaymentDateRaw).toLocaleDateString(dateLocaleTag)
      : tp('dashboard.none');

  const joinedDays = dashboardData?.user?.joinedDate
    ? Math.floor((new Date() - new Date(dashboardData.user.joinedDate)) / (1000 * 60 * 60 * 24))
    : 0;

  const rawFirst = dashboardData?.user?.firstName;
  const resolvedName =
    typeof rawFirst === 'string' && rawFirst.trim() !== '' ? rawFirst.trim() : tp('dashboard.fallbackDisplayName');
  const headlineWelcome = loading ? tp('dashboard.welcomeLoading') : tp('dashboard.welcome', { name: resolvedName });

  const subscription = dashboardData?.subscription || {
    fee: '365.00',
    isActive: true,
    nextPaymentDate: null,
    needsReminder: false,
    daysToPayment: 0,
  };
  const isBlockedForNonPayment = dashboardData?.subscription?.isBlockedForNonPayment ?? false;

  const events = dashboardData?.events || [];

  const updates = [
    { id: 1, titleKey: 'dashboard.update1Title', descKey: 'dashboard.update1Desc', icon: '👨‍💻' },
    { id: 2, titleKey: 'dashboard.update2Title', descKey: 'dashboard.update2Desc', icon: '⚡' },
    { id: 3, titleKey: 'dashboard.update3Title', descKey: 'dashboard.update3Desc', icon: '🎁' },
  ];

  const durationSummary =
    joinedDays > 31
      ? tp('dashboard.durationMonths', { count: Math.floor(joinedDays / 30) })
      : tp('dashboard.durationDays', { count: joinedDays });

  return (
    <div className="space-y-8">
      {isBlockedForNonPayment ? (
        <Card className="border-2 border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900">
          <CardContent className="p-8 text-center space-y-4">
            <h2 className="text-2xl font-bold text-red-700 dark:text-red-400">
              {tp('dashboard.accessSuspendedTitle')}
            </h2>
            <p className="text-base text-red-700/90 dark:text-red-300">{tp('dashboard.accessSuspendedBody')}</p>
            <p className="text-sm text-red-600/90 dark:text-red-400">{tp('dashboard.accessSuspendedHint')}</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="relative p-8 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-600/10 dark:to-purple-600/10 border border-blue-200 dark:border-blue-500/20 shadow-sm">
            <div className="relative z-10 space-y-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent flex items-center gap-3">
                <HandMetal className="h-8 w-8 text-yellow-500" /> {headlineWelcome}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 font-medium">
                {loading ? tp('dashboard.loading') : tp('dashboard.welcomeSubtitle')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-3 shadow-md bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 text-gray-900 dark:text-white border border-indigo-200 dark:border-0">
              <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="flex-shrink-0 p-4 bg-white/70 dark:bg-black/20 rounded-xl border border-indigo-200 dark:border-white/5">
                  <RefreshCcw className="h-10 w-10 text-indigo-600 dark:text-yellow-400" />
                </div>
                <div className="flex-1 space-y-4 w-full">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {tp('dashboard.subscriptionTitle')}
                    </h3>
                    {subscription.isActive ? (
                      <Badge className="bg-green-200 text-green-900 hover:bg-green-200 dark:bg-green-500/50 dark:text-white dark:hover:bg-green-500/50 border-0">
                        {tp('dashboard.badgeActive')}
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-200 text-yellow-900 hover:bg-yellow-200 dark:bg-yellow-500/50 dark:text-white dark:hover:bg-yellow-500/50 border-0">
                        {tp('dashboard.badgePending')}
                      </Badge>
                    )}
                  </div>

                  {subscription.needsReminder && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
                      <AlertTriangle className="h-5 w-5" />
                      <p className="text-sm font-medium">
                        {tp('dashboard.paymentReminder', { days: subscription.daysToPayment })}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-indigo-200 dark:border-white/10">
                    <div className="bg-white/70 dark:bg-black/20 p-3 rounded-xl border border-indigo-200 dark:border-white/5">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{tp('dashboard.monthlyFee')}</p>
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">{subscription.fee} PLN</p>
                    </div>
                    <div className="bg-white/70 dark:bg-black/20 p-3 rounded-xl border border-indigo-200 dark:border-white/5">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{tp('dashboard.nextPayment')}</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{nextPaymentDate}</p>
                    </div>
                    <div className="sm:col-span-2 bg-white/70 dark:bg-black/20 p-3 rounded-xl border border-indigo-200 dark:border-white/5">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{tp('dashboard.accountStatus')}</p>
                      {isNewUser ? (
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          {tp('dashboard.firstPaymentDue', { date: nextPaymentDate })}
                        </p>
                      ) : subscription.isActive ? (
                        <p className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
                          <Clock className="w-4 h-4" /> {tp('dashboard.accountActive')}
                        </p>
                      ) : (
                        <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                          {tp('dashboard.awaitingSubscription')}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {tp('dashboard.withUsLabel')} <strong>{durationSummary}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 text-gray-900 dark:text-white border border-indigo-200 dark:border-0">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 bg-white/70 dark:bg-black/20 p-4 rounded-xl border border-indigo-200 dark:border-white/5">
                  <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl group-hover:scale-110 transition-transform">
                    <FolderOpen className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{tp('dashboard.documents')}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{tp('dashboard.documentsHint')}</p>
                    <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-2">
                      {pendingDocuments}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 text-gray-900 dark:text-white border border-indigo-200 dark:border-0">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 bg-white/70 dark:bg-black/20 p-4 rounded-xl border border-indigo-200 dark:border-white/5">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl group-hover:scale-110 transition-transform">
                    <Wallet className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{tp('dashboard.balance')}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{tp('dashboard.balanceHint')}</p>
                    <p className="text-2xl font-black text-green-600 dark:text-green-400 mt-2">
                      {accountBalance} <span className="text-lg">PLN</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 text-gray-900 dark:text-white border border-indigo-200 dark:border-0">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 bg-white/70 dark:bg-black/20 p-4 rounded-xl border border-indigo-200 dark:border-white/5">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl group-hover:scale-110 transition-transform">
                    <Mail className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{tp('dashboard.messages')}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{tp('dashboard.messagesHint')}</p>
                    <p className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-2">
                      {unreadMessages > 0 ? (
                        <span className="inline-flex relative">
                          {unreadMessages}
                          <span className="absolute top-0 right-0 -mr-2 -mt-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
                          <span className="absolute top-0 right-0 -mr-2 -mt-1 w-3 h-3 bg-red-500 rounded-full"></span>
                        </span>
                      ) : (
                        '0'
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-md bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 text-gray-900 dark:text-white border border-indigo-200 dark:border-0">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-indigo-800 dark:text-indigo-100">
                    <Calendar className="h-6 w-6 text-indigo-600 dark:text-yellow-400" /> {tp('dashboard.eventsTitle')}
                  </h2>

                  <div className="space-y-4">
                    {events.map((event) => {
                      const { day, month } = formatEventCalendarCell(event, dateLocaleTag);
                      return (
                        <Link
                          key={event.id}
                          href="#"
                          className="group block bg-white/70 hover:bg-white/90 dark:bg-black/20 dark:hover:bg-black/30 p-4 rounded-xl transition-all duration-300 border border-indigo-200 dark:border-white/5"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex flex-col items-center justify-center shrink-0">
                              <span className="text-xl font-black text-indigo-700 dark:text-indigo-300">{day}</span>
                              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase">
                                {month}
                              </span>
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
                              {event.title}
                            </h3>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 text-gray-900 dark:text-white border border-indigo-200 dark:border-0">
                <CardContent className="p-6 h-full flex flex-col">
                  <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-indigo-800 dark:text-indigo-100">
                    <Rocket className="h-6 w-6 text-indigo-600 dark:text-yellow-400" /> {tp('dashboard.updatesTitle')}
                  </h2>

                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {updates.map((update) => (
                      <div
                        key={update.id}
                        className="bg-white/70 hover:bg-white/90 dark:bg-black/20 dark:hover:bg-black/30 backdrop-blur-sm p-5 rounded-xl transition-colors border border-indigo-200 dark:border-white/5"
                      >
                        <div className="text-3xl mb-3">{update.icon}</div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-1">{tp(update.titleKey)}</h3>
                        <p className="text-sm text-indigo-700 dark:text-indigo-200/80 mb-3">{tp(update.descKey)}</p>
                        <Badge className="bg-purple-200 text-purple-900 hover:bg-purple-200 dark:bg-purple-500/50 dark:text-white dark:hover:bg-purple-500/50 border-0 text-[10px] uppercase tracking-wider px-2 py-0.5">
                          {tp('dashboard.badgeSoon')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function UserDashboard() {
  return (
    <PanelLayout role="user">
      <UserDashboardBody />
    </PanelLayout>
  );
}
