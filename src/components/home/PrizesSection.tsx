import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../App";
import { Link } from "react-router-dom";

interface Prize {
  id: string;
  name: string;
  description: string;
  image_url: string;
  value: number;
}

const PrizesSection = () => {
  const { data: prizes, isLoading } = useQuery({
    queryKey: ['prize-catalog'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prize_catalog')
        .select('*')
        .eq('is_active', true)
        .limit(6);
      
      if (error) throw error;
      return data as Prize[];
    }
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Gift className="w-12 h-12 mx-auto text-purple-600 mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Les cadeaux à gagner
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez notre sélection de cadeaux exceptionnels. Participez à nos concours pour tenter de les remporter !
            </p>
          </motion.div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg" />
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {prizes?.map((prize) => (
              <motion.div key={prize.id} variants={item}>
                <Card className="group hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                  {prize.image_url && (
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <img
                        src={prize.image_url}
                        alt={prize.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl">{prize.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-gray-600">{prize.description}</p>
                    {prize.value && (
                      <p className="text-purple-600 font-semibold mt-2">
                        Valeur : {prize.value}€
                      </p>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full group">
                      <Link to="/contests">
                        Découvrir le concours
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default PrizesSection;
