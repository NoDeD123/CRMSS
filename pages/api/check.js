import mysql from 'mysql2/promise';

// Konfiguracja bazy danych strefastartu (wszystkie tabele są tutaj)
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

// Hasło do dostępu do strony /check
const CHECK_PASSWORD = 'TRI2026!';

export default async function handler(req, res) {
  if (req.method === 'POST' && req.body.action === 'login') {
    // Logowanie
    const { password } = req.body;
    
    if (password === CHECK_PASSWORD) {
      return res.status(200).json({ 
        success: true,
        message: 'Logowanie pomyślne' 
      });
    } else {
      return res.status(401).json({ 
        success: false,
        message: 'Nieprawidłowe hasło' 
      });
    }
  }

  if (req.method === 'POST' && req.body.action === 'getAllOHP') {
    // Pobierz wszystkie osoby OHP z ich beneficjentami
    const { password } = req.body;

    // Sprawdź hasło
    if (password !== CHECK_PASSWORD) {
      return res.status(401).json({ 
        success: false,
        message: 'Nieprawidłowe hasło' 
      });
    }

    let connection;
    
    try {
      connection = await mysql.createConnection(dbConfig);
      
      // Pobierz wszystkie osoby OHP
      const [ohpPersons] = await connection.execute(
        `SELECT 
          id, first_name, last_name, email, phone, voivodeship, 
          affiliate_code, created_at
        FROM ohp_registrations 
        ORDER BY created_at DESC`
      );

      // Tabela beneficiaries jest w tej samej bazie co ohp_registrations
      // Używamy tego samego połączenia
      console.log('[CHECK] Używam tego samego połączenia do tabeli beneficiaries');
      
      // Test zapytania do beneficiaries
      try {
        const [testQuery] = await connection.execute('SELECT COUNT(*) as count FROM beneficiaries LIMIT 1');
        console.log('[CHECK] Test zapytania do beneficiaries:', testQuery);
      } catch (err) {
        console.error('[CHECK] Błąd testowego zapytania do beneficiaries:', err.message);
      }

      // Dla każdej osoby OHP znajdź beneficjentów w form_submissions
      const ohpWithBeneficiaries = await Promise.all(
        ohpPersons.map(async (ohpPerson) => {
          const affiliateCode = ohpPerson.affiliate_code;
          
          // Szukaj w form_submissions gdzie referral_code odpowiada kodowi afiliacyjnemu OHP
          const [formSubmissions] = await connection.execute(
            `SELECT 
              id, full_name, email, phone, age, 
              referral_code, referral_source, created_at
            FROM form_submissions 
            WHERE referral_code = ?
            ORDER BY created_at DESC`,
            [affiliateCode]
          );

          // Dla każdego zgłoszenia sprawdź czy jest beneficjentem
          const beneficiariesWithStatus = await Promise.all(
            (formSubmissions || []).map(async (submission) => {
              let isBeneficiary = false;
              let debugInfo = {};

              try {
                // Sprawdź tylko czy istnieje beneficjent z kodem afiliacyjnym OHP
                // Jeśli jest beneficjent z tym kodem, to zgłoszenie z tym kodem jest od beneficjenta
                const normalizedCode = affiliateCode.trim().toUpperCase();
                debugInfo.affiliateCode = affiliateCode;
                debugInfo.normalizedCode = normalizedCode;
                
                console.log(`[CHECK] Sprawdzanie czy istnieje beneficjent z kodem: ${normalizedCode}`);
                
                // Sprawdź czy istnieje jakikolwiek beneficjent z tym kodem
                const [beneficiaryCheck] = await connection.execute(
                  `SELECT id, email, first_name, last_name, affiliated_by, affilated_by 
                   FROM beneficiaries 
                   WHERE UPPER(TRIM(COALESCE(affiliated_by, ''))) = ? 
                   OR UPPER(TRIM(COALESCE(affilated_by, ''))) = ?
                   LIMIT 1`,
                  [normalizedCode, normalizedCode]
                );
                
                console.log(`[CHECK] Wynik sprawdzania kodu ${normalizedCode}:`, beneficiaryCheck.length, beneficiaryCheck);
                debugInfo.beneficiaryFound = beneficiaryCheck.length;
                
                // Jeśli jest jakikolwiek beneficjent z tym kodem, to zgłoszenie jest od beneficjenta
                isBeneficiary = beneficiaryCheck.length > 0;
                debugInfo.isBeneficiary = isBeneficiary;
                console.log(`[CHECK] Finalny wynik dla zgłoszenia z kodem ${normalizedCode}:`, isBeneficiary);
              } catch (err) {
                console.error('[CHECK] Błąd podczas sprawdzania beneficjenta:', err);
                console.error('[CHECK] Submission:', JSON.stringify(submission, null, 2));
                console.error('[CHECK] Affiliate code:', affiliateCode);
                debugInfo.error = err.message;
              }

              return {
                ...submission,
                isBeneficiary: isBeneficiary,
                debugInfo: process.env.NODE_ENV === 'development' ? debugInfo : undefined
              };
            })
          );

          return {
            ...ohpPerson,
            beneficiaries: beneficiariesWithStatus
          };
        })
      );


      res.status(200).json({ 
        success: true,
        ohpPersons: ohpWithBeneficiaries
      });

    } catch (error) {
      console.error('Błąd podczas pobierania danych OHP:', error);
      res.status(500).json({ 
        success: false,
        message: 'Wystąpił błąd podczas pobierania danych',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    } finally {
      if (connection) {
        await connection.end();
      }
    }
  }

  if (req.method === 'POST' && req.body.action === 'search') {
    // Wyszukiwanie po kodzie polecającym
    const { password, referralCode } = req.body;

    // Sprawdź hasło
    if (password !== CHECK_PASSWORD) {
      return res.status(401).json({ 
        success: false,
        message: 'Nieprawidłowe hasło' 
      });
    }

    if (!referralCode || !referralCode.trim()) {
      return res.status(400).json({ 
        success: false,
        message: 'Podaj kod polecający' 
      });
    }

    let connection;
    
    try {
      connection = await mysql.createConnection(dbConfig);
      
      const code = referralCode.trim().toUpperCase();

      // Szukaj osoby po unique_id lub own_affiliation
      // Sprawdzamy obie możliwe nazwy kolumny dla affiliated_by
      let person;
      try {
        [person] = await connection.execute(
          `SELECT 
            id, unique_id, first_name, last_name, email, phone_number, 
            own_affiliation, affiliated_by, created_at
          FROM beneficiaries 
          WHERE unique_id = ? OR own_affiliation = ? 
          LIMIT 1`,
          [code, code]
        );
      } catch (err) {
        // Jeśli nie działa, spróbuj z affilated_by (bez 'i')
        [person] = await connection.execute(
          `SELECT 
            id, unique_id, first_name, last_name, email, phone_number, 
            own_affiliation, affilated_by as affiliated_by, created_at
          FROM beneficiaries 
          WHERE unique_id = ? OR own_affiliation = ? 
          LIMIT 1`,
          [code, code]
        );
      }

      if (person.length === 0) {
        return res.status(404).json({ 
          success: false,
          message: 'Nie znaleziono osoby z podanym kodem polecającym' 
        });
      }

      const personData = person[0];
      const searchCode = personData.unique_id || personData.own_affiliation;

      // Znajdź wszystkich beneficjentów zarejestrowanych pod tą osobą
      // Sprawdzamy obie możliwe nazwy kolumny: affiliated_by i affilated_by
      let beneficiaries = [];
      try {
        // Próbuj najpierw z affiliated_by
        [beneficiaries] = await connection.execute(
          `SELECT 
            id, unique_id, first_name, last_name, email, phone_number, 
            own_affiliation, affiliated_by, created_at
          FROM beneficiaries 
          WHERE affiliated_by = ? OR affiliated_by = ?
          ORDER BY created_at DESC`,
          [searchCode, personData.unique_id]
        );
      } catch (err) {
        // Jeśli nie działa, spróbuj z affilated_by (bez 'i')
        try {
          [beneficiaries] = await connection.execute(
            `SELECT 
              id, unique_id, first_name, last_name, email, phone_number, 
              own_affiliation, affilated_by as affiliated_by, created_at
            FROM beneficiaries 
            WHERE affilated_by = ? OR affilated_by = ?
            ORDER BY created_at DESC`,
            [searchCode, personData.unique_id]
          );
        } catch (err2) {
          console.error('Błąd podczas pobierania beneficjentów:', err2);
        }
      }

      res.status(200).json({ 
        success: true,
        person: personData,
        beneficiaries: beneficiaries || []
      });

    } catch (error) {
      console.error('Błąd podczas wyszukiwania:', error);
      res.status(500).json({ 
        success: false,
        message: 'Wystąpił błąd podczas wyszukiwania',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    } finally {
      if (connection) {
        await connection.end();
      }
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
