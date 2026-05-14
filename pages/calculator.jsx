import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Check,
  Upload,
  Building,
  User,
  FileText,
  Calculator,
  Languages,
  Image as ImageIcon,
  Code,
  Video,
  Briefcase,
  HelpCircle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../lib/i18n';
import '../styles/globals.css';
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import CalculatorWithCopyrightTransfer from '../components/CalculatorWithCopyrightTransfer';

const menuLinks = [
  { label: 'Strona Główna', href: '/' },
  { label: 'O nas', href: '/about' },
  { label: 'Kalkulator', href: '/calculator' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Kontakt', href: '/contact' },
  { label: 'Dołącz do nas', href: '/join_us' }
];

// Definicje animacji
const pageVariants = {
  initial: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: 0.6, ease: 'easeInOut' } },
  exit: { opacity: 0, transition: { duration: 0.3, ease: 'easeInOut' } },
};

// Komponent Modal
const Modal = ({ isOpen, onClose, children }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// Przełącznik językowy
const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
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

// Pole Input
function InputField({
  label,
  id,
  value,
  onChange,
  placeholder,
  error,
  type = 'text',
  required
}) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
        required={required}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

// Kategorie
const categoriesData = [
  { value: 'translations', labelKey: 'translationsLabel', icon: Languages },
  { value: 'graphics', labelKey: 'graphicsLabel', icon: ImageIcon },
  { value: 'programming', labelKey: 'programmingLabel', icon: Code },
  { value: 'multimedia', labelKey: 'multimediaLabel', icon: Video },
  { value: 'customerService', labelKey: 'customerServiceLabel', icon: HelpCircle },
  { value: 'officeWork', labelKey: 'officeWorkLabel', icon: Briefcase }
];

function CategorySelector({ selectedCategory, onSelectCategory }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-6">
      {categoriesData.map((cat) => {
        const Icon = cat.icon;
        if (!Icon) return null;

        return (
          <button
            key={cat.value}
            type="button"
            onClick={() => onSelectCategory(cat.value)}
            className={`p-4 border rounded-lg text-center cursor-pointer transition-colors 
              w-28 h-36 flex flex-col items-center justify-center 
              ${
                selectedCategory === cat.value
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-300 bg-white hover:bg-gray-50'
              }`}
          >
            <Icon className="w-12 h-12 mb-2" />
            <span className="text-sm">{t(cat.labelKey)}</span>
          </button>
        );
      })}
    </div>
  );
}

// Formularz faktury w modalu
function InvoiceFormModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [filePreview, setFilePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    file: null,
    title: '',
    description: '',
    category: '',
    freelancer: {
      firstName: '',
      lastName: '',
      email: '',
      address: '',
      pesel: '',
      phone: '',
      bankAccount: ''
    },
    counterparty: {
      nip: '',
      address: '',
      email: '',
      phone: '',
      contractorName: ''
    },
    netAmount: '',
    currency: 'PLN',
    paymentDue: ''
  });

  const validateStep = () => {
    const newErrors = {};
    switch (step) {
      case 1:
        if (!formData.title.trim()) newErrors.title = t('fieldRequired');
        if (!formData.category) newErrors.category = t('selectCategory');
        break;
      case 2:
        if (!formData.freelancer.firstName.trim()) newErrors.firstName = t('fieldRequired');
        if (!formData.freelancer.lastName.trim()) newErrors.lastName = t('fieldRequired');
        if (!formData.freelancer.email.trim()) newErrors.email = t('fieldRequired');
        if (!formData.freelancer.pesel.trim()) newErrors.pesel = t('fieldRequired');
        if (!formData.freelancer.phone.trim()) newErrors.phone = t('fieldRequired');
        break;
      case 3:
        if (!formData.counterparty.nip.trim()) newErrors.nip = t('fieldRequired');
        if (!formData.counterparty.email.trim()) newErrors.counterpartyEmail = t('fieldRequired');
        if (!formData.counterparty.phone.trim()) newErrors.counterpartyPhone = t('fieldRequired');
        if (!formData.counterparty.contractorName.trim()) newErrors.contractorName = t('fieldRequired');
        break;
      case 4:
        if (!formData.netAmount || Number(formData.netAmount) <= 0) {
          newErrors.netAmount = t('enterValidAmount');
        }
        break;
      default:
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, file }));
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setFormData((prev) => ({ ...prev, file }));
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const nextStep = () => {
    if (validateStep()) setStep((prev) => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const StepProgress = () => (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        {[1, 2, 3, 4].map((num) => (
          <div key={num} className="flex flex-col items-center w-1/4">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center 
                ${step >= num ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
            >
              {num}
            </div>
            <span className="text-sm mt-2 text-gray-600">{t('step', { number: num })}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <StepProgress />
        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="mb-4 text-center">
              <h2 className="text-xl font-bold mb-2">{t('uploadFile')}</h2>
              <p className="text-gray-600">{t('uploadFileDescription')}</p>
            </div>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              {filePreview ? (
                <div className="flex flex-col items-center">
                  <FileText className="w-12 h-12 text-purple-600 mb-4" />
                  <p className="font-medium">{formData.file?.name}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setFilePreview(null);
                      setFormData((prev) => ({ ...prev, file: null }));
                    }}
                    className="text-red-600 text-sm mt-2"
                  >
                    {t('changeFile')}
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="fileUpload"
                  />
                  <label htmlFor="fileUpload" className="cursor-pointer">
                    <span className="text-purple-600 font-medium">{t('clickToSelectFile')}</span>
                    <p className="text-gray-500 text-sm mt-2">{t('orDragHere')}</p>
                  </label>
                </>
              )}
            </div>
            <InputField
              label={t('title')}
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder={t('documentNamePlaceholder')}
              error={errors.title}
              required
            />
            <div className="mb-6">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t('description')}
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder={t('optionalDescriptionPlaceholder')}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                rows="4"
              />
            </div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('category')} <span className="text-red-500">*</span>
            </label>
            <CategorySelector
              selectedCategory={formData.category}
              onSelectCategory={(catValue) => setFormData((prev) => ({ ...prev, category: catValue }))}
            />
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </motion.div>
        )}
        {step === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center mb-6">
              <User className="w-6 h-6 text-purple-600 mr-2" />
              <h3 className="text-xl font-semibold">{t('yourDetails')}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label={t('firstName')}
                id="firstName"
                value={formData.freelancer.firstName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    freelancer: { ...prev.freelancer, firstName: e.target.value }
                  }))
                }
                error={errors.firstName}
                required
              />
              <InputField
                label={t('lastName')}
                id="lastName"
                value={formData.freelancer.lastName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    freelancer: { ...prev.freelancer, lastName: e.target.value }
                  }))
                }
                error={errors.lastName}
                required
              />
              <InputField
                label={t('email')}
                id="freelancerEmail"
                type="email"
                value={formData.freelancer.email}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    freelancer: { ...prev.freelancer, email: e.target.value }
                  }))
                }
                error={errors.email}
                required
              />
              <InputField
                label={t('address')}
                id="freelancerAddress"
                value={formData.freelancer.address}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    freelancer: { ...prev.freelancer, address: e.target.value }
                  }))
                }
              />
              <InputField
                label={t('pesel')}
                id="pesel"
                value={formData.freelancer.pesel}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    freelancer: { ...prev.freelancer, pesel: e.target.value }
                  }))
                }
                error={errors.pesel}
                required
              />
              <InputField
                label={t('phone')}
                id="phone"
                value={formData.freelancer.phone}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    freelancer: { ...prev.freelancer, phone: e.target.value }
                  }))
                }
                error={errors.phone}
                required
              />
              <InputField
                label={t('bankAccount')}
                id="bankAccount"
                value={formData.freelancer.bankAccount}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    freelancer: { ...prev.freelancer, bankAccount: e.target.value }
                  }))
                }
                required
              />
            </div>
          </motion.div>
        )}
        {step === 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center mb-6">
              <Building className="w-6 h-6 text-purple-600 mr-2" />
              <h3 className="text-xl font-semibold">{t('counterpartyDetails')}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label={t('nip')}
                id="nip"
                value={formData.counterparty.nip}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    counterparty: { ...prev.counterparty, nip: e.target.value }
                  }))
                }
                error={errors.nip}
                required
              />
              <InputField
                label={t('counterpartyAddress')}
                id="counterpartyAddress"
                value={formData.counterparty.address}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    counterparty: { ...prev.counterparty, address: e.target.value }
                  }))
                }
              />
              <InputField
                label={t('email')}
                id="counterpartyEmail"
                type="email"
                value={formData.counterparty.email}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    counterparty: { ...prev.counterparty, email: e.target.value }
                  }))
                }
                error={errors.counterpartyEmail}
                required
              />
              <InputField
                label={t('phone')}
                id="counterpartyPhone"
                value={formData.counterparty.phone}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    counterparty: { ...prev.counterparty, phone: e.target.value }
                  }))
                }
                error={errors.counterpartyPhone}
                required
              />
              <InputField
                label={t('contractorName')}
                id="contractorName"
                value={formData.counterparty.contractorName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    counterparty: { ...prev.counterparty, contractorName: e.target.value }
                  }))
                }
                error={errors.contractorName}
                required
              />
            </div>
          </motion.div>
        )}
        {step === 4 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center mb-6">
              <Calculator className="w-6 h-6 text-purple-600 mr-2" />
              <h3 className="text-xl font-semibold">{t('payment')}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label={t('netAmount')}
                id="netAmount"
                type="number"
                value={formData.netAmount}
                onChange={(e) => setFormData((prev) => ({ ...prev, netAmount: e.target.value }))}
                error={errors.netAmount}
                required
              />
              <div className="mb-6">
                <label
                  htmlFor="currency"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t('currency')}
                </label>
                <select
                  id="currency"
                  value={formData.currency}
                  onChange={(e) => setFormData((prev) => ({ ...prev, currency: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                >
                  {['PLN', 'EUR', 'USD'].map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>
              <InputField
                label={t('paymentDue')}
                id="paymentDue"
                type="date"
                value={formData.paymentDue}
                onChange={(e) => setFormData((prev) => ({ ...prev, paymentDue: e.target.value }))}
              />
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold mb-4">{t('summary')}</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>{t('netAmountLabel')}:</span>
                  <span>{formData.netAmount || 0} {formData.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('vat')}:</span>
                  <span>
                    {formData.netAmount ? (Number(formData.netAmount) * 0.23).toFixed(2) : '0.00'} {formData.currency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{t('incomeTax')}:</span>
                  <span>
                    {formData.netAmount ? (Number(formData.netAmount) * 0.12).toFixed(2) : '0.00'} {formData.currency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{t('serviceFee')}:</span>
                  <span>
                    {formData.netAmount ? (Number(formData.netAmount) * 0.09).toFixed(2) : '0.00'} {formData.currency}
                  </span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-2">
                  <span>{t('totalGross')}:</span>
                  <span>
                    {formData.netAmount ? (Number(formData.netAmount) * 1.44).toFixed(2) : '0.00'} {formData.currency}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        <div className="flex justify-between border-t pt-6">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              {t('back')}
            </button>
          )}
          <div className="flex-1" />
          {step < 4 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              {t('next')}
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? t('processing') : t('issueInvoice')}
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
}

// Komponent Kalkulatory
function Kalkulatory() {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isStudent, setIsStudent] = useState(null);
  const [useNFZ, setUseNFZ] = useState(null);
  
  const [expectedIncome, setExpectedIncome] = useState(1000);

  const inkubacja = 365;
  let nfzRate = 0;
  if (!isStudent && useNFZ) nfzRate = 0.09;
  const nfzCost = nfzRate * expectedIncome;
  const totalCost = inkubacja + nfzCost;
  const finalNet = expectedIncome - totalCost;

  const [kwotaNaKonto, setKwotaNaKonto] = useState(1000);
  const stawkaPodatek = 0.12;
  const stawkaSerwisowa = 0.09;
  const stawkaVat = 0.23;

  const podatekDochodowy = kwotaNaKonto * stawkaPodatek;
  const oplataSerwisowa = kwotaNaKonto * stawkaSerwisowa;
  const kwotaVat = kwotaNaKonto * stawkaVat;
  const kwotaBrutto = kwotaNaKonto + podatekDochodowy + oplataSerwisowa + kwotaVat;

  return (
    <>
      <div className="mx-auto my-16 max-w-7xl p-6 bg-white/30 backdrop-blur-lg border border-white/20 rounded-3xl shadow-xl">
        <section className="py-6">
          <motion.h2
            className="text-4xl text-center font-extrabold text-purple-600 mb-4"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {t('calculatorsTitle')}
          </motion.h2>
          <motion.a
            className="block mx-auto mb-8 text-sm text-purple-700 hover:underline font-semibold tracking-wide uppercase text-center"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t('checkSavings')}
          </motion.a>
          <motion.div
            className="bg-white/30 backdrop-blur-lg p-6 rounded-3xl shadow-xl border border-white/40"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="py-3 px-4 text-xs uppercase font-bold text-gray-700">{t('description')}</th>
                  <th className="py-3 px-4 text-xs uppercase font-bold text-gray-700">{t('withIncubator')}</th>
                  <th className="py-3 px-4 text-xs uppercase font-bold text-gray-700">{t('independently')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-800">
                <tr>
                  <td className="py-3 px-4 font-semibold">{t('registrationTime')}</td>
                  <td className="py-3 px-4">{t('oneDay')}</td>
                  <td className="py-3 px-4">{t('about30Days')}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold">{t('incomeTaxLabel')}</td>
                  <td className="py-3 px-4">6/9,6 %</td>
                  <td className="py-3 px-4">{t('taxScale')}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold">{t('zusNfz')}</td>
                  <td className="py-3 px-4">{t('dependsOnStatus')}</td>
                  <td className="py-3 px-4">{t('fullZus')}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold">{t('paidPpk')}</td>
                  <td className="py-3 px-4">0 zł</td>
                  <td className="py-3 px-4">-</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold">{t('accounting')}</td>
                  <td className="py-3 px-4">0 zł</td>
                  <td className="py-3 px-4">{t('about250')}</td>
                </tr>
                <tr className="bg-white/20">
                  <td className="py-3 px-4 font-bold text-lg">{t('monthly')}</td>
                  <td className="py-3 px-4 font-bold text-purple-600">365 zł</td>
                  <td className="py-3 px-4 font-bold text-red-700">{t('1400Plus')}</td>
                </tr>
              </tbody>
            </table>
          </motion.div>
          <motion.div
            className="relative overflow-hidden my-12 py-8 px-6 rounded-2xl shadow-2xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ background: 'linear-gradient(135deg,rgb(16, 109, 185) 0%,rgb(150, 5, 119) 100%)' }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute w-32 h-32 bg-white/10 rounded-full -top-16 -left-16" />
              <div className="absolute w-48 h-48 bg-white/10 rounded-full -bottom-24 -right-24" />
            </div>
            <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
              <motion.div className="flex items-center space-x-4" whileHover={{ scale: 1.05 }}>
                <h3 className="text-3xl font-extrabold text-white text-center">{t('noHiddenCosts')}</h3>
              </motion.div>
              <motion.div
                className="flex space-x-6 text-white/90 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center space-x-2">
                  <Check className="h-5 w-5 text-emerald-200" />
                  <span>{t('fullTransparency')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-5 w-5 text-emerald-200" />
                  <span>{t('noSurprises')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-5 w-5 text-emerald-200" />
                  <span>{t('fixedRate')}</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-stretch mt-12 px-4">
            <div className="flex-1 flex flex-col">
              <header className="mb-6">
                <h2 className="text-3xl font-bold text-purple-700 mb-3 text-center drop-shadow-md">
                  {t('calculator1')}
                </h2>
                <a
                  className="block mx-auto mb-5 text-sm text-purple-800 hover:text-purple-900 transition-colors duration-200 font-medium tracking-wide uppercase text-center hover:underline underline-offset-4"
                >
                  {t('check')}
                </a>
              </header>
              <motion.div
        className="flex-1 flex flex-col bg-white/40 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl border-2 border-white/60 h-full"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
              >
                <div className="space-y-6 mb-6">
                  <div className="space-y-3">
                    <label className="block text-lg font-semibold text-gray-800 mb-1">
                      {t('areYouStudent')}
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      {[true, false].map((value) => (
                        <label
                          key={value.toString()}
                          className="flex items-center bg-purple-50/50 px-4 py-2 rounded-lg transition-colors duration-200 has-[input:checked]:bg-purple-100 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="isStudent"
                            checked={isStudent === value}
                            onChange={() => setIsStudent(value)}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="ml-2 text-gray-800">{value ? t('yes') : t('no')}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {!isStudent && (
                    <div className="space-y-3">
                      <label className="block text-lg font-semibold text-gray-800 mb-1">
                        {t('voluntaryHealthInsurance')}
                      </label>
                      <div className="flex flex-col sm:flex-row gap-3">
                        {[true, false].map((value) => (
                          <label
                            key={value.toString()}
                            className="flex items-center bg-purple-50/50 px-4 py-2 rounded-lg transition-colors duration-200 has-[input:checked]:bg-purple-100 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="useNFZ"
                              checked={useNFZ === value}
                              onChange={() => setUseNFZ(value)}
                              className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                            />
                            <span className="ml-2 text-gray-800">{value ? t('yes') : t('no')}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="space-y-3">
                    <label className="block text-lg font-semibold text-gray-800 mb-1">
                      {t('expectedIncome')}
                    </label>
                    <div className="flex items-center gap-3 bg-white/60 p-3 rounded-lg border border-purple-100 focus-within:ring-2 focus-within:ring-purple-300">
                      <input
                        type="number"
                        className="w-full px-4 py-2 bg-transparent text-gray-900 text-lg font-medium border-none focus:ring-0"
                        value={expectedIncome}
                        onChange={(e) => setExpectedIncome(parseFloat(e.target.value) || 0)}
                      />
                      <span className="text-gray-600 font-medium">PLN</span>
                    </div>
                  </div>
                </div>
                <div className="mt-auto space-y-4">
                  <h4 className="text-2xl font-bold text-purple-700 mb-3">{t('monthlyCosts')}</h4>
                  <div className="space-y-2">
                    <p className="flex justify-between items-center text-gray-700">
                      <span>{t('incubationFee')}:</span>
                      <strong className="text-lg text-gray-900">{inkubacja} PLN*</strong>
                    </p>
                    <p className="flex justify-between items-center text-gray-700">
                      <span>{t('nfzContribution')}:</span>
                      <strong className="text-lg text-gray-900">{nfzCost.toFixed(2)} PLN</strong>
                    </p>
                  </div>
                  <div className="pt-6 border-t border-purple-100/60">
                    <h4 className="text-2xl font-bold text-purple-700 mb-3">{t('yourNet')}</h4>
                    <p className="flex justify-between items-center text-xl font-bold text-gray-900 bg-purple-50/60 px-4 py-3 rounded-lg">
                      <span>{t('netAmountLabel')}:</span>
                      <span>{finalNet.toFixed(2)} PLN</span>
                    </p>
                  </div>
                </div>
                <motion.p
                  className="text-sm text-gray-600/90 mt-6 pt-4 border-t border-purple-100/60"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  {t('sampleIncubationFee')}
                </motion.p>
              </motion.div>
            </div>
            <div className="flex-1 flex flex-col">
  <header className="mb-6">
    <h2 className="text-3xl font-bold text-purple-700 mb-3 text-center drop-shadow-md">
      {t('calculator2')}
    </h2>
    <a
      className="block mx-auto mb-5 text-sm text-purple-800 hover:text-purple-900 transition-colors duration-200 font-medium tracking-wide uppercase text-center hover:underline underline-offset-4"
    >
      {t('check')}
    </a>
  </header>


                    <CalculatorWithCopyrightTransfer/>

    {/* Tutaj w oryginale miałeś input, obliczenia, wyświetlanie wyników... */}
</div>
          </div>
        </section>
      </div>
      {isModalOpen && <InvoiceFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
    </>
  );
}

// Główna strona
export default function KalkulatoryPage() {
  const { t } = useTranslation();
  const router = useRouter();

  // Dodanie stanu obsługującego menu mobilne
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <AnimatePresence mode="wait">
      <motion.div key={router.route} initial="initial" animate="enter" exit="exit" variants={pageVariants}>
        <Head>
          <title>{t('costsPageTitle')}</title>
          <meta name="description" content={t('costsPageDescription')} />
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
          <main className="flex-grow">
            <Kalkulatory />
          </main>
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
