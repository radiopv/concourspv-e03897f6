import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from 'framer-motion';
import { Trophy, Gift } from 'lucide-react';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Voir les concours",
      description: "Participez aux concours actifs",
      icon: Trophy,
      path: "/contests",
      gradient: "from-amber-500 to-orange-500"
    },
    {
      title: "Catalogue des prix",
      description: "Découvrez nos récompenses",
      icon: Gift,
      path: "/prizes",
      gradient: "from-orange-500 to-rose-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {actions.map((action, index) => (
        <motion.div
          key={action.path}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card 
            className="glass-card cursor-pointer hover:shadow-lg transition-all duration-300 group" 
            onClick={() => navigate(action.path)}
          >
            <CardHeader>
              <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${action.gradient} p-3 mb-4 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-full h-full text-white" />
              </div>
              <CardTitle className="text-xl bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent">
                {action.title}
              </CardTitle>
              <CardDescription className="text-amber-700">
                {action.description}
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default QuickActions;