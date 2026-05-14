import { motion, AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import '../lib/i18n';
import '../styles/globals.css';
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const menuLinks = [
  { label: 'Strona Główna', href: '/' },
  { label: 'O nas', href: '/about' },
  { label: 'Kalkulator', href: '/calculator' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Kontakt', href: '/contact' },
  { label: 'Dołącz do nas', href: '/join_us' }
];

// Definicje animacji
const pageVariants = {
  initial: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: 0.6, ease: 'easeInOut' } },
  exit: { opacity: 0, transition: { duration: 0.3, ease: 'easeInOut' } },
};

const checkVariants = {
  unchecked: { pathLength: 0 },
  checked: { pathLength: 1, transition: { duration: 0.3 } },
};

const slideUp = {
  hidden: { y: 40, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeInOut' } },
};

// Przełącznik językowy
const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const router = useRouter();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    router.push(router.pathname, router.asPath, { locale: lng });
  };

  return (
    <motion.div className="flex gap-3">
      {['pl', 'en', 'ua'].map((lang) => (
        <motion.button
          key={lang}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => changeLanguage(lang)}
          className={`px-3 py-1 rounded-md transition-colors ${
            router.locale === lang
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          {lang.toUpperCase()}
        </motion.button>
      ))}
    </motion.div>
  );
};

export default function EntrepreneurshipTestPage() {
  const { t } = useTranslation('common');
  const router = useRouter();

  // Dodane zmienne dla menu mobilnego
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen((prev) => !prev);

  // Krok 1: Pytania ankiety (4 pytania TAK/NIE)
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState(Array(4).fill(null));

  // Krok 2: Formularz danych kontaktowych
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [gdprConsent, setGdprConsent] = useState(false);

  const questions = [
    t('entrepreneurTest.question1', 'Czy masz już pomysł na swój biznes?'),
    t('entrepreneurTest.question2', 'Czy wiesz, co zrobić, by otworzyć działalność?'),
    t('entrepreneurTest.question3', 'Czy Twój pomysł wymaga inwestycji?'),
    t('entrepreneurTest.question4', 'Czy masz już doświadczenie w wybranej branży?'),
  ];

  // Definicja komunikatów dla każdego pytania – klucze tłumaczeń i domyślne teksty
  const messages = [
    {
      true: 'entrepreneurTest.messages.q1.true',
      false: 'entrepreneurTest.messages.q1.false',
      defaultYes:
        'To świetny start! Masz już wizję, teraz czas przekuć ją w realne działania. W Strefie Startu pomożemy Ci wystartować bez zbędnych formalności, abyś mógł skupić się na rozwoju swojego pomysłu.',
      defaultNo:
        'Brak konkretnego pomysłu to nie problem – najważniejsze, że masz chęć działania! Skontaktuj się z nami, a pomożemy Ci odkryć potencjalne kierunki i znaleźć najlepszy sposób na rozpoczęcie własnego biznesu.',
    },
    {
      true: 'entrepreneurTest.messages.q2.true',
      false: 'entrepreneurTest.messages.q2.false',
      defaultYes:
        'Wiesz, jak zacząć, ale co potem? Skuteczne prowadzenie biznesu wymaga czegoś więcej niż tylko rejestracji firmy. W Strefie Startu zdejmujemy z Ciebie ciężar formalności, abyś mógł skupić się na rozwijaniu swojej działalności.',
      defaultNo:
        'Formalności mogą wydawać się skomplikowane, ale nie muszą Cię powstrzymywać! W Strefie Startu możesz działać bez konieczności zakładania firmy – my zajmiemy się papierkową robotą, a Ty zyskasz czas na rozwój swojego pomysłu.',
    },
    {
      true: 'entrepreneurTest.messages.q3.true',
      false: 'entrepreneurTest.messages.q3.false',
      defaultYes:
        'Każdy biznes wiąże się z pewnymi kosztami, ale nie musisz zaczynać od wielkich nakładów finansowych. W Strefie Startu masz szansę zarabiać i testować swój pomysł bez konieczności podejmowania dużych inwestycji.',
      defaultNo:
        'Jeśli Twój pomysł nie wymaga dużych nakładów finansowych, to znak, że możesz zacząć działać niemal od razu. My zapewnimy Ci wsparcie, dzięki któremu wystartujesz sprawnie i bez zbędnych przeszkód.',
    },
    {
      true: 'entrepreneurTest.messages.q4.true',
      false: 'entrepreneurTest.messages.q4.false',
      defaultYes:
        'Twoje umiejętności to ogromna wartość! Teraz możesz wykorzystać je na własnych warunkach, bez ograniczeń typowych dla pracy na etacie. W Strefie Startu pomożemy Ci skupić się na tym, co robisz najlepiej, eliminując biurokratyczne bariery.',
      defaultNo:
        'Nie musisz być ekspertem, aby zacząć! Najlepszym sposobem na zdobycie doświadczenia jest działanie w praktyce. Dzięki Strefie Startu możesz rozwijać swój biznes krok po kroku, bez ryzyka i zobowiązań.',
    },
  ];

  const handleAnswer = (index, answer) => {
    const newAnswers = [...answers];
    newAnswers[index] = answer;
    setAnswers(newAnswers);
  };

  const allAnswered = answers.every((ans) => ans !== null);

  const handleSubmitSurvey = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
  
    // Walidacja: sprawdzamy czy wszystkie zgody są zaznaczone
    if (!marketingConsent || !gdprConsent) {
      alert('Proszę zaznaczyć wszystkie zgody przed wysłaniem formularza.');
      return;
    }
  
    const formData = {
      answers,
      firstName,
      lastName,
      email,
      phone,
      marketingConsent,
      gdprConsent,
    };
  
    try {
      const response = await fetch('/api/mail_from_test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
  
      if (response.ok) {
        console.log('Email wysłany pomyślnie');
        // Przekierowanie na stronę główną (index)
        router.push('/');
      } else {
        console.error('Błąd wysyłania emaila');
      }
    } catch (error) {
      console.error('Błąd: ', error);
    }
  };
  
  // Obliczanie liczby odpowiedzi "Tak"
  const yesCount = answers.filter((ans) => ans === true).length;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={router.route}
        initial="initial"
        animate="enter"
        exit="exit"
        variants={pageVariants}
      >
        <Head>
          <link rel="icon" href="../img/favicon.ico" />
          <title>{t('entrepreneurTest.title', 'Test Przedsiębiorczości')}</title>
          <meta
            name="description"
            content={t(
              'entrepreneurTest.description',
              'Wypełnij ankietę, aby sprawdzić swój potencjał przedsiębiorczy.'
            )}
          />
          <link rel="icon" href="../img/favicon.ico" />
        </Head>
        <div className="min-h-screen flex flex-col">
          {/* Navbar with Hamburger Menu */}
          <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 100 }}
            className="absolute top-0 left-0 w-full bg-white/80 backdrop-blur-md shadow-sm sticky z-50"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-20">
                <Link href="/">
                  <motion.span whileHover={{ scale: 1.05 }} className="cursor-pointer inline-block">
                    <Image src="/img/logo.svg" alt="StrefaStartu" width={96} height={96} className="h-24 w-auto" priority />
                  </motion.span>
                </Link>
                {/* Desktop Menu */}
                <nav className="hidden md:flex space-x-8 items-center">
                  {['about', 'calculator', 'faq', 'contact'].map((link) => (
                    <a href={`/${link}`} key={link} className="hover:text-gray-900 transition-colors duration-200 block">
                      {t(link)}
                    </a>
                  ))}
                  <a href="https://crm.strefastartu.pl" target="_blank" rel="noopener noreferrer">
                    <motion.span whileHover={{ scale: 1.05 }} className="text-gray-600 hover:text-fuchsia-700 transition-colors font-medium">
                      {t('login')}
                    </motion.span>
                  </a>
                  <LanguageSwitcher />
                  <Link href="/join_us">
                    <motion.span whileHover={{ scale: 1.05 }} className="ml-4 bg-gradient-to-r from-fuchsia-700 to-fuchsia-900 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity shadow-md">
                      {t('getStarted')}
                    </motion.span>
                  </Link>
                </nav>
                {/* Hamburger Icon for mobile */}
                <div className="md:hidden">
                  <button onClick={toggleMenu} className="focus:outline-none">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {isOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      )}
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            {/* Mobile Menu */}
            {isOpen && (
              <div className="md:hidden absolute top-20 left-0 right-0 bg-white shadow-lg z-50">
                <nav className="px-2 pt-2 pb-3 space-y-1">
                  {['about', 'calculator', 'contact', 'faq'].map((link) => (
                    <a
                      href={`/${link}`}
                      key={link}
                      className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50"
                    >
                      {t(link)}
                    </a>
                  ))}
                  <a 
                    href="https://crm.strefastartu.pl" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50"
                  >
                    {t('login')}
                  </a>
                  <LanguageSwitcher />
                  <Link href="/join_us">
                    <span className="block px-3 py-2 rounded-md text-base font-medium bg-gradient-to-r from-fuchsia-700 to-fuchsia-900 text-white hover:opacity-90 cursor-pointer">
                      {t('getStarted')}
                    </span>
                  </Link>
                </nav>
              </div>
            )}
          </motion.header>

          {/* Krok 1: Ankieta z pytaniami */}
          {step === 1 && (
            <section className="py-20 bg-gradient-to-b from-purple-50 to-white">
              <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.h2
                  initial={slideUp.hidden}
                  whileInView={slideUp.visible}
                  className="text-4xl font-extrabold text-center text-purple-900 mb-12"
                >
                  {t('entrepreneurTest.header', 'Test Przedsiębiorczości')}
                </motion.h2>
                <form onSubmit={handleSubmitSurvey}>
                  {questions.map((question, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className="mb-8 p-8 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow"
                    >
                      {/* Kontener flex z warunkowym ustawieniem kolejności */}
                      <div className={`flex items-center ${index % 2 === 1 ? 'flex-row-reverse' : 'flex-row'}`}>
                        {/* Sekcja obrazu */}
                        <div className="w-1/4">
                          <Image
                            src={`/img/question-${index + 1}.png`}
                            alt={`Pytanie ${index + 1}`}
                            width={200}
                            height={150}
                            quality={75}
                            loading="lazy"
                            className="w-full h-auto object-cover rounded-lg"
                            sizes="(max-width: 768px) 50vw, 200px"
                          />
                        </div>
                        {/* Sekcja treści */}
                        <div className="w-1/2 px-4">
                          <p className="text-xl font-semibold text-gray-800 mb-8">
                            {question}
                          </p>
                          <div className="flex gap-6 justify-center">
                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleAnswer(index, true)}
                              className={`relative px-8 py-4 rounded-xl shadow-lg transition-all duration-300 ${
                                answers[index] === true
                                  ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white'
                                  : 'bg-white text-gray-800 border-2 border-gray-200 hover:border-green-500'
                              }`}
                            >
                              {answers[index] === true && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute -top-3 -right-3 bg-white rounded-full p-1 shadow-lg"
                                >
                                  <svg
                                    className="w-6 h-6 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <motion.path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 13l4 4L19 7"
                                      variants={checkVariants}
                                      initial="unchecked"
                                      animate="checked"
                                    />
                                  </svg>
                                </motion.div>
                              )}
                              <span className="text-lg font-medium">
                                {t('yes', 'Tak')}
                              </span>
                            </motion.button>

                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleAnswer(index, false)}
                              className={`relative px-8 py-4 rounded-xl shadow-lg transition-all duration-300 ${
                                answers[index] === false
                                  ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white'
                                  : 'bg-white text-gray-800 border-2 border-gray-200 hover:border-green-500'
                              }`}
                            >
                              {answers[index] === false && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute -top-3 -right-3 bg-white rounded-full p-1 shadow-lg"
                                >
                                  <svg
                                    className="w-6 h-6 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <motion.path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 13l4 4L19 7"
                                      variants={checkVariants}
                                      initial="unchecked"
                                      animate="checked"
                                    />
                                  </svg>
                                </motion.div>
                              )}
                              <span className="text-lg font-medium">
                                {t('no', 'Nie')}
                              </span>
                            </motion.button>
                          </div>
                          <AnimatePresence exitBeforeEnter>
                            {answers[index] !== null && (
                              <motion.p
                                key={answers[index] ? 'yes' : 'no'}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.3 }}
                                className="mt-4 text-lg text-gray-700"
                              >
                                {answers[index]
                                  ? t(messages[index].true, messages[index].defaultYes)
                                  : t(messages[index].false, messages[index].defaultNo)}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {allAnswered && (
                    <div className="text-center mt-8">
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-10 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                      >
                        {t('nextStep', 'Dalej')}
                      </motion.button>
                    </div>
                  )}
                </form>
              </div>
            </section>
          )}

          {/* Krok 2: Formularz danych osobowych */}
          {step === 2 && (
            <section className="py-20 bg-gradient-to-b from-purple-50 to-white">
              <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.h2
                  initial={slideUp.hidden}
                  whileInView={slideUp.visible}
                  className="text-4xl font-extrabold text-center text-purple-900 mb-12"
                >
                  {t('entrepreneurTest.contactHeader', 'Podaj swoje dane')}
                </motion.h2>

                <AnimatePresence>
                  {yesCount >= 2 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.6, ease: 'easeInOut' }}
                      className="mb-12 p-6 bg-green-50 border-l-4 border-green-400 rounded-md shadow-md"
                    >
                      <h3 className="text-2xl font-bold text-green-700 mb-3">
                        {t('entrepreneurTest.greatJob.title', 'Świetnie Ci idzie!')}
                      </h3>
                      <p className="text-lg text-green-800">
                        {t(
                          'entrepreneurTest.greatJob.content',
                          'Masz już solidne podstawy, by myśleć o własnym biznesie. Zostaw swoje dane, abyśmy mogli się z Tobą skontaktować i pomóc Ci w dalszych krokach!'
                        )}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form
                  onSubmit={handleSubmitForm}
                  className="bg-white p-8 rounded-2xl shadow-xl"
                >
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label
                        htmlFor="firstName"
                        className="block text-purple-900 font-semibold mb-3"
                      >
                        {t('form.firstName', 'Imię')}
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder={t('form.firstNamePlaceholder', 'Wpisz swoje imię')}
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                        required
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <label
                        htmlFor="lastName"
                        className="block text-purple-900 font-semibold mb-3"
                      >
                        {t('form.lastName', 'Nazwisko')}
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder={t('form.lastNamePlaceholder', 'Wpisz swoje nazwisko')}
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                        required
                      />
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mb-8"
                  >
                    <label
                      htmlFor="email"
                      className="block text-purple-900 font-semibold mb-3"
                    >
                      {t('form.email', 'Email')}
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('form.emailPlaceholder', 'Wpisz swój email')}
                      className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                      required
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mb-8"
                  >
                    <label
                      htmlFor="phone"
                      className="block text-purple-900 font-semibold mb-3"
                    >
                      {t('form.phone', 'Numer telefonu')}
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t('form.phonePlaceholder', 'Wpisz swój numer telefonu')}
                      className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="space-y-6 mb-10"
                  >
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="marketingConsent"
                          type="checkbox"
                          checked={marketingConsent}
                          onChange={(e) => setMarketingConsent(e.target.checked)}
                          className="w-5 h-5 text-purple-600 border-2 border-purple-300 rounded focus:ring-purple-500 transition"
                        />
                      </div>
                      <label htmlFor="marketingConsent" className="ml-3 text-gray-700">
                        {t(
                          'form.marketingConsent',
                          'Wyrażam zgodę na przesyłanie informacji marketingowych'
                        )}
                      </label>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="gdprConsent"
                          type="checkbox"
                          checked={gdprConsent}
                          onChange={(e) => setGdprConsent(e.target.checked)}
                          className="w-5 h-5 text-purple-600 border-2 border-purple-300 rounded focus:ring-purple-500 transition"
                          required
                        />
                      </div>
                      <label htmlFor="gdprConsent" className="ml-3 text-gray-700">
                        {t(
                          'form.gdprConsent',
                          'Wyrażam zgodę na przetwarzanie danych osobowych zgodnie z RODO'
                        )}
                      </label>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-center"
                  >
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-10 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                      {t('form.submit', 'Wyślij')}
                    </motion.button>
                  </motion.div>
                </form>
              </div>
            </section>
          )}

          {/* Stopka */}
          <motion.footer
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-gray-50 border-t border-gray-200 mt-auto"
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Dane firmy */}
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Fundacja Strefa Startu</h3>
                  <div className="text-gray-600 text-sm space-y-3">
                    <div className="flex">
                      <MapPinIcon className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>ul. Wschodnia 1A, 99-300 Kutno</span>
                    </div>
                    <p>NIP: 7752676034</p>
                    <div className="flex items-center">
                      <PhoneIcon className="h-4 w-4 mr-2" />
                      <span>(24) 337 11 60</span>
                    </div>
                    <div className="flex items-center">
                      <EnvelopeIcon className="h-4 w-4 mr-2" />
                      <span>kontakt@strefastartu.pl</span>
                    </div>
                  </div>
                </div>

                {/* Linki z menu */}
                <div className="mt-4 md:mt-0">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center md:text-left">Nawigacja</h3>
                  <nav className="flex flex-col space-y-2 text-gray-600 text-sm items-center md:items-start">
                    {menuLinks.map(({ label, href }) => (
                      <a 
                        key={label}
                        href={href}
                        className="hover:text-gray-900 transition-colors duration-200 hover:underline w-full text-center md:text-left"
                      >
                        {label}
                      </a>
                    ))}
                  </nav>
                </div>

                {/* Linki do dokumentów */}
                <div className="mt-4 md:mt-0">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center md:text-left">Dokumenty</h3>
                  <nav className="flex flex-col space-y-2 text-gray-600 text-sm items-center md:items-start">
                    {['Regulamin', 'Polityka RODO', 'Polityka Prywatności', 'Polityka Cookies'].map((item) => (
                      <a 
                        href={`/${item.toLowerCase().replace(' ', '-')}`} 
                        className="hover:text-gray-900 transition-colors duration-200 hover:underline w-full text-center md:text-left"
                        key={item}
                      >
                        {item}
                      </a>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Dolna część stopki */}
              <div className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-500 text-xs">
                <p>&copy; {new Date().getFullYear()} StrefaStartu. Wszelkie prawa zastrzeżone.</p>
              </div>
            </div>
          </motion.footer>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
