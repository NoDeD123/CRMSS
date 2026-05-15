import { getPool } from '../../lib/db.js';

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

    try {
      const pool = getPool();
      
      // Pobierz wszystkie osoby OHP
      const [ohpPersons] = await pool.execute(
        `SELECT 
          id, first_name, last_name, email, phone, voivodeship, 
          affiliate_code, created_at
        FROM ohp_registrations 
        ORDER BY created_at DESC`
      );

      // Pobierz wszystkie zgłoszenia naraz
      const [allSubmissions] = await pool.execute(
        `SELECT
          id, full_name, email, phone, age,
          referral_code, referral_source, created_at
        FROM form_submissions
        ORDER BY created_at DESC`
      );

      // Pobierz wszystkie afiliacje z beneficiaries
      const [allBeneficiaryCodes] = await pool.execute(
        `SELECT DISTINCT
          UPPER(TRIM(COALESCE(affiliated_by, ''))) as code1,
          UPPER(TRIM(COALESCE(affilated_by, ''))) as code2
         FROM beneficiaries`
      );

      const beneficiaryCodeSet = new Set();
      allBeneficiaryCodes.forEach(row => {
        if (row.code1) beneficiaryCodeSet.add(row.code1);
        if (row.code2) beneficiaryCodeSet.add(row.code2);
      });

      const ohpWithBeneficiaries = ohpPersons.map(ohpPerson => {
        const affiliateCode = ohpPerson.affiliate_code;
        const normalizedCode = affiliateCode.trim().toUpperCase();

        const formSubmissions = allSubmissions.filter(s => s.referral_code === affiliateCode);

        const isBeneficiary = beneficiaryCodeSet.has(normalizedCode);

        const beneficiariesWithStatus = formSubmissions.map(submission => ({
          ...submission,
          isBeneficiary: isBeneficiary,
          debugInfo: process.env.NODE_ENV === 'development' ? {
            affiliateCode,
            normalizedCode,
            isBeneficiary
          } : undefined
        }));

        return {
          ...ohpPerson,
          beneficiaries: beneficiariesWithStatus
        };
      });

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

    try {
      const pool = getPool();
      
      const code = referralCode.trim().toUpperCase();

      let person;
      try {
        [person] = await pool.execute(
          `SELECT 
            id, unique_id, first_name, last_name, email, phone_number, 
            own_affiliation, affiliated_by, created_at
          FROM beneficiaries 
          WHERE unique_id = ? OR own_affiliation = ? 
          LIMIT 1`,
          [code, code]
        );
      } catch (err) {
        [person] = await pool.execute(
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

      let beneficiaries = [];
      try {
        [beneficiaries] = await pool.execute(
          `SELECT 
            id, unique_id, first_name, last_name, email, phone_number, 
            own_affiliation, affiliated_by, created_at
          FROM beneficiaries 
          WHERE affiliated_by = ? OR affiliated_by = ?
          ORDER BY created_at DESC`,
          [searchCode, personData.unique_id]
        );
      } catch (err) {
        try {
          [beneficiaries] = await pool.execute(
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
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
