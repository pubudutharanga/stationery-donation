// src/components/Header.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
// FIXED: Changed to correct paths
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../i18n/languageUtils';
import LanguageSwitcher from './LanguageSwitcher';

const Header = () => {
  const { language } = useLanguage();

  return (
    <header className="sticky top-0 z-50 mesh-nav backdrop-mesh-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-mesh-sky to-mesh-teal flex items-center justify-center shadow-lg"
            >
              <BookOpen className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <div className="font-bold text-slate-800 text-lg">
                {getTranslation('title', language)}
              </div>
              <div className="text-xs text-slate-600">
                {getTranslation('subtitle', language)}
              </div>
            </div>
          </motion.div>

          {/* Navigation & Language Switcher */}
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6">
              {['home', 'donate', 'about', 'contact'].map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-slate-700 hover:text-slate-900 transition-colors relative group font-medium"
                >
                  {getTranslation(item, language)}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-mesh-sky to-mesh-teal group-hover:w-full transition-all duration-300" />
                </motion.a>
              ))}
            </nav>
            
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;