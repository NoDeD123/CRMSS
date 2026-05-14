import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation('common');

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'false');
    window.location.href = 'https://www.google.com';
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 bg-opacity-95 text-white p-6 flex flex-col md:flex-row items-center justify-between z-50 shadow-lg border-t border-gray-700">
      <div className="mb-4 md:mb-0 md:mr-8 max-w-3xl">
        <span className="text-base leading-relaxed">
          {t('cookieConsent.message')}{' '}
          <a 
            href="../docs/cookie.pdf" 
            className="text-fuchsia-400 hover:text-fuchsia-300 underline transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('cookieConsent.learnMore')}
          </a>
        </span>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <button
          onClick={handleDecline}
          className="px-6 py-3 rounded-lg bg-gray-600 hover:bg-gray-700 text-white transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          {t('cookieConsent.decline')}
        </button>
        <button
          onClick={handleAccept}
          className="px-6 py-3 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-700 text-white transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-fuchsia-600/20"
        >
          {t('cookieConsent.accept')}
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;