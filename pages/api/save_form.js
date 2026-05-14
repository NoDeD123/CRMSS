import mysql from 'mysql2/promise';

// Konfiguracja bazy danych
const dbConfig = {
  host: 'strefastartu.pl',
  user: 'noded',
  password: 'farmerek1',
  database: 'strefastartu',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  let connection;
  
  try {
    // Połączenie z bazą danych
    connection = await mysql.createConnection(dbConfig);
    
    const {
      fullName,
      email,
      phone,
      age,
      topic,
      referralSource,
      referralCode,
      referralOther,
      acceptRODO,
      acceptPrivacy
    } = req.body;

    // Walidacja wymaganych pól
    if (!fullName || !email || !topic || !acceptRODO || !acceptPrivacy) {
      return res.status(400).json({ 
        message: 'Brakuje wymaganych pól' 
      });
    }

    // Sprawdzenie czy email już istnieje
    const [existingUser] = await connection.execute(
      'SELECT id FROM form_submissions WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({ 
        message: 'Użytkownik o tym adresie email już się zarejestrował' 
      });
    }

    // Wstawienie danych do bazy
    const [result] = await connection.execute(
      `INSERT INTO form_submissions 
       (full_name, email, phone, age, topic, referral_source, referral_code, referral_other, accept_rodo, accept_privacy) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        fullName,
        email,
        phone || null,
        age ? parseInt(age) : null,
        topic,
        referralSource || null,
        referralCode || null,
        referralOther || null,
        acceptRODO,
        acceptPrivacy
      ]
    );

    console.log('Formularz zapisany do bazy:', {
      id: result.insertId,
      email: email,
      fullName: fullName
    });

    res.status(200).json({ 
      message: 'Formularz został zapisany pomyślnie',
      id: result.insertId 
    });

  } catch (error) {
    console.error('Błąd podczas zapisywania do bazy:', error);
    
    // Opcjonalnie: zapisz błąd do tabeli form_errors
    if (connection) {
      try {
        await connection.execute(
          'INSERT INTO form_errors (form_data, error_message) VALUES (?, ?)',
          [JSON.stringify(req.body), error.message]
        );
      } catch (logError) {
        console.error('Błąd podczas logowania błędu:', logError);
      }
    }
    
    res.status(500).json({ 
      message: 'Wystąpił błąd podczas zapisywania formularza' 
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
