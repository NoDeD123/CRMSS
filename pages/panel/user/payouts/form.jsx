import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import PanelLayout from '@/components/Layout/PanelLayout';
import { Card, CardContent } from '@/components/ui/card';
import { useBeneficiaryPanelLocale } from '@/contexts/BeneficiaryPanelLocale';

const nfzBranches = [
  '01 - Dolnośląski Oddział Narodowego Funduszu Zdrowia we Wrocławiu',
  '02 - Kujawsko-Pomorski Oddział Narodowego Funduszu Zdrowia w Bydgoszczy',
  '03 - Lubelski Oddział Narodowego Funduszu Zdrowia w Lublinie',
  '04 - Lubuski Oddział Narodowego Funduszu Zdrowia w Zielonej Górze',
  '05 - Łódzki Oddział Narodowego Funduszu Zdrowia w Łodzi',
  '06 - Małopolski Oddział Narodowego Funduszu Zdrowia w Krakowie',
  '07 - Mazowiecki Oddział Narodowego Funduszu Zdrowia w Warszawie',
  '08 - Opolski Oddział Narodowego Funduszu Zdrowia w Opolu',
  '09 - Podkarpacki Oddział Narodowego Funduszu Zdrowia w Rzeszowie',
  '10 - Podlaski Oddział Narodowego Funduszu Zdrowia w Białymstoku',
  '11 - Pomorski Oddział Narodowego Funduszu Zdrowia w Gdańsku',
  '12 - Śląski Oddział Narodowego Funduszu Zdrowia w Katowicach',
  '13 - Świętokrzyski Oddział Narodowego Funduszu Zdrowia w Kielcach',
  '14 - Warmińsko-Mazurski Oddział Narodowego Funduszu Zdrowia w Olsztynie',
  '15 - Wielkopolski Oddział Narodowego Funduszu Zdrowia w Poznaniu',
  '16 - Zachodniopomorski Oddział Narodowego Funduszu Zdrowia w Szczecinie'
];

const citizenships = [
  ['AF', 'Afganistan'],
  ['AL', 'Albania'],
  ['DZ', 'Algieria'],
  ['AD', 'Andora'],
  ['AO', 'Angola'],
  ['AR', 'Argentyna'],
  ['AM', 'Armenia'],
  ['AU', 'Australia'],
  ['AT', 'Austria'],
  ['AZ', 'Azerbejdżan'],
  ['BY', 'Białoruś'],
  ['BE', 'Belgia'],
  ['BR', 'Brazylia'],
  ['BG', 'Bułgaria'],
  ['CN', 'Chiny'],
  ['HR', 'Chorwacja'],
  ['CZ', 'Czechy'],
  ['DK', 'Dania'],
  ['EE', 'Estonia'],
  ['FI', 'Finlandia'],
  ['FR', 'Francja'],
  ['GE', 'Gruzja'],
  ['ES', 'Hiszpania'],
  ['NL', 'Holandia'],
  ['IN', 'Indie'],
  ['IE', 'Irlandia'],
  ['IS', 'Islandia'],
  ['IL', 'Izrael'],
  ['JP', 'Japonia'],
  ['CA', 'Kanada'],
  ['KZ', 'Kazachstan'],
  ['LT', 'Litwa'],
  ['LU', 'Luksemburg'],
  ['LV', 'Łotwa'],
  ['MT', 'Malta'],
  ['DE', 'Niemcy'],
  ['NO', 'Norwegia'],
  ['PL', 'Polska'],
  ['PT', 'Portugalia'],
  ['RO', 'Rumunia'],
  ['SK', 'Słowacja'],
  ['SI', 'Słowenia'],
  ['SE', 'Szwecja'],
  ['CH', 'Szwajcaria'],
  ['TR', 'Turcja'],
  ['UA', 'Ukraina'],
  ['GB', 'Wielka Brytania'],
  ['IT', 'Włochy'],
  ['US', 'Stany Zjednoczone']
];

const taxOffices = [
  'Dolnośląski Urząd Skarbowy we Wrocławiu',
  'Drugi Mazowiecki Urząd Skarbowy w Warszawie',
  'Drugi Urząd Skarbowy Kraków',
  'Pierwszy Mazowiecki Urząd Skarbowy w Warszawie',
  'Pierwszy Urząd Skarbowy Kraków',
  'Pierwszy Urząd Skarbowy w Poznaniu',
  'Urząd Skarbowy Poznań - Grunwald',
  'Urząd Skarbowy Warszawa - Mokotów',
  'Urząd Skarbowy Warszawa - Wola',
  'Urząd Skarbowy Wrocław - Krzyki',
  'Urząd Skarbowy Łódź - Polesie',
  'Łódzki Urząd Skarbowy w Łodzi',
  'Zachodniopomorski Urząd Skarbowy w Szczecinie',
  'Świętokrzyski Urząd Skarbowy w Kielcach'
];

function validatePesel(pesel) {
  if (!/^\d{11}$/.test(pesel)) {
    return false;
  }
  const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
  let sum = 0;
  for (let i = 0; i < 10; i += 1) {
    sum += Number.parseInt(pesel.charAt(i), 10) * weights[i];
  }
  const mod = sum % 10;
  const controlDigit = (10 - mod) % 10;
  return controlDigit === Number.parseInt(pesel.charAt(10), 10);
}

function citizenshipRegionLabel(code, lng) {
  try {
    return new Intl.DisplayNames([lng === 'en' ? 'en' : 'pl'], { type: 'region' }).of(code);
  } catch {
    return code;
  }
}

export function PayoutFormContent({ panelBase }) {
  const { lng, tp } = useBeneficiaryPanelLocale();
  const payoutsListPath = `${panelBase}/payouts`;
  const [formData, setFormData] = useState({});
  const [peselChecked, setPeselChecked] = useState(false);
  const [peselError, setPeselError] = useState('');
  const [additionalFields, setAdditionalFields] = useState(false);
  const [taxSuggestionsOpen, setTaxSuggestionsOpen] = useState(false);
  const [taxInput, setTaxInput] = useState('');
  const [sending, setSending] = useState(false);
  const fieldClassName = 'mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

  const filteredTaxOffices = useMemo(() => {
    if (!taxInput.trim()) return [];
    return taxOffices.filter((office) => office.toLowerCase().includes(taxInput.toLowerCase())).slice(0, 12);
  }, [taxInput]);

  const onInput = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (name === 'id_number') {
      if (peselChecked && value.length === 11 && !validatePesel(value)) {
        setPeselError(tp('payoutsForm.peselInvalid'));
      } else {
        setPeselError('');
      }
    }
  };

  const onPeselCheckbox = (event) => {
    const isChecked = event.target.checked;
    setPeselChecked(isChecked);
    if (isChecked && formData.id_number?.length === 11 && !validatePesel(formData.id_number)) {
      setPeselError(tp('payoutsForm.peselInvalid'));
    } else {
      setPeselError('');
    }
  };

  const shouldShow = (key, hideValue = 'nie') => (formData[key] || '') !== hideValue;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSending(true);
    const previewWindow = window.open('', '_blank');
    try {
      const requestNumber = `WNP-${Date.now()}`;
      const payload = {
        requestNumber,
        title: 'Wniosek o wypłatę wynagrodzenia',
        description: 'Formularz danych osobowych oraz oświadczenie',
        amount: null,
        formData
      };
      const saveResponse = await fetch('/api/user/payouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!saveResponse.ok) {
        throw new Error(tp('payoutsForm.saveFail'));
      }

      const pdfResponse = await fetch('/api/user/payouts/generate-form-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestNumber,
          formData
        })
      });

      if (!pdfResponse.ok) {
        throw new Error(tp('payoutsForm.pdfFail'));
      }

      const blob = await pdfResponse.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const previewDocTitle = tp('payoutsForm.previewTitle');
      if (previewWindow) {
        previewWindow.document.open();
        previewWindow.document.write(`
          <html style="margin:0; padding:0; height:100%;">
            <head><title>${previewDocTitle}</title></head>
            <body style="margin:0; padding:0; height:100%; overflow:hidden;">
              <iframe src="${blobUrl}" width="100%" height="100%" style="border:none;"></iframe>
            </body>
          </html>
        `);
        previewWindow.document.close();
      } else {
        window.open(blobUrl, '_blank');
      }

      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 120000);
      toast.success(tp('payoutsForm.savedPdf'));
    } catch (error) {
      console.error(error);
      if (previewWindow) {
        previewWindow.close();
      }
      toast.error(tp('payoutsForm.saveError'));
    } finally {
      setSending(false);
    }
  };

  return (
      <main className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{tp('payoutsForm.pageTitle')}</h1>
          <Link href={payoutsListPath} className="text-blue-600 hover:text-blue-700 transition-colors">
            {tp('payoutsForm.back')}
          </Link>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <section className="border p-4 rounded-lg bg-gray-50 dark:bg-gray-900/40">
            <h2 className="text-2xl font-bold mb-4">{tp('payoutsForm.personalData')}</h2>

            <div className="mb-4">
              <label htmlFor="full_name" className="block text-sm font-medium">{tp('payoutsForm.fullName')}</label>
              <input type="text" name="full_name" id="full_name" className={fieldClassName} required onChange={onInput} />
            </div>
            <div className="mb-4">
              <label htmlFor="family_name" className="block text-sm font-medium">{tp('payoutsForm.familyName')}</label>
              <input type="text" name="family_name" id="family_name" className={fieldClassName} required onChange={onInput} />
            </div>
            <div className="mb-4">
              <label htmlFor="birth_date" className="block text-sm font-medium">{tp('payoutsForm.birthDate')}</label>
              <input type="date" name="birth_date" id="birth_date" className={fieldClassName} required onChange={onInput} />
            </div>
            <div className="mb-4">
              <label htmlFor="birth_place" className="block text-sm font-medium">{tp('payoutsForm.birthPlace')}</label>
              <input type="text" name="birth_place" id="birth_place" className={fieldClassName} required onChange={onInput} />
            </div>

            <div className="mb-4">
              <label htmlFor="citizenship" className="block text-sm font-medium">{tp('payoutsForm.citizenship')}</label>
              <select name="citizenship" id="citizenship" className={fieldClassName} required onChange={onInput}>
                <option value="">{tp('payoutsForm.citizenshipPlaceholder')}</option>
                {citizenships.map(([code]) => (
                  <option key={code} value={code}>
                    {citizenshipRegionLabel(code, lng)}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <span className="block text-sm font-medium">{tp('payoutsForm.idDocChoice')}</span>
              <div className="mt-1 space-y-2">
                <label className="inline-flex items-center">
                  <input type="checkbox" id="pesel_checkbox" name="pesel_checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600" onChange={onPeselCheckbox} />
                  <span className="ml-2">{tp('payoutsForm.pesel')}</span>
                </label>
                <label className="inline-flex items-center ml-6">
                  <input type="checkbox" name="passport_checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600" onChange={onInput} />
                  <span className="ml-2">{tp('payoutsForm.passportNo')}</span>
                </label>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="id_number" className="block text-sm font-medium">{tp('payoutsForm.idNumber')}</label>
              <input type="text" name="id_number" id="id_number" maxLength={11} className={fieldClassName} required onChange={onInput} />
              <span className="text-red-500 text-sm">{peselError}</span>
            </div>

            <h2 className="text-2xl font-bold mb-4">{tp('payoutsForm.addressTitle')}</h2>
            <div className="mb-4">
              <label htmlFor="tax_street" className="block text-sm font-medium">{tp('payoutsForm.street')}</label>
              <input type="text" name="tax_street" id="tax_street" className={fieldClassName} required onChange={onInput} />
            </div>
            <div className="mb-4">
              <label htmlFor="tax_postal_code" className="block text-sm font-medium">{tp('payoutsForm.postalCode')}</label>
              <input type="text" name="tax_postal_code" id="tax_postal_code" className={fieldClassName} required onChange={onInput} />
            </div>
            <div className="mb-4">
              <label htmlFor="tax_post_office" className="block text-sm font-medium">{tp('payoutsForm.postOffice')}</label>
              <input type="text" name="tax_post_office" id="tax_post_office" className={fieldClassName} required onChange={onInput} />
            </div>
            <div className="mb-4">
              <label htmlFor="bank_account" className="block text-sm font-medium">{tp('payoutsForm.bankAccount')}</label>
              <input type="text" name="bank_account" id="bank_account" className={fieldClassName} required onChange={onInput} />
            </div>
            <div className="mb-4 relative">
              <label htmlFor="tax_office" className="block text-sm font-medium">{tp('payoutsForm.taxOffice')}</label>
              <input
                type="text"
                name="tax_office"
                id="tax_office"
                className={fieldClassName}
                required
                autoComplete="off"
                value={taxInput}
                onFocus={() => setTaxSuggestionsOpen(true)}
                onChange={(event) => {
                  setTaxInput(event.target.value);
                  setFormData((prev) => ({ ...prev, tax_office: event.target.value }));
                }}
              />
              {taxSuggestionsOpen && filteredTaxOffices.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded max-h-56 overflow-auto shadow-xl">
                  {filteredTaxOffices.map((office) => (
                    <button
                      key={office}
                      type="button"
                      className="block w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      onClick={() => {
                        setTaxInput(office);
                        setFormData((prev) => ({ ...prev, tax_office: office }));
                        setTaxSuggestionsOpen(false);
                      }}
                    >
                      {office}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="nfz_branch" className="block text-sm font-medium">{tp('payoutsForm.nfzBranch')}</label>
              <input list="nfz_list" name="nfz_branch" id="nfz_branch" className={fieldClassName} required onChange={onInput} />
              <datalist id="nfz_list">
                {nfzBranches.map((branch) => (
                  <option key={branch} value={branch} />
                ))}
              </datalist>
            </div>
              </section>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <section className="border p-4 rounded-lg bg-gray-50 dark:bg-gray-900/40">
            <h2 className="text-2xl font-bold mb-4">{tp('payoutsForm.statementTitle')}</h2>
            <p>{tp('payoutsForm.statementIntro')}</p>

            <fieldset className="border border-gray-600 p-4 rounded mb-4">
              <legend className="font-bold">{tp('payoutsForm.fs1')}</legend>
              <div className="mb-4">
                <span className="block text-sm font-medium">{tp('payoutsForm.qEmployment')}</span>
                <label className="inline-flex items-center">
                  <input type="radio" name="employment_status" value="nie" className="form-radio text-primary" required onChange={onInput} />
                  <span className="ml-2">{tp('payoutsForm.notEmployed')}</span>
                </label>
                <label className="inline-flex items-center ml-4">
                  <input type="radio" name="employment_status" value="jestem" className="form-radio text-primary" onChange={onInput} />
                  <span className="ml-2">{tp('payoutsForm.employed')}</span>
                </label>
              </div>
              {shouldShow('employment_status') && (
                <div>
                  <div className="mb-4">
                    <span className="block text-sm font-medium">{tp('payoutsForm.employmentPeriod')}</span>
                    <div className="flex space-x-2">
                      <input type="date" name="employment_from" className={`${fieldClassName} w-1/2`} onChange={onInput} />
                      <input type="date" name="employment_to" className={`${fieldClassName} w-1/2`} onChange={onInput} />
                    </div>
                  </div>
                </div>
              )}
            </fieldset>

            <fieldset className="border border-gray-600 p-4 rounded mb-4">
              <legend className="font-bold">{tp('payoutsForm.fs2')}</legend>
              <div className="mb-4">
                <span className="block text-sm font-medium">{tp('payoutsForm.qPiecework')}</span>
                <label className="inline-flex items-center">
                  <input type="radio" name="insurance_status" value="nie" className="form-radio text-primary" required onChange={onInput} />
                  <span className="ml-2">{tp('payoutsForm.notEmployed')}</span>
                </label>
                <label className="inline-flex items-center ml-4">
                  <input type="radio" name="insurance_status" value="jestem" className="form-radio text-primary" onChange={onInput} />
                  <span className="ml-2">{tp('payoutsForm.employed')}</span>
                </label>
              </div>
              {shouldShow('insurance_status') && (
                <div className="mb-4">
                  <span className="block text-sm font-medium">{tp('payoutsForm.insurancePeriod')}</span>
                  <div className="flex space-x-2">
                    <input type="date" name="insurance_from" className={`${fieldClassName} w-1/2`} onChange={onInput} />
                    <input type="date" name="insurance_to" className={`${fieldClassName} w-1/2`} onChange={onInput} />
                  </div>
                </div>
              )}
            </fieldset>

            <fieldset className="border border-gray-600 p-4 rounded mb-4">
              <legend className="font-bold">{tp('payoutsForm.fs3')}</legend>
              <div className="mb-4">
                <span className="block text-sm font-medium">{tp('payoutsForm.qOtherIns')}</span>
                <label className="inline-flex items-center">
                  <input type="radio" name="other_insurance" value="nie" className="form-radio text-primary" required onChange={onInput} />
                  <span className="ml-2">{tp('payoutsForm.notEmployed')}</span>
                </label>
                <label className="inline-flex items-center ml-4">
                  <input type="radio" name="other_insurance" value="jestem" className="form-radio text-primary" onChange={onInput} />
                  <span className="ml-2">{tp('payoutsForm.employed')}</span>
                </label>
              </div>
              {shouldShow('other_insurance') && (
                <div className="mb-4">
                  <label htmlFor="other_insurance_title" className="block text-sm font-medium">{tp('payoutsForm.otherInsTitle')}</label>
                  <input type="text" name="other_insurance_title" id="other_insurance_title" className={fieldClassName} onChange={onInput} />
                </div>
              )}
            </fieldset>

            <fieldset className="border border-gray-600 p-4 rounded mb-4">
              <legend className="font-bold">{tp('payoutsForm.fs4')}</legend>
              <div className="mb-4">
                <span className="block text-sm font-medium">{tp('payoutsForm.qRetired')}</span>
                <label className="inline-flex items-center">
                  <input type="radio" name="retirement_status" value="nie" className="form-radio text-primary" required onChange={onInput} />
                  <span className="ml-2">{tp('payoutsForm.notEmployed')}</span>
                </label>
                <label className="inline-flex items-center ml-4">
                  <input type="radio" name="retirement_status" value="jestem" className="form-radio text-primary" onChange={onInput} />
                  <span className="ml-2">{tp('payoutsForm.employed')}</span>
                </label>
              </div>
              {shouldShow('retirement_status') && (
                <div className="mb-4">
                  <label htmlFor="zus_decision" className="block text-sm font-medium">{tp('payoutsForm.zusDecision')}</label>
                  <input type="text" name="zus_decision" id="zus_decision" className={fieldClassName} onChange={onInput} />
                  <input type="date" name="zus_date" className={fieldClassName} onChange={onInput} />
                </div>
              )}
            </fieldset>

            <fieldset className="border border-gray-600 p-4 rounded mb-4">
              <legend className="font-bold">{tp('payoutsForm.fs5')}</legend>
              <div className="mb-4">
                <span className="block text-sm font-medium">{tp('payoutsForm.qDisability')}</span>
                <label className="inline-flex items-center">
                  <input type="radio" name="disability_cert" value="nie" className="form-radio text-primary" required onChange={onInput} />
                  <span className="ml-2">{tp('payoutsForm.noCert')}</span>
                </label>
                <label className="inline-flex items-center ml-4">
                  <input type="radio" name="disability_cert" value="posiadam" className="form-radio text-primary" onChange={onInput} />
                  <span className="ml-2">{tp('payoutsForm.haveCert')}</span>
                </label>
              </div>
              {shouldShow('disability_cert') && (
                <div className="mb-4">
                  <span className="block text-sm font-medium">{tp('payoutsForm.disabilityDegree')}</span>
                  <label className="inline-flex items-center">
                    <input type="radio" name="disability_degree" value="lekkim" className="form-radio text-primary" onChange={onInput} />
                    <span className="ml-2">{tp('payoutsForm.degMild')}</span>
                  </label>
                  <label className="inline-flex items-center ml-4">
                    <input type="radio" name="disability_degree" value="umiarkowanym" className="form-radio text-primary" onChange={onInput} />
                    <span className="ml-2">{tp('payoutsForm.degModerate')}</span>
                  </label>
                  <label className="inline-flex items-center ml-4">
                    <input type="radio" name="disability_degree" value="znacznym" className="form-radio text-primary" onChange={onInput} />
                    <span className="ml-2">{tp('payoutsForm.degSevere')}</span>
                  </label>
                </div>
              )}
            </fieldset>

            <fieldset className="border border-gray-600 p-4 rounded mb-4">
              <legend className="font-bold">{tp('payoutsForm.fs6')}</legend>
              <span className="block text-sm font-medium">{tp('payoutsForm.qStudent')}</span>
              <label className="inline-flex items-center">
                <input type="radio" name="student_status" value="nie" className="form-radio text-primary" required onChange={onInput} />
                <span className="ml-2">{tp('payoutsForm.notEmployed')}</span>
              </label>
              <label className="inline-flex items-center ml-4">
                <input type="radio" name="student_status" value="jestem" className="form-radio text-primary" onChange={onInput} />
                <span className="ml-2">{tp('payoutsForm.employed')}</span>
              </label>
              {shouldShow('student_status') && (
                <div className="mt-4">
                  <label htmlFor="student_certificate" className="block text-sm font-medium">{tp('payoutsForm.studentUpload')}</label>
                  <div className="mt-1">
                    <label htmlFor="student_certificate" className="cursor-pointer block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white hover:bg-gray-600 transition-colors">
                      {tp('payoutsForm.chooseFile')}
                    </label>
                    <input type="file" name="student_certificate" id="student_certificate" className="hidden" onChange={onInput} />
                  </div>
                </div>
              )}
            </fieldset>

            <fieldset className="border border-gray-600 p-4 rounded mb-4">
              <legend className="font-bold">{tp('payoutsForm.fs7')}</legend>
              <span className="block text-sm font-medium">{tp('payoutsForm.qUnemployed')}</span>
              <label className="inline-flex items-center">
                <input type="radio" name="unemployment_status" value="nie" className="form-radio text-primary" required onChange={onInput} />
                <span className="ml-2">{tp('payoutsForm.notEmployed')}</span>
              </label>
              <label className="inline-flex items-center ml-4">
                <input type="radio" name="unemployment_status" value="jestem" className="form-radio text-primary" onChange={onInput} />
                <span className="ml-2">{tp('payoutsForm.employed')}</span>
              </label>
            </fieldset>

            <fieldset className="border border-gray-600 p-4 rounded mb-4">
              <legend className="font-bold">{tp('payoutsForm.fs8')}</legend>
              <div className="mb-4">
                <span className="block text-sm font-medium">{tp('payoutsForm.qVoluntary')}</span>
                <label className="inline-flex items-center">
                  <input type="radio" name="voluntary_health" value="chce" className="form-radio text-primary" required onChange={onInput} />
                  <span className="ml-2">{tp('payoutsForm.want')}</span>
                </label>
                <label className="inline-flex items-center ml-4">
                  <input type="radio" name="voluntary_health" value="nie_chce" className="form-radio text-primary" onChange={onInput} />
                  <span className="ml-2">{tp('payoutsForm.dontWant')}</span>
                </label>
              </div>
            </fieldset>

            <fieldset className="border border-gray-600 p-4 rounded mb-4">
              <legend className="font-bold">{tp('payoutsForm.fs9')}</legend>
              <div className="mb-4">
                <label className="inline-flex items-center">
                  <input type="radio" name="koszty_autorskie" value="dotyczy" className="form-radio text-primary" required onChange={(event) => { onInput(event); setAdditionalFields(true); }} />
                  <span className="ml-2">{tp('payoutsForm.applies')}</span>
                </label>
                <label className="inline-flex items-center ml-4">
                  <input type="radio" name="koszty_autorskie" value="nie_dotyczy" className="form-radio text-primary" onChange={(event) => { onInput(event); setAdditionalFields(false); }} />
                  <span className="ml-2">{tp('payoutsForm.notApplies')}</span>
                </label>
              </div>
              {additionalFields && (
                <div>
                  <div className="mb-4">
                    <label htmlFor="koszty_select" className="block text-sm font-medium">{tp('payoutsForm.authorLimit')}</label>
                    <select id="koszty_select" name="limit_kosztow" className={fieldClassName} onChange={onInput}>
                      <option value="przekracza">{tp('payoutsForm.optExceeds')}</option>
                      <option value="nie_przekracza">{tp('payoutsForm.optNotExceeds')}</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="koszty_value" className="block text-sm font-medium">{tp('payoutsForm.appliedSoFar')}</label>
                    <input type="number" id="koszty_value" name="wartosc_kosztow" className={fieldClassName} placeholder={tp('payoutsForm.valuePh')} onChange={onInput} />
                  </div>
                </div>
              )}
            </fieldset>

            <fieldset className="border border-gray-600 p-4 rounded mb-4">
              <legend className="font-bold">{tp('payoutsForm.fs10')}</legend>
              <p className="my-4">
                {tp('payoutsForm.gdprBlock')}
              </p>
              <div className="mb-4">
                <label className="inline-flex items-center">
                  <input type="radio" name="data_processing_consent" value="zgadzam" className="form-radio text-primary" required onChange={onInput} />
                  <span className="ml-2">{tp('payoutsForm.agree')}</span>
                </label>
                <label className="inline-flex items-center ml-4">
                  <input type="radio" name="data_processing_consent" value="nie_zgadzam" className="form-radio text-primary" onChange={onInput} />
                  <span className="ml-2">{tp('payoutsForm.disagree')}</span>
                </label>
              </div>
            </fieldset>

            <p>
              <strong>
                {tp('payoutsForm.oathBlock')}
              </strong>
              <br />
              {tp('payoutsForm.oathAlso')}
              <ul>
                <li>- {tp('payoutsForm.oathLi1')}</li>
                <li>- {tp('payoutsForm.oathLi2')}</li>
                <li>- {tp('payoutsForm.oathLi3')}</li>
              </ul>
              {tp('payoutsForm.oathNotify')}
            </p>
              </section>
            </CardContent>
          </Card>

          <div>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-70" disabled={sending}>
              {sending ? tp('payoutsForm.saving') : tp('payoutsForm.saveOpenPdf')}
            </button>
          </div>
        </form>
      </main>
  );
}

export default function UserDocumentForm() {
  return (
    <PanelLayout role="user">
      <PayoutFormContent panelBase="/panel/user" />
    </PanelLayout>
  );
}