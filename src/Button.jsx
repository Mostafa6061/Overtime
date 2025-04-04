import { motion } from "framer-motion";
import React from "react";
const CoolButton = ({ onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      Refresh Data
    </motion.button>
  );
};

export default CoolButton;
