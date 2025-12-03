// src/components/Hero.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
// FIXED: Changed to correct paths
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../i18n/languageUtils';
import GlassCard from './GlassCard';
import HeroIllustration from './HeroIllustration';

const Hero = () => {
  const { language } = useLanguage();

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Mesh gradient background */}
      <div className="absolute inset-0 mesh-bg opacity-80" />
      
      {/* Animated mesh blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-mesh-sky/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse-mesh" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-mesh-teal/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 animate-pulse-mesh" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-mesh-purple/15 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <GlassCard className="p-8 backdrop-mesh-xl" intensity="lg">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-mesh-sky/20 to-mesh-teal/20 border border-white/20 mb-6"
              >
                <Sparkles className="w-4 h-4 text-mesh-sky" />
                <span className="text-sm font-medium text-slate-700">
                  {getTranslation('subtitle', language)}
                </span>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold leading-tight text-slate-800 mb-6"
              >
                {getTranslation('heroTitle', language)}
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-slate-600 mb-8 leading-relaxed"
              >
                {getTranslation('heroDescription', language)}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.a
                  href="#donate"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-mesh-sky to-mesh-teal text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {getTranslation('donateNow', language)}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.a>

                <motion.a
                  href="#how"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center px-6 py-4 rounded-xl bg-white/20 text-slate-700 border border-white/30 hover:bg-white/30 transition-all duration-300"
                >
                  {getTranslation('learnMore', language)}
                </motion.a>
              </motion.div>
            </GlassCard>
          </motion.div>

          {/* Right Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative"
          >
            <GlassCard className="p-6 backdrop-mesh-xl" intensity="lg">
              <HeroIllustration />
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;