import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';
import { generatePDF, FormData } from '../src/utils/pdfGenerator';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).end('Only POST allowed');
    return;
  }

  const formData = req.body as FormData;
  try {
    // 1) Generate the PDF
    const pdfDoc = await generatePDF(formData);
    const pdfBuffer = Buffer.from(await pdfDoc.output('arraybuffer'));

    // 2) Create SMTP transporter using your Gmail App Password
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });

    // 3) Send the email
    await transporter.sendMail({
      from: `"Puusti Bot" <${process.env.GMAIL_USER}>`,
      to: 'hellopuusti@gmail.com',
      subject: `New Puusti submission – ${formData.fullName}`,
      text: 'You have a new submission. See attached PDF.',
      attachments: [{
        filename: `puusti_${formData.fullName}.pdf`,
        content: pdfBuffer
      }]
    });

    res.status(200).json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: (e as Error).message });
  }
}