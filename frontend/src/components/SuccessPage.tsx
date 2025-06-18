
import React from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { CheckCircle, Download, RotateCcw } from "lucide-react";

interface SuccessPageProps {
  onDownloadPDF: () => void;
  onStartOver: () => void;
}

const SuccessPage: React.FC<SuccessPageProps> = ({ onDownloadPDF, onStartOver }) => {
  return (
    <div className="text-center space-y-8">
      <div className="flex justify-center">
        <div className="bg-green-100 rounded-full p-6">
          <CheckCircle className="w-16 h-16 text-green-600" />
        </div>
      </div>
      
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Заявка успешно отправлена!
        </h1>
        <p className="text-gray-600 text-lg mb-2">
          Спасибо за обращение к Puusti!
        </p>
        <p className="text-gray-500">
          Мы получили вашу заявку и свяжемся с вами в ближайшее время.
          PDF-отчет также был отправлен на нашу почту для обработки.
        </p>
      </div>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-lg">Что дальше?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-left space-y-2 text-sm text-gray-600">
            <p>• Наша команда проанализирует вашу заявку</p>
            <p>• Мы подберем подходящих фрилансеров</p>
            <p>• С вами свяжется менеджер в течение 24 часов</p>
            <p>• Получите план действий и расчет стоимости</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={onDownloadPDF}
          className="bg-[#32ad41] hover:bg-[#3ab42f] text-white flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Скачать PDF отчет
        </Button>
        
        <Button
          onClick={onStartOver}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Подать новую заявку
        </Button>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-800">
        <strong>Важно:</strong> Проверьте папку "Спам" если не получили подтверждение на email
      </div>
    </div>
  );
};

export default SuccessPage;
