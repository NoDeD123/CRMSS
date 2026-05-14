import { motion, AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import dynamic from 'next/dynamic';
import '../lib/i18n';
import '../styles/globals.css';

const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = {
    formId: 'form1', // lub "form2" albo "form3", w zależności od formularza
    fullName: e.target.fullName.value,
    phone: e.target.phone.value,
    email: e.target.email.value,
    subject: e.target.subject.value,
    message: e.target.message.value,
  };

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (res.ok) {
      alert(data.message);
      // Opcjonalnie: wyczyść formularz
    } else {
      alert(data.message || 'Błąd podczas wysyłania wiadomości');
    }
  } catch (error) {
    console.error(error);
    alert('Wystąpił błąd podczas wysyłania wiadomości');
  }
};


const menuLinks = [
  { label: 'Strona Główna', href: '/' },
  { label: 'O nas', href: '/about' },
  { label: 'Kalkulator', href: '/calculator' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Kontakt', href: '/contact' },
  { label: 'Dołącz do nas', href: '/join_us' }
];

// Dynamiczny import mapy z wyłączeniem SSR
const DynamicMap = dynamic(() => import('../components/MapComponent'), { ssr: false });

// Animacje
const pageVariants = {
  initial: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: 0.6, ease: 'easeInOut' } },
  exit: { opacity: 0, transition: { duration: 0.3, ease: 'easeInOut' } }
};

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

export default function ContactPage() {
  const { t } = useTranslation('common');
  const router = useRouter();

  // Dodanie hooka useState do obsługi stanu menu mobilnego
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  // Przykładowe koordynaty lokalizacji (zmień według potrzeb)
  const position = [52.22161600017349, 19.43169522834518];

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
          <title>{t('contactTitle')}</title>
          <meta name="description" content={t('contactDescription')} />
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

          {/* Sekcja Kontakt */}
          <section className="py-20 bg-white flex-1">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div 
                initial={{ y: 40, opacity: 0 }} 
                whileInView={{ y: 0, opacity: 1 }} 
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <h1 className="text-4xl font-extrabold text-gray-900 mb-6">
                  {t('contactTitle')}
                </h1>
                <p className="text-lg text-gray-600 mb-12">
                  {t('contactDescription')}
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Informacje kontaktowe */}
                <motion.div 
                  initial={{ x: -40, opacity: 0 }} 
                  whileInView={{ x: 0, opacity: 1 }} 
                  transition={{ duration: 0.6 }}
                >
                  <div className="space-y-6">
                    <div className="flex items-center">
                      <MapPinIcon className="h-6 w-6 text-fuchsia-700 mr-4" />
                      <span className="text-gray-700">{t('companyAddress')}</span>
                    </div>
                    <div className="flex items-center">
                      <PhoneIcon className="h-6 w-6 text-fuchsia-700 mr-4" />
                      <span className="text-gray-700">{t('companyPhone')}</span>
                    </div>
                    <div className="flex items-center">
                      <EnvelopeIcon className="h-6 w-6 text-fuchsia-700 mr-4" />
                      <span className="text-gray-700">{t('companyEmail')}</span>
                    </div>
                  </div>
                </motion.div>

                {/* Formularz kontaktowy */}
                <motion.div 
                  initial={{ x: 40, opacity: 0 }} 
                  whileInView={{ x: 0, opacity: 1 }} 
                  transition={{ duration: 0.6 }}
                >
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="fullName" className="block text-left text-gray-700">
                        {t('yourFullName')}
                      </label>
                      <input 
                        type="text"
                        id="fullName"
                        placeholder={t('yourFullNamePlaceholder')}
                        className="mt-1 w-full border border-gray-300 rounded-md p-2"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-left text-gray-700">
                        {t('yourPhone')}
                      </label>
                      <input 
                        type="tel"
                        id="phone"
                        placeholder={t('yourPhonePlaceholder')}
                        className="mt-1 w-full border border-gray-300 rounded-md p-2"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-left text-gray-700">
                        {t('yourEmail')}
                      </label>
                      <input 
                        type="email" 
                        id="email" 
                        placeholder={t('yourEmailPlaceholder')} 
                        className="mt-1 w-full border border-gray-300 rounded-md p-2" 
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-left text-gray-700">
                        {t('yourSubject')}
                      </label>
                      <select 
                        id="subject"
                        className="mt-1 w-full border border-gray-300 rounded-md p-2"
                      >
                        <option value="wspolpraca">{t('cooperation')}</option>
                        <option value="crm">{t('crm')}</option>
                        <option value="inne">{t('others')}</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-left text-gray-700">
                        {t('yourMessage')}
                      </label>
                      <textarea 
                        id="message" 
                        placeholder={t('yourMessagePlaceholder')} 
                        rows="4" 
                        className="mt-1 w-full border border-gray-300 rounded-md p-2"
                      ></textarea>
                    </div>
                    <div className="text-center">
                      <button 
                        type="submit" 
                        className="bg-gradient-to-r from-fuchsia-700 to-fuchsia-900 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity shadow-md"
                      >
                        {t('sendMessage')}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>

              {/* Sekcja z mapką */}
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('ourLocation') || 'Nasza lokalizacja'}
                </h2>
                <DynamicMap 
                  position={position} 
                  popupText={t('companyAddress') || 'Tutaj jesteśmy!'} 
                />
              </div>
            </div>
          </section>

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
