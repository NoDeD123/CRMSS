import { createSmtpTransport, getSmtpMailFrom } from '../../lib/smtp.js';

export default async function handler(req, res) {
  // Akceptujemy tylko metodę POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Metoda niedozwolona' });
  }

  // Pobieramy dane z requesta
  const { fullName, phone, email, subject, message } = req.body;

  // Podstawowa walidacja - upewnij się, że wymagane pola są wypełnione
  if (!fullName || !email || !message) {
    return res.status(400).json({ message: 'Brakuje wymaganych pól' });
  }

  const transporter = createSmtpTransport();
  if (!transporter) {
    return res.status(503).json({
      message:
        'Serwer pocztowy nie jest skonfigurowany. Ustaw SMTP_HOST, SMTP_PORT, SMTP_USER i SMTP_PASS.',
    });
  }

  const from = getSmtpMailFrom('Strefa Startu');
  const notifyTo =
    process.env.EMAIL_RECEIVER ||
    process.env.SMTP_CONTACT_TO ||
    'kontakt@strefastartu.pl';

  try {
    // Przygotowanie opcji e-maila dla administratora
    const mailOptions = {
      from,
      replyTo: email,
      to: notifyTo,
      subject: `Nowa wiadomość z formularza kontaktowego: ${subject}`,
      text: `Imię i nazwisko: ${fullName}\nTelefon: ${phone}\nEmail: ${email}\nWiadomość: ${message}`,
    };

    // Wysyłka e-maila do administratora
    await transporter.sendMail(mailOptions);

    // Przygotowanie opcji e-maila potwierdzającego do użytkownika
    const userMailOptions = {
      from,
      to: email,
      subject: 'Dziękujemy za kontakt!',
      html: `
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; font-family: Arial, sans-serif; color: #333;">
          <h3 style="color: #2ecc71; margin-bottom: 15px;">Dziękujemy za kontakt!</h3>
          <p>Otrzymaliśmy Twoją wiadomość i niebawem się z Tobą skontaktujemy.</p>
          <p>Pozdrawiamy,</p>
          <p>Zespół Strefa Startu</p>
        </div>
      `
    };

    // Wysyłka e-maila potwierdzającego do użytkownika
    await transporter.sendMail(userMailOptions);

    return res.status(200).json({ message: 'Dziękujemy za kontakt! Wiadomość została wysłana pomyślnie.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Błąd serwera' });
  }
}
