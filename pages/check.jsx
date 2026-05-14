import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import '../styles/globals.css';

export default function Check() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [storedPassword, setStoredPassword] = useState(''); // Przechowuj hasło dla eksportu
  const [passwordError, setPasswordError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [ohpPersons, setOhpPersons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [expandedOHP, setExpandedOHP] = useState(new Set());
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingUser, setIsExportingUser] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setIsLoggingIn(true);

    try {
      const response = await fetch('/api/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'login',
          password: password
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
        setStoredPassword(password); // Zapisz hasło dla eksportu
        setPassword(''); // Wyczyść pole input
        // Automatycznie załaduj dane OHP po zalogowaniu
        loadOHPData(password);
      } else {
        setPasswordError(data.message || 'Nieprawidłowe hasło');
      }
    } catch (error) {
      console.error('Błąd logowania:', error);
      setPasswordError('Wystąpił błąd podczas logowania');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const loadOHPData = async (pwd) => {
    setIsLoading(true);
    setLoadError('');

    try {
      const response = await fetch('/api/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'getAllOHP',
          password: pwd
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOhpPersons(data.ohpPersons || []);
      } else {
        setLoadError(data.message || 'Nie udało się załadować danych');
      }
    } catch (error) {
      console.error('Błąd ładowania danych:', error);
      setLoadError('Wystąpił błąd podczas ładowania danych');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleOHP = (ohpId) => {
    const newExpanded = new Set(expandedOHP);
    if (newExpanded.has(ohpId)) {
      newExpanded.delete(ohpId);
    } else {
      newExpanded.add(ohpId);
    }
    setExpandedOHP(newExpanded);
  };

  const handleExportAll = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/export-ohp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: storedPassword,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `OHP_Wszystkie_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const data = await response.json();
        alert(data.message || 'Błąd podczas eksportu');
      }
    } catch (error) {
      console.error('Błąd eksportu:', error);
      alert('Wystąpił błąd podczas eksportu');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportUser = async (ohpId) => {
    setIsExportingUser(ohpId);
    try {
      const response = await fetch('/api/export-ohp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: storedPassword,
          ohpId: ohpId,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const ohpPerson = ohpPersons.find(p => p.id === ohpId);
        const fileName = `OHP_${ohpPerson?.affiliate_code || ohpId}_${new Date().toISOString().split('T')[0]}.xlsx`;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const data = await response.json();
        alert(data.message || 'Błąd podczas eksportu');
      }
    } catch (error) {
      console.error('Błąd eksportu:', error);
      alert('Wystąpił błąd podczas eksportu');
    } finally {
      setIsExportingUser(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAuthenticated) {
    return (
      <>
        <Head>
          <title>Sprawdź kod polecający - StrefaStartu</title>
          <meta name="description" content="Sprawdź dane osoby i zarejestrowanych beneficjentów" />
          <link rel="icon" href="/img/favicon.ico" />
        </Head>

        <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-white to-purple-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-md w-full"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Sprawdź kod polecający
              </h1>
              <p className="text-gray-600">
                Wprowadź hasło, aby uzyskać dostęp
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-semibold mb-2 text-gray-700">
                  Hasło <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError('');
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all ${
                    passwordError ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Wprowadź hasło"
                  required
                />
                {passwordError && (
                  <p className="mt-1 text-sm text-red-500">{passwordError}</p>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={isLoggingIn}
                whileHover={{ scale: isLoggingIn ? 1 : 1.02 }}
                whileTap={{ scale: isLoggingIn ? 1 : 0.98 }}
                className={`w-full bg-gradient-to-r from-fuchsia-700 to-purple-700 text-white px-8 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all ${
                  isLoggingIn ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoggingIn ? 'Logowanie...' : 'Zaloguj się'}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/">
                <span className="text-sm text-gray-600 hover:text-fuchsia-700 transition-colors">
                  Powrót do strony głównej
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Sprawdź kod polecający - StrefaStartu</title>
        <meta name="description" content="Sprawdź dane osoby i zarejestrowanych beneficjentów" />
        <link rel="icon" href="/img/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-white to-purple-50">
        {/* Header */}
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <Link href="/">
                <motion.span whileHover={{ scale: 1.05 }} className="cursor-pointer inline-block">
                  <img src="/img/logo.svg" alt="StrefaStartu" className="h-24 w-auto" />
                </motion.span>
              </Link>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    setIsAuthenticated(false);
                    setOhpPersons([]);
                    setPassword('');
                    setStoredPassword('');
                    setExpandedOHP(new Set());
                    setLoadError('');
                  }}
                  className="text-gray-600 hover:text-fuchsia-700 transition-colors font-medium"
                >
                  Wyloguj
                </button>
                <Link href="/">
                  <span className="text-gray-600 hover:text-fuchsia-700 transition-colors font-medium">
                    Strona główna
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
          >
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Lista osób OHP
              </h1>
              <div className="flex gap-3">
                <motion.button
                  onClick={handleExportAll}
                  disabled={isExporting || ohpPersons.length === 0}
                  whileHover={{ scale: isExporting ? 1 : 1.02 }}
                  whileTap={{ scale: isExporting ? 1 : 0.98 }}
                  className={`bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all text-sm flex items-center gap-2 ${
                    isExporting || ohpPersons.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {isExporting ? 'Eksportowanie...' : 'Eksportuj wszystko'}
                </motion.button>
              <motion.button
                onClick={() => loadOHPData(storedPassword)}
                disabled={isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  className={`bg-gradient-to-r from-fuchsia-700 to-purple-700 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all text-sm ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? 'Ładowanie...' : 'Odśwież'}
                </motion.button>
              </div>
            </div>

            {loadError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-600">{loadError}</p>
              </div>
            )}

            {isLoading && (
              <div className="text-center py-12">
                <p className="text-gray-600">Ładowanie danych...</p>
              </div>
            )}

            {!isLoading && ohpPersons.length === 0 && !loadError && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <p className="text-gray-600">Brak zarejestrowanych osób OHP</p>
              </div>
            )}

            {/* Lista osób OHP */}
            <div className="space-y-4">
              {ohpPersons.map((ohpPerson) => (
                <motion.div
                  key={ohpPerson.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Nagłówek osoby OHP */}
                  <button
                    onClick={() => toggleOHP(ohpPerson.id)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Imię i nazwisko</p>
                        <p className="font-semibold text-gray-900">
                          {ohpPerson.first_name} {ohpPerson.last_name}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Email</p>
                        <p className="text-sm text-gray-700">{ohpPerson.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Kod afiliacyjny</p>
                        <p className="text-sm font-semibold text-fuchsia-700">{ohpPerson.affiliate_code}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Wysłane formularze</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {ohpPerson.beneficiaries?.length || 0} {ohpPerson.beneficiaries?.length === 1 ? 'formularz' : 'formularzy'}
                        </p>
                      </div>
                    </div>
                    <div className="ml-4">
                      <svg
                        className={`w-5 h-5 text-gray-400 transition-transform ${
                          expandedOHP.has(ohpPerson.id) ? 'transform rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  {/* Rozwinięta sekcja z beneficjentami */}
                  <AnimatePresence>
                    {expandedOHP.has(ohpPerson.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                Szczegóły osoby OHP
                              </h3>
                              <motion.button
                                onClick={() => handleExportUser(ohpPerson.id)}
                                disabled={isExportingUser === ohpPerson.id}
                                whileHover={{ scale: isExportingUser === ohpPerson.id ? 1 : 1.05 }}
                                whileTap={{ scale: isExportingUser === ohpPerson.id ? 1 : 0.95 }}
                                className={`bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all text-xs flex items-center gap-2 ${
                                  isExportingUser === ohpPerson.id ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                {isExportingUser === ohpPerson.id ? 'Eksportowanie...' : 'Eksportuj'}
                              </motion.button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600">Telefon</p>
                                <p className="font-medium">{ohpPerson.phone || '-'}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Województwo</p>
                                <p className="font-medium">{ohpPerson.voivodeship || '-'}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Data rejestracji</p>
                                <p className="font-medium">{formatDate(ohpPerson.created_at)}</p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                              Wysłane formularze ({ohpPerson.beneficiaries?.length || 0})
                            </h3>
                            {ohpPerson.beneficiaries && ohpPerson.beneficiaries.length > 0 ? (
                              <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                                  <thead className="bg-gray-100">
                                    <tr>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                                        Imię i nazwisko
                                      </th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                                        Email
                                      </th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                                        Telefon
                                      </th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                                        Czy beneficjent?
                                      </th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                                        Data wypełnienia formularza
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200">
                                    {ohpPerson.beneficiaries.map((beneficiary) => (
                                      <tr key={beneficiary.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                          {beneficiary.full_name || '-'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                          {beneficiary.email || '-'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                          {beneficiary.phone || '-'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-center">
                                          {beneficiary.isBeneficiary ? (
                                            <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full">
                                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                              </svg>
                                            </span>
                                          ) : (
                                            <span className="inline-flex items-center justify-center w-6 h-6 bg-red-100 text-red-600 rounded-full">
                                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                              </svg>
                                            </span>
                                          )}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                          {formatDate(beneficiary.created_at)}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                                <p className="text-gray-500 text-sm">Brak wysłanych formularzy</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
