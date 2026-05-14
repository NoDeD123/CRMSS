import React, { useState, useEffect } from 'react';
import PanelLayout from '@/components/Layout/PanelLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function UserContractors() {
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ contractorName: '', nip: '', email: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchContractors = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/contractors');
      const json = await res.json();
      if (res.ok && json.data) {
        setContractors(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContractors();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddContractor = async (e) => {
    e.preventDefault();
    if (!formData.contractorName) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/user/contractors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        fetchContractors();
        setFormData({ contractorName: '', nip: '', email: '', phone: '' });
        setShowAddForm(false);
      } else {
        const json = await res.json();
        alert(json.message || 'Wystąpił błąd');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PanelLayout role="user">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Moi Kontrahenci</h1>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Anuluj' : 'Dodaj kontrahenta'}
        </Button>
      </div>

      {showAddForm && (
        <Card className="mb-6 bg-blue-50 dark:bg-blue-900/10 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg">Nowy kontrahent</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddContractor} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input name="contractorName" value={formData.contractorName} onChange={handleChange} placeholder="Nazwa firmy *" required />
              <Input name="nip" value={formData.nip} onChange={handleChange} placeholder="NIP" />
              <Input name="email" value={formData.email} onChange={handleChange} placeholder="Email kontaktowy" type="email" />
              <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="Telefon" />
              <div className="md:col-span-2 lg:col-span-4 flex justify-end">
                <Button type="submit" disabled={submitting || !formData.contractorName}>Zapisz kontrahenta</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Lista powiązanych kontrahentów</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nazwa</TableHead>
                <TableHead>NIP</TableHead>
                <TableHead>Email kontaktowy</TableHead>
                <TableHead>Akcje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={4} className="text-center py-6">Ładowanie kontrahentów...</TableCell></TableRow>
              ) : contractors.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center py-6 text-gray-500">Brak dodanych kontrahentów.</TableCell></TableRow>
              ) : contractors.map((contractor) => (
                <TableRow key={contractor.id}>
                  <TableCell className="font-medium">{contractor.contractorName}</TableCell>
                  <TableCell>{contractor.nip || '-'}</TableCell>
                  <TableCell>{contractor.email || '-'}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={async () => {
                      if(window.confirm('Czy na pewno chcesz usunąć kontrahenta?')) {
                        await fetch(`/api/user/contractors?id=${contractor.id}`, { method: 'DELETE' });
                        fetchContractors();
                      }
                    }}>Usuń</Button>
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