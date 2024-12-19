import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

const HeroSection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuickSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Inscription en cours",
      description: "Redirection vers le formulaire complet...",
    });

    // Pass the form data through navigation state
    navigate("/register", { 
      state: { 
        name: formData.name,
        email: formData.email 
      }
    });
  };

  return (
    <section className="relative h-[80vh] bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
      <div className="absolute inset-0 bg-black/30" />
      <div className="container mx-auto px-4 h-full flex items-center relative z-10">
        <div className="max-w-3xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            Participez et gagnez des cadeaux incroyables !
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl mb-8"
          >
            Inscrivez-vous pour tenter votre chance aujourd'hui !
          </motion.p>
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            onSubmit={handleQuickSignup}
            className="flex flex-col md:flex-row gap-4 max-w-xl"
          >
            <Input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Votre nom" 
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
            />
            <Input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Votre email" 
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
            />
            <Button type="submit" className="bg-white text-indigo-600 hover:bg-white/90">
              S'inscrire
            </Button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;