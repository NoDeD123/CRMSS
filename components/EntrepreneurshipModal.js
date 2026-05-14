import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { XMarkIcon } from '@heroicons/react/24/outline';

const EntrepreneurshipModal = () => {
  const { t } = useTranslation('common');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const lastClosed = localStorage.getItem('modalLastClosed');
    const now = new Date().getTime();
    const oneDay = 24 * 60 * 60 * 1000; // 24 godziny w milisekundach

    // Wyświetl modal tylko, jeśli nie był zamknięty lub minęło 24 godziny
    if (!lastClosed || now - parseInt(lastClosed) > oneDay) {
      const timer = setTimeout(() => setShowModal(true), 60000); // 1 minuta
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setShowModal(false);
    // Zapisz czas zamknięcia w localStorage
    localStorage.setItem('modalLastClosed', new Date().getTime().toString());
  };

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          key="modal"
          className="fixed inset-0 backdrop-blur-sm bg-black/30 flex justify-center items-center z-[999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative bg-white/95 backdrop-blur-lg p-8 rounded-xl shadow-2xl max-w-[90vw] md:max-w-md space-y-6 border border-white/20"
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XMarkIcon className="w-6 h-6 text-gray-600" />
            </button>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                {t('modal.title', 'Odkryj swój potencjał')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('modal.description', 'Rozwiąż nasz interaktywny test przedsiębiorczości i odkryj swoje mocne strony w świecie biznesu!')}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href="/predispositions"
                className="inline-block bg-gradient-to-r from-fuchsia-600 to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] text-center"
              >
                {t('modal.cta', 'Rozpocznij test →')}
              </Link>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
              >
                {t('modal.skip', 'Może później')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EntrepreneurshipModal;