import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import PrizesSection from "@/components/home/PrizesSection";
import WhyParticipateSection from "@/components/home/WhyParticipateSection";
import CTASection from "@/components/home/CTASection";
import Footer from "@/components/home/Footer";
import ActiveContestsSection from "@/components/home/ActiveContestsSection";
import StatsAndWinnersSection from "@/components/home/StatsAndWinnersSection";
import Layout from "@/components/Layout";

const Index = () => {
  return (
    <Layout>
      <div className="min-h-screen">
        <HeroSection />
        <StatsSection />
        <ActiveContestsSection />
        <PrizesSection />
        <StatsAndWinnersSection />
        <WhyParticipateSection />
        <CTASection />
        <Footer />
      </div>
    </Layout>
  );
};

export default Index;