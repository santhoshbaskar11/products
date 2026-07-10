import React, { useContext, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { Search, CreditCard, ChevronLeft, ChevronRight, X, Eye } from 'lucide-react';

const AdminPayments = () => {
  const { payments, loadPayments } = useContext(ShopContext);

  const [search, setSearch]               = useState('');
  const [statusFilter, setStatusFilter]   = useState('all');
  const [currentPage, setCurrentPage]     = useState(1);
  const [detailsOpen, setDetailsOpen]     = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const itemsPerPage = 8;

  // ── Filter ────────────────────────────────────────────────────
  const filtered = payments.filter(p => {
    const q = search.toLowerCase();
    const matchSearch =
      (p.razorpayPaymentId || '').toLowerCase().includes(q) ||
      (p.razorpayOrderId   || '').toLowerCase().includes(q) ||
      (p.customerName      || '').toLowerCase().includes(q) ||
      (p.customerEmail     || '').toLowerCase().includes(q);
    const matchStatus =
      statusFilter === 'all' ? true : p.paymentStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  // ── Pagination ────────────────────────────────────────────────
  const totalPages      = Math.ceil(filtered.length / itemsPerPage);
  const paginated       = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ── Stats ─────────────────────────────────────────────────────
  const totalRevenue     = payments.reduce((s, p) => s + (p.amount || 0), 0);
  const successCount     = payments.filter(p => p.paymentStatus === 'Success').length;
  const failCount        = payments.length - successCount;

  // ── Styles ────────────────────────────────────────────────────
  const statusStyle = (status) => {
    switch (status) {
      case 'Success': return 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20';
      case 'Failed':  return 'text-rose-400 bg-rose-500/10 border border-rose-500/20';
      default:        return 'text-zinc-400 bg-zinc-500/10 border border-white/5';
    }
  };

  const handleOpenDetails = (p) => {
    setSelectedPayment(p);
    setDetailsOpen(true);
  };

  return (
    <div className="space-y-6 text-left">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white font-serif tracking-wide flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-[#C9A84C]" />
            Payments
          </h2>
          <p className="text-[11px] text-zinc-400 mt-0.5">All verified Razorpay transactions</p>
        </div>
        <button
          onClick={loadPayments}
          className="text-xs font-bold uppercase tracking-wider text-[#C9A84C] border border-[#C9A84C]/30 rounded-lg px-4 py-2 hover:bg-[#C9A84C]/10 transition-colors cursor-pointer"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Revenue',     value: `₹${totalRevenue.toFixed(2)}`,  color: 'text-emerald-400' },
          { label: 'Successful',        value: successCount,                    color: 'text-blue-400'    },
          { label: 'Failed / Pending',  value: failCount,                       color: 'text-rose-400'    },
        ].map((s, i) => (
          <div key={i} className="bg-zinc-900/40 border border-white/5 rounded-2xl px-5 py-4">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{s.label}</p>
            <p className={`text-xl font-bold font-serif mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by Payment ID, Order ID, customer…"
            value={search}
            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-4 py-2.5 bg-zinc-900/50 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          className="bg-zinc-900/50 border border-white/10 rounded-xl text-xs text-zinc-300 px-3 py-2.5 focus:outline-none focus:border-[#C9A84C]/50 cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="Success">Success</option>
          <option value="Failed">Failed</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-white/5 rounded-2xl bg-zinc-900/20">
          <CreditCard className="h-10 w-10 text-zinc-700 mb-3" />
          <p className="text-zinc-400 font-semibold text-sm">No payments found</p>
          <p className="text-zinc-600 text-xs mt-1">Payments appear here after successful Razorpay checkout</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/5">
          <table className="w-full text-xs text-left">
            <thead className="bg-zinc-900/60 border-b border-white/5">
              <tr>
                {['Payment ID', 'Razorpay Order ID', 'Customer', 'Amount', 'Method', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginated.map(p => (
                <tr key={p.id} className="hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3 font-mono text-[10px] text-zinc-300 max-w-[130px] truncate">
                    {p.razorpayPaymentId || '—'}
                  </td>
                  <td className="px-4 py-3 font-mono text-[10px] text-zinc-400 max-w-[130px] truncate">
                    {p.razorpayOrderId || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-white font-semibold">{p.customerName}</p>
                    <p className="text-zinc-500 text-[10px]">{p.customerEmail}</p>
                  </td>
                  <td className="px-4 py-3 font-bold text-emerald-400">
                    ₹{(p.amount || 0).toFixed(2)}
                    <span className="text-zinc-600 font-normal ml-1 text-[10px]">{p.currency}</span>
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{p.paymentMethod || 'Razorpay'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${statusStyle(p.paymentStatus)}`}>
                      {p.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">
                    {p.transactionDate
                      ? new Date(p.transactionDate).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'2-digit' })
                      : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleOpenDetails(p)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-colors cursor-pointer"
                      title="View Details"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-[10px] text-zinc-500">
            Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-white/10 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span className="text-xs text-zinc-400">{currentPage} / {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-white/10 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {detailsOpen && selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-zinc-950 border border-white/10 rounded-3xl p-6 shadow-2xl">
            <button
              onClick={() => setDetailsOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-base font-bold text-white font-serif mb-1">Payment Details</h3>
            <p className="text-[10px] text-zinc-500 mb-5">Full verified Razorpay transaction record</p>

            <div className="space-y-3 text-xs">
              {[
                { label: 'Payment ID',     value: selectedPayment.razorpayPaymentId },
                { label: 'Razorpay Order', value: selectedPayment.razorpayOrderId   },
                { label: 'DB Order ID',    value: selectedPayment.orderId            },
                { label: 'Customer',       value: selectedPayment.customerName       },
                { label: 'Email',          value: selectedPayment.customerEmail      },
                { label: 'Amount',         value: `₹${(selectedPayment.amount || 0).toFixed(2)} ${selectedPayment.currency}` },
                { label: 'Method',         value: selectedPayment.paymentMethod      },
                { label: 'Status',         value: selectedPayment.paymentStatus      },
                { label: 'Transaction At', value: selectedPayment.transactionDate
                    ? new Date(selectedPayment.transactionDate).toLocaleString('en-IN')
                    : '—' },
                { label: 'Saved At',       value: selectedPayment.createdAt
                    ? new Date(selectedPayment.createdAt).toLocaleString('en-IN')
                    : '—' },
              ].map(row => (
                <div key={row.label} className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-zinc-500 font-medium">{row.label}</span>
                  <span className="text-white font-mono text-right max-w-[55%] truncate">{row.value || '—'}</span>
                </div>
              ))}

              {/* Signature */}
              <div className="border-b border-white/5 pb-2">
                <p className="text-zinc-500 font-medium mb-1">Signature (HMAC)</p>
                <p className="text-zinc-400 font-mono text-[9px] break-all">{selectedPayment.razorpaySignature || '—'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayments;
