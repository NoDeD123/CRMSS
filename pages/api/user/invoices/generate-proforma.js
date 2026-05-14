import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';
import { prisma } from '../../../../lib/prisma.js';
import { apiResponse } from '../../../../lib/apiResponse.js';
import { errorHandler } from '../../../../lib/errorHandler.js';
import { withAuth } from '../../../../lib/withAuth.js';
import {
  buildFullEuVatId,
  normalizeNationalVatPart,
  validateNationalVatPart,
  EU_VAT_ISO_CODES
} from '../../../../lib/euVat.js';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json(apiResponse(null, 'Method not allowed'));
  }

  try {
    const {
      items,
      buyerName,
      buyerVatCountryCode,
      buyerVatNationalNumber,
      buyerEmail,
      buyerStreet,
      buyerZip,
      buyerCity,
      paymentTermDays,
      freelancerCopyrightTransfer,
      freelancerManualClientGrossPln,
      declaredInvoiceGrossPln
    } = req.body;

    const declaredClientGrossPln =
      declaredInvoiceGrossPln != null ? declaredInvoiceGrossPln : freelancerManualClientGrossPln;
    const userId = req.user.userId;

    const userRow = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        bankAccount: true,
        beneficiaryNumber: true,
        companyName: true,
        firstName: true,
        lastName: true
      }
    });
    const bankAccount = userRow?.bankAccount || 'Brak konta na profilu beneficjenta';

    const calcDueDate = new Date();
    calcDueDate.setDate(calcDueDate.getDate() + (paymentTermDays || 7));
    const termStr = calcDueDate.toLocaleDateString('pl-PL');

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json(apiResponse(null, 'No items provided'));
    }

    // Helper to sanitize diacritics for pdfkit standard fonts
    const removeDiacritics = (str) => {
      if (!str) return '';
      return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l').replace(/Ł/g, 'L');
    };

    const safeBuyerName = removeDiacritics(buyerName);
    const safeBuyerStreet = removeDiacritics(buyerStreet);
    const safeBuyerCity = removeDiacritics(buyerCity);
    const safeBuyerEmail = buyerEmail?.trim() || '';
    const vatIso = String(buyerVatCountryCode || '').toUpperCase();
    if (!EU_VAT_ISO_CODES.has(vatIso)) {
      return res.status(400).json(apiResponse(null, 'Wybierz kraj VAT z listy UE.'));
    }
    const nationalNorm = normalizeNationalVatPart(vatIso, buyerVatNationalNumber);
    const vatCheck = validateNationalVatPart(vatIso, nationalNorm);
    if (!vatCheck.ok) {
      return res.status(400).json(apiResponse(null, vatCheck.error));
    }
    const normalizedBuyerVatId = buildFullEuVatId(vatIso, nationalNorm);
    const safeUserCompanyName = removeDiacritics(userRow?.companyName) || 'Brak nazwy firmy';
    const freelancerPersonName = removeDiacritics(
      [userRow?.firstName, userRow?.lastName].filter(Boolean).join(' ').trim()
    );
    const sellerSubline =
      req.user.role === 'FREELANCER'
        ? freelancerPersonName || 'Freelancer'
        : safeUserCompanyName;

    // Stale zdefiniowane dane fundacji (Sprzedawca)
    const sellerDetails = {
      name: removeDiacritics('Fundacja Strefa Startu'),
      street: removeDiacritics('Ul. Wschodnia 1A'),
      zip: '99-300',
      city: removeDiacritics('Kutno'),
      nip: '7752676034'
    };

    // Strict Input Validation & Sanitation for calculation
    const cleanItems = items.map(item => {
      const price = parseFloat(item.price);
      const quantity = parseInt(item.quantity, 10);
      const vat = 23;
      const safeName = removeDiacritics(item.name);

      if (isNaN(price) || isNaN(quantity) || isNaN(vat)) {
        throw new Error('Invalid numerical values in items');
      }

      return { ...item, name: safeName, price, quantity, vat };
    });

    if (declaredClientGrossPln != null && declaredClientGrossPln !== '') {
      const m = Number(declaredClientGrossPln);
      if (!Number.isFinite(m) || m <= 0) {
        return res.status(400).json(apiResponse(null, 'Nieprawidłowa zadeklarowana kwota brutto do zapłaty.'));
      }
    }

    const doc = new PDFDocument({ margin: 50 });

    // Set response headers for PDF download
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999);

    const beneficiaryCodeFromNumber = userRow?.beneficiaryNumber != null && userRow.beneficiaryNumber !== ''
      ? String(userRow.beneficiaryNumber)
      : null;
    const beneficiaryCodeFromEmail = userRow?.email?.startsWith('ldap_')
      ? userRow.email.replace('ldap_', '').trim()
      : null;
    /** Freelancer nie ma numeru beneficjenta — używamy stabilnego kodu z ID konta. */
    const beneficiaryCodeFreelancer =
      req.user.role === 'FREELANCER'
        ? `FL${userId.replace(/-/g, '').slice(0, 8).toUpperCase()}`
        : null;
    const beneficiaryCode =
      beneficiaryCodeFromNumber || beneficiaryCodeFromEmail || beneficiaryCodeFreelancer;

    if (!beneficiaryCode) {
      return res.status(400).json(apiResponse(null, 'Brak numeru beneficjenta na koncie. Uzupełnij go przed generowaniem faktury.'));
    }

    const mStr = currentMonth.toString().padStart(2, '0');
    const monthlyPrefix = `PRO/${beneficiaryCode}/${mStr}/`;

    const latestInvoice = await prisma.invoice.findFirst({
      where: {
        type: 'SALES',
        invoiceNumber: {
          startsWith: monthlyPrefix
        },
        issueDate: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    let nextSeq = 1;
    if (latestInvoice && latestInvoice.invoiceNumber) {
      const parts = latestInvoice.invoiceNumber.split('/');
      if (parts.length >= 4) {
        const lastSeq = parseInt(parts[3], 10);
        if (!isNaN(lastSeq)) {
          nextSeq = lastSeq + 1;
        }
      }
    }

    const invoiceNumber = `PRO/${beneficiaryCode}/${mStr}/${nextSeq}`;

    // Security Fix for Storage: Save file physically to standard location so it can be previewed later
    const safeFilename = `proforma_${invoiceNumber.replace(/\//g, '_')}.pdf`;
    const storageDir = path.join(process.cwd(), 'storage', 'uploads', 'invoices', userId);
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }
    const physicalPath = path.join(storageDir, safeFilename);
    const fileStream = fs.createWriteStream(physicalPath);
    doc.pipe(fileStream);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=${safeFilename}`);

    doc.pipe(res);

    // Wklejenie Logo fundacji jeśli istnieje
    const logoPath = path.join(process.cwd(), 'public', 'img', 'logo.png');
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 45, { width: 100 });
    }

    // Nagłówek faktury PROFORMA - Polski Standard
    doc.fillColor('#444444')
       .fontSize(20)
       .text('FAKTURA PROFORMA', 50, 50, { align: 'right' })
       .fontSize(10)
       .text(`Nr: ${invoiceNumber}`, { align: 'right' })
       .text(`Data wystawienia: ${new Date().toLocaleDateString('pl-PL')}`, { align: 'right' })
       .moveDown();

    // Dane Sprzedawcy i Nabywcy
    doc.text('Sprzedawca:', 50, 120)
       .font('Helvetica-Bold')
       .text(sellerDetails.name, 50, 135)
       .text(sellerSubline, 50, 150)
       .font('Helvetica')
       .text(`${sellerDetails.street}`, 50, 165)
       .text(`${sellerDetails.zip} ${sellerDetails.city}`, 50, 180)
       .text(`NIP: ${sellerDetails.nip}`, 50, 195);

    doc.text('Nabywca:', 300, 120)
       .font('Helvetica-Bold')
       .text(safeBuyerName || 'Brak danych nabywcy', 300, 135)
       .font('Helvetica')
       .text(safeBuyerStreet || '', 300, 150)
       .text(`${buyerZip || ''} ${safeBuyerCity || ''}`, 300, 165);

    doc.text(`NIP / VAT UE: ${normalizedBuyerVatId}`, 300, 180)
       .text(`E-mail: ${safeBuyerEmail || 'Brak'}`, 300, 195);

    doc
       .moveDown(3);

    // Tabela przedmiotów (pozbawiona znaków diakrytycznych)
    const tableTop = 230;
    doc.font('Helvetica-Bold');
    doc.text('Lp.', 50, tableTop)
       .text('Nazwa', 90, tableTop)
       .text('Ilosc', 280, tableTop)
       .text('Cena jedn.', 330, tableTop)
       .text('VAT', 400, tableTop)
       .text('Wartosc', 450, tableTop);

    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

    doc.font('Helvetica');
    let y = tableTop + 25;
    let totalNet = 0;
    let totalGross = 0;

    cleanItems.forEach((item, i) => {
      const net = item.price * item.quantity;
      const gross = net + (net * (item.vat / 100));

      totalNet += net;
      totalGross += gross;

      doc.text((i + 1).toString(), 50, y)
         .text(item.name || 'Przedmiot', 90, y)
         .text(item.quantity.toString(), 280, y)
         .text(item.price.toString() + ' PLN', 330, y)
         .text(item.vat.toString() + '%', 400, y)
         .text(gross.toFixed(2) + ' PLN', 450, y);

      y += 20;
    });

    doc.moveTo(50, y).lineTo(550, y).stroke();

    // Podsumowanie kwot (prawa strona)
    const summaryTop = y + 35;
    doc.font('Helvetica-Bold')
       .text('Razem Netto:', 350, summaryTop)
       .text(`${totalNet.toFixed(2)} PLN`, 450, summaryTop)
       .text('Razem Brutto:', 350, summaryTop + 25)
       .text(`${totalGross.toFixed(2)} PLN`, 450, summaryTop + 25);

    if (
      declaredClientGrossPln != null &&
      declaredClientGrossPln !== '' &&
      Number.isFinite(Number(declaredClientGrossPln)) &&
      Math.abs(Number(declaredClientGrossPln) - totalGross) >= 0.01
    ) {
      const declared = Number(declaredClientGrossPln);
      doc.font('Helvetica')
        .fontSize(8)
        .fillColor('#555555')
        .text(
          `Uwaga: Zadeklarowana kwota brutto od klienta: ${declared.toFixed(2)} PLN (suma pozycji: ${totalGross.toFixed(2)} PLN).`,
          350,
          summaryTop + 48,
          { width: 200, align: 'right' }
        )
        .fillColor('#000000')
        .fontSize(10);
    }

    // Parametry rozliczeniowe (niżej po lewej)
    const settlementTop = summaryTop + 85;
    const transferTitle = `Faktura Proforma ${invoiceNumber}`;

    doc.font('Helvetica-Bold')
       .text('Sposob platnosci:', 50, settlementTop)
       .font('Helvetica')
       .text('Przelew', 160, settlementTop)
       .font('Helvetica-Bold')
       .text('Termin platnosci:', 50, settlementTop + 20)
       .font('Helvetica')
       .text(`${paymentTermDays || 7} dni (${termStr})`, 160, settlementTop + 20)
       .font('Helvetica-Bold')
       .text('Numer konta:', 50, settlementTop + 40)
       .font('Helvetica')
       .text(bankAccount, 160, settlementTop + 40)
       .font('Helvetica-Bold')
       .text('Tytul przelewu:', 50, settlementTop + 60)
       .font('Helvetica')
       .text(transferTitle, 160, settlementTop + 60);

    doc.end();

    let invoiceDescription =
      req.user.role === 'FREELANCER'
        ? 'Wygenerowano proforma z panelu freelancera'
        : 'Wygenerowano PRO-FORMA z panelu beneficjenta';

    if (req.user.role === 'FREELANCER') {
      const parts = [];
      if (typeof freelancerCopyrightTransfer === 'boolean') {
        parts.push(
          freelancerCopyrightTransfer
            ? 'prawa autorskie: tak'
            : 'prawa autorskie: nie'
        );
      }
      if (parts.length) {
        invoiceDescription += ` — ${parts.join('; ')}`;
      }
    }

    if (
      declaredClientGrossPln != null &&
      declaredClientGrossPln !== '' &&
      Number.isFinite(Number(declaredClientGrossPln)) &&
      Math.abs(Number(declaredClientGrossPln) - totalGross) >= 0.01
    ) {
      const extra = `brutto do zapłaty (wpis): ${Number(declaredClientGrossPln).toFixed(2)} PLN vs suma pozycji ${totalGross.toFixed(2)} PLN`;
      invoiceDescription += invoiceDescription.includes('—') ? `; ${extra}` : ` — ${extra}`;
    }

    // Create DB entry mimicking Proforma generated state
    await prisma.invoice.create({
      data: {
        invoiceNumber,
        type: 'SALES',
        status: 'PENDING',
        issueDate: new Date(),
        netAmount: totalNet,
        grossAmount: totalGross,
        vatAmount: totalGross - totalNet,
        sellerName:
          req.user.role === 'FREELANCER'
            ? `Fundacja Strefa Startu / ${[userRow?.firstName, userRow?.lastName].filter(Boolean).join(' ') || 'Freelancer'}`
            : `Fundacja Strefa Startu / ${userRow?.companyName || 'Brak nazwy firmy'}`,
        buyerName: buyerName || 'Brak',
        buyerNip: normalizedBuyerVatId || null,
        buyerEmail: safeBuyerEmail || null,
        description: invoiceDescription,
        fileUrl: `/api/files/invoices/${userId}/${safeFilename}`,
        userId
      }
    });

    // Pamiętaj: Ze względu na strumieniowanie pliku nie zwracamy standardowego formatu apiResponse JSON,
    // tylko od razu bufory na klienta. Błędy łapiemy na początku.

  } catch (error) {
    console.error(error);
    // Cannot send JSON if headers were already set for PDF stream, so check if they were sent
    if (!res.headersSent) {
      return errorHandler(error, res);
    }
    res.end();
  }
}

export default withAuth(handler, ['USER', 'ADMIN', 'COORDINATOR', 'FREELANCER']);
