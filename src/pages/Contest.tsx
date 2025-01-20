import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { differenceInDays, differenceInHours, differenceInMinutes } from "date-fns";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import ContestHeader from "@/components/contest/ContestHeader";
import ContestStats from "@/components/contest/ContestStats";
import ContestPrizes from "@/components/contest/ContestPrizes";
import QuestionnaireComponent from "@/components/QuestionnaireComponent";

const Contest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);

  const { data: contest, isLoading: contestLoading } = useQuery({
    queryKey: ['contest', id],
    queryFn: async () => {
      console.log("Fetching contest with ID:", id);
      const { data, error } = await supabase
        .from('contests')
        .select(`
          *,
          prizes (
            *,
            prize_catalog (
              name,
              description,
              image_url,
              value,
              shop_url
            )
          ),
          participants (count)
        `)
        .eq('id', id)
        .single();
      
      if (error) {
        console.error("Error fetching contest:", error);
        throw error;
      }
      
      console.log("Contest data retrieved:", data);
      return data;
    },
    enabled: !!id
  });

  useEffect(() => {
    if (!contest?.end_date) return;

    const updateTimeLeft = () => {
      const now = new Date();
      const endDate = new Date(contest.end_date);
      
      if (now >= endDate) {
        setTimeLeft("Concours terminé");
        return;
      }

      const days = differenceInDays(endDate, now);
      const hours = differenceInHours(endDate, now) % 24;
      const minutes = differenceInMinutes(endDate, now) % 60;

      setTimeLeft(`${days}j ${hours}h ${minutes}m`);
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 60000);
    return () => clearInterval(interval);
  }, [contest?.end_date]);

  if (contestLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center">
        <Card className="max-w-lg w-full mx-4">
          <CardContent className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">
              Concours non trouvé
            </h2>
            <p className="text-gray-600">
              Le concours que vous recherchez n'existe pas ou n'est plus disponible.
            </p>
            <Button onClick={() => navigate('/contests')}>
              Voir les concours disponibles
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showQuestionnaire) {
    return <QuestionnaireComponent contestId={id} />;
  }

  const mainPrizeImage = contest?.prizes?.[0]?.prize_catalog?.image_url || contest?.prize_image_url;
  const canonicalUrl = `${window.location.origin}/contests/${id}`;
  const prizeValue = contest?.prizes?.[0]?.prize_catalog?.value;
  const prizeDescription = contest?.prizes?.[0]?.prize_catalog?.description;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12">
      <Helmet>
        <title>{contest.title} - Participez et gagnez des prix</title>
        <meta name="description" content={contest.description || `Participez au concours "${contest.title}" et tentez de gagner des prix exceptionnels !`} />
        <link rel="canonical" href={canonicalUrl} />
        
        <meta property="og:title" content={contest.title} />
        <meta property="og:description" content={contest.description || `Participez et tentez de gagner ${prizeValue ? `${prizeValue}$ en prix` : 'des prix exceptionnels'} !`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        {mainPrizeImage && (
          <>
            <meta property="og:image" content={mainPrizeImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
          </>
        )}
        
        {prizeValue && (
          <>
            <meta property="product:price:amount" content={prizeValue.toString()} />
            <meta property="product:price:currency" content="CAD" />
          </>
        )}
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={contest.title} />
        <meta name="twitter:description" content={contest.description || `Participez et gagnez des prix exceptionnels !`} />
        {mainPrizeImage && <meta name="twitter:image" content={mainPrizeImage} />}
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            "name": contest.title,
            "description": contest.description,
            "image": mainPrizeImage,
            "startDate": contest.start_date,
            "endDate": contest.end_date,
            "location": {
              "@type": "VirtualLocation",
              "url": canonicalUrl
            },
            "offers": prizeValue ? {
              "@type": "Offer",
              "price": prizeValue,
              "priceCurrency": "CAD",
              "description": prizeDescription
            } : undefined
          })}
        </script>
      </Helmet>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <ContestHeader 
            title={contest?.title || ''}
            description={contest?.description}
            imageUrl={mainPrizeImage}
          />

          <ContestStats
            participantsCount={contest?.participants?.[0]?.count || 0}
            successPercentage={0}
            timeLeft={timeLeft}
            endDate={contest?.end_date}
          />

          <ContestPrizes prizes={contest?.prizes || []} />

          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={() => setShowQuestionnaire(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-lg px-8 py-6 h-auto"
            >
              Participer maintenant
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contest;