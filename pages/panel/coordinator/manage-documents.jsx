import React, { useState, useEffect } from 'react';
import PanelLayout from '@/components/Layout/PanelLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { FolderOpen, ArrowLeft, Check, X, Download, FileText, Send } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function CoordinatorManageDocuments() {
  const router = useRouter();
  const { beneficiary_id } = router.query;

  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedDoc, setSelectedDoc] = useState(null);

  const [documents, setDocuments] = useState([]);
  const [beneficiary, setBeneficiary] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    if (!beneficiary_id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/coordinator/beneficiaries/${beneficiary_id}/documents`);
      const json = await res.json();
      if (res.ok && json.data) {
        setBeneficiary(json.data.beneficiary);
        setDocuments(json.data.documents);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [beneficiary_id]);

  const handleAction = async (docId, docType, action) => {
    if (action === 'REJECT' && !rejectionReason.trim()) {
      alert('Powód odrzucenia jest wymagany!');
      return;
    }

    try {
      const res = await fetch(`/api/coordinator/beneficiaries/${beneficiary_id}/documents`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          docId,
          docType,
          action,
          reason: action === 'REJECT' ? rejectionReason : null
        })
      });

      if (res.ok) {
        alert('Status dokumentu został zaktualizowany.');
        setSelectedDoc(null);
        setRejectionReason('');
        fetchDocuments(); // Refresh list
      } else {
        const json = await res.json();
        alert(`Błąd: ${json.error || json.message}`);
      }
    } catch (err) {
      console.error(err);
      alert('Wystąpił nieoczekiwany błąd');
    }
  };

  const beneficiaryName = beneficiary
    ? `${beneficiary.firstName || ''} ${beneficiary.lastName || ''}`.trim() || 'Nieuzupełniono'
    : 'Ładowanie...';
  const uniqueId = beneficiary?.ownAffiliation || '...';

  return (
    <PanelLayout role="coordinator">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Link href="/panel/coordinator/beneficiaries">
            <Button variant="outline" size="icon" className="rounded-full shadow-sm">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
              <FolderOpen className="h-6 w-6 text-blue-500" /> Dokumenty Beneficjenta
            </h1>
            <p className="text-gray-500 font-medium">{beneficiaryName} ({uniqueId})</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lewa kolumna: Tabela z dokumentami */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-md border-0">
            <CardHeader className="bg-gray-50 dark:bg-gray-900/50 border-b">
              <CardTitle className="text-lg">Przesłane pliki</CardTitle>
              <CardDescription>Zarządzaj wnioskami, oświadczeniami i fakturami wybranego podopiecznego</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/30 dark:bg-gray-900/10">
                    <TableHead className="pl-6 font-semibold">Typ dokumentu</TableHead>
                    <TableHead className="font-semibold">Plik</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="text-right pr-6 font-semibold">Weryfikacja</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12 text-gray-500">Wczytywanie dokumentów...</TableCell>
                  </TableRow>
                ) : documents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12 text-gray-500">
                      Brak dokumentów powiązanych z tym beneficjentem.
                    </TableCell>
                  </TableRow>
                ) : documents.map((doc) => (
                    <TableRow
                    key={`${doc.docType}-${doc.docId}`}
                    className={`hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors cursor-pointer ${selectedDoc?.docId === doc.docId ? 'bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500/50' : ''}`}
                    onClick={() => setSelectedDoc(doc)}
                    >
                      <TableCell className="pl-6">
                        <span className="font-medium text-gray-900 dark:text-gray-200">{doc.type}</span>
                      <div className="text-xs text-gray-500 mt-1">{new Date(doc.date).toLocaleDateString()}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 max-w-[200px]">
                          <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
                          <span className="truncate text-sm font-mono text-gray-600 dark:text-gray-400">{doc.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                          (doc.status === 'VERIFIED' || doc.status === 'APPROVED' || doc.status === 'PAID') ? 'bg-green-100 text-green-800 border-green-200' :
                          (doc.status === 'PENDING' || doc.status === 'SUBMITTED' || doc.status === 'UNDER_REVIEW') ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                            'bg-red-100 text-red-800 border-red-200'
                          }
                        >
                          {doc.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        {doc.fileUrl ? (
                          <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="sm" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-100" title="Pobierz dokument">
                              <Download className="h-4 w-4" />
                            </Button>
                          </a>
                        ) : (
                          <Button variant="ghost" size="sm" className="h-8 w-8 text-gray-300 cursor-not-allowed" title="Brak pliku" disabled>
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {documents.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="h-32 text-center text-gray-500">
                        Brak przesłanych dokumentów.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Prawa kolumna: Panel akcji */}
        <div className="space-y-6">
          <Card className="sticky top-24 shadow-md border-0 border-t-4 border-t-blue-500">
            <CardHeader className="bg-gray-50 dark:bg-gray-900/50 border-b pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                Zarządzaj statusem
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {!selectedDoc ? (
                <div className="text-center py-8 text-gray-500">
                  <FolderOpen className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                  <p>Wybierz dokument z tabeli, aby zmienić jego status.</p>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">Wybrany plik:</p>
                    <p className="text-sm font-mono text-gray-700 dark:text-gray-400 mt-1 truncate">
                      {selectedDoc.name}
                    </p>
                    <Badge className="mt-2" variant="outline">{selectedDoc.status}</Badge>
                  </div>

                  {(selectedDoc.status === 'PENDING' || selectedDoc.status === 'SUBMITTED') ? (
                    <div className="flex flex-col gap-3">
                      <Button onClick={() => handleAction(selectedDoc.docId, selectedDoc.docType, 'ACCEPT')} disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white shadow-sm h-11 text-base">
                        <Check className="mr-2 h-5 w-5" /> Akceptuj dokument
                      </Button>
                      <div className="relative flex items-center py-2">
                        <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                        <span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase font-semibold">lub odrzuć</span>
                        <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                      </div>

                      <div className="space-y-3">
                        <Textarea
                          placeholder="Podaj powód odrzucenia (widoczny dla beneficjenta)..."
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          className="min-h-[100px] resize-none focus-visible:ring-red-500 border-gray-300 dark:border-gray-600"
                        />
                        <Button onClick={() => handleAction(selectedDoc.docId, selectedDoc.docType, 'REJECT')} disabled={loading || !rejectionReason.trim()} variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 h-11">
                          <X className="mr-2 h-4 w-4" /> Odrzuć dokument
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-xl border border-gray-100">
                      <FileText className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">Ten dokument został już przetworzony.</p>
                      <p className="text-xs mt-1">Dalsza edycja z poziomu koordynatora nie jest możliwa.</p>
                    </div>
                  )}
                </div>
              )}
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
