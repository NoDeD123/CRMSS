import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import Slider from 'react-slick';
import FloatingSocialIconsRight from '../components/FloatingSocialIconsRight';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import CookieConsent from '../components/CookieConsent';
import DocumentLinks from '../components/DocumentLinks';
import EntrepreneurshipModal from '../components/EntrepreneurshipModal';
import Cards from '../components/ServiceCards';
import { 
  FaDollarSign, 
  FaLaptopCode, 
  FaHandsHelping, 
  FaBookOpen, 
  FaNetworkWired, 
  FaGavel, 
  FaUserShield, 
  FaChalkboardTeacher, 
  FaBullhorn, 
  FaExchangeAlt, 
  FaBalanceScale,
  FaRocket,
  FaCalculator,
  FaQuestionCircle,
  FaUserFriends,
  FaIdCard,
  FaGraduationCap
} from 'react-icons/fa';
import '../lib/i18n';
import '../styles/globals.css';
import Image from 'next/image';
import '@fortawesome/fontawesome-free/css/all.min.css';
import StepsSection from '../components/StepsSection';
import dynamic from 'next/dynamic';
import YourSection from '../components/ServiceCards';

const FREELANCER_LOGIN_URL =
  process.env.NEXT_PUBLIC_FREELANCER_LOGIN_URL || '/panel/freelancer/login';



const menuLinks = [
  { label: 'Strona Główna', href: '/' },
  { label: 'O nas', href: '/about' },
  { label: 'Kalkulator', href: '/calculator' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Kontakt', href: '/contact' },
  { label: 'Dołącz do nas', href: '/join_us' }
];

const nous = () => {
  const { t } = useTranslation('common');

  // Definiujemy klucze tłumaczeń
  const translationKeys = [
    'services.noZus', 
    'services.noTaxOffice', 
    'services.noAccounting'
  ];
  
  return (
    <motion.div 
      initial={{ x: 50, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="lg:w-1/2 space-y-8"
    >
      {translationKeys.map((key, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.2 + 0.3 }}
          className="relative overflow-hidden"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-purple-900 mb-2 relative">
            {t(key)}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 + 0.5, duration: 0.8, type: 'spring' }}
              className="absolute top-1/2 left-0 w-full h-1 bg-red-500 origin-left"
              style={{ 
                transform: 'rotate(-3deg)',
                y: '-50%',
                transformOrigin: 'left center'
              }}
            />
          </h3>
        </motion.div>
      ))}
    </motion.div>
  );
};

const GroupsSection = () => {
  const { t } = useTranslation('common');

  const GROUPS_CONFIG = [
    { id: 3, titleKey: "groups.employed.title", descriptionKey: "groups.employed.description" },
    { id: 4, titleKey: "groups.youth.title", descriptionKey: "groups.youth.description" },
    { id: 5, titleKey: "groups.disabled.title", descriptionKey: "groups.disabled.description" },
    { id: 6, titleKey: "groups.farmers.title", descriptionKey: "groups.farmers.description" },
    { id: 12, titleKey: "groups.seniors.title", descriptionKey: "groups.seniors.description" },
  ];

  return (
    <section className="py-20 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('groups.forWhomTitle')}
          </h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            {t('groups.forWhomDescription')}
          </p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 lg:gap-5">
          {GROUPS_CONFIG.map((group) => (
            <div 
              key={group.id}
              className="relative group aspect-square cursor-pointer hover:z-10"
            >
              <div className="absolute inset-0 rounded-full overflow-hidden shadow-lg 
                transform transition-all duration-300 ease-in-out 
                group-hover:scale-105 group-hover:shadow-xl"
              >
                <Image
                  src={`/img/1.${group.id}.png`}
                  alt={`${t(group.titleKey)} - ${t(group.descriptionKey)}`}
                  width={400}
                  height={400}
                  quality={75}
                  className="w-full h-full object-cover object-center"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                />
              </div>

              <div className="absolute inset-0 flex flex-col items-center justify-center 
                rounded-full bg-black/70 backdrop-blur-sm
                opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <div className="text-center text-white p-4 space-y-2">
                  <h3 className="font-semibold text-lg md:text-xl">
                    {t(group.titleKey)}
                  </h3>
                  <p className="text-m opacity-90 leading-tight">
                    {t(group.descriptionKey)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const pageVariants = {
  initial: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: 0.6, ease: 'easeInOut' }},
  exit: { opacity: 0, transition: { duration: 0.3, ease: 'easeInOut' }}
};

const slideUp = {
  hidden: { y: 40, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'anticipate' }}
};

const staggerChildren = {
  visible: { transition: { staggerChildren: 0.15 }}
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
      {['pl','en', 'ua'].map((lang) => (
        <motion.button
          key={lang}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 1.0 }}
          onClick={() => changeLanguage(lang)}
          className={`px-3 py-1 rounded-md transition-colors ${
            router.locale === lang 
              ? 'bg-fuchsia-700 text-white' 
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          {lang.toUpperCase()}
        </motion.button>
      ))}
    </motion.div>
  );
};

const FeaturesCarousel = () => {
  const { t } = useTranslation('common');

  const features = [
    { icon: <FaDollarSign className="text-4xl text-fuchsia-700" />, title: t('costComparison') },
    { icon: <FaLaptopCode className="text-4xl text-fuchsia-700" />, title: t('itConsulting') },
    { icon: <FaHandsHelping className="text-4xl text-fuchsia-700" />, title: t('expertSupport') },
    { icon: <FaBookOpen className="text-4xl text-fuchsia-700" />, title: t('accounting') },
    { icon: <FaNetworkWired className="text-4xl text-fuchsia-700" />, title: t('infrastructure') },
    { icon: <FaGavel className="text-4xl text-fuchsia-700" />, title: t('legalPersonality') },
    { icon: <FaUserShield className="text-4xl text-fuchsia-700" />, title: t('noZus') },
    { icon: <FaChalkboardTeacher className="text-4xl text-fuchsia-700" />, title: t('training') },
    { icon: <FaBullhorn className="text-4xl text-fuchsia-700" />, title: t('marketing') },
    { icon: <FaExchangeAlt className="text-4xl text-fuchsia-700" />, title: t('exchange') },
    { icon: <FaBalanceScale className="text-4xl text-fuchsia-700" />, title: t('legalAdvice') },
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 5000,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: 'linear',
    pauseOnHover: false,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 4 }},
      { breakpoint: 1024, settings: { slidesToShow: 3 }},
      { breakpoint: 768, settings: { slidesToShow: 2 }},
      { breakpoint: 640, settings: { slidesToShow: 1 }}
    ]
  };

  return (
    <section className="bg-gradient-to-b from-purple-50 to-white py-16">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerChildren}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <motion.h2 
          variants={slideUp}
          className="text-3xl lg:text-4xl font-extrabold text-fuchsia-700 text-center mb-12"
        >
          {t('featuresHeader')}
        </motion.h2>
        
        <Slider {...settings}>
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="px-2 focus:outline-none"
            >
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 h-48 mb-5 flex flex-col items-center justify-center">
                <motion.div whileHover={{ scale: 1.1 }} className="mb-4">
                  {feature.icon}
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-800 text-center">
                  {feature.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </Slider>
      </motion.div>
    </section>
  );
};

const ServiceCard = ({ icon, titleKey, descriptionKey, linkUrl, learnMoreKey }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const { t } = useTranslation('common');

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={slideUp}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-white p-8 rounded-2xl shadow-lg hover:transform hover:-translate-y-2 transition-all duration-300 h-full">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="text-fuchsia-600 mb-6 flex justify-center"
        >
          {icon}
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          {t(titleKey)}
        </h3>
        <p className="text-gray-600 text-center mb-6">
          {t(descriptionKey)}
        </p>
        <div className="text-center">
          <Link href={linkUrl}>
            <motion.span 
              whileHover={{ x: 5 }}
              className="text-fuchsia-700 hover:text-fuchsia-700 font-semibold inline-flex items-center gap-2"
            >
              {t(learnMoreKey)}
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </motion.span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const FoundationIntro = () => {
  const { t } = useTranslation('common');
  const paragraphs = t('foundationIntro.paragraphs', { returnObjects: true });
  const highlights = t('foundationIntro.highlights', { returnObjects: true });
  const closingParagraphs = t('foundationIntro.closing', { returnObjects: true });

  return (
    <section className="py-24 bg-gradient-to-br from-fuchsia-50 via-white to-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(circle_at_top,_#a21caf,_transparent_60%)]" />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold text-gray-900"
        >
          {t('foundationIntro.title')}
        </motion.h2>
        <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
          {paragraphs.map((paragraph, index) => (
            <motion.p
              key={`${paragraph}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {paragraph}
            </motion.p>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 justify-center max-w-2xl mx-auto">
          {highlights.map((highlight, index) => (
            <motion.div
              key={`${highlight}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg px-6 py-5 border border-purple-100"
            >
              <p className="text-lg font-semibold text-fuchsia-900">{highlight}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base text-gray-700"
        >
          {t('foundationIntro.highlightsNote')}
        </motion.p>

        <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
          {closingParagraphs.map((paragraph, index) => (
            <motion.p
              key={`${paragraph}-closing-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {paragraph}
            </motion.p>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link href="/join_us">
            <span className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-gradient-to-r from-fuchsia-700 to-purple-700 text-white text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
              {t('foundationIntro.cta')}
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

const NewTabsSection = () => {
  const { t } = useTranslation('common');

  const tabs = [
    {
      title: t('newTabs.caretaker.title'),
      icon: <FaUserFriends className="text-3xl text-fuchsia-700" />,
      paragraphs: t('newTabs.caretaker.paragraphs', { returnObjects: true }),
      footer: t('newTabs.caretaker.footer')
    },
    {
      title: t('newTabs.account.title'),
      icon: <FaIdCard className="text-3xl text-fuchsia-700" />,
      paragraphs: t('newTabs.account.paragraphs', { returnObjects: true }),
      listTitle: t('newTabs.account.listTitle'),
      listItems: t('newTabs.account.listItems', { returnObjects: true }),
      footer: t('newTabs.account.footer')
    },
    {
      title: t('newTabs.trainings.title'),
      icon: <FaGraduationCap className="text-3xl text-fuchsia-700" />,
      paragraphs: t('newTabs.trainings.paragraphs', { returnObjects: true })
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-purple-50 via-white to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16 space-y-5">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-extrabold text-gray-900"
          >
            {t('newTabs.heading')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-gray-600 max-w-3xl mx-auto"
          >
            {t('newTabs.description')}
          </motion.p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tabs.map((tab, index) => (
            <motion.article
              key={tab.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white/80 h-full rounded-3xl p-8 shadow-lg border border-purple-100 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex flex-col"
            >
              <div className="mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-fuchsia-100 to-purple-100 flex items-center justify-center">
                  {tab.icon}
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">{tab.title}</h3>
              {tab.paragraphs.map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex} className="text-gray-600 mb-4 leading-relaxed">
                  {paragraph}
                </p>
              ))}

              {tab.listItems && (
                <div className="mb-4">
                  <p className="font-semibold text-gray-800 mb-3">{tab.listTitle}</p>
                  <ul className="space-y-2 text-gray-600 list-disc list-inside">
                    {tab.listItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {tab.footer && (
                <p className="text-gray-800 font-medium mt-auto">{tab.footer}</p>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function Home() {
  const { t } = useTranslation('common');
  const router = useRouter();
  // Stan kontrolujący animację startu rakiety
  const [isLaunching, setIsLaunching] = useState(false);
  // Stan dla menu hamburgera
  const [isOpen, setIsOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const openLoginChoice = () => {
    setIsOpen(false);
    setLoginModalOpen(true);
  };
  
  // Stan dla gwiazd - tylko po stronie klienta
  const [stars, setStars] = useState([]);
  const [isClient, setIsClient] = useState(false);

  const handleGetStartedClick = () => {
    setIsLaunching(true);
  };

  const handleRocketAnimationComplete = () => {
    if (isLaunching) {
      router.push('/join_us');
    }
  };

  // Generowanie gwiazd tylko po stronie klienta
  useEffect(() => {
    setIsClient(true);
    const generatedStars = [...Array(30)].map((_, i) => ({
      id: i,
      left: Math.random() * 40 + 60,
      top: Math.random() * 100,
      delay: i * 0.3
    }));
    setStars(generatedStars);
  }, []);

  useEffect(() => {
    if (!loginModalOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setLoginModalOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [loginModalOpen]);

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
          <title>{t('title')}</title>
          <meta name="description" content={t('description')} />
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
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    onClick={openLoginChoice}
                    className="cursor-pointer text-gray-600 hover:text-fuchsia-700 transition-colors font-medium bg-transparent border-0 p-0"
                  >
                    {t('login')}
                  </motion.button>
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
            {/* Mobile Menu */}
{isOpen && (
  <div className="md:hidden absolute top-20 left-0 right-0 bg-white shadow-lg z-50">
    <nav className="px-2 pt-2 pb-3 space-y-1">
      {['about', 'calculator', 'faq', 'contact'].map((link) => (
        <a
          href={`/${link}`}
          key={link}
          className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50"
        >
          {t(link)}
        </a>
      ))}
      <button
        type="button"
        onClick={openLoginChoice}
        className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50 cursor-pointer"
      >
        {t('login')}
      </button>
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

          <AnimatePresence>
            {loginModalOpen && (
              <motion.div
                key="login-choice-overlay"
                role="presentation"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm"
                onClick={() => setLoginModalOpen(false)}
              >
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-label={t('login')}
                  initial={{ opacity: 0, scale: 0.96, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 8 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-2xl shadow-xl max-w-md w-full p-4 sm:p-5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex flex-col gap-3">
                    <Link
                      href="/login"
                      onClick={() => setLoginModalOpen(false)}
                      className="flex items-center gap-4 w-full p-4 rounded-xl border-2 border-gray-100 hover:border-fuchsia-600 hover:bg-fuchsia-50/50 transition-all text-left group"
                    >
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-fuchsia-100 text-fuchsia-800 group-hover:bg-fuchsia-200">
                        <FaUserFriends className="w-6 h-6" aria-hidden />
                      </span>
                      <span className="font-semibold text-gray-900">{t('loginChoice.beneficiary')}</span>
                    </Link>
                    <a
                      href={FREELANCER_LOGIN_URL}
                      onClick={() => setLoginModalOpen(false)}
                      className="flex items-center gap-4 w-full p-4 rounded-xl border-2 border-gray-100 hover:border-indigo-600 hover:bg-indigo-50/50 transition-all text-left group"
                    >
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-800 group-hover:bg-indigo-200">
                        <FaLaptopCode className="w-6 h-6" aria-hidden />
                      </span>
                      <span className="font-semibold text-gray-900">{t('loginChoice.freelancer')}</span>
                    </a>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <FloatingSocialIconsRight/>
          {/* Hero Section */}
          <section className="relative overflow-hidden h-screen">
            {/* Tło gradientowe z gwiazdami */}
            <div className={`bg-white`} />

            <div className="absolute inset-0 z-0">
              {/* Obraz tła */}
              <Image
                src="/img/hero-.png"
                alt="Hero background"
                fill
                priority
                className="object-cover"
                sizes="100vw"
                quality={75}
              />
              {/* Kontener dla gwiazd */}
              <div className="absolute inset-0 overflow-hidden">
                {isClient && stars.map((star) => (
                  <div
                    key={star.id}
                    className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
                    style={{
                      left: `${star.left}%`,
                      top: `${star.top}%`,
                      animationDelay: `${star.delay}s`,
                      boxShadow: '0 0 8px rgba(255,255,255,0.9)',
                      transformOrigin: 'center'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Tło gradientowe */}
            <Image
              src="/img/hero-5.png"
              alt="Hero overlay"
              fill
              className="object-cover z-0"
              sizes="100vw"
              quality={75}
            />
            {/* Dekoracyjna fala (opcjonalnie) */}
            <svg
              className="absolute bottom-0 left-0 w-full h-auto"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 320"
            >
              <path
                fill="#fff"
                fillOpacity="1"
                d="M0,224L48,218.7C96,213,192,203,288,208C384,213,480,235,576,213.3C672,192,768,128,864,96C960,64,1056,64,1152,64C1248,64,1344,96,1392,112L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              />
            </svg>

            {/* Główna zawartość hero */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col-reverse md:flex-row items-center justify-between z-10">
              {/* Lewa część: Tekst */}
              <div className="w-full md:w-1/2 text-center md:text-left md:mt-[30vh]">
                <motion.div
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6"
                  dangerouslySetInnerHTML={{ __html: t('heroTitle') }}
                />

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg text-white/90 max-w-2xl mb-8"
                  dangerouslySetInnerHTML={{ __html: t('heroText') }}
                />

                <motion.div
                  className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
                  variants={staggerChildren}
                >
                  <motion.div variants={slideUp}>
                    <motion.span
                      onClick={handleGetStartedClick}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-fuchsia-700 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-fuchsia-800 transition-all shadow-lg cursor-pointer"
                    >
                      {t('getStarted')}
                    </motion.span>
                  </motion.div>
                </motion.div>
              </div>

              {/* Prawa część: Rakieta / grafika */}
              <div className="w-full md:w-1/2 flex justify-center mb-8 md:mb-0">
                <motion.div
                  initial={{ opacity: 1, y: 0 }}
                  animate={isLaunching ? { y: -500, opacity: 0 } : { y: 0, opacity: 1 }}
                  transition={{ duration: 1.5 }}
                  onAnimationComplete={handleRocketAnimationComplete}
                  className="relative"
                  style={{ rotate: '30deg' }}
                >

                </motion.div>
              </div>
            </div>
          </section>

          <StepsSection/>
          <FoundationIntro/>
{/* Services Section */}
          <YourSection/>
          <NewTabsSection/>

          {/* Pozyskaj wsparcie ze Strefą Startu Section */}
          <motion.section 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="py-20 bg-gradient-to-br from-purple-50 to-fuchsia-50"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="inline-block mb-6"
                >
                  <Image 
                    src="/img/logo.svg" 
                    alt="StrefaStartu Logo" 
                    width={120} 
                    height={120} 
                    className="mx-auto"
                    priority
                  />
                </motion.div>
                <motion.h2 
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
                >
                  Pozyskaj wsparcie ze Strefą Startu
                </motion.h2>
                <motion.p 
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-xl text-gray-600 max-w-3xl mx-auto mb-12"
                >
                  Dołącz do naszej społeczności i skorzystaj z profesjonalnego wsparcia w rozwoju Twojej działalności gospodarczej
                </motion.p>
              </div>

              {/* Szczegółowe formy wsparcia */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Wsparcie w Starcie */}
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <h3 className="text-2xl font-bold text-fuchsia-700 mb-4">Wsparcie w Starcie</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Pomagamy w uzyskaniu pożyczki z programu „Wsparcie w Starcie" — skierowanej do osób, które chcą rozpocząć własną działalność gospodarczą. Oferujemy doradztwo w przygotowaniu wniosku, biznesplanu i wymaganej dokumentacji.
                  </p>
                </motion.div>

                {/* Dotacje B+R */}
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <h3 className="text-2xl font-bold text-fuchsia-700 mb-4">Dotacje B+R (Badania i Rozwój)</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Pomagamy przedsiębiorcom w pozyskiwaniu środków na rozwój innowacyjnych produktów, technologii i usług. Wspieramy na etapie tworzenia koncepcji, przygotowania wniosku oraz rozliczania projektu.
                  </p>
                </motion.div>

                {/* Dotacje z DLGD */}
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <h3 className="text-2xl font-bold text-fuchsia-700 mb-4">Dotacje z Lokalnych Grup Działania (DLGD)</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Wspieramy w pozyskiwaniu funduszy z programów LEADER realizowanych przez Lokalne Grupy Działania. To szansa na dofinansowanie założenia lub rozwoju firmy, a także projektów społecznych i edukacyjnych na obszarach wiejskich.
                  </p>
                </motion.div>

                {/* Dotacje z Urzędów Pracy */}
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <h3 className="text-2xl font-bold text-fuchsia-700 mb-4">Dotacje z Urzędów Pracy</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Pomagamy w uzyskaniu dotacji na rozpoczęcie działalności gospodarczej z lokalnych urzędów pracy. Zapewniamy doradztwo przy pisaniu wniosków, tworzeniu kosztorysów oraz spełnianiu wymagań formalnych.
                  </p>
                </motion.div>
              </div>

              {/* Przyciski CTA */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link href="/join_us">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-fuchsia-700 to-purple-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Dołącz teraz
                  </motion.button>
                </Link>
                <Link href="/contact">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-fuchsia-700 px-8 py-4 rounded-full text-lg font-semibold border-2 border-fuchsia-700 hover:bg-fuchsia-50 transition-all duration-300"
                  >
                    Skontaktuj się z nami
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          </motion.section>

          <GroupsSection/>
          <FeaturesCarousel />

          {/* CTA Section */}
<motion.section 
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
  className="bg-gradient-to-br from-fuchsia-900 via-purple-800 to-purple-600 text-white py-20"
>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <motion.div whileHover={{ scale: 1.02 }} className="text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-6">
        {t('ctaTitle')}
      </h2>
      <p className="text-xl text-purple-100 max-w-2xl mx-auto mb-8">
        {t('ctaText')}
      </p>
      <Link href="calculator">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:opacity-90 transition-opacity inline-block relative overflow-hidden"
        >
          {t('startNow')}
        </motion.button>
      </Link>
    </motion.div>
  </div>
</motion.section>


          {/* Services Section with animated underlines (Prawa kolumna) */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row gap-12 items-center">
                {/* Lewa kolumna - tekst i przycisk */}
                <motion.div 
                  initial={{ x: -50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="lg:w-1/2"
                >
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    {t('servicesHeader')}
                  </h2>
                  <p className="text-lg text-gray-600 mb-8">
                    {t('servicesDescription')}
                  </p>
                  <Link href="#contact">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-fuchsia-700 to-fuchsia-800 text-white px-8 py-4 rounded-lg text-lg font-medium shadow-lg"
                    >
                      {t('contactUs')}
                    </motion.button>
                  </Link>
                </motion.div>

                {/* Prawa kolumna - animowane podkreślenia z tłumaczeniami */}
                <motion.div 
                  initial={{ x: 50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="lg:w-1/2 space-y-8"
                >
                  {['services.noZus', 'services.noTaxOffice', 'services.noAccounting'].map((key, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.2 + 0.3 }}
                      className="relative"
                    >
                      <h3 className="text-2xl md:text-3xl font-bold text-purple-900 mb-2">
                        {t(key)}
                      </h3>
                      <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2 + 0.5, duration: 0.8, type: 'spring' }}
                        className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-indigo-600 origin-left"
                        style={{ y: 4 }}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </section>
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
                    <DocumentLinks/>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-500 text-xs">
                <p>&copy; {new Date().getFullYear()} StrefaStartu. Wszelkie prawa zastrzeżone.</p>
              </div>
            </div>
          </motion.footer>
        </div>
        <CookieConsent/>
        <EntrepreneurshipModal/>

      </motion.div>
    </AnimatePresence>
  );
}
