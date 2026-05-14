import mysql from 'mysql2/promise';
import * as XLSX from 'xlsx';

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

// Hasło do dostępu
const CHECK_PASSWORD = 'TRI2026!';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { password, ohpId } = req.body;

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
    
    let ohpPersons = [];
    let fileName = '';

    if (ohpId) {
      // Eksport konkretnego użytkownika OHP
      const [persons] = await connection.execute(
        `SELECT 
          id, first_name, last_name, email, phone, voivodeship, 
          affiliate_code, created_at
        FROM ohp_registrations 
        WHERE id = ?`,
        [ohpId]
      );

      if (persons.length === 0) {
        return res.status(404).json({ 
          success: false,
          message: 'Nie znaleziono osoby OHP' 
        });
      }

      ohpPersons = persons;
      fileName = `OHP_${persons[0].affiliate_code}_${new Date().toISOString().split('T')[0]}.xlsx`;
    } else {
      // Eksport wszystkich
      const [persons] = await connection.execute(
        `SELECT 
          id, first_name, last_name, email, phone, voivodeship, 
          affiliate_code, created_at
        FROM ohp_registrations 
        ORDER BY created_at DESC`
      );

      ohpPersons = persons;
      fileName = `OHP_Wszystkie_${new Date().toISOString().split('T')[0]}.xlsx`;
    }

    // Dla każdej osoby OHP pobierz formularze
    const ohpWithForms = await Promise.all(
      ohpPersons.map(async (ohpPerson) => {
        const affiliateCode = ohpPerson.affiliate_code;
        
        // Pobierz formularze
        const [formSubmissions] = await connection.execute(
          `SELECT 
            id, full_name, email, phone, age, 
            referral_code, referral_source, topic, created_at
          FROM form_submissions 
          WHERE referral_code = ?
          ORDER BY created_at DESC`,
          [affiliateCode]
        );

        // Sprawdź czy są beneficjentami
        const formsWithStatus = await Promise.all(
          (formSubmissions || []).map(async (submission) => {
            const normalizedCode = affiliateCode.trim().toUpperCase();
            let isBeneficiary = false;

            try {
              const [beneficiaryCheck] = await connection.execute(
                `SELECT id 
                 FROM beneficiaries 
                 WHERE UPPER(TRIM(COALESCE(affiliated_by, ''))) = ? 
                 OR UPPER(TRIM(COALESCE(affilated_by, ''))) = ?
                 LIMIT 1`,
                [normalizedCode, normalizedCode]
              );
              isBeneficiary = beneficiaryCheck.length > 0;
            } catch (err) {
              console.error('Błąd sprawdzania beneficjenta:', err);
            }

            return {
              ...submission,
              isBeneficiary: isBeneficiary ? 'Tak' : 'Nie'
            };
          })
        );

        return {
          ...ohpPerson,
          forms: formsWithStatus || []
        };
      })
    );

    // Przygotuj dane do Excela
    const excelData = [];

    // Nagłówki główne
    excelData.push(['LISTA OSÓB OHP I WYSŁANYCH FORMULARZY']);
    excelData.push([]);

    // Dla każdej osoby OHP
    ohpWithForms.forEach((ohpPerson, index) => {
      // Nagłówek osoby OHP
      excelData.push([`Osoba OHP ${index + 1}`]);
      excelData.push(['Imię', ohpPerson.first_name]);
      excelData.push(['Nazwisko', ohpPerson.last_name]);
      excelData.push(['Email', ohpPerson.email]);
      excelData.push(['Telefon', ohpPerson.phone || '']);
      excelData.push(['Województwo', ohpPerson.voivodeship || '']);
      excelData.push(['Kod afiliacyjny', ohpPerson.affiliate_code]);
      excelData.push(['Data rejestracji', formatDate(ohpPerson.created_at)]);
      excelData.push([]);

      // Nagłówki tabeli formularzy
      if (ohpPerson.forms.length > 0) {
        excelData.push(['Wysłane formularze:']);
        excelData.push([
          'Imię i nazwisko',
          'Email',
          'Telefon',
          'Wiek',
          'Temat zgłoszenia',
          'Czy beneficjent?',
          'Data wypełnienia'
        ]);

        // Dane formularzy
        ohpPerson.forms.forEach((form) => {
          excelData.push([
            form.full_name || '',
            form.email || '',
            form.phone || '',
            form.age || '',
            form.topic || '',
            form.isBeneficiary || 'Nie',
            formatDate(form.created_at)
          ]);
        });
      } else {
        excelData.push(['Brak wysłanych formularzy']);
      }

      excelData.push([]);
      excelData.push([]);
    });

    // Utwórz workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(excelData);

    // Ustaw szerokość kolumn
    ws['!cols'] = [
      { wch: 20 }, // Kolumna A
      { wch: 30 }, // Kolumna B
      { wch: 15 }, // Kolumna C
      { wch: 10 }, // Kolumna D
      { wch: 25 }, // Kolumna E
      { wch: 15 }, // Kolumna F
      { wch: 20 }  // Kolumna G
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'OHP i Formularze');

    // Generuj buffer
    const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    // Ustaw nagłówki odpowiedzi
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    
    // Wyślij plik
    res.send(excelBuffer);

  } catch (error) {
    console.error('Błąd podczas eksportu:', error);
    res.status(500).json({ 
      success: false,
      message: 'Wystąpił błąd podczas eksportu',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}
