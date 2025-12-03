// src/components/LanguageSwitcher.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown } from 'lucide-react';
// FIXED: Changed to correct paths
import { useLanguage } from '../contexts/LanguageContext';
import { LANGUAGE_NAMES } from '../i18n/languageUtils';

const LanguageSwitcher = () => {
  const { language, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'si', name: 'සිංහල', flag: '🇱🇰' },
    { code: 'ta', name: 'தமிழ்', flag: '🇱🇰' }
  ];

  const currentLang = languages.find(lang => lang.code === language);

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/60 hover:bg-white text-gray-800 border border-gray-300 transition-all duration-300 group backdrop-blur-sm"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Change language"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe className="w-4 h-4 text-mesh-sky group-hover:text-mesh-teal transition-colors" />
        <span className="font-medium text-sm text-gray-800">
          <span className="mr-1">{currentLang?.flag}</span>
          {LANGUAGE_NAMES[language]}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} text-gray-600`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="absolute top-full right-0 mt-2 w-56 rounded-xl bg-white border border-gray-300 shadow-lg overflow-hidden z-50"
              onMouseLeave={() => setIsOpen(false)}
              role="menu"
              aria-orientation="vertical"
            >
              <div className="p-1 bg-white">
                {languages.map((lang) => (
                  <motion.button
                    key={lang.code}
                    onClick={() => {
                      changeLanguage(lang.code);
                      setIsOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left flex items-center gap-3
                      ${language === lang.code 
                        ? 'bg-gradient-to-r from-mesh-sky/20 to-mesh-teal/20 text-gray-900 font-medium' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }
                      transition-all duration-200
                      rounded-lg
                      group/item`}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    role="menuitem"
                    tabIndex={0}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span className="flex-1">{lang.name}</span>
                    
                    {language === lang.code && (
                      <motion.div
                        layoutId="activeLang"
                        className="w-2 h-2 rounded-full bg-gradient-to-r from-mesh-sky to-mesh-teal"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500 }}
                      />
                    )}
                    
                    {/* Hover indicator */}
                    <div className={`absolute right-3 w-2 h-2 rounded-full
                      ${language === lang.code ? 'bg-gradient-to-r from-mesh-sky to-mesh-teal' : 'bg-gray-300'}
                      group-hover/item:bg-mesh-sky
                      transition-colors`} />
                  </motion.button>
                ))}
              </div>
              
              {/* Border */}
              <div className="absolute inset-0 rounded-xl pointer-events-none border border-gray-200" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;