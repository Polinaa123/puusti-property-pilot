import React, { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { FileImage, ArrowUp, ArrowDown } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

interface FreelancerFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  location: string;
  servicesOffered: string[];
  hourlyRate: number;
  experienceLevel: 'junior' | 'mid-level' | 'senior';
  portfolioUrls: { url: string }[];
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
}

interface FilePreview {
  file: File;
  preview: string;
  type: 'image' | 'pdf';
}

export default function FreelancerRegistrationForm(){
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<FilePreview[]>([]);

  const serviceOptions = [
    'Photography',
    'Copywriting',
    'Interior Design',
  ];

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<FreelancerFormData>({
    defaultValues: {
      portfolioUrls: [{ url: '' }],
      servicesOffered: [],
      termsAccepted: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'portfolioUrls',
  });

  const password = watch('password');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview: FilePreview = {
          file,
          preview: e.target?.result as string,
          type: file.type.startsWith('image/') ? 'image' : 'pdf',
        };
        setUploadedFiles(prev => [...prev, preview]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleServiceChange = (service: string, checked: boolean) => {
    const currentServices = getValues('servicesOffered');
    if (checked) {
      setValue('servicesOffered', [...currentServices, service]);
    } else {
      setValue('servicesOffered', currentServices.filter(s => s !== service));
    }
  };

  const onSubmit = async (data: FreelancerFormData) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      
      Object.entries(data).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      });

      uploadedFiles.forEach((filePreview, index) => {
        formData.append(`sampleFiles_${index}`, filePreview.file);
      });

      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Form Data:', data);
      console.log('Uploaded Files:', uploadedFiles);
      console.log('FormData:', formData);

      toast({
        title: "Registration Successful!",
        description: "Your freelancer profile has been created successfully.",
      });

    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              Freelancer Registration
            </CardTitle>
            <p className="text-muted-foreground text-center">
              Join our platform and start showcasing your skills
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Personal Information Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      {...register('fullName', { required: 'Full name is required' })}
                      className={errors.fullName ? 'border-destructive' : ''}
                    />
                    {errors.fullName && (
                      <p className="text-sm text-destructive">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address',
                        },
                      })}
                      className={errors.email ? 'border-destructive' : ''}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number *</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      {...register('phoneNumber', { required: 'Phone number is required' })}
                      className={errors.phoneNumber ? 'border-destructive' : ''}
                    />
                    {errors.phoneNumber && (
                      <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      placeholder="City, Country"
                      {...register('location', { required: 'Location is required' })}
                      className={errors.location ? 'border-destructive' : ''}
                    />
                    {errors.location && (
                      <p className="text-sm text-destructive">{errors.location.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Professional Information Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Professional Information</h3>
                
                {/* Services Offered */}
                <div className="space-y-4">
                  <Label>Services Offered * (Select at least one)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {serviceOptions.map((service) => (
                      <div key={service} className="flex items-center space-x-2">
                        <Checkbox
                          id={service}
                          onCheckedChange={(checked) => 
                            handleServiceChange(service, checked as boolean)
                          }
                        />
                        <Label htmlFor={service} className="text-sm font-normal">
                          {service}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {errors.servicesOffered && (
                    <p className="text-sm text-destructive">Please select at least one service</p>
                  )}
                </div>

                {/* Hourly Rate */}
                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Hourly Rate (eur) *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">€</span>
                    <Input
                      id="hourlyRate"
                      type="number"
                      min="1"
                      step="0.01"
                      className={`pl-8 ${errors.hourlyRate ? 'border-destructive' : ''}`}
                      {...register('hourlyRate', {
                        required: 'Hourly rate is required',
                        min: { value: 1, message: 'Rate must be at least $1' },
                      })}
                    />
                  </div>
                  {errors.hourlyRate && (
                    <p className="text-sm text-destructive">{errors.hourlyRate.message}</p>
                  )}
                </div>

                {/* Experience Level */}
                <div className="space-y-4">
                  <Label>Experience Level *</Label>
                  <Controller
                    name="experienceLevel"
                    control={control}
                    rules={{ required: 'Please select your experience level' }}
                    render={({ field }) => (
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-row space-x-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="junior" id="junior" />
                          <Label htmlFor="junior">Junior</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="mid-level" id="mid-level" />
                          <Label htmlFor="mid-level">Mid-level</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="senior" id="senior" />
                          <Label htmlFor="senior">Senior</Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                  {errors.experienceLevel && (
                    <p className="text-sm text-destructive">{errors.experienceLevel.message}</p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Portfolio Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Portfolio & Samples</h3>
                
                {/* Portfolio URLs */}
                <div className="space-y-4">
                  <Label>Portfolio URLs</Label>
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <Input
                        placeholder="https://..."
                        {...register(`portfolioUrls.${index}.url` as const)}
                      />
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => remove(index)}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => append({ url: '' })}
                    className="w-full"
                  >
                    <ArrowUp className="h-4 w-4 mr-2" />
                    Add Another Link
                  </Button>
                </div>

                {/* File Upload */}
                <div className="space-y-4">
                  <Label htmlFor="sampleFiles">Upload Work Samples</Label>
                  <Input
                    id="sampleFiles"
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    className="cursor-pointer"
                  />
                  <p className="text-sm text-muted-foreground">
                    Upload images or PDFs showing your work (max 10MB per file)
                  </p>
                  
                  {/* File Previews */}
                  {uploadedFiles.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {uploadedFiles.map((filePreview, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square border-2 border-border rounded-lg overflow-hidden bg-muted">
                            {filePreview.type === 'image' ? (
                              <img
                                src={filePreview.preview}
                                alt={filePreview.file.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <FileImage className="h-12 w-12 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </Button>
                          <p className="text-xs text-muted-foreground mt-1 truncate">
                            {filePreview.file.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Security Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Security</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      {...register('password', {
                        required: 'Password is required',
                        minLength: { value: 8, message: 'Password must be at least 8 characters' },
                      })}
                      className={errors.password ? 'border-destructive' : ''}
                    />
                    {errors.password && (
                      <p className="text-sm text-destructive">{errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: (value) =>
                          value === password || 'Passwords do not match',
                      })}
                      className={errors.confirmPassword ? 'border-destructive' : ''}
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Terms and Submit */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="termsAccepted"
                    {...register('termsAccepted')}
                  />
                  <Label htmlFor="termsAccepted" className="text-sm">
                    I agree to the{' '}
                    <a href="#" className="text-primary underline hover:no-underline">
                      Terms and Conditions
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-primary underline hover:no-underline">
                      Privacy Policy
                    </a>
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Create Freelancer Profile'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};