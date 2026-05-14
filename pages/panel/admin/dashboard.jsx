import React, { useEffect, useState } from 'react';
import PanelLayout from '@/components/Layout/PanelLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Activity, Settings, ShieldAlert, BarChart3, Database } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsers24h: 0,
    usersWithActiveSubscription: 0,
    pendingPaymentRequests: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/admin/dashboard');
        const json = await res.json();

        if (res.ok && json.data) {
          setStats(json.data);
        }
      } catch (error) {
        console.error('Failed to fetch admin dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <PanelLayout role="admin">
      <div className="space-y-8">
        <div className="relative p-8 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border border-indigo-500/20 shadow-sm">
          <div className="relative z-10 space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent flex items-center gap-3">
              <ShieldAlert className="h-8 w-8 text-indigo-500" /> Panel Administratora
            </h1>
            <p className="text-gray-600 dark:text-gray-300 font-medium">Globalne statystyki systemu i szybki dostęp do modułów.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Użytkownicy</p>
                  <p className="text-4xl font-black text-blue-600">
                    {isLoading ? '...' : stats.totalUsers}
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Nowi 24h</p>
                  <p className="text-4xl font-black text-green-600">
                    {isLoading ? '...' : stats.newUsers24h}
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-xl">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Aktywny abonament</p>
                  <p className="text-4xl font-black text-purple-600">
                    {isLoading ? '...' : stats.usersWithActiveSubscription}
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-xl">
                  <Database className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Wnioski do weryfikacji</p>
                  <p className="text-4xl font-black text-red-600">
                    {isLoading ? '...' : stats.pendingPaymentRequests}
                  </p>
                </div>
                <div className="p-3 bg-red-50 rounded-xl">
                  <ShieldAlert className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" /> Aktywność Systemu (Ostatnie 7 dni)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400">
                Wykres aktywności zostanie załadowany...
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" /> Szybkie Akcje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Link href="/panel/admin/manage-users" className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex flex-col items-center gap-2 text-center">
                  <Users className="w-8 h-8 text-indigo-500" />
                  <span className="font-medium text-sm">Zarządzaj Użytkownikami</span>
                </Link>
                <Link href="/panel/admin/settings" className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex flex-col items-center gap-2 text-center">
                  <Settings className="w-8 h-8 text-gray-500" />
                  <span className="font-medium text-sm">Ustawienia Systemu</span>
                </Link>
                <Link href="/panel/admin/logs" className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex flex-col items-center gap-2 text-center">
                  <Database className="w-8 h-8 text-blue-500" />
                  <span className="font-medium text-sm">Logi Systemowe</span>
                </Link>
                <Link href="/panel/admin/messages" className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex flex-col items-center gap-2 text-center">
                  <ShieldAlert className="w-8 h-8 text-amber-500" />
                  <span className="font-medium text-sm">Komunikaty</span>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PanelLayout>
  );
}
