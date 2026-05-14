// Plik: /pages/api/interesant.jsx
// Wersja: Kompletna i gotowa do użycia

import {
  createSmtpTransport,
  getSmtpMailFrom,
  DEFAULT_FORM_NOTIFY_TO,
} from '../../lib/smtp.js';

export default async function handler(req, res) {
  // Akceptuje tylko metodę POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Metoda ${req.method} nie jest dozwolona`);
  }

  // Pobiera potrzebne dane z ciała zapytania (z frontendu)
  // `replyTo` zawiera e-mail osoby wypełniającej formularz
  const { subject, html, replyTo } = req.body;
  const userEmail = replyTo;

  // Prosta walidacja, czy mamy wszystko
  if (!userEmail || !subject || !html) {
    return res.status(400).json({ error: 'Brak wymaganych pól w żądaniu (email, temat lub treść).' });
  }

  const transporter = createSmtpTransport();
  if (!transporter) {
    return res.status(503).json({
      error:
        'Serwer pocztowy nie jest skonfigurowany. Ustaw SMTP_HOST, SMTP_PORT, SMTP_USER i SMTP_PASS.',
    });
  }

  try {
    // 1. Wysyłamy powiadomienie o nowym zgłoszeniu do Ciebie
    await transporter.sendMail({
      from: getSmtpMailFrom('Formularz Strefa Startu'),
      to: DEFAULT_FORM_NOTIFY_TO,
      replyTo: userEmail,
      subject: subject,
      html: html,
    });

    // 2. Przygotowujemy i wysyłamy automatyczną odpowiedź do użytkownika
    const replyMessage = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Informacje dotyczące współpracy</title>
      </head>
      <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.5;">
        <p>Dzień dobry,</p>
        <p>Dziękujemy za wypełnienie ankiety i zainteresowanie naszym projektem dla przyszłych przedsiębiorców! 💼🔥</p>
        <p>
          Poniżej przesyłamy ogólne informacje dotyczące współpracy z Fundacją wraz z linkiem do Regulaminu oraz Zasad przetwarzania przez Strefę Startu Twoich danych osobowych.
          Jeśli kontaktujesz się z nami po raz pierwszy, prosimy o zapoznanie się z oboma dokumentami. Aby kontynuować współpracę ze Strefą Startu, konieczne jest zapoznanie się z ich zapisami.
        </p>
        <p>
          <a href="https://strefastartu.pl/docs/regulamin.pdf" style="color: #2ecc71;">https://strefastartu.pl/docs/regulamin.pdf</a><br>
          <a href="https://strefastartu.pl/docs/rodo.pdf" style="color: #2ecc71;">https://strefastartu.pl/docs/rodo.pdf</a>
        </p>
        <p>
          W Strefie Startu sprawdzisz swoje możliwości i podejmiesz prawdziwe działania, zanim „na serio” zdecydujesz o własnej działalności gospodarczej. Nasz projekt to świetne rozwiązanie dla osób, które chcą rozpocząć swój biznes bez zbędnych formalności i wysokich kosztów.
        </p>
        <p><strong>W STREFIE STARTU:</strong></p>
        <ul>
          <li>Masz minimalne koszty początkowe działalności, miesięczne prowadzenie działalności w Strefie Startu to tylko 365 zł netto.</li>
          <li>Nie płacisz składek ZUS.</li>
          <li>Masz szansę na obniżenie podatku dochodowego nawet do 0 zł – dzięki zastosowaniu właściwych umów i procedur (umowa zlecenie lub umowa o dzieło).</li>
        </ul>
        <hr style="border: none; border-top: 1px solid #ccc;">
        <p><strong>Jak będziesz działał w Strefie Startu?</strong></p>
        <p>
          System CRM – to Twoje centrum operacyjne. Intuicyjnie i samodzielnie wystawiasz faktury sprzedażowe; do obsługi systemu CRM otrzymasz pełne szkolenie; tu przechowujesz swoje dokumenty kosztowe oraz umowy cywilnoprawne.
          Faktury za swoje zakupy czy usługi w ramach swojej działalności wprowadzasz do CRM i przesyłasz oryginały do siedziby Fundacji, gdzie dokumenty akceptuje koordynator i dział księgowy.
          Fakturę generujesz samodzielnie, ale dopiero po zatwierdzeniu przez koordynatora – pobierzesz i prześlesz ją swojemu kontrahentowi.
          Wpłaty od Twoich klientów trafiają bezpośrednio na Twoje indywidualne subkonto.
          W CRM masz dostęp do salda oraz wykazu faktur i umów.
        </p>
        <hr style="border: none; border-top: 1px solid #ccc;">
        <p><strong>Jak wypłacisz swoje środki z subkonta?</strong></p>
        <ol>
          <li>
            <strong>Umowa o dzieło (+ autorskie prawa majątkowe)</strong><br>
            Ten typ umowy nie wiąże się z kosztami ZUS. Przy przekazaniu koordynatorowi materiałów autorskich (np. filmów, artykułów, zdjęć) stawka podatku dochodowego wynosi tylko 6%! Pomożemy w przygotowaniu niezbędnych dokumentów.
          </li>
          <li>
            Od umowy zlecenie jest odprowadzana składka zdrowotna, więc jesteś ubezpieczony w ZUS.
          </li>
          <li>
            Otrzymasz listę kosztów, które możesz ponieść, a które są akceptowane przez Fundację.
          </li>
        </ol>
        <hr style="border: none; border-top: 1px solid #ccc;">
        <p><strong>Umowy z klientami i kontrahentami</strong></p>
        <p>
          Wszystkie formalne umowy z kontrahentem w Twoim imieniu podpisywane są przez Zarząd Strefy Startu lub osoby upoważnione. Wystarczy przesłać edytowalny plik umowy do koordynatora, który zajmie się jego weryfikacją i przekaże do działu prawnego celem akceptacji zapisów. Procedura ta ma na celu pełne zabezpieczenie beneficjenta.
        </p>
        <hr style="border: none; border-top: 1px solid #ccc;">
        <p><strong>Co otrzymujesz, dołączając do Strefy Startu?</strong></p>
        <ol>
          <li>Działanie z NIPem, REGONem i danymi Strefy Startu bez konieczności zakładania własnej działalności gospodarczej.</li>
          <li>Indywidualne subkonto.</li>
          <li>Pomoc koordynatora – codzienne wsparcie w rozliczeniach i formalnościach (dzwoń, pisz, pytaj).</li>
          <li>Obsługę księgową i kadrową – pełne rozliczenia VAT i PIT.</li>
          <li>Pomoc prawną – redagowanie umów, regulaminów, polityk prywatności.</li>
          <li>Doradztwo IT – tworzenie stron internetowych, wizytówek, folderów, grafik itp.</li>
          <li>Wsparcie marketingowe – strategie promocyjne, budowanie wizerunku.</li>
          <li>Szkolenia i konsultacje – cykliczne warsztaty tematyczne, m.in. z reklamy.</li>
          <li>Odpłatny dostęp do wybranych przez Ciebie biur/sal konferencyjnych.</li>
          <li>Ubezpieczenie.</li>
        </ol>
        <p>Pozdrawiamy,<br>Zespół Strefa Startu<br>tel.: +48 24 337 11 60</p>
        <hr style="border: none; border-top: 1px solid #ccc;">
        <p>
          <strong>ZASTRZEŻENIE POUFNOŚCI</strong><br>
          Niniejsza wiadomość oraz wszelkie załączone do niej pliki mogą zawierać informacje poufne i/lub prawnie chronione, przeznaczone wyłącznie do użytku przez adresata.
          Jeżeli nie jesteś zamierzonym odbiorcą tej wiadomości, uprzejmie prosimy o niezwłoczne poinformowanie nadawcy, usunięcie wiadomości z systemu oraz powstrzymanie się od jakiegokolwiek rozpowszechniania, kopiowania lub wykorzystywania jej treści.
          Każde nieautoryzowane wykorzystanie niniejszej wiadomości jest zabronione i może podlegać sankcjom prawnym.
        </p>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: getSmtpMailFrom('Strefa Startu'),
      to: userEmail,
      subject: 'Informacje dotyczące współpracy ze Strefą Startu',
      html: replyMessage,
    });

    return res.status(200).json({ message: 'Email został wysłany pomyślnie' });

  } catch (error) {
    console.error('Błąd podczas wysyłania emaila:', error);
    return res.status(500).json({ error: `Nie udało się wysłać emaila: ${error.message}` });
  }
}