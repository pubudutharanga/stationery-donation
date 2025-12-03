// src/components/MultiStepForm/SuccessModal.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Share2, Copy, Check } from 'lucide-react';
import { getTranslation } from '../../i18n/languageUtils';

const Confetti = () => {
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'];
    const newConfetti = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100 - 100,
      rotation: Math.random() * 360,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 3,
      delay: Math.random() * 0.5,
      duration: Math.random() * 2 + 1.5,
    }));
    setConfetti(newConfetti);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {confetti.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute rounded-sm"
          style={{
            left: `${piece.x}%`,
            backgroundColor: piece.color,
            width: piece.size,
            height: piece.size * 0.4,
          }}
          initial={{ y: piece.y, rotate: 0, opacity: 0 }}
          animate={{
            y: '100vh',
            rotate: piece.rotation + 360,
            opacity: [0, 1, 0],
          }}
          transition={{
            delay: piece.delay,
            duration: piece.duration,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
};

const SuccessModal = ({ isOpen, onClose, donationDetails, language }) => {
  const [copied, setCopied] = useState(false);
  const [shareSupported, setShareSupported] = useState(false);

  useEffect(() => {
    // Safely check if Web Share API is supported
    if (typeof window !== 'undefined' && navigator && 'share' in navigator) {
      setShareSupported(true);
    } else {
      setShareSupported(false);
    }
  }, []);

  const handleCopyDetails = useCallback(async () => {
    try {
      const details = JSON.stringify(donationDetails, null, 2);
      await navigator.clipboard.writeText(details);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = JSON.stringify(donationDetails, null, 2);
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
      document.body.removeChild(textArea);
    }
  }, [donationDetails]);

  const handleShare = useCallback(async () => {
    // Only attempt to use Web Share API if it's supported
    if (shareSupported && navigator.share) {
      try {
        // Ensure we're in a secure context (HTTPS or localhost)
        const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
        
        if (isSecure) {
          await navigator.share({
            title: getTranslation('shareTitle', language) || 'I just donated stationery!',
            text: getTranslation('shareText', language) || 'Join me in helping students get the supplies they need.',
            url: window.location.href,
          });
        } else {
          // Fallback for non-secure contexts
          handleFallbackShare();
        }
      } catch (error) {
        // User cancelled share or error occurred
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error);
          handleFallbackShare();
        }
      }
    } else {
      handleFallbackShare();
    }
  }, [shareSupported, language]);

  const handleFallbackShare = useCallback(() => {
    const shareText = `${getTranslation('shareTitle', language) || 'I just donated stationery!'}\n\n${
      getTranslation('shareText', language) || 'Join me in helping students get the supplies they need.'
    }\n\n${window.location.href}`;
    
    // Try clipboard first
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText)
        .then(() => {
          alert(getTranslation('shareCopied', language) || 'Share text copied to clipboard!');
        })
        .catch(() => {
          // Fallback to prompt
          prompt(getTranslation('copyManually', language) || 'Copy this text to share:', shareText);
        });
    } else {
      // Fallback to prompt
      prompt(getTranslation('copyManually', language) || 'Copy this text to share:', shareText);
    }
  }, [language]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Confetti */}
      <Confetti />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 50 }}
        transition={{ type: 'spring', damping: 25 }}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-1"
        role="dialog"
        aria-modal="true"
        aria-labelledby="success-modal-title"
        aria-describedby="success-modal-description"
      >
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/20 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="relative p-8 text-center">
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 mb-6"
              aria-hidden="true"
            >
              <CheckCircle className="w-12 h-12 text-white" />
            </motion.div>

            {/* Title */}
            <h3 id="success-modal-title" className="text-2xl font-bold text-white mb-3">
              {getTranslation('donationSubmitted', language) || 'Donation Submitted!'} 🎉
            </h3>
            
            <p id="success-modal-description" className="text-white/70 mb-6">
              {getTranslation('donationSubmittedMessage', language) || 'Thank you for your generosity! WhatsApp should open shortly with a message for our coordinator.'}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8" aria-hidden="true">
              <div className="p-4 rounded-xl bg-white/5">
                <div className="text-2xl font-bold text-emerald-400">500+</div>
                <div className="text-xs text-white/50">
                  {getTranslation('studentsHelped', language) || 'Students Helped'}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/5">
                <div className="text-2xl font-bold text-blue-400">24h</div>
                <div className="text-xs text-white/50">
                  {getTranslation('avgResponseTime', language) || 'Avg. Response Time'}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/5">
                <div className="text-2xl font-bold text-purple-400">100%</div>
                <div className="text-xs text-white/50">
                  {getTranslation('verifiedDelivery', language) || 'Verified Delivery'}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 border-t border-white/10 flex flex-col gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleShare}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold flex items-center justify-center gap-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
              aria-label={getTranslation('shareYourGoodDeed', language) || 'Share your good deed'}
            >
              <Share2 className="w-5 h-5" aria-hidden="true" />
              {getTranslation('shareYourGoodDeed', language) || 'Share Your Good Deed'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCopyDetails}
              className="w-full py-3 rounded-xl bg-white/10 text-white font-medium flex items-center justify-center gap-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
              aria-label={copied ? 
                (getTranslation('copied', language) || 'Copied!') : 
                (getTranslation('copyDonationDetails', language) || 'Copy donation details')
              }
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5 text-emerald-400" aria-hidden="true" />
                  {getTranslation('copied', language) || 'Copied!'}
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" aria-hidden="true" />
                  {getTranslation('copyDonationDetails', language) || 'Copy Donation Details'}
                </>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="w-full py-3 rounded-xl border border-white/20 text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
              aria-label={getTranslation('close', language) || 'Close modal'}
            >
              {getTranslation('close', language) || 'Close'}
            </motion.button>
          </div>

          {/* Close Button */}
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={getTranslation('closeModal', language) || 'Close modal'}
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </motion.button>
        </div>
      </motion.div>
    </>
  );
};

export default SuccessModal;