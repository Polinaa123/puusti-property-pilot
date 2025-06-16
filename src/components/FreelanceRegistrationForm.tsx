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
import { auth, db, storage } from '../utils/firebase'
import {createUserWithEmailAndPassword} from 'firebase/auth'
import {doc, setDoc, serverTimestamp} from 'firebase/firestore'
import {ref, uploadBytes, getDownloadURL} from 'firebase/storage'
import { useNavigate } from 'react-router-dom';
import FreelancerSuccess from './FreelancerSuccess';

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
  const navigate = useNavigate();
  const [isDone, setIsDone] = useState(false);

  const serviceOptions = [
    'photography',
    'copywriting',
    'interior design',
  ];

  const onSubmit = async (data: FreelancerFormData) => {
    setIsSubmitting(true)
    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      )
      const uid = cred.user.uid

      const fileUrls: string[] = []
      setIsDone(true);
    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i].file
      const storageRef = ref(
        storage,
        `freelancers/${uid}/samples/${file.name}`
      )
      await uploadBytes(storageRef, file)
      const url = await getDownloadURL(storageRef)
      fileUrls.push(url)
    }

    await setDoc(doc(db, 'freelancers', uid), {
      fullName: data.fullName,
      email: data.email,
      phone: data.phoneNumber,
      location: data.location,
      servicesOffered: data.servicesOffered,
      hourlyRate: data.hourlyRate,
      experienceLevel: data.experienceLevel,
      portfolioUrls: data.portfolioUrls.map(u => u.url),
      sampleFiles: fileUrls,
      createdAt: serverTimestamp(),
    })

    toast({
      title: "registration successful! thanks!",
      description: "your freelancer profile has been created successfully",
    })
  } catch (error: any) {
    console.error(error)
    toast({
      title: "Registration Failed",
      description: error.message || "try again later",
      variant: "destructive",
    })
  } finally {
    setIsSubmitting(false)
  }
}

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

  if (isDone) {
    return <FreelancerSuccess />;
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              freelancer registration
            </CardTitle>
            <p className="text-muted-foreground text-center">
              join our platform and start showcasing your skills
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Personal Information Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">personal information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">full name *</Label>
                    <Input
                      id="fullName"
                      {...register('fullName', { required: 'full name is required' })}
                      className={errors.fullName ? 'border-destructive' : ''}
                    />
                    {errors.fullName && (
                      <p className="text-sm text-destructive">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">email address *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email', {
                        required: 'email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'invalid email address',
                        },
                      })}
                      className={errors.email ? 'border-destructive' : ''}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">phone number *</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      {...register('phoneNumber', { required: 'phone number is required' })}
                      className={errors.phoneNumber ? 'border-destructive' : ''}
                    />
                    {errors.phoneNumber && (
                      <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">location *</Label>
                    <Input
                      id="location"
                      placeholder="city, country"
                      {...register('location', { required: 'location is required' })}
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
                <h3 className="text-xl font-semibold">professional Information</h3>
                
                {/* Services Offered */}
                <div className="space-y-4">
                  <Label>services offered * (select at least one)</Label>
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
                    <p className="text-sm text-destructive">please select at least one service</p>
                  )}
                </div>

                {/* Hourly Rate */}
                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">hourly rate (eur) *</Label>
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
                  <Label>experience level *</Label>
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
                          <Label htmlFor="junior">junior</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="mid-level" id="mid-level" />
                          <Label htmlFor="mid-level">mid-level</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="senior" id="senior" />
                          <Label htmlFor="senior">senior</Label>
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
                <h3 className="text-xl font-semibold">portfolio & samples</h3>
                
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
                    add another link
                  </Button>
                </div>

                {/* File Upload */}
                <div className="space-y-4">
                  <Label htmlFor="sampleFiles">upload work samples</Label>
                  <Input
                    id="sampleFiles"
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    className="cursor-pointer"
                  />
                  <p className="text-sm text-muted-foreground">
                    upload images or PDFs showing your work (max 10MB per file)
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
                <h3 className="text-xl font-semibold">security</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="password">password *</Label>
                    <Input
                      id="password"
                      type="password"
                      {...register('password', {
                        required: 'password is required',
                        minLength: { value: 8, message: 'password must be at least 8 characters' },
                      })}
                      className={errors.password ? 'border-destructive' : ''}
                    />
                    {errors.password && (
                      <p className="text-sm text-destructive">{errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">confirm password *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...register('confirmPassword', {
                        required: 'please confirm your password',
                        validate: (value) =>
                          value === password || 'passwords do not match',
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
                    i agree to the{' '}
                    <a href="#" className="text-primary underline hover:no-underline">
                      terms and conditions
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-primary underline hover:no-underline">
                      privacy policy
                    </a>
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'submitting...' : 'create freelancer profile'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};