import React from 'react';
import { motion } from 'framer-motion';

interface DashboardHeaderProps {
  firstName?: string;
}

const DashboardHeader = ({ firstName }: DashboardHeaderProps) => {
  return (
    <div className="mb-8">
      <motion.h1 
        className="text-4xl font-bold bg-gradient-to-r from-amber-600 via-orange-500 to-rose-500 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Bienvenue{firstName ? `, ${firstName}` : ""} !
      </motion.h1>
      <motion.p 
        className="text-amber-700 mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Voici un aperçu de votre activité sur la plateforme
      </motion.p>
    </div>
  );
};

export default DashboardHeader;