import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import ProductCard from '../components/ui/ProductCard';
import SectionHeader from '../components/ui/SectionHeader';
import { SlidersHorizontal } from 'lucide-react';

const Skincare = () => {
  const { products, searchQuery } = useContext(ShopContext);
  const [sortOption, setSortOption] = useState('featured');

  // Filter products by category 'skin', or search across all categories if query exists
  let skinProducts = products.filter((p) => p.category === 'skin');

  if (searchQuery.trim()) {
    skinProducts = products.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Apply sorting
  if (sortOption === 'price-asc') {
    skinProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === 'price-desc') {
    skinProducts.sort((a, b) => b.price - a.price);
  } else if (sortOption === 'rating') {
    skinProducts.sort((a, b) => b.rating - a.rating);
  }

  return (
    <div className="py-28 bg-[#08080a] min-h-screen relative overflow-hidden">
      
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#C9A84C]/3 blur-[130px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <SectionHeader
          badge="Skincare Essentials"
          title="The Skincare Shop"
          subtitle="Formulated specifically for the thickness and texture of men's skin. Hydrate, protect, and energize your skin."
        />

        {/* Sort & Filter Controls Row */}
        <div className="flex flex-col sm:flex-row justify-between items-center border-b border-white/5 pb-6 mb-10 gap-4">
          <div className="flex items-center gap-2 text-zinc-400 text-sm">
            <SlidersHorizontal className="h-4.5 w-4.5 text-[#C9A84C]" />
            <span>Showing <strong className="text-white">{skinProducts.length}</strong> products</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 uppercase tracking-widest font-medium">Sort By:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C9A84C] cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {skinProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {skinProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-zinc-900/10 border border-white/5 rounded-3xl backdrop-blur-md">
            <p className="text-gray-400 text-lg font-light">No products found matching your criteria.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Skincare;
