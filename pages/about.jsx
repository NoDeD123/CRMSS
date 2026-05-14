import { motion, AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import '../lib/i18n';
import '../styles/globals.css';
import DocumentLinks from '../components/DocumentLinks';

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

export default function AboutPage() {
  const { t } = useTranslation('common');
  const router = useRouter();
  
  // Przeniesienie hooka useState do wnętrza komponentu
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  // Dane zespołu podzielone na kategorie – uzupełnione informacjami
  const teamSections = [
    {
      category: "Zarząd",
      members: [
        { name: "Michał Balcerzak", position: "CEO", image: "../img/we/michal.png" },
        { name: "Adam Uchroński", position: "Vice CEO", image: "../img/we/adam.png" },
      ],
    },
    {
      category: "Koordynatorzy",
      members: [
        { name: "Dagmara Piekarska", position: "Koordynator", image: "../img/we/person_w.png" },
        { name: "Sylwia Olszewska", position: "Koordynator", image: "../img/we/person_w.png" },
        { name: "Justyna Kowalczyk", position: "Koordynator", image: "../img/we/person_w.png" },
        { name: "Agnieszka Ziółkowska", position: "Koordynator", image: "../img/we/person_w.png" },
        { name: "Piotrowski Przemysław", position: "Koordynator", image: "../img/we/person_m.png" },
      ],
    },

    {
      category: "Prawo",
      members: [
        { name: "Piotr Matusiak", position: "Prawnik", image: "../img/we/person_m.png" },
        { name: "Rafał Noga", position: "Prawnik", image: "../img/we/person_m.png" },
        { name: "Katarzyna Bieńkowska", position: "Prawnik", image: "../img/we/person_w.png" },
      ],
    },
    {
      category: "Finanse",
      members: [
        { name: "Krzysztof Szewczyk", position: "Księgowość / Projekty Unijne", image: "../img/we/person_m.png" },
        { name: "Katarzyna Balcerzak", position: "Finanse", image: "../img/we/person_w.png" },
        { name: "Izabela Sętkowska", position: "Księgowość", image: "../img/we/person_w.png" },
      ],
    },
    {
      category: "Specjaliści",
      members: [
        { name: "Miłosz Szałwiński", position: "Full Stack Developer", image: "../img/we/person_m.png" },
        { name: "Paweł Kądziela", position: "Specjalista ds. najmu pojazdów", image: "../img/we/person_m.png" },
        { name: "Tomasz Zieliński", position: "Specjalista ds. ARMIR", image: "../img/we/person_m.png" },
        { name: "Natalia Tomaszewska", position: "Specjalista ds. marketingu, promocji", image: "../img/we/person_w.png" },
      ],
    },
  ];

  // Domyślny obrazek dla użytkownika – wektor osoby
  const defaultImage = "/images/default-person.svg";

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
          <title>{t('aboutTitle')}</title>
          <meta name="description" content={t('aboutDescription')} />
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
          
          {/* Sekcja "O nas" – dwukolumnowy układ */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div 
                initial={{ y: 40, opacity: 0 }} 
                whileInView={{ y: 0, opacity: 1 }} 
                transition={{ duration: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
              >
                <div>
                  <h1 className="text-4xl font-extrabold text-gray-900 mb-6">
                    {t('aboutTitle')}
                  </h1>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {t('aboutDescription')}
                  </p>
                </div>
                <div className="flex justify-center">
                  <Image 
                    src="/img/5471.jpg" 
                    alt={t('aboutTitle')} 
                    width={400}
                    height={300}
                    quality={75}
                    loading="lazy"
                    className="w-full max-w-md rounded-lg object-cover"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </div>
              </motion.div>
            </div>
          </section>
          
          {/* Sekcja zespołu */}
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {teamSections.map((section, idx) => (
                <div key={idx} className="mb-16">
                  <motion.h2
                    initial={{ y: 40, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl font-bold text-gray-900 text-center mb-8"
                  >
                    {section.category}
                  </motion.h2>
  
                  {/* Dynamiczny kontener w zależności od liczby elementów */}
                  <div className={`flex justify-center ${section.members.length > 2 ? 'max-w-4xl mx-auto' : ''}`}>
                    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${section.members.length >= 3 ? 3 : 2} gap-8 w-full justify-items-center`}>
                      {section.members.map((member, index) => (
                        <motion.div 
                          key={index}
                          className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center w-full max-w-xs"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.2 }}
                        >
                          <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center">
                            <img 
                              src={member.image || 'https://unpkg.com/heroicons@2.0.18/24/solid/user-circle.svg'}
                              alt={member.name} 
                              className="w-full h-full rounded-full object-cover object-top"
                              onError={(e) => {
                                e.target.src = 'https://img.icons8.com/ios-filled/100/000000/user.png';
                                e.target.onerror = null;
                              }}
                            />
                          </div>
                          <h3 className="mt-4 text-xl font-semibold text-gray-800 text-center">
                            {member.name}
                          </h3>
                          <p className="text-center text-gray-600">
                            {member.position}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
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
                    {['Strona Główna', 'O nas', 'Oferta', 'Blog', 'Kontakt'].map((item) => (
                      <a 
                        href={`/${item.toLowerCase().replace(' ', '')}`} 
                        className="hover:text-gray-900 transition-colors duration-200 hover:underline w-full text-center md:text-left"
                        key={item}
                      >
                        {item}
                      </a>
                    ))}
                  </nav>
                </div>
    
                {/* Linki do dokumentów */}
                <div className="mt-4 md:mt-0">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center md:text-left">Dokumenty</h3>
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
