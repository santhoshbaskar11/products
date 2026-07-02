import React, { useContext, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { Search, Star, Edit2, Trash2, X, AlertTriangle, ChevronLeft, ChevronRight, Eye, EyeOff, Plus } from 'lucide-react';

const AdminReviews = () => {
  const { reviews, products, addReview, approveReview, hideReview, updateReview, deleteReview } = useContext(ShopContext);

  // Search, sorting, pagination states
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modals state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedRev, setSelectedRev] = useState(null);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  // Manual review states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [selectedProdId, setSelectedProdId] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(5);

  // Filter reviews
  let filtered = reviews.filter((r) => 
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.comment.toLowerCase().includes(search.toLowerCase())
  );

  // Sort reviews (Newest first)
  filtered.sort((a, b) => b.date.localeCompare(a.date));

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedReviews = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleOpenEdit = (rev) => {
    setSelectedRev(rev);
    setTitle(rev.title);
    setComment(rev.comment);
    setRating(rev.rating);
    setEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!title || !comment) return;

    if (selectedRev) {
      const updated = {
        ...selectedRev,
        title,
        comment,
        rating: parseInt(rating)
      };
      updateReview(updated);
    }
    setEditModalOpen(false);
  };

  const handleOpenDelete = (rev) => {
    setReviewToDelete(rev);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (reviewToDelete) {
      deleteReview(reviewToDelete.id);
      setDeleteConfirmOpen(false);
      setReviewToDelete(null);
    }
  };

  const handleOpenAdd = () => {
    setReviewerName('');
    setSelectedProdId(products && products.length > 0 ? products[0].id : '');
    setReviewComment('');
    setReviewRating(5);
    setAddModalOpen(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!reviewerName || !reviewComment) return;

    const added = {
      id: `rev-${Date.now()}`,
      name: reviewerName,
      comment: reviewComment,
      rating: Number(reviewRating),
      product_id: selectedProdId,
      title: 'Verified Customer',
      date: new Date().toISOString().slice(0, 10),
      approved: true
    };

    addReview(added);
    setAddModalOpen(false);
  };

  return (
    <div className="space-y-8 text-left relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white font-serif tracking-wide">Reviews Moderation</h2>
          <p className="text-xs text-zinc-400 font-light mt-1">Moderate client feedbacks, approve new review submissions, or delete flagged reviews.</p>
        </div>
        
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E8C97E] px-5 py-3 text-xs font-bold uppercase tracking-wider text-black hover:brightness-110 hover:scale-105 transition-all cursor-pointer shrink-0"
        >
          <Plus className="h-4.5 w-4.5" />
          Add Review
        </button>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 gap-4 bg-zinc-950/80 border border-white/5 p-4 rounded-2xl">
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
            <Search className="h-4.5 w-4.5" />
          </span>
          <input
            type="text"
            placeholder="Search reviews by name, title, comment content..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full rounded-xl bg-zinc-900 border border-white/10 pl-11 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#C9A84C]"
          />
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-900/80 border-b border-white/5 text-zinc-500 uppercase tracking-wider font-semibold">
                <th className="py-4.5 px-6">User</th>
                <th className="py-4.5 px-6">Feedback Title & Content</th>
                <th className="py-4.5 px-6">Rating</th>
                <th className="py-4.5 px-6">Status</th>
                <th className="py-4.5 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              {paginatedReviews.length > 0 ? (
                paginatedReviews.map((rev) => (
                  <tr key={rev.id} className="hover:bg-white/2 transition-colors">
                    {/* Avatar & Name */}
                    <td className="py-5 px-6 flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full overflow-hidden border border-white/10 shrink-0 bg-zinc-950">
                        <img src={rev.avatar} alt={rev.name} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white tracking-wide">{rev.name}</h4>
                        <span className="block text-[10px] text-zinc-500 mt-0.5">{rev.role}</span>
                      </div>
                    </td>

                    {/* Title & Comment */}
                    <td className="py-5 px-6 max-w-xs">
                      <span className="font-bold text-white block">"{rev.title}"</span>
                      <p className="text-[11px] text-zinc-400 mt-1 font-light leading-relaxed line-clamp-2">
                        {rev.comment}
                      </p>
                    </td>

                    {/* Rating stars */}
                    <td className="py-5 px-6">
                      <div className="flex text-[#C9A84C] gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-3.5 w-3.5 ${i < rev.rating ? 'fill-current' : 'text-zinc-700'}`} />
                        ))}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-5 px-6">
                      {rev.approved !== false ? (
                        <span className="text-green-400 bg-green-500/10 border border-green-500/20 text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                          Approved
                        </span>
                      ) : (
                        <span className="text-amber-500 bg-amber-500/10 border border-amber-500/20 text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                          Hidden
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-5 px-6 text-center">
                      <div className="flex justify-center items-center gap-2">
                        {rev.approved !== false ? (
                          <button
                            onClick={() => hideReview(rev.id)}
                            title="Hide Review"
                            className="h-8 w-8 flex items-center justify-center rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:text-amber-500 hover:border-amber-500/50 transition-colors cursor-pointer"
                          >
                            <EyeOff className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => approveReview(rev.id)}
                            title="Approve Review"
                            className="h-8 w-8 flex items-center justify-center rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:text-green-500 hover:border-green-500/50 transition-colors cursor-pointer"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEdit(rev)}
                          title="Edit Review Content"
                          className="h-8 w-8 flex items-center justify-center rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:text-[#C9A84C] hover:border-[#C9A84C]/50 transition-colors cursor-pointer"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(rev)}
                          title="Delete Review"
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
                    No reviews found matching search filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-white/5 bg-zinc-950 px-6 py-4 flex items-center justify-between">
            <span className="text-[10px] text-zinc-500 uppercase font-semibold">
              Page {currentPage} of {totalPages} ({filtered.length} reviews total)
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

      {/* Edit Review Form Modal */}
      {editModalOpen && selectedRev && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setEditModalOpen(false)} className="absolute inset-0 bg-black/75 backdrop-blur-sm"></div>

          <div className="relative w-full max-w-lg bg-zinc-950 border border-[#C9A84C]/35 rounded-3xl p-6 md:p-8 shadow-2xl animate-scale-up text-left">
            <button
              onClick={() => setEditModalOpen(false)}
              className="absolute right-5 top-5 text-zinc-500 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-bold text-white font-serif tracking-wide border-b border-white/5 pb-3">
              Edit Review Content
            </h3>

            <form onSubmit={handleEditSubmit} className="mt-6 space-y-5">
              {/* Review Title */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Review Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Absolutely Incredible"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C]"
                />
              </div>

              {/* Rating stars select */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Rating Stars</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C] cursor-pointer"
                >
                  <option value="5">5 Stars ⭐⭐⭐⭐⭐</option>
                  <option value="4">4 Stars ⭐⭐⭐⭐</option>
                  <option value="3">3 Stars ⭐⭐⭐</option>
                  <option value="2">2 Stars ⭐⭐</option>
                  <option value="1">1 Star ⭐</option>
                </select>
              </div>

              {/* Comment body */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Feedback Comment</label>
                <textarea
                  required
                  rows="4"
                  placeholder="Describe your review..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C] resize-none"
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="rounded-xl border border-white/10 bg-transparent px-5 py-3 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E8C97E] px-6 py-3 text-xs font-bold uppercase tracking-wider text-black hover:brightness-110 transition-all cursor-pointer"
                >
                  Save Changes
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
            
            <h3 className="text-lg font-bold text-white font-serif tracking-wide">Delete Feedback</h3>
            <p className="mt-2 text-xs text-zinc-400 font-light leading-relaxed">
              Are you sure you want to delete feedback from <strong className="text-white font-semibold">"{reviewToDelete?.name}"</strong>? This will permanently wipe this review from the public storefront.
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

      {/* Manual Add Review Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setAddModalOpen(false)} className="absolute inset-0 bg-black/75 backdrop-blur-sm"></div>
          
          <div className="relative w-full max-w-md bg-zinc-950 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl text-left animate-scale-up">
            <button
              onClick={() => setAddModalOpen(false)}
              className="absolute right-6 top-6 text-zinc-500 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-bold font-serif text-white mb-6">Create Manual Review</h3>
            
            <form onSubmit={handleAddSubmit} className="space-y-5">
              {/* Product */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Target Product</label>
                <select
                  value={selectedProdId}
                  onChange={(e) => setSelectedProdId(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C] cursor-pointer"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reviewer Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Reviewer Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Richard Hendricks"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C]"
                />
              </div>

              {/* Rating */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Rating Score</label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(parseInt(e.target.value))}
                  className="w-full rounded-xl bg-zinc-900 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C] cursor-pointer"
                >
                  <option value={5}>5 Stars (Excellent)</option>
                  <option value={4}>4 Stars (Good)</option>
                  <option value={3}>3 Stars (Fair)</option>
                  <option value={2}>2 Stars (Poor)</option>
                  <option value={1}>1 Star (Awful)</option>
                </select>
              </div>

              {/* Comment Content */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Feedback details</label>
                <textarea
                  required
                  rows="4"
                  placeholder="Review comments..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C] resize-none"
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="rounded-xl border border-white/10 bg-transparent px-5 py-3 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E8C97E] px-6 py-3 text-xs font-bold uppercase tracking-wider text-black hover:brightness-110 transition-all cursor-pointer"
                >
                  Publish Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
