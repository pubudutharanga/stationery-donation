import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

const FloatingInput = ({
  name,
  label,
  type = 'text',
  placeholder = '',
  required = false,
  validation = {},
  icon: Icon,
  showStatus = true,
  characterLimit,
  className = '',
  ...props
}) => {
  const {
    register,
    formState: { errors, touchedFields },
    watch
  } = useFormContext();
  
  const [isTyping, setIsTyping] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const value = watch(name) || '';
  
  const error = errors[name];
  const touched = touchedFields[name];
  const isValid = !error && value.length > 0;
  const isAtLimit = characterLimit && value.length >= characterLimit;
  
  const getStatus = () => {
    if (error) return 'error';
    if (isValid && !isTyping) return 'valid';
    if (isTyping) return 'typing';
    return 'idle';
  };
  
  const status = getStatus();
  
  // Handle auto-hide typing indicator
  useEffect(() => {
    if (isTyping) {
      const timer = setTimeout(() => setIsTyping(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isTyping]);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        {/* Field Icon */}
        {Icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
            <Icon className={`w-5 h-5 transition-colors duration-300 ${
              status === 'error' ? 'text-red-600' :
              status === 'valid' ? 'text-emerald-600' :
              isFocused ? 'text-mesh-sky' : 'text-gray-600'
            }`} />
          </div>
        )}
        
        {/* Premium Glass Input Field */}
        <input
          {...register(name, validation)}
          type={type}
          placeholder=""
          onFocus={() => {
            setIsFocused(true);
            setIsTyping(true);
          }}
          onBlur={() => setIsFocused(false)}
          onChange={() => setIsTyping(true)}
          className={`
            peer w-full pt-7 pb-3 px-4 rounded-xl
            backdrop-blur-lg
            ${Icon ? 'pl-12' : 'pl-4'}
            ${error 
              ? 'border-2 border-red-500/50 focus:border-red-600 focus:shadow-[0_0_20px_rgba(239,68,68,0.2)]' 
              : status === 'valid'
              ? 'border-2 border-emerald-500/30 focus:border-emerald-600 focus:shadow-[0_0_20px_rgba(16,185,129,0.2)]'
              : 'border border-white/40 focus:border-mesh-sky focus:shadow-[0_0_20px_rgba(79,172,254,0.3)]'
            }
            bg-gradient-to-br from-white/20 to-white/10
            text-gray-900
            focus:outline-none focus:ring-2 focus:ring-white/20
            transition-all duration-300
            ${showStatus ? 'pr-12' : 'pr-4'}
            shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]
          `}
          maxLength={characterLimit}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${name}-error` : characterLimit ? `${name}-counter` : undefined}
          {...props}
        />
        
        {/* Floating Label */}
        <label
          htmlFor={name}
          className={`
            absolute left-4 top-2 text-xs font-medium
            ${error 
              ? 'text-red-600' 
              : status === 'valid' 
              ? 'text-emerald-600' 
              : isFocused 
              ? 'text-mesh-sky' 
              : 'text-gray-600'
            }
            peer-placeholder-shown:text-sm
            peer-placeholder-shown:top-5
            peer-placeholder-shown:text-gray-500
            peer-focus:top-2
            peer-focus:text-xs
            peer-focus:text-mesh-sky
            transition-all duration-200
            pointer-events-none
            ${Icon ? 'left-12' : 'left-4'}
            select-none
          `}
        >
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>

        {/* Status Icons */}
        {showStatus && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <AnimatePresence mode="wait">
              {status === 'typing' && (
                <motion.div
                  key="typing"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="relative"
                >
                  <Loader2 className="w-5 h-5 text-mesh-sky animate-spin" />
                </motion.div>
              )}
              
              {status === 'valid' && !error && (
                <motion.div
                  key="valid"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                >
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </motion.div>
              )}
              
              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                >
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
        
        {/* Glass Blur Effect Layer */}
        <div className={`
          absolute inset-0 rounded-xl pointer-events-none
          backdrop-blur-xl
          transition-opacity duration-300
          ${isFocused ? 'opacity-100' : 'opacity-0'}
        `} />
      </div>

      {/* Error Message & Character Counter */}
      <div className="mt-2 min-h-[20px]">
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              id={`${name}-error`}
              className="text-sm text-red-600 flex items-center gap-2 backdrop-blur-lg bg-red-500/10 p-3 rounded-xl border border-red-500/20"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error.message}
            </motion.p>
          )}
        </AnimatePresence>
        
        {characterLimit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-between items-center mt-1"
          >
            <span className="text-xs text-gray-600">
              {value.length > 0 ? `${characterLimit - value.length} characters left` : ''}
            </span>
            <span className={`text-xs font-medium ${
              isAtLimit ? 'text-red-600' : 
              value.length > characterLimit * 0.8 ? 'text-amber-600' : 'text-gray-500'
            }`}>
              {value.length}/{characterLimit}
            </span>
          </motion.div>
        )}
      </div>

      {/* Glow Effect */}
      <motion.div
        className={`
          absolute -inset-1 rounded-xl pointer-events-none blur-xl
          ${isFocused && !error ? 'bg-gradient-to-r from-mesh-sky/20 to-mesh-teal/20' : ''}
          ${isFocused && error ? 'bg-gradient-to-r from-red-500/20 to-rose-500/20' : ''}
          transition-all duration-300
        `}
        initial={false}
        animate={{ opacity: isFocused ? 0.5 : 0 }}
      />
    </div>
  );
};

export default FloatingInput;