// src/App.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// FIXED: Changed to correct paths
import { LanguageProvider } from './contexts/LanguageContext';
import Header from './components/Header';
import Hero from './components/Hero';
import MultiStepForm from './components/MultiStepForm/MultiStepForm';
import Footer from './components/Footer';

function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gradient-to-br from-mesh-pale via-mesh-pale/90 to-mesh-pale text-slate-800 relative overflow-hidden">
        {/* Mesh Blur Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 mesh-blob-1 animate-blob" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 mesh-blob-2 animate-blob" style={{ animationDelay: '1s' }} />
          <div className="absolute top-3/4 left-1/3 w-96 h-96 mesh-blob-3 animate-blob" style={{ animationDelay: '2s' }} />
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-mesh-sky/20 to-mesh-teal/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-mesh-purple/20 to-mesh-sky/20 rounded-full blur-3xl" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            <Header />
            
            <main className="max-w-7xl mx-auto px-4 py-8">
              <Hero />
              
              <div id="donate" className="mt-20">
                <MultiStepForm />
              </div>

              {/* How It Works Section */}
              <section className="mt-32">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="text-4xl font-bold text-center mb-16 text-slate-800"
                >
                  How Your Donation Helps
                </motion.h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { icon: '📝', title: 'Collection', desc: 'We coordinate pickup from your location' },
                    { icon: '🎒', title: 'Distribution', desc: 'Items are sorted and packed for schools' },
                    { icon: '🏫', title: 'Impact', desc: 'Students receive essential learning materials' }
                  ].map((step, index) => (
                    <motion.div
                      key={step.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className="mesh-glass-card p-6 text-center backdrop-mesh-lg"
                    >
                      <div className="text-4xl mb-4">{step.icon}</div>
                      <h3 className="text-xl font-semibold mb-3 text-slate-800">{step.title}</h3>
                      <p className="text-slate-600">{step.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </section>
            </main>

            <Footer />
          </motion.div>
        </AnimatePresence>
      </div>
    </LanguageProvider>
  );
}

export default App;