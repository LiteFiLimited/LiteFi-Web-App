"use client";

import React from 'react';
import { calculatePasswordStrength, getPasswordStrengthColor } from '@/lib/passwordValidator';

interface PasswordStrengthMeterProps {
  password: string;
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const strength = calculatePasswordStrength(password);
  const color = getPasswordStrengthColor(strength);
  
  // Get label based on strength
  const getStrengthLabel = () => {
    if (strength < 30) return 'Very Weak';
    if (strength < 60) return 'Weak';
    if (strength < 80) return 'Medium';
    return 'Strong';
  };

  return (
    <div className="mt-1 mb-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-500">Password Strength</span>
        <span className={`text-xs font-medium ${
          color === 'red' ? 'text-red-500' : 
          color === 'orange' ? 'text-orange-500' : 
          color === 'yellow' ? 'text-yellow-500' : 
          'text-green-500'
        }`}>
          {getStrengthLabel()}
        </span>
      </div>
      <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${
            color === 'red' ? 'bg-red-500' : 
            color === 'orange' ? 'bg-orange-500' : 
            color === 'yellow' ? 'bg-yellow-500' : 
            'bg-green-500'
          }`} 
          style={{ width: `${strength}%` }}
        />
      </div>
    </div>
  );
}
 