import {
  createSmtpTransport,
  getSmtpMailFrom,
  DEFAULT_FORM_NOTIFY_TO,
} from '../../lib/smtp.js';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { answers, firstName, lastName, email, phone, marketingConsent, gdprConsent } = req.body;

    const transporter = createSmtpTransport();
    if (!transporter) {
      return res.status(503).json({
        message:
          'Serwer pocztowy nie jest skonfigurowany. Ustaw SMTP_HOST, SMTP_PORT, SMTP_USER i SMTP_PASS.',
      });
    }

    // Treść wiadomości wysyłanej do administratora
    const adminMessage = `
Nowa wiadomość z formularza testu przedsiębiorczości:

Imię: ${firstName}
Nazwisko: ${lastName}
Email: ${email}
Telefon: ${phone}
Zgody: marketing: ${marketingConsent}, RODO: ${gdprConsent}

    `;

    // Treść wiadomości zwrotnej dla użytkownika (HTML)
    const replyMessage = `
<div style="background: #f8f9fa; padding: 25px; border-radius: 10px; border: 1px solid #e0e0e0; font-family: 'Arial', sans-serif; color: #333;">
    <h3 style="color: #2ecc71; font-size: 24px; margin-bottom: 15px;">🎉 Fantastycznie!!!!</h3>
    
    <div style="margin: 20px 0; line-height: 1.6;">
        <p>
            Dziękujemy za wypełnienie ankiety i zainteresowanie naszym 
            <span style="color: #3498db; font-weight: bold;">Projektem dla przyszłych przedsiębiorców!</span> 💼🔥
        </p>
        
        <p>
            Super, że chcesz działać – 
            <span style="color: #3498db; font-weight: bold;">pierwszy, najtrudniejszy krok już za Tobą!</span>
        </p>
        
        <p>
            Teraz nasza kolej! Koordynator skontaktuje się z Tobą najszybciej, jak to możliwe w celu omówienia możliwości, jakie daje Ci Strefa Startu.
        </p>
        
        <p>W międzyczasie zachęcamy Cię do zapoznania się z:</p>
        <ul>
            <li>
                📄 <a href="https://www.strefastartu.pl/regulamin.pdf" style="color: #e74c3c; text-decoration: none; font-weight: bold;" target="_blank">Regulaminem naszego projektu</a>
            </li>
            <li>
                🔒 <a href="https://www.strefastartu.pl/polityka.pdf" style="color: #e74c3c; text-decoration: none; font-weight: bold;" target="_blank">Zasadami przetwarzania danych osobowych</a>
            </li>
        </ul>
    </div>

    <div style="margin: 20px 0; line-height: 1.6;">
        <p>
            Jeśli będziesz miał pytania – 
            <span style="color: #3498db; font-weight: bold;">śmiało pisz</span>, chętnie wszystko wyjaśnimy. Jesteśmy dla Ciebie. Korzystaj!
        </p>
        <p style="font-size: 1.2em;">📩 💬 👍</p>
    </div>

    <div style="background: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107; margin-top: 25px; font-size: 14px;">
        <h4 style="color: #d35400; margin-top: 0;">🔐 ZASTRZEŻENIE POUFNOŚCI</h4>
        <p style="margin: 10px 0;">
            Niniejsza wiadomość oraz wszelkie załączone do niej pliki mogą zawierać informacje poufne i/lub prawnie chronione, przeznaczone wyłącznie do użytku przez adresata.
        </p>
        <p style="margin: 10px 0;">
            ⚠️ Jeżeli nie jesteś zamierzonym odbiorcą tej wiadomości, uprzejmie prosimy o niezwłoczne poinformowanie nadawcy, usunięcie wiadomości z systemu oraz powstrzymanie się od jakiegokolwiek rozpowszechniania, kopiowania lub wykorzystywania jej treści.
        </p>
    </div>

    <div style="margin-top: 20px; text-align: center; color: #7f8c8d;">
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p>Z poważaniem,<br>Zespół Strefa Startu 🌟</p>
    </div>
</div>
`;

    try {
      // Wysyłka wiadomości do administratora
      await transporter.sendMail({
        from: getSmtpMailFrom('Formularz Strefa Startu'),
        replyTo: email,
        to: DEFAULT_FORM_NOTIFY_TO,
        subject: 'Wiadomość z formularza testu przedsiębiorczości',
        text: adminMessage,
      });

      // Wysyłka wiadomości zwrotnej do osoby, która wypełniła formularz
      await transporter.sendMail({
        from: getSmtpMailFrom('Strefa Startu'),
        to: email,
        subject: 'Dziękujemy za wypełnienie ankiety - Strefa Startu',
        html: replyMessage, // Użyj pola "html" zamiast "text" dla wiadomości zawierającej HTML
      });

      res.status(200).json({ message: 'Email wysłany pomyślnie!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Błąd wysyłania emaila' });
    }
  } else {
    res.status(405).json({ message: 'Metoda niedozwolona' });
  }
}
