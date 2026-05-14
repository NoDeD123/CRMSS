import React, { useState } from 'react';
import PanelLayout from '@/components/Layout/PanelLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Upload, Palette, Shield, Mail } from 'lucide-react';

export default function SystemSettings() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <PanelLayout role="admin">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Ustawienia Systemu</h1>
          <p className="text-gray-500 text-sm mt-1">Konfiguracja wyglądu, działania i integracji platformy.</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="gap-2">
          <Save className="w-4 h-4" />
          {isSaving ? 'Zapisywanie...' : 'Zapisz Zmiany'}
        </Button>
      </div>

      <Tabs defaultValue="appearance" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="appearance" className="gap-2"><Palette className="w-4 h-4" /> Wygląd i UX</TabsTrigger>
          <TabsTrigger value="general" className="gap-2"><Shield className="w-4 h-4" /> Ogólne</TabsTrigger>
          <TabsTrigger value="email" className="gap-2"><Mail className="w-4 h-4" /> Powiadomienia Email</TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Branding Platformy</CardTitle>
              <CardDescription>Dostosuj logotypy i główne kolory systemu</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label>Logo Główne (Jasny Motyw)</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Kliknij, aby wgrać plik</span>
                    <span className="text-xs text-gray-400 mt-1">PNG, SVG lub JPG (max 2MB)</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Kolorystyka Głównego Motywu (Primary)</Label>
                  <div className="flex gap-4 items-center">
                    <Input type="color" defaultValue="#4f46e5" className="w-16 h-12 p-1 cursor-pointer" />
                    <Input type="text" defaultValue="#4f46e5" className="font-mono uppercase w-32" />
                  </div>
                  <p className="text-xs text-gray-500">Używany w przyciskach, linkach i aktywnych elementach UI.</p>
                </div>

                <div className="space-y-4">
                  <Label>Styl Zaokrągleń (Border Radius)</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                    <option value="sm">Małe (0.125rem)</option>
                    <option value="md">Średnie (0.375rem)</option>
                    <option value="lg" selected>Duże (0.5rem) - Domyślne</option>
                    <option value="full">Zaokrąglone (Pill)</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Podstawowe Informacje</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="siteName">Nazwa Platformy</Label>
                <Input id="siteName" defaultValue="Strefa Partnera" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="supportEmail">Główny Email Kontaktowy</Label>
                <Input id="supportEmail" type="email" defaultValue="kontakt@strefa.pl" />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                <div>
                  <h4 className="font-medium">Tryb Konserwacji</h4>
                  <p className="text-sm text-gray-500">Zablokuj dostęp do platformy dla wszystkich użytkowników (oprócz administratorów).</p>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-5 h-5 accent-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Ustawienia SMTP</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Serwer SMTP</Label>
                  <Input placeholder="smtp.example.com" />
                </div>
                <div className="space-y-2">
                  <Label>Port</Label>
                  <Input placeholder="587" />
                </div>
                <div className="space-y-2">
                  <Label>Użytkownik</Label>
                  <Input placeholder="user@example.com" />
                </div>
                <div className="space-y-2">
                  <Label>Hasło</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
              </div>
              <Button variant="outline" className="mt-4">Wyślij Email Testowy</Button>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </PanelLayout>
  );
}
