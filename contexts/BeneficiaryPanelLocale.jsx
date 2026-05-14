import React, { createContext, useContext } from 'react';
import i18n from '@/lib/i18n';

const defaultTp = i18n.getFixedT('pl', 'panel');

const defaultValue = {
  lng: 'pl',
  tp: defaultTp,
  setLng: () => {},
};

export const BeneficiaryPanelLocaleContext = createContext(defaultValue);

export function useBeneficiaryPanelLocale() {
  return useContext(BeneficiaryPanelLocaleContext);
}
