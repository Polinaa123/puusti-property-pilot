
import React from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, Mail } from "lucide-react";

interface SuccessPageProps {
  onDownloadPDF: () => void;
  onStartOver: () => void;
}

const SuccessPage: React.FC<SuccessPageProps> = ({ onDownloadPDF, onStartOver }) => {
  return (
    <div className="w-full max-w-2xl mx-auto text-center p-8">
      <div className="flex justify-center mb-6">
        <CheckCircle className="w-16 h-16 text-[#49CA38]" />
      </div>
      
      <h2 className="text-3xl font-['Kanit'] text-[#49CA38] mb-4">
        Form Successfully Submitted!
      </h2>
      
      <p className="text-lg font-['Kanit'] text-gray-700 mb-6">
        Thank you for choosing Puusti! Your form has been sent to our team and we'll get back to you soon.
      </p>
      
      <div className="bg-green-50 border border-[#49CA38] rounded-lg p-6 mb-8">
        <div className="flex items-center justify-center mb-4">
          <Mail className="w-6 h-6 text-[#49CA38] mr-2" />
          <span className="font-['Kanit'] text-[#49CA38] font-semibold">
            Email Notification Sent
          </span>
        </div>
        <p className="text-sm font-['Kanit'] text-gray-600">
          A copy of your submission has been automatically sent to our team at hellopuusti@gmail.com
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={onDownloadPDF}
          className="bg-[#49CA38] hover:bg-[#3ab42f] text-white font-['Kanit'] text-lg px-6 py-3 flex items-center gap-2"
        >
          <Download className="w-5 h-5" />
          Download PDF Copy
        </Button>
        
        <Button
          onClick={onStartOver}
          variant="outline"
          className="border-[#49CA38] text-[#49CA38] hover:bg-[#49CA38] hover:text-white font-['Kanit'] text-lg px-6 py-3"
        >
          Submit Another Form
        </Button>
      </div>
      
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm font-['Kanit'] text-gray-600">
          <strong>What happens next?</strong><br />
          Our team will review your submission and contact you within 1-2 business days to discuss your property improvement needs and next steps.
        </p>
      </div>
    </div>
  );
};

export default SuccessPage;
