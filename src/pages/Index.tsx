
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Building2, Home, Upload, CheckCircle, ArrowRight, ArrowLeft, ChevronRight } from "lucide-react";
import { generatePDF } from '../utils/pdfGenerator';
import { sendFormSubmissionEmail } from '../utils/emailService';
import SuccessPage from '../components/SuccessPage';
import puustilogo from '../pages/PUUSTILOGO.png';

const Index = () => {
  const [currentStep, setCurrentStep] = useState('property-type');
  const [propertyType, setPropertyType] = useState<'rental' | 'sale' | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
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
    salePrice: ''
  });

  const steps = ['property-type', 'personal-info', 'property-details', 'improvements', 'budget', 'photos', 'summary'];
  const stepTitles = {
    'property-type': 'property type',
    'personal-info': 'personal information',
    'property-details': 'property details',
    'improvements': 'services needed',
    'budget': 'budget',
    'photos': 'photos',
    'summary': 'review & submit'
  };

  const getCurrentStepIndex = () => steps.indexOf(currentStep);
  const getProgress = () => ((getCurrentStepIndex() + 1) / steps.length) * 100;

  const rentalImprovements = [
    'professional photography',
    'interior design consultation',
    'description and title optimization',
  ];

  const saleImprovements = [
    'professional photography',
    'interior design consultation',
    'description and title optimization',
  ];

  const improvements = propertyType === 'rental' ? rentalImprovements : saleImprovements;

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

  const handlePropertyTypeSelect = (type: 'rental' | 'sale') => {
    setPropertyType(type);
    setFormData({ ...formData, selectedImprovements: [] });
    setCurrentStep('personal-info');
  };

  const handleImprovementToggle = (improvement: string) => {
    setFormData(prev => ({
      ...prev,
      selectedImprovements: prev.selectedImprovements.includes(improvement)
        ? prev.selectedImprovements.filter(item => item !== improvement)
        : [...prev.selectedImprovements, improvement]
    }));
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData(prev => ({ ...prev, photos: [...prev.photos, ...files] }));
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    try {
      const pdfDoc = await generatePDF({ ...formData, propertyType: propertyType! });
      const pdfBlob = pdfDoc.output('blob');
      await sendFormSubmissionEmail(pdfBlob, { ...formData, propertyType: propertyType! });
      setCurrentStep('success');
    } catch (error) {
      console.error('error submitting form:', error);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const pdfDoc = await generatePDF({ ...formData, propertyType: propertyType! });
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
    setCurrentStep('property-type');
    setPropertyType(null);
    setFormData({
      fullName: '',
      email: '',
      phoneNumber: '',
      location: '',
      budget: [1000],
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
      salePrice: ''
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
          <div className="flex items-center justify-between mb-4">
          <img 
            src={puustilogo}
            alt="puusti logo" 
            className="h-12" 
          />
            <Badge variant="secondary" className="text-[#32ad41]">
              Step {getCurrentStepIndex() + 1} of {steps.length}
            </Badge>
          </div>
          <Progress value={getProgress()} className="mb-2" />
          <p className="text-sm text-[#32ad41]">{stepTitles[currentStep]}</p>
        </div>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            {currentStep === 'property-type' && (
              <div className="text-center space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-700 mb-3">what type of property do you have?</h2>
                  <p className="text-gray-600">choose the option that best describes your property needs</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                  <Card 
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-[#49CA38] group"
                    onClick={() => handlePropertyTypeSelect('rental')}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="bg-[#49CA38]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#49CA38]/20 transition-colors">
                        <Building2 className="w-8 h-8 text-[#32ad41]" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">short-term rental</h3>
                      <p className="text-gray-600 text-sm">optimize your rental property</p>
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
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">property for sale</h3>
                      <p className="text-gray-600 text-sm">prepare your property for the real estate market</p>
                      <ChevronRight className="w-5 h-5 text-gray-400 mx-auto mt-4 group-hover:text-[#32ad41] transition-colors" />
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {currentStep === 'personal-info' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-700 mb-2">personal information</h2>
                  <p className="text-gray-600">tell us a bit about yourself</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">full name *</Label>
                    <Input
                      id="fullName"
                      placeholder="enter your full name"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">email address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">phone number *</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="enter your phone number"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                      className="h-12"
                    />
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
                </div>
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
                            <SelectValue placeholder="Select room count" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">studio</SelectItem>
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
                          placeholder="e.g., 2010"
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

            {currentStep === 'improvements' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-700 mb-2">services needed</h2>
                  <p className="text-gray-600">
                    {propertyType === 'rental' 
                      ? 'select the services you need for your rental property' 
                      : 'select the services you need to prepare your property for sale'}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {improvements.map((improvement) => (
                    <Card 
                      key={improvement}
                      className={`cursor-pointer transition-all duration-200 border-2 ${
                        formData.selectedImprovements.includes(improvement)
                          ? 'border-[#32ad41] bg-[#32ad41]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleImprovementToggle(improvement)}
                    >
                      <CardContent className="p-4 flex items-center space-x-3">
                        <Checkbox
                          checked={formData.selectedImprovements.includes(improvement)}
                          className="data-[state=checked]:bg-[#49CA38] data-[state=checked]:border-[#32ad41]"
                        />
                        <span className="font-medium text-gray-900">{improvement}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 'budget' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-700 mb-2">budget</h2>
                  <p className="text-gray-600">what's your budget for this project?</p>
                </div>

                <div className="space-y-8">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-[#32ad41] mb-2">€{formData.budget[0].toLocaleString()}</div>
                      <p className="text-gray-600">your selected budget</p>
                    </div>
                    <Slider
                      value={formData.budget}
                      onValueChange={(value) => setFormData({...formData, budget: value})}
                      max={1000}
                      min={0}
                      step={50}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                      <span>€0</span>
                      <span>€1000+</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 'photos' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-700 mb-2">property photos</h2>
                  <p className="text-gray-600">upload photos of your property (optional but recommended)</p>
                </div>

                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#49CA38] transition-colors">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">drag and drop photos here, or click to browse</p>
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="photo-upload"
                    />
                    <Label htmlFor="photo-upload">
                      <Button type="button" variant="outline" className="cursor-pointer">
                        choose photos
                      </Button>
                    </Label>
                  </div>

                  {formData.photos.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.photos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(photo)}
                            alt={`property photo ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 p-0"
                            onClick={() => removePhoto(index)}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentStep === 'summary' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-700 mb-2">review your submission</h2>
                  <p className="text-gray-600">please review all information before submitting</p>
                </div>

                <div className="grid gap-6">
                  <Card className="bg-gray-50">
                    <CardHeader>
                      <CardTitle className="text-lg text-gray-700">property type</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="secondary" className="bg-[#32ad41] text-white">
                        {propertyType === 'rental' ? 'short-term rental' : 'property for sale'}
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-50">
                    <CardHeader>
                      <CardTitle className="text-lg text-gray-700">contact information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-gray-700">
                      <p><strong>name:</strong> {formData.fullName}</p>
                      <p><strong>email:</strong> {formData.email}</p>
                      <p><strong>phone:</strong> {formData.phoneNumber}</p>
                      <p><strong>location:</strong> {formData.location}</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-50">
                    <CardHeader>
                      <CardTitle className="text-lg text-gray-700">selected services</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 text-gray-700">
                        {formData.selectedImprovements.map((improvement) => (
                          <Badge key={improvement} variant="outline">{improvement}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-50">
                    <CardHeader>
                      <CardTitle className="text-lg text-gray-700">budget</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-[#32ad41]">€{formData.budget[0].toLocaleString()}</div>
                    </CardContent>
                  </Card>

                  {formData.photos.length > 0 && (
                    <Card className="bg-gray-50">
                      <CardHeader>
                        <CardTitle className="text-lg">uploaded photos</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-4 gap-2">
                          {formData.photos.slice(0, 4).map((photo, index) => (
                            <img
                              key={index}
                              src={URL.createObjectURL(photo)}
                              alt={`property photo ${index + 1}`}
                              className="w-full h-16 object-cover rounded border"
                            />
                          ))}
                          {formData.photos.length > 4 && (
                            <div className="w-full h-16 bg-gray-200 rounded border flex items-center justify-center text-sm text-gray-600">
                              +{formData.photos.length - 4} more
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
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
                  Previous
                </Button>
              ) : (
                <div />
              )}

              {currentStep === 'summary' ? (
                <Button
                  onClick={handleSubmit}
                  className="bg-[#32ad41] hover:bg-[#3ab42f] text-white flex items-center gap-2"
                  disabled={!formData.fullName || !formData.email || !formData.phoneNumber || !formData.location}
                >
                  <CheckCircle className="w-4 h-4" />
                  confirm & send
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="bg-[#32ad41] hover:bg-[#3ab42f] text-white flex items-center gap-2"
                  disabled={
                    (currentStep === 'personal-info' && (!formData.fullName || !formData.email || !formData.phoneNumber || !formData.location)) ||
                    (currentStep === 'improvements' && formData.selectedImprovements.length === 0)
                  }
                >
                  Next
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