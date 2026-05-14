import React, { useEffect, useState } from 'react';
import PanelLayout from '@/components/Layout/PanelLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, UserPlus, Mail, Phone, MapPin, Landmark } from 'lucide-react';

export default function AddUser() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    password: '',
    role: 'USER',
    bankAccount: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [nextBeneficiaryCode, setNextBeneficiaryCode] = useState('ldap_301002');

  const fetchNextBeneficiaryCode = async () => {
    try {
      const response = await fetch('/api/admin/next-beneficiary-number');
      const payload = await response.json();
      if (response.ok && payload?.data?.nextBeneficiaryCode) {
        setNextBeneficiaryCode(payload.data.nextBeneficiaryCode);
      }
    } catch (error) {
      console.error('Nie udało się pobrać numeru beneficjenta', error);
    }
  };

  useEffect(() => {
    fetchNextBeneficiaryCode();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleRoleChange = (e) => {
    setFormData(prev => ({ ...prev, role: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const json = await res.json();

      if (res.ok) {
        setSuccess(true);
        setFormData({
          firstName: '',
          lastName: '',
          companyName: '',
          email: '',
          password: '',
          role: 'USER',
          bankAccount: '',
        });
        fetchNextBeneficiaryCode();
      } else {
        setErrorMsg(json.message || json.error || 'Wystąpił błąd podczas dodawania użytkownika');
      }
    } catch (err) {
      setErrorMsg('Błąd połączenia z serwerem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PanelLayout role="admin">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dodaj Użytkownika</h1>
        <p className="text-gray-500 text-sm mt-1">Utwórz nowe konto systemowe i przypisz mu odpowiednią rolę.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Dane Podstawowe</CardTitle>
              <CardDescription>Informacje niezbędne do utworzenia konta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Imię</Label>
                  <Input id="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="np. Jan" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nazwisko</Label>
                  <Input id="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="np. Kowalski" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName">Nazwa firmy</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="np. Firma XYZ Sp. z o.o."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Adres Email (Login) *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input id="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="jan.kowalski@example.com" className="pl-9" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Hasło Startowe *</Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input id="password" type="password" value={formData.password} onChange={handleInputChange} placeholder="Min. 8 znaków" className="pl-9" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Numer Telefonu (opcjonalnie)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input id="phone" type="tel" placeholder="+48 000 000 000" className="pl-9" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adres (opcjonalnie)</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input id="address" placeholder="Wpisz adres zamieszkania" className="pl-9" />
                </div>
              </div>

              {formData.role === 'USER' && (
                <div className="space-y-4">
                  <div className="rounded-md border border-dashed border-gray-300 bg-gray-100/70 p-3 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-900/50 dark:text-gray-300">
                    Numer beneficjenta: <span className="font-semibold">{nextBeneficiaryCode}</span>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bankAccount">Konto bankowe (IBAN) *</Label>
                    <div className="relative">
                      <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="bankAccount"
                        value={formData.bankAccount}
                        onChange={handleInputChange}
                        placeholder="np. PL12 3456 7890 1234 5678 9012 3456"
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-500" /> Rola i Uprawnienia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Rola Systemowa</Label>
                <select
                  className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={formData.role}
                  onChange={handleRoleChange}
                >
                  <option value="USER">Beneficjent (Użytkownik)</option>
                  <option value="FREELANCER">Freelancer</option>
                  <option value="COORDINATOR">Koordynator</option>
                  <option value="ACCOUNTANT">Księgowość</option>
                  <option value="FINANCE">Finanse</option>
                  <option value="ADMIN">Administrator</option>
                </select>
              </div>

              <div className="pt-4 space-y-4">
                <div className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1 w-4 h-4" id="sendEmail" defaultChecked />
                  <div>
                    <Label htmlFor="sendEmail" className="font-medium cursor-pointer">Wyślij powiadomienie (MVP mock)</Label>
                    <p className="text-xs text-gray-500 mt-1">W MVP system używa Twojego wpisanego hasła startowego.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {success && <div className="p-4 bg-green-50 text-green-700 rounded-md border border-green-200">Konto zostało pomyślnie utworzone!</div>}
            {errorMsg && <div className="p-4 bg-red-50 text-red-700 rounded-md border border-red-200">{errorMsg}</div>}
            <Button onClick={handleSubmit} disabled={loading} className="w-full gap-2 h-12" size="lg">
              <UserPlus className="w-5 h-5" /> {loading ? 'Tworzenie...' : 'Utwórz Konto'}
            </Button>
          </div>
        </div>
      </div>
    </PanelLayout>
  );
}
