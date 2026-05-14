import React from 'react';
import PanelLayout from '@/components/Layout/PanelLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';
import { useBeneficiaryPanelLocale } from '@/contexts/BeneficiaryPanelLocale';

export function PayoutsListContent() {
  const { tp } = useBeneficiaryPanelLocale();
  const payments = [
    { id: 1, amount: '4,500.00 PLN', date: '2023-10-10', description: 'Wypłata za miesiąc wrzesień 2023' },
    { id: 2, amount: '4,200.00 PLN', date: '2023-09-10', description: 'Wypłata za miesiąc sierpień 2023' },
  ];

  const documents = [
    { id: 1, name: 'Umowa_Zlecenie_01.pdf', date: '2023-01-15' },
    { id: 2, name: 'Oswiadczenie_Zleceniobiorcy_01.pdf', date: '2023-01-15' },
    { id: 3, name: 'Oswiadczenie_Student_10.pdf', date: '2023-10-01' },
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{tp('payoutsList.title')}</h1>
          <p className="text-gray-500">{tp('payoutsList.subtitle')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{tp('payoutsList.historyTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">{tp('payoutsList.colId')}</TableHead>
                    <TableHead>{tp('payoutsList.colAmount')}</TableHead>
                    <TableHead>{tp('payoutsList.colPayoutDate')}</TableHead>
                    <TableHead>{tp('payoutsList.colDescription')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium text-gray-500">#{payment.id}</TableCell>
                      <TableCell className="font-semibold text-green-600 dark:text-green-400">{payment.amount}</TableCell>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>{payment.description}</TableCell>
                    </TableRow>
                  ))}
                  {payments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                        {tp('payoutsList.emptyPayments')}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" /> {tp('payoutsList.statementsTitle')}
              </CardTitle>
              <CardDescription>{tp('payoutsList.statementsHint')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {documents.map((doc) => (
                  <li
                    key={doc.id}
                    className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <div className="truncate">
                        <p className="text-sm font-medium truncate" title={doc.name}>{doc.name}</p>
                        <p className="text-xs text-gray-500">{tp('payoutsList.addedOn')} {doc.date}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 flex-shrink-0">
                      <Download className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
              {documents.length === 0 && (
                <p className="text-center text-sm text-gray-500 py-4">{tp('payoutsList.emptyDocs')}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

export default function UserDocumentList() {
  return (
    <PanelLayout role="user">
      <PayoutsListContent />
    </PanelLayout>
  );
}
