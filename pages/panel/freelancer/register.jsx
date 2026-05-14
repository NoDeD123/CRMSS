import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowLeft, UserPlus, Phone, IdCard } from 'lucide-react';
import '../../../styles/globals.css';

const LEGAL_DOCS = {
  regulamin: '/docs/regulamin.pdf',
  rodo: '/docs/rodo.pdf',
  privacy: '/docs/polityka.pdf',
  cookies: '/docs/cookie.pdf',
};

export default function FreelancerRegister() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [pesel, setPesel] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptRegulamin, setAcceptRegulamin] = useState(false);
  const [acceptRodo, setAcceptRodo] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [acceptCookies, setAcceptCookies] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Hasła nie są identyczne');
      return;
    }

    if (!acceptRegulamin || !acceptRodo || !acceptPrivacy || !acceptCookies) {
      setErrorMsg(
        'Musisz zaakceptować Regulamin, Politykę RODO, Politykę prywatności oraz Politykę cookies.'
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/freelancer/sign-up', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          phone,
          pesel,
          email,
          password,
          acceptRegulamin,
          acceptRodo,
          acceptPrivacy,
          acceptCookies,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        const pending = data?.data?.needsEmailVerification;
        router.push(
          pending
            ? '/panel/freelancer/dashboard?pendingVerification=1'
            : '/panel/freelancer/dashboard?registered=1'
        );
      } else {
        setErrorMsg(data.message || data.error || 'Nie udało się zarejestrować');
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
        <title>Rejestracja freelancera | Strefa Startu</title>
      </Head>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <img src="/img/logo.png" alt="Strefa Startu" className="h-32 w-auto" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Załóż konto freelancera
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Masz już konto?{' '}
          <Link href="/panel/freelancer/login" className="font-medium text-fuchsia-600 hover:text-fuchsia-500">
            Zaloguj się
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100"
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  Imię
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm"
                    placeholder="Jan"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Nazwisko
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm"
                    placeholder="Kowalski"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Numer telefonu
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm"
                  placeholder="+48 600 700 800"
                />
              </div>
            </div>

            <div>
              <label htmlFor="pesel" className="block text-sm font-medium text-gray-700">
                PESEL
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IdCard className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="pesel"
                  name="pesel"
                  inputMode="numeric"
                  autoComplete="off"
                  required
                  value={pesel}
                  onChange={(e) => setPesel(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm"
                  placeholder="11 cyfr"
                  maxLength={15}
                />
              </div>
            </div>

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
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm"
                  placeholder="min. 8 znaków"
                  minLength={8}
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Powtórz hasło
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm"
                  placeholder="••••••••"
                  minLength={8}
                />
              </div>
            </div>

            <fieldset className="space-y-4 rounded-lg border border-gray-200 bg-gray-50/80 p-4">
              <legend className="text-sm font-semibold text-gray-900 px-1">
                Zgody <span className="text-red-500">*</span>
              </legend>
              <p className="text-xs text-gray-600 -mt-1 mb-2">
                Rejestracja konta freelancera wymaga zapoznania się i akceptacji poniższych treści. Zaznacz każde pole osobno.
              </p>

              <label className="flex cursor-pointer items-start gap-3 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={acceptRegulamin}
                  onChange={(e) => setAcceptRegulamin(e.target.checked)}
                  required
                  className="mt-1 h-4 w-4 flex-shrink-0 rounded border-gray-300 text-fuchsia-600 focus:ring-fuchsia-500"
                />
                <span>
                  Zapoznałem(-am) się z treścią{' '}
                  <Link
                    href={LEGAL_DOCS.regulamin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-fuchsia-600 hover:underline"
                  >
                    Regulaminu
                  </Link>{' '}
                  i akceptuję jego postanowienia (w tym warunki świadczenia usług drogą elektroniczną).{' '}
                  <span className="text-red-500">*</span>
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={acceptRodo}
                  onChange={(e) => setAcceptRodo(e.target.checked)}
                  required
                  className="mt-1 h-4 w-4 flex-shrink-0 rounded border-gray-300 text-fuchsia-600 focus:ring-fuchsia-500"
                />
                <span>
                  Wyrażam zgodę na przetwarzanie moich danych osobowych zgodnie z{' '}
                  <Link
                    href={LEGAL_DOCS.rodo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-fuchsia-600 hover:underline"
                  >
                    Polityką RODO
                  </Link>{' '}
                  (w zakresie niezbędnym do prowadzenia konta i świadczenia usług).{' '}
                  <span className="text-red-500">*</span>
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={acceptPrivacy}
                  onChange={(e) => setAcceptPrivacy(e.target.checked)}
                  required
                  className="mt-1 h-4 w-4 flex-shrink-0 rounded border-gray-300 text-fuchsia-600 focus:ring-fuchsia-500"
                />
                <span>
                  Akceptuję{' '}
                  <Link
                    href={LEGAL_DOCS.privacy}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-fuchsia-600 hover:underline"
                  >
                    Politykę prywatności
                  </Link>
                  . <span className="text-red-500">*</span>
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={acceptCookies}
                  onChange={(e) => setAcceptCookies(e.target.checked)}
                  required
                  className="mt-1 h-4 w-4 flex-shrink-0 rounded border-gray-300 text-fuchsia-600 focus:ring-fuchsia-500"
                />
                <span>
                  Akceptuję{' '}
                  <Link
                    href={LEGAL_DOCS.cookies}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-fuchsia-600 hover:underline"
                  >
                    Politykę plików cookies
                  </Link>
                  . <span className="text-red-500">*</span>
                </span>
              </label>
            </fieldset>

            {errorMsg && (
              <div className="rounded-md bg-red-50 p-4 border border-red-200">
                <h3 className="text-sm font-medium text-red-800">{errorMsg}</h3>
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
                    Rejestracja...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Załóż konto <UserPlus size={18} />
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
