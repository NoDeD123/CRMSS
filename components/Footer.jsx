import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

export default function Navbar() {
  const { t } = useTranslation('common');

  // Definicja tablicy z kluczami nawigacyjnymi
  const navigationItems = ['about', 'calculator', 'contact', 'faq'];

  return (
    <nav className="hidden md:flex space-x-8 items-center">
      {navigationItems.map((link) => (
        <Link href={`/${link}`} key={link}>
          <motion.span
            whileHover={{ scale: 1.05 }}
            className="hover:text-gray-900 transition-colors duration-200 block"
          >
            {t(link)}
          </motion.span>
        </Link>
      ))}
      {/* Link do zewnętrznego CRM */}
      <a 
        href="https://crm.strefastartu.pl" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        <motion.span 
          whileHover={{ scale: 1.05 }}
          className="text-gray-600 hover:text-fuchsia-700 transition-colors font-medium"
        >
          {t('login')}
        </motion.span>
      </a>
      <LanguageSwitcher />
      <Link href="/join_us">
        <motion.span
          whileHover={{ scale: 1.05 }}
          className="ml-4 bg-gradient-to-r from-fuchsia-700 to-fuchsia-900 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity shadow-md"
        >
          {t('getStarted')}
        </motion.span>
      </Link>
    </nav>
  );
}
