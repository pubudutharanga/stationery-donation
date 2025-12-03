// src/components/Footer.jsx
import React from 'react';
// FIXED: Changed to correct paths
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../i18n/languageUtils';

const Footer = () => {
  const { language } = useLanguage();
  
  return (
    <footer className="mt-32 border-t border-slate-200 pt-8 pb-6 backdrop-mesh-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-slate-600 text-sm text-center md:text-left">
            {getTranslation('copyright', language, { year: new Date().getFullYear() })}
          </div>
          
          <div className="flex items-center gap-6">
            <a 
              href="#privacy" 
              className="text-slate-600 hover:text-slate-800 text-sm transition-colors"
            >
              Privacy Policy
            </a>
            <a 
              href="#terms" 
              className="text-slate-600 hover:text-slate-800 text-sm transition-colors"
            >
              Terms of Service
            </a>
            <a 
              href="#contact" 
              className="text-slate-600 hover:text-slate-800 text-sm transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
        
        <div className="mt-6 text-center text-slate-500 text-xs">
          <p>
            This platform connects donors with students in need. 
            All donations are coordinated through verified partners in Sri Lanka.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;