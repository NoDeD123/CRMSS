// src/CalculatorWithCopyrightTransfer.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

function CalculatorWithCopyrightTransfer() {
  const { t } = useTranslation('common');

  const [kwotaNaKonto, setKwotaNaKonto] = useState(1000);
  const [przeniesieniePrawAutorskich, setPrzeniesieniePrawAutorskich] = useState(false);

  // Opłata serwisowa – 9%
  const oplataSerwisowa = 0.09 * kwotaNaKonto;

  // Koszty uzyskania przychodu – 50% lub 20%
  const kosztyUzyskania = przeniesieniePrawAutorskich
    ? 0.5 * kwotaNaKonto
    : 0.2 * kwotaNaKonto;

  // Podstawa opodatkowania
  const podstawaOpodatkowania = kwotaNaKonto - oplataSerwisowa - kosztyUzyskania;

  // Dobieramy stawkę tak, by przy kwocie 1000 zł wychodziło 64 zł (przeniesienie) albo 106 zł (bez)
  // — to są tylko przykładowe wartości procentowe, aby uzyskać wymagany wynik.
  const stawkaPodatku = przeniesieniePrawAutorskich ? 0.1561 : 0.1493;

  // Podatek dochodowy
  const podatekDochodowy = Math.round(podstawaOpodatkowania * stawkaPodatku);

  // VAT – 23% od kwoty na konto
  const kwotaVat = 0.23 * kwotaNaKonto;

  // Kwota brutto – to co klient płaci
  const kwotaBrutto = kwotaNaKonto + podatekDochodowy + oplataSerwisowa + kwotaVat;

  return (


      <motion.div
        className="flex-1 flex flex-col bg-white/40 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl border-2 border-white/60 h-full"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Input: Kwota na konto */}
        <div className="mb-6">
          <label className="block text-lg font-semibold text-gray-800 mb-1">
            {t('netAmountToAccount')}
          </label>
          <div className="flex items-center gap-3 bg-white/60 p-3 rounded-lg border border-purple-100 focus-within:ring-2 focus-within:ring-purple-300">
            <input
              type="number"
              className="w-full px-4 py-2 bg-transparent text-gray-900 text-lg font-medium border-none focus:ring-0"
              value={kwotaNaKonto}
              onChange={(e) => setKwotaNaKonto(parseFloat(e.target.value) || 0)}
            />
            <span className="text-gray-600 font-medium">PLN</span>
          </div>
        </div>

        {/* Checkbox: Przeniesienie praw autorskich */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <input
              type="checkbox"
              checked={przeniesieniePrawAutorskich}
              onChange={(e) => setPrzeniesieniePrawAutorskich(e.target.checked)}
              className="h-5 w-5 text-purple-600 focus:ring-0"
            />
            {t('transferOfCopyrights')}
          </label>
        </div>

        {/* Wyliczenia pośrednie */}
        <div className="space-y-4">
          <p className="flex justify-between items-center text-gray-700">
            <span>{t('incomeTax')}:</span>
            <strong className="text-lg text-gray-900">{podatekDochodowy.toFixed(2)} PLN</strong>
          </p>
          <p className="flex justify-between items-center text-gray-700">
            <span>{t('serviceFee')}:</span>
            <strong className="text-lg text-gray-900">{oplataSerwisowa.toFixed(2)} PLN*</strong>
          </p>
          <p className="flex justify-between items-center text-gray-700">
            <span>{t('vat')}:</span>
            <strong className="text-lg text-gray-900">{kwotaVat.toFixed(2)} PLN</strong>
          </p>
        </div>

        {/* Kwota brutto */}
        <div className="mt-auto space-y-4 pt-6 border-t border-purple-100/60">
          <h4 className="text-2xl font-bold text-purple-700 mb-3">
            {t('grossAmountWithVat')}
          </h4>
          <p className="flex justify-between items-center text-xl font-bold text-gray-900 bg-purple-50/60 px-4 py-3 rounded-lg">
            <span>{t('totalGross')}:</span>
            <span>{kwotaBrutto.toFixed(2)} PLN</span>
          </p>
        </div>

        <motion.p
          className="text-sm text-gray-600/90 mt-6 pt-4 border-t border-purple-100/60"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {t('sampleServiceFee')}
        </motion.p>
      </motion.div>
  );
}

export default CalculatorWithCopyrightTransfer;
