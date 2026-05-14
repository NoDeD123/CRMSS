import React, { useEffect, useState } from 'react';
import PanelLayout from '@/components/Layout/PanelLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AdminMessages() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const [formData, setFormData] = useState({
    audience: 'ALL',
    title: '',
    content: ''
  });

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/events');
      const json = await res.json();
      if (res.ok && json.data) {
        setEvents(json.data);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error('Failed to fetch events', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setSending(true);
    try {
      const res = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audience: formData.audience,
          title: formData.title.trim(),
          content: formData.content.trim()
        })
      });

      if (res.ok) {
        setFormData({
          audience: 'ALL',
          title: '',
          content: ''
        });
        await fetchEvents();
      }
    } catch (error) {
      console.error('Failed to create event announcement', error);
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/events?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setEvents((prev) => prev.filter((event) => event.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete event', error);
    } finally {
      setDeletingId('');
    }
  };

  return (
    <PanelLayout role="admin">
      <h1 className="text-2xl font-bold mb-6">Wiadomości i Ogłoszenia</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Wyślij nowe ogłoszenie</CardTitle>
            <CardDescription>Ogłoszenie zostanie zapisane jako wydarzenie i pokaże się beneficjentom na pulpicie.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label>Odbiorcy</Label>
                <select
                  name="audience"
                  value={formData.audience}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="ALL">Wszyscy użytkownicy</option>
                  <option value="ACCOUNTANT">Tylko Księgowi</option>
                  <option value="COORDINATOR">Tylko Koordynatorzy</option>
                  <option value="USER">Tylko Beneficjenci</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Tytuł ogłoszenia</Label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="np. Przerwa techniczna w weekend"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Treść</Label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Wpisz treść ogłoszenia..."
                />
              </div>

              <Button type="submit" className="w-full" disabled={sending}>
                {sending ? 'Zapisywanie...' : 'Wyślij ogłoszenie'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Historia ogłoszeń (Eventy)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="text-sm text-gray-500">Wczytywanie...</div>
              ) : events.length === 0 ? (
                <div className="text-sm text-gray-500">Brak ogłoszeń.</div>
              ) : (
                events.map((event) => (
                  <div key={event.id} className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-900/50">
                    <div className="flex justify-between items-start mb-2 gap-4">
                      <h3 className="font-semibold text-lg">{event.title}</h3>
                      <span className="text-sm text-gray-500 whitespace-nowrap">
                        {new Date(event.createdAt).toLocaleDateString('pl-PL')}
                      </span>
                    </div>
                    <div className="flex justify-end items-center text-sm">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(event.id)}
                        disabled={deletingId === event.id}
                      >
                        {deletingId === event.id ? 'Usuwanie...' : 'Usuń'}
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </PanelLayout>
  );
}