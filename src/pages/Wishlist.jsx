import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import SectionHeader from '../components/ui/SectionHeader';
import { Trash2, ShoppingBag, Heart, ArrowRight } from 'lucide-react';

const Wishlist = () => {
  const { wishlist, removeFromWishlist, moveToCart } = useContext(ShopContext);

  return (
    <div className="py-28 bg-[#08080a] min-h-screen relative overflow-hidden">
      
      {/* Background radial glows */}
      <div className="absolute top-20 right-1/4 w-[350px] h-[350px] bg-[#C9A84C]/5 rounded-full blur-[110px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <SectionHeader
          badge="Your Curated List"
          title="Grooming Wishlist"
          subtitle="Keep track of your favorite premium oils, balms, pomades, and fragrances. Move them directly to your shopping bag with a single tap."
        />

        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {wishlist.map((product) => {
              const { id, name, price, image, description } = product;
              return (
                <div
                  key={id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 backdrop-blur-md p-4 transition-all duration-500 hover:border-[#C9A84C]/50 hover:shadow-[0_0_30px_rgba(201,168,76,0.12)]"
                >
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden rounded-xl bg-zinc-950">
                    <img
                      src={image}
                      alt={name}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    
                    {/* Delete button */}
                    <button
                      onClick={() => removeFromWishlist(id)}
                      className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/45 backdrop-blur-md text-red-400 hover:text-red-500 hover:bg-black/60 transition-colors cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Body details */}
                  <div className="mt-4 flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-white tracking-wide group-hover:text-[#E8C97E] transition-colors">
                        {name}
                      </h3>
                      <p className="mt-1 text-xs text-zinc-400 line-clamp-2 font-light">
                        {description}
                      </p>
                    </div>

                    <div className="mt-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-white">${price.toFixed(2)}</span>
                      </div>
                      
                      {/* Move to Cart */}
                      <button
                        onClick={() => moveToCart(product)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E8C97E] py-2.5 text-xs font-bold uppercase tracking-wider text-black transition-all duration-300 hover:brightness-110 cursor-pointer"
                      >
                        <ShoppingBag className="h-4 w-4" />
                        Move to Bag
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty wishlist page styling */
          <div className="text-center py-20 bg-zinc-900/10 border border-white/5 rounded-3xl backdrop-blur-md max-w-xl mx-auto space-y-6">
            <div className="mx-auto h-16 w-16 rounded-full bg-[#C9A84C]/5 border border-[#C9A84C]/15 flex items-center justify-center text-[#C9A84C]">
              <Heart className="h-8 w-8" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white font-serif">Your Wishlist is Empty</h3>
              <p className="text-sm text-zinc-400 font-light max-w-xs mx-auto leading-relaxed">
                Add premium grooming items to your wishlist while shopping to save them for later.
              </p>
            </div>

            <Link
              to="/beard-care"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E8C97E] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-black transition-all duration-300 hover:shadow-[0_0_20px_rgba(201,168,76,0.3)] hover:scale-105"
            >
              Browse Collections
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default Wishlist;
