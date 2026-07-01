import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SectionHeader from '../components/ui/SectionHeader';
import { Truck, RotateCcw, HelpCircle, ChevronRight } from 'lucide-react';

const CustomerCare = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('shipping');
  const [faqSearch, setFaqSearch] = useState('');

  // Check if a specific tab was requested via query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && ['shipping', 'returns', 'faq'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location]);

  const faqs = [
    {
      q: 'Are your products safe for sensitive skin?',
      a: 'Yes, absolutely. All our formulations are handcrafted using certified organic, cold-pressed plant carrier oils and pure steam-distilled botanicals. They are free from harsh chemical foaming agents, synthetic perfumes, and parabens, making them gentle on even the most sensitive skin types.',
    },
    {
      q: 'How long does one bottle of beard oil last?',
      a: 'A standard 30ml bottle of Sovereign Beard Oil will last approximately 2 to 3 months with daily use. Typically, only 3-5 drops are needed per application depending on your beard length.',
    },
    {
      q: 'Do you ship internationally?',
      a: 'Yes, we provide luxury shipping options worldwide. International orders are handled by premium carriers (DHL Express, FedEx) and arrive within 5–9 business days, complete with full end-to-end tracking.',
    },
    {
      q: 'What is your return policy?',
      a: 'We offer an ironclad 30-day return policy. If you are not completely satisfied with your purchase, you may return the unused portion or opened bottle within 30 days for a full refund or replacement. No questions asked.',
    },
    {
      q: 'Can I cancel or change my custom grooming kit order?',
      a: 'Since custom grooming orders feature bespoke laser engraving and personalized scent formulation, they enter our production queue within 4 hours of purchase. You can request changes or cancellation within this 4-hour window by contacting support.',
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
      faq.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  const tabs = [
    {
      id: 'shipping',
      label: 'Shipping & Delivery',
      icon: Truck,
      title: 'Premium Shipping Standards',
      subtitle: 'Fast, secure, and fully tracked dispatch to your doorstep.',
      content: (
        <div className="space-y-6 text-sm text-zinc-400 font-light leading-relaxed">
          <p>
            At Sovereign Grooming Co., we treat shipping as an extension of our premium service. All products are hand-packaged in signature protective custom boxes to ensure they arrive in perfect condition.
          </p>
          <div className="space-y-4 my-6">
            <div className="flex justify-between items-center bg-zinc-950 p-4 rounded-xl border border-white/5">
              <div>
                <span className="text-white text-sm font-serif font-medium">Standard Ground Delivery</span>
                <p className="text-[10px] text-zinc-500 font-light">Free for all orders</p>
              </div>
              <span className="text-xs text-[#E8C97E] font-medium">3 - 5 Business Days</span>
            </div>
            <div className="flex justify-between items-center bg-zinc-950 p-4 rounded-xl border border-white/5">
              <div>
                <span className="text-white text-sm font-serif font-medium">Priority Express Delivery</span>
                <p className="text-[10px] text-zinc-500 font-light">$9.99 flat-rate (Free for orders over $75)</p>
              </div>
              <span className="text-xs text-[#E8C97E] font-medium">1 - 2 Business Days</span>
            </div>
          </div>
          <p>
            Orders placed before 2:00 PM EST are dispatched the same day. Tracking notifications are sent directly to your registered email and mobile number immediately after courier handoff.
          </p>
        </div>
      ),
    },
    {
      id: 'returns',
      label: 'Returns & Exchanges',
      icon: RotateCcw,
      title: 'Our Sovereign Guarantee',
      subtitle: 'Completely hassle-free 30-day return policy.',
      content: (
        <div className="space-y-6 text-sm text-zinc-400 font-light leading-relaxed">
          <p>
            We are dedicated to providing the highest quality grooming formulations in the industry. If a product does not meet your expectations, we want to make it right.
          </p>
          <div className="bg-zinc-950 p-6 rounded-2xl border border-white/5 my-4 space-y-4">
            <h4 className="text-[#E8C97E] text-xs font-bold uppercase tracking-widest">How to request a return:</h4>
            <ol className="list-decimal list-inside space-y-2 text-xs font-light text-zinc-400">
              <li>Open our contact page or email support@sovereign.com with your Order ID.</li>
              <li>Receive a prepaid shipping label via email within 24 hours.</li>
              <li>Package the items and drop them off at any local courier station.</li>
              <li>Your refund will be credited back to your original payment card within 3 business days of receipt.</li>
            </ol>
          </div>
          <p>
            *Please note: Bespoke custom-engraved wooden boxes are non-returnable unless damaged in transit.
          </p>
        </div>
      ),
    },
    {
      id: 'faq',
      label: 'FAQ Help Center',
      icon: HelpCircle,
      title: 'Frequently Answered Inquiries',
      subtitle: 'Answers to our most common customer service questions.',
      content: (
        <div className="space-y-6">
          <input
            type="text"
            placeholder="Search help topics..."
            value={faqSearch}
            onChange={(e) => setFaqSearch(e.target.value)}
            className="w-full rounded-xl bg-zinc-950 border border-white/10 px-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#C9A84C] mb-6"
          />

          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <div key={index} className="border-b border-white/5 pb-4 last:border-b-0">
                  <h4 className="text-white text-sm font-serif font-semibold mb-2">{faq.q}</h4>
                  <p className="text-xs text-zinc-400 font-light leading-relaxed">{faq.a}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-zinc-500 italic">No topics found matching your query.</p>
            )}
          </div>
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
          badge="Customer Support"
          title="Customer Care Center"
          subtitle="We are here to assist. Find answers to delivery rates, product guarantees, and common client inquiries."
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
                  onClick={() => {
                    setActiveTab(tab.id);
                    setFaqSearch('');
                  }}
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

export default CustomerCare;
