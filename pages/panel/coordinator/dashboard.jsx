import React, { useState, useEffect } from 'react';
import PanelLayout from '@/components/Layout/PanelLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Users, FileText, ArrowRight, Activity } from 'lucide-react';
import Link from 'next/link';

export default function CoordinatorDashboard() {
  const [stats, setStats] = useState({ totalBeneficiaries: 0, totalDocumentsPending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/coordinator/dashboard');
        const json = await res.json();
        if (res.ok && json.data) {
          setStats(json.data);
        }
      } catch (err) {
        console.error('Error fetching coordinator stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <PanelLayout role="coordinator">
      <div className="space-y-8">

        {/* Nagłówek */}
        <div className="relative p-8 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border border-indigo-500/20 shadow-sm">
          <div className="relative z-10 space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent flex items-center gap-3">
              <Activity className="h-8 w-8 text-indigo-500" /> Podsumowanie pracy
            </h1>
            <p className="text-gray-600 dark:text-gray-300 font-medium">Witaj w Panelu Koordynatora. Poniżej znajdują się bieżące statystyki.</p>
          </div>
        </div>

        {/* Statystyki */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 overflow-hidden relative">
            <div className="absolute -right-6 -top-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <Users className="w-32 h-32" />
            </div>
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider text-sm">Liczba podopiecznych</p>
                  {loading ? (
                    <div className="h-12 w-24 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    <p className="text-5xl font-black text-blue-600 dark:text-blue-400">{stats.totalBeneficiaries}</p>
                  )}
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-2xl">
                  <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                <Link href="/panel/coordinator/beneficiaries" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center">
                  Przejdź do listy beneficjentów <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-orange-500 overflow-hidden relative">
            <div className="absolute -right-6 -top-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <FileText className="w-32 h-32" />
            </div>
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider text-sm">Dokumenty do akceptacji</p>
                  {loading ? (
                    <div className="h-12 w-24 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    <p className="text-5xl font-black text-orange-600 dark:text-orange-400">
                      {stats.totalDocumentsPending > 0 ? (
                        <span className="flex items-center gap-3">
                          {stats.totalDocumentsPending}
                          <span className="relative flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-orange-500"></span>
                          </span>
                        </span>
                      ) : '0'}
                    </p>
                  )}
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-900/30 rounded-2xl">
                  <FileText className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                <Link href="/panel/coordinator/beneficiaries" className="text-sm font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 flex items-center">
                  Przejdź do obsługi wniosków <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </PanelLayout>
  );
}
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'pl', ['common'])),
    },
  };
}
