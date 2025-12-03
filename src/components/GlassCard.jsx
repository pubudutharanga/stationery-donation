import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ 
  children, 
  className = '', 
  intensity = 'md',
  blur = true,
  border = true,
  hoverEffect = true,
  ...props 
}) => {
  const blurClasses = {
    sm: 'backdrop-mesh-sm',
    md: 'backdrop-mesh-md',
    lg: 'backdrop-mesh-lg',
    xl: 'backdrop-mesh-xl'
  };

  return (
    <motion.div
      className={`
        relative
        ${blur ? blurClasses[intensity] : ''}
        mesh-glass-card
        ${hoverEffect ? 'hover:shadow-glass-hover' : ''}
        transition-all duration-300
        ${className}
      `}
      whileHover={hoverEffect ? { y: -5 } : {}}
      {...props}
    >
      {/* Mesh gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-mesh-sky/5 via-transparent to-mesh-purple/5 rounded-2xl pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default GlassCard;