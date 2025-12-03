// src/components/MultiStepForm/DraftManager.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Upload, Trash2, Clock } from 'lucide-react';

const DraftManager = ({ 
  onSave, 
  onLoad, 
  onClear,
  lastSaved 
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  
  const formatTime = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Draft Status */}
      <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-sm font-medium text-white">Auto-save enabled</div>
              <div className="text-xs text-white/50">
                Last saved: {formatTime(lastSaved)}
              </div>
            </div>
          </div>
          
          <AnimatePresence>
            {lastSaved && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-emerald-400">Draft saved</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Draft Actions - 3 buttons instead of 4 */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <motion.button
          type="button"
          onClick={onSave}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Save className="w-6 h-6 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium text-white">Save</span>
          <span className="text-xs text-white/50">Manual save</span>
        </motion.button>

        <motion.button
          type="button"
          onClick={onLoad}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Upload className="w-6 h-6 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium text-white">Load</span>
          <span className="text-xs text-white/50">Restore draft</span>
        </motion.button>

        <motion.button
          type="button"
          onClick={() => setShowConfirm(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Trash2 className="w-6 h-6 text-red-400 mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium text-white">Clear</span>
          <span className="text-xs text-white/50">Start over</span>
        </motion.button>
      </div>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setShowConfirm(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
            >
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/20 p-6">
                <h4 className="text-lg font-bold text-white mb-3">Clear Draft?</h4>
                <p className="text-white/70 mb-6">
                  Are you sure you want to clear your draft? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onClear();
                      setShowConfirm(false);
                    }}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Clear Draft
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default DraftManager;