import { motion } from "framer-motion";
import { Trophy, Gift, Users } from "lucide-react";

const StatsSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white p-8 rounded-xl shadow-lg text-center"
          >
            <Users className="w-12 h-12 mx-auto text-indigo-600 mb-4" />
            <h3 className="text-4xl font-bold text-gray-900 mb-2">1,234</h3>
            <p className="text-gray-600">Participants actifs</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white p-8 rounded-xl shadow-lg text-center"
          >
            <Gift className="w-12 h-12 mx-auto text-purple-600 mb-4" />
            <h3 className="text-4xl font-bold text-gray-900 mb-2">50+</h3>
            <p className="text-gray-600">Cadeaux à gagner</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white p-8 rounded-xl shadow-lg text-center"
          >
            <Trophy className="w-12 h-12 mx-auto text-amber-500 mb-4" />
            <h3 className="text-4xl font-bold text-gray-900 mb-2">789</h3>
            <p className="text-gray-600">Gagnants heureux</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;