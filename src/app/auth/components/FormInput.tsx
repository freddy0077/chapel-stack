"use client";

import { ReactNode, useState, InputHTMLAttributes } from 'react';
import './AuthStyles.css';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onRightIconClick?: () => void;
}

export default function FormInput({
  label,
  name,
  error,
  leftIcon,
  rightIcon,
  onRightIconClick,
  className,
  ...props
}: FormInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <div className="form-group">
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          id={name}
          name={name}
          className={`
            form-input 
            ${leftIcon ? 'pl-10' : ''} 
            ${rightIcon ? 'pr-10' : ''} 
            ${error ? 'error' : ''}
            ${isFocused ? 'ring-2 ring-indigo-500 ring-opacity-50' : ''}
            ${className || ''}
          `}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {rightIcon && (
          <div 
            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
            onClick={onRightIconClick}
          >
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
