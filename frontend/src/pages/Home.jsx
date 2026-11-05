import HeroSection from "../components/home/HeroSection";
import Partners from "../components/home/Partners";
import ExploreAWI from "../components/home/ExploreAWI";
import LatestFromAWI from "../components/home/LatestFromAWI";
import NewsletterStrip from "../components/home/NewsletterStrip";
import WhyAfrica from "../components/home/WhyAfrica";
import FinalCTA from "../components/home/FinalCTA";

export default function Home() {
  return (
    <>
      <HeroSection />

      {/* What we do → why it matters → proof → who trusts us → get involved → stay in touch */}
      <ExploreAWI />
      <WhyAfrica />
      <LatestFromAWI />
      <Partners />
      <FinalCTA />
      <NewsletterStrip />
    </>
  );
}
