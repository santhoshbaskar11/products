import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SectionHeader from '../components/ui/SectionHeader';
import { Compass, Leaf, Scissors, Briefcase, ChevronRight } from 'lucide-react';

const About = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('heritage');

  // Check if a specific tab was requested via query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && ['heritage', 'ingredients', 'barber', 'careers'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location]);

  const tabs = [
    {
      id: 'heritage',
      label: 'Our Heritage',
      icon: Compass,
      title: 'A Legacy of Refinement',
      subtitle: 'Forged from standard apothecary traditions and modern style requirements.',
      content: (
        <div className="space-y-6 text-sm text-zinc-400 font-light leading-relaxed">
          <p>
            Established in 2024, Sovereign Grooming Co. was founded on a simple conviction: that the modern gentleman deserves grooming products crafted with the same integrity and precision as a bespoke suit.
          </p>
          <p>
            Disillusioned by generic, mass-produced chemical mixtures that dominate drugstore shelves, our founders teamed up with botanical chemists and master barbers in London and Paris to revive traditional artisanal blending.
          </p>
          <p>
            Every balm, oil, and wash we produce is crafted in small batches, ensuring unparalleled quality control. We merge time-honored apothecary wisdom with progressive dermatological science to bring you grooming formulations that perform flawlessly.
          </p>
          <blockquote className="border-l-2 border-[#C9A84C] pl-4 my-6 italic text-[#E8C97E]">
            "True sophistication is not about being noticed, but about being remembered."
          </blockquote>
        </div>
      ),
    },
    {
      id: 'ingredients',
      label: 'Ingredients Source',
      icon: Leaf,
      title: 'Botanical Authenticity',
      subtitle: 'Only the finest cold-pressed organic extracts and premium essential oils.',
      content: (
        <div className="space-y-6 text-sm text-zinc-400 font-light leading-relaxed">
          <p>
            We believe that what you put on your body is just as important as what you put in it. That is why our products contain zero parabens, zero sulfates, zero synthetic colorants, and zero fillers.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-4">
            <div className="bg-zinc-950 p-5 rounded-2xl border border-white/5">
              <h4 className="text-white font-serif text-sm font-semibold mb-2 flex items-center gap-2">
                <span className="text-[#C9A84C]">✓</span> Argan & Jojoba
              </h4>
              <p className="text-xs font-light text-zinc-500">
                Sourced directly from organic cooperatives in Morocco and Arizona, cold-pressed to retain vitamins and natural antioxidants.
              </p>
            </div>
            <div className="bg-zinc-950 p-5 rounded-2xl border border-white/5">
              <h4 className="text-white font-serif text-sm font-semibold mb-2 flex items-center gap-2">
                <span className="text-[#C9A84C]">✓</span> Sandalwood & Cedar
              </h4>
              <p className="text-xs font-light text-zinc-500">
                Premium, steam-distilled essential oils that offer our signature woodsy aromas without relying on synthetic fragrances.
              </p>
            </div>
          </div>
          <p>
            Our formulations are certified cruelty-free and dermatologically audited to ensure compatibility with all skin types, including sensitive skin.
          </p>
        </div>
      ),
    },
    {
      id: 'barber',
      label: 'The Barber Program',
      icon: Scissors,
      title: 'Partnering with the Professionals',
      subtitle: 'Exclusive supplies and benefits for premium barbershops worldwide.',
      content: (
        <div className="space-y-6 text-sm text-zinc-400 font-light leading-relaxed">
          <p>
            The Sovereign Barber Program is an exclusive alliance designed for elite shops and salons who share our commitment to superior craftsmanship.
          </p>
          <p>
            As a registered Sovereign Barber Partner, you gain access to discounted backbar sizes, custom retail shelving, educational training sessions, and early access to our limited-edition formulations.
          </p>
          <p>
            We also feature our partner barbershops in our store locator, driving premium traffic directly to your chairs.
          </p>
          <div className="pt-4">
            <a
              href="#/contact?subject=Barber+Program"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E8C97E] px-6 py-3 text-xs font-bold uppercase tracking-wider text-black transition-all hover:scale-105"
            >
              Apply For Partnership <ChevronRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      ),
    },
    {
      id: 'careers',
      label: 'Careers',
      icon: Briefcase,
      title: 'Join the Guild',
      subtitle: 'We are always looking for creative, passionate professionals.',
      content: (
        <div className="space-y-6 text-sm text-zinc-400 font-light leading-relaxed">
          <p>
            At Sovereign, we cultivate a workspace of innovation, excellence, and collaborative design. We are growing quickly and looking for candidates in cosmetic chemistry, design, logistics, and content creation.
          </p>
          <div className="space-y-3 my-4">
            <div className="flex justify-between items-center bg-zinc-950 p-4 rounded-xl border border-white/5">
              <div>
                <span className="text-white text-sm font-serif font-medium">Formulation Scientist</span>
                <p className="text-[10px] text-zinc-500 font-light">Product R&D — Full-time</p>
              </div>
              <span className="text-xs text-[#C9A84C] font-semibold">Apply</span>
            </div>
            <div className="flex justify-between items-center bg-zinc-950 p-4 rounded-xl border border-white/5">
              <div>
                <span className="text-white text-sm font-serif font-medium">Visual Brand Designer</span>
                <p className="text-[10px] text-zinc-500 font-light">Marketing & UI — Full-time</p>
              </div>
              <span className="text-xs text-[#C9A84C] font-semibold">Apply</span>
            </div>
          </div>
          <p>
            Don't see your role? Send your CV and a brief cover letter directly to our recruiting panel: <strong className="text-white">careers@sovereign.com</strong>.
          </p>
        </div>
      ),
    },
  ];

  const activeTabData = tabs.find((t) => t.id === activeTab) || tabs[0];
  const IconComponent = activeTabData.icon;

  return (
    <div className="py-28 bg-[#08080a] min-h-screen relative overflow-hidden text-gray-300">
      <div className="absolute top-20 left-1/3 w-[500px] h-[500px] rounded-full bg-[#C9A84C]/2 blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <SectionHeader
          badge="About Sovereign"
          title="Crafted For Excellence"
          subtitle="Discover our history, our selection of raw ingredients, and our dedication to elevating men's daily self-care rituals."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">
          
          {/* Navigation Sidebar (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-2">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-4 w-full p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'bg-zinc-900 border-[#C9A84C]/30 text-white shadow-lg'
                      : 'bg-zinc-950/40 border-white/5 text-zinc-400 hover:text-white hover:bg-zinc-900/20'
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#C9A84C] to-[#E8C97E] text-black font-bold'
                        : 'bg-zinc-950 text-zinc-500'
                    }`}
                  >
                    <TabIcon className="h-5 w-5" />
                  </div>
                  <span className="font-serif text-sm font-semibold tracking-wide">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Editorial Content Pane (8 Cols) */}
          <div className="lg:col-span-8 bg-zinc-900/10 border border-white/5 rounded-3xl p-8 md:p-10 backdrop-blur-md relative">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C9A84C]/10 text-[#E8C97E]">
                <IconComponent className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-serif text-white">{activeTabData.title}</h2>
                <p className="text-xs text-[#C9A84C]/80 font-medium tracking-wide mt-1">{activeTabData.subtitle}</p>
              </div>
            </div>
            
            <hr className="border-white/5 my-6" />

            {activeTabData.content}
          </div>

        </div>

      </div>
    </div>
  );
};

export default About;
