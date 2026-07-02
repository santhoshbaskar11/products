import React, { useContext, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { Plus, Edit2, Trash2, Search, X, AlertTriangle, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const AdminOffers = () => {
  const { offers, addOffer, updateOffer, deleteOffer } = useContext(ShopContext);

  // Filter, search, and pagination states
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Add/Edit modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null); // null if adding
  const [code, setCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState('20');
  const [active, setActive] = useState(true);
  const [expiresAt, setExpiresAt] = useState('');

  // Delete modal states
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState(null);

  // Filter offers
  let filtered = offers.filter((o) =>
    o.code.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginatedOffers = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleOpenAdd = () => {
    setEditingOffer(null);
    setCode('');
    setDiscountPercent('20');
    setActive(true);
    setExpiresAt('');
    setModalOpen(true);
  };

  const handleOpenEdit = (off) => {
    setEditingOffer(off);
    setCode(off.code);
    setDiscountPercent(off.discountPercent.toString());
    setActive(off.active);
    setExpiresAt(off.expiresAt || '');
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code || !discountPercent) return;

    const discountNum = parseInt(discountPercent);

    if (editingOffer) {
      const updated = {
        ...editingOffer,
        code: code.toUpperCase().trim(),
        discountPercent: discountNum,
        active,
        expiresAt: expiresAt || null
      };
      updateOffer(updated);
    } else {
      const added = {
        id: `off-${Date.now()}`,
        code: code.toUpperCase().trim(),
        discountPercent: discountNum,
        active,
        expiresAt: expiresAt || null,
        createdAt: new Date().toISOString().slice(0, 10)
      };
      addOffer(added);
    }
    setModalOpen(false);
  };

  const handleOpenDelete = (off) => {
    setOfferToDelete(off);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (offerToDelete) {
      deleteOffer(offerToDelete.id);
      setDeleteConfirmOpen(false);
      setOfferToDelete(null);
    }
  };

  return (
    <div className="space-y-8 text-left relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white font-serif tracking-wide">Promotional Offers</h2>
          <p className="text-xs text-zinc-400 font-light mt-1">Configure coupon campaigns, manage active discount keys, and set expiration limits.</p>
        </div>
        
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E8C97E] px-5 py-3 text-xs font-bold uppercase tracking-wider text-black hover:brightness-110 hover:scale-105 transition-all cursor-pointer shrink-0"
        >
          <Plus className="h-4.5 w-4.5" />
          Create Offer
        </button>
      </div>

      {/* Filter and search controls */}
      <div className="grid grid-cols-1 gap-4 bg-zinc-950/80 border border-white/5 p-4 rounded-2xl">
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
            <Search className="h-4.5 w-4.5" />
          </span>
          <input
            type="text"
            placeholder="Search offers by discount coupon code..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full rounded-xl bg-zinc-900 border border-white/10 pl-11 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#C9A84C]"
          />
        </div>
      </div>

      {/* Offers Table */}
      <div className="bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-900/80 border-b border-white/5 text-zinc-500 uppercase tracking-wider font-semibold">
                <th className="py-4.5 px-6">Coupon Code</th>
                <th className="py-4.5 px-6">Discount Percent</th>
                <th className="py-4.5 px-6">Campaign Status</th>
                <th className="py-4.5 px-6">Expires Date</th>
                <th className="py-4.5 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              {paginatedOffers.length > 0 ? (
                paginatedOffers.map((off) => (
                  <tr key={off.id} className="hover:bg-white/2 transition-colors">
                    {/* Coupon Code */}
                    <td className="py-4.5 px-6 font-mono text-sm font-bold text-white tracking-wide">
                      {off.code}
                    </td>

                    {/* Discount Percent */}
                    <td className="py-4.5 px-6 text-sm font-semibold text-[#E8C97E]">
                      {off.discountPercent}% OFF
                    </td>

                    {/* Status */}
                    <td className="py-4.5 px-6">
                      <span className={`inline-block rounded-md px-2 py-1 text-[9px] font-bold uppercase tracking-wider ${
                        off.active 
                          ? 'text-green-400 bg-green-500/10 border border-green-500/20' 
                          : 'text-zinc-500 bg-zinc-500/10 border border-white/5'
                      }`}>
                        {off.active ? 'Active' : 'Expired'}
                      </span>
                    </td>

                    {/* Expires At */}
                    <td className="py-4.5 px-6 text-zinc-400 font-light">
                      {off.expiresAt ? off.expiresAt.slice(0, 10) : 'Never'}
                    </td>

                    {/* Actions */}
                    <td className="py-4.5 px-6 text-center">
                      <div className="flex justify-center items-center gap-3">
                        <button
                          onClick={() => handleOpenEdit(off)}
                          title="Edit Coupon"
                          className="h-8 w-8 flex items-center justify-center rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:text-[#C9A84C] hover:border-[#C9A84C]/50 transition-colors cursor-pointer"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(off)}
                          title="Delete Coupon"
                          className="h-8 w-8 flex items-center justify-center rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:text-red-500 hover:border-red-500/30 transition-colors cursor-pointer"
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
                    No active discount codes found in the database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        {totalPages > 1 && (
          <div className="bg-zinc-900/40 border-t border-white/5 px-6 py-4 flex items-center justify-between">
            <span className="text-zinc-500">Page {currentPage} of {totalPages}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="h-8 px-3 rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="h-8 px-3 rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-zinc-950 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-6 top-6 text-zinc-500 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 text-[#E8C97E] mb-4">
              <Sparkles className="h-5 w-5" />
              <h3 className="text-xl font-bold font-serif text-white">
                {editingOffer ? 'Modify Campaign Code' : 'Create Promotion Code'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Code */}
              <div className="space-y-1.5">
                <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider block">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AUTUMN30"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900 border border-white/10 px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#C9A84C]"
                />
              </div>

              {/* Discount Percent */}
              <div className="space-y-1.5">
                <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider block">Discount Percentage (%)</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="100"
                  placeholder="20"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C]"
                />
              </div>

              {/* Expires At */}
              <div className="space-y-1.5">
                <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider block">Expiration Date (Optional)</label>
                <input
                  type="date"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C]"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="active-toggle"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="h-4.5 w-4.5 rounded bg-zinc-900 border-white/10 text-[#C9A84C] focus:ring-[#C9A84C]"
                />
                <label htmlFor="active-toggle" className="text-zinc-300 text-xs font-medium cursor-pointer">
                  Activate this discount code immediately
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/5 py-3.5 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E8C97E] py-3.5 text-xs font-bold uppercase tracking-wider text-black hover:brightness-110 transition-colors cursor-pointer"
                >
                  {editingOffer ? 'Save Details' : 'Publish Code'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm bg-zinc-950 border border-white/10 rounded-3xl p-6 md:p-8 text-center shadow-2xl">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500 mb-4">
              <AlertTriangle className="h-6 w-6" />
            </div>
            
            <h3 className="text-lg font-bold font-serif text-white mb-2">Delete Coupon Code</h3>
            <p className="text-xs text-zinc-400 font-light leading-relaxed mb-6">
              Are you sure you want to delete coupon code <strong className="text-white font-mono">{offerToDelete?.code}</strong>? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className="flex-1 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/5 py-3.5 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 rounded-xl bg-red-600 hover:bg-red-500 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminOffers;
