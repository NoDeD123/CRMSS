// /lib/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import {
  beneficiaryPanelExtraLocalesPl,
  beneficiaryPanelExtraLocalesEn,
} from './beneficiaryPanelExtraLocales';

const resources = {
  pl: {
    common: { 
      "referralOptions.tiktok": "TikTok",
      "referralOptions.instagram": "Instagram",
      "referralOptions.facebook": "Facebook",
      "referralOptions.linkedin": "LinkedIn",
      "cookieConsent.learnMore" : "Polityka Cookies",
      "form.referralCode" : "Kod polecający",
      "form.referralCodePlaceholder" : "Wpisz otrzymany kod polecający",
      "referralOptions.social": "Social Media",
      "referralOptions.web": "Internet",
      "referralOptions.friend": "Znajomy",
      "referralOptions.other": "Inne",
      "form.howDidYouHearAboutUs":"Jak o nas usłyszałeś",
      "form.howDidYouHearAboutUsPlaceholder" : "Wybierz jedną z opcji",
      "form.customActivityPlaceholder":"Wpisz swój pomysł",
      "formValidation": {
        "required": "To pole jest wymagane",
        "invalidEmail": "Nieprawidłowy adres email",
        "phoneInvalid": "Nieprawidłowy numer telefonu"
      },
      "formError": {
        "submission": "Wystąpił błąd podczas wysyłania formularza"
      },
      "formSuccess": {
        "message": "Wiadomość została wysłana pomyślnie!"
      },
      "formSending": "Wysyłanie...",
      transferOfCopyrights: "Przekazanie praw autorskich",
      formPageTitle: "Formularz zgłoszeniowy",
      "steps.joinButton" :"Dołącz do nas!",
      cookieConsent: {
        message:
          'Ta strona używa ciasteczek, aby zapewnić najlepszą jakość korzystania. Klikając "Akceptuję", zgadzasz się na ich użycie.',
        accept: 'Akceptuję',
        decline: 'Nie zgadzam się'
      },
        "footer": {
        "foundationTitle": "Fundacja Strefa Startu",
        "address": "ul. Wschodnia 1A, 99-300 Kutno",
        "nip": "NIP: 7752676034",
        "phone": "(24) 337 11 60",
        "email": "kontakt@strefastartu.pl",
        "navigation": {
          "title": "Nawigacja",
          "home": "Strona Główna",
          "about": "O nas",
          "offer": "Oferta",
          "contact": "Kontakt"
        },
        "documents": {
          "title": "Dokumenty",
          "terms": "Regulamin",
          "rodoPolicy": "Polityka RODO",
          "privacyPolicy": "Polityka Prywatności",
          "cookiesPolicy": "Polityka Cookies"
        },
        "copyCompany": "StrefaStartu",
        "allRightsReserved": "Wszelkie prawa zastrzeżone."
      },
        "back": "Powrót",
        "next": "Dalej",
        "multistep": {
          "intro": {
            "title": "Witaj w formularzu zgłoszeniowym!",
            "description": "Wypełnij poniższe dane, aby zgłosić swój startup i skorzystać z naszych usług."
          },
          "step1": {
            "title": "Krok 1: Twój pomysł na biznes"
          },
          "step2": {
            "title": "Krok 2: Temat zgłoszenia i zgody"
          },
          "step3": {
            "title": "Zgody i usługi"
          },
          "services": {
            "title": "Wybierz usługi, które Cię interesują:",
            "legalAdvice": "Porady prawne",
            "marketingAdvice": "Porady marketingowe",
            "marketingServices": "Usługi marketingowe",
            "officeRental": "Wynajem biura",
            "carRental": "Wynajem samochodu",
            "grantAssistance": "Pomoc w uzyskaniu dotacji",
            "cheapLoan": "Tania pożyczka",
            "other": "Inne",
            "none": "Brak wybranych usług"
          },
          "mail": {
            "from": "Formularz Startup",
            "subject": "Nowe zgłoszenie startupu",
            "title": "Nowe zgłoszenie startupu",
            "fullName": "Imię i nazwisko:",
            "email": "E-mail:",
            "phone": "Telefon:",
            "age": "Wiek:",
            "activity": "Działalność:",
            "projectedProfit": "Prognozowany zysk:",
            "projectedOrders": "Prognozowana liczba zamówień / faktur :",
            "partner": "Partner biznesowy:",
            "companyName": "Nazwa firmy:",
            "services": "Wybrane usługi:"
          }
        },
        "form": {
          "fullName": "Imię i nazwisko",
          "fullNamePlaceholder": "Podaj imię i nazwisko",
          "email": "Adres e-mail",
          "emailPlaceholder": "Podaj adres e-mail",
          "phone": "Numer telefonu (opcjonalnie)",
          "phonePlaceholder": "Opcjonalnie podaj telefon",
          "age": "Wiek (opcjonalnie)",
          "agePlaceholder": "Opcjonalnie podaj wiek",
          "activity": "Typ działalności",
          "activityPlaceholder": "Wybierz rodzaj działalności",
          "projectedProfit": "Prognozowany zysk",
          "projectedProfitPlaceholder": "Podaj prognozowany zysk",
          "projectedOrders": "Prognozowana liczba zamówień",
          "projectedOrdersPlaceholder": "Podaj prognozowaną liczbę zamówień",
          "partner": "Czy posiadasz partnera biznesowego?",
          "partnerPlaceholder": "Wpisz 'tak' lub 'nie'",
          "companyName": "Nazwa Twojej działalności",
          "companyNamePlaceholder": "Podaj nazwę Twojej działalności",
          "acceptRODO": "Akceptuję RODO",
          "acceptPrivacy": "Akceptuję politykę prywatności",
          "submit": "Wyślij",
          "topic": "Temat zgłoszenia",
          "topicPlaceholder": "Wybierz temat...",
          "acceptRODOText": "Wyrażam zgodę na przetwarzanie moich danych osobowych zgodnie z RODO.",
          "acceptPrivacyText": "Akceptuję Politykę Prywatności serwisu.",
          "referralSource": "Skąd o nas wiesz?",
          "referralSourcePlaceholder": "Wybierz źródło...",
          "referralCode": "Kod polecający",
          "referralCodePlaceholder": "Wpisz kod od znajomego",
          "referralOther": "Jakie?",
          "referralOtherPlaceholder": "Wpisz inne źródło"
        },
        "referral": {
          "tiktok": "TikTok",
          "instagram": "Instagram",
          "facebook": "Facebook",
          "linkedin": "LinkedIN",
          "friend": "Znajomy",
          "other": "Inne (jakie?)"
        },
        "validation": {
          "fieldRequired": {
            "referralSource": "Wybierz źródło informacji.",
            "referralCode": "Wpisz kod polecający.",
            "referralOther": "Wpisz inne źródło."
          }
        },
        "faqTitle": "FAQ",
        "startNow" : "Policz koszty",
        "contactTitle": "Kontakt",
        "contactDescription": "Skontaktuj się z nami, aby dowiedzieć się więcej",
        "companyName": "StrefaStartu Sp. z o.o.",
        "allRightsReserved": "Wszelkie prawa zastrzeżone",
        "about": "O nas",
        "calculator": "Kalkulator",
        "contact": "Kontakt",
        "faq": "FAQ",
        "login": "Logowanie",
        "getStarted": "Zacznij teraz",
        "loginChoice": {
          "beneficiary": "Beneficjent",
          "freelancer": "Freelancer"
        },
        "companyAddress": "ul. Wschodnia 1A, 99-300 Kutno",
        "companyPhone": "(24) 337 11 60",
        "companyEmail": "kontakt@strefastartu.pl",
        "yourFullName": "Imię i nazwisko",
        "yourFullNamePlaceholder": "Wpisz swoje imię i nazwisko",
        "yourPhone": "Numer telefonu",
        "yourPhonePlaceholder": "Wpisz swój numer telefonu",
        "yourEmail": "Adres email",
        "yourEmailPlaceholder": "Wpisz swój adres email",
        "yourSubject": "Temat",
        "cooperation": "Współpraca",
        "crm": "CRM",
        "others": "Inne",
        "yourMessage": "Wiadomość",
        "yourMessagePlaceholder": "Wpisz swoją wiadomość",
        "sendMessage": "Wyślij wiadomość",
        "formComingSoon": "Formularz kontaktowy wkrótce",
        "ourLocation": "Nasza lokalizacja",
        "companyDetails": "Dane firmy",
        "nip": "NIP: 7752676034",
        "navigation": "Nawigacja",
        "home": "Strona Główna",
        "offer": "Oferta",
        "blog": "Blog",
        "documents": "Dokumenty",
        "termsOfService": "Regulamin",
        "gdprPolicy": "Polityka RODO",
        "privacyPolicy": "Polityka Prywatności",
        "cookiePolicy": "Polityka Cookies",
        "costsPageTitle": "Kalkulatory & Koszty",
        "costsPageDescription": "Sprawdź koszty i skorzystaj z kalkulatorów",
        "companyName": "StrefaStartu Sp. z o.o.",
        "allRightsReserved": "Wszelkie prawa zastrzeżone.",
        "about": "O nas",
        "calculator": "Kalkulator",
        "contact": "Kontakt",
        "faq": "FAQ",
        "login": "Logowanie",
        "getStarted": "Zacznij teraz",
        "calculatorsTitle": "Porównanie kosztów",
        "checkSavings": "Sprawdź możliwe oszczędności",
        "description": "Opis",
        "withIncubator": "U nas",
        "independently": "Własna działalność",
        "registrationTime": "Czas rejestracji",
        "incomeTaxLabel": "Podatek dochodowy",
        "zusNfz": "ZUS / NFZ",
        "paidPpk": "Płatny PPK",
        "accounting": "Księgowość",
        "monthly": "Miesięcznie",
        "oneDay": "3 dni",
        "about30Days": "Ok. 30 dni",
        "taxScale": "12/32% lub 19% (skala)",
        "dependsOnStatus": "0 zł",
        "fullZus": "Pełny ZUS ok. 1750 zł",
        "about250": "ok. 350 zł",
        "1400Plus": "Min. 2000 zł",
        "noHiddenCosts": "Zero ukrytych kosztów!",
        "fullTransparency": "Pełna transparentność",
        "noSurprises": "Bez niespodzianek",
        "fixedRate": "Stała stawka",
        "calculator1": "Kalkulator współpracy z fundacją",
        "calculator2": "Kalkulator współpracy jako freelancer",
        "check": "Sprawdź",
        "areYouStudent": "Czy jesteś studentem?",
        "yes": "Tak",
        "no": "Nie",
        "voluntaryHealthInsurance": "Czy chcesz dobrowolne ubezpieczenie zdrowotne (NFZ)?",
        "expectedIncome": "Oczekiwane przychody (mies.)",
        "monthlyCosts": "Miesięczne koszty",
        "incubationFee": "Opłata inkubacyjna",
        "nfzContribution": "Składka NFZ (9%)",
        "yourNet": "Twoja 'na rękę'",
        "netAmountLabel": "Kwota netto",
        "sampleIncubationFee": "* Przykładowa stała opłata za inkubację.",
        "netAmountToAccount": "Kwota netto 'na konto'",
        "incomeTax": "Podatek dochodowy",
        "serviceFee": "Opłata serwisowa (9%)",
        "vat": "VAT (23%)",
        "grossAmountWithVat": "Kwota brutto z VAT",
        "totalGross": "Razem (brutto)",
        "sampleServiceFee": "* Opłata serwisowa przykładowa (9%).",
        "uploadFile": "Wgraj plik (PDF)",
        "uploadFileDescription": "Dodaj dokument do faktury (np. Umowa) w formacie PDF.",
        "changeFile": "Zmień plik",
        "clickToSelectFile": "Kliknij, aby wybrać plik",
        "orDragHere": "lub przeciągnij plik tutaj",
        "title": "Tytuł",
        "documentNamePlaceholder": "Nazwa dokumentu / faktury",
        "descriptionPlaceholder": "Opcjonalny opis faktury",
        "category": "Kategoria",
        "yourDetails": "Twoje dane",
        "firstName": "Imię",
        "lastName": "Nazwisko",
        "email": "Email",
        "address": "Adres",
        "pesel": "PESEL",
        "phone": "Telefon",
        "bankAccount": "Nr konta bankowego",
        "counterpartyDetails": "Dane kontrahenta",
        "nip": "NIP",
        "counterpartyAddress": "Adres kontrahenta",
        "counterpartyEmail": "Email",
        "counterpartyPhone": "Telefon",
        "contractorName": "Nazwa kontrahenta",
        "payment": "Płatność",
        "netAmount": "Kwota netto",
        "currency": "Waluta",
        "paymentDue": "Termin płatności",
        "summary": "Podsumowanie",
        "step": "Krok {{number}}",
        "back": "Wstecz",
        "next": "Dalej",
        "issueInvoice": "Wystaw fakturę",
        "processing": "Przetwarzanie...",
        "fieldRequired": "To pole jest wymagane",
        "selectCategory": "Wybierz kategorię",
        "enterValidAmount": "Wpisz poprawną kwotę",
        "translationsLabel": "Tłumaczenia",
        "graphicsLabel": "Grafika",
        "programmingLabel": "Programowanie",
        "multimediaLabel": "Multimedia",
        "customerServiceLabel": "Obsługa klienta",
        "officeWorkLabel": "Prace biurowe",
      "steps": {
    "title": "Jak zacząć? Krok po kroku",
    "step1": {
      "title": "Wypełnij formularz",
      "description": "Pierwszym krokiem jest kontakt z nami. Wypełnij krótki formularz na naszej stronie — opisz swój pomysł i umiejętności. Na tym etapie nie potrzebujesz gotowego biznesplanu — wystarczy chęć działania."
    },
    "step2": {
      "title": "Poznaj ofertę",
      "description": "Na podstawie przesłanych informacji przygotujemy propozycję współpracy — dopasowaną do Twojej sytuacji, możliwości i branży. Przedstawimy Ci konkretne rozwiązania: jak możesz działać w ramach fundacji, jak będziesz rozliczany i jakie korzyści uzyskasz dzięki programowi."
    },
    "step3": {
      "title": "Dołącz do nas",
      "description": "Po zapoznaniu się z ofertą, podpisujemy z Tobą umowę o współpracę. To właśnie ona daje Ci możliwość działania legalnie, bez konieczności zakładania działalności gospodarczej, bez ZUS-u i księgowości po Twojej stronie."
    },
    "step4": {
      "title": "Zacznij działać",
      "description": "Od tej chwili możesz w pełni legalnie świadczyć swoje usługi lub sprzedawać produkty. My zajmujemy się wszystkimi formalnościami: fakturami, rozliczeniami, księgowością oraz dokumentacją. Ty skupiasz się wyłącznie na tym, co naprawdę ważne — rozwoju swojego biznesu."
    }
  },
      "card1.learnMore" :"Sprawdź się!",
      "card2.learnMore" :"Policz!",
      "card3.learnMore" :"Dowiedz się!",

      "faqHeader": "FAQ",
      "faq.description": "Tutaj znajdziesz odpowiedzi na najczęściej zadawane pytania.",
      "faq.question1": "Czym zajmuje się Fundacja?",
      "faq.answer1": "Fundacja wspiera rozwój startupów i młodych przedsiębiorców, oferując dostęp do mentoringu, szkoleń, finansowania oraz sieci kontaktów biznesowych. Naszą misją jest pomaganie innowacyjnym projektom w osiągnięciu sukcesu na rynku.",
      "faq.question2": "Jak mogę zgłosić swój startup do fundacji?",
      "faq.answer2": "Aby zgłosić swój startup do programu wsparcia, wystarczy wypełnić formularz aplikacyjny dostępny na naszej stronie internetowej. Po analizie zgłoszenia skontaktujemy się z Tobą, aby omówić kolejne kroki.",
      "faq.question3": "Jakiego rodzaju wsparcie oferujecie?",
      "faq.answer3": "Oferujemy wsparcie w różnych obszarach, takich jak: <ul><li><b>Mentoring</b> – indywidualne konsultacje z doświadczonymi przedsiębiorcami i ekspertami.</li><li><b>Szkolenia i warsztaty</b> – w zakresie zarządzania, finansów, marketingu i strategii biznesowej.</li><li><b>Dostęp do sieci inwestorów </b>– pomagamy w pozyskiwaniu finansowania dla startupów.</li> <li><b>Przestrzeń coworkingowa</b> – możliwość pracy w inspirującym środowisku.</li><li><b>Programy akceleracyjne </b>– intensywne wsparcie dla wybranych projektów.</li></ul>",
      "faq.question4": "Czy udział w programach fundacji jest płatny?",
      "faq.answer4": "Nie, udział w naszych programach jest bezpłatny. Fundacja działa na zasadzie profit oraz pozyskuje środki od partnerów i sponsorów, aby wspierać rozwój innowacyjnych firm.",
      "faq.question5": "Czy fundacja oferuje finansowanie dla startupów?",
      "faq.answer5": "Nie bezpośrednio, ale pomagamy w nawiązywaniu kontaktów z inwestorami, funduszami venture capital oraz innymi źródłami finansowania, które mogą wesprzeć Twój projekt.",
      "faq.question6": "Czy mogę zostać mentorem w fundacji?",
      "faq.answer6": "Tak! Jeśli masz doświadczenie w biznesie i chcesz wspierać rozwój startupów, skontaktuj się z nami poprzez formularz kontaktowy lub napisz na <b>biuro@strefastartu.pl</b>.",
      "faq.question7": "Czy fundacja organizuje wydarzenia networkingowe?",
      "faq.answer7": "Tak, regularnie organizujemy spotkania, konferencje i hackathony, podczas których startupy mogą nawiązać wartościowe kontakty, zdobyć wiedzę i zaprezentować swoje pomysły inwestorom.",
      "faq.question8": "Jak mogę zostać partnerem fundacji?",
      "faq.answer8": "Firmy i instytucje, które chcą wspierać rozwój startupów, mogą zostać naszymi partnerami. Oferujemy różne formy współpracy – od sponsoringu po programy mentoringowe. Szczegóły znajdziesz w formularzu kontaktowym lub możesz z nami skontaktować się telefonicznie lub mailowo: <b>kontakt@strefastartu.pl</b>.",
      "faq.question9": "Jak skontaktować się z Fundacją Profit?",
      "faq.answer9": "<b>📧 E-mail:</b> Kontakt@StrefaStartu.pl <br><b>📞 Telefon:</b> (24) 337 11 60 <br><b>🌍 Adres siedziby:</b> Kutno ul. Wschodnia 1A 99-300 Kutno <br>",
      "aboutDescription": `Nasza Fundacja powstała dzięki młodym ludziom, którzy chcieli prowadzić biznes, zarabiać pieniądze i mieli na to mnóstwo pomysłów.

Naszą pracę dedykujemy osobom, które chcą rozpocząć działalność biznesową, ale jeszcze nie są gotowe na formalną rejestrację własnej firmy.
Wspieramy młodych przedsiębiorców, freelancerów, etatowców oraz osoby z niepełnosprawnościami bez względu na wiek, płeć i kolor skóry.
Pomagamy Wam przetestować własne pomysły, zdobyć pierwszych klientów i sprawdzić swoje umiejętności w realnych warunkach.
Eliminujemy bariery w przedsiębiorczości i tworzeniu przestrzeni dla innowacji, dzięki temu każdy z Was może bezpiecznie rozwinąć skrzydła we własnym biznesie.`,
      "aboutTitle": "O Fundacji",
      noZus: "Firma bez ZUS'u",
      itConsulting: "Wsparcie IT",
      training : "Coaching",
      costComparison: "Porównywarka kosztów",
      legalAdvice:"Wsparcie prawne",
      expertSupport:"Wsparcie ekspertów",
      legalPersonality:"Osobowość prawna",
      marketing :"Wsparcie marketingowe",
      accounting :"Wsparcie księgowe",
      infrastructure :"System do zarządzania",
      servicesHeader:"Testuj swój pomysł w realnych warunkach",
      servicesDescription:"Buduj bazę klientów i rozwijaj swoją markę. Zdobądź stabilną pozycję na rynku, zanim zarejestrujesz własną firmę. Teraz możesz pracować na własnych zasadach – bez zobowiązań, ale z pełnym wsparciem. Sprawdź, jak łatwo możesz zacząć!",
      contactUs:"Dołącz do nas",
      exchange:"I wiele innych",
      featuresHeader:"Z nami otrzymasz",
      "foundationIntro": {
        "title": "Fundacja, która działa dla Ciebie",
        "paragraphs": [
          "Wyobraź sobie miejsce, w którym możesz legalnie pracować i zarabiać na swoich pasjach, talentach i pomysłach — nawet jeśli nie masz jeszcze 18 lat albo nie chcesz zakładać własnej działalności.",
          "Miejsce, które przejmuje na siebie całą biurokrację, księgowość, kadry i formalności… a Tobie zostawia tylko jedno: robienie tego, co kochasz i za co chcesz być wynagradzany."
        ],
        "highlights": [
          "Pracujesz tak, jak chcesz.",
          "Zarabiasz na własnych zasadach."
        ],
        "highlightsNote": "A my dbamy o całą resztę.",
        "closing": [
          "Dajemy Ci narzędzia, opiekę Koordynatora, dostęp do szkoleń, gotowe zaplecze biznesowe i system, który działa za Ciebie.",
          "To przestrzeń, w której możesz bezpiecznie testować swoje pomysły, zdobywać klientów i rozwijać się jak prawdziwy przedsiębiorca — ale bez stresu i formalności, które zwykle zatrzymują ludzi na starcie.",
          "To jest Twój moment.",
          "Jeśli masz pomysł, pasję albo chociaż iskrę chęci — tutaj możesz zrobić z niej coś prawdziwego.",
          "Zrób pierwszy krok. Odezwij się do nas. Resztą zajmiemy się razem."
        ],
        "cta": "Zrób pierwszy krok"
      },
      "newTabs": {
        "heading": "Jeszcze więcej wsparcia w Strefie Startu",
        "description": "Poznaj dodatkowe osoby oraz narzędzia, które wspierają Cię w codziennej współpracy — od indywidualnego opiekuna, przez konto beneficjenta, po dedykowane szkolenia.",
        "caretaker": {
          "title": "Twój opiekun",
          "paragraphs": [
            "Każdy Uczestnik naszego programu otrzymuje indywidualnego Opiekuna, który towarzyszy mu od pierwszego dnia współpracy. Opiekun jest Twoją osobą kontaktową w Fundacji — wspiera Cię w codziennych działaniach, pomaga w organizacji pracy i dba o to, aby wszystkie niezbędne dokumenty oraz formalności były zawsze przygotowane na czas.",
            "To ktoś, kto zna Twój profil działalności, rozumie Twoje potrzeby i czuwa nad Twoim rozwojem. W razie pytań lub trudności możesz liczyć na jego pomoc, wskazówki oraz wsparcie merytoryczne. Dzięki temu nie musisz martwić się formalnościami — możesz skupić się na tym, co najważniejsze: prowadzeniu i rozwijaniu własnej firmy."
          ],
          "footer": "Twój Opiekun to osoba, która jest po Twojej stronie na każdym etapie współpracy."
        },
        "account": {
          "title": "Twoje konto beneficjenta",
          "paragraphs": [
            "Rozliczanie dokumentów i pilnowanie faktur może być proste — pod warunkiem, że masz do tego odpowiednie narzędzia. Jako Beneficjent programu otrzymujesz osobiste konto internetowe, które pozwala Ci wygodnie zarządzać wszystkimi sprawami związanymi z Twoją działalnością."
          ],
          "listTitle": "Na swoim koncie możesz:",
          "listItems": [
            "rozliczać dokumenty i kontrolować wszystkie faktury",
            "sprawdzać swoje zarobki oraz historię wpływów",
            "obsługiwać kadry i płace",
            "wystawiać faktury i wysyłać je bezpośrednio do swoich klientów",
            "monitorować status rozliczeń i dokumentów",
            "załatwiać formalności księgowe w jednym miejscu"
          ],
          "footer": "Wbudowany komunikator zapewnia bezpośredni kontakt z każdym działem — księgowością, kadrami, administracją i Opiekunem. To jedno intuicyjne miejsce, które pozwala Ci zarządzać całym biznesem szybko i wygodnie."
        },
        "trainings": {
          "title": "Szkolenia",
          "paragraphs": [
            "Udział w Fundacji to nie tylko wygoda związana z prowadzeniem działalności, ale także możliwość ciągłego rozwoju swoich umiejętności biznesowych. To miejsce, w którym możesz liczyć na realne wsparcie merytoryczne, liczne szkolenia i kursy, które pomogą Ci rosnąć jako przedsiębiorcy.",
            "Masz dostęp do naszej bazy szkoleń, obejmującej najważniejsze obszary biznesu — od marketingu, przez finanse, po rozwój kompetencji miękkich. Możesz dołączyć do najpopularniejszych szkoleń organizowanych cyklicznie lub zgłosić chęć uczestnictwa w szkoleniu dopasowanym specjalnie do Twoich potrzeb. Nasz zespół zorganizuje je dla Ciebie i zapewni wsparcie na każdym etapie, abyś mógł rozwijać się w kierunku, który jest dla Ciebie najważniejszy."
          ]
        }
      },
      title: "Strefa Startu",
      description: "Opis fundacji",
      about: "O nas",
      services: "Usługi",
      faq: "FAQ",
      login: "Zaloguj się",
      contact: "Kontakt",
      getStarted: "Dołącz do nas",
      heroTitle: "WYSTARTUJ <br>Z NAMI",
      heroText: "Masz pomysł na biznes, ale obawiasz się kosztów i formalności? <br><strong>Dołącz do programu</strong>, który pozwoli ci zarabiać <br>bez ZUS-u i biurokracji.",
      learnMore: "Kalkulator",
      joinCustomers: "Nasze usługi",
      ctaTitle: "Elastyczna oferta dla freelancerów",
      ctaText: "Jeśli jesteś freelancerem i nie działasz regularnie – możesz skorzystać z naszego wsparcia dokładnie wtedy, gdy tego potrzebujesz. Pracuj legalnie, bez zbędnych formalności i korzystaj z każdej okazji dzięki naszemu programowi dla freelancerów.",
      costComparison: "Porównywarka kosztów",
      entrepreneurTestQuestion1: 'Czy masz pomysł na biznes?',
      entrepreneurTestQuestion2: 'Czy znasz rynek, na którym chcesz działać?',
      entrepreneurTestQuestion3: 'Czy posiadasz doświadczenie w branży?',
      entrepreneurTestQuestion4: 'Czy jesteś gotów na ryzyko?',
      entrepreneurTestTitle: 'Test Przedsiębiorczości',
      entrepreneurTestDescription: 'Wypełnij ankietę, aby sprawdzić swój potencjał przedsiębiorczy.',
      brandName: 'StrefaStartu',
      about: 'O nas',
      calculator: 'Kalkulator',
      contact: 'Kontakt',
      faq: 'FAQ',
      login: 'Logowanie',
      yes: 'Tak',
      no: 'Nie',
      nextStep: 'Dalej',
      entrepreneurTestHeader: 'Test Przedsiębiorczości',
      entrepreneurTestContactHeader: 'Podaj swoje dane',
      greatJobTitle: 'Świetnie Ci idzie!',
      greatJobContent: 'Masz już solidne podstawy, by myśleć o własnym biznesie. Zostaw swoje dane, abyśmy mogli się z Tobą skontaktować i pomóc Ci w dalszych krokach!',
      firstName: 'Imię',
      firstNamePlaceholder: 'Wpisz swoje imię',
      lastName: 'Nazwisko',
      lastNamePlaceholder: 'Wpisz swoje nazwisko',
      email: 'Email',
      emailPlaceholder: 'Wpisz swój email',
      phone: 'Numer telefonu',
      phonePlaceholder: 'Wpisz swój numer telefonu',
      marketingConsent: 'Wyrażam zgodę na przesyłanie informacji marketingowych',
      gdprConsent: 'Wyrażam zgodę na przetwarzanie danych osobowych zgodnie z RODO',
      submit: 'Wyślij',
      companyName: 'StrefaStartu Sp. z o.o.',
      allRightsReserved: 'Wszelkie prawa zastrzeżone.',
      "services": {
        "noZus": "BEZ ZUS",
        "noTaxOffice": "BEZ URZĘDU SKARBOWEGO",
        "noAccounting": "BEZ KSIĘGOWOŚCI"
      },
      cardtest: {
        "title": "Podejmij wyzwanie",
        "description": "W tym miejscu zweryfikujesz swoje przedsiębiorcze myślenie."
      },
      cardcalculator: {
        "title": "Porównywarka kosztów",
        "description": "Sprawdź, która opcja współpracy z nami będzie dla Ciebie najkorzystniejsza."
      },
      cardfaq: {
        "title": "FAQ",
        "description": "Najcześciej zadawane pytania."
      },
      "groups": {
        "forWhomTitle": "Dla kogo?",
    "forWhomDescription": "Znajdź idealne rozwiązanie dla siebie – nikogo nie wykluczamy!",

    "seniors": {
      "title": "Seniorzy",
      "description": "Wykorzystaj swoje doświadczenie i pracuj bez utraty świadczeń i zbędnych formalności."
    },
    "employed": {
      "title": "Zatrudnieni",
      "description": "Przetestuj swój pomysł na biznes bez zakładania działalności i podwójnych składek."
    },
    "youth": {
      "title": "Młodzież",
      "description": "Masz pomysł i chcesz zacząć zarabiać? U nas możesz działać legalnie bez zakładania firmy i kosztów ZUS."
    },
    "disabled": {
      "title": "Osoby z niepełnosprawnością",
      "description": "Rozwijaj swój biznes i działaj na własnych zasadach bez utraty zasiłków."
    },
    "farmers": {
      "title": "Rolnicy",
      "description": "Zarabiaj dodatkowo i rozwijaj swoją działalność, nie rezygnując z KRUS-u."
    }

  }
    },
    panel: {
      nav: {
        dashboard: 'Dashboard',
        invoices: 'Faktury',
        invoiceList: 'Lista faktur',
        newInvoice: 'Nowa faktura',
        newCostInvoice: 'Nowa faktura kosztowa',
        payouts: 'Wypłaty',
        documents: 'Dokumenty',
        messages: 'Wiadomości',
        legalHelp: 'Pomoc prawna',
        suggestions: 'Sugestie',
      },
      sidebar: {
        yourCompany: 'Twoja firma',
        companyNotProvided: 'Nie podano',
        logout: 'Wyloguj',
      },
      aria: {
        goToDashboard: 'Przejdź do pulpitu',
        accountSettings: 'Ustawienia konta',
        toggleTheme: 'Przełącz motyw',
        language: 'Język panelu',
        langPl: 'Polski — przełącz język interfejsu',
        langEn: 'English — przełącz język interfejsu',
      },
      dashboard: {
        fallbackDisplayName: 'Użytkowniku',
        loading: 'Ładowanie...',
        accessSuspendedTitle: 'Dostęp wstrzymany',
        accessSuspendedBody:
          'Aby kontynuować korzystanie z panelu, musisz uiścić opłatę abonamentową.',
        accessSuspendedHint: 'W sidebarze pozostawiono dostęp tylko do wiadomości.',
        welcome: 'Witaj, {{name}}!',
        welcomeSubtitle:
          'Zobacz najnowsze wydarzenia, powiadomienia i status swojego konta.',
        welcomeLoading: 'Witaj!',
        subscriptionTitle: 'Abonament & Obsługa',
        badgeActive: 'Aktywny',
        badgePending: 'Oczekujący',
        paymentReminder:
          'Uwaga: Zbliża się termin płatności abonamentu! Pozostało {{days}} dni.',
        monthlyFee: 'Miesięczna opłata',
        nextPayment: 'Następna płatność',
        none: 'Brak',
        accountStatus: 'Status konta',
        firstPaymentDue: 'Termin pierwszej płatności: {{date}}',
        accountActive: 'Konto aktywne',
        awaitingSubscription: 'Oczekiwanie na płatność abonamentu',
        withUsLabel: 'Jesteś z nami od:',
        durationDays: '{{count}} dni',
        durationMonths: '{{count}} miesięcy',
        documents: 'Dokumenty',
        documentsHint: 'Oczekujące na zatwierdzenie',
        balance: 'Saldo',
        balanceHint: 'Aktualnie dostępne środki',
        messages: 'Wiadomości',
        messagesHint: 'Nowe, nieprzeczytane komunikaty',
        eventsTitle: 'Najnowsze wydarzenia',
        updatesTitle: 'Nadchodzące aktualizacje',
        badgeSoon: 'Wkrótce',
        update1Title: 'Rozszerzenie panelu',
        update1Desc: 'Nowe funkcje dla beneficjentów',
        update2Title: 'Wypłaty ekspresowe',
        update2Desc: 'Szybsze realizacje płatności',
        update3Title: 'Nowe usługi',
        update3Desc: 'Dodatkowe możliwości dla beneficjentów',
      },
    },
    
  },
  en: {
    common: {
      "referralOptions.tiktok": "TikTok",
      "referralOptions.instagram": "Instagram",
      "referralOptions.facebook": "Facebook",
      "referralOptions.linkedin": "LinkedIn",
      cookieConsent: {
        message:
          'This website uses cookies to ensure the best experience. By clicking "Accept", you agree to their use.',
        accept: 'Accept',
        decline: 'Decline'
      },
      "back": "Back",
      "next": "Next",
      "multistep": {
        "intro": {
          "title": "Welcome to the application form!",
          "description": "Fill in the details below to submit your startup and take advantage of our services."
        },
        "step1": {
          "title": "Step 1: Your business idea"
        },
        "step2": {
          "title": "Step 2: Application topic and consents"
        },
        "step3": {
          "title": "Consents and services"
        },
        "services": {
          "title": "Select services:",
          "legalAdvice": "Legal advice",
          "marketingAdvice": "Marketing advice",
          "marketingServices": "Marketing services",
          "officeRental": "Office rental",
          "carRental": "Car rental",
          "grantAssistance": "Grant assistance",
          "cheapLoan": "Affordable loan",
          "other": "Other",
          "none": "No services selected"
        },
        "mail": {
          "from": "Startup Form",
          "subject": "New startup submission",
          "title": "New startup submission",
          "fullName": "Full Name:",
          "email": "Email:",
          "phone": "Phone:",
          "age": "Age:",
          "activity": "Activity:",
          "projectedProfit": "Projected profit:",
          "projectedOrders": "Projected number of orders:",
          "partner": "Business partner:",
          "companyName": "Company name:",
          "services": "Selected services:"
        }
      },
      "form": {
        "fullName": "Full Name",
        "fullNamePlaceholder": "Enter your full name",
        "email": "Email address",
        "emailPlaceholder": "Enter your email address",
        "phone": "Phone number (optional)",
        "phonePlaceholder": "Optionally, enter your phone number",
        "age": "Age (optional)",
        "agePlaceholder": "Optionally, enter your age",
        "activity": "Business activity",
        "activityPlaceholder": "Enter the type of business activity",
        "projectedProfit": "Projected profit",
        "projectedProfitPlaceholder": "Enter the projected profit",
        "projectedOrders": "Projected number of orders",
        "projectedOrdersPlaceholder": "Enter the projected number of orders",
        "partner": "Do you have a business partner?",
        "partnerPlaceholder": "Enter 'yes' or 'no'",
        "companyName": "Company name",
        "companyNamePlaceholder": "Enter the company name",
        "acceptRODO": "I accept GDPR",
        "acceptPrivacy": "I accept the privacy policy",
        "submit": "Submit",
        "topic": "Application topic",
        "topicPlaceholder": "Select a topic...",
        "acceptRODOText": "I consent to the processing of my personal data in accordance with GDPR.",
        "acceptPrivacyText": "I accept the site's Privacy Policy.",
        "referralSource": "How did you hear about us?",
        "referralSourcePlaceholder": "Select a source...",
        "referralCode": "Referral code",
        "referralCodePlaceholder": "Enter your friend's code",
        "referralOther": "Which?",
        "referralOtherPlaceholder": "Enter other source"
      },
      "referral": {
        "tiktok": "TikTok",
        "instagram": "Instagram",
        "facebook": "Facebook",
        "linkedin": "LinkedIN",
        "friend": "Friend",
        "other": "Other (which?)"
      },
      "validation": {
        "fieldRequired": {
          "referralSource": "Select a source.",
          "referralCode": "Enter referral code.",
          "referralOther": "Enter other source."
        }
      },
      "faqTitle": "FAQ",
      "startNow": "Check costs",
      "contactTitle": "Contact",
      "contactDescription": "Contact us to learn more",
      "companyName": "StrefaStartu Ltd.",
      "allRightsReserved": "All rights reserved",
      "about": "About us",
      "calculator": "Calculator",
      "contact": "Contact",
      "faq": "FAQ",
      "login": "Login",
      "getStarted": "Get Started",
      "loginChoice": {
        "beneficiary": "Beneficiary",
        "freelancer": "Freelancer"
      },
      "companyAddress": "1A Wschodnia Street, 99-300 Kutno",
      "companyPhone": "(24) 337 11 60",
      "companyEmail": "kontakt@strefastartu.pl",
      "yourFullName": "Full Name",
      "yourFullNamePlaceholder": "Enter your full name",
      "yourPhone": "Phone number",
      "yourPhonePlaceholder": "Enter your phone number",
      "yourEmail": "Email address",
      "yourEmailPlaceholder": "Enter your email address",
      "yourSubject": "Subject",
      "cooperation": "Cooperation",
      "crm": "CRM",
      "others": "Others",
      "yourMessage": "Message",
      "yourMessagePlaceholder": "Enter your message",
      "sendMessage": "Send message",
      "formComingSoon": "Contact form coming soon",
      "ourLocation": "Our location",
      "companyDetails": "Company details",
      "nip": "Tax ID: 7752676034",
      "navigation": "Navigation",
      "home": "Home",
      "offer": "Offer",
      "blog": "Blog",
      "documents": "Documents",
      "termsOfService": "Terms of Service",
      "gdprPolicy": "GDPR Policy",
      "privacyPolicy": "Privacy Policy",
      "cookiePolicy": "Cookie Policy",
      "costsPageTitle": "Calculators & Costs",
      "costsPageDescription": "Check costs and use our calculators",
      "companyName": "StrefaStartu Ltd.",
      "allRightsReserved": "All rights reserved.",
      "about": "About us",
      "calculator": "Calculator",
      "contact": "Contact",
      "faq": "FAQ",
      "login": "Login",
      "getStarted": "Get Started",
      "calculatorsTitle": "Cost Comparison",
      "checkSavings": "Check possible savings",
      "description": "Description",
      "withIncubator": "With us",
      "independently": "Independently",
      "registrationTime": "Registration time",
      "incomeTaxLabel": "Income tax",
      "zusNfz": "Social security / Health insurance",
      "paidPpk": "Paid PPK",
      "accounting": "Accounting",
      "monthly": "Monthly",
      "oneDay": "3 days",
      "about30Days": "About 30 days",
      "taxScale": "12/17/19% (scale)",
      "dependsOnStatus": "0 PLN",
      "fullZus": "Full social security approx. 1400 PLN",
      "about250": "about 250 PLN",
      "1400Plus": "1400+ PLN",
      "noHiddenCosts": "No hidden costs!",
      "fullTransparency": "Full transparency",
      "noSurprises": "No surprises",
      "fixedRate": "Fixed rate",
      "calculator1": "Foundation collaboration calculator",
      "calculator2": "Freelancer collaboration calculator",
      "check": "Check",
      "areYouStudent": "Are you a student?",
      "yes": "Yes",
      "no": "No",
      "voluntaryHealthInsurance": "Do you want voluntary health insurance (NFZ)?",
      "expectedIncome": "Expected monthly income",
      "monthlyCosts": "Monthly costs",
      "incubationFee": "Incubation fee",
      "nfzContribution": "Health insurance contribution (9%)",
      "yourNet": "Your net (take-home)",
      "netAmountLabel": "Net amount",
      "sampleIncubationFee": "* Sample fixed incubation fee.",
      "netAmountToAccount": "Net amount to account",
      "incomeTax": "Income tax (12%)",
      "serviceFee": "Service fee (9%)",
      "vat": "VAT (23%)",
      "grossAmountWithVat": "Gross amount with VAT",
      "totalGross": "Total (gross)",
      "sampleServiceFee": "* Sample service fee (9%).",
      "uploadFile": "Upload file (PDF)",
      "uploadFileDescription": "Add a document to the invoice (e.g., Agreement) in PDF format.",
      "changeFile": "Change file",
      "clickToSelectFile": "Click to select file",
      "orDragHere": "or drag file here",
      "title": "Title",
      "documentNamePlaceholder": "Document/invoice name",
      "descriptionPlaceholder": "Optional invoice description",
      "category": "Category",
      "yourDetails": "Your details",
      "firstName": "First name",
      "lastName": "Last name",
      "email": "Email",
      "address": "Address",
      "pesel": "PESEL",
      "phone": "Phone",
      "bankAccount": "Bank account number",
      "counterpartyDetails": "Counterparty details",
      "nip": "Tax ID",
      "counterpartyAddress": "Counterparty address",
      "counterpartyEmail": "Email",
      "counterpartyPhone": "Phone",
      "contractorName": "Contractor name",
      "payment": "Payment",
      "netAmount": "Net amount",
      "currency": "Currency",
      "paymentDue": "Payment due",
      "summary": "Summary",
      "step": "Step {{number}}",
      "back": "Back",
      "next": "Next",
      "issueInvoice": "Issue invoice",
      "processing": "Processing...",
      "fieldRequired": "This field is required",
      "selectCategory": "Select a category",
      "enterValidAmount": "Enter a valid amount",
      "translationsLabel": "Translations",
      "graphicsLabel": "Graphics",
      "programmingLabel": "Programming",
      "multimediaLabel": "Multimedia",
      "customerServiceLabel": "Customer service",
      "officeWorkLabel": "Office work",
      "steps": {
        "title": "How to start? Step by step",
        "step1": {
          "title": "Fill out the form",
          "description": "The first step is to get in touch with us. Fill out a short form on our website — describe your idea and skills. At this stage, you don't need a ready business plan — just the willingness to act."
        },
        "step2": {
          "title": "Discover the offer",
          "description": "Based on the information provided, we will prepare a collaboration proposal — tailored to your situation, capabilities, and industry. We will present you with specific solutions: how you can operate within the foundation, how you will be compensated, and what benefits you will gain from the program."
        },
        "step3": {
          "title": "Join us",
          "description": "After reviewing the offer, we sign a cooperation agreement with you. This agreement allows you to operate legally without the need to register a business, without social security contributions, and without having to handle accounting."
        },
        "step4": {
          "title": "Start operating",
          "description": "From this moment, you can fully and legally provide your services or sell products. We take care of all the formalities: invoices, settlements, accounting, and documentation. You focus solely on what is truly important — growing your business."
        }
      },
      "card1.learnMore": "Test yourself!",
      "card2.learnMore": "Calculate!",
      "card3.learnMore": "Find out!",
      "faqHeader": "FAQ",
      "faq.description": "Here you will find answers to the most frequently asked questions.",
      "faq.question1": "What does the Foundation do?",
      "faq.answer1": "The Foundation supports the development of startups and young entrepreneurs by providing access to mentoring, training, financing, and a network of business contacts. Our mission is to help innovative projects succeed in the market.",
      "faq.question2": "How can I submit my startup to the Foundation?",
      "faq.answer2": "To submit your startup for support, simply fill out the application form available on our website ([link to the form]). After reviewing your submission, we will contact you to discuss the next steps.",
      "faq.question3": "What kind of support do you offer?",
      "faq.answer3": "We offer support in various areas, such as: <ul><li><b>Mentoring</b> – individual consultations with experienced entrepreneurs and experts.</li><li><b>Training and workshops</b> – in management, finance, marketing, and business strategy.</li><li><b>Access to a network of investors</b> – we help in securing financing for startups.</li><li><b>Coworking space</b> – the opportunity to work in an inspiring environment.</li><li><b>Acceleration programs</b> – intensive support for selected projects.</li></ul>",
      "faq.question4": "Is participation in the Foundation's programs free?",
      "faq.answer4": "No, participation in our programs is free. The Foundation operates on a profit basis and secures funds from partners and sponsors to support the development of innovative companies.",
      "faq.question5": "Does the Foundation provide funding for startups?",
      "faq.answer5": "Not directly, but we help establish contacts with investors, venture capital funds, and other sources of financing that can support your project.",
      "faq.question6": "Can I become a mentor at the Foundation?",
      "faq.answer6": "Yes! If you have business experience and want to support startup development, contact us through the contact form or write to <b>biuro@strefastartu.pl</b>.",
      "faq.question7": "Does the Foundation organize networking events?",
      "faq.answer7": "Yes, we regularly organize meetings, conferences, and hackathons where startups can establish valuable contacts, gain knowledge, and present their ideas to investors. You can find the current event calendar [here – link].",
      "faq.question8": "How can I become a partner of the Foundation?",
      "faq.answer8": "Companies and institutions that want to support startup development can become our partners. We offer various forms of collaboration – from sponsorship to mentoring programs. Details can be found in the contact form or you can contact us by phone or email at <b>kontakt@strefastartu.pl</b>.",
      "faq.question9": "How can I contact the Profit Foundation?",
      "faq.answer9": "<b>📧 Email:</b> Kontakt@StrefaStartu.pl <br><b>📞 Phone:</b> (24) 337 11 60 <br><b>🌍 Headquarters address:</b> Kutno, 1A Wschodnia Street, 99-300 Kutno <br><b>🏦 Bank account number:</b>",
      "aboutDescription": `Our Foundation was created by young people who wanted to run a business, make money, and had countless ideas.

We dedicate our work to those who want to start a business but are not yet ready for the formal registration of their own company.
We support young entrepreneurs, freelancers, salaried employees, and people with disabilities regardless of age, gender, or skin color.
We help you test your ideas, acquire your first customers, and prove your skills in real-world conditions.
We remove barriers to entrepreneurship and create space for innovation, so that everyone can safely spread their wings in their own business.`,
      "aboutTitle": "About the Foundation",
      noZus: "Company without social security",
      itConsulting: "IT Support",
      training: "Coaching",
      costComparison: "Cost Comparison",
      legalAdvice: "Legal support",
      expertSupport: "Expert support",
      legalPersonality: "Legal personality",
      marketing: "Marketing support",
      accounting: "Accounting support",
      infrastructure: "Management system",
      servicesHeader: "Test your idea in real conditions",
      servicesDescription: "Build your customer base and develop your brand. Secure a stable position in the market before registering your own company. Now you can work on your own terms – without commitments, but with full support. See how easy it is to get started!",
      contactUs: "Join us",
      exchange: "And many others",
      featuresHeader: "With us, you will get",
      "foundationIntro": {
        "title": "A foundation that works for you",
        "paragraphs": [
          "Imagine a place where you can legally work and earn from your passions, talents, and ideas — even if you are not yet 18 or you simply do not want to register your own business.",
          "A place that takes over all bureaucracy, accounting, HR, and formalities… and leaves you with just one task: doing what you love and what you want to be paid for."
        ],
        "highlights": [
          "You work the way you want.",
          "You earn on your own terms."
        ],
        "highlightsNote": "And we handle everything else.",
        "closing": [
          "We give you the tools, the care of a Coordinator, access to trainings, a ready-made business back office, and a system that works on your behalf.",
          "It is a space where you can safely test ideas, win clients, and grow like a real entrepreneur — without the stress and formalities that usually stop people at the start.",
          "This is your moment.",
          "If you have an idea, a passion, or even just a spark of willingness — here you can turn it into something real.",
          "Take the first step. Reach out to us. We will handle the rest together."
        ],
        "cta": "Take the first step"
      },
      "newTabs": {
        "heading": "Even more support inside Strefa Startu",
        "description": "Discover the people and tools that support you every day — from your mentor, through the beneficiary account, to dedicated trainings.",
        "caretaker": {
          "title": "Your mentor",
          "paragraphs": [
            "Every participant in our program receives an individual Mentor who stands by them from the very first day of cooperation. Your Mentor is your point of contact in the Foundation — they support your daily activities, help organize your work, and ensure every necessary document and formality is prepared on time.",
            "This is someone who knows your business profile, understands your needs, and watches over your growth. Whenever questions or challenges appear, you can count on their help, guidance, and expert support. Thanks to that, you do not have to worry about paperwork — you can focus on what matters most: running and growing your own company."
          ],
          "footer": "Your Mentor is on your side at every stage of cooperation."
        },
        "account": {
          "title": "Your beneficiary account",
          "paragraphs": [
            "Handling paperwork and keeping track of invoices can be simple — as long as you have the right tools. As a Beneficiary of the program, you receive a personal online account that lets you comfortably manage every matter related to your business."
          ],
          "listTitle": "Inside your account you can:",
          "listItems": [
            "settle documents and monitor every invoice",
            "check your earnings and full payment history",
            "manage HR and payroll",
            "issue invoices and send them directly to your clients",
            "track the status of settlements and documents",
            "handle accounting formalities in one place"
          ],
          "footer": "The built-in communicator gives you direct contact with every department — accounting, HR, administration, and your Mentor. It is one intuitive space that lets you manage the entire business quickly and comfortably."
        },
        "trainings": {
          "title": "Trainings",
          "paragraphs": [
            "Being part of the Foundation means not only convenience in running a business but also the opportunity to continuously grow your entrepreneurial skills. This is a place where you can count on real expert support plus numerous trainings and courses that help you level up.",
            "You gain access to our library of trainings that cover the most important business areas — from marketing and finance to soft-skill development. Join popular recurring sessions or request a tailor-made training that fits your needs. Our team will organize everything for you and support you at every stage so you can grow in the direction that matters most to you."
          ]
        }
      },
      title: "Strefa Startu",
      description: "Foundation description",
      about: "About us",
      services: "Services",
      faq: "FAQ",
      login: "Log in",
      contact: "Contact",
      getStarted: "Join us",
      heroTitle: "LAUNCH WITH US",
      heroText: "Do you have a business idea but are worried about costs and bureaucracy? Join the program that allows you to earn without social security and bureaucracy.",
      learnMore: "Calculator",
      joinCustomers: "Our services",
      ctaTitle: "Flexible offer for freelancers",
      ctaText: "If you're a freelancer and don't work regularly – you can take advantage of our support exactly when you need it. Work legally, without unnecessary formalities, and seize every opportunity with our freelancer program.",
      costComparison: "Cost Comparison",
      entrepreneurTestQuestion1: "Do you have a business idea?",
      entrepreneurTestQuestion2: "Do you know the market you want to operate in?",
      entrepreneurTestQuestion3: "Do you have experience in the industry?",
      entrepreneurTestQuestion4: "Are you ready to take risks?",
      entrepreneurTestTitle: "Entrepreneurship Test",
      entrepreneurTestDescription: "Fill out the survey to check your entrepreneurial potential.",
      brandName: "StrefaStartu",
      about: "About us",
      calculator: "Calculator",
      contact: "Contact",
      faq: "FAQ",
      login: "Login",
      yes: "Yes",
      no: "No",
      nextStep: "Next step",
      entrepreneurTestHeader: "Entrepreneurship Test",
      entrepreneurTestContactHeader: "Enter your details",
      greatJobTitle: "You're doing great!",
      greatJobContent: "You already have a solid foundation to start your own business. Leave your details so we can contact you and help you take the next steps!",
      firstName: "First name",
      firstNamePlaceholder: "Enter your first name",
      lastName: "Last name",
      lastNamePlaceholder: "Enter your last name",
      email: "Email",
      emailPlaceholder: "Enter your email",
      phone: "Phone number",
      phonePlaceholder: "Enter your phone number",
      marketingConsent: "I consent to receiving marketing information",
      gdprConsent: "I consent to the processing of my personal data in accordance with GDPR",
      submit: "Submit",
      companyName: "StrefaStartu Ltd.",
      allRightsReserved: "All rights reserved.",
      "services": {
        "noZus": "WITHOUT social security",
        "noTaxOffice": "WITHOUT tax office",
        "noAccounting": "WITHOUT accounting"
      },
      cardtest: {
        "title": "Take the challenge",
        "description": "Here you will test your entrepreneurial mindset."
      },
      cardcalculator: {
        "title": "Cost comparison",
        "description": "Check which collaboration option with us is the most beneficial for you."
      },
      cardfaq: {
        "title": "FAQ",
        "description": "Frequently asked questions."
      },
      "groups": {
        "forWhomTitle": "For whom?",
        "forWhomDescription": "Find the ideal solution for yourself – no one is excluded!",
        "seniors": {
          "title": "Seniors",
          "description": "Leverage your experience and work without losing benefits and unnecessary formalities."
        },
        "employed": {
          "title": "Employed",
          "description": "Test your business idea without registering a business and double contributions."
        },
        "youth": {
          "title": "Youth",
          "description": "Have an idea and want to start earning? With us, you can operate legally without registering a company and without social security costs."
        },
        "disabled": {
          "title": "People with disabilities",
          "description": "Grow your business and operate on your own terms without losing benefits."
        },
        "farmers": {
          "title": "Farmers",
          "description": "Earn extra and grow your business without giving up KRUS."
        }
      },
      "topic": {
        "no_zus": "I don't want to pay ZUS",
        "foundation": "I want to settle through a foundation",
        "no_company": "I don't have a company",
        "freelancer": "Freelancer",
        "tax_optimization": "Tax optimization"
      }
    },
    panel: {
      nav: {
        dashboard: 'Dashboard',
        invoices: 'Invoices',
        invoiceList: 'Invoice list',
        newInvoice: 'New invoice',
        newCostInvoice: 'New expense invoice',
        payouts: 'Payouts',
        documents: 'Documents',
        messages: 'Messages',
        legalHelp: 'Legal support',
        suggestions: 'Suggestions',
      },
      sidebar: {
        yourCompany: 'Your company',
        companyNotProvided: 'Not specified',
        logout: 'Log out',
      },
      aria: {
        goToDashboard: 'Go to dashboard',
        accountSettings: 'Account settings',
        toggleTheme: 'Toggle theme',
        language: 'Panel language',
        langPl: 'Polish — switch interface language',
        langEn: 'English — switch interface language',
      },
      dashboard: {
        fallbackDisplayName: 'Guest',
        loading: 'Loading...',
        accessSuspendedTitle: 'Access paused',
        accessSuspendedBody:
          'To keep using the panel, please pay your subscription fee.',
        accessSuspendedHint: 'Only messages remain available in the sidebar.',
        welcome: 'Welcome, {{name}}!',
        welcomeSubtitle: 'See the latest updates, notices, and your account status.',
        welcomeLoading: 'Welcome!',
        subscriptionTitle: 'Subscription & support',
        badgeActive: 'Active',
        badgePending: 'Pending',
        paymentReminder:
          'Heads up: subscription payment is due in {{days}} days.',
        monthlyFee: 'Monthly fee',
        nextPayment: 'Next payment',
        none: 'None',
        accountStatus: 'Account status',
        firstPaymentDue: 'First payment due: {{date}}',
        accountActive: 'Account active',
        awaitingSubscription: 'Awaiting subscription payment',
        withUsLabel: 'You have been with us for:',
        durationDays: '{{count}} days',
        durationMonths: '{{count}} months',
        documents: 'Documents',
        documentsHint: 'Pending approval',
        balance: 'Balance',
        balanceHint: 'Funds currently available',
        messages: 'Messages',
        messagesHint: 'New unread messages',
        eventsTitle: 'Latest events',
        updatesTitle: 'Upcoming updates',
        badgeSoon: 'Coming soon',
        update1Title: 'Panel expansion',
        update1Desc: 'New features for beneficiaries',
        update2Title: 'Express payouts',
        update2Desc: 'Faster payment processing',
        update3Title: 'New services',
        update3Desc: 'More options for beneficiaries',
      },
    }
  },

  ua: {
    "common": {
      ua: {
        translation: {
          cookieConsent: {
            message:
              'Цей веб-сайт використовує файли cookie для забезпечення найкращого досвіту. Натискаючи "Приймаю", ви погоджуєтесь на їх використання.',
            accept: 'Приймаю',
            decline: 'Відхилити'
          }
        }
      },
      "referralOptions.tiktok": "TikTok",
      "referralOptions.instagram": "Instagram",
      "referralOptions.facebook": "Facebook",
      "referralOptions.linkedin": "LinkedIn",
      "footer.navigation":"Nawigacja",
      "footer.documents":"Dokumenty",
      "footer": {
        "foundationTitle": "Фундація Strefa Startu",
        "address": "вул. Wschodnia 1A, 99-300 Kutno",
        "nip": "NIP: 7752676034",
        "phone": "(24) 337 11 60",
        "email": "kontakt@strefastartu.pl",
        "navigation": {
          "title": "Навігація",
          "home": "Головна сторінка",
          "about": "Про нас",
          "offer": "Пропозиція",
          "contact": "Контакт"
        },
        "documents": {
          "title": "Документи",
          "terms": "Правила",
          "rodoPolicy": "Політика RODO",
          "privacyPolicy": "Політика конфіденційності",
          "cookiesPolicy": "Політика Cookies"
        },
        "copyCompany": "StrefaStartu",
        "allRightsReserved": "Всі права захищені."
      },
      "back": "Назад",
      "next": "Далі",
      "multistep": {
        "intro": {
          "title": "Ласкаво просимо до форми заявки!",
          "description": "Заповніть нижченаведені дані, щоб подати заявку на свій стартап та скористатися нашими послугами."
        },
        "step1": {
          "title": "Крок 1: Ваша бізнес-ідея"
        },
        "step2": {
          "title": "Крок 2: Тема заявки та згоди"
        },
        "step3": {
          "title": "Згода та послуги"
        },
        "services": {
          "title": "Оберіть послуги:",
          "legalAdvice": "Юридичні консультації",
          "marketingAdvice": "Маркетингові консультації",
          "marketingServices": "Маркетингові послуги",
          "officeRental": "Оренда офісу",
          "carRental": "Оренда автомобіля",
          "grantAssistance": "Допомога у отриманні гранту",
          "cheapLoan": "Дешевий кредит",
          "other": "Інші",
          "none": "Послуги не обрано"
        },
        "mail": {
          "from": "Форма заявки стартапу",
          "subject": "Нова заявка стартапу",
          "title": "Нова заявка стартапу",
          "fullName": "Ім'я та прізвище:",
          "email": "Електронна пошта:",
          "phone": "Телефон:",
          "age": "Вік:",
          "activity": "Діяльність:",
          "projectedProfit": "Прогнозований прибуток:",
          "projectedOrders": "Прогнозована кількість замовлень:",
          "partner": "Бізнес-партнер:",
          "companyName": "Назва компанії:",
          "services": "Обрені послуги:"
        }
      },
      "form": {
        "fullName": "Ім'я та прізвище",
        "fullNamePlaceholder": "Введіть ім'я та прізвище",
        "email": "Електронна адреса",
        "emailPlaceholder": "Введіть електронну адресу",
        "phone": "Номер телефону (необов'язково)",
        "phonePlaceholder": "Необов'язково введіть номер телефону",
        "age": "Вік (необов'язково)",
        "agePlaceholder": "Необов'язково введіть вік",
        "activity": "Підприємницька діяльність",
        "activityPlaceholder": "Введіть тип діяльності",
        "projectedProfit": "Прогнозований прибуток",
        "projectedProfitPlaceholder": "Введіть прогнозований прибуток",
        "projectedOrders": "Прогнозована кількість замовлень",
        "projectedOrdersPlaceholder": "Введіть прогнозовану кількість замовлень",
        "partner": "Чи маєте бізнес-партнера?",
        "partnerPlaceholder": "Введіть 'так' або 'ні'",
        "companyName": "Назва компанії",
        "companyNamePlaceholder": "Введіть назву компанії",
        "acceptRODO": "Я приймаю RODO",
        "acceptPrivacy": "Я приймаю політику конфіденційності",
        "submit": "Надіслати",
        "topic": "Тема заявки",
        "topicPlaceholder": "Оберіть тему...",
        "acceptRODOText": "Я даю згоду на обробку моїх персональних даних відповідно до GDPR.",
        "acceptPrivacyText": "Я приймаю Політику конфіденційності сайту.",
        "referralSource": "Звідки ви про нас дізналися?",
        "referralSourcePlaceholder": "Оберіть джерело...",
        "referralCode": "Реферальний код",
        "referralCodePlaceholder": "Введіть код від друга",
        "referralOther": "Яке?",
        "referralOtherPlaceholder": "Введіть інше джерело"
      },
      "referral": {
        "tiktok": "TikTok",
        "instagram": "Instagram",
        "facebook": "Facebook",
        "linkedin": "LinkedIN",
        "friend": "Знайомий",
        "other": "Інше (яке?)"
      },
      "validation": {
        "fieldRequired": {
          "referralSource": "Оберіть джерело інформації.",
          "referralCode": "Введіть реферальний код.",
          "referralOther": "Введіть інше джерело."
        }
      },
      "faqTitle": "Поширені запитання",
      "startNow": "Перевірте витрати",
      "contactTitle": "Контакт",
      "contactDescription": "Зв'яжіться з нами, щоб дізнатися більше",
      "companyName": "StrefaStartu Sp. z o.o.",
      "allRightsReserved": "Всі права захищені",
      "about": "Про нас",
      "calculator": "Калькулятор",
      "contact": "Контакт",
      "faq": "FAQ",
      "login": "Вхід",
      "getStarted": "Почати зараз",
      "loginChoice": {
        "beneficiary": "Бенефіціар",
        "freelancer": "Фрілансер"
      },
      "companyAddress": "вул. Wschodnia 1A, 99-300 Kutno",
      "companyPhone": "(24) 337 11 60",
      "companyEmail": "kontakt@strefastartu.pl",
      "yourFullName": "Ім'я та прізвище",
      "yourFullNamePlaceholder": "Введіть ваше ім'я та прізвище",
      "yourPhone": "Номер телефону",
      "yourPhonePlaceholder": "Введіть ваш номер телефону",
      "yourEmail": "Електронна адреса",
      "yourEmailPlaceholder": "Введіть вашу електронну адресу",
      "yourSubject": "Тема",
      "cooperation": "Співпраця",
      "crm": "CRM",
      "others": "Інше",
      "yourMessage": "Повідомлення",
      "yourMessagePlaceholder": "Введіть ваше повідомлення",
      "sendMessage": "Надіслати повідомлення",
      "formComingSoon": "Форма контакту незабаром",
      "ourLocation": "Наша локація",
      "companyDetails": "Дані компанії",
      "nip": "NIP: 7752676034",
      "navigation": "Навігація",
      "home": "Головна сторінка",
      "offer": "Пропозиція",
      "blog": "Блог",
      "documents": "Документи",
      "termsOfService": "Правила",
      "gdprPolicy": "Політика RODO",
      "privacyPolicy": "Політика конфіденційності",
      "cookiePolicy": "Політика Cookies",
      "costsPageTitle": "Калькулятори та витрати",
      "costsPageDescription": "Перевірте витрати та скористайтеся калькуляторами",
      "companyName": "StrefaStartu Sp. z o.o.",
      "allRightsReserved": "Всі права захищені.",
      "about": "Про нас",
      "calculator": "Калькулятор",
      "contact": "Контакт",
      "faq": "FAQ",
      "login": "Вхід",
      "getStarted": "Почати зараз",
      "calculatorsTitle": "Порівняння витрат",
      "checkSavings": "Перевірте можливу економію",
      "description": "Опис",
      "withIncubator": "З нами",
      "independently": "Самостійно",
      "registrationTime": "Час реєстрації",
      "incomeTaxLabel": "Податок на прибуток",
      "zusNfz": "ZUS / NFZ",
      "paidPpk": "Платний PPK",
      "accounting": "Бухгалтерія",
      "monthly": "Щомісячно",
      "oneDay": "3 дні",
      "about30Days": "Приблизно 30 днів",
      "taxScale": "12/17/19% (шкала)",
      "dependsOnStatus": "0 злотих",
      "fullZus": "Повний ZUS близько 1400 злотих",
      "about250": "близько 250 злотих",
      "1400Plus": "1400+ злотих",
      "noHiddenCosts": "Немає прихованих витрат!",
      "fullTransparency": "Повна прозорість",
      "noSurprises": "Без сюрпризів",
      "fixedRate": "Фіксована ставка",
      "calculator1": "Калькулятор співпраці з фондом",
      "calculator2": "Калькулятор співпраці як фрілансер",
      "check": "Перевірте",
      "areYouStudent": "Чи є ти студентом?",
      "yes": "Так",
      "no": "Ні",
      "voluntaryHealthInsurance": "Чи бажаєте добровільне медичне страхування (NFZ)?",
      "expectedIncome": "Очікуваний дохід (щомісяця)",
      "monthlyCosts": "Щомісячні витрати",
      "incubationFee": "Інкубаційний внесок",
      "nfzContribution": "Страховий внесок NFZ (9%)",
      "yourNet": "Ваш «на руки»",
      "netAmountLabel": "Чиста сума",
      "sampleIncubationFee": "* Приклад фіксованого інкубаційного внеску.",
      "netAmountToAccount": "Чиста сума «на рахунок»",
      "incomeTax": "Податок на прибуток (12%)",
      "serviceFee": "Сервісний збір (9%)",
      "vat": "ПДВ (23%)",
      "grossAmountWithVat": "Брутто сума з ПДВ",
      "totalGross": "Разом (брутто)",
      "sampleServiceFee": "* Приклад сервісного збору (9%).",
      "uploadFile": "Завантажити файл (PDF)",
      "uploadFileDescription": "Додайте документ до рахунку (наприклад, договір) у форматі PDF.",
      "changeFile": "Змінити файл",
      "clickToSelectFile": "Натисніть, щоб вибрати файл",
      "orDragHere": "або перетягніть файл сюди",
      "title": "Заголовок",
      "documentNamePlaceholder": "Назва документа / рахунку",
      "descriptionPlaceholder": "Необов'язковий опис рахунку",
      "category": "Категорія",
      "yourDetails": "Ваші дані",
      "firstName": "Ім'я",
      "lastName": "Прізвище",
      "email": "Електронна пошта",
      "address": "Адреса",
      "pesel": "PESEL",
      "phone": "Телефон",
      "bankAccount": "Номер банківського рахунку",
      "counterpartyDetails": "Дані контрагента",
      "nip": "NIP",
      "counterpartyAddress": "Адреса контрагента",
      "counterpartyEmail": "Електронна пошта",
      "counterpartyPhone": "Телефон",
      "contractorName": "Назва контрагента",
      "payment": "Оплата",
      "netAmount": "Чиста сума",
      "currency": "Валюта",
      "paymentDue": "Термін оплати",
      "summary": "Підсумок",
      "step": "Крок {{number}}",
      "back": "Назад",
      "next": "Далі",
      "issueInvoice": "Виписати рахунок",
      "processing": "Обробка...",
      "fieldRequired": "Це поле є обов'язковим",
      "selectCategory": "Виберіть категорію",
      "enterValidAmount": "Введіть правильну суму",
      "translationsLabel": "Переклади",
      "graphicsLabel": "Графіка",
      "programmingLabel": "Програмування",
      "multimediaLabel": "Мультимедіа",
      "customerServiceLabel": "Обслуговування клієнтів",
      "officeWorkLabel": "Офісна робота",
      "steps": {
        "title": "Як почати? Крок за кроком",
        "step1": {
          "title": "Заповніть форму",
          "description": "Першим кроком є зв'язок з нами. Заповніть коротку форму на нашому сайті — опишіть свою ідею та навички. На цьому етапі вам не потрібен готовий бізнес-план — достатньо бажання діяти."
        },
        "step2": {
          "title": "Ознайомтеся з пропозицією",
          "description": "На основі наданої інформації ми підготуємо пропозицію співпраці — адаптовану до вашої ситуації, можливостей та галузі. Ми представимо вам конкретні рішення: як ви можете діяти в рамках фонду, як буде здійснюватися розрахунок та які переваги ви отримаєте завдяки програмі."
        },
        "step3": {
          "title": "Приєднуйтесь до нас",
          "description": "Після ознайомлення з пропозицією ми підписуємо з вами договір про співпрацю. Саме він дає вам можливість діяти легально, без необхідності відкривати власну компанію, без ZUS та бухгалтерії з вашого боку."
        },
        "step4": {
          "title": "Почніть діяти",
          "description": "Від цього моменту ви можете повністю легально надавати свої послуги або продавати товари. Ми займаємося всіма формальностями: рахунками, розрахунками, бухгалтерією та документацією. Ви зосереджуєтеся лише на тому, що дійсно важливо — розвитку вашого бізнесу."
        }
      },
      "card1.learnMore": "Перевір себе!",
      "card2.learnMore": "Порахуйте!",
      "card3.learnMore": "Дізнайтеся!",
      "faqHeader": "Поширені запитання",
      "faq.description": "Тут ви знайдете відповіді на найчастіші питання.",
      "faq.question1": "Чим займається Фундація?",
      "faq.answer1": "Фундація підтримує розвиток стартапів та молодих підприємців, пропонуючи доступ до менторства, тренінгів, фінансування та мережі ділових контактів. Наша місія — допомагати інноваційним проектам досягти успіху на ринку.",
      "faq.question2": "Як я можу подати свій стартап до фонду?",
      "faq.answer2": "Щоб подати свій стартап до програми підтримки, достатньо заповнити заявку, доступну на нашому сайті ([посилання на форму]). Після аналізу заявки ми зв'яжемося з вами, щоб обговорити подальші кроки.",
      "faq.question3": "Яку підтримку ви пропонуєте?",
      "faq.answer3": "Пропонуємо підтримку в різних сферах, таких як: <ul><li><b>Менторство</b> – індивідуальні консультації з досвідченими підприємцями та експертами.</li><li><b>Тренінги та майстер-класи</b> – у галузі управління, фінансів, маркетингу та бізнес-стратегії.</li><li><b>Доступ до мережі інвесторів</b> – допомагаємо залучати фінансування для стартапів.</li><li><b>Коворкінговий простір</b> – можливість роботи в надихаючому середовищі.</li><li><b>Акселераційні програми</b> – інтенсивна підтримка для обраних проектів.</li></ul>",
      "faq.question4": "Чи є участь у програмах фонду платною?",
      "faq.answer4": "Ні, участь у наших програмах безкоштовна. Фундація діє на принципі прибутку та залучає кошти від партнерів і спонсорів, щоб підтримувати розвиток інноваційних компаній.",
      "faq.question5": "Чи пропонує фонд фінансування для стартапів?",
      "faq.answer5": "Не безпосередньо, але ми допомагаємо встановити контакти з інвесторами, венчурними фондами та іншими джерелами фінансування, які можуть підтримати ваш проект.",
      "faq.question6": "Чи можу я стати ментором у фонді?",
      "faq.answer6": "Так! Якщо у вас є досвід у бізнесі і ви хочете підтримувати розвиток стартапів, зв'яжіться з нами через форму контакту або напишіть на <b>biuro@strefastartu.pl</b>.",
      "faq.question7": "Чи організовує фонд мережеві заходи?",
      "faq.answer7": "Так, ми регулярно організовуємо зустрічі, конференції та хакатони, на яких стартапи можуть встановлювати цінні контакти, здобувати знання та презентувати свої ідеї інвесторам. Актуальний календар заходів знайдете [тут – посилання].",
      "faq.question8": "Як я можу стати партнером фонду?",
      "faq.answer8": "Компанії та установи, які бажають підтримувати розвиток стартапів, можуть стати нашими партнерами. Ми пропонуємо різні форми співпраці – від спонсорства до менторських програм. Деталі ви знайдете у формі контакту або можете звернутися до нас за телефоном чи електронною поштою: <b>kontakt@strefastartu.pl</b>.",
      "faq.question9": "Як зв'язатися з Фундацією Profit?",
      "faq.answer9": "<b>📧 Електронна пошта:</b> Kontakt@StrefaStartu.pl <br><b>📞 Телефон:</b> (24) 337 11 60 <br><b>🌍 Адреса офісу:</b> Kutno, вул. Wschodnia 1A, 99-300 Kutno <br><b>🏦 Номер банківського рахунку:<b>",
      "aboutDescription": "Наша Фундація була заснована завдяки молодим людям, які хотіли займатися бізнесом, заробляти гроші та мали безліч ідей.\n\nМи присвячуємо нашу роботу людям, які хочуть розпочати бізнес, але ще не готові до офіційної реєстрації власної компанії.\nМи підтримуємо молодих підприємців, фрілансерів, найманих працівників та осіб з інвалідністю незалежно від віку, статі та кольору шкіри.\nМи допомагаємо вам перевірити свої ідеї, залучити перших клієнтів та перевірити свої навички в реальних умовах.\nМи усуваємо бар'єри для підприємництва та створення простору для інновацій, завдяки чому кожен з вас може безпечно розправити крила у власному бізнесі.",
      "aboutTitle": "Про Фундацію",
      "noZus": "Компанія без ZUS",
      "itConsulting": "IT-підтримка",
      "training": "Коучинг",
      "costComparison": "Порівняння витрат",
      "legalAdvice": "Юридична підтримка",
      "expertSupport": "Підтримка експертів",
      "legalPersonality": "Юридична особа",
      "marketing": "Маркетингова підтримка",
      "accounting": "Бухгалтерська підтримка",
      "infrastructure": "Система управління",
      "servicesHeader": "Тестуйте свою ідею в реальних умовах",
      "servicesDescription": "Створюйте клієнтську базу та розвивайте свій бренд. Отримайте стабільну позицію на ринку, перш ніж реєструвати власну компанію. Тепер ви можете працювати на своїх умовах – без зобов'язань, але з повною підтримкою. Перевірте, як легко ви можете почати!",
      "contactUs": "Приєднуйтесь до нас",
      "exchange": "Та багато іншого",
      "featuresHeader": "З нами ви отримаєте",
      "foundationIntro": {
        "title": "Фундація, що працює для тебе",
        "paragraphs": [
          "Уяви місце, де ти можеш легально працювати й заробляти на своїх захопленнях, талантах та ідеях — навіть якщо тобі ще немає 18 або ти не хочеш відкривати власну компанію.",
          "Місце, яке бере на себе всю бюрократію, бухгалтерію, кадри та формальності… а тобі залишає лише одне: робити те, що любиш, і за що хочеш отримувати винагороду."
        ],
        "highlights": [
          "Працюєш так, як тобі зручно.",
          "Заробляєш на власних правилах."
        ],
        "highlightsNote": "А ми дбаємо про все інше.",
        "closing": [
          "Ми даємо тобі інструменти, підтримку Координатора, доступ до навчань, готовий бізнес-бекофіс і систему, яка працює замість тебе.",
          "Це простір, у якому ти можеш безпечно тестувати ідеї, знаходити клієнтів і розвиватися як справжній підприємець — без стресу та формальностей, що зазвичай зупиняють людей на старті.",
          "Це твій момент.",
          "Якщо маєш ідею, пристрасть чи хоча б іскру бажання — тут вона може стати чимось справжнім.",
          "Зроби перший крок. Напиши нам. Решту зробимо разом."
        ],
        "cta": "Зроби перший крок"
      },
      "newTabs": {
        "heading": "Ще більше підтримки в Strefa Startu",
        "description": "Познайомтеся з людьми та інструментами, які щодня підтримують вашу співпрацю — від Опікуна й кабінету бенефіціара до спеціальних навчань.",
        "caretaker": {
          "title": "Ваш Опікун",
          "paragraphs": [
            "Кожен Учасник нашої програми отримує індивідуального Опікуна, який супроводжує його з першого дня співпраці. Опікун — це ваша контактна особа у Фундації: він підтримує вас у щоденній роботі, допомагає організувати процеси та стежить, щоб усі документи й формальності були готові вчасно.",
            "Це людина, яка знає профіль вашої діяльності, розуміє ваші потреби й піклується про ваш розвиток. У разі запитань або труднощів ви можете розраховувати на її допомогу, підказки та експертну підтримку. Завдяки цьому ви не переймаєтесь формальностями — зосереджуєтесь на веденні та розвитку власного бізнесу."
          ],
          "footer": "Ваш Опікун на вашому боці на кожному етапі співпраці."
        },
        "account": {
          "title": "Ваш рахунок бенефіціара",
          "paragraphs": [
            "Розрахунок документів і контроль рахунків може бути простим — якщо маєте правильні інструменти. Як Бенефіціар програми ви отримуєте особистий онлайн-кабінет, що дозволяє зручно керувати всіма справами, пов'язаними з вашою діяльністю."
          ],
          "listTitle": "У своєму кабінеті ви можете:",
          "listItems": [
            "розраховувати документи та контролювати всі рахунки",
            "перевіряти заробіток і історію надходжень",
            "обслуговувати HR і зарплати",
            "виставляти рахунки та надсилати їх клієнтам",
            "відстежувати статус розрахунків і документів",
            "вирішувати бухгалтерські формальності в одному місці"
          ],
          "footer": "Вбудований комунікатор забезпечує прямий контакт з кожним відділом — бухгалтерією, кадрами, адміністрацією та Опікуном. Це єдиний інтуїтивний простір, що дозволяє швидко й зручно керувати всім бізнесом."
        },
        "trainings": {
          "title": "Навчання",
          "paragraphs": [
            "Участь у Фундації — це не лише зручність у веденні діяльності, а й можливість постійно розвивати свої бізнес-навички. Тут ви можете розраховувати на реальну експертну підтримку та численні тренінги й курси, що допомагають зростати як підприємцю.",
            "Ви отримуєте доступ до нашої бази навчань, яка охоплює ключові сфери бізнесу — від маркетингу й фінансів до розвитку м'яких навичок. Долучайтеся до популярних циклічних занять або подавайте заявку на тренінг, адаптований саме до ваших потреб. Наша команда організує все для вас і підтримає на кожному етапі, щоб ви могли розвиватися в найважливішому для себе напрямі."
          ]
        }
      },
      "title": "Strefa Startu",
      "description": "Опис фонду",
      "about": "Про нас",
      "services": "Послуги",
      "faq": "FAQ",
      "login": "Увійти",
      "contact": "Контакт",
      "getStarted": "Приєднуйтесь до нас",
      "heroTitle": "СТАРТУЙ З НАМИ",
      "heroText": "У вас є бізнес-ідея, але ви боїтеся витрат і формальностей? Приєднуйтесь до програми, яка дозволить вам заробляти без ZUS та бюрократії.",
      "learnMore": "Калькулятор",
      "joinCustomers": "Наші послуги",
      "ctaTitle": "Гнучка пропозиція для фрілансерів",
      "ctaText": "Якщо ви фрілансер і працюєте нерегулярно, ви можете скористатися нашою підтримкою саме тоді, коли це необхідно. Працюйте легально, без зайвих формальностей та використовуйте кожну можливість завдяки нашій програмі для фрілансерів.",
      "costComparison": "Порівняння витрат",
      "entrepreneurTestQuestion1": "Чи маєте бізнес-ідею?",
      "entrepreneurTestQuestion2": "Чи знаєте ви ринок, на якому хочете працювати?",
      "entrepreneurTestQuestion3": "Чи маєте досвід у галузі?",
      "entrepreneurTestQuestion4": "Чи готові ви до ризику?",
      "entrepreneurTestTitle": "Тест підприємництва",
      "entrepreneurTestDescription": "Заповніть опитування, щоб перевірити свій підприємницький потенціал.",
      "brandName": "StrefaStartu",
      "about": "Про нас",
      "calculator": "Калькулятор",
      "contact": "Контакт",
      "faq": "FAQ",
      "login": "Вхід",
      "yes": "Так",
      "no": "Ні",
      "nextStep": "Далі",
      "entrepreneurTestHeader": "Тест підприємництва",
      "entrepreneurTestContactHeader": "Введіть свої дані",
      "greatJobTitle": "Ви прекрасно справляєтесь!",
      "greatJobContent": "Ви вже маєте міцну основу, щоб думати про власний бізнес. Залиште свої дані, щоб ми могли зв'язатися з вами та допомогти вам у подальших кроках!",
      "firstName": "Ім'я",
      "firstNamePlaceholder": "Введіть ваше ім'я",
      "lastName": "Прізвище",
      "lastNamePlaceholder": "Введіть ваше прізвище",
      "email": "Електронна пошта",
      "emailPlaceholder": "Введіть вашу електронну пошту",
      "phone": "Номер телефону",
      "phonePlaceholder": "Введіть ваш номер телефону",
      "marketingConsent": "Я погоджуюся отримувати маркетингову інформацію",
      "gdprConsent": "Я погоджуюся на обробку персональних даних згідно з RODO",
      "submit": "Надіслати",
      "companyName": "StrefaStartu Sp. z o.o.",
      "allRightsReserved": "Всі права захищені.",
      "services": {
        "noZus": "БЕЗ ZUS",
        "noTaxOffice": "БЕЗ податкової інспекції",
        "noAccounting": "БЕЗ БУХГАЛТЕРІЇ"
      },
      "cardtest": {
        "title": "Прийміть виклик",
        "description": "Тут ви перевірите своє підприємницьке мислення."
      },
      "cardcalculator": {
        "title": "Порівняння витрат",
        "description": "Перевірте, який варіант співпраці з нами буде для вас найбільш вигідним."
      },
      "cardfaq": {
        "title": "FAQ",
        "description": "Найчастіші запитання."
      },
      "groups": {
        "forWhomTitle": "Для кого?",
        "forWhomDescription": "Знайдіть ідеальне рішення для себе – нікого не виключаємо!",
        "seniors": {
          "title": "Літні",
          "description": "Використовуйте свій досвід та працюйте, не втрачаючи пільг та без зайвих формальностей."
        },
        "employed": {
          "title": "Працевлаштовані",
          "description": "Перевірте свою бізнес-ідею без реєстрації діяльності та подвійних внесків."
        },
        "youth": {
          "title": "Молодь",
          "description": "У вас є ідея і ви хочете почати заробляти? У нас ви можете діяти легально без реєстрації компанії та витрат на ZUS."
        },
        "disabled": {
          "title": "Особи з інвалідністю",
          "description": "Розвивайте свій бізнес і дійте на своїх умовах без втрати допомог."
        },
        "farmers": {
          "title": "Фермери",
          "description": "Заробляйте додатково та розвивайте свою діяльність, не відмовляючись від KRUS."
        }
      },
      "topic": {
        "no_zus": "Не хочу платити ZUS",
        "foundation": "Хочу розраховуватись через фонд",
        "no_company": "У мене немає компанії",
        "freelancer": "Freelancer",
        "tax_optimization": "Оптимізація податків"
      }
    }
  }
};

Object.assign(resources.pl.panel, beneficiaryPanelExtraLocalesPl);
Object.assign(resources.en.panel, beneficiaryPanelExtraLocalesEn);

i18n.use(initReactI18next).init({
  resources,
  lng: 'pl',            // domyślny język ustawiony na polski
  fallbackLng: 'pl',
  ns: ['common', 'panel'],
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
  debug: false,
});


export default i18n;
