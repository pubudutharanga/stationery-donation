import React from 'react'
import { motion } from 'framer-motion'
export default function Loader({ size=20 }){
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 50 50" className="w-full h-full">
        <circle cx="25" cy="25" r="20" stroke="currentColor" strokeWidth="4" strokeDasharray="31.4 31.4" strokeLinecap="round" fill="none"></circle>
      </svg>
    </motion.div>
  )
}
