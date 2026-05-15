import { getPool } from '../../lib/db.js';

// Funkcja generująca unikalny 5-znakowy kod afiliacyjny
async function generateAffiliateCode(connection) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code;
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 100;

  while (!isUnique && attempts < maxAttempts) {
    // Generuj losowy 5-znakowy kod
    code = '';
    for (let i = 0; i < 5; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    // Sprawdź czy kod już istnieje w bazie
    const [existing] = await connection.execute(
      'SELECT id FROM ohp_registrations WHERE affiliate_code = ?',
      [code]
    );

    if (existing.length === 0) {
      isUnique = true;
    }
    attempts++;
  }

  if (!isUnique) {
    throw new Error('Nie udało się wygenerować unikalnego kodu afiliacyjnego');
  }

  return code;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const pool = getPool();
    
    const {
      firstName,
      lastName,
      email,
      phone,
      voivodeship
    } = req.body;

    // Walidacja wymaganych pól
    if (!firstName || !lastName || !email || !phone || !voivodeship) {
      return res.status(400).json({ 
        message: 'Wszystkie pola są wymagane' 
      });
    }

    // Walidacja emaila
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: 'Nieprawidłowy format adresu email' 
      });
    }

    // Sprawdzenie czy email już istnieje
    const [existingUser] = await pool.execute(
      'SELECT id FROM ohp_registrations WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({ 
        message: 'Użytkownik o tym adresie email już się zarejestrował' 
      });
    }

    // Generuj unikalny kod afiliacyjny
    const affiliateCode = await generateAffiliateCode(pool);

    // Wstawienie danych do bazy
    const [result] = await pool.execute(
      `INSERT INTO ohp_registrations 
       (first_name, last_name, email, phone, voivodeship, affiliate_code) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        firstName,
        lastName,
        email,
        phone,
        voivodeship,
        affiliateCode
      ]
    );

    console.log('Rejestracja OHP zapisana do bazy:', {
      id: result.insertId,
      email: email,
      affiliateCode: affiliateCode
    });

    res.status(200).json({ 
      message: 'Rejestracja została zapisana pomyślnie',
      id: result.insertId,
      affiliateCode: affiliateCode
    });

  } catch (error) {
    console.error('Błąd podczas zapisywania do bazy:', error);
    
    res.status(500).json({ 
      message: 'Wystąpił błąd podczas zapisywania rejestracji',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
