import React, { useContext, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { Search, Eye, Trash2, X, AlertTriangle, ChevronLeft, ChevronRight, ClipboardList } from 'lucide-react';

const AdminOrders = () => {
  const { orders, updateOrderStatus, updateOrderPaymentStatus, deleteOrder } = useContext(ShopContext);

  // Search, filter, sorting, pagination states
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modals state
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  // Filter orders
  let filtered = orders.filter((o) => {
    const matchesSearch = o.id.toLowerCase().includes(search.toLowerCase()) || 
                          o.customer.toLowerCase().includes(search.toLowerCase()) ||
                          o.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' ? true : o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Sort orders (Newest first)
  filtered.sort((a, b) => b.date.localeCompare(a.date));

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedOrders = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Delivered':
        return 'text-green-400 bg-green-500/10 border border-green-500/20';
      case 'Shipped':
        return 'text-blue-400 bg-blue-400/10 border border-blue-400/20';
      default:
        return 'text-amber-500 bg-amber-500/10 border border-amber-500/20';
    }
  };

  const getPaymentStatusStyle = (payStatus) => {
    switch (payStatus) {
      case 'Paid':
        return 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20';
      case 'Refunded':
        return 'text-rose-400 bg-rose-500/10 border border-rose-500/20';
      default:
        return 'text-zinc-500 bg-zinc-500/10 border border-white/5';
    }
  };

  const handleOpenDetails = (order) => {
    setSelectedOrder(order);
    setDetailsModalOpen(true);
  };

  const handleOpenDelete = (order) => {
    setOrderToDelete(order);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (orderToDelete) {
      deleteOrder(orderToDelete.id);
      setDeleteConfirmOpen(false);
      setOrderToDelete(null);
    }
  };

  return (
    <div className="space-y-8 text-left relative">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white font-serif tracking-wide">Client Orders</h2>
        <p className="text-xs text-zinc-400 font-light mt-1">Audit transactions, print invoices, and update shipping operations status.</p>
      </div>

      {/* Filters bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-zinc-950/80 border border-white/5 p-4 rounded-2xl">
        {/* Search */}
        <div className="md:col-span-8 relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
            <Search className="h-4.5 w-4.5" />
          </span>
          <input
            type="text"
            placeholder="Search orders by ID, customer name, email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full rounded-xl bg-zinc-900 border border-white/10 pl-11 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#C9A84C]"
          />
        </div>

        {/* Filter status */}
        <div className="md:col-span-4">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="w-full rounded-xl bg-zinc-900 border border-white/10 px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A84C] cursor-pointer"
          >
            <option value="all">All Dispatch Statuses</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-900/80 border-b border-white/5 text-zinc-500 uppercase tracking-wider font-semibold">
                <th className="py-4.5 px-6">Order ID</th>
                <th className="py-4.5 px-6">Customer</th>
                <th className="py-4.5 px-6">Dispatch Status</th>
                <th className="py-4.5 px-6">Payment</th>
                <th className="py-4.5 px-6">Total Amount</th>
                <th className="py-4.5 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-white/2 transition-colors">
                    {/* Order ID */}
                    <td className="py-5 px-6">
                      <span className="text-white font-bold tracking-wider">{ord.id}</span>
                      <span className="block text-[10px] text-zinc-500 mt-1">{ord.date}</span>
                    </td>

                    {/* Customer Info */}
                    <td className="py-5 px-6">
                      <span className="text-white font-semibold block">{ord.customer}</span>
                      <span className="text-[10px] text-zinc-500 block">{ord.email}</span>
                    </td>

                    {/* Dispatch status controls */}
                    <td className="py-5 px-6">
                      <div className="flex flex-col gap-1.5 items-start">
                        <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${getStatusStyle(ord.status)}`}>
                          {ord.status}
                        </span>
                        <select
                          value={ord.status}
                          onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                          className="bg-zinc-900 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-white focus:outline-none focus:border-[#C9A84C] cursor-pointer"
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>
                    </td>

                    {/* Payment status controls */}
                    <td className="py-5 px-6">
                      <div className="flex flex-col gap-1.5 items-start">
                        <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${getPaymentStatusStyle(ord.paymentStatus)}`}>
                          {ord.paymentStatus}
                        </span>
                        <select
                          value={ord.paymentStatus}
                          onChange={(e) => updateOrderPaymentStatus(ord.id, e.target.value)}
                          className="bg-zinc-900 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-white focus:outline-none focus:border-[#C9A84C] cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Paid">Paid</option>
                          <option value="Refunded">Refunded</option>
                        </select>
                      </div>
                    </td>

                    {/* Price total */}
                    <td className="py-5 px-6 font-bold text-white text-sm">
                      ${ord.amount.toFixed(2)}
                    </td>

                    {/* Actions */}
                    <td className="py-5 px-6 text-center">
                      <div className="flex justify-center items-center gap-3">
                        <button
                          onClick={() => handleOpenDetails(ord)}
                          title="View Details"
                          className="h-8 w-8 flex items-center justify-center rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:text-[#C9A84C] hover:border-[#C9A84C]/50 transition-colors cursor-pointer"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(ord)}
                          title="Delete Order"
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
                  <td colSpan="6" className="py-12 text-center text-zinc-500 font-light">
                    No client orders found.
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
              Page {currentPage} of {totalPages} ({filtered.length} orders total)
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

      {/* Details View Modal */}
      {detailsModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setDetailsModalOpen(false)} className="absolute inset-0 bg-black/75 backdrop-blur-sm"></div>

          <div className="relative w-full max-w-lg bg-zinc-950 border border-[#C9A84C]/35 rounded-3xl p-6 md:p-8 shadow-2xl animate-scale-up text-left">
            <button
              onClick={() => setDetailsModalOpen(false)}
              className="absolute right-5 top-5 text-zinc-500 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <ClipboardList className="h-5 w-5 text-[#C9A84C]" />
              <h3 className="text-lg font-bold text-white font-serif tracking-wide">
                Invoice Details: {selectedOrder.id}
              </h3>
            </div>

            <div className="mt-6 space-y-4 text-xs">
              {/* Customer summary */}
              <div className="grid grid-cols-2 gap-4 bg-zinc-900/40 p-4 border border-white/5 rounded-2xl">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Customer</span>
                  <strong className="text-white text-sm font-semibold">{selectedOrder.customer}</strong>
                  <span className="block text-[10px] text-zinc-400 mt-0.5">{selectedOrder.email}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider block text-right">Order Date</span>
                  <strong className="text-white text-sm font-semibold block text-right">{selectedOrder.date}</strong>
                </div>
              </div>

              {/* Items grid */}
              <div className="space-y-3">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold block">Purchased Items</span>
                <div className="border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-zinc-900/20">
                      <div>
                        <span className="text-white font-semibold">{item.name}</span>
                        <span className="block text-[10px] text-zinc-400 mt-0.5">${item.price.toFixed(2)} each</span>
                      </div>
                      <span className="text-white font-medium">Qty: {item.qty}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status and totals */}
              <div className="flex justify-between items-center pt-4 border-t border-white/5">
                <div className="flex gap-2">
                  <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${getStatusStyle(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                  <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${getPaymentStatusStyle(selectedOrder.paymentStatus)}`}>
                    {selectedOrder.paymentStatus}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-zinc-500 uppercase tracking-wider block text-right">Invoice Total</span>
                  <strong className="text-[#C9A84C] text-lg font-extrabold">${selectedOrder.amount.toFixed(2)}</strong>
                </div>
              </div>

              {/* Close Button */}
              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setDetailsModalOpen(false)}
                  className="rounded-xl bg-zinc-800 text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-[#C9A84C] hover:text-black transition-colors cursor-pointer"
                >
                  Close Invoice
                </button>
              </div>
            </div>
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
            
            <h3 className="text-lg font-bold text-white font-serif tracking-wide">Delete Order</h3>
            <p className="mt-2 text-xs text-zinc-400 font-light leading-relaxed">
              Are you sure you want to delete order <strong className="text-white font-semibold">"{orderToDelete?.id}"</strong>? This will permanently wipe this transaction record from the database.
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

export default AdminOrders;
