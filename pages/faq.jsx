import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import '../lib/i18n';
import '../styles/globals.css';

const menuLinks = [
  { label: 'Strona Główna', href: '/' },
  { label: 'O nas', href: '/about' },
  { label: 'Kalkulator', href: '/calculator' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Kontakt', href: '/contact' },
  { label: 'Dołącz do nas', href: '/join_us' }
];

// Animacje
const pageVariants = {
  initial: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: 0.6, ease: 'easeInOut' } },
  exit: { opacity: 0, transition: { duration: 0.3, ease: 'easeInOut' } }
};

const slideUp = {
  hidden: { y: 40, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'anticipate' } }
};

const staggerChildren = {
  visible: { transition: { staggerChildren: 0.15 } }
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

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left focus:outline-none"
      >
        <span className="text-xl font-medium text-gray-800">{question}</span>
        <span className="text-gray-600">{isOpen ? '-' : '+'}</span>
      </button>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-2 text-gray-600"
          dangerouslySetInnerHTML={{ __html: answer }}
        />
      )}
    </div>
  );
};

const FAQSection = () => {
  const { t } = useTranslation('common');
  // Przykładowe dane FAQ – zadbaj o odpowiednie tłumaczenia
  const faqs = [
    { question: t('faq.question1'), answer: t('faq.answer1') },
    { question: t('faq.question2'), answer: t('faq.answer2') },
    { question: t('faq.question3'), answer: t('faq.answer3') },
    { question: t('faq.question4'), answer: t('faq.answer4') },
    { question: t('faq.question5'), answer: t('faq.answer5') },
    { question: t('faq.question6'), answer: t('faq.answer6') },
    { question: t('faq.question7'), answer: t('faq.answer7') },
    { question: t('faq.question8'), answer: t('faq.answer8') },
    { question: t('faq.question9'), answer: t('faq.answer9') },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2 
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-3xl lg:text-4xl font-extrabold text-gray-900 text-center mb-12"
        >
          {t('faqHeader')}
        </motion.h2>
        <motion.h2 
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-xl lg:text-xl font-extrabold text-gray-900 text-center mb-12"
        >
          {t('faq.description')}
        </motion.h2>
        <div className="max-w-2xl mx-auto">
          {faqs.map((item, index) => (
            <FAQItem key={index} question={item.question} answer={item.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default function FAQPage() {
  const { t } = useTranslation('common');
  const router = useRouter();

  // Dodanie stanu do obsługi menu mobilnego
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen((prev) => !prev);

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
          <title>{t('faqTitle')}</title>
          <meta name="description" content={t('faqDescription')} />
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

          {/* Sekcja FAQ */}
          <FAQSection />

          {/* Footer */}
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
