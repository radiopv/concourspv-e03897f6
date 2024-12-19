import { motion } from "framer-motion";
import { Star, Gift, Trophy } from "lucide-react";

const WhyParticipateSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center mb-16"
        >
          Pourquoi participer ?
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="w-16 h-16 mx-auto mb-6 bg-indigo-100 rounded-full flex items-center justify-center">
              <Star className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Participation gratuite</h3>
            <p className="text-gray-600">
              Participez gratuitement à tous nos concours et multipliez vos chances de gagner.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center"
          >
            <div className="w-16 h-16 mx-auto mb-6 bg-purple-100 rounded-full flex items-center justify-center">
              <Gift className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Cadeaux variés</h3>
            <p className="text-gray-600">
              Des cadeaux pour tous les goûts, renouvelés régulièrement.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <div className="w-16 h-16 mx-auto mb-6 bg-amber-100 rounded-full flex items-center justify-center">
              <Trophy className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Chances équitables</h3>
            <p className="text-gray-600">
              Tous les participants ont les mêmes chances de gagner.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyParticipateSection;