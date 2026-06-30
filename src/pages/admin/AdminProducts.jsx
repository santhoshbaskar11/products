import React, { useContext, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { Plus, Trash2, Edit2, Search, SlidersHorizontal, ChevronLeft, ChevronRight, X, AlertTriangle } from 'lucide-react';

const AdminProducts = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useContext(ShopContext);

  // Search, filter, sorting, pagination states
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortOption, setSortOption] = useState('name-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Add/Edit modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null if adding
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('beard');
  const [tag, setTag] = useState('');
  const [rating, setRating] = useState('5.0');
  const [stock, setStock] = useState('50');
  const [imageUrl, setImageUrl] = useState('');

  // Delete confirmation modal states
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Filter & Sort products
  let filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'all' ? true : p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  if (sortOption === 'name-asc') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOption === 'name-desc') {
    filtered.sort((a, b) => b.name.localeCompare(a.name));
  } else if (sortOption === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortOption === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  }

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedProducts = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setName('');
    setDescription('');
    setPrice('');
    setCategory('beard');
    setTag('');
    setRating('5.0');
    setStock('50');
    setImageUrl('https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=600&q=80');
    setModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setName(prod.name);
    setDescription(prod.description);
    setPrice(prod.price.toString());
    setCategory(prod.category);
    setTag(prod.tag || '');
    setRating((prod.rating || 5.0).toString());
    setStock((prod.stock || 50).toString());
    setImageUrl(prod.image);
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !description || !price) return;

    const priceNum = parseFloat(price);
    const ratingNum = parseFloat(rating);
    const stockNum = parseInt(stock);

    if (editingProduct) {
      const updated = {
        ...editingProduct,
        name,
        description,
        price: priceNum,
        category,
        tag: tag || undefined,
        rating: ratingNum,
        stock: stockNum,
        image: imageUrl
      };
      updateProduct(updated);
    } else {
      const added = {
        id: `${category[0]}-${Date.now()}`,
        name,
        description,
        price: priceNum,
        category,
        tag: tag || undefined,
        rating: ratingNum,
        stock: stockNum,
        image: imageUrl,
        reviewsCount: 0
      };
      addProduct(added);
    }
    setModalOpen(false);
  };

  const handleOpenDelete = (prod) => {
    setProductToDelete(prod);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      setDeleteConfirmOpen(false);
      setProductToDelete(null);
    }
  };

  return (
    <div className="space-y-8 text-left relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white font-serif tracking-wide">Products Catalog</h2>
          <p className="text-xs text-zinc-400 font-light mt-1">Manage, audit, or expand products in the Sovereign inventory list.</p>
        </div>
        
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E8C97E] px-5 py-3 text-xs font-bold uppercase tracking-wider text-black hover:brightness-110 hover:scale-105 transition-all cursor-pointer shrink-0"
        >
          <Plus className="h-4.5 w-4.5" />
          Add Product
        </button>
      </div>

      {/* Search, Filters and Sorting Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-zinc-950/80 border border-white/5 p-4 rounded-2xl">
        {/* Search */}
        <div className="md:col-span-6 relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
            <Search className="h-4.5 w-4.5" />
          </span>
          <input
            type="text"
            placeholder="Search products by name, tagline, description..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full rounded-xl bg-zinc-900 border border-white/10 pl-11 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#C9A84C]"
          />
        </div>

        {/* Filter Category */}
        <div className="md:col-span-3">
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
            className="w-full rounded-xl bg-zinc-900 border border-white/10 px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A84C] cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="beard">Beard Grooming</option>
            <option value="hair">Hair Care & Styling</option>
            <option value="skin">Skincare Essentials</option>
          </select>
        </div>

        {/* Sorting option */}
        <div className="md:col-span-3">
          <select
            value={sortOption}
            onChange={(e) => { setSortOption(e.target.value); setCurrentPage(1); }}
            className="w-full rounded-xl bg-zinc-900 border border-white/10 px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A84C] cursor-pointer"
          >
            <option value="name-asc">Sort: A-Z Name</option>
            <option value="name-desc">Sort: Z-A Name</option>
            <option value="price-asc">Sort: Price Low-High</option>
            <option value="price-desc">Sort: Price High-Low</option>
          </select>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-900/80 border-b border-white/5 text-zinc-500 uppercase tracking-wider font-semibold">
                <th className="py-4.5 px-6">Product</th>
                <th className="py-4.5 px-6">Category</th>
                <th className="py-4.5 px-6">Rating / Stock</th>
                <th className="py-4.5 px-6">Price</th>
                <th className="py-4.5 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-white/2 transition-colors">
                    {/* Photo & Name */}
                    <td className="py-4 px-6 flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-zinc-950 overflow-hidden border border-white/10 shrink-0">
                        <img src={prod.image} alt={prod.name} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white tracking-wide">{prod.name}</h4>
                        {prod.tag && (
                          <span className="inline-block mt-1 text-[9px] font-bold text-[#E8C97E] bg-[#C9A84C]/10 border border-[#C9A84C]/25 rounded-md px-1.5 py-0.5">
                            {prod.tag}
                          </span>
                        )}
                      </div>
                    </td>
                    
                    {/* Category */}
                    <td className="py-4 px-6 uppercase tracking-wider font-medium text-zinc-400">
                      {prod.category} Care
                    </td>

                    {/* Rating / Stock */}
                    <td className="py-4 px-6 text-zinc-400">
                      <div>Score: <strong className="text-white font-bold">{prod.rating || '5.0'}</strong>⭐</div>
                      <div className="mt-1 text-[10px]">Stock: <strong className="text-[#C9A84C] font-semibold">{prod.stock || '50'} units</strong></div>
                    </td>
                    
                    {/* Price */}
                    <td className="py-4 px-6 text-sm font-semibold text-[#E8C97E]">
                      ${prod.price.toFixed(2)}
                    </td>
                    
                    {/* Actions */}
                    <td className="py-4 px-6 text-center">
                      <div className="flex justify-center items-center gap-3">
                        <button
                          onClick={() => handleOpenEdit(prod)}
                          title="Edit Product"
                          className="h-8 w-8 flex items-center justify-center rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:text-[#C9A84C] hover:border-[#C9A84C]/50 transition-colors cursor-pointer"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(prod)}
                          title="Delete Product"
                          className="h-8 w-8 flex items-center justify-center rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:text-red-500 hover:border-red-500/50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-zinc-500 font-light">
                    No products found matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="border-t border-white/5 bg-zinc-950 px-6 py-4 flex items-center justify-between">
            <span className="text-[10px] text-zinc-500 uppercase font-semibold">
              Page {currentPage} of {totalPages} ({filtered.length} products total)
            </span>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="h-8 px-3 rounded-lg border border-white/10 bg-zinc-900 text-zinc-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-1 text-xs cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="h-8 px-3 rounded-lg border border-white/10 bg-zinc-900 text-zinc-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-1 text-xs cursor-pointer"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Form Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop overlay */}
          <div onClick={() => setModalOpen(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

          {/* Dialog box wrapper */}
          <div className="relative w-full max-w-2xl bg-zinc-950 border border-[#C9A84C]/35 rounded-3xl p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto animate-scale-up text-left">
            
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-5 top-5 text-zinc-500 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-bold text-white font-serif tracking-wide border-b border-white/5 pb-3">
              {editingProduct ? 'Modify Product Details' : 'Introduce New Product'}
            </h3>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Product Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Product Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Activated Charcoal Beard Soap"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl bg-zinc-900 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>

                {/* Tag/Badge */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Promo Tag / Badge</label>
                  <input
                    type="text"
                    placeholder="e.g. Best Seller, Limited Edition, New"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    className="w-full rounded-xl bg-zinc-900 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Price */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="e.g. 45.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full rounded-xl bg-zinc-900 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>

                {/* Rating score */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Rating Score</label>
                  <input
                    type="number"
                    step="0.05"
                    max="5.0"
                    placeholder="e.g. 4.9"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full rounded-xl bg-zinc-900 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>

                {/* Inventory stock */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Inventory Stock</label>
                  <input
                    type="number"
                    placeholder="e.g. 150"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full rounded-xl bg-zinc-900 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Category select */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Product Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl bg-zinc-900 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C] cursor-pointer"
                  >
                    <option value="beard">Beard Grooming</option>
                    <option value="hair">Hair Care & Styling</option>
                    <option value="skin">Skincare Essentials</option>
                  </select>
                </div>

                {/* Product Image URL */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Image Asset URL / Path</label>
                  <input
                    type="text"
                    required
                    placeholder="Image URL"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full rounded-xl bg-zinc-900 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Description</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Describe product highlights, premium ingredients, and directions..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C] resize-none"
                ></textarea>
              </div>

              {/* Form submit buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-white/10 bg-transparent px-5 py-3 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E8C97E] px-6 py-3 text-xs font-bold uppercase tracking-wider text-black hover:brightness-110 transition-all cursor-pointer"
                >
                  {editingProduct ? 'Save Updates' : 'Confirm Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setDeleteConfirmOpen(false)} className="absolute inset-0 bg-black/75 backdrop-blur-sm"></div>
          
          <div className="relative w-full max-w-md bg-zinc-950 border border-red-500/35 rounded-3xl p-6 shadow-2xl text-center animate-scale-up">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500 mb-4">
              <AlertTriangle className="h-6 w-6" />
            </div>
            
            <h3 className="text-lg font-bold text-white font-serif tracking-wide">Delete Product</h3>
            <p className="mt-2 text-xs text-zinc-400 font-light leading-relaxed">
              Are you sure you want to delete <strong className="text-white font-semibold">"{productToDelete?.name}"</strong>? This will permanently remove this item from the store inventory.
            </p>
            
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className="rounded-xl border border-white/10 bg-transparent px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-red-500 transition-colors cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
