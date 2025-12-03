// src/components/MultiStepForm/Step3_ReviewSubmit.jsx
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Package, 
  FileText, 
  MessageSquare, 
  Calendar,
  CheckCircle, 
  AlertCircle 
} from 'lucide-react';
// FIXED: Changed to correct paths
import { useLanguage } from '../../contexts/LanguageContext';
import { getTranslation } from '../../i18n/languageUtils';
import { CONFIG } from '../../constants/api';

const Step3_ReviewSubmit = () => {
  const { watch, formState: { errors } } = useFormContext();
  const { language } = useLanguage();
  
  const formData = watch();
  
  const donationItems = useMemo(() => ({
    notebooks: getTranslation('notebooks', language),
     pastExamBooks: getTranslation('pastExamBooks', language) || 'Past Exam Books',
    pens: getTranslation('pens', language),
    backpacks: getTranslation('backpacks', language),
    waterBottles: getTranslation('waterBottles', language) || 'School Water Bottles',
    shoes: getTranslation('shoes', language) || 'Shoes',
    crayons: getTranslation('crayons', language),
    other: getTranslation('other', language)
  }), [language]);

  const formatPhoneNumber = (phone) => {
    if (!phone) return getTranslation('notProvided', language) || 'Not provided';
    
    // Format Sri Lankan phone numbers
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.startsWith('94')) {
      const digits = cleaned.slice(2);
      if (digits.length <= 2) return `+94 ${digits}`;
      if (digits.length <= 5) return `+94 ${digits.slice(0, 2)} ${digits.slice(2)}`;
      return `+94 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 9)}`;
    }
    
    if (cleaned.startsWith('0')) {
      const digits = cleaned.slice(1);
      if (digits.length <= 2) return `0${digits}`;
      if (digits.length <= 5) return `0${digits.slice(0, 2)} ${digits.slice(2)}`;
      return `0${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 9)}`;
    }
    
    return phone;
  };

  const formatDate = () => {
    return new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const sections = [
    {
      title: getTranslation('step1', language),
      icon: User,
      fields: [
        { 
          name: 'fullName',
          label: getTranslation('fullName', language), 
          value: formData.fullName, 
          icon: User,
          format: (val) => val,
          required: true
        },
        { 
          name: 'phone',
          label: getTranslation('phone', language), 
          value: formData.phone, 
          icon: Phone,
          format: formatPhoneNumber,
          required: true
        },
        { 
          name: 'email',
          label: getTranslation('email', language), 
          value: formData.email, 
          icon: Mail,
          format: (val) => val || getTranslation('notProvided', language) || 'Not provided',
          required: false
        },
        { 
          name: 'city',
          label: getTranslation('city', language), 
          value: formData.city, 
          icon: MapPin,
          format: (val) => val || getTranslation('notProvided', language) || 'Not provided',
          required: true
        }
      ]
    },
    {
      title: getTranslation('step2', language),
      icon: Package,
      fields: [
        { 
          name: 'itemType',
          label: getTranslation('whatToDonate', language), 
          value: donationItems[formData.itemType], 
          icon: Package,
          format: (val) => val || getTranslation('notSelected', language) || 'Not selected',
          required: true
        },
        { 
          name: 'itemDetails',
          label: getTranslation('itemDetails', language), 
          value: formData.itemDetails, 
          icon: FileText,
          format: (val) => val || getTranslation('noDetailsProvided', language) || 'No details provided',
          required: false
        },
        { 
          name: 'quantity',
          label: getTranslation('quantity', language), 
          value: formData.quantity, 
          icon: null,
          format: (val) => val?.toString() || '1',
          required: true
        },
        { 
          name: 'notes',
          label: getTranslation('additionalNotes', language), 
          value: formData.notes, 
          icon: MessageSquare,
          format: (val) => val || getTranslation('noAdditionalNotes', language) || 'No additional notes',
          required: false
        }
      ]
    }
  ];

  const getFieldValue = (value, formatter) => {
    if (!value && value !== 0) return getTranslation('notProvided', language) || 'Not provided';
    if (formatter) return formatter(value);
    if (typeof value === 'string' && value.trim() === '') return getTranslation('notProvided', language) || 'Not provided';
    return value;
  };

  const isFormComplete = () => {
    const requiredFields = ['fullName', 'phone', 'city', 'itemType', 'quantity'];
    return requiredFields.every(field => {
      const value = formData[field];
      return value && (typeof value !== 'string' || value.trim().length > 0);
    });
  };

  const missingFields = useMemo(() => {
    const requiredFields = [
      { name: 'fullName', label: getTranslation('fullName', language) },
      { name: 'phone', label: getTranslation('phone', language) },
      { name: 'city', label: getTranslation('city', language) },
      { name: 'itemType', label: getTranslation('whatToDonate', language) },
      { name: 'quantity', label: getTranslation('quantity', language) }
    ];
    
    return requiredFields.filter(field => {
      const value = formData[field.name];
      return !value || (typeof value === 'string' && value.trim().length === 0);
    }).map(f => f.label);
  }, [formData, language]);

  return (
    <div className="space-y-8" role="form" aria-label="Review and submit donation form">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 mb-4"
          aria-hidden="true"
        >
          <CheckCircle className="w-8 h-8 text-white" />
        </motion.div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {getTranslation('step3', language)}
        </h3>
        <p className="text-gray-700 max-w-lg mx-auto">
          {getTranslation('step3_description', language) || 'Review your donation details before submitting. All information will be sent via WhatsApp.'}
        </p>
      </div>

      {/* Form Completion Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 rounded-xl border ${isFormComplete() ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-amber-500/30 bg-amber-500/10'}`}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center gap-3">
          {isFormComplete() ? (
            <CheckCircle className="w-5 h-5 text-emerald-600" aria-hidden="true" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-600" aria-hidden="true" />
          )}
          <div>
            <p className="text-gray-900 font-medium">
              {isFormComplete() ? 
                (getTranslation('readyToSubmit', language) || 'Ready to submit!') : 
                (getTranslation('almostThere', language) || 'Almost there!')}
            </p>
            <p className="text-gray-700 text-sm">
              {isFormComplete() 
                ? (getTranslation('allInformationComplete', language) || 'All required information is complete.')
                : (getTranslation('reviewMissingInformation', language) || 'Please review missing information below.')}
            </p>
            {!isFormComplete() && missingFields.length > 0 && (
              <p className="text-amber-700 text-sm mt-1">
                {getTranslation('missing', language) || 'Missing'}: {missingFields.join(', ')}
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Review Sections */}
      <div className="space-y-6">
        {sections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
            className="bg-white/30 rounded-xl p-6 border border-gray-300"
            aria-labelledby={`section-${sectionIndex}-title`}
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-300">
              <div className="w-10 h-10 rounded-lg bg-mesh-sky/20 flex items-center justify-center" aria-hidden="true">
                <section.icon className="w-5 h-5 text-mesh-sky" />
              </div>
              <h4 id={`section-${sectionIndex}-title`} className="text-lg font-semibold text-gray-900">
                {section.title}
              </h4>
            </div>
            
            <div className="space-y-4">
              {section.fields.map((field, fieldIndex) => {
                const isEmpty = !field.value || (typeof field.value === 'string' && field.value.trim() === '');
                
                return (
                  <div 
                    key={fieldIndex} 
                    className={`flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 py-3 border-b border-gray-200 last:border-0 ${field.required && isEmpty ? 'bg-red-500/5 rounded-lg -mx-2 px-2' : ''}`}
                  >
                    <div className="flex items-center gap-2 text-sm text-gray-700 min-w-[180px]">
                      {field.icon && <field.icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />}
                      <span>
                        {field.label}
                        {field.required && (
                          <>
                            <span className="text-red-600 ml-1" aria-hidden="true">*</span>
                            <span className="sr-only">required</span>
                          </>
                        )}
                        {!field.required && (
                          <span className="text-gray-500 ml-1">({getTranslation('optional', language) || 'Optional'})</span>
                        )}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className={`text-gray-900 font-medium break-words ${field.required && isEmpty ? 'text-red-700' : ''}`}>
                        {getFieldValue(field.value, field.format)}
                        {field.required && isEmpty && (
                          <span className="text-red-700 text-sm ml-2">
                            ({getTranslation('required', language) || 'Required'})
                          </span>
                        )}
                      </p>
                      {field.name && errors[field.name] && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors[field.name].message}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Submission Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-mesh-sky/10 to-mesh-teal/10 rounded-xl p-6 border border-gray-300"
      >
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0" aria-hidden="true">
            <span className="text-2xl">📱</span>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-2">
              {getTranslation('whatsappSubmission', language) || 'WhatsApp Submission'}
            </h4>
            <p className="text-gray-700 text-sm mb-4">
              {getTranslation('whatsappInfo', language) || 
                "We'll open WhatsApp with a pre-filled message for the administrator to coordinate collection."}
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {getTranslation('automaticWhatsApp', language) || 'Automatic WhatsApp Opening'}
                  </p>
                  <p className="text-xs text-gray-600">
                    {getTranslation('messageWillOpen', language) || 'Message will open in WhatsApp automatically'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-mesh-sky/20 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                  <Calendar className="w-4 h-4 text-mesh-sky" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {getTranslation('24hourResponse', language) || '24-Hour Response'}
                  </p>
                  <p className="text-xs text-gray-600">
                    {getTranslation('adminWillContact', language) || 'Admin will contact you within 24 hours'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Submission Summary */}
            <div className="mt-6 pt-4 border-t border-gray-300">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">
                  {getTranslation('submissionDate', language) || 'Submission Date'}:
                </span>
                <span className="text-gray-900 font-medium">{formatDate()}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-700">
                  {getTranslation('adminContact', language) || 'Admin Contact'}:
                </span>
                <span className="text-gray-900 font-medium">
                  {CONFIG.WHATSAPP_NUMBER.replace(/(\d{2})(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Data Privacy Notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="p-4 rounded-xl bg-white/30 border border-gray-300"
      >
        <p className="text-sm text-gray-700 text-center">
          {getTranslation('privacyNotice', language) || 
            'Your information is only used for donation coordination and will not be shared with third parties. All data is deleted after 90 days.'}
        </p>
      </motion.div>
    </div>
  );
};

export default Step3_ReviewSubmit;