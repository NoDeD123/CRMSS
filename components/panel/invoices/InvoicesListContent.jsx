import React, { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Eye, Plus, Trash2, Download } from 'lucide-react';
import Link from 'next/link';
import { useBeneficiaryPanelLocale } from '@/contexts/BeneficiaryPanelLocale';

export default function InvoicesListContent({ panelBase }) {
  const { lng, tp } = useBeneficiaryPanelLocale();
  const dateLocale = lng === 'en' ? 'en-GB' : 'pl-PL';
  const invoicesPath = `${panelBase}/invoices`;
  const [activeTab, setActiveTab] = useState('income');
  const [invoices, setInvoices] = useState([]);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [previewInvoice, setPreviewInvoice] = useState(null);

  useEffect(() => {
    async function fetchInvoices() {
      try {
        const res = await fetch('/api/user/invoices');
        const json = await res.json();
        if (res.ok && json.data) {
          setInvoices(json.data);
        }
      } catch (error) {
        console.error('Error fetching invoices:', error);
      }
    }
    fetchInvoices();
  }, []);

  const translateStatus = (status) => {
    const keyMap = {
      PENDING: 'statusPENDING',
      PAID: 'statusPAID',
      WITHDRAW: 'statusWITHDRAW',
      VERIFIED: 'statusVERIFIED',
      REJECTED: 'statusREJECTED',
    };
    const k = keyMap[status];
    return k ? tp(`invoicesList.${k}`) : status;
  };

  const emDash = useMemo(() => '\u2014', []);

  const isInvoiceFileBlocked = (status) => ['PENDING', 'REJECTED'].includes(status);

  const incomeInvoices = invoices
    .filter((inv) => inv.type === 'SALES')
    .map((inv) => ({
      id: inv.id,
      number: inv.invoiceNumber,
      contractor: inv.buyerName,
      buyerEmail: inv.buyerEmail?.trim() ? inv.buyerEmail.trim() : emDash,
      date: new Date(inv.issueDate).toLocaleDateString(dateLocale),
      amount: `${inv.grossAmount} ${inv.currency || 'PLN'}`,
      status: translateStatus(inv.status),
      statusRaw: inv.status,
      fileUrl: inv.fileUrl,
    }));

  const costInvoices = invoices
    .filter((inv) => inv.type === 'COST')
    .map((inv) => ({
      id: inv.id,
      number: inv.invoiceNumber,
      contractor: inv.sellerName,
      category: inv.description?.trim() || tp('invoicesList.categoryGeneral'),
      date: new Date(inv.issueDate).toLocaleDateString(dateLocale),
      amount: `${inv.grossAmount} ${inv.currency || 'PLN'}`,
      status: translateStatus(inv.status),
      statusRaw: inv.status,
      fileUrl: inv.fileUrl,
    }));

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/user/invoices?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        setInvoices(invoices.filter((inv) => inv.id !== id));
        toast.success(tp('invoicesList.deleteSuccess'));
      } else {
        const err = await response.json();
        toast.error(`${tp('invoicesList.deleteErrorPrefix')} ${err.error}`);
      }
    } catch (e) {
      toast.error(tp('invoicesList.deleteCatch'));
    } finally {
      setDeleteTargetId(null);
    }
  };

  const verificationToastPending = tp('invoicesList.toastPending');
  const verificationToastRejected = tp('invoicesList.toastRejected');
  const blockedInvoiceToast = (status) =>
    status === 'REJECTED' ? verificationToastRejected : verificationToastPending;
  const actionBtnClass = 'h-8 px-3 rounded-md';

  const incomeStatusBadgeClass = (statusRaw) => {
    if (statusRaw === 'PAID' || statusRaw === 'VERIFIED') {
      return 'bg-emerald-100 text-emerald-900 border-emerald-200 hover:bg-emerald-100';
    }
    if (statusRaw === 'REJECTED') {
      return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-100';
    }
    if (statusRaw === 'PENDING') {
      return 'bg-amber-100 text-amber-900 border-amber-200 hover:bg-amber-100';
    }
    if (statusRaw === 'WITHDRAW') {
      return 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-100';
    }
    return 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100';
  };

  const handlePreviewInvoice = (invoice) => {
    if (!invoice?.fileUrl) return;
    if (isInvoiceFileBlocked(invoice.statusRaw)) {
      toast(blockedInvoiceToast(invoice.statusRaw), { icon: '⏳' });
      return;
    }
    setPreviewInvoice(invoice);
  };

  const handleDownloadInvoice = (event, invoice) => {
    if (isInvoiceFileBlocked(invoice.statusRaw)) {
      event.preventDefault();
      toast(blockedInvoiceToast(invoice.statusRaw), { icon: '⏳' });
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">{tp('invoicesList.title')}</h1>
          <p className="text-gray-500">{tp('invoicesList.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`${invoicesPath}/new`}>
            <Button className="h-10 bg-blue-600 hover:bg-blue-700 shadow-sm">
              <Plus className="mr-2 h-4 w-4" /> {tp('invoicesList.newInvoice')}
            </Button>
          </Link>
          <Link href={`${invoicesPath}/new-cost`}>
            <Button variant="outline" className="h-10 border-blue-200 hover:bg-blue-50">
              <Plus className="mr-2 h-4 w-4" /> {tp('invoicesList.expenseInvoice')}
            </Button>
          </Link>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4 flex gap-4 border-b">
          <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveTab('income')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'income' ? 'bg-white dark:bg-gray-700 shadow text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'}`}
            >
              {tp('invoicesList.tabIncome')}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('cost')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'cost' ? 'bg-white dark:bg-gray-700 shadow text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'}`}
            >
              {tp('invoicesList.tabCost')}
            </button>
          </div>

          <div className="flex-1 max-w-sm ml-auto">
            <Input placeholder={tp('invoicesList.searchPlaceholder')} className="h-10" />
          </div>
        </CardContent>

        <CardContent className="p-0">
          {activeTab === 'income' ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">{tp('invoicesList.colNumber')}</TableHead>
                  <TableHead>{tp('invoicesList.colContractor')}</TableHead>
                  <TableHead className="min-w-[10rem]">{tp('invoicesList.colBuyerEmail')}</TableHead>
                  <TableHead>{tp('invoicesList.colIssueDate')}</TableHead>
                  <TableHead>{tp('invoicesList.colGross')}</TableHead>
                  <TableHead>{tp('invoicesList.colStatus')}</TableHead>
                  <TableHead className="text-right">{tp('invoicesList.colActions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incomeInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium text-blue-600">{invoice.number}</TableCell>
                    <TableCell>{invoice.contractor}</TableCell>
                    <TableCell
                      className="max-w-[14rem] truncate text-sm text-gray-600 dark:text-gray-400"
                      title={invoice.buyerEmail !== emDash ? invoice.buyerEmail : undefined}
                    >
                      {invoice.buyerEmail}
                    </TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell className="font-semibold">{invoice.amount}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${incomeStatusBadgeClass(invoice.statusRaw)} border font-medium`}
                      >
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className={`${actionBtnClass} border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-40`}
                        disabled={invoice.statusRaw === 'PAID'}
                        onClick={() => setDeleteTargetId(invoice.id)}
                        title={
                          invoice.statusRaw === 'PAID'
                            ? tp('invoicesList.paidNoDelete')
                            : tp('invoicesList.btnDelete')
                        }
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        {tp('invoicesList.btnDelete')}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`ml-2 ${actionBtnClass} border-blue-200 text-blue-700 hover:bg-blue-50`}
                        disabled={!invoice.fileUrl}
                        onClick={() => handlePreviewInvoice(invoice)}
                        title={
                          isInvoiceFileBlocked(invoice.statusRaw)
                            ? tp('invoicesList.previewPending')
                            : tp('invoicesList.previewPdf')
                        }
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        {tp('invoicesList.previewButton')}
                      </Button>
                      <a
                        href={invoice.fileUrl || '#'}
                        target={invoice.fileUrl ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        download
                        onClick={(event) => handleDownloadInvoice(event, invoice)}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className={`ml-2 ${actionBtnClass} border-blue-200 text-blue-700 hover:bg-blue-50`}
                          disabled={!invoice.fileUrl}
                          title={
                            isInvoiceFileBlocked(invoice.statusRaw)
                              ? tp('invoicesList.downloadCoordinator')
                              : tp('invoicesList.downloadPdf')
                          }
                        >
                          <Download className="h-4 w-4 mr-1" />
                          {tp('invoicesList.downloadPdf')}
                        </Button>
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">{tp('invoicesList.colNumber')}</TableHead>
                  <TableHead>{tp('invoicesList.colSupplier')}</TableHead>
                  <TableHead>{tp('invoicesList.colCategory')}</TableHead>
                  <TableHead>{tp('invoicesList.colDate')}</TableHead>
                  <TableHead>{tp('invoicesList.colAmount')}</TableHead>
                  <TableHead>{tp('invoicesList.colStatus')}</TableHead>
                  <TableHead className="text-right">{tp('invoicesList.colActions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {costInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium text-blue-600">{invoice.number}</TableCell>
                    <TableCell>{invoice.contractor}</TableCell>
                    <TableCell>{invoice.category}</TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell className="font-semibold">{invoice.amount}</TableCell>
                    <TableCell>
                      <Badge
                        variant={invoice.statusRaw === 'VERIFIED' ? 'success' : 'warning'}
                        className={
                          invoice.statusRaw === 'VERIFIED'
                            ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100'
                            : invoice.statusRaw === 'REJECTED'
                              ? 'bg-red-100 text-red-800 border-red-200 hover:bg-red-100'
                              : 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100'
                        }
                      >
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className={`${actionBtnClass} border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-40`}
                        disabled={invoice.statusRaw === 'PAID'}
                        onClick={() => setDeleteTargetId(invoice.id)}
                        title={
                          invoice.statusRaw === 'PAID'
                            ? tp('invoicesList.paidNoDelete')
                            : tp('invoicesList.btnDelete')
                        }
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        {tp('invoicesList.btnDelete')}
                      </Button>
                      <a
                        href={invoice.fileUrl || '#'}
                        target={invoice.fileUrl ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        download
                        onClick={(event) => handleDownloadInvoice(event, invoice)}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className={`ml-2 ${actionBtnClass} border-blue-200 text-blue-700 hover:bg-blue-50`}
                          disabled={!invoice.fileUrl}
                          title={
                            isInvoiceFileBlocked(invoice.statusRaw)
                              ? tp('invoicesList.downloadCoordinator')
                              : tp('invoicesList.downloadFile')
                          }
                        >
                          <Download className="h-4 w-4 mr-1" />
                          {tp('invoicesList.downloadFile')}
                        </Button>
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!deleteTargetId} onOpenChange={(open) => !open && setDeleteTargetId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{tp('invoicesList.deleteConfirmTitle')}</DialogTitle>
            <DialogDescription>{tp('invoicesList.deleteConfirmDescription')}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteTargetId(null)}>
              {tp('invoicesList.cancel')}
            </Button>
            <Button variant="destructive" onClick={() => handleDelete(deleteTargetId)}>
              {tp('invoicesList.deleteForever')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!previewInvoice} onOpenChange={(open) => !open && setPreviewInvoice(null)}>
        <DialogContent className="max-w-6xl h-[90vh] p-0 overflow-hidden">
          <div className="relative w-full h-full bg-white">
            {previewInvoice?.fileUrl && (
              <iframe
                src={previewInvoice.fileUrl}
                className="w-full h-full border-0"
                title={tp('invoicesList.previewInvoiceTitle', { number: previewInvoice.number })}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
