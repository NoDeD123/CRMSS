import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next'; // Lub 'next-i18next'
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import Select from 'react-select';
import '../styles/globals.css'; // Upewnij się, że ta ścieżka jest poprawna

const FB_PIXEL_ID = '956425060180568';

// Komponent pola wyboru działalności (bez zmian w stosunku do poprzedniej wersji)
const ActivityField = ({ formData, handleChange, inputClasses }) => {
  const { t } = useTranslation('common');

  const activityOptions = useMemo(() => [
    { value: 'Administracja', label: t('activities.administration', 'Administracja') },
    { value: 'Akcesoria dla dzieci', label: t('activities.childrenAccessories', 'Akcesoria dla dzieci') },
    { value: 'Akcesoria dla zwierząt', label: t('activities.petAccessories', 'Akcesoria dla zwierząt') },
    { value: 'Architektura: urbanistyka', label: t('activities.architectureUrbanism', 'Architektura: urbanistyka') },
    { value: 'Architektura: krajobrazu', label: t('activities.architectureLandscape', 'Architektura: krajobrazu') },
    { value: 'Architektura: wnętrz', label: t('activities.architectureInterior', 'Architektura: wnętrz') },
    { value: 'Art. chemiczne', label: t('activities.chemicalArticles', 'Art. chemiczne') },
    { value: 'Art. dziecięce', label: t('activities.childrenArticles', 'Art. dziecięce') },
    { value: 'Art. przemysłowe', label: t('activities.industrialArticles', 'Art. przemysłowe') },
    { value: 'Art. spożywcze', label: t('activities.foodArticles', 'Art. spożywcze') },
    { value: 'Art. zdrowotne', label: t('activities.healthArticles', 'Art. zdrowotne') },
    { value: 'Biżuteria', label: t('activities.jewelry', 'Biżuteria') },
    { value: 'Budownictwo', label: t('activities.construction', 'Budownictwo') },
    { value: 'Coaching i szkolenia', label: t('activities.coachingTraining', 'Coaching i szkolenia') },
    { value: 'Dietetyka', label: t('activities.dietetics', 'Dietetyka') },
    { value: 'Dom i ogród', label: t('activities.homeGarden', 'Dom i ogród') },
    { value: 'Doradztwo prawne', label: t('activities.legalAdvice', 'Doradztwo prawne') },
    { value: 'E-papierosy', label: t('activities.eCigarettes', 'E-papierosy') },
    { value: 'Erotyka', label: t('activities.erotica', 'Erotyka') },
    { value: 'Finanse', label: t('activities.finance', 'Finanse') },
    { value: 'Fitness', label: t('activities.fitness', 'Fitness') },
    { value: 'Fizjoterapia', label: t('activities.physiotherapy', 'Fizjoterapia') },
    { value: 'Foto i video', label: t('activities.photoVideo', 'Foto i video') },
    { value: 'Fryzjerstwo', label: t('activities.hairdressing', 'Fryzjerstwo') },
    { value: 'Gadżety', label: t('activities.gadgets', 'Gadżety') },
    { value: 'Gastronomia', label: t('activities.gastronomy', 'Gastronomia') },
    { value: 'Grafika i Design', label: t('activities.graphicsDesign', 'Grafika i Design') },
    { value: 'Gry i zabawy edukacyjne', label: t('activities.educationalGames', 'Gry i zabawy edukacyjne') },
    { value: 'Hotele i pensjonaty', label: t('activities.hotelsPensions', 'Hotele i pensjonaty') },
    { value: 'Instalacje elektryczne', label: t('activities.electricalInstallations', 'Instalacje elektryczne') },
    { value: 'IT/Programowanie', label: t('activities.itProgramming', 'IT/Programowanie') },
    { value: 'Języki obce: nauka', label: t('activities.foreignLanguagesLearning', 'Języki obce: nauka') },
    { value: 'Języki obce: tłumaczenia', label: t('activities.foreignLanguagesTranslation', 'Języki obce: tłumaczenia') },
    { value: 'Kosmetologia', label: t('activities.cosmetology', 'Kosmetologia') },
    { value: 'Kosmetyki i pielęgnacja', label: t('activities.cosmeticsCare', 'Kosmetyki i pielęgnacja') },
    { value: 'Kultura i rozrywka', label: t('activities.cultureEntertainment', 'Kultura i rozrywka') },
    { value: 'Makijaż', label: t('activities.makeup', 'Makijaż') },
    { value: 'Motoryzacja', label: t('activities.automotive', 'Motoryzacja') },
    { value: 'Muzyka', label: t('activities.music', 'Muzyka') },
    { value: 'Nieruchomości', label: t('activities.realEstate', 'Nieruchomości') },
    { value: 'Odzież', label: t('activities.clothing', 'Odzież') },
    { value: 'Oprawa muzyczna', label: t('activities.musicSetting', 'Oprawa muzyczna') },
    { value: 'Oprawa wokalna', label: t('activities.vocalSetting', 'Oprawa wokalna') },
    { value: 'Organizacja eventów', label: t('activities.eventOrganization', 'Organizacja eventów') },
    { value: 'Pielęgniarstwo', label: t('activities.nursing', 'Pielęgniarstwo') },
    { value: 'Protetyka', label: t('activities.prosthetics', 'Protetyka') },
    { value: 'Przewodnicy', label: t('activities.guides', 'Przewodnicy') },
    { value: 'Psychologia', label: t('activities.psychology', 'Psychologia') },
    { value: 'Psychoterapia', label: t('activities.psychotherapy', 'Psychoterapia') },
    { value: 'Reklama i Marketing', label: t('activities.advertisingMarketing', 'Reklama i Marketing') },
    { value: 'Rękodzieło', label: t('activities.handicraft', 'Rękodzieło') },
    { value: 'RTV i AGD', label: t('activities.electronicsAppliances', 'RTV i AGD') },
    { value: 'Sport', label: t('activities.sport', 'Sport') },
    { value: 'Treningi personalne', label: t('activities.personalTraining', 'Treningi personalne') },
    { value: 'Turystyka', label: t('activities.tourism', 'Turystyka') },
    { value: 'Ubrania', label: t('activities.clothes', 'Ubrania') },
    { value: 'Usługi dla biznesu', label: t('activities.businessServices', 'Usługi dla biznesu') },
    { value: 'Wykończenia', label: t('activities.finishingWorks', 'Wykończenia') },
    { value: 'Zajęcia sportowe', label: t('activities.sportsActivities', 'Zajęcia sportowe') },
    { value: 'Zdrowie i Uroda', label: t('activities.healthBeauty', 'Zdrowie i Uroda') },
    { value: 'Inne', label: t('activities.other', 'Inne (wymienić jakie)') },
  ], [t]); // Zależność od t

  const [showCustomInput, setShowCustomInput] = useState(formData.activity === 'Inne');

  const handleSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : '';
    handleChange({ target: { name: 'activity', value } });
    setShowCustomInput(value === 'Inne');
  };

  const handleCustomInputChange = (e) => {
    handleChange({ target: { name: 'customActivity', value: e.target.value } });
  };

  useEffect(() => {
    setShowCustomInput(formData.activity === 'Inne');
  }, [formData.activity]);

  return (
    <div>
      <label className="block text-sm font-semibold mb-1 text-gray-700">
        {t('form.activity', 'Działalność gospodarcza')} <span className="text-red-500">*</span>
      </label>
      <Select
        options={activityOptions}
        value={activityOptions.find(option => option.value === formData.activity) || null}
        onChange={handleSelectChange}
        placeholder={t('form.activityPlaceholder', 'Wybierz rodzaj działalności')}
        isSearchable={true}
        required // Dodajemy dla walidacji (z ukrytym inputem)
        className="mb-2 react-select-container"
        classNamePrefix="react-select"
        instanceId="activity-select"
      />
      {/* Ukryty input dla 'required' w Select */}
      <input
          tabIndex={-1}
          autoComplete="off"
          style={{ opacity: 0, height: 0, position: 'absolute', pointerEvents: 'none' }} // Ukryty i nieinteraktywny
          value={formData.activity}
          onChange={() => {}}
          required={true}
          aria-hidden="true" // Ukryty dla czytników ekranu
      />
      <AnimatePresence>
      {showCustomInput && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: 'auto', opacity: 1, marginTop: '0.5rem' }} // Dodaj margines górny
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <input
              type="text"
              name="customActivity"
              value={formData.customActivity || ''}
              onChange={handleCustomInputChange}
              required // To pole też jest wymagane jeśli 'Inne' jest wybrane
              className={inputClasses} // Użyj tych samych klas co inne inputy
              placeholder={t('form.customActivityPlaceholder', 'Wpisz inną działalność')}
            />
          </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
};

// Definicja animacji strony (bez zmian)
const pageVariants = {
  initial: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: 0.6, ease: 'easeInOut' } },
  exit: { opacity: 0, transition: { duration: 0.3, ease: 'easeInOut' } },
};

// LanguageSwitcher (bez zmian)
const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const router = useRouter();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    router.push(router.pathname, router.asPath, { locale: lng });
  };

  return (
    <motion.div className="flex gap-2 md:gap-3"> {/* Zmniejszony gap dla mobilnych */}
      {['pl', 'en', 'ua'].map((lang) => (
        <motion.button
          key={lang}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => changeLanguage(lang)}
          className={`px-3 py-1 rounded-md text-sm transition-colors ${ // Mniejszy font
            router.locale === lang ? 'bg-purple-600 text-white shadow-sm' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          {lang.toUpperCase()}
        </motion.button>
      ))}
    </motion.div>
  );
};

// MultiStepForm - Z POPRAWKAMI
const MultiStepForm = ({ onBack }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
      fullName: '',
      email: '',
      phone: '',
      age: '',
      topic: '',
      acceptPrivacy: false,
      acceptRODO: false,
      referralCode: '',
  });
  const [error, setError] = useState(null);
  const [portalTarget, setPortalTarget] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setPortalTarget(document.body);
    setIsClient(true);
  }, []);

  // Opcje tematu zgłoszenia
  const topicOptions = useMemo(() => [
    { value: 'no_zus', label: t('topic.no_zus', 'Nie chce płacić ZUS') },
    { value: 'foundation', label: t('topic.foundation', 'Chce się rozliczyć przez fundację') },
    { value: 'no_company', label: t('topic.no_company', 'Nie mam firmy') },
    { value: 'freelancer', label: t('topic.freelancer', 'Freelancer') },
    { value: 'tax_optimization', label: t('topic.tax_optimization', 'Optymalizacja podatkowa') },
  ], [t]);


  const inputClasses =
    'w-full py-3 px-4 rounded-xl bg-gray-50/80 border border-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 focus:bg-white transition-all duration-200 shadow-sm hover:border-gray-300';

  const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setError(null);
      if (type === 'checkbox') {
        setFormData((prev) => ({ ...prev, [name]: checked }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
  };


  // Walidacja
  const validateStep = () => {
    if (step === 1) {
      if (!formData.fullName.trim()) {
        setError(t('validation.fieldRequired.fullName', 'Pole imię i nazwisko jest wymagane.'));
        return false;
      }
      if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
        setError(t('validation.invalidEmail', 'Proszę podać poprawny adres e-mail.'));
        return false;
      }
    } else if (step === 2) {
      if (!formData.topic) {
        setError(t('validation.fieldRequired.topic', 'Wybierz temat zgłoszenia.'));
        return false;
      }
      if (!formData.acceptRODO) {
        setError(t('validation.consentRequired.acceptRODO', 'Zgoda RODO jest wymagana.'));
        return false;
      }
      if (!formData.acceptPrivacy) {
        setError(t('validation.consentRequired.acceptPrivacy', 'Zgoda Polityki Prywatności jest wymagana.'));
        return false;
      }
    }
    return true;
  };

  const nextStep = (e) => {
    e.preventDefault();
    if (validateStep()) {
        if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
          window.fbq('trackCustom', 'FormStep2Reached');
        }
        setError(null);
        setStep((prev) => prev + 1);
    }
  };

  const prevStep = (e) => {
    e.preventDefault();
    setError(null);
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    setError(null);

    const mailOptions = {
      from: `"${t('multistep.mail.from', 'Formularz StrefaStartu')}" <formularz@twojadomena.pl>`,
      to: 'startup@strefastartu.pl',
      replyTo: formData.email,
      subject: t('multistep.mail.subject', `Nowe zgłoszenie: ${formData.fullName}`),
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #f8f8f8; padding: 15px 20px; border-bottom: 1px solid #e0e0e0;">
            <h2 style="margin: 0; color: #5a3a92; font-size: 20px;">${t('multistep.mail.title', 'Nowe zgłoszenie z formularza StrefaStartu')}</h2>
          </div>
          <div style="padding: 20px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tbody style="font-size: 14px;">
                <tr style="border-bottom: 1px solid #f0f0f0;"><td style="padding: 8px 0; color: #666; width: 180px;">${t('multistep.mail.fullName', 'Imię i nazwisko:')}</td><td style="padding: 8px 0;"><strong>${formData.fullName}</strong></td></tr>
                <tr style="border-bottom: 1px solid #f0f0f0;"><td style="padding: 8px 0; color: #666;">${t('multistep.mail.email', 'Adres e-mail:')}</td><td style="padding: 8px 0;"><strong>${formData.email}</strong></td></tr>
                <tr style="border-bottom: 1px solid #f0f0f0;"><td style="padding: 8px 0; color: #666;">${t('multistep.mail.phone', 'Numer telefonu:')}</td><td style="padding: 8px 0;">${formData.phone || t('common.notProvided', 'Nie podano')}</td></tr>
                <tr style="border-bottom: 1px solid #f0f0f0;"><td style="padding: 8px 0; color: #666;">${t('multistep.mail.age', 'Wiek:')}</td><td style="padding: 8px 0;">${formData.age || t('common.notProvided', 'Nie podano')}</td></tr>
                <tr style="border-bottom: 1px solid #f0f0f0;"><td style="padding: 8px 0; color: #666;">${t('multistep.mail.topic', 'Temat zgłoszenia:')}</td><td style="padding: 8px 0;"><strong>${topicOptions.find(opt => opt.value === formData.topic)?.label || formData.topic}</strong></td></tr>
                <tr><td style="padding: 8px 0; color: #666;">${t('form.acceptRODO','Zgoda RODO:')}</td><td style="padding: 8px 0;">${formData.acceptRODO ? t('common.yes', 'Tak') : t('common.no', 'Nie')}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;">${t('form.acceptPrivacy','Zgoda Polityka Prywatności:')}</td><td style="padding: 8px 0;">${formData.acceptPrivacy ? t('common.yes', 'Tak') : t('common.no', 'Nie')}</td></tr>
              </tbody>
            </table>
          </div>
          <div style="background-color: #f8f8f8; padding: 10px 20px; border-top: 1px solid #e0e0e0; text-align: center; font-size: 12px; color: #888;">
            ${t('multistep.mail.footer', 'Wiadomość wygenerowana automatycznie.')}
          </div>
        </div>
      `,
    };

    try {
      // Najpierw zapisz do bazy danych
      const dbResponse = await fetch('/api/save_form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (!dbResponse.ok) {
        const dbError = await dbResponse.json().catch(() => ({ message: 'Błąd bazy danych' }));
        throw new Error(dbError.message || 'Błąd podczas zapisywania do bazy danych');
      }

      // Następnie wyślij email
      const emailResponse = await fetch('/api/interesant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mailOptions),
      });
      
      if (!emailResponse.ok) {
        const emailError = await emailResponse.json().catch(() => ({ message: t('error.serverDefault', 'Błąd serwera.') }));
        throw new Error(emailError.message || `HTTP error! status: ${emailResponse.status}`);
      }
      
      const data = await emailResponse.json();
      const [firstName, ...rest] = formData.fullName.trim().split(' ');
      const lastName = rest.join(' ');

      if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
        window.fbq('init', FB_PIXEL_ID, {
          em: formData.email?.toLowerCase().trim(),
          fn: firstName?.toLowerCase(),
          ln: lastName?.toLowerCase(),
          ph: formData.phone?.replace(/\D/g, ''),
        });

        window.fbq('track', 'Lead', {
          content_name: 'Zapis Strefa Startu',
          content_category: formData.topic,
        });
      }

      await new Promise((resolve) => setTimeout(resolve, 300));
      router.push('/dziekujemy');
    } catch (error) {
      setError(error.message || t('multistep.submitError', 'Wystąpił błąd podczas wysyłania formularza. Spróbuj ponownie.'));
    }
  };

  return (
    <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-10 border border-gray-200/50 backdrop-blur-sm">
      {onBack && step === 1 && isClient && (
        <button onClick={onBack} className="flex items-center text-purple-600 hover:text-purple-800 mb-6 transition-all duration-200 text-sm font-medium hover:bg-purple-50 px-3 py-2 rounded-lg">
          <ArrowLeft size={18} className="mr-1.5" />
          {isClient ? t('back', 'Powrót') : 'Powrót'}
        </button>
      )}
      {step === 1 && (
        <div className="mb-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
            {t('multistep.intro.title', 'Dołącz do Strefy Startu!')}
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            {t('multistep.intro.description', 'Wypełnij formularz, aby rozpocząć współpracę i skorzystać z naszych usług dla startupów.')}
          </p>
        </div>
      )}
      <div className="w-full bg-gray-200/60 rounded-full h-3 mb-8 overflow-hidden shadow-inner">
        <motion.div
          className="bg-gradient-to-r from-purple-500 to-blue-500 h-full rounded-full shadow-sm"
          initial={{ width: 0 }}
          animate={{ width: `${(step / 2) * 100}%` }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      </div>
      <AnimatePresence>
      {error && (
          <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 mb-6 text-sm text-red-700 bg-red-50 rounded-xl border border-red-200/50 shadow-sm"
              role="alert"
          >
            <span className="font-medium">{t('common.error', 'Błąd!')}</span> {error}
          </motion.div>
      )}
      </AnimatePresence>
      <div className="overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: step === 1 ? 0 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full"
          >
            {step === 1 && (
              <form onSubmit={nextStep} className="space-y-5">
                <h3 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-3 mb-6">
                  {t('multistep.step1.title', 'Krok 1: Twój pomysł na biznes')}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-700">
                      {t('form.fullName', 'Imię i nazwisko')} <span className="text-red-500">*</span>
                    </label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className={inputClasses} placeholder={t('form.fullNamePlaceholder', 'Np. Jan Kowalski')}/>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-700">
                      {t('form.email', 'Adres e-mail')} <span className="text-red-500">*</span>
                    </label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className={inputClasses} placeholder={t('form.emailPlaceholder', 'Np. jan.kowalski@example.com')}/>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-700">{t('form.phone', 'Numer telefonu (opcjonalnie)')}</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputClasses} placeholder={t('form.phonePlaceholder', 'Np. +48 123 456 789')}/>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-700">{t('form.age', 'Wiek (opcjonalnie)')}</label>
                    <input type="number" name="age" value={formData.age} onChange={handleChange} min="1" className={inputClasses} placeholder={t('form.agePlaceholder', 'Np. 30')}/>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-700">
                      {t('form.referralCode', 'Kod polecenia (opcjonalnie)')}
                    </label>
                    <input 
                      type="text" 
                      name="referralCode" 
                      value={formData.referralCode || ''} 
                      onChange={handleChange} 
                      className={inputClasses} 
                      placeholder={t('form.referralCodePlaceholder', 'Wpisz kod polecający')}
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <motion.button 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }} 
                    type="submit" 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-8 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 text-sm"
                  >
                    {t('next', 'Dalej')} <span aria-hidden="true" className="ml-1">&rarr;</span>
                  </motion.button>
                </div>
              </form>
            )}
            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-3 mb-6">
                  {t('multistep.step2.title', 'Krok 2: Temat zgłoszenia i zgody')}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-700">
                      {t('form.topic', 'Temat zgłoszenia')} <span className="text-red-500">*</span>
                    </label>
                    <Select
                      options={topicOptions}
                      value={topicOptions.find(option => option.value === formData.topic) || null}
                      onChange={option => setFormData(prev => ({ ...prev, topic: option ? option.value : '' }))}
                      required
                      className="react-select-container"
                      classNamePrefix="react-select"
                      placeholder={t('form.topicPlaceholder', 'Wybierz temat...')}
                      instanceId="topic-select"
                      menuPortalTarget={portalTarget}
                      styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }), menu: base => ({ ...base, zIndex: 9999 }) }}
                    />
                    <input tabIndex={-1} autoComplete="off" style={{ opacity: 0, height: 0, position: 'absolute', pointerEvents: 'none' }} value={formData.topic} onChange={() => {}} required={true} aria-hidden="true"/>
                  </div>
                  <div className="space-y-4 pt-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                    <label className="flex items-start space-x-3 text-sm text-gray-700 cursor-pointer hover:bg-gray-50/80 p-2 rounded-lg transition-colors">
                      <input
                        type="checkbox"
                        name="acceptRODO"
                        checked={formData.acceptRODO}
                        onChange={handleChange}
                        required
                        className="mt-1 rounded text-purple-600 focus:ring-purple-500 border-gray-300 shadow-sm flex-shrink-0"
                      />
                      <span>
                        {t('form.acceptRODOText', 'Wyrażam zgodę na przetwarzanie moich danych osobowych zgodnie z RODO.')} <span className="text-red-500">*</span>{' '}
                        <Link href="/docs/polityka.pdf" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline font-medium">{t('common.readMore', 'Czytaj więcej')}</Link>
                      </span>
                    </label>
                    <label className="flex items-start space-x-3 text-sm text-gray-700 cursor-pointer hover:bg-gray-50/80 p-2 rounded-lg transition-colors">
                      <input
                        type="checkbox"
                        name="acceptPrivacy"
                        checked={formData.acceptPrivacy}
                        onChange={handleChange}
                        required
                        className="mt-1 rounded text-purple-600 focus:ring-purple-500 border-gray-300 shadow-sm flex-shrink-0"
                      />
                      <span>
                        {t('form.acceptPrivacyText', 'Akceptuję Politykę Prywatności serwisu.')} <span className="text-red-500">*</span>{' '}
                        <Link href="/docs/polityka.pdf" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline font-medium">{t('common.readMore', 'Czytaj więcej')}</Link>
                      </span>
                    </label>
                  </div>
                </div>
                <div className="flex justify-between pt-4">
                  <motion.button 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }} 
                    type="button" 
                    onClick={prevStep} 
                    className="bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 text-sm border border-gray-200"
                  >
                    <span aria-hidden="true" className="mr-1">&larr;</span> {isClient ? t('back', 'Wstecz') : 'Wstecz'}
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }} 
                    type="submit"
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-8 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 text-sm"
                  >
                    {t('submit', 'Wyślij zgłoszenie')}
                  </motion.button>
                </div>
              </form>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

const IntroDescription = ({ onContinue }) => {
  const { t } = useTranslation('common');
  const paragraphs = [
    t('joinIntroScreen.paragraph1', 'Jeśli chcesz prowadzić własną firmę, ale nie masz jeszcze 18 lat lub rejestracja działalności wydaje Ci się zbyt skomplikowana, skorzystaj z naszego Inkubatora Przedsiębiorczości.'),
    t('joinIntroScreen.paragraph2', 'Wypełnij formularz zgłoszeniowy i podaj jak najwięcej informacji — dzięki temu będziemy mogli skontaktować się z Tobą, a proces rekrutacji przebiegnie sprawnie. Opisz swój pomysł na biznes lub kierunek, w którym chciałbyś się rozwijać.'),
    t('joinIntroScreen.paragraph3', 'Po przesłaniu formularza otrzymasz od nas powitalnego maila wraz z kompletem dokumentów do wglądu.'),
    t('joinIntroScreen.paragraph4', 'Następnie skontaktuje się z Tobą Twój Koordynator — osoba, która pomoże Ci przygotować wszystkie formalności, zapozna się z profilem Twojej działalności i w razie potrzeby umówi konsultacje w odpowiednich działach. Dzięki temu uzyskasz odpowiedzi na wszystkie pytania i pełne wsparcie na starcie.'),
    t('joinIntroScreen.paragraph5', 'Kiedy wszystko będzie gotowe, rozpoczniesz swoją przygodę z własną firmą, rozwijając się pod opieką doświadczonego Koordynatora i całego zespołu Fundacji.')
  ];

  return (
    <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-10 border border-gray-200/50 backdrop-blur-sm">
      <div className="text-center mb-8">
        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-purple-600">
          {t('joinIntroScreen.heading', 'Opis formularza')}
        </p>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3">
          {t('joinIntroScreen.subtitle', 'Zanim przejdziesz do zgłoszenia, poznaj proces krok po kroku')}
        </h1>
      </div>
      <div className="space-y-4 text-gray-700 text-sm md:text-base leading-relaxed">
        {paragraphs.map((text, index) => (
          <p key={index}>{text}</p>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onContinue}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-10 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 text-sm"
        >
          {t('joinIntroScreen.cta', 'Przejdź do formularza')}
        </motion.button>
      </div>
    </div>
  );
};


// --- PRZYKŁAD UŻYCIA W STRONIE NEXT.JS ---
// Jeśli ten kod znajduje się np. w pliku `pages/join-us.js` lub `pages/join_us.jsx`
// Poniższy komponent może reprezentować całą stronę.
// Dostosuj go do swojej struktury.

const JoinUsPage = () => {
  const { t } = useTranslation('common'); // Potrzebne dla Head i stopki
  const [showForm, setShowForm] = useState(false);

  const handleGoBack = () => {
    setShowForm(false);
  };

  const handleIntroContinue = () => {
    setShowForm(true);
  };

  return (
    <>
      <Head>
        <title>{t('pageTitles.joinUs', 'Dołącz do nas - StrefaStartu')}</title>
        <meta name="description" content={t('pageDescriptions.joinUs', 'Wypełnij formularz aplikacyjny, aby dołączyć do Strefy Startu i rozwijać swój biznes.')} />
        {/* Dodaj inne meta tagi jeśli potrzebujesz */}
      </Head>

      {/* Kontener centrujący dla całej strony */}
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
        {/* Opcjonalny przełącznik języka */}
        <div className="absolute top-4 right-4 z-10">
          <LanguageSwitcher />
        </div>

        {/* Animacja wejścia dla formularza */}
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            className="w-full flex justify-center" // Używamy flex do centrowania kontenera formularza
        >
            {showForm ? (
              <MultiStepForm onBack={handleGoBack} />
            ) : (
              <IntroDescription onContinue={handleIntroContinue} />
            )}
        </motion.div>

        {/* Prosta stopka strony */}
        <footer className="text-center text-gray-500 text-xs mt-8">
            © {new Date().getFullYear()} StrefaStartu. {t('footer.rightsReserved', 'Wszelkie prawa zastrzeżone.')}
            <div className="mt-1">
                <Link href="/docs/polityka.pdf" className="hover:underline">{t('footer.privacyPolicy', 'Polityka Prywatności')}</Link>
                {' | '}
                <Link href="/docs/terms.pdf" className="hover:underline">{t('footer.terms', 'Regulamin')}</Link>
            </div>
        </footer>
      </main>
    </>
  );
};

// Eksportuj komponent strony, jeśli to plik w katalogu `pages`
export default JoinUsPage;