import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { ShopContext } from '../context/ShopContext';
import SectionHeader from '../components/ui/SectionHeader';
import { Sparkles, ShoppingBag, Gift, Star, Award, Copy, Check, ChevronDown, HelpCircle } from 'lucide-react';
import { CUSTOM_GROOMING_KITS } from '../data/products';
import b1 from '../assets/images/products/b1.jpg';
import h1 from '../assets/images/products/h1.jpg';
import s1 from '../assets/images/products/s1.jpg';

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
        <p className="mt-2 text-xs md:text-sm text-zinc-400 font-light leading-relaxed pl-1">
          {answer}
        </p>
      )}
    </div>
  );
};

const CustomGrooming = () => {
  const { addCustomKitToCart } = useContext(ShopContext);

  // kit builder state
  const [category, setCategory] = useState('beard');
  const [productType, setProductType] = useState('Imperial Beard Oil');
  const [brand, setBrand] = useState('Sovereign Lab');
  const [fragrance, setFragrance] = useState('Sandalwood Bourbon');
  const [packaging, setPackaging] = useState(false);
  const [notes, setNotes] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // pricing logic
  const getBasePrice = () => {
    switch (category) {
      case 'hair': return 38.00;
      case 'skin': return 42.00;
      default: return 45.00; // beard
    }
  };

  const getCategoryImage = () => {
    switch (category) {
      case 'hair': return h1;
      case 'skin': return s1;
      default: return b1; // beard
    }
  };

  const basePrice = getBasePrice();
  const packagingPrice = packaging ? 9.99 : 0.00;
  const estimatedPrice = (basePrice + packagingPrice) * quantity;

  // Update default product selections when changing kit type
  const handleCategoryChange = (cat) => {
    setCategory(cat);
    if (cat === 'beard') setProductType('Imperial Beard Oil');
    if (cat === 'hair') setProductType('Matte Clay Pomade');
    if (cat === 'skin') setProductType('Caffeine Eye Rescue');
  };

  const handleAddKit = () => {
    const kit = {
      category,
      brand,
      fragrance,
      packaging,
      notes,
      quantity,
      price: basePrice + packagingPrice,
      image: getCategoryImage(),
    };
    addCustomKitToCart(kit);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // CUSTOM_GROOMING_KITS loaded from products data

  const faqs = [
    {
      question: "What is included in the premium wooden packaging?",
      answer: "Our premium wooden gift box packaging features hand-varnished solid oak wood, padded velvet lining to secure items, magnetic locking flaps, and custom gold-leaf engraving matching your typed custom notes."
    },
    {
      question: "How long does custom engraving take?",
      answer: "Custom personalized kit configurations are individually inspected, hand-packed, and engraved at our flagships within 24-48 hours before shipment dispatch."
    },
    {
      question: "Can I return a customized grooming kit?",
      answer: "Due to the unique hand-engraved custom wood plates, personalized sets cannot be returned. However, if any base product formulation does not satisfy your grooming needs, we will ship a replacement free of charge."
    }
  ];

  return (
    <div className="bg-[#08080a] min-h-screen text-gray-300 overflow-hidden">
      
      {/* 1. Hero Section */}
      <div className="relative min-h-[85vh] flex items-center justify-center pt-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#C9A84C]/5 blur-[120px]"></div>
          <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#E8C97E]/3 blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center space-y-6 md:space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-white/10 backdrop-blur-md"
          >
            <Award className="h-4.5 w-4.5 text-[#C9A84C]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#E8C97E]">Personalized Luxury Experience</span>
          </motion.div>

          <div className="space-y-4 max-w-4xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-7xl font-bold font-serif text-white tracking-tight leading-tight"
            >
              Hand-Tailored Kit <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] to-[#E8C97E]">For Your Signature Style</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-zinc-400 text-base md:text-lg font-light max-w-2xl mx-auto leading-relaxed"
            >
              Design your personalized grooming collection. Handpick kit types, artisan brands, base fragrances, and custom gold-engraved wooden box plates.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center"
          >
            <a
              href="#builder"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E8C97E] px-8 py-4 text-xs font-bold uppercase tracking-wider text-black transition-all hover:shadow-[0_0_20px_rgba(201,168,76,0.35)] hover:scale-105"
            >
              Start Personalizing Kit
            </a>
          </motion.div>
        </div>
      </div>

      {/* 2. Interactive Kit Configurator Section */}
      <section id="builder" className="py-24 bg-[#0a0a0d] border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <SectionHeader
            badge="Personalizer Engine"
            title="Design Your Custom Kit"
            subtitle="Choose your specifications. Watch the live summary update instantly, then add your custom box to your shopping bag."
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Options Selection Form (7 Cols) */}
            <div className="lg:col-span-7 bg-zinc-950 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 text-left shadow-2xl">
              <h3 className="text-xl font-bold text-white font-serif border-b border-white/5 pb-3">Kit Configurations</h3>
              
              {/* Category picker tabs */}
              <div className="space-y-2">
                <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider block">1. Select Kit Type</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { id: 'beard', name: 'Beard Care' },
                    { id: 'hair', name: 'Hair Styling' },
                    { id: 'skin', name: 'Skincare' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => handleCategoryChange(tab.id)}
                      className={`py-3 px-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all text-center cursor-pointer ${
                        category === tab.id
                          ? 'border-[#C9A84C] bg-[#C9A84C]/5 text-[#E8C97E]'
                          : 'border-white/5 bg-zinc-900/50 text-zinc-400 hover:border-zinc-800'
                      }`}
                    >
                      {tab.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sub product item details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider block">2. Core Product Type</label>
                  <select
                    value={productType}
                    onChange={(e) => setProductType(e.target.value)}
                    className="w-full rounded-xl bg-zinc-900 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C] cursor-pointer"
                  >
                    {category === 'beard' && (
                      <>
                        <option>Imperial Beard Oil</option>
                        <option>Sandalwood Beard Balm</option>
                        <option>Activated Charcoal Beard Wash</option>
                      </>
                    )}
                    {category === 'hair' && (
                      <>
                        <option>Matte Clay Pomade</option>
                        <option>Caffeine Growth Shampoo</option>
                        <option>Tea Tree Conditioner</option>
                        <option>Texturizing Sea Salt Spray</option>
                      </>
                    )}
                    {category === 'skin' && (
                      <>
                        <option>Volcanic Sand Face Scrub</option>
                        <option>Daily Hydration Shield SPF 20</option>
                        <option>Caffeine Eye Rescue Cream</option>
                        <option>Hyaluronic Acid Repair Serum</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider block">3. Artisan Brand</label>
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full rounded-xl bg-zinc-900 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C] cursor-pointer"
                  >
                    <option>Sovereign Lab</option>
                    <option>Apex Grooming</option>
                    <option>Vanguard Botanicals</option>
                    <option>Onyx & Clay</option>
                  </select>
                </div>
              </div>

              {/* Fragrance base select */}
              <div className="space-y-2">
                <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider block">4. Select Scent Base</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    'Sandalwood Bourbon',
                    'Fresh Bergamot Mint',
                    'Smoky Agarwood',
                    'Crushed Cedarwood Sage',
                    'Natural Unscented'
                  ].map((scent) => (
                    <button
                      key={scent}
                      type="button"
                      onClick={() => setFragrance(scent)}
                      className={`py-3 px-3 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                        fragrance === scent
                          ? 'border-[#C9A84C] bg-[#C9A84C]/5 text-[#E8C97E]'
                          : 'border-white/5 bg-zinc-900/50 text-zinc-400 hover:border-zinc-800'
                      }`}
                    >
                      {scent}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom box engraving note details */}
              <div className="space-y-2">
                <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider block">5. Gold Engraved Plate Message</label>
                <textarea
                  rows="3"
                  maxLength="80"
                  placeholder="e.g. Liam Vance - Sovereign Edition (Max 80 chars)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900 border border-white/10 p-4 text-sm text-white focus:outline-none focus:border-[#C9A84C] transition-colors"
                ></textarea>
              </div>

              {/* Box packaging checkbox */}
              <div className="flex items-center gap-3 p-4 rounded-xl border border-white/5 bg-zinc-900/25">
                <input
                  type="checkbox"
                  id="premiumbox"
                  checked={packaging}
                  onChange={(e) => setPackaging(e.target.checked)}
                  className="h-4.5 w-4.5 rounded border-zinc-800 text-[#C9A84C] focus:ring-[#C9A84C] cursor-pointer"
                />
                <div className="text-left">
                  <label htmlFor="premiumbox" className="text-xs font-bold text-white uppercase tracking-wider block cursor-pointer">
                    Upgrade to Premium Wooden Presentation Box (+ $9.99)
                  </label>
                  <span className="text-[10px] text-zinc-500 font-light mt-0.5 block">Solid Oak wood box, gold-foil detailing, and plate engraving.</span>
                </div>
              </div>

            </div>

            {/* Live Summary Panel (5 Cols) */}
            <div className="lg:col-span-5 bg-zinc-950 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 text-left shadow-2xl relative">
              <h3 className="text-lg font-bold text-white font-serif border-b border-white/5 pb-3 flex justify-between items-center">
                <span>Kit Order Summary</span>
                <Sparkles className="h-4.5 w-4.5 text-[#C9A84C]" />
              </h3>

              {/* Preview image */}
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-md">
                <img
                  src={getCategoryImage()}
                  alt="Custom Package preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="text-[10px] font-bold text-[#E8C97E] uppercase tracking-widest bg-[#C9A84C]/15 border border-[#C9A84C]/25 rounded-md px-2 py-0.5">
                    {category} Grooming
                  </span>
                </div>
              </div>

              {/* Config list summary */}
              <div className="space-y-4 text-xs">
                <div className="flex justify-between border-b border-white/5 pb-2.5">
                  <span className="text-zinc-500 uppercase tracking-widest font-semibold text-[10px]">Specifications:</span>
                  <span className="text-white font-bold">{brand}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2.5">
                  <span className="text-zinc-500 uppercase tracking-widest font-semibold text-[10px]">Key Formulation:</span>
                  <span className="text-white font-bold">{productType}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2.5">
                  <span className="text-zinc-500 uppercase tracking-widest font-semibold text-[10px]">Fragrance Base:</span>
                  <span className="text-white font-bold">{fragrance}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2.5">
                  <span className="text-zinc-500 uppercase tracking-widest font-semibold text-[10px]">Gift Packaging:</span>
                  <span className="text-white font-bold">{packaging ? 'Premium Oak Wood' : 'Minimal Matte Black'}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2.5 items-start">
                  <span className="text-zinc-500 uppercase tracking-widest font-semibold text-[10px] shrink-0">Custom Engraving:</span>
                  <span className="text-white font-bold text-right truncate max-w-[200px]" title={notes}>{notes || 'None Specified'}</span>
                </div>

                {/* Quantity */}
                <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                  <span className="text-zinc-500 uppercase tracking-widest font-semibold text-[10px]">Kits Quantity:</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(q => q > 1 ? q - 1 : 1)}
                      className="px-2 py-1 text-zinc-400 hover:text-white rounded border border-white/10"
                    >
                      -
                    </button>
                    <span className="text-white font-bold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      className="px-2 py-1 text-zinc-400 hover:text-white rounded border border-white/10"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Estimate calculation pricing */}
              <div className="flex justify-between items-center border-t border-white/5 pt-4">
                <span className="text-sm font-bold uppercase tracking-wider text-white">Estimated Kit Total</span>
                <span className="text-3xl font-extrabold text-[#C9A84C] font-serif">${estimatedPrice.toFixed(2)}</span>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleAddKit}
                disabled={added}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E8C97E] py-4 text-xs font-bold uppercase tracking-wider text-black transition-all hover:shadow-[0_0_20px_rgba(201,168,76,0.35)] cursor-pointer"
              >
                {added ? (
                  <>
                    <Check className="h-4.5 w-4.5" /> Added To Bag!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4.5 w-4.5" /> Add Custom Kit to Bag
                  </>
                )}
              </button>

            </div>

          </div>

        </div>
      </section>

      {/* 3. Predefined Best-Selling Grooming Kits Showcase */}
      <section className="py-24 bg-[#08080a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <SectionHeader
            badge="Classic Collections"
            title="Pre-Configured Grooming Kits"
            subtitle="Looking for classic options? Browse our pre-packaged configurations, featuring curated products."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CUSTOM_GROOMING_KITS.map((kit) => (
              <div
                key={kit.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 backdrop-blur-md p-4 transition-all duration-500 hover:border-[#C9A84C]/50 hover:shadow-[0_0_30px_rgba(201,168,76,0.15)]"
              >
                
                <div className="relative aspect-square overflow-hidden rounded-xl bg-zinc-950">
                  <span className="absolute left-3 top-3 z-10 rounded-full bg-gradient-to-r from-[#C9A84C] to-[#E8C97E] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-black shadow-md">
                    {kit.tag}
                  </span>
                  
                  <img
                    src={kit.image}
                    alt={kit.name}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                </div>

                <div className="mt-4 flex flex-1 flex-col justify-between text-left">
                  <div>
                    <div className="flex text-[#C9A84C] gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < Math.floor(kit.rating) ? 'fill-current' : 'text-zinc-700'}`} />
                      ))}
                      <span className="text-[11px] text-zinc-400 font-medium ml-1">({kit.reviewsCount})</span>
                    </div>

                    <h3 className="mt-2 text-base font-semibold text-white tracking-wide group-hover:text-[#E8C97E] transition-colors">
                      {kit.name}
                    </h3>
                    
                    <p className="mt-1 text-xs text-zinc-400 font-light line-clamp-2 leading-relaxed">
                      {kit.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-lg font-bold text-white">${kit.price.toFixed(2)}</span>
                    
                    <button
                      onClick={() => addCustomKitToCart({
                        category: kit.id === 'bk1' ? 'beard' : 'skin',
                        brand: 'Sovereign Lab',
                        fragrance: 'Sandalwood Bourbon',
                        packaging: true,
                        notes: `Premade ${kit.name}`,
                        quantity: 1,
                        price: kit.price,
                        image: kit.image
                      })}
                      className="flex items-center gap-1.5 rounded-xl bg-zinc-800 text-white transition-all px-3 py-2 text-xs font-bold uppercase tracking-wider hover:bg-[#C9A84C] hover:text-black cursor-pointer"
                    >
                      <ShoppingBag className="h-3.5 w-3.5" />
                      Add to Cart
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. Personalized Gift Sets Features */}
      <section className="py-20 bg-zinc-950 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-left">
            
            {/* Visual description */}
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#E8C97E]">The Ultimate Gift</span>
              <h3 className="text-3xl md:text-5xl font-bold font-serif text-white leading-tight">
                Gold Foil Engravings <br />
                <span className="text-zinc-500 font-light">Custom Hand-Packaged Sets</span>
              </h3>
              <p className="text-sm text-zinc-400 font-light leading-relaxed">
                Nothing commands luxury quite like custom personalized gifts. Our master engravers write custom text onto brass metallic plates attached to premium solid varnished oak presentation boxes. Give a statement of style, routine hygiene, and thoughtfulness.
              </p>
              
              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/5">
                <div>
                  <h5 className="text-[#E8C97E] font-bold text-sm">Oak Wood Shells</h5>
                  <p className="text-xs text-zinc-500 font-light mt-1">Re-usable presentation boxes varnished to protect oils.</p>
                </div>
                <div>
                  <h5 className="text-[#E8C97E] font-bold text-sm">Plate Engravings</h5>
                  <p className="text-xs text-zinc-500 font-light mt-1">Plate engraving detailing dates, names, or quotes.</p>
                </div>
              </div>
            </div>

            {/* visual media */}
            <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=80"
                alt="Engraving details packaging"
                className="w-full h-full object-cover"
              />
            </div>

          </div>
        </div>
      </section>

      {/* 5. Custom reviews testimonial details */}
      <section className="py-24 bg-[#0a0a0d] border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="flex justify-center text-[#C9A84C] gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-current" />
            ))}
          </div>
          
          <h4 className="text-xl md:text-2xl font-light font-serif text-white italic leading-relaxed">
            "The personalized engraving is stunning. I ordered a Custom Beard Care Kit for my brother's wedding with his initials engraved on the wooden oak box. The Sandalwood fragrance smells amazing, and the box looks like a museum display piece. Hands down the best grooming brand."
          </h4>

          <div className="flex items-center gap-4 justify-center">
            <div className="h-12 w-12 rounded-full overflow-hidden border border-[#C9A84C]/50 shadow-md">
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" alt="Reviewer" className="w-full h-full object-cover" />
            </div>
            <div className="text-left">
              <h5 className="text-sm font-bold text-white">Jonathan Sterling</h5>
              <span className="text-[10px] text-[#C9A84C] font-semibold uppercase tracking-wider block">Verified Buyer</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ Section */}
      <section className="py-24 bg-[#08080a] border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#C9A84C] bg-[#C9A84C]/10 px-3 py-1 rounded-full mb-3">
              <HelpCircle className="h-3.5 w-3.5" /> FAQs
            </span>
            <h3 className="text-2xl md:text-3xl font-bold font-serif text-white">Custom Kit Inquiries</h3>
          </div>

          <div className="bg-zinc-900/20 border border-white/5 rounded-3xl p-6 md:p-8 space-y-4 backdrop-blur-md shadow-lg">
            {faqs.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} />
            ))}
          </div>

        </div>
      </section>

    </div>
  );
};

export default CustomGrooming;
