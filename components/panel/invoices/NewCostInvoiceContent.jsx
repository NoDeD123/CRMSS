import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud, File, X, ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';
import { useBeneficiaryPanelLocale } from '@/contexts/BeneficiaryPanelLocale';

export default function NewCostInvoiceContent({ panelBase }) {
  const { tp } = useBeneficiaryPanelLocale();
  const invoicesPath = `${panelBase}/invoices`;
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formDataState, setFormDataState] = useState({
    invoiceNumber: '',
    sellerName: '',
    sellerNip: '',
    netAmount: '',
    grossAmount: '',
    issueDate: new Date().toISOString().split('T')[0],
    description: '',
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormDataState((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error(tp('invoicesCost.needFile'));
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    formData.append('invoiceNumber', formDataState.invoiceNumber);
    formData.append('sellerName', formDataState.sellerName);
    formData.append('sellerNip', formDataState.sellerNip);
    formData.append('netAmount', formDataState.netAmount || '0');
    formData.append('grossAmount', formDataState.grossAmount || '0');
    formData.append('issueDate', formDataState.issueDate);
    formData.append('description', formDataState.description);

    try {
      const res = await fetch('/api/user/invoices/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setSuccess(true);
        setFile(null);
        toast.success(tp('invoicesCost.success'));
      } else {
        const errorData = await res.json();
        toast.error(`${tp('invoicesCost.errorPrefix')} ${errorData.error}`);
      }
    } catch (err) {
      toast.error(tp('invoicesCost.unexpected'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Link href={invoicesPath}>
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{tp('invoicesCost.title')}</h1>
          <p className="text-gray-500">{tp('invoicesCost.subtitle')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>{tp('invoicesCost.fileCardTitle')}</CardTitle>
            <CardDescription>{tp('invoicesCost.fileFormats')}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center">
            {!file ? (
              <div
                className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-12 transition-all cursor-pointer ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 hover:border-gray-400 dark:border-gray-700'}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(ev) => {
                  if (ev.key === 'Enter' || ev.key === ' ') fileInputRef.current?.click();
                }}
                role="button"
                tabIndex={0}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                />
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <UploadCloud className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                </div>
                <h3 className="font-medium text-lg mb-1">{tp('invoicesCost.dropTitle')}</h3>
                <p className="text-sm text-gray-500">{tp('invoicesCost.dropHint')}</p>
              </div>
            ) : (
              <div className="border rounded-xl p-6 bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center justify-center text-center h-full">
                <File className="h-16 w-16 text-blue-500 mb-4" />
                <h3 className="font-medium text-lg max-w-full truncate px-4">{file.name}</h3>
                <p className="text-sm text-gray-500 mb-6">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                <Button variant="outline" onClick={() => setFile(null)}>
                  <X className="mr-2 h-4 w-4" /> {tp('invoicesCost.removeFile')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{tp('invoicesCost.detailsTitle')}</CardTitle>
            <CardDescription>{tp('invoicesCost.detailsHint')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="invoiceNumber">
                  {tp('invoicesCost.docNumber')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="invoiceNumber"
                  value={formDataState.invoiceNumber}
                  onChange={handleInputChange}
                  placeholder={tp('invoicesCost.docNumberPh')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="issueDate">
                  {tp('invoicesCost.issueDate')} <span className="text-red-500">*</span>
                </Label>
                <Input id="issueDate" type="date" value={formDataState.issueDate} onChange={handleInputChange} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sellerName">
                  {tp('invoicesCost.sellerName')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="sellerName"
                  value={formDataState.sellerName}
                  onChange={handleInputChange}
                  placeholder={tp('invoicesCost.sellerNamePh')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sellerNip">{tp('invoicesCost.sellerNip')}</Label>
                <Input
                  id="sellerNip"
                  value={formDataState.sellerNip}
                  onChange={handleInputChange}
                  placeholder={tp('invoicesCost.sellerNipPh')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="netAmount">{tp('invoicesCost.netOptional')}</Label>
              <div className="relative">
                <Input
                  type="number"
                  step="0.01"
                  id="netAmount"
                  value={formDataState.netAmount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className="pl-3 pr-12"
                />
                <span className="absolute right-3 top-2 text-gray-500 text-sm">PLN</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{tp('invoicesCost.grossOptional')}</Label>
              <div className="relative">
                <Input
                  type="number"
                  id="grossAmount"
                  value={formDataState.grossAmount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className="pl-3 pr-12"
                />
                <span className="absolute right-3 top-2 text-gray-500 text-sm">PLN</span>
              </div>
              <p className="text-xs text-gray-500">{tp('invoicesCost.grossHelp')}</p>
            </div>

            <div className="space-y-2">
              <Label>{tp('invoicesCost.description')}</Label>
              <textarea
                id="description"
                value={formDataState.description}
                onChange={handleInputChange}
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder={tp('invoicesCost.descriptionPh')}
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input type="checkbox" id="paid" className="rounded border-gray-300" />
              <Label htmlFor="paid" className="font-normal cursor-pointer">
                {tp('invoicesCost.paidPrivate')}
              </Label>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex justify-end gap-4">
        {success && <span className="text-green-600 font-bold self-center">{tp('invoicesCost.success')}</span>}
        <Link href={invoicesPath}>
          <Button variant="outline" type="button">
            {tp('invoicesCost.cancel')}
          </Button>
        </Link>
        <Button onClick={handleSubmit} disabled={loading || !file} className="bg-blue-600 hover:bg-blue-700">
          <Send className="mr-2 h-4 w-4" /> {loading ? tp('invoicesCost.sending') : tp('invoicesCost.send')}
        </Button>
      </div>
    </>
  );
}
