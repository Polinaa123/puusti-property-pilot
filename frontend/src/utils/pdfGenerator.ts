
import { jsPDF } from "jspdf";

export interface FormData {
  propertyType?: "rental" | "sale";
  
  // Common fields
  fullName: string;
  email: string;
  phoneNumber: string;
  location?: string;
  budget?: number[];
  selectedImprovements: string[];
  
  // Client specific
  listingLink?: string;
  listingTitle?: string;
  listingDescription?: string;
  roomCount?: string;
  propertySize?: string;
  yearBuilt?: string;
  propertyCondition?: string;
  targetMarket?: string;
  salePrice?: string;
  
  // Photos (File objects)
  photos: File[];
}

export async function generatePDF(formData: FormData): Promise<jsPDF> {
  const doc = new jsPDF({ unit: "pt" });
  let yPosition = 20;

  // Header
  doc.setFontSize(18).text("Puusti - Заявка клиента", 40, yPosition);
  yPosition += 30;

  // Contact Info
  doc.setFontSize(12)
     .text(`Имя: ${formData.fullName}`, 40, yPosition)
     .text(`Email: ${formData.email}`, 300, yPosition);
  yPosition += 20;
  doc.text(`Телефон: ${formData.phoneNumber}`, 40, yPosition);
  if (formData.location) {
    doc.text(`Местоположение: ${formData.location}`, 300, yPosition);
  }
  yPosition += 30;

  // Property Type & Budget
  if (formData.propertyType) {
    const typeText = formData.propertyType === 'rental' ? 'Краткосрочная аренда' : 'Продажа недвижимости';
    doc.text(`Тип: ${typeText}`, 40, yPosition);
  }
  if (formData.budget && formData.budget[0]) {
    doc.text(`Бюджет: €${formData.budget[0]}`, 300, yPosition);
  }
  yPosition += 30;

  // Property details for rental
  if (formData.propertyType === "rental") {
    doc.setFontSize(14).text("Детали аренды", 40, yPosition);
    yPosition += 20;

    if (formData.listingTitle) {
      doc.setFontSize(12).text(`Заголовок: ${formData.listingTitle}`, 40, yPosition);
      yPosition += 16;
    }
    if (formData.roomCount) {
      doc.text(`Комнаты: ${formData.roomCount}`, 40, yPosition);
      yPosition += 16;
    }
    if (formData.listingDescription) {
      doc.text("Описание объявления:", 40, yPosition);
      yPosition += 16;
      const lines = doc.splitTextToSize(formData.listingDescription, 500);
      doc.text(lines, 40, yPosition);
      yPosition += lines.length * 12 + 10;
    }
    yPosition += 10;
  }

  // Property details for sale
  if (formData.propertyType === "sale") {
    doc.setFontSize(14).text("Детали продажи", 40, yPosition);
    yPosition += 20;

    if (formData.propertySize) {
      doc.setFontSize(12).text(`Размер (кв.м): ${formData.propertySize}`, 40, yPosition);
      yPosition += 16;
    }
    if (formData.yearBuilt) {
      doc.text(`Год постройки: ${formData.yearBuilt}`, 40, yPosition);
      yPosition += 16;
    }
    if (formData.propertyCondition) {
      doc.text(`Состояние: ${formData.propertyCondition}`, 40, yPosition);
      yPosition += 16;
    }
    if (formData.salePrice) {
      doc.text(`Ожидаемая цена: €${formData.salePrice}`, 40, yPosition);
      yPosition += 16;
    }
    yPosition += 10;
  }

  // Requested Services
  if (formData.selectedImprovements.length > 0) {
    doc.setFontSize(14).text("Запрошенные услуги:", 40, yPosition);
    yPosition += 20;
    
    formData.selectedImprovements.forEach((service, index) => {
      doc.setFontSize(12).text(`• ${service}`, 40, yPosition);
      yPosition += 16;
    });
    yPosition += 20;
  }

  // Photos section
  if (formData.photos.length > 0) {
    const margin = 20;
    const spacing = 10;
    const pageW = doc.internal.pageSize.getWidth();
    let yPos = yPosition + 18;

    doc.setFontSize(14).text("Фотографии недвижимости:", 40, yPosition);
    yPos += 18;

    const cols = 3;
    const usableWidth = pageW - margin * 2 - spacing * (cols - 1);
    const cellW = usableWidth / cols;
    let rowMaxHeight = 0;

    for (let i = 0; i < formData.photos.length; i++) {
      // Page break if near bottom
      if (yPos > doc.internal.pageSize.getHeight() - 100) {
        doc.addPage();
        yPos = 40;
        doc.setFontSize(14).text("Фотографии (продолжение):", margin, yPos);
        yPos += 18;
      }

      // Read file as Data URL
      const imgData = await new Promise<string>((res, rej) => {
        const reader = new FileReader();
        reader.onload = () => res(reader.result as string);
        reader.onerror = () => rej(reader.error);
        reader.readAsDataURL(formData.photos[i]);
      });

      // Get natural image properties
      const props = doc.getImageProperties(imgData);

      // Convert px → pt (1px ≈ 0.75pt)
      const pxToPt = (px: number) => px * 0.75;
      let imgW = pxToPt(props.width);
      let imgH = pxToPt(props.height);

      if (imgW > cellW) {
        const ratio = cellW / imgW;
        imgW *= ratio;
        imgH *= ratio;
      }

      const col = i % cols;
      const x = margin + col * (cellW + spacing);

      // Draw image at calculated size
      doc.addImage(imgData, "JPEG", x, yPos, imgW, imgH);

      rowMaxHeight = Math.max(rowMaxHeight, imgH);

      if (col === cols - 1 || i === formData.photos.length - 1) {
        yPos += rowMaxHeight + spacing;
        rowMaxHeight = 0;
      }
    }
  }

  return doc;
}
