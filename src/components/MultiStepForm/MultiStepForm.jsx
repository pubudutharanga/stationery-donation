// src/components/MultiStepForm/MultiStepForm.jsx
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, FormProvider } from 'react-hook-form';
// FIXED: Changed to correct paths
import { useLanguage } from '../../contexts/LanguageContext';
import GlassCard from '../GlassCard';
import FormProgress from './FormProgress';
import Step1_PersonalInfo from './Step1_PersonalInfo';
import Step2_DonationDetails from './Step2_DonationDetails';
import Step3_ReviewSubmit from './Step3_ReviewSubmit';
import SuccessModal from './SuccessModal';
import { getTranslation } from '../../i18n/languageUtils';
import { Save, AlertTriangle, Clock, Download, Trash2 } from 'lucide-react';
import { CONFIG } from '../../constants/api';
import debounce from 'lodash/debounce';

// Simple encryption/decryption for demo purposes
const encryptData = (data) => {
  try {
    return btoa(JSON.stringify(data));
  } catch (error) {
    console.error('Encryption error:', error);
    return null;
  }
};

const decryptData = (encrypted) => {
  try {
    return JSON.parse(atob(encrypted));
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [draftStatus, setDraftStatus] = useState(null);
  const [formError, setFormError] = useState(null);
  const [whatsappError, setWhatsappError] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [showDraftManager, setShowDraftManager] = useState(false);
  const formContainerRef = useRef(null);
  const submitButtonRef = useRef(null);
  const { language } = useLanguage();

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      city: '',
      itemType: '',
      itemDetails: '',
      quantity: 1,
      notes: ''
    }
  });

  const { formState: { errors, isValid, isDirty }, watch, trigger, getValues, reset } = methods;

  // Calculate step validity
  const step1Valid = useMemo(() => {
    const values = getValues();
    return !!(values.fullName && values.phone && values.city && !errors.fullName && !errors.phone && !errors.city);
  }, [getValues(), errors]);

  const step2Valid = useMemo(() => {
    const values = getValues();
    return !!(values.itemType && values.quantity && !errors.itemType && !errors.quantity);
  }, [getValues(), errors]);

  // Sanitize form data for storage
  const sanitizeForStorage = useCallback((data) => {
    const sanitized = { ...data };
    
    // Remove timestamp if present
    delete sanitized._timestamp;
    delete sanitized._version;
    
    // Truncate long fields
    if (sanitized.notes && sanitized.notes.length > 1000) {
      sanitized.notes = sanitized.notes.substring(0, 1000);
    }
    
    if (sanitized.itemDetails && sanitized.itemDetails.length > 500) {
      sanitized.itemDetails = sanitized.itemDetails.substring(0, 500);
    }
    
    return sanitized;
  }, []);

  // Auto-save draft with debounce
  const saveDraftToStorage = useCallback(debounce((data) => {
    try {
      if (!isDirty) return;
      
      const sanitized = sanitizeForStorage(data);
      const encrypted = encryptData({
        ...sanitized,
        _timestamp: Date.now(),
        _version: '2.0',
        _step: currentStep
      });
      
      if (encrypted) {
        localStorage.setItem('donationDraft', encrypted);
        localStorage.setItem('donationDraftTime', Date.now().toString());
        setLastSaved(Date.now());
        setDraftStatus('saved');
        setTimeout(() => setDraftStatus(null), 2000);
      }
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  }, 1500), [sanitizeForStorage, isDirty, currentStep]);

  // Auto-save on change
  useEffect(() => {
    const subscription = watch((value) => {
      if (Object.values(value).some(val => val && val.toString().trim())) {
        saveDraftToStorage(value);
      }
    });
    
    return () => {
      subscription.unsubscribe();
      saveDraftToStorage.cancel();
    };
  }, [watch, saveDraftToStorage]);

  // Load draft on mount
  useEffect(() => {
    const loadDraft = () => {
      try {
        const encryptedDraft = localStorage.getItem('donationDraft');
        const savedTime = localStorage.getItem('donationDraftTime');
        
        if (!encryptedDraft) return;

        const decrypted = decryptData(encryptedDraft);
        if (!decrypted) {
          clearDraft();
          return;
        }

        const { _timestamp, _version, _step, ...formData } = decrypted;
        
        // Validate draft age (1 week max)
        const draftAge = _timestamp ? Date.now() - _timestamp : Infinity;
        const isExpired = draftAge > 7 * 24 * 60 * 60 * 1000; // 1 week
        
        if (!isExpired) {
          reset(formData);
          if (_step) setCurrentStep(_step);
          setLastSaved(_timestamp);
          setDraftStatus('loaded');
          setTimeout(() => setDraftStatus(null), 3000);
        } else {
          clearDraft();
          setDraftStatus('expired');
          setTimeout(() => setDraftStatus(null), 3000);
        }
      } catch (error) {
        console.error('Failed to load draft:', error);
        clearDraft();
      }
    };

    loadDraft();
  }, [reset]);

  const validateStep = useCallback(async (step) => {
    const fieldValidations = {
      1: ['fullName', 'phone', 'city'],
      2: ['itemType', 'quantity'],
      3: ['fullName', 'phone', 'city', 'itemType', 'quantity']
    };
    
    const fieldsToValidate = fieldValidations[step];
    if (!fieldsToValidate) return true;
    
    return await trigger(fieldsToValidate);
  }, [trigger]);

  const nextStep = async (e) => {
    e?.preventDefault();
    setFormError(null);
    
    const isValidStep = await validateStep(currentStep);
    if (isValidStep && currentStep < 3) {
      setCurrentStep(prev => prev + 1);
      smoothScroll();
    } else {
      setFormError(getTranslation('completeRequiredFields', language) || 'Please complete all required fields before continuing');
      setTimeout(() => setFormError(null), 3000);
    }
  };

  const prevStep = (e) => {
    e?.preventDefault();
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      smoothScroll();
    }
  };

  const goToStep = async (step) => {
    if (step === currentStep) return;
    
    // Allow going back anytime
    if (step < currentStep) {
      setCurrentStep(step);
      smoothScroll();
      return;
    }
    
    // Validate all previous steps before jumping forward
    let canNavigate = true;
    for (let i = currentStep; i < step; i++) {
      if (!await validateStep(i)) {
        canNavigate = false;
        setFormError(`Please complete step ${i} before jumping to step ${step}`);
        setTimeout(() => setFormError(null), 3000);
        break;
      }
    }
    
    if (canNavigate) {
      setCurrentStep(step);
      smoothScroll();
    }
  };

  const smoothScroll = () => {
    requestAnimationFrame(() => {
      if (formContainerRef.current) {
        formContainerRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start'
        });
      }
    });
  };

  const formatWhatsAppMessage = (data) => {
    const items = {
      notebooks: getTranslation('notebooks', language) || '📓 Notebooks',
      pens: getTranslation('pens', language) || '✏️ Pens/Pencils',
      backpacks: getTranslation('backpacks', language) || '🎒 Backpacks',
      crayons: getTranslation('crayons', language) || '🖍️ Crayons/Markers',
      shoes: getTranslation('shoes', language) || '👟 Shoes',
      pastExamBooks: getTranslation('pastExamBooks', language) || '📚 Past Exam Books',
      waterBottles: getTranslation('waterBottles', language) || '💧 School Water Bottles',
      other: getTranslation('other', language) || '📦 Other Items'
    };

    const timestamp = new Date().toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    return `🎁 *${getTranslation('donationTitle', language) || 'STATIONERY DONATION'}*\n\n` +
      `*${getTranslation('donorInfo', language) || '👤 Donor Information'}*\n` +
      `${getTranslation('name', language) || 'Name'}: ${data.fullName}\n` +
      `${getTranslation('phone', language) || 'Phone'}: ${data.phone}\n` +
      `${getTranslation('email', language) || 'Email'}: ${data.email || getTranslation('notProvided', language) || 'Not provided'}\n` +
      `${getTranslation('city', language) || 'City'}: ${data.city}\n\n` +
      `*${getTranslation('donationDetails', language) || '📦 Donation Details'}*\n` +
      `${getTranslation('item', language) || 'Item'}: ${items[data.itemType] || data.itemType}\n` +
      `${getTranslation('details', language) || 'Details'}: ${data.itemDetails || getTranslation('standardItems', language) || 'Standard items'}\n` +
      `${getTranslation('quantity', language) || 'Quantity'}: ${data.quantity}\n\n` +
      `*${getTranslation('additionalNotes', language) || '📝 Additional Notes'}*\n` +
      `${data.notes || getTranslation('noAdditionalNotes', language) || 'No additional notes'}\n\n` +
      `---\n` +
      `${getTranslation('submitted', language) || 'Submitted'}: ${timestamp}\n` +
      `_${getTranslation('viaPlatform', language) || 'Via Stationery Donation Platform'}_`;
  };

  const handleWhatsAppFallback = () => {
    const userConfirmed = window.confirm(
      getTranslation('whatsappFallbackMessage', language) || 
      'WhatsApp could not be opened automatically. Would you like to copy the message to your clipboard instead?'
    );
    
    if (userConfirmed) {
      const message = formatWhatsAppMessage(getValues());
      navigator.clipboard.writeText(message).then(() => {
        alert(getTranslation('messageCopied', language) || 'Message copied to clipboard. Please paste it into WhatsApp manually.');
      }).catch(() => {
        alert(getTranslation('copyFailed', language) || 'Failed to copy message. Please note down the information and contact us manually.');
      });
    }
  };

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    setFormError(null);
    setWhatsappError(false);
    
    try {
      // Validate all steps before submission
      const allValid = await validateStep(3);
      if (!allValid) {
        setFormError(getTranslation('formIncomplete', language) || 'Please complete all required fields');
        setIsSubmitting(false);
        return;
      }

      // Format WhatsApp message
      const message = formatWhatsAppMessage(data);
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodedMessage}`;
      
      // Try to open WhatsApp
      const newWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        // Fallback if popup blocked or failed
        setWhatsappError(true);
        handleWhatsAppFallback();
      }
      
      // Success handling
      setTimeout(() => {
        if (!whatsappError) {
          setIsSubmitting(false);
          setShowSuccess(true);
          clearDraft();
          
          // Reset form after success
          setTimeout(() => {
            setShowSuccess(false);
            setCurrentStep(1);
            reset();
          }, 4000);
        } else {
          setIsSubmitting(false);
        }
      }, 1500);
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormError(getTranslation('submissionError', language) || 'Failed to submit form. Please try again or contact support.');
      setIsSubmitting(false);
    }
  };

  const clearDraft = () => {
    localStorage.removeItem('donationDraft');
    localStorage.removeItem('donationDraftTime');
    setLastSaved(null);
    setDraftStatus('cleared');
    setTimeout(() => setDraftStatus(null), 2000);
    reset();
    setCurrentStep(1);
  };

  const saveDraftManually = () => {
    const formData = getValues();
    saveDraftToStorage(formData);
    setDraftStatus('manual');
    setTimeout(() => setDraftStatus(null), 2000);
  };

  const loadDraft = () => {
    try {
      const encryptedDraft = localStorage.getItem('donationDraft');
      if (!encryptedDraft) return;

      const decrypted = decryptData(encryptedDraft);
      if (!decrypted) {
        clearDraft();
        return;
      }

      const { _timestamp, _version, _step, ...formData } = decrypted;
      reset(formData);
      if (_step) setCurrentStep(_step);
      setLastSaved(_timestamp);
      setDraftStatus('loaded');
      setTimeout(() => setDraftStatus(null), 2000);
    } catch (error) {
      console.error('Failed to load draft:', error);
      clearDraft();
    }
  };

  const formatLastSaved = () => {
    if (!lastSaved) return 'Never saved';
    const now = Date.now();
    const diff = now - lastSaved;
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return 'Just now';
    if (minutes === 1) return '1 minute ago';
    if (minutes < 60) return `${minutes} minutes ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;
    
    const days = Math.floor(hours / 24);
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  };

  const steps = {
    1: <Step1_PersonalInfo />,
    2: <Step2_DonationDetails />,
    3: <Step3_ReviewSubmit />
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (currentStep < 3) nextStep();
      }
      if (e.key === 'ArrowLeft' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (currentStep > 1) prevStep();
      }
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && currentStep === 3) {
        e.preventDefault();
        methods.handleSubmit(handleSubmit)();
      }
      if (e.key === 'Escape' && formError) {
        setFormError(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, formError]);

  return (
    <>
      <div ref={formContainerRef} className="relative scroll-mt-8">
        <FormProvider {...methods}>
          <GlassCard className="p-6 md:p-8 backdrop-mesh-xl border border-gray-300/50" intensity="lg" hoverEffect={false}>
            {/* Draft Status & Auto-save */}
            <AnimatePresence>
              {lastSaved && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-6 p-4 rounded-xl bg-gradient-to-r from-mesh-sky/10 to-mesh-teal/10 border border-gray-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-mesh-sky" />
                      <div>
                        <div className="text-sm font-medium text-gray-800">Auto-save enabled</div>
                        <div className="text-xs text-gray-600">
                          Last saved: {formatLastSaved()}
                        </div>
                      </div>
                    </div>
                    
                    <motion.button
                      type="button"
                      onClick={() => setShowDraftManager(!showDraftManager)}
                      className="text-sm text-mesh-sky hover:text-mesh-teal transition-colors font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {showDraftManager ? 'Hide options' : 'Manage draft'}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Draft Manager */}
            <AnimatePresence>
              {showDraftManager && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 overflow-hidden"
                >
                  <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-white/30 border border-gray-300">
                    <motion.button
                      type="button"
                      onClick={saveDraftManually}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/40 hover:bg-white/60 border border-gray-300 transition-colors group"
                    >
                      <Save className="w-6 h-6 text-mesh-sky mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium text-gray-800">Save</span>
                      <span className="text-xs text-gray-600">Manual save</span>
                    </motion.button>

                    <motion.button
                      type="button"
                      onClick={loadDraft}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/40 hover:bg-white/60 border border-gray-300 transition-colors group"
                    >
                      <Download className="w-6 h-6 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium text-gray-800">Load</span>
                      <span className="text-xs text-gray-600">Restore draft</span>
                    </motion.button>

                    <motion.button
                      type="button"
                      onClick={clearDraft}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/40 hover:bg-white/60 border border-gray-300 transition-colors group"
                    >
                      <Trash2 className="w-6 h-6 text-red-600 mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium text-gray-800">Clear</span>
                      <span className="text-xs text-gray-600">Start over</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form Error Alert */}
            <AnimatePresence>
              {formError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 px-4 py-3 rounded-xl bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-400/50 flex items-center gap-3"
                  role="alert"
                  aria-live="assertive"
                >
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <span className="text-sm text-gray-800">{formError}</span>
                  <button
                    onClick={() => setFormError(null)}
                    className="ml-auto text-gray-600 hover:text-gray-800 transition-colors"
                    aria-label="Dismiss error"
                  >
                    ✕
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Header */}
             <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center mb-10"
  >
    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
      {getTranslation('title', language)}
    </h2>
    <p className="text-gray-700 max-w-2xl mx-auto">
      {getTranslation('heroDescription', language)}
    </p>
  </motion.div>

            {/* Interactive Progress */}
            <FormProgress 
              currentStep={currentStep} 
              onStepClick={goToStep}
              step1Valid={step1Valid}
              step2Valid={step2Valid}
            />

            {/* Current Step Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: currentStep > 2 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: currentStep > 2 ? 50 : -50 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="mt-8"
                aria-live="polite"
                aria-atomic="true"
              >
                <p className="sr-only">
                  {getTranslation('nowShowingStep', language) || 'Now showing step'} {currentStep} {getTranslation('of', language) || 'of'} 3
                </p>
                {steps[currentStep]}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="mt-10 pt-6 border-t border-gray-300">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  {currentStep > 1 && (
                    <motion.button
                      type="button"
                      onClick={prevStep}
                      className="px-6 py-3 rounded-xl bg-white/40 text-gray-800 hover:bg-white/60 transition-all duration-300 font-medium flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-mesh-sky/50 border border-gray-300"
                      whileHover={{ scale: 1.05, x: -3 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Go to previous step"
                    >
                      ← {getTranslation('back', language) || 'Back'}
                    </motion.button>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  {currentStep < 3 ? (
                    <motion.button
                      type="button"
                      onClick={nextStep}
                      disabled={!isValid || isSubmitting}
                      className="px-8 py-3 rounded-xl bg-gradient-to-r from-mesh-sky to-mesh-teal text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[140px] justify-center focus:outline-none focus:ring-2 focus:ring-mesh-sky/50 focus:ring-offset-2 focus:ring-offset-white transition-all duration-300 hover:shadow-lg hover:shadow-mesh-sky/30"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Continue to next step"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                          {getTranslation('validating', language) || 'Validating...'}
                        </>
                      ) : (
                        <>
                          {getTranslation('continue', language) || 'Continue'}
                          <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                        </>
                      )}
                    </motion.button>
                  ) : (
                    <motion.button
                      ref={submitButtonRef}
                      type="button"
                      onClick={methods.handleSubmit(handleSubmit)}
                      disabled={isSubmitting}
                      className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold flex items-center gap-2 min-w-[180px] justify-center disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-white transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/30"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Submit donation via WhatsApp"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                          {getTranslation('preparing', language) || 'Preparing...'}
                        </>
                      ) : (
                        <>
                          <span className="text-lg" aria-hidden="true">📱</span>
                          {getTranslation('sendViaWhatsApp', language) || 'Send via WhatsApp'}
                        </>
                      )}
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Step Indicator */}
              <div className="text-center mt-6">
                <span className="text-sm text-gray-600">
                  {getTranslation('step', language) || 'Step'} {currentStep} {getTranslation('of', language) || 'of'} 3
                </span>
                <div className="flex justify-center gap-1 mt-2">
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        step === currentStep
                          ? 'bg-gradient-to-r from-mesh-sky to-mesh-teal w-6'
                          : step < currentStep
                          ? 'bg-emerald-500'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </FormProvider>
      </div>

      {/* Success Modal */}
      <SuccessModal 
        isOpen={showSuccess} 
        onClose={() => setShowSuccess(false)} 
        donationDetails={methods.getValues()}
        language={language}
      />
    </>
  );
};

export default MultiStepForm;