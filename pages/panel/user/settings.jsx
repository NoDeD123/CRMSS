import React, { useState } from 'react';
import PanelLayout from '@/components/Layout/PanelLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { KeyRound, Save } from 'lucide-react';

export default function UserSettings() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const clearForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Uzupełnij wszystkie pola.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Nowe hasła nie są identyczne.');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword
        })
      });

      const payload = await response.json();

      if (!response.ok) {
        setError(payload?.error || 'Nie udało się zmienić hasła.');
        return;
      }

      setMessage(payload?.message || 'Hasło zostało zmienione.');
      clearForm();
    } catch (requestError) {
      console.error(requestError);
      setError('Wystąpił błąd połączenia. Spróbuj ponownie.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PanelLayout role="user">
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold">Ustawienia konta</h1>
          <p className="text-sm text-gray-500 mt-1">Tutaj możesz zmienić hasło do panelu użytkownika.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-blue-600" />
              Zmiana hasła
            </CardTitle>
            <CardDescription>Hasło powinno mieć co najmniej 8 znaków.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="currentPassword">Obecne hasło</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="newPassword">Nowe hasło</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Potwierdź nowe hasło</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}
              {message && <p className="text-sm text-green-600">{message}</p>}

              <Button type="submit" disabled={isSaving} className="gap-2">
                <Save className="h-4 w-4" />
                {isSaving ? 'Zapisywanie...' : 'Zmień hasło'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PanelLayout>
  );
}
