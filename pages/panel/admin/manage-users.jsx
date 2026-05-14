import React, { useState, useEffect } from 'react';
import PanelLayout from '@/components/Layout/PanelLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [coordinators, setCoordinators] = useState([]);
  const [selectedCoordinatorByUser, setSelectedCoordinatorByUser] = useState({});
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [assigningUserId, setAssigningUserId] = useState('');
  const [recordingPaymentUserId, setRecordingPaymentUserId] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append('search', search);
      if (roleFilter) queryParams.append('role', roleFilter);

      const res = await fetch(`/api/admin/users?${queryParams.toString()}`);
      const json = await res.json();

      if (res.ok && json.data) {
        setUsers(json.data);
        setSelectedCoordinatorByUser((prev) => {
          const next = { ...prev };
          json.data.forEach((user) => {
            if (['USER', 'FREELANCER'].includes(user.role) && next[user.id] === undefined) {
              next[user.id] = user.coordinatorId || '';
            }
          });
          return next;
        });
      } else {
        console.error('Failed to fetch users:', json.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCoordinators = async () => {
    try {
      const res = await fetch('/api/admin/users?role=COORDINATOR');
      const json = await res.json();
      if (res.ok && json.data) {
        setCoordinators(json.data);
      } else {
        setCoordinators([]);
      }
    } catch (err) {
      console.error(err);
      setCoordinators([]);
    }
  };

  useEffect(() => {
    // Basic debounce for search typing
    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [search, roleFilter]);

  useEffect(() => {
    fetchCoordinators();
  }, []);

  const mapRole = (role) => {
    const roles = {
      'USER': 'Beneficjent',
      'FREELANCER': 'Freelancer',
      'ADMIN': 'Administrator',
      'COORDINATOR': 'Koordynator',
      'ACCOUNTANT': 'Księgowy',
      'FINANCE': 'Finanse',
    };
    return roles[role] || role;
  };

  const getCoordinatorName = (coordinatorId) => {
    if (!coordinatorId) return 'Nieprzypisany';
    const coordinator = coordinators.find((item) => item.id === coordinatorId);
    if (!coordinator) return 'Nieprzypisany';
    const fullName = `${coordinator.firstName || ''} ${coordinator.lastName || ''}`.trim();
    return fullName || coordinator.email;
  };

  const handleCoordinatorSelect = (beneficiaryId, coordinatorId) => {
    setSelectedCoordinatorByUser((prev) => ({
      ...prev,
      [beneficiaryId]: coordinatorId
    }));
  };

  const handleAssignCoordinator = async (beneficiaryId) => {
    setAssigningUserId(beneficiaryId);
    try {
      const coordinatorId = selectedCoordinatorByUser[beneficiaryId] || null;
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          beneficiaryId,
          coordinatorId
        })
      });
      const json = await res.json();

      if (res.ok) {
        setUsers((prev) =>
          prev.map((user) =>
            user.id === beneficiaryId
              ? { ...user, coordinatorId: json.data?.coordinatorId || null }
              : user
          )
        );
      } else {
        console.error('Failed to assign coordinator:', json.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAssigningUserId('');
    }
  };

  const handleRecordPayment = async (beneficiaryId) => {
    setRecordingPaymentUserId(beneficiaryId);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          beneficiaryId,
          paymentRecorded: true
        })
      });
      const json = await res.json();

      if (res.ok) {
        setUsers((prev) =>
          prev.map((user) =>
            user.id === beneficiaryId
              ? { ...user, nextPaymentDate: json.data?.nextPaymentDate || user.nextPaymentDate }
              : user
          )
        );
      } else {
        console.error('Failed to record payment:', json.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRecordingPaymentUserId('');
    }
  };

  return (
    <PanelLayout role="admin">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Zarządzanie Użytkownikami</h1>
        <Button>Eksportuj do Excela</Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Input
              placeholder="Szukaj po nazwisku lub emailu..."
              className="max-w-md"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background w-48"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">Wszystkie role</option>
              <option value="ACCOUNTANT">Księgowy</option>
              <option value="FINANCE">Finanse</option>
              <option value="USER">Beneficjent</option>
              <option value="FREELANCER">Freelancer</option>
              <option value="COORDINATOR">Koordynator</option>
              <option value="ADMIN">Administrator</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista kont w systemie</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Imię i Nazwisko</TableHead>
                <TableHead>Rola</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Koordynator</TableHead>
                <TableHead className="text-right">Akcje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-6 text-gray-500">Wczytywanie...</TableCell></TableRow>
              ) : users.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-6 text-gray-500">Nie znaleziono użytkowników.</TableCell></TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.firstName || user.lastName ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Brak danych'}
                    </TableCell>
                    <TableCell>{mapRole(user.role)}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.role === 'FREELANCER' ? (
                        <Badge variant="secondary" className="bg-violet-100 text-violet-800 hover:bg-violet-100">
                          Freelancer
                        </Badge>
                      ) : user.role === 'USER' ? (
                        user.nextPaymentDate ? (
                          <Badge variant="success" className="bg-green-100 text-green-800 hover:bg-green-100">
                            Aktywny ({new Date(user.nextPaymentDate).toLocaleDateString()})
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Brak danych abonamentu</Badge>
                        )
                      ) : (
                        <span className="text-sm text-gray-500">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.role === 'USER' || user.role === 'FREELANCER' ? (
                        <div className="space-y-2">
                          <select
                            className="w-full flex h-9 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background"
                            value={selectedCoordinatorByUser[user.id] ?? user.coordinatorId ?? ''}
                            onChange={(e) => handleCoordinatorSelect(user.id, e.target.value)}
                          >
                            <option value="">Nieprzypisany</option>
                            {coordinators.map((coordinator) => {
                              const fullName = `${coordinator.firstName || ''} ${coordinator.lastName || ''}`.trim();
                              return (
                                <option key={coordinator.id} value={coordinator.id}>
                                  {fullName || coordinator.email}
                                </option>
                              );
                            })}
                          </select>
                          <p className="text-xs text-gray-500">
                            Aktualnie: {getCoordinatorName(user.coordinatorId)}
                          </p>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {user.role === 'USER' ? (
                        <div className="flex items-center justify-end gap-2 flex-wrap">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAssignCoordinator(user.id)}
                            disabled={assigningUserId === user.id}
                          >
                            {assigningUserId === user.id ? 'Zapisywanie...' : 'Zapisz przypisanie'}
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700"
                            onClick={() => handleRecordPayment(user.id)}
                            disabled={recordingPaymentUserId === user.id}
                          >
                            {recordingPaymentUserId === user.id ? 'Zapisywanie...' : 'Odnotuj płatność'}
                          </Button>
                        </div>
                      ) : user.role === 'FREELANCER' ? (
                        <div className="flex items-center justify-end gap-2 flex-wrap">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAssignCoordinator(user.id)}
                            disabled={assigningUserId === user.id}
                          >
                            {assigningUserId === user.id ? 'Zapisywanie...' : 'Zapisz przypisanie'}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-blue-600">Impersonuj</Button>
                          <Button variant="outline" size="sm">Edytuj</Button>
                        </div>
                      ) : (
                        <>
                          <Button variant="ghost" size="sm" className="mr-2 text-blue-600">Impersonuj</Button>
                          <Button variant="outline" size="sm">Edytuj</Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PanelLayout>
  );
}