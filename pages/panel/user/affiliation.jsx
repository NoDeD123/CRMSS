import React, { useState, useEffect } from 'react';
import PanelLayout from '@/components/Layout/PanelLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { PartyPopper, CheckCircle2, TrendingUp, Users, Copy, Check } from 'lucide-react';

export default function Affiliation() {
  const [copied, setCopied] = useState(false);
  const [affiliationData, setAffiliationData] = useState({ code: 'LADOWANIE...', count: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAffiliation = async () => {
      try {
        const res = await fetch('/api/user/affiliation');
        const json = await res.json();
        if (res.ok && json.data) {
          setAffiliationData(json.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAffiliation();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(affiliationData.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PanelLayout role="user">
      <div className="relative p-8 rounded-2xl mb-8 overflow-hidden bg-gradient-to-br from-blue-900 to-indigo-900 text-white shadow-xl">
        <div className="relative z-10 space-y-4 max-w-3xl">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text text-transparent flex items-center gap-3">
            <PartyPopper className="h-10 w-10 text-yellow-400" /> Program Afiliacyjny!
          </h1>
          <p className="text-xl text-blue-100 font-medium">
            Zarabiaj, polecając naszą fundację swoim znajomym. Im więcej osób dołączy, tym większe bonusy otrzymasz.
          </p>

          <div className="mt-8 bg-black/30 p-6 rounded-xl border border-white/10 backdrop-blur-md flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-blue-200 text-sm font-semibold mb-1 uppercase tracking-wider">Twój unikalny kod polecający:</p>
              <div className="text-3xl font-mono font-bold tracking-widest text-white">
                {loading ? '...' : affiliationData.code}
              </div>
            </div>
            <Button
              size="lg"
              onClick={handleCopy}
              disabled={loading}
              className={`${copied ? 'bg-green-500 hover:bg-green-600' : 'bg-white text-blue-900 hover:bg-blue-50'} font-bold transition-all`}
            >
              {copied ? <><Check className="mr-2 h-5 w-5" /> Skopiowano</> : <><Copy className="mr-2 h-5 w-5" /> Kopiuj kod</>}
            </Button>
          </div>
        </div>

        {/* Dekoracyjne elementy tła */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 right-48 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-t-4 border-t-purple-500 shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-purple-500" /> Progi Afiliacyjne
              </CardTitle>
              <CardDescription>Twoja aktywność definiuje Twój poziom zarobków</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  { level: 1, referrals: '1-5 poleconych', reward: '50 zł miesięcznie za osobę', icon: '🥉', color: 'from-amber-600/20 to-orange-800/20', border: 'border-orange-500/50' },
                  { level: 2, referrals: '6-10 poleconych', reward: '100 zł miesięcznie za osobę', icon: '🥈', color: 'from-gray-400/20 to-gray-600/20', border: 'border-gray-400/50' },
                  { level: 3, referrals: '11+ poleconych', reward: '150 zł miesięcznie za osobę', icon: '🥇', color: 'from-yellow-400/20 to-amber-600/20', border: 'border-yellow-400/50' }
                ].map((tier) => (
                  <div key={tier.level} className={`flex items-center gap-4 p-4 rounded-xl border ${tier.border} bg-gradient-to-r ${tier.color}`}>
                    <div className="text-4xl">{tier.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold">Poziom {tier.level}: {tier.referrals}</h3>
                      <p className="text-gray-700 dark:text-gray-300 font-medium">Nagroda: <span className="font-bold text-gray-900 dark:text-white">{tier.reward}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-gray-50 dark:bg-gray-900/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" /> Twoje statystyki
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border">
                <p className="text-gray-500 font-medium uppercase tracking-wider text-sm mb-2">Poleceni użytkownicy</p>
                <div className="text-5xl font-black text-blue-600">{loading ? '...' : affiliationData.count}</div>
                <p className="text-sm text-gray-500 mt-2">Jesteś na <strong className="text-orange-500">Poziomie 1</strong></p>
              </div>

              <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-green-200 dark:border-green-900/50">
                <p className="text-gray-500 font-medium uppercase tracking-wider text-sm mb-2">Zarobiono łącznie</p>
                <div className="text-4xl font-black text-green-600">{loading ? '...' : (affiliationData.count * 50).toFixed(2)} <span className="text-2xl">PLN</span></div>
                <p className="text-sm text-gray-500 mt-2">z tytułu premii partnerskiej</p>
              </div>

              <Button className="w-full" variant="outline">
                Zobacz historię poleceń
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PanelLayout>
  );
}