import React, { useState } from 'react';
import { motion } from "framer-motion";
import { LoginForm } from "@/components/login/LoginForm";
import RegisterForm from "@/components/register/RegisterForm";
import { Button } from "@/components/ui/button";
import { useLocation } from 'react-router-dom';

const Auth = () => {
  const location = useLocation();
  const [isRegistering, setIsRegistering] = useState(
    location.pathname === '/register'
  );

  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            {isRegistering ? 'Créer un compte' : 'Connexion'}
          </h1>
          <p className="text-lg text-gray-600">
            {isRegistering 
              ? 'Rejoignez notre communauté pour participer aux concours'
              : 'Connectez-vous pour accéder à votre compte'}
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg">
          {isRegistering ? (
            <RegisterForm />
          ) : (
            <LoginForm />
          )}
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">
              {isRegistering 
                ? 'Vous avez déjà un compte ?'
                : 'Vous n\'avez pas encore de compte ?'}
            </p>
            <Button
              variant="ghost"
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-indigo-600 hover:text-indigo-800"
            >
              {isRegistering 
                ? 'Se connecter'
                : 'Créer un compte'}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;