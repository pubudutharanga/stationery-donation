// src/components/MultiStepForm/Step1_PersonalInfo.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { User, Phone, Mail, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
// FIXED: Changed to correct path
import { useLanguage } from '../../contexts/LanguageContext';
import { getTranslation } from '../../i18n/languageUtils';

const Step1_PersonalInfo = () => {
  const { register, formState: { errors }, watch } = useFormContext();
  const { language } = useLanguage();
  const [fieldStatus, setFieldStatus] = useState({});
  const [focusedField, setFocusedField] = useState(null);

  const fields = [
    {
      name: 'fullName',
      icon: User,
      label: getTranslation('fullName', language),
      type: 'text',
      required: true,
      validation: {
        required: getTranslation('required', language) || 'This field is required',
        minLength: { 
          value: 2, 
          message: getTranslation('minLength', language) || 'Minimum 2 characters' 
        },
        maxLength: {
          value: 100,
          message: 'Maximum 100 characters'
        }
      }
    },
    {
      name: 'phone',
      icon: Phone,
      label: getTranslation('phone', language),
      type: 'tel',
      required: true,
      validation: {
        required: getTranslation('required', language) || 'Phone number is required',
        pattern: {
          value: /^\+?[\d\s-]{10,15}$/,
          message: getTranslation('invalidPhone', language) || 'Valid phone number required'
        }
      }
    },
    {
      name: 'email',
      icon: Mail,
      label: getTranslation('email', language),
      type: 'email',
      required: false,
      validation: {
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: getTranslation('invalidEmail', language) || 'Please enter a valid email'
        }
      }
    },
    {
      name: 'city',
      icon: MapPin,
      label: getTranslation('city', language),
      type: 'text',
      required: true,
      validation: {
        required: getTranslation('required', language) || 'City is required',
        minLength: { 
          value: 2, 
          message: getTranslation('minLength', language) || 'Minimum 2 characters' 
        },
        maxLength: {
          value: 50,
          message: 'Maximum 50 characters'
        }
      }
    }
  ];

  // Simple validation status update
  useEffect(() => {
    const subscription = watch((value) => {
      fields.forEach(field => {
        const fieldValue = value[field.name];
        if (fieldValue && fieldValue.length > 0) {
          if (errors[field.name]) {
            setFieldStatus(prev => ({ ...prev, [field.name]: 'error' }));
          } else {
            setFieldStatus(prev => ({ ...prev, [field.name]: 'valid' }));
          }
        } else {
          setFieldStatus(prev => ({ ...prev, [field.name]: 'idle' }));
        }
      });
    });
    
    return () => subscription.unsubscribe();
  }, [watch, errors]);

  const getCompletionPercentage = () => {
    const filledFields = fields.filter(field => {
      const value = watch(field.name);
      return value && value.trim().length > 0;
    }).length;
    
    return Math.round((filledFields / fields.length) * 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center mb-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-mesh-sky/20 to-mesh-teal/20 border border-mesh-sky/30 mb-4"
        >
          <User className="w-7 h-7 text-mesh-sky" />
        </motion.div>
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          {getTranslation('step1', language)}
        </h3>
        <p className="text-gray-700 max-w-lg mx-auto">
          {getTranslation('step1_description', language) || 'Tell us about yourself so we can coordinate the donation pickup'}
        </p>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((field, index) => {
          const value = watch(field.name) || '';
          const error = errors[field.name];
          const status = fieldStatus[field.name];
          const isFocused = focusedField === field.name;
          
          return (
            <motion.div
              key={field.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="relative">
                {/* Premium Glass Input Field */}
                <input
                  {...register(field.name, field.validation)}
                  type={field.type}
                  placeholder=""
                  onFocus={() => setFocusedField(field.name)}
                  onBlur={() => setFocusedField(null)}
                  className={`
                    peer w-full pt-7 pb-3 px-4 rounded-xl
                    backdrop-blur-lg
                    ${field.icon ? 'pl-12' : 'pl-4'}
                    ${error 
                      ? 'border-2 border-red-500/50 focus:border-red-600 focus:shadow-[0_0_20px_rgba(239,68,68,0.2)]' 
                      : status === 'valid'
                      ? 'border-2 border-emerald-500/30 focus:border-emerald-600 focus:shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                      : 'border border-white/40 focus:border-mesh-sky focus:shadow-[0_0_20px_rgba(79,172,254,0.3)]'
                    }
                    bg-gradient-to-br from-white/20 to-white/10
                    text-gray-900 placeholder-transparent
                    focus:outline-none focus:ring-2 focus:ring-white/20
                    transition-all duration-300
                    ${error ? 'pr-12' : 'pr-4'}
                    shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]
                  `}
                  maxLength={field.validation.maxLength?.value || 100}
                />
                
                {/* Field Icon */}
                <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                
                {/* Floating Label */}
                <label
                  htmlFor={field.name}
                  className="
                    absolute left-12 top-2 text-xs font-medium
                    text-gray-600 peer-placeholder-shown:text-sm
                    peer-placeholder-shown:top-5 peer-focus:top-2
                    peer-focus:text-xs transition-all duration-200
                    pointer-events-none truncate max-w-[calc(100%-3rem)]
                  "
                >
                  {field.label}
                  {field.required && <span className="text-red-600 ml-1">*</span>}
                </label>

                {/* Status Icons */}
                <AnimatePresence>
                  {status === 'valid' && !error && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                    >
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    </motion.div>
                  )}
                  
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                    >
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Glass Blur Effect Layer */}
                <div className={`
                  absolute inset-0 rounded-xl pointer-events-none
                  backdrop-blur-xl
                  transition-opacity duration-300
                  ${isFocused ? 'opacity-100' : 'opacity-0'}
                `} />
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-sm text-red-600 flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error.message}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Character Counter */}
              {field.type === 'text' && (
                <div className="text-right">
                  <span className={`text-xs ${
                    value.length >= (field.validation.maxLength?.value || 100) 
                      ? 'text-red-600' 
                      : 'text-gray-500'
                  }`}>
                    {value.length} / {field.validation.maxLength?.value || 100}
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Progress Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-10 p-4 rounded-xl backdrop-blur-xl bg-gradient-to-br from-white/20 to-white/10 border border-white/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-700">Profile Completion</span>
          <span className="text-sm font-medium text-gray-900">
            {getCompletionPercentage()}%
          </span>
        </div>
        <div className="h-2 rounded-full bg-white/20 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${getCompletionPercentage()}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-mesh-sky to-mesh-teal rounded-full shadow-[0_0_10px_rgba(79,172,254,0.5)]"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Step1_PersonalInfo;