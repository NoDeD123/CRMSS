import { useState, useEffect } from 'react';
import { ArrowLeft } from 'react-feather';

function BackButton({ onBack }) {
  const [visible, setVisible] = useState(true);
  let lastScrollY = window.scrollY;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < lastScrollY) {
        // Przewijanie w górę – pokaż przycisk
        setVisible(true);
      } else {
        // Przewijanie w dół – ukryj przycisk
        setVisible(false);
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <button
      onClick={onBack}
      className={`fixed left-4 transition-all p-3 bg-white/30 backdrop-blur-lg rounded-full shadow-lg hover:bg-white/40 ${
        visible ? 'top-1/2 transform -translate-y-1/2' : 'top-[-50px]'
      }`}
    >
      <ArrowLeft size={24} className="text-purple-600" />
    </button>
  );
}

export default BackButton;
