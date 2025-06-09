import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { generatePDF } from "../utils/pdfGenerator";
import { sendFormSubmissionEmail } from "../utils/emailService";
import SuccessPage from "../components/SuccessPage";
import Header from "../components/Header";

const Index = () => {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [propertyType, setPropertyType] = useState<'rental' | 'sale' | null>(null);
  const [step, setStep] = useState(0); // 0: property type selection, 1-3: form steps, 4: summary, 5: success

  // Common fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState('');
  const [listingLink, setListingLink] = useState('');
  const [budget, setBudget] = useState([0]);
  const [selectedImprovements, setSelectedImprovements] = useState<string[]>([]);
  const [adPhotos, setAdPhotos] = useState<FileList | null>(null);

  // Rental-specific fields
  const [description, setDescription] = useState('');
  const [adTitle, setAdTitle] = useState('');
  const [interiorDesignNotes, setInteriorDesignNotes] = useState('');
  const [seasons, setSeasons] = useState('');
  const [audience, setAudience] = useState('');
  const [customers, setCustomers] = useState('');
  const [occupancyDays, setOccupancyDays] = useState([0]);
  const [adDescription, setAdDescription] = useState('');

  // Sale-specific fields
  const [saleDescription, setSaleDescription] = useState('');
  const [propertyAge, setPropertyAge] = useState('');
  const [propertySize, setPropertySize] = useState('');
  const [rooms, setRooms] = useState('');
  const [targetBuyers, setTargetBuyers] = useState('');
  const [sellingReason, setSellingReason] = useState('');
  const [marketingGoals, setMarketingGoals] = useState('');

  const improvementOptions = ['photos', 'description and title', 'interior design'];

  const handleClick = () => {
    setShowForm(true);
  };

  const handlePropertyTypeSelect = (type: 'rental' | 'sale') => {
    setPropertyType(type);
    setStep(1);
  };

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (step === 1) {
      setStep(0);
      setPropertyType(null);
    } else {
      setStep((prev) => prev - 1);
    }
  };

  const handleImprovementChange = (option: string, checked: boolean) => {
    setSelectedImprovements((prev) => {
      if (checked) {
        return [...prev, option];
      } else {
        return prev.filter((item) => item !== option);
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(4);
  };

  const handleFinalSubmit = async () => {
    try {
      const formData = {
        propertyType: propertyType!,
        location,
        listingLink,
        selectedImprovements,
        budget,
        fullName,
        email,
        phoneNumber,
        // Rental specific
        ...(propertyType === 'rental' && {
          description,
          seasons,
          audience,
          customers,
          occupancyDays,
          adDescription,
          adTitle,
          interiorDesignNotes,
        }),
        // Sale specific
        ...(propertyType === 'sale' && {
          saleDescription,
          propertyAge,
          propertySize,
          rooms,
          targetBuyers,
          sellingReason,
          marketingGoals,
        }),
      };

      // Generate PDF
      const pdfDoc = generatePDF(formData);
      const pdfBlob = pdfDoc.output('blob');

      // Send email with PDF
      await sendFormSubmissionEmail(pdfBlob, formData);

      // Store PDF for download
      const pdfUrl = URL.createObjectURL(pdfBlob);
      (window as any).currentPdfUrl = pdfUrl;

      toast({
        title: "Success!",
        description: "Your form has been submitted and sent to our team.",
      });

      setStep(5); // Show success page
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "There was an error submitting your form. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadPDF = () => {
    const pdfUrl = (window as any).currentPdfUrl;
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `puusti_submission_${fullName.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
      link.click();
    }
  };

  const handleStartOver = () => {
    // Reset all form state
    setShowForm(false);
    setPropertyType(null);
    setStep(0);
    setFullName('');
    setEmail('');
    setPhoneNumber('');
    setLocation('');
    setListingLink('');
    setBudget([0]);
    setSelectedImprovements([]);
    setAdPhotos(null);
    setDescription('');
    setAdTitle('');
    setInteriorDesignNotes('');
    setSeasons('');
    setAudience('');
    setCustomers('');
    setOccupancyDays([0]);
    setAdDescription('');
    setSaleDescription('');
    setPropertyAge('');
    setPropertySize('');
    setRooms('');
    setTargetBuyers('');
    setSellingReason('');
    setMarketingGoals('');
  };

  const renderImagePreviews = () => {
    if (!adPhotos) return null;
    return (
      <div className="flex flex-wrap gap-4 mt-2">
        {Array.from(adPhotos).map((file, idx) => {
          const url = URL.createObjectURL(file);
          return (
            <img
              key={idx}
              src={url}
              alt={`preview-${idx}`}
              className="w-30 h-20 object-cover border-2 border-[#49CA38] rounded"
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex flex-col items-center justify-start min-h-[calc(100vh-90px)] pt-[90px] px-4">
        <div 
          className={`
            relative border-4 border-[#49CA38] transition-all duration-300 cursor-pointer
            ${showForm 
              ? 'w-[90vw] max-w-4xl h-auto cursor-default' 
              : 'w-[500px] h-[300px] hover:scale-105'
            }
          `}
          onClick={!showForm ? handleClick : undefined}
        >
          {!showForm && (
            <>
              <span className="absolute bottom-1 right-6 text-[#49CA38] text-2xl italic font-['Kanit']">
                ready to get puusted?
              </span>
              <div className="absolute -right-16 top-[30%] -translate-y-1/2 -rotate-90 text-[#49CA38] text-base italic font-['Kanit'] flex items-center">
                ↑ click here
              </div>
              <div className="absolute -bottom-16 left-1 text-4xl font-black text-[#49CA38] font-['Kanit'] pointer-events-none">
                puusti
              </div>
            </>
          )}

          {showForm && (
            <div className="flex flex-col items-center p-10 max-w-4xl mx-auto">
              {step === 5 ? (
                <SuccessPage 
                  onDownloadPDF={handleDownloadPDF}
                  onStartOver={handleStartOver}
                />
              ) : (
                <>
                  <h2 className="text-[#49CA38] mb-8 text-3xl font-['Kanit']">
                    {step === 0 ? 'What type of property do you have?' : 'Submit your info'}
                  </h2>

                  {step === 0 && (
                    <div className="flex flex-col gap-6 w-full max-w-md">
                      <Button
                        onClick={() => handlePropertyTypeSelect('rental')}
                        variant="outline"
                        className="h-16 text-xl border-2 border-[#49CA38] text-[#49CA38] hover:bg-[#49CA38] hover:text-white font-['Kanit']"
                      >
                        Short-term rental (Airbnb, etc.)
                      </Button>
                      <Button
                        onClick={() => handlePropertyTypeSelect('sale')}
                        variant="outline"
                        className="h-16 text-xl border-2 border-[#49CA38] text-[#49CA38] hover:bg-[#49CA38] hover:text-white font-['Kanit']"
                      >
                        Property for sale
                      </Button>
                    </div>
                  )}

                  {step > 0 && step < 4 && (
                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
                      {step === 1 && (
                        <>
                          {propertyType === 'rental' ? (
                            <>
                              <div className="flex flex-col w-full">
                                <Label className="mb-2 text-xl font-['Kanit'] text-[#49CA38] text-center">
                                  Tell us about your property
                                </Label>
                                <Input
                                  value={description}
                                  onChange={(e) => setDescription(e.target.value)}
                                  required
                                  className="w-full max-w-[700px] mx-auto font-['Kanit'] border-[#49CA38] focus:border-[#49CA38]"
                                />
                              </div>

                              <div className="flex flex-col w-full">
                                <Label className="mb-2 text-xl font-['Kanit'] text-[#49CA38] text-center">
                                  Which seasons are the most important?
                                </Label>
                                <Input
                                  value={seasons}
                                  onChange={(e) => setSeasons(e.target.value)}
                                  placeholder="e.g. summer, Christmas holidays"
                                  required
                                  className="w-full max-w-[700px] mx-auto font-['Kanit']"
                                />
                              </div>

                              <div className="flex flex-col w-full">
                                <Label className="mb-2 text-xl font-['Kanit'] text-[#49CA38] text-center">
                                  Who is your target audience?
                                </Label>
                                <Input
                                  value={audience}
                                  onChange={(e) => setAudience(e.target.value)}
                                  placeholder="e.g. couples, families, remote workers"
                                  required
                                  className="w-full max-w-[700px] mx-auto font-['Kanit']"
                                />
                              </div>

                              <div className="flex flex-col w-full">
                                <Label className="mb-2 text-xl font-['Kanit'] text-[#49CA38] text-center">
                                  Are your customers Finns or others?
                                </Label>
                                <Input
                                  value={customers}
                                  onChange={(e) => setCustomers(e.target.value)}
                                  placeholder="e.g. 70% foreigners, 30% locals"
                                  required
                                  className="w-full max-w-[700px] mx-auto font-['Kanit']"
                                />
                              </div>

                              <div className="flex flex-col w-full">
                                <Label className="mb-4 text-xl font-['Kanit'] text-[#49CA38] text-center">
                                  Occupation days per year: {occupancyDays[0]}
                                </Label>
                                <div className="w-full max-w-[700px] mx-auto px-4">
                                  <Slider
                                    value={occupancyDays}
                                    onValueChange={setOccupancyDays}
                                    max={365}
                                    step={1}
                                    className="w-full"
                                  />
                                  <div className="flex justify-between text-sm text-[#49CA38] font-['Kanit'] mt-2">
                                    <span>0</span>
                                    <span>90</span>
                                    <span>180</span>
                                    <span>270</span>
                                    <span>365</span>
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex flex-col w-full">
                                <Label className="mb-2 text-xl font-['Kanit'] text-[#49CA38] text-center">
                                  Tell us about your property for sale
                                </Label>
                                <Textarea
                                  value={saleDescription}
                                  onChange={(e) => setSaleDescription(e.target.value)}
                                  placeholder="Describe your property: type, condition, special features..."
                                  required
                                  className="w-full max-w-[700px] mx-auto font-['Kanit'] min-h-[100px]"
                                />
                              </div>

                              <div className="flex flex-col w-full">
                                <Label className="mb-2 text-xl font-['Kanit'] text-[#49CA38] text-center">
                                  Property age
                                </Label>
                                <Input
                                  value={propertyAge}
                                  onChange={(e) => setPropertyAge(e.target.value)}
                                  placeholder="e.g. Built in 1995, renovated 2020"
                                  required
                                  className="w-full max-w-[700px] mx-auto font-['Kanit']"
                                />
                              </div>

                              <div className="flex flex-col w-full">
                                <Label className="mb-2 text-xl font-['Kanit'] text-[#49CA38] text-center">
                                  Property size and rooms
                                </Label>
                                <Input
                                  value={rooms}
                                  onChange={(e) => setRooms(e.target.value)}
                                  placeholder="e.g. 85m², 3 rooms + kitchen"
                                  required
                                  className="w-full max-w-[700px] mx-auto font-['Kanit']"
                                />
                              </div>

                              <div className="flex flex-col w-full">
                                <Label className="mb-2 text-xl font-['Kanit'] text-[#49CA38] text-center">
                                  Target buyers
                                </Label>
                                <Input
                                  value={targetBuyers}
                                  onChange={(e) => setTargetBuyers(e.target.value)}
                                  placeholder="e.g. young families, investors, first-time buyers"
                                  required
                                  className="w-full max-w-[700px] mx-auto font-['Kanit']"
                                />
                              </div>

                              <div className="flex flex-col w-full">
                                <Label className="mb-2 text-xl font-['Kanit'] text-[#49CA38] text-center">
                                  Reason for selling
                                </Label>
                                <Input
                                  value={sellingReason}
                                  onChange={(e) => setSellingReason(e.target.value)}
                                  placeholder="e.g. moving abroad, downsizing, investment"
                                  required
                                  className="w-full max-w-[700px] mx-auto font-['Kanit']"
                                />
                              </div>

                              <div className="flex flex-col w-full">
                                <Label className="mb-2 text-xl font-['Kanit'] text-[#49CA38] text-center">
                                  Marketing goals
                                </Label>
                                <Input
                                  value={marketingGoals}
                                  onChange={(e) => setMarketingGoals(e.target.value)}
                                  placeholder="e.g. quick sale, best price, attract specific buyers"
                                  required
                                  className="w-full max-w-[700px] mx-auto font-['Kanit']"
                                />
                              </div>
                            </>
                          )}

                          <div className="flex flex-col w-full">
                            <Label className="mb-2 text-xl font-['Kanit'] text-[#49CA38] text-center">
                              Location of your listing
                            </Label>
                            <Input
                              value={location}
                              onChange={(e) => setLocation(e.target.value)}
                              placeholder="e.g. Helsinki, Finland"
                              required
                              className="w-full max-w-[700px] mx-auto font-['Kanit']"
                            />
                          </div>

                          <div className="flex flex-col w-full">
                            <Label className="mb-2 text-xl font-['Kanit'] text-[#49CA38] text-center">
                              Listing link (if any)
                            </Label>
                            <Input
                              type="url"
                              value={listingLink}
                              onChange={(e) => setListingLink(e.target.value)}
                              placeholder="https://www.example.com/your-listing/..."
                              className="w-full max-w-[700px] mx-auto font-['Kanit']"
                            />
                          </div>

                          <div className="flex flex-col w-full">
                            <Label className="mb-4 text-xl font-['Kanit'] text-[#49CA38] text-center">
                              What do you want to improve?
                            </Label>
                            <div className="flex flex-wrap gap-5 justify-center">
                              {improvementOptions.map((option) => (
                                <div key={option} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={option}
                                    checked={selectedImprovements.includes(option)}
                                    onCheckedChange={(checked) => handleImprovementChange(option, checked as boolean)}
                                    className="border-2 border-[#49CA38] data-[state=checked]:bg-[#49CA38]"
                                  />
                                  <Label htmlFor={option} className="text-lg font-['Kanit'] text-[#49CA38] cursor-pointer">
                                    {option}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-col w-full">
                            <Label className="mb-4 text-xl font-['Kanit'] text-[#49CA38] text-center">
                              Your budget (EUR): {budget[0]}€
                            </Label>
                            <div className="w-full max-w-[700px] mx-auto px-4">
                              <Slider
                                value={budget}
                                onValueChange={setBudget}
                                max={1000}
                                step={1}
                                className="w-full"
                              />
                              <div className="flex justify-between text-sm text-[#49CA38] font-['Kanit'] mt-2">
                                <span>0€</span>
                                <span>250€</span>
                                <span>500€</span>
                                <span>750€</span>
                                <span>1000€</span>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {step === 2 && (
                        <>
                          {selectedImprovements.includes('photos') && (
                            <div className="flex flex-col w-full">
                              <Label className="mb-2 text-xl font-['Kanit'] text-[#49CA38] text-center">
                                Add photos from your listing
                              </Label>
                              <Input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => setAdPhotos(e.target.files)}
                                className="w-full max-w-[700px] mx-auto font-['Kanit']"
                              />
                              {renderImagePreviews()}
                            </div>
                          )}

                          {selectedImprovements.includes('description and title') && (
                            <>
                              <div className="flex flex-col w-full">
                                <Label className="mb-2 text-xl font-['Kanit'] text-[#49CA38] text-center">
                                  Description from the listing
                                </Label>
                                <Textarea
                                  rows={4}
                                  value={adDescription}
                                  onChange={(e) => setAdDescription(e.target.value)}
                                  placeholder="Paste your current ad description here..."
                                  required
                                  className="w-full max-w-[700px] mx-auto font-['Kanit']"
                                />
                              </div>

                              <div className="flex flex-col w-full">
                                <Label className="mb-2 text-xl font-['Kanit'] text-[#49CA38] text-center">
                                  Title from the listing
                                </Label>
                                <Input
                                  value={adTitle}
                                  onChange={(e) => setAdTitle(e.target.value)}
                                  placeholder="Enter your ad title here..."
                                  required
                                  className="w-full max-w-[700px] mx-auto font-['Kanit']"
                                />
                              </div>
                            </>
                          )}

                          {selectedImprovements.includes('interior design') && (
                            <div className="flex flex-col w-full">
                              <Label className="mb-2 text-xl font-['Kanit'] text-[#49CA38] text-center">
                                Interior design notes
                              </Label>
                              <Textarea
                                rows={3}
                                value={interiorDesignNotes}
                                onChange={(e) => setInteriorDesignNotes(e.target.value)}
                                placeholder="Leave any notes related to interior design here..."
                                className="w-full max-w-[700px] mx-auto font-['Kanit']"
                              />
                            </div>
                          )}

                          {selectedImprovements.length === 0 && (
                            <div className="text-center text-[#49CA38] font-['Kanit'] text-lg">
                              No improvements selected. You can skip this step.
                            </div>
                          )}
                        </>
                      )}

                      {step === 3 && (
                        <>
                          <div className="flex flex-col w-full">
                            <Label className="mb-2 text-xl font-['Kanit'] text-[#49CA38] text-center">
                              Your full name, please
                            </Label>
                            <Input
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              required
                              className="w-full max-w-[700px] mx-auto font-['Kanit']"
                            />
                          </div>

                          <div className="flex flex-col w-full">
                            <Label className="mb-2 text-xl font-['Kanit'] text-[#49CA38] text-center">
                              Email where we will contact you
                            </Label>
                            <Input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                              className="w-full max-w-[700px] mx-auto font-['Kanit']"
                            />
                          </div>

                          <div className="flex flex-col w-full">
                            <Label className="mb-2 text-xl font-['Kanit'] text-[#49CA38] text-center">
                              Phone number
                            </Label>
                            <Input
                              type="tel"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              placeholder="+358 ..."
                              required
                              className="w-full max-w-[700px] mx-auto font-['Kanit']"
                            />
                          </div>
                        </>
                      )}

                      <div className="flex justify-between w-full max-w-[700px] mx-auto mt-5">
                        {step > 0 && (
                          <Button
                            type="button"
                            onClick={handleBack}
                            className="bg-[#49CA38] hover:bg-[#3ab42f] text-white font-['Kanit'] text-lg px-6 py-2"
                          >
                            Back
                          </Button>
                        )}

                        {step < 3 && (
                          <Button
                            type="button"
                            onClick={handleNext}
                            className="bg-[#49CA38] hover:bg-[#3ab42f] text-white font-['Kanit'] text-lg px-6 py-2 ml-auto"
                          >
                            Next
                          </Button>
                        )}

                        {step === 3 && (
                          <Button
                            type="submit"
                            className="bg-[#49CA38] hover:bg-[#3ab42f] text-white font-['Kanit'] text-lg px-6 py-2 ml-auto"
                          >
                            Submit
                          </Button>
                        )}
                      </div>
                    </form>
                  )}

                  {step === 4 && (
                    <div className="w-full max-w-4xl bg-gray-50 p-8 rounded-lg">
                      <h3 className="text-3xl font-['Kanit'] text-[#49CA38] mb-6 text-center">
                        Review your information
                      </h3>

                      <div className="space-y-4">
                        <div className="text-lg font-['Kanit'] text-gray-700">
                          <span className="font-semibold text-[#49CA38]">Property type:</span> {propertyType === 'rental' ? 'Short-term rental' : 'Property for sale'}
                        </div>

                        {propertyType === 'rental' ? (
                          <>
                            <div className="text-lg font-['Kanit'] text-gray-700">
                              <span className="font-semibold text-[#49CA38]">Property description:</span> {description}
                            </div>
                            <div className="text-lg font-['Kanit'] text-gray-700">
                              <span className="font-semibold text-[#49CA38]">Seasons:</span> {seasons}
                            </div>
                            <div className="text-lg font-['Kanit'] text-gray-700">
                              <span className="font-semibold text-[#49CA38]">Target audience:</span> {audience}
                            </div>
                            <div className="text-lg font-['Kanit'] text-gray-700">
                              <span className="font-semibold text-[#49CA38]">Customers:</span> {customers}
                            </div>
                            <div className="text-lg font-['Kanit'] text-gray-700">
                              <span className="font-semibold text-[#49CA38]">Occupation days per year:</span> {occupancyDays[0]}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="text-lg font-['Kanit'] text-gray-700">
                              <span className="font-semibold text-[#49CA38]">Property description:</span> {saleDescription}
                            </div>
                            <div className="text-lg font-['Kanit'] text-gray-700">
                              <span className="font-semibold text-[#49CA38]">Property age:</span> {propertyAge}
                            </div>
                            <div className="text-lg font-['Kanit'] text-gray-700">
                              <span className="font-semibold text-[#49CA38]">Size and rooms:</span> {rooms}
                            </div>
                            <div className="text-lg font-['Kanit'] text-gray-700">
                              <span className="font-semibold text-[#49CA38]">Target buyers:</span> {targetBuyers}
                            </div>
                            <div className="text-lg font-['Kanit'] text-gray-700">
                              <span className="font-semibold text-[#49CA38]">Selling reason:</span> {sellingReason}
                            </div>
                            <div className="text-lg font-['Kanit'] text-gray-700">
                              <span className="font-semibold text-[#49CA38]">Marketing goals:</span> {marketingGoals}
                            </div>
                          </>
                        )}

                        <div className="text-lg font-['Kanit'] text-gray-700">
                          <span className="font-semibold text-[#49CA38]">Location:</span> {location}
                        </div>
                        <div className="text-lg font-['Kanit'] text-gray-700">
                          <span className="font-semibold text-[#49CA38]">Listing link:</span>{' '}
                          {listingLink ? (
                            <a href={listingLink} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                              {listingLink}
                            </a>
                          ) : (
                            '—'
                          )}
                        </div>
                        <div className="text-lg font-['Kanit'] text-gray-700">
                          <span className="font-semibold text-[#49CA38]">Improvements:</span>{' '}
                          {selectedImprovements.length > 0 ? selectedImprovements.join(', ') : '—'}
                        </div>
                        <div className="text-lg font-['Kanit'] text-gray-700">
                          <span className="font-semibold text-[#49CA38]">Budget (EUR):</span> {budget[0]}€
                        </div>

                        {selectedImprovements.includes('photos') && (
                          <div className="text-lg font-['Kanit'] text-gray-700">
                            <span className="font-semibold text-[#49CA38]">Photos uploaded:</span>
                            {adPhotos && adPhotos.length > 0 ? (
                              <div className="flex flex-wrap gap-4 mt-3">
                                {Array.from(adPhotos).map((file, idx) => {
                                  const url = URL.createObjectURL(file);
                                  return (
                                    <img
                                      key={idx}
                                      src={url}
                                      alt={`preview-${idx}`}
                                      className="w-32 h-24 object-cover border-2 border-[#49CA38] rounded"
                                    />
                                  );
                                })}
                              </div>
                            ) : (
                              ' No photos uploaded'
                            )}
                          </div>
                        )}

                        {selectedImprovements.includes('description and title') && (
                          <>
                            <div className="text-lg font-['Kanit'] text-gray-700">
                              <span className="font-semibold text-[#49CA38]">Ad description:</span> {adDescription}
                            </div>
                            <div className="text-lg font-['Kanit'] text-gray-700">
                              <span className="font-semibold text-[#49CA38]">Ad title:</span> {adTitle}
                            </div>
                          </>
                        )}

                        {selectedImprovements.includes('interior design') && (
                          <div className="text-lg font-['Kanit'] text-gray-700">
                            <span className="font-semibold text-[#49CA38]">Interior design notes:</span> {interiorDesignNotes}
                          </div>
                        )}

                        <div className="text-lg font-['Kanit'] text-gray-700">
                          <span className="font-semibold text-[#49CA38]">Full name:</span> {fullName}
                        </div>
                        <div className="text-lg font-['Kanit'] text-gray-700">
                          <span className="font-semibold text-[#49CA38]">Email:</span> {email}
                        </div>
                        <div className="text-lg font-['Kanit'] text-gray-700">
                          <span className="font-semibold text-[#49CA38]">Phone number:</span> {phoneNumber}
                        </div>
                      </div>

                      <div className="flex justify-between w-full mt-8">
                        <Button
                          type="button"
                          onClick={handleBack}
                          className="bg-[#49CA38] hover:bg-[#3ab42f] text-white font-['Kanit'] text-lg px-6 py-2"
                        >
                          Back
                        </Button>
                        <Button
                          type="button"
                          onClick={handleFinalSubmit}
                          className="bg-[#49CA38] hover:bg-[#3ab42f] text-white font-['Kanit'] text-lg px-6 py-2"
                        >
                          Confirm & Send
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
