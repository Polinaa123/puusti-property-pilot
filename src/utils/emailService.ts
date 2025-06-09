
import emailjs from 'emailjs-com';

export const sendFormSubmissionEmail = async (pdfBlob: Blob, formData: any) => {
  try {
    // Convert blob to base64
    const reader = new FileReader();
    
    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        const base64data = reader.result as string;
        const base64Content = base64data.split(',')[1]; // Remove data:application/pdf;base64, prefix
        
        const templateParams = {
          to_email: 'hellopuusti@gmail.com',
          customer_name: formData.fullName,
          customer_email: formData.email,
          customer_phone: formData.phoneNumber,
          property_type: formData.propertyType === 'rental' ? 'Short-term rental' : 'Property for sale',
          location: formData.location,
          budget: `${formData.budget[0]}€`,
          improvements: formData.selectedImprovements.join(', '),
          pdf_attachment: base64Content,
          pdf_filename: `puusti_submission_${formData.fullName.replace(/\s+/g, '_')}_${Date.now()}.pdf`
        };
        
        try {
          // You'll need to set up EmailJS service, template, and public key
          // For now, we'll just console.log the attempt
          console.log('Email would be sent with:', templateParams);
          
          // Uncomment and configure when EmailJS is set up:
          /*
          const result = await emailjs.send(
            'YOUR_SERVICE_ID',
            'YOUR_TEMPLATE_ID',
            templateParams,
            'YOUR_PUBLIC_KEY'
          );
          */
          
          resolve('Email sent successfully (simulated)');
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read PDF blob'));
      reader.readAsDataURL(pdfBlob);
    });
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
