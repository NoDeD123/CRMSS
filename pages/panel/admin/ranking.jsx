import React, { useEffect, useMemo, useState } from 'react';
import PanelLayout from '@/components/Layout/PanelLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award } from 'lucide-react';

export default function Ranking() {
  const [rankingData, setRankingData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRanking = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/admin/ranking');
        const json = await res.json();

        if (res.ok && json.data) {
          setRankingData(json.data);
        } else {
          setRankingData([]);
        }
      } catch (error) {
        console.error('Failed to fetch ranking:', error);
        setRankingData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, []);

  const topUser = useMemo(() => rankingData[0] || null, [rankingData]);

  const getRankIcon = (rank) => {
    switch(rank) {
      case 1: return <Trophy className="text-yellow-500 w-6 h-6" />;
      case 2: return <Medal className="text-gray-400 w-6 h-6" />;
      case 3: return <Medal className="text-amber-600 w-6 h-6" />;
      default: return <span className="font-bold text-gray-500 w-6 inline-block text-center">{rank}</span>;
    }
  };

  return (
    <PanelLayout role="admin">
      <h1 className="text-2xl font-bold mb-6">Ranking i Statystyki</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="bg-gradient-to-br from-yellow-50 dark:from-yellow-900/20 to-white dark:to-gray-900 border-yellow-200 dark:border-yellow-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Najlepszy w tym miesiącu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/50 rounded-full">
                <Trophy className="text-yellow-600 dark:text-yellow-500 w-8 h-8" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {loading ? 'Wczytywanie...' : topUser ? topUser.name : 'Brak danych'}
                </p>
                <p className="text-sm text-gray-500">
                  {loading
                    ? 'Pobieranie rankingu...'
                    : topUser
                      ? `${topUser.payoutCount} wypłat • ${topUser.accountBalance.toFixed(2)} PLN`
                      : 'Brak wypłat do rankingu'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ranking Beneficjentów</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Pozycja</TableHead>
                <TableHead>Użytkownik</TableHead>
                <TableHead>Rola</TableHead>
                <TableHead>Liczba wypłat</TableHead>
                <TableHead className="text-right">Saldo konta</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-gray-500">Wczytywanie...</TableCell>
                </TableRow>
              ) : rankingData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-gray-500">Brak danych rankingowych.</TableCell>
                </TableRow>
              ) : (
                rankingData.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{getRankIcon(user.rank)}</TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {user.role === 'USER' ? 'Beneficjent' : user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-bold">{user.payoutCount}</TableCell>
                    <TableCell className="text-right font-medium">
                      {user.accountBalance.toFixed(2)} PLN
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PanelLayout>
  );
}