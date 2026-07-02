import React, { useContext, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { Search, Edit2, Trash2, X, AlertTriangle, ChevronLeft, ChevronRight, ClipboardList, Plus } from 'lucide-react';

const AdminCustomOrders = () => {
  const { customOrders, customers, addCustomOrder, updateCustomOrder, updateCustomOrderStatus, deleteCustomOrder } = useContext(ShopContext);

  // Search, filter, sorting, pagination states
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modals state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('beard');
  const [brand, setBrand] = useState('Sovereign Lab');
  const [fragrance, setFragrance] = useState('Sandalwood Bourbon');
  const [packaging, setPackaging] = useState(false);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('Processing');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  // Manual custom order states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const [priceInput, setPriceInput] = useState('85.00');

  // Filter custom orders
  let filtered = customOrders.filter((o) => {
    const matchesSearch = o.id.toLowerCase().includes(search.toLowerCase()) || 
                          o.customer.toLowerCase().includes(search.toLowerCase()) ||
                          o.notes.toLowerCase().includes(search.toLowerCase());
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

  const handleOpenEdit = (order) => {
    setSelectedOrder(order);
    setCustomerName(order.customer);
    setEmail(order.email || '');
    setCategory(order.category);
    setBrand(order.brand);
    setFragrance(order.fragrance);
    setPackaging(order.packaging || false);
    setNotes(order.notes);
    setStatus(order.status);
    setEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!customerName || !notes) return;

    if (selectedOrder) {
      const updated = {
        ...selectedOrder,
        customer: customerName,
        email,
        category,
        brand,
        fragrance,
        packaging,
        notes,
        status
      };
      updateCustomOrder(updated);
    }
    setEditModalOpen(false);
  };

  const handleOpenDelete = (order) => {
    setOrderToDelete(order);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (orderToDelete) {
      deleteCustomOrder(orderToDelete.id);
      setDeleteConfirmOpen(false);
      setOrderToDelete(null);
    }
  };

  const handleOpenAdd = () => {
    if (customers && customers.length > 0) {
      setCustomerId(customers[0].id);
    } else {
      setCustomerId('');
    }
    setCategory('beard');
    setBrand('Sovereign Lab');
    setFragrance('Sandalwood Bourbon');
    setPackaging(false);
    setNotes('');
    setPriceInput('85.00');
    setStatus('Processing');
    setAddModalOpen(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!customerId || !notes) return;

    const selectedCustObj = customers.find(c => c.id === customerId);
    const addedId = `CUST-ORD-${Date.now().toString().slice(-4)}`;

    const added = {
      id: addedId,
      customerId,
      customer: selectedCustObj ? selectedCustObj.name : 'Unknown Customer',
      email: selectedCustObj ? selectedCustObj.email : 'N/A',
      category,
      brand,
      fragrance,
      packaging,
      notes,
      price: parseFloat(priceInput) || 85.00,
      status,
      date: new Date().toISOString().slice(0, 10)
    };

    addCustomOrder(added);
    setAddModalOpen(false);
  };

  return (
    <div className="space-y-8 text-left relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white font-serif tracking-wide">Bespoke Custom Orders</h2>
          <p className="text-xs text-zinc-400 font-light mt-1">Audit, configure, or fulfill unique wood-engraved grooming kit subscriptions.</p>
        </div>
        
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E8C97E] px-5 py-3 text-xs font-bold uppercase tracking-wider text-black hover:brightness-110 hover:scale-105 transition-all cursor-pointer shrink-0"
        >
          <Plus className="h-4.5 w-4.5" />
          Add Custom Order
        </button>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-zinc-950/80 border border-white/5 p-4 rounded-2xl">
        {/* Search */}
        <div className="md:col-span-8 relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
            <Search className="h-4.5 w-4.5" />
          </span>
          <input
            type="text"
            placeholder="Search custom orders by ID, client name, engraving notes..."
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

      {/* Custom Orders Table */}
      <div className="bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-900/80 border-b border-white/5 text-zinc-500 uppercase tracking-wider font-semibold">
                <th className="py-4.5 px-6">Order ID</th>
                <th className="py-4.5 px-6">Customer</th>
                <th className="py-4.5 px-6">Kit Configurations</th>
                <th className="py-4.5 px-6">Engraving Plate Note</th>
                <th className="py-4.5 px-6">Status</th>
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

                    {/* Customer */}
                    <td className="py-5 px-6">
                      <span className="text-white font-semibold block">{ord.customer}</span>
                      <span className="text-[10px] text-zinc-500 block">{ord.email || 'N/A'}</span>
                    </td>

                    {/* Kit Configurations */}
                    <td className="py-5 px-6 text-zinc-400">
                      <div>Category: <span className="text-white font-semibold capitalize">{ord.category}</span></div>
                      <div className="mt-0.5">Brand: <span className="text-white font-semibold">{ord.brand}</span></div>
                      <div className="mt-0.5">Scent: <span className="text-white font-semibold">{ord.fragrance}</span></div>
                      <div className="mt-1">
                        {ord.packaging ? (
                          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#C9A84C]/10 border border-[#C9A84C]/25 text-[#E8C97E]">
                            📦 Oak Wooden Box
                          </span>
                        ) : (
                          <span className="text-[9px] text-zinc-500">Standard Pack</span>
                        )}
                      </div>
                    </td>

                    {/* Notes */}
                    <td className="py-5 px-6 max-w-xs font-serif text-zinc-300 italic">
                      "{ord.notes || 'No message requested'}"
                    </td>

                    {/* Status dropdown selector */}
                    <td className="py-5 px-6">
                      <div className="flex flex-col gap-1.5 items-start">
                        <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${getStatusStyle(ord.status)}`}>
                          {ord.status}
                        </span>
                        <select
                          value={ord.status}
                          onChange={(e) => updateCustomOrderStatus(ord.id, e.target.value)}
                          className="bg-zinc-900 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-white focus:outline-none focus:border-[#C9A84C] cursor-pointer"
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-5 px-6 text-center">
                      <div className="flex justify-center items-center gap-3">
                        <button
                          onClick={() => handleOpenEdit(ord)}
                          title="Edit Custom Specifications"
                          className="h-8 w-8 flex items-center justify-center rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:text-[#C9A84C] hover:border-[#C9A84C]/50 transition-colors cursor-pointer"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(ord)}
                          title="Delete Custom Order"
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
                    No custom kit orders found matching criteria.
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
              Page {currentPage} of {totalPages} ({filtered.length} custom orders total)
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

      {/* Edit specifications modal */}
      {editModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setEditModalOpen(false)} className="absolute inset-0 bg-black/75 backdrop-blur-sm"></div>

          <div className="relative w-full max-w-lg bg-zinc-950 border border-[#C9A84C]/35 rounded-3xl p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto animate-scale-up text-left">
            <button
              onClick={() => setEditModalOpen(false)}
              className="absolute right-5 top-5 text-zinc-500 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-bold text-white font-serif tracking-wide border-b border-white/5 pb-3">
              Modify Custom Kit Specifications
            </h3>

            <form onSubmit={handleEditSubmit} className="mt-6 space-y-5 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Customer name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Customer Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jonathan Sterling"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full rounded-xl bg-zinc-900 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>

                {/* Email address */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. customer@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl bg-zinc-900 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Category select */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Kit Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl bg-zinc-900 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C] cursor-pointer"
                  >
                    <option value="beard">Beard Care</option>
                    <option value="hair">Hair Styling</option>
                    <option value="skin">Skincare</option>
                  </select>
                </div>

                {/* Brand select */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Artisan Brand</label>
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full rounded-xl bg-zinc-900 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C] cursor-pointer"
                  >
                    <option>Sovereign Lab</option>
                    <option>Apex Grooming</option>
                    <option>Vanguard Botanicals</option>
                    <option>Onyx & Clay</option>
                  </select>
                </div>

                {/* Scent base select */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Scent Profile</label>
                  <select
                    value={fragrance}
                    onChange={(e) => setFragrance(e.target.value)}
                    className="w-full rounded-xl bg-zinc-900 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C] cursor-pointer"
                  >
                    <option>Sandalwood Bourbon</option>
                    <option>Fresh Bergamot Mint</option>
                    <option>Smoky Agarwood</option>
                    <option>Crushed Cedarwood Sage</option>
                    <option>Natural Unscented</option>
                  </select>
                </div>
              </div>

              {/* Oak wooden box packaging */}
              <div className="flex items-center gap-2 py-2">
                <input
                  type="checkbox"
                  id="packaging_edit"
                  checked={packaging}
                  onChange={(e) => setPackaging(e.target.checked)}
                  className="rounded bg-zinc-900 border border-white/10 focus:ring-0 text-[#C9A84C] h-4 w-4 cursor-pointer"
                />
                <label htmlFor="packaging_edit" className="text-xs font-bold text-zinc-300 uppercase tracking-wider cursor-pointer select-none">
                  Upgrade to Oak Gift Box Packaging (+ $9.99)
                </label>
              </div>

              {/* Engraving Notes */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Engraved notes plate message</label>
                <input
                  type="text"
                  maxLength="80"
                  required
                  placeholder="e.g. Happy Father's Day"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C]"
                />
              </div>

              {/* Dispatch status */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Dispatch Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C] cursor-pointer"
                >
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
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
                  className="rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E8C97E] px-6 py-3 text-xs font-bold uppercase tracking-wider text-black hover:brightness-110 transition-all cursor-pointer font-bold"
                >
                  Save Spec Details
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
            
            <h3 className="text-lg font-bold text-white font-serif tracking-wide">Delete Custom Order</h3>
            <p className="mt-2 text-xs text-zinc-400 font-light leading-relaxed">
              Are you sure you want to delete custom kit order <strong className="text-white font-semibold">"{orderToDelete?.id}"</strong>? This will permanently wipe this record from the database.
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

      {/* Manual Add Custom Order Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setAddModalOpen(false)} className="absolute inset-0 bg-black/75 backdrop-blur-sm"></div>
          
          <div className="relative w-full max-w-lg bg-zinc-950 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto text-left animate-scale-up">
            <button
              onClick={() => setAddModalOpen(false)}
              className="absolute right-6 top-6 text-zinc-500 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-bold font-serif text-white mb-6">Create Custom Grooming Order</h3>
            
            <form onSubmit={handleAddSubmit} className="space-y-5">
              {/* Select Customer */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Customer</label>
                <select
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  required
                  className="w-full rounded-xl bg-zinc-900 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C] cursor-pointer"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category/Type */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Product Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl bg-zinc-900 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C] cursor-pointer"
                  >
                    <option value="beard">Beard Grooming Kit</option>
                    <option value="hair">Hair Styling Kit</option>
                    <option value="skin">Skincare Essentials Kit</option>
                  </select>
                </div>

                {/* Brand */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Woodwork Brand</label>
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full rounded-xl bg-zinc-900 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C] cursor-pointer"
                  >
                    <option value="Sovereign Lab">Sovereign Lab Custom</option>
                    <option value="Bourbon Barrel">Bourbon Barrel Aged</option>
                    <option value="Royal Oak">Royal Oak Premium</option>
                  </select>
                </div>

                {/* Fragrance */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Aroma Notes</label>
                  <select
                    value={fragrance}
                    onChange={(e) => setFragrance(e.target.value)}
                    className="w-full rounded-xl bg-zinc-900 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C] cursor-pointer"
                  >
                    <option value="Sandalwood Bourbon">Sandalwood Bourbon</option>
                    <option value="Cedarwood Forest">Cedarwood Forest</option>
                    <option value="Vintage Leather">Vintage Leather</option>
                  </select>
                </div>

                {/* Estimated Price */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Price Quote ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={priceInput}
                    onChange={(e) => setPriceInput(e.target.value)}
                    className="w-full rounded-xl bg-zinc-900 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>
              </div>

              {/* Custom Note */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Bespoke Engraving Message</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. For Arthur - Est. 2026"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C]"
                />
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Order Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C] cursor-pointer"
                >
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>

              {/* Packaging */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="packaging-add"
                  checked={packaging}
                  onChange={(e) => setPackaging(e.target.checked)}
                  className="h-4.5 w-4.5 rounded bg-zinc-900 border-white/10 text-[#C9A84C] focus:ring-[#C9A84C]"
                />
                <label htmlFor="packaging-add" className="text-zinc-300 text-xs font-medium cursor-pointer">
                  Upgrade with Premium Velvet Gift Wrapping (+$15.00)
                </label>
              </div>

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
                  Save Custom Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomOrders;
