import React from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import readingBoy from "../assets/Reading Boy.json"; // adjust path if needed

const HeroIllustration = () => {
  return (
    <div className="relative w-full h-96 md:h-[500px]">
      {/* Main animation */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="relative w-[260px] md:w-[340px]"
        >
          {/* Lottie Animation */}
          <Lottie
            animationData={readingBoy}
            loop={true}
            className="relative z-10 drop-shadow-xl"
          />

          {/* Decorative mesh blobs */}
          <div className="absolute -z-10 top-10 left-10 w-32 h-32 rounded-full bg-mesh-sky/20 blur-xl" />
          <div className="absolute -z-10 bottom-10 right-10 w-40 h-40 rounded-full bg-mesh-teal/20 blur-xl" />

          {/* Floating dashed circles */}
          <div className="absolute -top-8 -left-8 w-24 h-24 border-2 border-dashed border-mesh-sky/30 rounded-full" />
          <div className="absolute -bottom-8 -right-8 w-24 h-24 border-2 border-dashed border-mesh-teal/30 rounded-full" />
        </motion.div>
      </div>

      {/* Floating animated particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-br from-mesh-sky to-mesh-teal rounded-full"
          animate={{
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
            delay: i * 0.5,
          }}
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + i * 10}%`,
          }}
        />
      ))}
    </div>
  );
};

export default HeroIllustration;
