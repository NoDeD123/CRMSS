import React, { useState, useEffect } from 'react';
import PanelLayout from '@/components/Layout/PanelLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Check, Search, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function AccountantClients() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/accountant/invoices');
      const json = await res.json();
      if (res.ok && json.data) {
        setInvoices(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleAction = async (id, action) => {
    try {
      const res = await fetch('/api/accountant/invoices', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action })
      });

      if (res.ok) {
        fetchInvoices();
      } else {
        const json = await res.json();
        alert(`Błąd: ${json.error || json.message}`);
      }
    } catch (err) {
      console.error(err);
      alert('Nieoczekiwany błąd.');
    }
  };

  const filteredInvoices = invoices.filter(i =>
    i.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (i.user?.firstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (i.user?.lastName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (i.sellerName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PanelLayout role="accountant">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
            Dokumenty faktur
          </h1>
          <p className="text-gray-500">Zarządzaj fakturami podopiecznych zatwierdzonymi przez Koordynatorów</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Szukaj po nazwisku, NIP lub numerze..."
              className="pl-10 max-w-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dokumenty oczekujące na księgowanie</CardTitle>
          <CardDescription>Faktury ze statusem VERIFIED (zatwierdzone do wypłaty / rejestru)</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Faktura</TableHead>
                <TableHead>Kontrahent (Sprzedawca)</TableHead>
                <TableHead>Kwota Brutto</TableHead>
                <TableHead>Podopieczny</TableHead>
                <TableHead>Status Księgowy</TableHead>
                <TableHead className="text-right">Wgląd i akcje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-6 text-gray-500">Wczytywanie faktur...</TableCell></TableRow>
              ) : filteredInvoices.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-6 text-gray-500">Brak zaaprobowanych faktur do przetworzenia.</TableCell></TableRow>
              ) : filteredInvoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-medium text-gray-900 dark:text-white">
                    <div>{inv.invoiceNumber}</div>
                    <div className="text-xs text-gray-500">{inv.type === 'COST' ? 'Kosztowa' : 'Sprzedażowa'}</div>
                  </TableCell>
                  <TableCell>
                    {inv.sellerName}
                    <div className="text-xs text-gray-500">NIP: {inv.sellerNip || 'Brak'}</div>
                  </TableCell>
                  <TableCell className="font-bold text-blue-600 dark:text-blue-400">{inv.grossAmount} PLN</TableCell>
                  <TableCell>
                    {inv.user?.firstName} {inv.user?.lastName}
                    <div className="text-xs text-gray-500">{inv.user?.ownAffiliation}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={inv.status === 'PAID' ? 'success' : 'secondary'} className={inv.status === 'VERIFIED' ? 'bg-indigo-100 text-indigo-800' : ''}>
                      {inv.status === 'VERIFIED' ? 'Do księgowania' : inv.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {inv.fileUrl && (
                      <a href={inv.fileUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </a>
                    )}
                    {inv.status === 'VERIFIED' && (
                      <Button onClick={() => handleAction(inv.id, 'PAID')} size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                        <Check className="mr-2 h-4 w-4" /> Księguj
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
