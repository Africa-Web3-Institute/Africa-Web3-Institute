import HeroSection from "../components/home/HeroSection";
import StatsBar from "../components/home/StatsBar";
import WhatWeDo from "../components/home/WhatWeDo";
import FeaturedReport from "../components/home/FeaturedReport";
import WhoWeAre from "../components/home/WhoWeAre";
import WhyAfrica from "../components/home/WhyAfrica";
import Programs from "../components/home/Programs";
import Publications from "../components/home/Publications";
import Events from "../components/home/Events";
import Community from "../components/home/Community";
import NewsletterStrip from "../components/home/NewsletterStrip";
import ContactSection from "../components/home/ContactSection";
import FinalCTA from "../components/home/FinalCTA";
import AfricaMapTeaser from "../components/map/AfricaMapTeaser";

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <div id="team">
        <WhoWeAre />
      </div>

      <div id="research">
        <WhatWeDo />
      </div>
      <div id="map">
        {" "}
        <AfricaMapTeaser />{" "}
      </div>

      <FeaturedReport />

      <WhyAfrica />
        <div id="programs">
        <Programs />
      </div>
      <div id="publications">
        <Publications />
      </div>

      <div id="events">
        <Events />
      </div>

      <div id="community">
        <Community />
      </div>
      <NewsletterStrip />

      <FinalCTA />
    <div id="contact">
        <ContactSection />
      </div>
    </>
  );
}
