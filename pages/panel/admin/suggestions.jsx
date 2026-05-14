import React, { useEffect, useState } from 'react';
import PanelLayout from '@/components/Layout/PanelLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function AdminSuggestions() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState('');
  const [descriptionPreview, setDescriptionPreview] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/admin/suggestions');
        const payload = await response.json();
        if (response.ok && payload.data) {
          setRows(payload.data);
        } else {
          setRows([]);
        }
      } catch (error) {
        console.error(error);
        setRows([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      const response = await fetch('/api/admin/suggestions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });

      if (!response.ok) return;
      setRows((prev) => prev.map((row) => (row.id === id ? { ...row, status } : row)));
    } catch (error) {
      console.error(error);
    } finally {
      setUpdatingId('');
    }
  };

  const statusLabels = {
    NEW: 'Nowa',
    IN_REVIEW: 'Do wdrożenia',
    RESOLVED: 'Wdrożone'
  };

  const statusBadgeClasses = {
    NEW: 'bg-blue-100 text-blue-800 border-blue-200',
    IN_REVIEW: 'bg-amber-100 text-amber-800 border-amber-200',
    RESOLVED: 'bg-green-100 text-green-800 border-green-200'
  };

  const filteredRows = statusFilter === 'ALL' ? rows : rows.filter((row) => row.status === statusFilter);

  return (
    <PanelLayout role="admin">
      <Card>
        <CardHeader>
          <CardTitle>Sugestie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center justify-between gap-4">
            <p className="text-sm text-gray-500">Łącznie: {filteredRows.length}</p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Filtr statusu:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 rounded-md border border-input bg-background px-2 text-sm"
              >
                <option value="ALL">Wszystkie</option>
                <option value="NEW">Nowa</option>
                <option value="IN_REVIEW">Do wdrożenia</option>
                <option value="RESOLVED">Wdrożone</option>
              </select>
            </div>
          </div>
          {loading ? (
            <p className="text-sm text-gray-500">Ładowanie...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Beneficjent</TableHead>
                  <TableHead>Firma</TableHead>
                  <TableHead>Kategoria</TableHead>
                  <TableHead>Temat</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Załącznik</TableHead>
                  <TableHead>Opis</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{new Date(row.createdAt).toLocaleString('pl-PL')}</TableCell>
                    <TableCell>{`${row.user?.firstName || ''} ${row.user?.lastName || ''}`.trim() || row.user?.email}</TableCell>
                    <TableCell>{row.user?.companyName || '—'}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell>{row.subject}</TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <span className={`inline-flex rounded-full border px-2 py-1 text-xs font-medium ${statusBadgeClasses[row.status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                          {statusLabels[row.status] || row.status}
                        </span>
                        <select
                          value={row.status}
                          disabled={updatingId === row.id}
                          onChange={(e) => handleStatusChange(row.id, e.target.value)}
                          className="h-9 rounded-md border border-input bg-background px-2 text-xs w-full"
                        >
                          <option value="NEW">Nowa</option>
                          <option value="IN_REVIEW">Do wdrożenia</option>
                          <option value="RESOLVED">Wdrożone</option>
                        </select>
                      </div>
                    </TableCell>
                    <TableCell>
                      {row.attachmentUrl ? (
                        <a href={row.attachmentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Otwórz</a>
                      ) : '—'}
                    </TableCell>
                    <TableCell className="max-w-[420px]">
                      <div className="line-clamp-2 text-sm text-gray-700 dark:text-gray-300">{row.description}</div>
                      <Button variant="link" className="h-auto p-0 text-xs" onClick={() => setDescriptionPreview(row.description)}>
                        Pokaż pełny opis
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!descriptionPreview} onOpenChange={(open) => !open && setDescriptionPreview('')}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Pełny opis sugestii</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed text-gray-700 dark:text-gray-200">
            {descriptionPreview}
          </div>
        </DialogContent>
      </Dialog>
    </PanelLayout>
  );
}
