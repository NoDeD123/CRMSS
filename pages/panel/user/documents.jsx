import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import PanelLayout from '@/components/Layout/PanelLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useBeneficiaryPanelLocale } from '@/contexts/BeneficiaryPanelLocale';

function UserDocumentsBody() {
  const { lng, tp } = useBeneficiaryPanelLocale();
  const dateLocale = lng === 'en' ? 'en-GB' : 'pl-PL';
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const fileInputRef = useRef(null);

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = lng === 'en' ? ['B', 'KB', 'MB', 'GB'] : ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
  };

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/documents');
      const data = await res.json();
      if (res.ok) setDocuments(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const res = await fetch('/api/user/documents/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();

      if (res.ok) {
        fetchDocuments();
        toast.success(tp('documentsPage.uploadOk'));
      } else {
        toast.error(`${tp('documentsPage.uploadReject')} ${result.error || ''}`.trim());
      }
    } catch (err) {
      toast.error(tp('documentsPage.uploadErr'));
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/user/documents?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchDocuments();
        toast.success(tp('documentsPage.deleteOk'));
      } else {
        const err = await res.json();
        toast.error(`${tp('documentsPage.deleteErr')} ${err.error}`);
      }
    } catch (e) {
      console.error(e);
      toast.error(tp('documentsPage.unexpected'));
    } finally {
      setDeleteTargetId(null);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{tp('documentsPage.title')}</h1>
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          <Button onClick={handleUploadClick} disabled={uploading}>
            {uploading ? tp('documentsPage.uploading') : tp('documentsPage.upload')}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{tp('documentsPage.myFiles')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{tp('documentsPage.colName')}</TableHead>
                <TableHead>{tp('documentsPage.colAdded')}</TableHead>
                <TableHead>{tp('documentsPage.colSize')}</TableHead>
                <TableHead>{tp('documentsPage.colActions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    {tp('documentsPage.loading')}
                  </TableCell>
                </TableRow>
              ) : documents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center font-semibold text-gray-500 py-10">
                    {tp('documentsPage.empty')}
                  </TableCell>
                </TableRow>
              ) : (
                documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.originalName}</TableCell>
                    <TableCell>{new Date(doc.createdAt).toLocaleDateString(dateLocale)}</TableCell>
                    <TableCell>{formatSize(doc.sizeBytes)}</TableCell>
                    <TableCell>
                      <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="mr-2">
                          {tp('documentsPage.download')}
                        </Button>
                      </a>
                      <Button variant="destructive" size="sm" onClick={() => setDeleteTargetId(doc.id)}>
                        {tp('documentsPage.delete')}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!deleteTargetId} onOpenChange={(open) => !open && setDeleteTargetId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{tp('documentsPage.deleteTitle')}</DialogTitle>
            <DialogDescription>{tp('documentsPage.deleteDescription')}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteTargetId(null)}>
              {tp('documentsPage.cancel')}
            </Button>
            <Button variant="destructive" onClick={() => handleDelete(deleteTargetId)}>
              {tp('documentsPage.deleteFile')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function UserDocuments() {
  return (
    <PanelLayout role="user">
      <UserDocumentsBody />
    </PanelLayout>
  );
}
