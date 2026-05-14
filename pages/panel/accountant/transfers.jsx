import React, { useState, useEffect } from 'react';
import PanelLayout from '@/components/Layout/PanelLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, Check, Search, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function AccountantTransfers() {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTransfers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/accountant/transfers');
      const json = await res.json();
      if (res.ok && json.data) {
        setTransfers(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransfers();
  }, []);

  const handleAction = async (id, action) => {
    try {
      const res = await fetch('/api/accountant/transfers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action })
      });

      if (res.ok) {
        fetchTransfers();
      } else {
        const json = await res.json();
        alert(`Błąd: ${json.error || json.message}`);
      }
    } catch (err) {
      console.error(err);
      alert('Nieoczekiwany błąd.');
    }
  };

  const filteredTransfers = transfers.filter(t =>
    t.requestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.user?.firstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.user?.lastName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PanelLayout role="accountant">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent flex items-center gap-2">
            <FileSpreadsheet className="h-6 w-6 text-green-500" /> Przelewy i Wnioski o wypłatę
          </h1>
          <p className="text-gray-500">Zarządzaj zatwierdzonymi wnioskami gotowymi do zapłaty</p>
        </div>
        <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Eksport SEPA/ELIXIR (Mock)</Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Szukaj po nazwisku lub numerze wniosku..."
              className="pl-10 max-w-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Oczekujące na realizację</CardTitle>
          <CardDescription>Dokumenty ze statusem UNDER_REVIEW (zatwierdzone przez koordynatorów)</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Wniosek</TableHead>
                <TableHead>Beneficjent</TableHead>
                <TableHead>Konto Bankowe</TableHead>
                <TableHead>Kwota PLN</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Akcje księgowe</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-6 text-gray-500">Wczytywanie przelewów...</TableCell></TableRow>
              ) : filteredTransfers.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-6 text-gray-500">Brak oczekujących przelewów w systemie.</TableCell></TableRow>
              ) : filteredTransfers.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="font-medium text-gray-900 dark:text-white">
                    <div>{req.requestNumber}</div>
                    <div className="text-xs text-gray-500">{new Date(req.createdAt).toLocaleDateString()}</div>
                  </TableCell>
                  <TableCell>
                    {req.user?.firstName} {req.user?.lastName}
                    <div className="text-xs text-gray-500">{req.user?.ownAffiliation}</div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{req.bankAccount || 'Brak konta na wniosku'}</TableCell>
                  <TableCell className="font-bold text-green-600 dark:text-green-400">{req.amount} PLN</TableCell>
                  <TableCell>
                    <Badge variant={req.status === 'PAID' ? 'success' : 'secondary'} className={req.status === 'UNDER_REVIEW' ? 'bg-yellow-100 text-yellow-800' : ''}>
                      {req.status === 'UNDER_REVIEW' ? 'Do przelewu' : req.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {req.status === 'UNDER_REVIEW' && (
                      <Button onClick={() => handleAction(req.id, 'PAID')} size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                        <Check className="mr-2 h-4 w-4" /> Oznacz jako opłacone
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PanelLayout>
  );
}
