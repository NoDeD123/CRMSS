import React, { useState, useEffect, useCallback } from 'react';
import PanelLayout from '@/components/Layout/PanelLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { KeyRound, Loader2, Save, User } from 'lucide-react';

export default function FreelancerSettings() {
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [peselDisplay, setPeselDisplay] = useState('');
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const loadProfile = useCallback(async () => {
    setProfileLoading(true);
    setProfileError('');
    try {
      const res = await fetch('/api/freelancer/profile', { credentials: 'same-origin' });
      const json = await res.json();
      if (!res.ok) {
        setProfileError(json?.error || 'Nie udało się wczytać danych.');
        return;
      }
      const d = json.data || {};
      setFirstName(d.firstName ?? '');
      setLastName(d.lastName ?? '');
      setPhone(d.phone ?? '');
      setEmail(d.email ?? '');
      setPeselDisplay(d.pesel ?? '');
    } catch {
      setProfileError('Błąd połączenia przy wczytywaniu profilu.');
    } finally {
      setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMessage('');
    setProfileError('');
    setProfileSaving(true);
    try {
      const res = await fetch('/api/freelancer/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          phone,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setProfileError(json?.error || 'Nie udało się zapisać danych.');
        return;
      }
      setProfileMessage(json?.message || 'Dane zostały zapisane.');
      if (json.data) {
        setFirstName(json.data.firstName ?? '');
        setLastName(json.data.lastName ?? '');
        setPhone(json.data.phone ?? '');
      }
    } catch {
      setProfileError('Wystąpił błąd połączenia.');
    } finally {
      setProfileSaving(false);
    }
  };

  const clearPasswordForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMessage('');
    setPasswordError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Uzupełnij wszystkie pola.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Nowe hasła nie są identyczne.');
      return;
    }

    setPasswordSaving(true);
    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        setPasswordError(payload?.error || 'Nie udało się zmienić hasła.');
        return;
      }

      setPasswordMessage(payload?.message || 'Hasło zostało zmienione.');
      clearPasswordForm();
    } catch (err) {
      console.error(err);
      setPasswordError('Wystąpił błąd połączenia. Spróbuj ponownie.');
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <PanelLayout role="freelancer">
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-fuchsia-700 bg-clip-text text-transparent dark:from-blue-300 dark:to-fuchsia-300">
            Ustawienia konta
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Dane profilu oraz zmiana hasła do panelu freelancera.
          </p>
        </div>

        <Card className="border border-fuchsia-100 dark:border-fuchsia-900/40 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-fuchsia-600 dark:text-fuchsia-400" />
              Dane kontaktowe
            </CardTitle>
            <CardDescription>
              Imię, nazwisko i telefon są wymagane.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {profileLoading ? (
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 py-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                Wczytywanie danych…
              </div>
            ) : (
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">Imię</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      autoComplete="given-name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Nazwisko</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      autoComplete="family-name"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete="tel"
                    placeholder="np. 500600700"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" type="email" value={email} disabled className="opacity-80" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Zmiana adresu e-mail wymaga kontaktu z administratorem.
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="pesel">PESEL</Label>
                  <Input id="pesel" value={peselDisplay} disabled className="opacity-80 font-mono" />
               
                </div>

                {profileError && <p className="text-sm text-red-600 dark:text-red-400">{profileError}</p>}
                {profileMessage && (
                  <p className="text-sm text-green-600 dark:text-green-400">{profileMessage}</p>
                )}

                <Button
                  type="submit"
                  disabled={profileSaving}
                  className="gap-2 bg-fuchsia-700 hover:bg-fuchsia-800 text-white"
                >
                  {profileSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Zapisywanie…
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Zapisz dane
                    </>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <Card className="border border-fuchsia-100 dark:border-fuchsia-900/40 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-fuchsia-600 dark:text-fuchsia-400" />
              Zmiana hasła
            </CardTitle>
            <CardDescription>Hasło powinno mieć co najmniej 8 znaków.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
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

              {passwordError && <p className="text-sm text-red-600 dark:text-red-400">{passwordError}</p>}
              {passwordMessage && (
                <p className="text-sm text-green-600 dark:text-green-400">{passwordMessage}</p>
              )}

              <Button
                type="submit"
                disabled={passwordSaving}
                variant="outline"
                className="gap-2 border-fuchsia-200 text-fuchsia-900 hover:bg-fuchsia-50 dark:border-fuchsia-800 dark:text-fuchsia-200 dark:hover:bg-fuchsia-950/40"
              >
                {passwordSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Zapisywanie…
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Zmień hasło
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PanelLayout>
  );
}
