import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import { prisma } from '../../../../lib/prisma.js';
import { apiResponse } from '../../../../lib/apiResponse.js';
import { withAuth } from '../../../../lib/withAuth.js';

const FIELD_LABELS = {
  full_name: 'Imię i nazwisko',
  family_name: 'Nazwisko rodowe',
  birth_date: 'Data urodzenia',
  birth_place: 'Miejsce urodzenia',
  citizenship: 'Obywatelstwo',
  pesel_checkbox: 'Dokument: PESEL',
  passport_checkbox: 'Dokument: Paszport',
  id_number: 'Numer PESEL / dokumentu',
  tax_street: 'Ulica',
  tax_postal_code: 'Kod pocztowy',
  tax_post_office: 'Poczta',
  bank_account: 'Numer konta bankowego',
  tax_office: 'Urząd skarbowy',
  nfz_branch: 'Oddział NFZ',
  employment_status: '1. Zatrudnienie',
  employment_from: '1. Okres zatrudnienia - od',
  employment_to: '1. Okres zatrudnienia - do',
  insurance_status: '2. Ubezpieczenie agencyjne',
  insurance_from: '2. Okres ubezpieczenia - od',
  insurance_to: '2. Okres ubezpieczenia - do',
  other_insurance: '3. Inne tytuły ubezpieczenia',
  other_insurance_title: '3. Tytuł ubezpieczenia',
  retirement_status: '4. Emerytura/renta',
  zus_decision: '4. Numer decyzji ZUS',
  zus_date: '4. Data decyzji ZUS',
  disability_cert: '5. Orzeczenie niepełnosprawności',
  disability_degree: '5. Stopień niepełnosprawności',
  student_status: '6. Uczeń/student',
  unemployment_status: '7. Osoba bezrobotna',
  voluntary_health: '8. Dobrowolne ubezpieczenie chorobowe',
  koszty_autorskie: '9. Koszty autorskie',
  limit_kosztow: '9. Limit kosztów autorskich',
  wartosc_kosztow: '9. Dotychczas zastosowano',
  data_processing_consent: '10. Zgoda na przetwarzanie danych'
};

function normalizeValue(value) {
  if (typeof value === 'boolean') return value ? 'Tak' : 'Nie';
  if (value === null || value === undefined || value === '') return '';
  return String(value);
}

function safeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ł/g, 'l')
    .replace(/Ł/g, 'L');
}

function pickFirstExisting(paths) {
  for (const p of paths) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json(apiResponse(null, 'Method not allowed'));
  }

  try {
    const userId = req.user.userId;
    const { formData = {}, requestNumber } = req.body || {};

    const now = new Date();
    const fileName = `oswiadczenie_wyplata_${now.getTime()}.pdf`;
    const storageDir = path.join(process.cwd(), 'storage', 'uploads', 'documents', userId);
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }
    const physicalPath = path.join(storageDir, fileName);
    const fileUrl = `/api/files/documents/${userId}/${fileName}`;

    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const fileStream = fs.createWriteStream(physicalPath);
    doc.pipe(fileStream);

    const regularFontPath = pickFirstExisting([
      path.join(process.cwd(), 'public', 'fonts', 'DejaVuSans.ttf'),
      'C:\\Windows\\Fonts\\arial.ttf',
      '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
      '/usr/share/fonts/dejavu/DejaVuSans.ttf'
    ]);
    const boldFontPath = pickFirstExisting([
      path.join(process.cwd(), 'public', 'fonts', 'DejaVuSans-Bold.ttf'),
      'C:\\Windows\\Fonts\\arialbd.ttf',
      '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
      '/usr/share/fonts/dejavu/DejaVuSans-Bold.ttf'
    ]);

    const useUnicodeFont = Boolean(regularFontPath && boldFontPath);
    if (useUnicodeFont) {
      doc.registerFont('pdfRegular', regularFontPath);
      doc.registerFont('pdfBold', boldFontPath);
    }
    const textOut = (value) => (useUnicodeFont ? String(value || '') : safeText(value));
    const regularFont = useUnicodeFont ? 'pdfRegular' : 'Helvetica';
    const boldFont = useUnicodeFont ? 'pdfBold' : 'Helvetica-Bold';

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=${fileName}`);
    doc.pipe(res);

    doc.fontSize(16).font(boldFont).text(textOut('Formularz danych osobowych oraz oświadczenie'));
    doc.moveDown(0.3);
    doc.fontSize(10).font(regularFont);
    doc.text(textOut(`Data wygenerowania: ${now.toLocaleString('pl-PL')}`));
    if (requestNumber) {
      doc.text(textOut(`Numer wniosku: ${requestNumber}`));
    }
    doc.moveDown(1);

    doc.fontSize(12).font(boldFont).text(textOut('Wypełnione dane:'));
    doc.moveDown(0.5);

    const entries = Object.entries(formData).filter(([, value]) => normalizeValue(value) !== '');
    entries.forEach(([key, value]) => {
      const label = FIELD_LABELS[key] || key;
      const line = `${label}: ${normalizeValue(value)}`;
      doc.font(regularFont).fontSize(10).text(textOut(line), {
        width: 500
      });
      doc.moveDown(0.2);
    });

    doc.moveDown(1.2);
    doc.font(boldFont).fontSize(11).text(textOut('Podpis osoby składającej oświadczenie:'));
    doc.moveDown(1.5);
    doc.moveTo(70, doc.y).lineTo(300, doc.y).stroke();
    doc.moveDown(0.2);
    doc.font(regularFont).fontSize(9).text(textOut('Data i czytelny podpis'));

    doc.end();

    await new Promise((resolve, reject) => {
      fileStream.on('finish', resolve);
      fileStream.on('error', reject);
    });

    const fileStats = fs.statSync(physicalPath);
    await prisma.document.create({
      data: {
        originalName: fileName,
        fileUrl,
        sizeBytes: fileStats.size,
        userId
      }
    });
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      return res.status(500).json(apiResponse(null, 'Błąd generowania PDF'));
    }
    res.end();
  }
}

export default withAuth(handler, ['USER', 'ADMIN', 'COORDINATOR', 'FREELANCER']);
