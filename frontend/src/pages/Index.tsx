import React, { useRef, useState } from 'react';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Slider } from "../components/ui/slider";
import { Checkbox } from "../components/ui/checkbox";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Progress } from "../components/ui/progress";
import { Building2, Home, Upload, CheckCircle, ArrowRight, ArrowLeft, ChevronRight, User, Briefcase } from "lucide-react";
import { generatePDF } from '../utils/pdfGenerator';
import SuccessPage from '../components/SuccessPage';
import puustilogo from '../pages/PUUSTILOGO.png';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/utils/firebase";
import { useNavigate } from "react-router-dom";

type UserType = 'client' | 'freelancer' | null;
type PropertyType = 'rental' | 'sale' | null;
type StepType = 'user-type' | 'property-type' | 'personal-info' | 'property-details' | 'improvements' | 'budget' | 'photos' | 'summary';

const Index = () => {
  const [currentStep, setCurrentStep] = useState<StepType | 'success'>('user-type');
  const [userType, setUserType] = useState<UserType>(null);
  const [propertyType, setPropertyType] = useState<PropertyType>(null);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    // Common fields
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    
    // Client specific
    location: '',
    budget: [500],
    selectedImprovements: [] as string[],
    photos: [] as File[],
    listingLink: '',
    listingTitle: '',
    listingDescription: '',
    roomCount: '',
    propertySize: '',
    yearBuilt: '',
    propertyCondition: '',
    targetMarket: '',
    salePrice: '',
    
    // Freelancer specific
    experience: '',
    services: [] as string[],
    hourlyRate: [50],
    portfolio: [] as File[],
    description: ''
  });

  const printRef = useRef<HTMLDivElement>(null);

  const clientSteps: StepType[] = ['user-type', 'property-type', 'personal-info', 'property-details', 'improvements', 'budget', 'photos', 'summary'];
  const freelancerSteps: StepType[] = ['user-type', 'personal-info', 'improvements', 'budget', 'photos', 'summary'];
  
  const getCurrentSteps = () => userType === 'client' ? clientSteps : freelancerSteps;
  const steps = getCurrentSteps();
  
  const stepTitles: Record<StepType, string> = {
    'user-type': 'выбор роли',
    'property-type': 'тип недвижимости',
    'personal-info': 'личная информация',
    'property-details': 'детали недвижимости',
    'improvements': userType === 'client' ? 'выбор услуг' : 'ваши услуги',
    'budget': userType === 'client' ? 'бюджет' : 'ставка',
    'photos': userType === 'client' ? 'фото недвижимости' : 'портфолио',
    'summary': 'проверка и отправка'
  };

  const getCurrentStepIndex = () => steps.indexOf(currentStep as StepType);
  const getProgress = () => ((getCurrentStepIndex() + 1) / steps.length) * 100;

  const clientServices = [
    'профессиональная фотосъёмка',
    'дизайн интерьера',
    'оптимизация описания и заголовка',
    'маркетинговая стратегия',
    'виртуальная постановка'
  ];

  const freelancerServices = [
    'фотография',
    'дизайн интерьера',
    'копирайтинг',
    'маркетинг',
    'виртуальная постановка',
    'консультации по недвижимости'
  ];

  const improvements = userType === 'client' ? clientServices : freelancerServices;

  const handleNext = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type);
    if (type === 'client') {
      setCurrentStep('property-type');
    } else {
      setCurrentStep('personal-info');
    }
  };

  const handlePropertyTypeSelect = (type: PropertyType) => {
    setPropertyType(type);
    setFormData({ ...formData, selectedImprovements: [] });
    setCurrentStep('personal-info');
  };

  const handleImprovementToggle = (improvement: string) => {
    const field = userType === 'client' ? 'selectedImprovements' : 'services';
    setFormData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].includes(improvement)
        ? (prev[field as keyof typeof prev] as string[]).filter(item => item !== improvement)
        : [...(prev[field as keyof typeof prev] as string[]), improvement]
    }));
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const field = userType === 'client' ? 'photos' : 'portfolio';
    console.log('Uploaded files:', files);
    setFormData(prev => ({ ...prev, [field]: [...prev[field as keyof typeof prev] as File[], ...files] }));
  };

  const removePhoto = (index: number) => {
    const field = userType === 'client' ? 'photos' : 'portfolio';
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as File[]).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const uid = cred.user.uid;
      setCurrentStep('success');
  
      // Save basic user doc
      await setDoc(doc(db, "users", uid), {
        role: userType,
        email: formData.email,
        createdAt: serverTimestamp()
      });
  
      // Save detailed form data
      if (userType === "client") {
        await setDoc(doc(db, "customers", uid), {
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          location: formData.location,
          email: formData.email,
          propertyType: propertyType,
          budget: formData.budget[0],
          selectedImprovements: formData.selectedImprovements,
          photos: formData.photos.map(photo => ({
            name: photo.name,
            size: photo.size,
            type: photo.type,
            url: URL.createObjectURL(photo)
          })),
          listingLink: formData.listingLink,
          listingTitle: formData.listingTitle,
          listingDescription: formData.listingDescription,
          roomCount: formData.roomCount,
          propertySize: formData.propertySize,
          yearBuilt: formData.yearBuilt,
          propertyCondition: formData.propertyCondition,
          targetMarket: formData.targetMarket,
          salePrice: formData.salePrice,
          submittedAt: serverTimestamp()
        });
        navigate("/account/customer");
      } else {
        await setDoc(doc(db, "freelancers", uid), {
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          experience: formData.experience,
          services: formData.services,
          hourlyRate: formData.hourlyRate[0],
          portfolio: formData.portfolio.map(photo => ({
            name: photo.name,
            size: photo.size,
            type: photo.type,
            url: URL.createObjectURL(photo)
          })),
          description: formData.description,
          submittedAt: serverTimestamp()
        });
        navigate("/account/freelancer");
      }
    } catch (e: any) {
      console.error(e);
      alert(`Ошибка: ${e.message}`);
    }
  };

  const handleDownloadPDF = async () => {
    if (userType !== 'client') return;
    
    try {
      const pdfDoc = await generatePDF({ 
        ...formData, 
        propertyType: propertyType!,
        selectedImprovements: formData.selectedImprovements
      });
      const pdfBlob = pdfDoc.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `puusti_submission_${formData.fullName.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('error downloading PDF:', error);
    }
  };

  const handleStartOver = () => {
    setCurrentStep('user-type');
    setUserType(null);
    setPropertyType(null);
    setFormData({
      fullName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      location: '',
      budget: [500],
      selectedImprovements: [],
      photos: [],
      listingLink: '',
      listingTitle: '',
      listingDescription: '',
      roomCount: '',
      propertySize: '',
      yearBuilt: '',
      propertyCondition: '',
      targetMarket: '',
      salePrice: '',
      experience: '',
      services: [],
      hourlyRate: [50],
      portfolio: [],
      description: ''
    });
  };

  if (currentStep === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 px-4">
        <div className="max-w-4xl mx-auto">
          <SuccessPage onDownloadPDF={handleDownloadPDF} onStartOver={handleStartOver} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <img 
              src={puustilogo}
              alt="puusti logo" 
              className="h-12" 
            />
          </div>
          <Progress value={getProgress()} className="mb-4"/>
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#32ad41]">{stepTitles[currentStep as StepType]}</p>
            <Badge variant="secondary" className="text-[#32ad41]">
              Шаг {getCurrentStepIndex() + 1} из {steps.length}
            </Badge>
          </div>
        </div>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            {/* User Type Selection */}
            {currentStep === 'user-type' && (
              <div className="text-center space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-3">Добро пожаловать в Puusti!</h2>
                  <p className="text-gray-600">Выберите свою роль на платформе</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                  <Card 
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-[#49CA38] group"
                    onClick={() => handleUserTypeSelect('client')}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="bg-[#32ad41]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#49CA38]/20 transition-colors">
                        <Home className="w-8 h-8 text-[#32ad41]" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">Собственник недвижимости</h3>
                      <p className="text-gray-600 text-sm">Хочу оптимизировать свои объявления и получить услуги</p>
                      <ChevronRight className="w-5 h-5 text-gray-400 mx-auto mt-4 group-hover:text-[#32ad41] transition-colors" />
                    </CardContent>
                  </Card>

                  <Card 
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-[#49CA38] group"
                    onClick={() => handleUserTypeSelect('freelancer')}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="bg-[#32ad41]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#49CA38]/20 transition-colors">
                        <Briefcase className="w-8 h-8 text-[#32ad41]" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">Фрилансер</h3>
                      <p className="text-gray-600 text-sm">Предлагаю услуги по фотографии, дизайну и маркетингу</p>
                      <ChevronRight className="w-5 h-5 text-gray-400 mx-auto mt-4 group-hover:text-[#32ad41] transition-colors" />
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Property Type Selection (only for clients) */}
            {currentStep === 'property-type' && userType === 'client' && (
              <div className="text-center space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-700 mb-3">Тип недвижимости</h2>
                  <p className="text-gray-600">Какую недвижимость хотите оптимизировать?</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                  <Card 
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-[#49CA38] group"
                    onClick={() => handlePropertyTypeSelect('rental')}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="bg-[#32ad41]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#49CA38]/20 transition-colors">
                        <Building2 className="w-8 h-8 text-[#32ad41]" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">Краткосрочная аренда</h3>
                      <p className="text-gray-600 text-sm">Оптимизация объявления для Airbnb, Booking и т.д.</p>
                      <ChevronRight className="w-5 h-5 text-gray-400 mx-auto mt-4 group-hover:text-[#32ad41] transition-colors" />
                    </CardContent>
                  </Card>

                  <Card 
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-[#49CA38] group"
                    onClick={() => handlePropertyTypeSelect('sale')}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="bg-[#32ad41]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#49CA38]/20 transition-colors">
                        <Home className="w-8 h-8 text-[#32ad41]" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">Продажа недвижимости</h3>
                      <p className="text-gray-600 text-sm">Подготовка недвижимости к продаже</p>
                      <ChevronRight className="w-5 h-5 text-gray-400 mx-auto mt-4 group-hover:text-[#32ad41] transition-colors" />
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Personal Info */}
            {currentStep === 'personal-info' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-700 mb-2">Личная информация</h2>
                  <p className="text-gray-600">
                    {userType === 'client' ? 'Расскажите о себе' : 'Создайте свой профиль фрилансера'}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Полное имя *</Label>
                    <Input
                      id="fullName"
                      placeholder="Введите ваше полное имя"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email адрес *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Введите ваш email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Номер телефона *</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="Введите ваш номер телефона"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Пароль *</Label>
                    <Input
                      id="password"
                      placeholder="Создайте пароль"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Подтвердите пароль *</Label>
                    <Input
                      id="confirmPassword"
                      placeholder="Подтвердите пароль"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      className="h-12"
                    />
                  </div>

                  {userType === 'freelancer' && (
                    <div className="space-y-2">
                      <Label htmlFor="experience">Опыт работы</Label>
                      <Select value={formData.experience} onValueChange={(value) => setFormData({...formData, experience: value})}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Выберите ваш опыт" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Начинающий (менее 1 года)</SelectItem>
                          <SelectItem value="intermediate">Средний (1-3 года)</SelectItem>
                          <SelectItem value="advanced">Продвинутый (3-5 лет)</SelectItem>
                          <SelectItem value="expert">Эксперт (более 5 лет)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {userType === 'client' && (
                    <div className="space-y-2">
                      <Label htmlFor="location">Местоположение недвижимости *</Label>
                      <Input
                        id="location"
                        placeholder="Город, страна"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="h-12"
                      />
                    </div>
                  )}
                </div>

                {userType === 'freelancer' && (
                  <div className="space-y-2">
                    <Label htmlFor="description">О себе</Label>
                    <Textarea
                      id="description"
                      placeholder="Расскажите о своем опыте и специализации"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="min-h-[120px]"
                    />
                  </div>
                )}
              </div>
            )}

            {currentStep === 'property-details' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-700 mb-2">property details</h2>
                  <p className="text-gray-600">
                    {propertyType === 'rental' ? 'tell us about your rental property' : 'tell us about your property for sale'}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">property location *</Label>
                  <Input
                    id="location"
                    placeholder="city, country"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="h-12"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {propertyType === 'rental' ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="listingTitle">current listing title</Label>
                        <Input
                          id="listingTitle"
                          placeholder="your current listing title"
                          value={formData.listingTitle}
                          onChange={(e) => setFormData({...formData, listingTitle: e.target.value})}
                          className="h-12"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="roomCount">number of rooms</Label>
                        <Select value={formData.roomCount} onValueChange={(value) => setFormData({...formData, roomCount: value})}>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="select room count" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">studio</SelectItem>
                            <SelectItem value="1">1 room</SelectItem>
                            <SelectItem value="2">2 rooms</SelectItem>
                            <SelectItem value="3">3 rooms</SelectItem>
                            <SelectItem value="4">4 rooms</SelectItem>
                            <SelectItem value="5+">5+ rooms</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="listingDescription">current listing description</Label>
                        <Textarea
                          id="listingDescription"
                          placeholder="your current listing description"
                          value={formData.listingDescription}
                          onChange={(e) => setFormData({...formData, listingDescription: e.target.value})}
                          className="min-h-[120px]"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="propertySize">property size (sqm)</Label>
                        <Input
                          id="propertySize"
                          placeholder="e.g., 120"
                          value={formData.propertySize}
                          onChange={(e) => setFormData({...formData, propertySize: e.target.value})}
                          className="h-12"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="yearBuilt">year built</Label>
                        <Input
                          id="yearBuilt"
                          placeholder="e.g., 1995"
                          value={formData.yearBuilt}
                          onChange={(e) => setFormData({...formData, yearBuilt: e.target.value})}
                          className="h-12"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="propertyCondition">property condition</Label>
                        <Select value={formData.propertyCondition} onValueChange={(value) => setFormData({...formData, propertyCondition: value})}>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="select condition" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="excellent">excellent</SelectItem>
                            <SelectItem value="good">good</SelectItem>
                            <SelectItem value="fair">fair</SelectItem>
                            <SelectItem value="needs-renovation">needs renovation</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="salePrice">expected sale price (€)</Label>
                        <Input
                          id="salePrice"
                          placeholder="e.g., 300000"
                          value={formData.salePrice}
                          onChange={(e) => setFormData({...formData, salePrice: e.target.value})}
                          className="h-12"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Services/Improvements */}
            {currentStep === 'improvements' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-700 mb-2">
                    {userType === 'client' ? 'Необходимые услуги' : 'Ваши услуги'}
                  </h2>
                  <p className="text-gray-600">
                    {userType === 'client' 
                      ? 'Выберите услуги, которые вам нужны' 
                      : 'Отметьте услуги, которые вы предоставляете'}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {improvements.map((improvement) => {
                    const isSelected = userType === 'client' 
                      ? formData.selectedImprovements.includes(improvement)
                      : formData.services.includes(improvement);
                      
                    return (
                      <Card 
                        key={improvement}
                        className={`cursor-pointer transition-all duration-200 border-2 ${
                          isSelected
                            ? 'border-[#32ad41] bg-[#32ad41]/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleImprovementToggle(improvement)}
                      >
                        <CardContent className="p-4 flex items-center space-x-3">
                          <Checkbox
                            checked={isSelected}
                            className="data-[state=checked]:bg-[#49CA38] data-[state=checked]:border-[#32ad41]"
                          />
                          <span className="font-medium text-gray-900">{improvement}</span>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Budget/Rate */}
            {currentStep === 'budget' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-700 mb-2">
                    {userType === 'client' ? 'Бюджет' : 'Почасовая ставка'}
                  </h2>
                  <p className="text-gray-600">
                    {userType === 'client' 
                      ? 'Какой у вас бюджет на этот проект?' 
                      : 'Укажите вашу почасовую ставку'}
                  </p>
                </div>

                <div className="space-y-8">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-[#32ad41] mb-2">
                        €{userType === 'client' ? formData.budget[0].toLocaleString() : formData.hourlyRate[0].toLocaleString()}
                        {userType === 'freelancer' && <span className="text-lg">/час</span>}
                      </div>
                      <p className="text-gray-600">
                        {userType === 'client' ? 'ваш бюджет' : 'ваша ставка'}
                      </p>
                    </div>
                    <Slider
                      value={userType === 'client' ? formData.budget : formData.hourlyRate}
                      onValueChange={(value) => setFormData({
                        ...formData, 
                        [userType === 'client' ? 'budget' : 'hourlyRate']: value
                      })}
                      max={userType === 'client' ? 2000 : 200}
                      min={userType === 'client' ? 100 : 10}
                      step={userType === 'client' ? 50 : 5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                      <span>€{userType === 'client' ? '100' : '10'}</span>
                      <span>€{userType === 'client' ? '2000+' : '200+'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Photos/Portfolio */}
            {currentStep === 'photos' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-700 mb-2">
                    {userType === 'client' ? 'Фото недвижимости' : 'Портфолио'}
                  </h2>
                  <p className="text-gray-600">
                    {userType === 'client' 
                      ? 'Загрузите фото вашей недвижимости (необязательно, но рекомендуется)'
                      : 'Покажите примеры ваших работ'}
                  </p>
                </div>

                <div className="flex justify-center">
                  <label
                    htmlFor="photo-upload"
                    className="relative border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-[#32ad41] transition-colors cursor-pointer w-full max-w-xs"
                  >
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">
                      Перетащите фото сюда или нажмите для выбора
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      id="photo-upload"
                      className="hidden"
                    />
                  </label>
                </div>

                {((userType === 'client' && formData.photos.length > 0) || 
                  (userType === 'freelancer' && formData.portfolio.length > 0)) && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {(userType === 'client' ? formData.photos : formData.portfolio).map((photo, i) => (
                      <div key={i} className="relative group">
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={`photo-${i}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 p-0"
                          onClick={() => removePhoto(i)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Summary */}
            {currentStep === 'summary' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-700 mb-2">Проверьте данные</h2>
                  <p className="text-gray-600">Пожалуйста, проверьте всю информацию перед отправкой</p>
                </div>

                <div className="grid gap-6">
                  <Card className="bg-gray-50">
                    <CardHeader>
                      <CardTitle className="text-lg text-gray-700">Роль</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="secondary" className="bg-[#32ad41] text-white">
                        {userType === 'client' ? 'Собственник недвижимости' : 'Фрилансер'}
                      </Badge>
                    </CardContent>
                  </Card>

                  {userType === 'client' && propertyType && (
                    <Card className="bg-gray-50">
                      <CardHeader>
                        <CardTitle className="text-lg text-gray-700">Тип недвижимости</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Badge variant="secondary" className="bg-[#32ad41] text-white">
                          {propertyType === 'rental' ? 'Краткосрочная аренда' : 'Продажа недвижимости'}
                        </Badge>
                      </CardContent>
                    </Card>
                  )}

                  <Card className="bg-gray-50">
                    <CardHeader>
                      <CardTitle className="text-lg text-gray-700">Контактная информация</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-gray-700">
                      <p><strong>Имя:</strong> {formData.fullName}</p>
                      <p><strong>Email:</strong> {formData.email}</p>
                      <p><strong>Телефон:</strong> {formData.phoneNumber}</p>
                      {userType === 'client' && <p><strong>Местоположение:</strong> {formData.location}</p>}
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-50">
                    <CardHeader>
                      <CardTitle className="text-lg text-gray-700">
                        {userType === 'client' ? 'Выбранные услуги' : 'Предоставляемые услуги'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 text-gray-700">
                        {(userType === 'client' ? formData.selectedImprovements : formData.services).map((item) => (
                          <Badge key={item} variant="outline">{item}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-50">
                    <CardHeader>
                      <CardTitle className="text-lg text-gray-700">
                        {userType === 'client' ? 'Бюджет' : 'Почасовая ставка'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-[#32ad41]">
                        €{userType === 'client' ? formData.budget[0].toLocaleString() : formData.hourlyRate[0].toLocaleString()}
                        {userType === 'freelancer' && <span className="text-lg">/час</span>}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t">
              {getCurrentStepIndex() > 0 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrev}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Назад
                </Button>
              ) : (
                <div />
              )}

              {currentStep === 'summary' ? (
                <Button
                  onClick={handleSubmit}
                  className="bg-[#32ad41] hover:bg-[#3ab42f] text-white flex items-center gap-2"
                  disabled={!formData.fullName || !formData.email || !formData.phoneNumber || formData.password.length < 8 || formData.password !== formData.confirmPassword}
                >
                  <CheckCircle className="w-4 h-4" />
                  Подтвердить и отправить
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="bg-[#32ad41] hover:bg-[#3ab42f] text-white flex items-center gap-2"
                  disabled={
                    (currentStep === 'personal-info' && (!formData.fullName || !formData.email || !formData.phoneNumber || formData.password.length < 8 || formData.password !== formData.confirmPassword)) ||
                    (currentStep === 'improvements' && (userType === 'client' ? formData.selectedImprovements.length === 0 : formData.services.length === 0))
                  }
                >
                  Далее
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
