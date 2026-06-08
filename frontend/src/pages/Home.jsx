import Hero3D from '../components/Hero3D';
import HomeStats from '../components/HomeStats';

import HomeAbout from '../components/HomeAbout';
import HomeWhyChooseUs from '../components/HomeWhyChooseUs';
import HomeExpertise from '../components/HomeExpertise';
import HomeFeedback from '../components/HomeFeedback';

export default function Home() { 
  return (
    <div className="bg-navy min-h-screen text-white font-sans">
      <Hero3D />
      <HomeStats />
      <HomeAbout />

      <HomeWhyChooseUs />
      <HomeExpertise />
      <HomeFeedback />
    </div>
  ); 
}
