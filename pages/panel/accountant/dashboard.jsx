import React, { useState, useEffect } from 'react';
import PanelLayout from '@/components/Layout/PanelLayout';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Clock, FileText, CheckCircle, FileSpreadsheet } from 'lucide-react';
import Link from 'next/link';

export default function AccountantDashboard() {
  const [stats, setStats] = useState({
    expressTransfers: 0,
    pendingTransfers: 0,
    documentsToBook: 0,
    transfersToVerify: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/accountant/dashboard');
        const json = await res.json();
        if (res.ok && json.data) {
          setStats(json.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <PanelLayout role="accountant">
      <div className="space-y-8">

        {/* Nagłówek powitalny */}
        <div className="relative p-8 rounded-2xl overflow-hidden bg-gradient-to-br from-green-600/10 to-emerald-600/10 border border-green-500/20 shadow-sm">
          <div className="relative z-10 space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent flex items-center gap-3">
              <FileSpreadsheet className="h-8 w-8 text-green-500" /> Panel Księgowości
            </h1>
            <p className="text-gray-600 dark:text-gray-300 font-medium">Bieżące statystyki finansowe i zadania oczekujące na realizację.</p>
          </div>
        </div>

        {/* Karty statystyk */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          <Link href="/panel/accountant/transfers?type=express">
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-t-0 border-r-0 border-b-0 border-l-4 border-l-red-500 cursor-pointer bg-white dark:bg-gray-900/50">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Przelewy Ekspresowe</p>
                    {loading ? <div className="h-10 w-16 bg-gray-200 animate-pulse rounded"></div> : (
                      <p className="text-4xl font-black text-red-600 dark:text-red-400">
                        {stats.expressTransfers}
                      </p>
                    )}
                  </div>
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl group-hover:scale-110 transition-transform">
                    <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                </div>
                <p className="text-xs text-red-500 mt-4 font-medium flex items-center gap-1">
                  Do pilnej akceptacji
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/panel/accountant/transfers?type=pending">
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-t-0 border-r-0 border-b-0 border-l-4 border-l-yellow-500 cursor-pointer bg-white dark:bg-gray-900/50">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Przelewy oczekujące</p>
                    {loading ? <div className="h-10 w-16 bg-gray-200 animate-pulse rounded"></div> : (
                      <p className="text-4xl font-black text-yellow-600 dark:text-yellow-400">
                        {stats.pendingTransfers}
                      </p>
                    )}
                  </div>
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl group-hover:scale-110 transition-transform">
                    <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-4 font-medium flex items-center gap-1">
                  Wymagają weryfikacji i akceptacji
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/panel/accountant/clients">
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-t-0 border-r-0 border-b-0 border-l-4 border-l-blue-500 cursor-pointer bg-white dark:bg-gray-900/50">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Dokumenty faktur</p>
                    {loading ? <div className="h-10 w-16 bg-gray-200 animate-pulse rounded"></div> : (
                      <p className="text-4xl font-black text-blue-600 dark:text-blue-400">
                        {stats.documentsToBook}
                      </p>
                    )}
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-4 font-medium flex items-center gap-1">
                  Gotowe do zaksięgowania w systemie
                </p>
              </CardContent>
            </Card>
          </Link>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-t-0 border-r-0 border-b-0 border-l-4 border-l-indigo-500 bg-white dark:bg-gray-900/50">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Do weryfikacji</p>
                    {loading ? <div className="h-10 w-16 bg-gray-200 animate-pulse rounded"></div> : (
                      <p className="text-4xl font-black text-emerald-600 dark:text-emerald-400">
                        {stats.transfersToVerify}
                      </p>
                    )}
                </div>
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl group-hover:scale-110 transition-transform">
                  <CheckCircle className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4 font-medium flex items-center gap-1">
                Ogólna pula zdarzeń
              </p>
            </CardContent>
          </Card>

        </div>
      </div>
    </PanelLayout>
  );
}