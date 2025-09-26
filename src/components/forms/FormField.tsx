import * as React from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { ResponsiveButton } from '@/components/ui/responsive-button';

interface BaseFieldProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  disabled?: boolean;
}

interface InputFieldProps extends BaseFieldProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  maxLength?: number;
  minLength?: number;
  autoComplete?: string;
}

interface TextareaFieldProps extends BaseFieldProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  rows?: number;
  maxLength?: number;
  resize?: boolean;
}

interface SelectFieldProps extends BaseFieldProps {
  value?: string;
  onChange?: (value: string) => void;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  placeholder?: string;
}

// Input Field Component
export const FormInputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({
    label,
    error,
    hint,
    required,
    className,
    labelClassName,
    inputClassName,
    type = 'text',
    placeholder,
    value,
    onChange,
    onBlur,
    onFocus,
    icon,
    iconPosition = 'left',
    disabled,
    maxLength,
    minLength,
    autoComplete,
    ...props
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);
    const inputId = React.useId();

    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    const handleFocus = () => {
      setIsFocused(true);
      onFocus?.();
    };

    const handleBlur = () => {
      setIsFocused(false);
      onBlur?.();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.value);
    };

    return (
      <div className={cn('space-y-2', className)}>
        {label && (
          <Label
            htmlFor={inputId}
            className={cn(
              'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
              'sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl',
              error && 'text-destructive',
              labelClassName
            )}
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}
          
          <Input
            ref={ref}
            id={inputId}
            type={inputType}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            maxLength={maxLength}
            minLength={minLength}
            autoComplete={autoComplete}
            className={cn(
              'h-10 sm:h-11 lg:h-12 xl:h-14 2xl:h-16',
              'text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl',
              'transition-all duration-300',
              icon && iconPosition === 'left' && 'pl-10 sm:pl-11 lg:pl-12',
              (icon && iconPosition === 'right') || isPassword ? 'pr-10 sm:pr-11 lg:pr-12' : '',
              error && 'border-destructive focus:border-destructive',
              isFocused && 'ring-2 ring-primary/20',
              inputClassName
            )}
            {...props}
          />
          
          {icon && iconPosition === 'right' && !isPassword && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}
          
          {isPassword && (
            <ResponsiveButton
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </ResponsiveButton>
          )}
        </div>
        
        {(error || hint) && (
          <div className="space-y-1">
            {error && (
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm lg:text-base">{error}</span>
              </div>
            )}
            {hint && !error && (
              <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">{hint}</p>
            )}
          </div>
        )}
        
        {maxLength && value && (
          <div className="flex justify-end">
            <span className={cn(
              'text-xs text-muted-foreground',
              value.length > maxLength * 0.9 && 'text-orange-500',
              value.length >= maxLength && 'text-destructive'
            )}>
              {value.length}/{maxLength}
            </span>
          </div>
        )}
      </div>
    );
  }
);

// Textarea Field Component
export const FormTextareaField = React.forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({
    label,
    error,
    hint,
    required,
    className,
    labelClassName,
    inputClassName,
    placeholder,
    value,
    onChange,
    onBlur,
    onFocus,
    rows = 4,
    maxLength,
    resize = true,
    disabled,
    ...props
  }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const inputId = React.useId();

    const handleFocus = () => {
      setIsFocused(true);
      onFocus?.();
    };

    const handleBlur = () => {
      setIsFocused(false);
      onBlur?.();
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(e.target.value);
    };

    return (
      <div className={cn('space-y-2', className)}>
        {label && (
          <Label
            htmlFor={inputId}
            className={cn(
              'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
              'sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl',
              error && 'text-destructive',
              labelClassName
            )}
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        
        <Textarea
          ref={ref}
          id={inputId}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          rows={rows}
          maxLength={maxLength}
          className={cn(
            'min-h-[80px] sm:min-h-[100px] lg:min-h-[120px]',
            'text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl',
            'transition-all duration-300',
            !resize && 'resize-none',
            error && 'border-destructive focus:border-destructive',
            isFocused && 'ring-2 ring-primary/20',
            inputClassName
          )}
          {...props}
        />
        
        {(error || hint) && (
          <div className="space-y-1">
            {error && (
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm lg:text-base">{error}</span>
              </div>
            )}
            {hint && !error && (
              <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">{hint}</p>
            )}
          </div>
        )}
        
        {maxLength && value && (
          <div className="flex justify-end">
            <span className={cn(
              'text-xs text-muted-foreground',
              value.length > maxLength * 0.9 && 'text-orange-500',
              value.length >= maxLength && 'text-destructive'
            )}>
              {value.length}/{maxLength}
            </span>
          </div>
        )}
      </div>
    );
  }
);

// Select Field Component
export const FormSelectField = React.forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({
    label,
    error,
    hint,
    required,
    className,
    labelClassName,
    inputClassName,
    value,
    onChange,
    options,
    placeholder,
    disabled,
    ...props
  }, ref) => {
    const inputId = React.useId();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange?.(e.target.value);
    };

    return (
      <div className={cn('space-y-2', className)}>
        {label && (
          <Label
            htmlFor={inputId}
            className={cn(
              'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
              'sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl',
              error && 'text-destructive',
              labelClassName
            )}
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        
        <select
          ref={ref}
          id={inputId}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2',
            'text-sm ring-offset-background transition-all duration-300',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'sm:h-11 sm:text-base lg:h-12 lg:text-lg xl:h-14 xl:text-xl 2xl:h-16 2xl:text-2xl',
            error && 'border-destructive focus:border-destructive',
            inputClassName
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        
        {(error || hint) && (
          <div className="space-y-1">
            {error && (
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm lg:text-base">{error}</span>
              </div>
            )}
            {hint && !error && (
              <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">{hint}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

FormInputField.displayName = 'FormInputField';
FormTextareaField.displayName = 'FormTextareaField';
FormSelectField.displayName = 'FormSelectField';

export { FormInputField, FormTextareaField, FormSelectField };