import React, { useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import SectionHeader from '../components/ui/SectionHeader';
import { Mail, Phone, MapPin, Send, HelpCircle, ChevronDown, Check } from 'lucide-react';

const FAQItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/5 pb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-left py-3 focus:outline-none cursor-pointer"
      >
        <span className="text-sm font-semibold text-white tracking-wide">{question}</span>
        <ChevronDown className={`h-4.5 w-4.5 text-[#C9A84C] transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <p className="mt-2 text-xs md:text-sm text-zinc-400 font-light leading-relaxed pl-1 transition-all duration-300">
          {answer}
        </p>
      )}
    </div>
  );
};

const Contact = () => {
  const { addContactMessage } = useContext(ShopContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && email && message) {
      addContactMessage({
        id: `MSG-${Date.now().toString().slice(-4)}`,
        name,
        email,
        message,
        unread: true,
        date: new Date().toISOString().slice(0, 10)
      });
      setSent(true);
      setName('');
      setEmail('');
      setMessage('');
      setTimeout(() => setSent(false), 3000);
    }
  };

  const faqs = [
    {
      question: "Are Sovereign products suitable for sensitive skin?",
      answer: "Yes, our skincare formulations are dermatologically tested, pH-balanced, and made with natural botanical ingredients like organic tea tree, aloe vera, and volcanic minerals, specifically for sensitive skin types."
    },
    {
      question: "How long does shipping take?",
      answer: "We offer free standard shipping on orders over $50, which takes 3-5 business days. Express shipping takes 1-2 business days. International orders take 7-14 business days."
    },
    {
      question: "Do you offer wholesale opportunities for barbershops?",
      answer: "Absolutely! We run a dedicated Sovereign Barber Program. Please contact us via wholesale@sovereigngrooming.com with your barbershop license and details, and our sales team will reach out."
    },
    {
      question: "What is your refund policy?",
      answer: "We offer a 30-day money-back guarantee. If you are not completely satisfied with your purchase, you can return it within 30 days for a full refund. Return shipping is free."
    }
  ];

  return (
    <div className="py-28 bg-[#08080a] min-h-screen relative overflow-hidden">
      
      {/* Decorative glows */}
      <div className="absolute top-20 left-[-10%] w-[500px] h-[500px] rounded-full bg-[#C9A84C]/3 blur-[130px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <SectionHeader
          badge="Get In Touch"
          title="Contact Our Concierge"
          subtitle="Have questions about our ingredients, orders, or styling products? Reach out, and our grooming experts will respond within 24 hours."
        />

        {/* Contact info grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="flex flex-col items-center text-center p-8 rounded-3xl border border-white/5 bg-zinc-900/20 backdrop-blur-md hover:border-zinc-800 transition-all duration-300">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C9A84C]/10 text-[#C9A84C] mb-4">
              <Mail className="h-6 w-6" />
            </div>
            <h4 className="text-base font-bold text-white mb-1">Email Us</h4>
            <p className="text-xs text-zinc-400 font-light mb-3">Drop us a line anytime</p>
            <a href="mailto:support@sovereigngrooming.com" className="text-sm font-semibold text-[#E8C97E] hover:underline">
              support@sovereigngrooming.com
            </a>
          </div>

          <div className="flex flex-col items-center text-center p-8 rounded-3xl border border-white/5 bg-zinc-900/20 backdrop-blur-md hover:border-zinc-800 transition-all duration-300">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C9A84C]/10 text-[#C9A84C] mb-4">
              <Phone className="h-6 w-6" />
            </div>
            <h4 className="text-base font-bold text-white mb-1">Call Us</h4>
            <p className="text-xs text-zinc-400 font-light mb-3">Mon-Fri from 9am to 6pm EST</p>
            <a href="tel:+18005557799" className="text-sm font-semibold text-[#E8C97E] hover:underline">
              +1 (800) 555-7799
            </a>
          </div>

          <div className="flex flex-col items-center text-center p-8 rounded-3xl border border-white/5 bg-zinc-900/20 backdrop-blur-md hover:border-zinc-800 transition-all duration-300">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C9A84C]/10 text-[#C9A84C] mb-4">
              <MapPin className="h-6 w-6" />
            </div>
            <h4 className="text-base font-bold text-white mb-1">Flagship Salon</h4>
            <p className="text-xs text-zinc-400 font-light mb-3">Visit our shop location</p>
            <span className="text-sm font-semibold text-white">
              742 Madison Ave, New York, NY
            </span>
          </div>
        </div>

        {/* Contact Form & Google Map Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20 items-stretch">
          
          {/* Form (7 Cols) */}
          <div className="lg:col-span-7 bg-zinc-950/80 border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col justify-center">
            {sent ? (
              <div className="text-center py-16 space-y-4">
                <div className="mx-auto h-16 w-16 rounded-full bg-green-500/20 border border-green-500/35 flex items-center justify-center text-green-500 shadow-lg">
                  <Check className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-white font-serif">Message Dispatched!</h3>
                <p className="text-sm text-zinc-400 font-light max-w-sm mx-auto leading-relaxed">
                  Thank you for writing. Our concierge support will email you a response shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 text-left">
                <h3 className="text-2xl font-bold text-white font-serif border-b border-white/5 pb-3">Send A Message</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Your Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Liam Vance"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full rounded-xl bg-zinc-900 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C] transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      placeholder="e.g. liam@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full rounded-xl bg-zinc-900 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C] transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-zinc-400 font-medium uppercase tracking-wider">How can we assist you?</label>
                  <textarea
                    rows="5"
                    placeholder="Provide details about your query or order ID..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="w-full rounded-xl bg-zinc-900 border border-white/10 p-4 text-sm text-white focus:outline-none focus:border-[#C9A84C] transition-colors"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E8C97E] w-full py-4 text-xs font-bold uppercase tracking-wider text-black transition-all duration-300 hover:shadow-[0_0_20px_rgba(201,168,76,0.3)] hover:scale-[1.01] cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                  Dispatch Message
                </button>
              </form>
            )}
          </div>

          {/* Premium Google Map Placeholder (5 Cols) */}
          <div className="lg:col-span-5 relative rounded-3xl overflow-hidden border border-white/10 bg-zinc-950 shadow-2xl h-80 lg:h-auto min-h-[300px]">
            {/* Styled dark iframe */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1837925890886!2d-73.9699661!3d40.7601955!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c258ec18f6c38f%3A0xc48e9cbfb3ffb9a2!2sMadison%20Ave%2C%20New%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) grayscale(80%) brightness(95%) contrast(90%)' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Sovereign Flagship Map"
            ></iframe>
            
            {/* Overlay detail */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/75 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-left shadow-2xl">
              <h5 className="text-xs font-bold text-[#E8C97E] uppercase tracking-widest">Sovereign Flagship</h5>
              <p className="text-[11px] text-zinc-400 font-light mt-1">Madison Ave, Midtown New York. Available for walk-ins and bookings.</p>
            </div>
          </div>

        </div>

        {/* FAQs Section */}
        <div className="max-w-3xl mx-auto space-y-6 pt-10 border-t border-white/5">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#C9A84C] bg-[#C9A84C]/10 px-3 py-1 rounded-full mb-3">
              <HelpCircle className="h-3.5 w-3.5" /> FAQs
            </span>
            <h3 className="text-2xl font-bold font-serif text-white">Frequently Asked Questions</h3>
          </div>
          
          <div className="bg-zinc-900/20 border border-white/5 rounded-3xl p-6 md:p-8 space-y-4 backdrop-blur-md shadow-lg">
            {faqs.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
