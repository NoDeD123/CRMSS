import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';
import '../../../styles/globals.css';

export default function FreelancerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [registeredBanner, setRegisteredBanner] = useState(false);
  const [verifyBanner, setVerifyBanner] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (router.query.registered === '1') {
      setRegisteredBanner(true);
    }
  }, [router.query.registered]);

  useEffect(() => {
    const v = router.query.verify;
    const messages = {
      invalid: 'Link aktywacyjny jest nieprawidłowy lub został już użyty.',
      missing: 'Brak tokenu w linku aktywacyjnym.',
      error: 'Nie udało się aktywować konta. Zaloguj się i wyślij ponownie mail aktywacyjny z panelu.',
    };
    if (typeof v === 'string' && messages[v]) {
      setVerifyBanner(messages[v]);
    } else {
      setVerifyBanner('');
    }
  }, [router.query.verify]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login-freelancer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (res.ok) {
        router.push('/panel/freelancer/dashboard');
      } else {
        setErrorMsg(data.message || data.error || 'Nieprawidłowe dane logowania');
      }
    } catch (err) {
      setErrorMsg('Błąd połączenia z serwerem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Head>
        <title>Logowanie freelancera | Strefa Startu</title>
      </Head>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <img src="/img/logo.png" alt="Strefa Startu" className="h-32 w-auto" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Zaloguj się do panelu freelancera
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Jesteś beneficjentem?{' '}
          <Link href="/login" className="font-medium text-fuchsia-600 hover:text-fuchsia-500">
            Zaloguj się tutaj
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100"
        >
          <div className="mb-6 rounded-lg border border-fuchsia-200 bg-gradient-to-r from-fuchsia-50 to-pink-50 px-4 py-3 text-center sm:px-5 sm:py-4">
            <p className="text-sm font-medium text-gray-800">
              Nie masz konta?{' '}
              <Link
                href="/panel/freelancer/register"
                className="font-semibold text-fuchsia-700 underline-offset-2 hover:text-fuchsia-900 hover:underline"
              >
                Zarejestruj się
              </Link>
            </p>
            <p className="mt-1 text-xs text-gray-600">Założenie konta zajmie tylko chwilę</p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            {verifyBanner && (
              <div className="rounded-md bg-amber-50 p-4 border border-amber-200">
                <h3 className="text-sm font-medium text-amber-900">{verifyBanner}</h3>
              </div>
            )}
            {registeredBanner && (
              <div className="rounded-md bg-green-50 p-4 border border-green-200">
                <h3 className="text-sm font-medium text-green-800">
                  Konto zostało utworzone. Możesz się teraz zalogować.
                </h3>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adres e-mail
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm"
                  placeholder="twoj@email.pl"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Hasło
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-fuchsia-600 focus:ring-fuchsia-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Zapamiętaj mnie
                </label>
              </div>

              <div className="text-sm">
                <Link href="/forgot-password" className="font-medium text-fuchsia-600 hover:text-fuchsia-500">
                  Zapomniałeś hasła?
                </Link>
              </div>
            </div>

            {errorMsg && (
              <div className="rounded-md bg-red-50 p-4 border border-red-200">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{errorMsg}</h3>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logowanie...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Zaloguj się <LogIn size={18} />
                  </span>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <Link href="/" className="flex items-center justify-center text-sm font-medium text-gray-500 hover:text-gray-900 gap-2 transition-colors">
              <ArrowLeft size={16} /> Powrót na stronę główną
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
