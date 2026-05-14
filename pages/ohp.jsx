import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import '../lib/i18n';
import '../styles/globals.css';

const voivodeships = [
  'Dolnośląskie',
  'Kujawsko-pomorskie',
  'Lubelskie',
  'Lubuskie',
  'Łódzkie',
  'Małopolskie',
  'Mazowieckie',
  'Opolskie',
  'Podkarpackie',
  'Podlaskie',
  'Pomorskie',
  'Śląskie',
  'Świętokrzyskie',
  'Warmińsko-mazurskie',
  'Wielkopolskie',
  'Zachodniopomorskie'
];

export default function OHP() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    voivodeship: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [affiliateCode, setAffiliateCode] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Usuń błąd dla tego pola po rozpoczęciu edycji
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Imię jest wymagane';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Nazwisko jest wymagane';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email jest wymagany';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Nieprawidłowy format adresu email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Numer telefonu jest wymagany';
    } else if (!/^[0-9+\-\s()]+$/.test(formData.phone)) {
      newErrors.phone = 'Nieprawidłowy format numeru telefonu';
    }

    if (!formData.voivodeship) {
      newErrors.voivodeship = 'Województwo jest wymagane';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch('/api/ohp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setAffiliateCode(data.affiliateCode);
        // Opcjonalnie: wyczyść formularz
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          voivodeship: ''
        });
      } else {
        setErrors({ submit: data.message || 'Wystąpił błąd podczas rejestracji' });
      }
    } catch (error) {
      console.error('Błąd:', error);
      setErrors({ submit: 'Wystąpił błąd podczas wysyłania formularza. Spróbuj ponownie.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Rejestracja OHP - StrefaStartu</title>
        <meta name="description" content="Formularz rejestracyjny OHP" />
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
              <Link href="/">
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="text-gray-600 hover:text-fuchsia-700 transition-colors font-medium"
                >
                  Powrót do strony głównej
                </motion.span>
              </Link>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
          >
            {success ? (
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="mb-6"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </motion.div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Rejestracja zakończona pomyślnie!
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Twoja rejestracja została zapisana w naszej bazie danych.
                </p>
                <div className="bg-fuchsia-50 border-2 border-fuchsia-200 rounded-lg p-6 mb-6">
                  <p className="text-sm text-gray-600 mb-2">Twój kod afiliacyjny:</p>
                  <p className="text-3xl font-bold text-fuchsia-700 tracking-wider">
                    {affiliateCode}
                  </p>
                </div>
                <p className="text-sm text-gray-500 mb-6">
                  Zapisz ten kod - będzie Ci potrzebny do dalszej współpracy.
                </p>
                <Link href="/">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-fuchsia-700 to-purple-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Powrót do strony głównej
                  </motion.button>
                </Link>
              </div>
            ) : (
              <>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  Rejestracja OHP
                </h1>
                <p className="text-gray-600 mb-8">
                  Wypełnij formularz, aby zarejestrować się w systemie OHP. Po rejestracji otrzymasz unikalny kod afiliacyjny.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Imię */}
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-semibold mb-2 text-gray-700">
                      Imię <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all ${
                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Wprowadź imię"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                    )}
                  </div>

                  {/* Nazwisko */}
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-semibold mb-2 text-gray-700">
                      Nazwisko <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all ${
                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Wprowadź nazwisko"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold mb-2 text-gray-700">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="twoj.email@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>

                  {/* Numer telefonu */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold mb-2 text-gray-700">
                      Numer telefonu <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="+48 123 456 789"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                    )}
                  </div>

                  {/* Województwo */}
                  <div>
                    <label htmlFor="voivodeship" className="block text-sm font-semibold mb-2 text-gray-700">
                      Województwo <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="voivodeship"
                      name="voivodeship"
                      value={formData.voivodeship}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all ${
                        errors.voivodeship ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Wybierz województwo</option>
                      {voivodeships.map((voivodeship) => (
                        <option key={voivodeship} value={voivodeship}>
                          {voivodeship}
                        </option>
                      ))}
                    </select>
                    {errors.voivodeship && (
                      <p className="mt-1 text-sm text-red-500">{errors.voivodeship}</p>
                    )}
                  </div>

                  {/* Błąd ogólny */}
                  {errors.submit && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-sm text-red-600">{errors.submit}</p>
                    </div>
                  )}

                  {/* Przycisk submit */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    className={`w-full bg-gradient-to-r from-fuchsia-700 to-purple-700 text-white px-8 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? 'Rejestrowanie...' : 'Zarejestruj się'}
                  </motion.button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
}
