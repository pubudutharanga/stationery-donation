import React from 'react'
import { motion } from 'framer-motion'

export default function StickyDonateButton(){
  return (
    <div className="fixed bottom-6 right-6 md:hidden z-50">
      <motion.a
        href="#donate"
        whileTap={{ scale: 0.96 }}
        whileHover={{ scale: 1.02 }}
        className="inline-flex items-center gap-3 px-4 py-3 rounded-full bg-charityBlue text-white shadow-lg"
        aria-label="Donate (mobile)"
      >
        Donate
      </motion.a>
    </div>
  )
}
