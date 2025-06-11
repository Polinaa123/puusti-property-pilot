// functions/index.js

const functions  = require('firebase-functions');
const nodemailer = require('nodemailer');
const { jsPDF }  = require('jspdf');
const { generatePDF } = require('./pdfGenerator'); // ваш генератор PDF

// Gmail App Password из firebase config
const GMAIL_USER = functions.config().gmail.email;
const GMAIL_PASS = functions.config().gmail.pass;

// транспортер Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS
  }
});

/**
 * HTTP-функция sendPuustiSubmission
 * Ожидает POST с JSON { propertyType, fullName, email, …, photos: […], … }
 * Генерирует PDF, прикладывает к письму и отправляет вам на почту.
 */
exports.sendPuustiSubmission = functions.https.onRequest(async (req, res) => {
  // Только POST
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const formData = req.body;

    // 1) Сгенерировать PDF
    const pdfDoc = await generatePDF(formData);
    const pdfBuffer = Buffer.from(await pdfDoc.output('arraybuffer'));

    // 2) Отправить email
    await transporter.sendMail({
      from: `"Puusti Bot" <${GMAIL_USER}>`,
      to:   'hellopuusti@gmail.com',
      subject: `Новая заявка от ${formData.fullName}`,
      text:    `Получена новая заявка. Смотрите PDF во вложении.`,
      attachments: [
        {
          filename: `puusti_${formData.fullName.replace(/\s+/g, '_')}.pdf`,
          content:  pdfBuffer
        }
      ]
    });

    // 3) Ответ клиенту
    return res.json({ success: true });
  } catch (err) {
    console.error('Error sending email:', err);
    return res.status(500).send(err.toString());
  }
});
