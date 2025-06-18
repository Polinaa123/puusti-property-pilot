import { jsPDF } from "jspdf";

export interface FormData {
  propertyType: "rental" | "sale";

  // Common fields
  fullName: string;
  email: string;
  phoneNumber: string;
  location: string;
  budget: number[];
  selectedImprovements: string[];
  listingLink: string;

  // Rental-specific
  listingTitle?: string;
  listingDescription?: string;
  roomCount?: string;
  description?: string;
  seasons?: string;
  audience?: string;
  customers?: string;
  occupancyDays?: number[];
  adDescription?: string;
  adTitle?: string;
  interiorDesignNotes?: string;

  // Sale-specific
  saleDescription?: string;
  propertyAge?: string;
  propertySize?: string;
  rooms?: string;
  targetBuyers?: string;
  sellingReason?: string;
  marketingGoals?: string;

  // Photos (File objects)
  photos: File[];
}

/**
 * Generates a PDF from the given form data.
 * Includes all fields and embeds photos at their natural size (clamped to page width).
 */
export async function generatePDF(formData: FormData): Promise<jsPDF> {
  const doc = new jsPDF({ unit: "pt" });
  let yPosition = 20;

  // Header
  doc.setFontSize(18).text("Puusti Submission", 40, yPosition);
  yPosition += 30;

  // Contact Info
  doc.setFontSize(12)
     .text(`Name: ${formData.fullName}`, 40, yPosition)
     .text(`Email: ${formData.email}`, 300, yPosition);
  yPosition += 20;
  doc.text(`Phone: ${formData.phoneNumber}`, 40, yPosition)
     .text(`Location: ${formData.location}`, 300, yPosition);
  yPosition += 30;

  // Property Type & Budget
  doc.text(`Type: ${formData.propertyType}`, 40, yPosition)
     .text(`Budget: €${formData.budget[0]}`, 300, yPosition);
  yPosition += 30;

  // Rental-specific details
  if (formData.propertyType === "rental") {
    doc.setFontSize(12).text("Rental Details", 40, yPosition);
    yPosition += 20;

    if (formData.listingTitle) {
      doc.setFontSize(12).text(`Title: ${formData.listingTitle}`, 40, yPosition);
      yPosition += 16;
    }
    if (formData.roomCount) {
      doc.text(`Rooms: ${formData.roomCount}`, 40, yPosition);
      yPosition += 16;
    }
    if (formData.listingDescription) {
      doc.text("Listing Description:", 40, yPosition);
      yPosition += 16;
      const lines = doc.splitTextToSize(formData.listingDescription, 500);
      doc.text(lines, 40, yPosition);
      yPosition += lines.length * 7 + 10;
    }
    if (formData.description) {
      doc.text(`Owner Notes: ${formData.description}`, 40, yPosition);
      yPosition += 16;
    }
    if (formData.seasons) {
      doc.text(`Seasons: ${formData.seasons}`, 40, yPosition);
      yPosition += 16;
    }
    if (formData.audience) {
      doc.text(`Audience: ${formData.audience}`, 40, yPosition);
      yPosition += 16;
    }
    if (formData.customers) {
      doc.text(`Customers: ${formData.customers}`, 40, yPosition);
      yPosition += 16;
    }
    if (formData.occupancyDays) {
      doc.text(`Occupancy Days/yr: ${formData.occupancyDays[0]}`, 40, yPosition);
      yPosition += 16;
    }
    if (formData.adDescription) {
      doc.text("Current Ad Description:", 40, yPosition);
      yPosition += 16;
      const adLines = doc.splitTextToSize(formData.adDescription, 500);
      doc.text(adLines, 40, yPosition);
      yPosition += adLines.length * 7 + 10;
    }
    if (formData.adTitle) {
      doc.text(`Current Ad Title: ${formData.adTitle}`, 40, yPosition);
      yPosition += 16;
    }
    if (formData.interiorDesignNotes) {
      doc.text("Design Notes:", 40, yPosition);
      yPosition += 16;
      const notes = doc.splitTextToSize(formData.interiorDesignNotes, 500);
      doc.text(notes, 40, yPosition);
      yPosition += notes.length * 7 + 10;
    }

    yPosition += 10;
  }

  // Sale-specific details
  if (formData.propertyType === "sale") {
    doc.setFontSize(12).text("Sale Details", 40, yPosition);
    yPosition += 20;

    if (formData.saleDescription) {
      doc.setFontSize(12).text("Sale Description:", 40, yPosition);
      yPosition += 16;
      const sd = doc.splitTextToSize(formData.saleDescription, 500);
      doc.text(sd, 40, yPosition);
      yPosition += sd.length * 7 + 10;
    }
    if (formData.propertyAge) {
      doc.text(`Property Age: ${formData.propertyAge}`, 40, yPosition);
      yPosition += 16;
    }
    if (formData.propertySize) {
      doc.text(`Size (sqm): ${formData.propertySize}`, 40, yPosition);
      yPosition += 16;
    }
    if (formData.rooms) {
      doc.text(`Rooms: ${formData.rooms}`, 40, yPosition);
      yPosition += 16;
    }
    if (formData.targetBuyers) {
      doc.text(`Target Buyers: ${formData.targetBuyers}`, 40, yPosition);
      yPosition += 16;
    }
    if (formData.sellingReason) {
      doc.text(`Reason for Selling: ${formData.sellingReason}`, 40, yPosition);
      yPosition += 16;
    }
    if (formData.marketingGoals) {
      doc.text(`Marketing Goals: ${formData.marketingGoals}`, 40, yPosition);
      yPosition += 16;
    }

    yPosition += 10;
  }

  // Services Requested
  doc.setFontSize(12).text("Services Requested:", 40, yPosition);
  yPosition += 16;
  doc.setFontSize(12).text(formData.selectedImprovements.join(", "), 40, yPosition);
  yPosition += 30;

  // Photos loop with automatic sizing
  if (formData.photos.length > 0) {
    const margin= 20;
    const spacing = 10;
    const pageW= doc.internal.pageSize.getWidth();
    let yPos= yPosition +18;

    doc.setFontSize(12).text("Property Photos:", 40, yPosition);
    yPos += 18;

    const cols = 3;
    const usableWidth = pageW - margin * 2 - spacing * (cols - 1);
    const cellW = usableWidth / cols;
    let rowMaxHeight = 0;

    for (let i = 0; i < formData.photos.length; i++) {
      // page break if near bottom
      if (yPos > doc.internal.pageSize.getHeight() - 100) {
        doc.addPage();
        yPos =40;
        doc.setFontSize(14).text("Property Photos (cont.):", margin, yPos);
        yPos += 18;
      }

      // read file as Data URL
      const imgData = await new Promise<string>((res, rej) => {
        const reader = new FileReader();
        reader.onload   = () => res(reader.result as string);
        reader.onerror  = () => rej(reader.error);
        reader.readAsDataURL(formData.photos[i]);
      });

      // get natural image properties
      const props = doc.getImageProperties(imgData);

      // convert px → pt (1px ≈ 0.75pt)
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

      // draw image at calculated size
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