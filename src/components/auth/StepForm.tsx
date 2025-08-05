import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, User, Mail, Lock, Shield, Eye, EyeOff } from 'lucide-react';

interface StepFormProps {
  onSubmit: (data: RegisterData) => Promise<void>;
  isLoading: boolean;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  role?: 'user' | 'admin';
}

const StepForm: React.FC<StepFormProps> = ({ onSubmit, isLoading }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<RegisterData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'user'
  });

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const updateFormData = (field: keyof RegisterData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    await onSubmit(formData);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.firstName.trim() && formData.lastName.trim();
      case 2:
        return formData.username.trim() && formData.email.trim();
      case 3:
        return formData.password && formData.confirmPassword && formData.password === formData.confirmPassword && formData.password.length >= 8;
      default:
        return false;
    }
  };

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1:
        return <User className="w-5 h-5" />;
      case 2:
        return <Mail className="w-5 h-5" />;
      case 3:
        return <Lock className="w-5 h-5" />;
      default:
        return <Shield className="w-5 h-5" />;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Personal Information";
      case 2:
        return "Account Details";
      case 3:
        return "Security Setup";
      default:
        return "Complete";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return "Let's start with your basic information";
      case 2:
        return "Choose your username and email";
      case 3:
        return "Create a secure password";
      default:
        return "You're all set!";
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-card-foreground">First Name</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={(e) => updateFormData('firstName', e.target.value)}
                className="bg-background/50 border-border focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-card-foreground">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={(e) => updateFormData('lastName', e.target.value)}
                className="bg-background/50 border-border focus:border-primary"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-card-foreground">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Choose a unique username"
                value={formData.username}
                onChange={(e) => updateFormData('username', e.target.value)}
                className="bg-background/50 border-border focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-card-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                className="bg-background/50 border-border focus:border-primary"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-card-foreground">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password (min 8 characters)"
                  value={formData.password}
                  onChange={(e) => updateFormData('password', e.target.value)}
                  minLength={8}
                  className="bg-background/50 border-border focus:border-primary pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-card-foreground">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                  minLength={8}
                  className="bg-background/50 border-border focus:border-primary pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-sm text-destructive">Passwords don't match</p>
              )}
              {formData.password && formData.password.length < 8 && (
                <p className="text-sm text-destructive">Password must be at least 8 characters</p>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-md glass border-border/20 shadow-2xl">
      <CardHeader className="text-center space-y-4">
        <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-2xl bg-gradient-primary shadow-primary">
          {getStepIcon(currentStep)}
        </div>
        <div>
          <CardTitle className="text-2xl font-bold gradient-text">{getStepTitle()}</CardTitle>
          <CardDescription className="text-muted-foreground mt-2">
            {getStepDescription()}
          </CardDescription>
        </div>
        <div className="w-full space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {renderStepContent()}
        
        <div className="flex justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          {currentStep < totalSteps ? (
            <Button
              type="button"
              variant="gradient"
              onClick={nextStep}
              disabled={!canProceed()}
              className="flex-1"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="gradient"
              onClick={handleSubmit}
              disabled={!canProceed() || isLoading}
              className="flex-1"
            >
              {isLoading ? 'Creating Account...' : 'Complete Registration'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StepForm;