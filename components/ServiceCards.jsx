import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { FaRocket, FaCalculator, FaQuestionCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Komponent ServiceCard
const ServiceCard = ({ icon, titleKey, descriptionKey, linkUrl, learnMoreKey, className }) => {
  const { t } = useTranslation('common');
  return (
    <Link href={linkUrl} className={className}>
      <div className="p-8 flex flex-col items-center justify-center text-center h-full">
        {icon}
        <h3 className="text-2xl font-bold mt-4">{t(titleKey)}</h3>
        <p className="mt-2 text-base">{t(descriptionKey)}</p>
        <span className="mt-4 inline-block text-fuchsia-800 hover:underline">
          {t(learnMoreKey)}
        </span>
      </div>
    </Link>
  );
};

// Komponent sekcji
const YourSection = () => {
  const { t } = useTranslation('common');
  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerChildren}
          className="grid md:grid-cols-3 gap-8 lg:gap-12"
        >
          {/* Karta 1 - Predispositions */}
          <ServiceCard
            icon={
              <FaRocket className="text-6xl text-indigo-600 hover:text-fuchsia-800 transition-colors" />
            }
            titleKey="cardtest.title"
            descriptionKey="cardtest.description"
            linkUrl="/predispositions"
            learnMoreKey="card1.learnMore"
            className="bg-white text-gray-800 p-6 rounded-lg shadow-lg hover:-translate-y-2 transition-all duration-300"
          />

          {/* Karta 2 - Calculator */}
          <ServiceCard
            icon={
              <FaCalculator className="text-6xl text-emerald-600 hover:text-fuchsia-800 transition-colors" />
            }
            titleKey="cardcalculator.title"
            descriptionKey="cardcalculator.description"
            linkUrl="/calculator"
            learnMoreKey="card2.learnMore"
            className="bg-white text-gray-800 p-6 rounded-lg shadow-lg hover:-translate-y-2 transition-all duration-300"
          />

          {/* Karta 3 - FAQ */}
          <ServiceCard
            icon={
              <FaQuestionCircle className="text-6xl text-amber-600 hover:text-fuchsia-800 transition-colors" />
            }
            titleKey="cardfaq.title"
            descriptionKey="cardfaq.description"
            linkUrl="/faq"
            learnMoreKey="card3.learnMore"
            className="bg-white text-gray-800 p-6 rounded-lg shadow-lg hover:-translate-y-2 transition-all duration-300"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default YourSection;