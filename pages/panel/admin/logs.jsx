import React from 'react';
import PanelLayout from '@/components/Layout/PanelLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';

export default function AuditLogs() {
  const logs = [
    { id: 101, user: 'admin@strefa.pl', action: 'UPDATE_SETTINGS', details: 'Zmieniono kolor główny na #4f46e5', date: '2023-10-25 14:30:22', ip: '192.168.1.1' },
    { id: 102, user: 'piotr@example.com', action: 'LOGIN_SUCCESS', details: 'Zalogowano pomyślnie', date: '2023-10-25 14:15:00', ip: '89.12.34.56' },
    { id: 103, user: 'admin@strefa.pl', action: 'DELETE_USER', details: 'Usunięto użytkownika ID: 45', date: '2023-10-25 13:45:12', ip: '192.168.1.1' },
    { id: 104, user: 'system', action: 'CRON_JOB', details: 'Wygenerowano raporty dzienne', date: '2023-10-25 00:00:01', ip: 'localhost' },
    { id: 105, user: 'nieznany', action: 'LOGIN_FAILED', details: 'Błędne hasło dla admin@strefa.pl', date: '2023-10-24 23:15:44', ip: '111.222.333.444' },
  ];

  const getActionBadge = (action) => {
    if (action.includes('SUCCESS')) return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{action}</Badge>;
    if (action.includes('FAILED') || action.includes('DELETE')) return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">{action}</Badge>;
    if (action.includes('UPDATE') || action.includes('CREATE')) return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{action}</Badge>;
    return <Badge variant="outline">{action}</Badge>;
  };

  return (
    <PanelLayout role="admin">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Logi Systemowe</h1>
        <p className="text-gray-500 text-sm mt-1">Dziennik zdarzeń i audytu bezpieczeństwa</p>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Szukaj w logach (użytkownik, IP, szczegóły)..." className="pl-9" />
            </div>
            <div className="flex gap-2">
              <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background w-40">
                <option value="">Wszystkie typy</option>
                <option value="auth">Autoryzacja</option>
                <option value="system">Systemowe</option>
                <option value="users">Użytkownicy</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors text-sm">
                <Filter className="w-4 h-4" /> Filtry
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data i Czas</TableHead>
                <TableHead>Akcja</TableHead>
                <TableHead>Użytkownik / Zródło</TableHead>
                <TableHead>Adres IP</TableHead>
                <TableHead>Szczegóły</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id} className="text-sm">
                  <TableCell className="whitespace-nowrap text-gray-500">{log.date}</TableCell>
                  <TableCell>{getActionBadge(log.action)}</TableCell>
                  <TableCell className="font-medium">{log.user}</TableCell>
                  <TableCell className="font-mono text-xs text-gray-500">{log.ip}</TableCell>
                  <TableCell className="text-gray-600 truncate max-w-xs" title={log.details}>
                    {log.details}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="p-4 border-t flex items-center justify-between text-sm text-gray-500">
            <span>Pokazywanie 1-5 z 1250 wpisów</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50" disabled>Poprzednia</button>
              <button className="px-3 py-1 border rounded hover:bg-gray-50">Następna</button>
            </div>
          </div>
        </CardContent>
      </Card>
    </PanelLayout>
  );
}
