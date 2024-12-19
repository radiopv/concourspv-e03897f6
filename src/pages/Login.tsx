import { motion } from "framer-motion";
import { LoginForm } from "@/components/login/LoginForm";

const Login = () => {
  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
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
    </div>
  );
};

export default Login;