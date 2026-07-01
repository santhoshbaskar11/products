import beardOil from '../assets/images/products/beard-oil.jpg';
import beardBalm from '../assets/images/products/beard-balm.jpg';
import beardWash from '../assets/images/products/beard-wash.jpg';
import beardShampoo from '../assets/images/products/beard-shampoo.jpg';
import beardComb from '../assets/images/products/beard-comb.jpg';
import beardBrush from '../assets/images/products/beard-brush.jpg';
import groomingKit from '../assets/images/products/grooming-kit.jpg';

import hairShampoo from '../assets/images/products/hair-shampoo.jpg';
import hairConditioner from '../assets/images/products/hair-conditioner.jpg';
import hairWax from '../assets/images/products/hair-wax.jpg';
import hairClay from '../assets/images/products/hair-clay.jpg';
import hairSerum from '../assets/images/products/hair-serum.jpg';

import faceWash from '../assets/images/products/face-wash.jpg';
import faceScrub from '../assets/images/products/face-scrub.jpg';
import moisturizer from '../assets/images/products/moisturizer.jpg';
import sunscreen from '../assets/images/products/sunscreen.jpg';

export const BEARD_PRODUCTS = [
  {
    id: 'b1',
    name: 'Imperial Beard Oil',
    description: 'Infused with premium sandalwood and natural base oils for growth and royal shine.',
    price: 38.00,
    rating: 4.9,
    reviewsCount: 142,
    image: beardOil,
    tag: 'Best Seller',
    category: 'beard',
  },
  {
    id: 'b2',
    name: 'Sandalwood Beard Balm',
    description: 'Sculpts, softens, and defines your beard with natural shea butter and essential oils.',
    price: 24.00,
    rating: 4.8,
    reviewsCount: 98,
    image: beardBalm,
    tag: 'Premium Blend',
    category: 'beard',
  },
  {
    id: 'b3',
    name: 'Activated Charcoal Beard Wash',
    description: 'Deeply cleanses skin beneath the beard while keeping hair hydrated and soft.',
    price: 19.00,
    rating: 4.7,
    reviewsCount: 84,
    image: beardWash,
    category: 'beard',
  },
  {
    id: 'b4',
    name: 'Ultimate Beard Grooming Kit',
    description: 'Personalized wood grooming comb, natural boar bristle brush, premium oil, and balm.',
    price: 68.00,
    rating: 5.0,
    reviewsCount: 210,
    image: groomingKit,
    tag: 'Essential Kit',
    category: 'beard',
  },
  {
    id: 'b5',
    name: 'Cedarwood Beard Shampoo',
    description: 'Gentle, pH-balanced cleanser specially formulated for facial hair and sensitive skin.',
    price: 22.00,
    rating: 4.8,
    reviewsCount: 65,
    image: beardShampoo,
    tag: 'New Arrival',
    category: 'beard',
  },
  {
    id: 'b6',
    name: 'Sandalwood Beard Comb',
    description: 'Handcrafted anti-static wooden comb designed to glide smoothly through any beard density.',
    price: 15.00,
    rating: 4.9,
    reviewsCount: 120,
    image: beardComb,
    category: 'beard',
  },
  {
    id: 'b7',
    name: 'Boar Bristle Beard Brush',
    description: 'Premium natural bristles to distribute oils evenly, condition hair, and style effortlessly.',
    price: 18.00,
    rating: 4.8,
    reviewsCount: 94,
    image: beardBrush,
    category: 'beard',
  }
];

export const HAIR_PRODUCTS = [
  {
    id: 'h1',
    name: 'Matte Clay Styling Pomade',
    description: 'High hold with a natural matte finish, infused with bentonite clay.',
    price: 22.00,
    rating: 4.8,
    reviewsCount: 312,
    image: hairClay,
    tag: 'Firm Hold',
    category: 'hair',
  },
  {
    id: 'h2',
    name: 'Caffeine Growth Shampoo',
    description: 'Stimulates hair follicles, promotes thickness, and prevents hair thinning.',
    price: 26.00,
    rating: 4.9,
    reviewsCount: 425,
    image: hairShampoo,
    tag: 'Hair Growth',
    category: 'hair',
  },
  {
    id: 'h3',
    name: 'Tea Tree Scalp Conditioner',
    description: 'Soothes dry scalp, hydrates dry hair, and provides a tingling refreshment.',
    price: 24.00,
    rating: 4.7,
    reviewsCount: 188,
    image: hairConditioner,
    category: 'hair',
  },
  {
    id: 'h4',
    name: 'Texturizing Hair Serum Spray',
    description: 'Adds volume, definition, and a casual beach-day texture with a light hold.',
    price: 18.00,
    rating: 4.6,
    reviewsCount: 153,
    image: hairSerum,
    category: 'hair',
  },
  {
    id: 'h5',
    name: 'Premium Styling Hair Wax',
    description: 'Provides flexible medium hold with a natural shine for clean, modern hairstyles.',
    price: 20.00,
    rating: 4.7,
    reviewsCount: 78,
    image: hairWax,
    tag: 'Flexible Hold',
    category: 'hair',
  }
];

export const SKIN_PRODUCTS = [
  {
    id: 's1',
    name: 'Volcanic Sand Face Scrub',
    description: 'Exfoliates dead skin cells, prevents ingrown hairs, and unclogs pores.',
    price: 20.00,
    rating: 4.7,
    reviewsCount: 220,
    image: faceScrub,
    tag: 'Deep Clean',
    category: 'skin',
  },
  {
    id: 's2',
    name: 'Daily Hydration Shield Moisturizer',
    description: 'Lightweight moisturizer that protects skin and locks in moisture without greasiness.',
    price: 28.00,
    rating: 4.8,
    reviewsCount: 340,
    image: moisturizer,
    category: 'skin',
  },
  {
    id: 's3',
    name: 'Daily Mineral Sunscreen SPF 50',
    description: 'Broad-spectrum mineral protection shield with invisible matte finish for active men.',
    price: 32.00,
    rating: 4.9,
    reviewsCount: 195,
    image: sunscreen,
    tag: 'UV Shield',
    category: 'skin',
  },
  {
    id: 's4',
    name: 'Activated Charcoal Face Wash',
    description: 'Deeply cleanses pores, removes oil and impurities, and energizes dull skin.',
    price: 24.00,
    rating: 4.8,
    reviewsCount: 112,
    image: faceWash,
    category: 'skin',
  }
];

export const ALL_PRODUCTS = [
  ...BEARD_PRODUCTS,
  ...HAIR_PRODUCTS,
  ...SKIN_PRODUCTS,
];

export const REVIEWS = [
  {
    id: 1,
    name: 'Jonathan Sterling',
    role: 'Verified Buyer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    title: 'The Imperial Beard Oil is pure gold',
    comment: 'The scent of sandalwood is incredible and lasts all day. My beard has never felt softer or looked healthier. This brand has earned a customer for life.',
    date: '2026-06-15',
    approved: true,
  },
  {
    id: 2,
    name: 'Marcus Vance',
    role: 'Stylist & Barber',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    title: 'Professional Grade Products',
    comment: 'I use the Matte Clay Pomade on my clients in the shop. It has the perfect hold, washes out easily, and the packaging looks extremely premium on the shelf.',
    date: '2026-06-20',
    approved: true,
  },
  {
    id: 3,
    name: 'David Reynolds',
    role: 'Verified Buyer',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    title: 'Skincare routine game-changer',
    comment: 'The Volcanic Sand Scrub and Moisturizer are stellar. After two weeks of use, my skin feels completely energized and razor bumps are gone.',
    date: '2026-06-25',
    approved: true,
  },
  {
    id: 4,
    name: 'Julian Vance',
    role: 'Verified Buyer',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    title: 'Oud Noir smells like royalty',
    comment: 'Very sophisticated scent. I get compliments everywhere I go. The bottle design is minimal and luxury. Highly recommend the fragrances!',
    date: '2026-06-28',
    approved: true,
  }
];

export const BRANDS = [
  { name: 'Apex Grooming', logo: '🛡️ Apex' },
  { name: 'Gilded Blade', logo: '⚔️ Gilded' },
  { name: 'Sovereign Lab', logo: '👑 Sovereign' },
  { name: 'Vanguard Botanicals', logo: '🌿 Vanguard' },
  { name: 'Onyx & Clay', logo: '🏺 Onyx' },
  { name: 'Aero Scent', logo: '💨 Aero' },
];

export const CUSTOM_GROOMING_KITS = [
  {
    id: 'bk1',
    name: 'The Sovereign Grooming Kit',
    description: 'The complete set featuring premium oil, balm, wash, comb, and boar brush.',
    price: 89.00,
    rating: 5.0,
    reviewsCount: 210,
    image: groomingKit,
    tag: 'Luxury Set'
  },
  {
    id: 'bk2',
    name: 'Anti-Fatigue Skincare Set',
    description: 'Includes charcoal face wash, moisturizer, and volcanic sand scrub.',
    price: 65.00,
    rating: 4.9,
    reviewsCount: 148,
    image: faceScrub,
    tag: 'Fresh Routine'
  }
];
