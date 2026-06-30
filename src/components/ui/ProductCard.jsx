import React, { useContext } from 'react';
import { Star, ShoppingBag, Heart } from 'lucide-react';
import { ShopContext } from '../../context/ShopContext';

const ProductCard = ({ product }) => {
  const { id, name, description, price, rating, reviewsCount, image, tag } = product;
  const { toggleWishlist, wishlist, addToCart } = useContext(ShopContext);

  const isLiked = wishlist.some((item) => item.id === id);

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 backdrop-blur-md p-4 transition-all duration-500 hover:border-[#C9A84C]/50 hover:shadow-[0_0_30px_rgba(201,168,76,0.15)]">
      
      {/* Product Image Container */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-zinc-950">
        {tag && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-gradient-to-r from-[#C9A84C] to-[#E8C97E] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-black shadow-md">
            {tag}
          </span>
        )}
        
        <button
          onClick={() => toggleWishlist(product)}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white transition-all duration-300 hover:bg-black/60 cursor-pointer"
        >
          <Heart
            className={`h-4.5 w-4.5 transition-colors duration-300 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-300 group-hover:text-white'}`}
          />
        </button>

        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          loading="lazy"
        />

        {/* Quick Add Overlay */}
        <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 p-4">
          <button
            onClick={() => addToCart(id, 1)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E8C97E] py-2.5 text-xs font-bold uppercase tracking-wider text-black transition-all duration-300 hover:brightness-110 cursor-pointer"
          >
            <ShoppingBag className="h-4 w-4" />
            Quick Add
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="mt-4 flex flex-1 flex-col justify-between">
        <div>
          {/* Reviews Rating */}
          <div className="flex items-center gap-1">
            <div className="flex text-[#C9A84C]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${i < Math.floor(rating) ? 'fill-current' : 'text-zinc-600'}`}
                />
              ))}
            </div>
            <span className="text-[11px] text-zinc-400 font-medium">
              {rating} ({reviewsCount})
            </span>
          </div>

          <h3 className="mt-2 text-base font-semibold text-white tracking-wide group-hover:text-[#E8C97E] transition-colors duration-300">
            {name}
          </h3>

          <p className="mt-1 text-xs text-zinc-400 line-clamp-2 font-light leading-relaxed">
            {description}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-white">
            ${price.toFixed(2)}
          </span>
          <button
            onClick={() => addToCart(id, 1)}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-800 text-white transition-all duration-300 hover:bg-[#C9A84C] hover:text-black group-hover:bg-zinc-800/80 md:group-hover:hover:bg-[#C9A84C] cursor-pointer"
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
