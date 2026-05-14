import React, { useState, useEffect } from 'react';
import PanelLayout from '@/components/Layout/PanelLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, Search, Filter, Phone, Mail, FolderOpen, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function CoordinatorBeneficiaries() {
  const [searchTerm, setSearchTerm] = useState('');
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBeneficiaries() {
      try {
        const res = await fetch('/api/coordinator/beneficiaries');
        const json = await res.json();
        if (res.ok && json.data) {
          setBeneficiaries(json.data);
        }
      } catch (error) {
        console.error('Failed to fetch beneficiaries:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchBeneficiaries();
  }, []);

  const filteredBeneficiaries = beneficiaries.filter(b =>
    (b.beneficiary_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.unique_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PanelLayout role="coordinator">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
            <Users className="h-6 w-6 text-indigo-500" /> Lista podopiecznych
          </h1>
          <p className="text-gray-500">Zarządzaj swoimi beneficjentami i przeglądaj ich dokumenty</p>
        </div>
      </div>

      <Card className="mb-6 shadow-sm border-blue-100 dark:border-gray-800">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-full md:w-96 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <Input
                type="text"
                placeholder="Szukaj po nazwisku, ID lub emailu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 w-full bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-sm focus-visible:ring-indigo-500"
              />
            </div>

            <div className="flex w-full md:w-auto gap-2">
              <Button variant="outline" className="h-11">
                <Filter className="mr-2 h-4 w-4" /> Filtruj
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md border-0">
        <CardHeader className="bg-gray-50 dark:bg-gray-900/50 border-b">
          <CardTitle className="text-lg">Twoi Beneficjenci ({filteredBeneficiaries.length})</CardTitle>
          <CardDescription>Poniższa lista wyświetla wyłącznie podopiecznych przypisanych do Twojego konta</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50 dark:bg-gray-900/20">
                  <TableHead className="w-[120px] pl-6 font-semibold">ID OHP</TableHead>
                  <TableHead className="font-semibold">Imię i Nazwisko</TableHead>
                  <TableHead className="font-semibold">Dane kontaktowe</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="text-right pr-6 font-semibold">Akcje</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-gray-500">Wczytywanie beneficjentów...</TableCell>
                  </TableRow>
                ) : filteredBeneficiaries.map((b) => (
                  <TableRow key={b.id} className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-colors">
                    <TableCell className="pl-6 font-mono text-sm text-gray-500">{b.unique_id}</TableCell>
                    <TableCell className="font-bold text-gray-900 dark:text-white">{b.beneficiary_name}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <Mail className="h-3 w-3 mr-2 text-gray-400" /> {b.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <Phone className="h-3 w-3 mr-2 text-gray-400" /> {b.phone_number}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          b.status === 'Aktywny' ? 'bg-green-100 text-green-800 hover:bg-green-200 border-green-200' :
                          b.status === 'Oczekujący dokument' ? 'bg-red-100 text-red-800 hover:bg-red-200 border-red-200' :
                          'bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200'
                        }
                      >
                        {b.status}
                        {b.pendingDocumentsCount > 0 && <span className="ml-1">({b.pendingDocumentsCount})</span>}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Link href={`/panel/coordinator/manage-documents?beneficiary_id=${b.id}`}>
                        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm relative">
                          {b.pendingDocumentsCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                          )}
                          <FolderOpen className="mr-2 h-4 w-4" /> Dokumenty
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredBeneficiaries.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-gray-500">
                      <Users className="h-8 w-8 mx-auto mb-2 text-gray-400 opacity-50" />
                      Nie znaleziono podopiecznych spełniających kryteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
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
