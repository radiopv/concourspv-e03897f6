import { motion, AnimatePresence } from "framer-motion";
import { LoginForm } from "@/components/login/LoginForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/App";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        if (session.user.email === 'renaudcanuel@me.com') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }
    };
    checkAuth();
  }, [navigate]);

  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <AnimatePresence mode="wait">
        <motion.div
          key="login-form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Connexion</h1>
            <p className="text-lg text-gray-600">
              Connectez-vous pour accéder à votre compte
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg">
            <LoginForm />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Login;