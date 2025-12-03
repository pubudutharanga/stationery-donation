// src/components/MultiStepForm/FormProgress.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Check, Lock } from 'lucide-react';
// FIXED: Changed to correct path
import { useLanguage } from '../../contexts/LanguageContext';
import { getTranslation } from '../../i18n/languageUtils';

const FormProgress = ({ currentStep, onStepClick, step1Valid, step2Valid }) => {
  const { language } = useLanguage();
  
  const steps = [
    { number: 1, key: 'step1', label: 'Personal Info', icon: '👤' },
    { number: 2, key: 'step2', label: 'Donation Items', icon: '📦' },
    { number: 3, key: 'step3', label: 'Review & Send', icon: '📱' },
  ];

  const isStepAccessible = (stepNumber) => {
    if (stepNumber === 1) return true;
    if (stepNumber === 2) return step1Valid;
    if (stepNumber === 3) return step1Valid && step2Valid;
    return false;
  };

  const handleStepClick = (stepNumber) => {
    if (isStepAccessible(stepNumber) && stepNumber !== currentStep) {
      onStepClick(stepNumber);
    }
  };

  const getStepStatus = (stepNumber) => {
    if (currentStep > stepNumber) return 'completed';
    if (currentStep === stepNumber) return 'current';
    if (isStepAccessible(stepNumber)) return 'accessible';
    return 'locked';
  };

  return (
    <div className="relative">
      {/* Progress Bar - Fixed to be visible */}
      <div className="absolute top-6 left-0 right-0 h-2 bg-gray-300 -z-10 overflow-hidden rounded-full">
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-mesh-sky via-mesh-teal to-green-500"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          aria-hidden="true"
        />
      </div>

      {/* Steps */}
      <div className="relative flex justify-between">
        {steps.map((step) => {
          const status = getStepStatus(step.number);
          const accessible = isStepAccessible(step.number);
          const stepLabel = getTranslation(step.key, language) || step.label;

          return (
            <motion.div
              key={step.number}
              className="flex flex-col items-center relative z-10 flex-1"
              whileHover={accessible ? { y: -5 } : {}}
            >
              {/* Step Circle */}
              <div className="relative">
                <motion.button
                  type="button"
                  onClick={() => handleStepClick(step.number)}
                  disabled={!accessible}
                  className={`
                    w-14 h-14 rounded-full flex items-center justify-center
                    ${status === 'completed'
                      ? 'bg-gradient-to-br from-emerald-600 to-green-600 shadow-lg shadow-emerald-600/30' 
                      : status === 'current'
                      ? 'bg-white border-4 border-gradient-to-r from-mesh-sky to-mesh-teal shadow-lg shadow-mesh-sky/30'
                      : accessible
                      ? 'bg-white/80 border-2 border-gray-400 hover:bg-white hover:border-gray-600'
                      : 'bg-gray-200 border-2 border-gray-300 cursor-not-allowed'
                    }
                    transition-all duration-300
                    relative group
                    disabled:cursor-default
                    focus:outline-none focus:ring-2 focus:ring-mesh-sky focus:ring-offset-2 focus:ring-offset-white
                  `}
                  whileTap={accessible ? { scale: 0.95 } : {}}
                  aria-label={`Step ${step.number}: ${stepLabel} ${status === 'current' ? '(current)' : ''} ${status === 'completed' ? '(completed)' : ''}`}
                  aria-current={status === 'current' ? 'step' : undefined}
                >
                  {/* Current step inner circle */}
                  {status === 'current' && (
                    <div className="absolute inset-2 rounded-full bg-gradient-to-r from-mesh-sky to-mesh-teal" />
                  )}
                  
                  {status === 'completed' ? (
                    <Check className="w-6 h-6 text-white relative z-10" aria-hidden="true" />
                  ) : (
                    <span className="text-lg font-semibold relative z-10" aria-hidden="true">
                      {accessible ? step.icon : <Lock className="w-5 h-5 text-gray-500" />}
                    </span>
                  )}

                  {/* Tooltip */}
                  {accessible && (
                    <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                      <div className="bg-gray-800 text-white text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
                        {stepLabel}
                        {status !== 'current' && status !== 'completed' && ' (Click to jump)'}
                      </div>
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800" />
                    </div>
                  )}
                </motion.button>
              </div>

              {/* Step Label */}
              <div className="mt-4 text-center">
                <div className={`
                  text-sm font-medium
                  ${status === 'current' ? 'text-gray-900' : 
                    status === 'completed' ? 'text-emerald-700' : 
                    accessible ? 'text-gray-700' : 'text-gray-500'}
                `}>
                  {stepLabel}
                </div>
                <div className={`
                  text-xs mt-1
                  ${status === 'current' ? 'text-gray-600' : 
                    status === 'completed' ? 'text-emerald-600' : 
                    accessible ? 'text-gray-500' : 'text-gray-400'}
                `}>
                  Step {step.number}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Step Indicators */}
      <div className="mt-12 flex justify-center gap-2" aria-hidden="true">
        {steps.map((step) => {
          const status = getStepStatus(step.number);
          return (
            <motion.div
              key={step.number}
              animate={{
                scale: status === 'current' ? 1.2 : 1,
                opacity: status === 'current' ? 1 : 0.5,
              }}
              className={`
                w-2 h-2 rounded-full
                ${status === 'current'
                  ? 'bg-gradient-to-r from-mesh-sky to-mesh-teal' 
                  : status === 'completed'
                  ? 'bg-emerald-500'
                  : 'bg-gray-400'
                }
              `}
            />
          );
        })}
      </div>
    </div>
  );
};

export default FormProgress;