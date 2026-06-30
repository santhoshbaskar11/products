import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import SectionHeader from '../components/ui/SectionHeader';
import { Star, MessageSquare, Plus, Check } from 'lucide-react';

const ReviewsPage = () => {
  const { reviews, addReview } = useContext(ShopContext);
  const [showForm, setShowForm] = useState(false);
  
  // Form states
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!name || !title || !comment) return;

    const newReview = {
      id: reviews.length + 1,
      name,
      role: 'Verified Buyer',
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 999999)}?auto=format&fit=crop&w=150&q=80`,
      rating,
      title,
      comment,
      date: new Date().toISOString().split('T')[0],
      approved: false, // In-memory add requires admin approval for mock safety
    };

    addReview(newReview);
    setSubmitted(true);
    setName('');
    setTitle('');
    setComment('');
    setRating(5);
    setTimeout(() => {
      setSubmitted(false);
      setShowForm(false);
    }, 2000);
  };

  // Compute stats
  const approvedReviews = reviews.filter((r) => r.approved !== false);
  const averageRating = (
    approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length
  ).toFixed(1);

  return (
    <div className="py-28 bg-[#08080a] min-h-screen relative overflow-hidden">
      
      {/* Decorative Glow */}
      <div className="absolute top-20 right-1/4 w-[400px] h-[400px] rounded-full bg-[#C9A84C]/5 blur-[120px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <SectionHeader
          badge="Our Client Feedbacks"
          title="Customer Reviews"
          subtitle="Discover what men around the globe say about our premium hair, beard, skin, and fragrance collections."
        />

        {/* Stats Row & Write Review Trigger */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-zinc-900/35 border border-white/10 rounded-3xl p-8 backdrop-blur-md mb-12 shadow-xl">
          
          <div className="text-center md:border-r border-white/5 py-4">
            <span className="text-5xl font-extrabold text-white font-serif">{averageRating}</span>
            <span className="text-sm text-zinc-500 font-light block mt-1">out of 5 stars</span>
            <div className="flex justify-center text-[#C9A84C] mt-2 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-4.5 w-4.5 ${i < Math.floor(averageRating) ? 'fill-current' : 'text-zinc-700'}`} />
              ))}
            </div>
          </div>

          <div className="text-center md:border-r border-white/5 py-4">
            <span className="text-3xl font-bold text-white font-serif">{approvedReviews.length}</span>
            <span className="text-xs text-zinc-400 block uppercase tracking-widest mt-1 font-semibold">Verified Reviews</span>
            <span className="text-xs text-zinc-500 font-light mt-1 block">100% genuine buyer ratings</span>
          </div>

          <div className="flex justify-center py-4">
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E8C97E] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-black transition-all duration-300 hover:shadow-[0_0_20px_rgba(201,168,76,0.3)] cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Write A Review
            </button>
          </div>
        </div>

        {/* Accordion Review Writing Form */}
        {showForm && (
          <div className="bg-zinc-950 border border-white/10 rounded-3xl p-6 md:p-8 mb-12 shadow-2xl transition-all duration-500">
            {submitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="mx-auto h-12 w-12 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-500">
                  <Check className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-bold text-white">Review Submitted!</h4>
                <p className="text-sm text-zinc-400 font-light">Thank you! Your feedback will appear shortly after moderation.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-6 text-left">
                <h3 className="text-xl font-bold text-white font-serif border-b border-white/5 pb-3">Share Your Experience</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Your Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Alexander Cole"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full rounded-xl bg-zinc-900 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Review Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Best beard wash ever!"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="w-full rounded-xl bg-zinc-900 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-zinc-400 font-medium uppercase tracking-wider block">Rating Star Count</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="text-[#C9A84C] focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                      >
                        <Star className={`h-6 w-6 ${star <= rating ? 'fill-current' : 'text-zinc-700'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Detailed Feedback</label>
                  <textarea
                    rows="4"
                    placeholder="Tell us what you liked or how we can improve..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    className="w-full rounded-xl bg-zinc-900 border border-white/10 p-4 text-sm text-white focus:outline-none focus:border-[#C9A84C]"
                  ></textarea>
                </div>

                <div className="flex gap-4 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="rounded-xl border border-white/10 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/5 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E8C97E] px-8 py-3 text-xs font-bold uppercase tracking-wider text-black hover:brightness-110 cursor-pointer"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-6">
          {approvedReviews.map((review) => (
            <div
              key={review.id}
              className="bg-zinc-900/30 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-md text-left flex flex-col md:flex-row gap-6 hover:border-zinc-800 transition-all duration-300 shadow-lg"
            >
              <div className="flex items-center gap-4 md:flex-col md:items-center md:gap-2 md:w-32 shrink-0 text-center">
                <div className="h-14 w-14 rounded-full overflow-hidden border border-[#C9A84C]/50 shadow-md">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{review.name}</h4>
                  <span className="text-[10px] text-[#C9A84C] font-semibold block uppercase tracking-wider mt-0.5">{review.role}</span>
                </div>
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex text-[#C9A84C] gap-0.5">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[11px] text-zinc-500">{review.date}</span>
                </div>

                <h4 className="text-base font-bold text-white tracking-wide">
                  "{review.title}"
                </h4>

                <p className="text-xs md:text-sm text-zinc-400 font-light leading-relaxed">
                  {review.comment}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ReviewsPage;
