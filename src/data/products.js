import b1 from '../assets/images/products/b1.jpg';
import b2 from '../assets/images/products/b2.jpg';
import b3 from '../assets/images/products/b3.jpg';
import b4 from '../assets/images/products/b4.jpg';

import h1 from '../assets/images/products/h1.jpg';
import h2 from '../assets/images/products/h2.jpg';
import h3 from '../assets/images/products/h3.jpg';
import h4 from '../assets/images/products/h4.jpg';

import s1 from '../assets/images/products/s1.jpg';
import s2 from '../assets/images/products/s2.jpg';
import s3 from '../assets/images/products/s3.jpg';
import s4 from '../assets/images/products/s4.jpg';


export const BEARD_PRODUCTS = [
  {
    id: 'b1',
    name: 'Imperial Beard Oil',
    description: 'Infused with premium sandalwood and natural base oils for growth and royal shine.',
    price: 38.00,
    rating: 4.9,
    reviewsCount: 142,
    image: b1,
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
    image: b2,
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
    image: b3,
    category: 'beard',
  },
  {
    id: 'b4',
    name: 'The Sovereign Grooming Kit',
    description: 'Complete set featuring oil, balm, wash, peachwood comb, and boar bristle brush.',
    price: 89.00,
    rating: 5.0,
    reviewsCount: 210,
    image: b4,
    tag: 'Luxury Set',
    category: 'beard',
  }
];

export const HAIR_PRODUCTS = [
  {
    id: 'h1',
    name: 'Matte Clay Pomade',
    description: 'High hold with a natural matte finish, infused with bentonite clay.',
    price: 22.00,
    rating: 4.8,
    reviewsCount: 312,
    image: h1,
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
    image: h2,
    tag: 'Hair Growth',
    category: 'hair',
  },
  {
    id: 'h3',
    name: 'Tea Tree Conditioner',
    description: 'Soothes dry scalp, hydrates dry hair, and provides a tingling refreshment.',
    price: 24.00,
    rating: 4.7,
    reviewsCount: 188,
    image: h3,
    category: 'hair',
  },
  {
    id: 'h4',
    name: 'Texturizing Sea Salt Spray',
    description: 'Adds volume, definition, and a casual beach-day texture with a light hold.',
    price: 18.00,
    rating: 4.6,
    reviewsCount: 153,
    image: h4,
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
    image: s1,
    tag: 'Deep Clean',
    category: 'skin',
  },
  {
    id: 's2',
    name: 'Daily Hydration Shield SPF 20',
    description: 'Lightweight moisturizer that protects skin from UV rays without greasiness.',
    price: 28.00,
    rating: 4.8,
    reviewsCount: 340,
    image: s2,
    category: 'skin',
  },
  {
    id: 's3',
    name: 'Caffeine Eye Rescue Cream',
    description: 'Visibly reduces under-eye bags, dark circles, and fine lines instantly.',
    price: 32.00,
    rating: 4.9,
    reviewsCount: 195,
    image: s3,
    tag: 'Anti-Fatigue',
    category: 'skin',
  },
  {
    id: 's4',
    name: 'Hyaluronic Acid Repair Serum',
    description: 'Intense moisture booster that smooths wrinkles and revitalizes tired skin.',
    price: 36.00,
    rating: 4.8,
    reviewsCount: 112,
    image: s4,
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
    comment: 'The Caffeine Eye Cream and Moisturizer are stellar. After two weeks of use, my dark circles are completely gone and my skin feels energized.',
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
    image: b4,
    tag: 'Luxury Set'
  },
  {
    id: 'bk2',
    name: 'Anti-Fatigue Skincare Set',
    description: 'Includes caffeine eye cream, SPF shield moisturizer, and volcanic sand scrub.',
    price: 65.00,
    rating: 4.9,
    reviewsCount: 148,
    image: s3,
    tag: 'Fresh Routine'
  }
];
