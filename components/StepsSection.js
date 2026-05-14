import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { 
    y: '30vh',
    opacity: 0,
    rotateX: -45,
  },
  visible: {
    y: 0,
    opacity: 1,
    rotateX: 0,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 15,
      mass: 0.5,
    },
  },
};

const StepsSection = () => {
  const { t } = useTranslation('common');

  return (
    <section className="py-24 bg-gradient-to-br from-fuchsia-900 via-purple-800 to-purple-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Nagłówek */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
        >
          <h2 className="text-5xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-200 mb-6">
            {t('steps.title')}
          </h2>
          <div className="h-1 w-24 bg-purple-300 mx-auto rounded-full opacity-50" />
        </motion.div>

        {/* Karty */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-150px" }}
        >
          {/* Linia łącząca */}
          <div className="hidden lg:block absolute w-1 h-full bg-purple-400 left-1/2 -translate-x-1/2 opacity-20" />

          {[1, 2, 3, 4].map((step, index) => {
            // Dodatkowe klasy dla odstępów między blokami
            const extraClassForStep = `${index === 1 ? 'lg:mt-32' : ''} ${index === 2 ? 'lg:-mt-16' : ''}`;
            const extraMarginForStep = `${index === 1 ? 'lg:mb-8' : ''}`;
            const justifyClass = index % 2 === 0 ? 'lg:justify-self-end' : 'lg:justify-self-start';
            const sideClass = index % 2 === 0 ? 'lg:-mr-6' : 'lg:-ml-6';

            return (
              <motion.div
                key={step}
                variants={cardVariants}
                className={`relative group ${justifyClass} ${extraClassForStep}`}
                custom={index}
              >
                <div className={`bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 
                  shadow-2xl shadow-purple-900/30 relative overflow-hidden
                  transform transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl ${sideClass} ${extraMarginForStep}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-500/10 to-transparent opacity-30" />
                  
                  <div className="absolute -top-8 -right-8 text-[160px] font-black text-yellow-50/20 leading-none">
                    {step}
                  </div>

                  <h3 className="text-2xl font-bold text-purple-100 mb-4 z-10 relative">
                    <span className="mr-3 text-purple-400">⦿</span>
                    {t(`steps.step${step}.title`)}
                  </h3>
                  <p className="text-base text-purple-200/80 leading-relaxed z-10 relative">
                    {t(`steps.step${step}.description`)}
                  </p>

                  <div className="absolute inset-0 bg-radial-gradient from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
        <motion.div
          className="flex justify-center mt-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link href="/join_us">
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-purple-900 text-xl font-bold px-8 py-4 rounded-full
                        shadow-lg shadow-purple-900/30 hover:shadow-xl hover:shadow-purple-900/40
                        transition-all duration-300 cursor-pointer block"
            >
              {t('steps.joinButton')}
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};


export default StepsSection;
