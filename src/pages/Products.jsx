import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import ProductCard from '../components/ui/ProductCard';
import SectionHeader from '../components/ui/SectionHeader';
import { SlidersHorizontal, Grid, Filter } from 'lucide-react';

const Products = () => {
  const { products, searchQuery } = useContext(ShopContext);
  const [sortOption, setSortOption] = useState('featured');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Filter products by category and search query
  let displayProducts = [...products];

  if (categoryFilter !== 'all') {
    displayProducts = displayProducts.filter((p) => p.category === categoryFilter);
  }

  if (searchQuery.trim()) {
    displayProducts = displayProducts.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Apply sorting
  if (sortOption === 'price-asc') {
    displayProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === 'price-desc') {
    displayProducts.sort((a, b) => b.price - a.price);
  } else if (sortOption === 'rating') {
    displayProducts.sort((a, b) => b.rating - a.rating);
  }

  return (
    <div className="py-28 bg-[#08080a] min-h-screen relative overflow-hidden text-gray-300">
      
      {/* Decorative Radial Background */}
      <div className="absolute top-20 left-1/4 w-[400px] h-[400px] rounded-full bg-[#C9A84C]/5 blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <SectionHeader
          badge="Product Catalog"
          title="The Signature Collection"
          subtitle="Explore our complete line of premium, organic grooming formulations designed to elevate your style and routine."
        />

        {/* Sort & Filter Controls Row */}
        <div className="flex flex-col md:flex-row justify-between items-center border-b border-white/5 pb-6 mb-10 gap-4">
          
          {/* Active Count & Mobile Info */}
          <div className="flex items-center gap-2 text-zinc-400 text-sm">
            <SlidersHorizontal className="h-4.5 w-4.5 text-[#C9A84C]" />
            <span>Showing <strong className="text-white">{displayProducts.length}</strong> products</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            
            {/* Category Filter Tab selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 uppercase tracking-widest font-medium">Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A84C] cursor-pointer"
              >
                <option value="all">All Products</option>
                <option value="beard">Beard Care</option>
                <option value="hair">Hair Styling</option>
                <option value="skin">Skincare</option>
              </select>
            </div>

            {/* Sorting Tab selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 uppercase tracking-widest font-medium">Sort By:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A84C] cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

          </div>
        </div>

        {/* Products Grid */}
        {displayProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {displayProducts.map((product) => (
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

export default Products;
