
import jsPDF from 'jspdf';

interface FormData {
  propertyType: 'rental' | 'sale';
  // Common fields
  location: string;
  listingLink: string;
  selectedImprovements: string[];
  budget: number[];
  fullName: string;
  email: string;
  phoneNumber: string;
  
  // Rental specific
  description?: string;
  seasons?: string;
  audience?: string;
  customers?: string;
  occupancyDays?: number[];
  adDescription?: string;
  adTitle?: string;
  interiorDesignNotes?: string;
  
  // Sale specific
  saleDescription?: string;
  propertyAge?: string;
  propertySize?: string;
  rooms?: string;
  targetBuyers?: string;
  sellingReason?: string;
  marketingGoals?: string;
}

export const generatePDF = (formData: FormData): jsPDF => {
  const doc = new jsPDF();
  let yPosition = 20;
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(73, 202, 56); // #49CA38
  doc.text('Puusti - Property Listing Submission', 20, yPosition);
  yPosition += 20;
  
  // Property type
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(`Property Type: ${formData.propertyType === 'rental' ? 'Short-term rental' : 'Property for sale'}`, 20, yPosition);
  yPosition += 15;
  
  // Property specific fields
  if (formData.propertyType === 'rental') {
    if (formData.description) {
      doc.text('Property Description:', 20, yPosition);
      yPosition += 7;
      const descLines = doc.splitTextToSize(formData.description, 170);
      doc.text(descLines, 25, yPosition);
      yPosition += descLines.length * 7 + 5;
    }
    
    if (formData.seasons) {
      doc.text(`Important Seasons: ${formData.seasons}`, 20, yPosition);
      yPosition += 10;
    }
    
    if (formData.audience) {
      doc.text(`Target Audience: ${formData.audience}`, 20, yPosition);
      yPosition += 10;
    }
    
    if (formData.customers) {
      doc.text(`Customer Base: ${formData.customers}`, 20, yPosition);
      yPosition += 10;
    }
    
    if (formData.occupancyDays) {
      doc.text(`Occupation Days per Year: ${formData.occupancyDays[0]}`, 20, yPosition);
      yPosition += 10;
    }
  } else {
    if (formData.saleDescription) {
      doc.text('Property Description:', 20, yPosition);
      yPosition += 7;
      const descLines = doc.splitTextToSize(formData.saleDescription, 170);
      doc.text(descLines, 25, yPosition);
      yPosition += descLines.length * 7 + 5;
    }
    
    if (formData.propertyAge) {
      doc.text(`Property Age: ${formData.propertyAge}`, 20, yPosition);
      yPosition += 10;
    }
    
    if (formData.rooms) {
      doc.text(`Size and Rooms: ${formData.rooms}`, 20, yPosition);
      yPosition += 10;
    }
    
    if (formData.targetBuyers) {
      doc.text(`Target Buyers: ${formData.targetBuyers}`, 20, yPosition);
      yPosition += 10;
    }
    
    if (formData.sellingReason) {
      doc.text(`Selling Reason: ${formData.sellingReason}`, 20, yPosition);
      yPosition += 10;
    }
    
    if (formData.marketingGoals) {
      doc.text(`Marketing Goals: ${formData.marketingGoals}`, 20, yPosition);
      yPosition += 10;
    }
  }
  
  // Common fields
  doc.text(`Location: ${formData.location}`, 20, yPosition);
  yPosition += 10;
  
  if (formData.listingLink) {
    doc.text('Listing Link:', 20, yPosition);
    yPosition += 7;
    const linkLines = doc.splitTextToSize(formData.listingLink, 170);
    doc.text(linkLines, 25, yPosition);
    yPosition += linkLines.length * 7 + 5;
  }
  
  doc.text(`Improvements: ${formData.selectedImprovements.length > 0 ? formData.selectedImprovements.join(', ') : 'None'}`, 20, yPosition);
  yPosition += 10;
  
  doc.text(`Budget: ${formData.budget[0]}€`, 20, yPosition);
  yPosition += 15;
  
  // Contact information
  doc.setFontSize(16);
  doc.setTextColor(73, 202, 56);
  doc.text('Contact Information', 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Name: ${formData.fullName}`, 20, yPosition);
  yPosition += 10;
  doc.text(`Email: ${formData.email}`, 20, yPosition);
  yPosition += 10;
  doc.text(`Phone: ${formData.phoneNumber}`, 20, yPosition);
  
  // Add improvement specific details if selected
  if (formData.selectedImprovements.includes('description and title')) {
    yPosition += 15;
    doc.setFontSize(16);
    doc.setTextColor(73, 202, 56);
    doc.text('Listing Content', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    if (formData.adTitle) {
      doc.text('Current Title:', 20, yPosition);
      yPosition += 7;
      const titleLines = doc.splitTextToSize(formData.adTitle, 170);
      doc.text(titleLines, 25, yPosition);
      yPosition += titleLines.length * 7 + 5;
    }
    
    if (formData.adDescription) {
      doc.text('Current Description:', 20, yPosition);
      yPosition += 7;
      const adDescLines = doc.splitTextToSize(formData.adDescription, 170);
      doc.text(adDescLines, 25, yPosition);
      yPosition += adDescLines.length * 7 + 5;
    }
  }
  
  if (formData.selectedImprovements.includes('interior design') && formData.interiorDesignNotes) {
    yPosition += 10;
    doc.text('Interior Design Notes:', 20, yPosition);
    yPosition += 7;
    const notesLines = doc.splitTextToSize(formData.interiorDesignNotes, 170);
    doc.text(notesLines, 25, yPosition);
  }
  
  return doc;
};
