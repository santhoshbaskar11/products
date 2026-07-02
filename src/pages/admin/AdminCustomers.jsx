import React, { useContext, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { Search, Edit2, Trash2, X, AlertTriangle, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const AdminCustomers = () => {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useContext(ShopContext);

  // Search, sorting, pagination states
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modals state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCust, setSelectedCust] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [tier, setTier] = useState('Standard');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  // Filter customers
  let filtered = customers.filter((c) => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedCustomers = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleOpenAdd = () => {
    setSelectedCust(null);
    setName('');
    setEmail('');
    setTier('Standard');
    setEditModalOpen(true);
  };

  const handleOpenEdit = (cust) => {
    setSelectedCust(cust);
    setName(cust.name);
    setEmail(cust.email);
    setTier(cust.tier);
    setEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) return;

    if (selectedCust) {
      const updated = {
        ...selectedCust,
        name,
        email,
        tier
      };
      updateCustomer(updated);
    } else {
      const added = {
        id: `c-${Date.now()}`,
        name,
        email,
        tier,
        spending: 0,
        ordersCount: 0,
        date: new Date().toISOString().slice(0, 10)
      };
      addCustomer(added);
    }
    setEditModalOpen(false);
  };

  const handleOpenDelete = (cust) => {
    setCustomerToDelete(cust);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (customerToDelete) {
      deleteCustomer(customerToDelete.id);
      setDeleteConfirmOpen(false);
      setCustomerToDelete(null);
    }
  };

  return (
    <div className="space-y-8 text-left relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white font-serif tracking-wide">Customers List</h2>
          <p className="text-xs text-zinc-400 font-light mt-1">Audit customer accounts, lifetime spending indices, and membership tiers.</p>
        </div>
        
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E8C97E] px-5 py-3 text-xs font-bold uppercase tracking-wider text-black hover:brightness-110 hover:scale-105 transition-all cursor-pointer shrink-0"
        >
          <Plus className="h-4.5 w-4.5" />
          Add Customer
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
            placeholder="Search customers by name or email address..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full rounded-xl bg-zinc-900 border border-white/10 pl-11 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#C9A84C]"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-900/80 border-b border-white/5 text-zinc-500 uppercase tracking-wider font-semibold">
                <th className="py-4.5 px-6">Customer Details</th>
                <th className="py-4.5 px-6">Membership Tier</th>
                <th className="py-4.5 px-6">Orders Count</th>
                <th className="py-4.5 px-6">Lifetime Spent</th>
                <th className="py-4.5 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              {paginatedCustomers.length > 0 ? (
                paginatedCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-white/2 transition-colors">
                    {/* Photo & details */}
                    <td className="py-4.5 px-6 flex items-center gap-4">
                      <div className="h-11 w-11 rounded-full overflow-hidden border border-white/10 shrink-0 bg-zinc-950">
                        <img src={c.avatar} alt={c.name} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white tracking-wide">{c.name}</h4>
                        <span className="block text-[10px] text-zinc-500 mt-0.5">{c.email}</span>
                      </div>
                    </td>

                    {/* Tier */}
                    <td className="py-4.5 px-6">
                      <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        c.tier.includes('VIP')
                          ? 'text-[#C9A84C] bg-[#C9A84C]/10 border border-[#C9A84C]/20'
                          : c.tier.includes('Barber')
                          ? 'text-blue-400 bg-blue-400/10 border border-blue-400/20'
                          : 'text-zinc-400 bg-zinc-800/40 border border-white/5'
                      }`}>
                        {c.tier}
                      </span>
                    </td>

                    {/* Orders */}
                    <td className="py-4.5 px-6 font-semibold text-white">
                      {c.ordersCount} order(s)
                    </td>

                    {/* Lifetime Spent */}
                    <td className="py-4.5 px-6 font-bold text-[#E8C97E] text-sm">
                      ${c.totalSpent.toFixed(2)}
                    </td>

                    {/* Actions */}
                    <td className="py-4.5 px-6 text-center">
                      <div className="flex justify-center items-center gap-3">
                        <button
                          onClick={() => handleOpenEdit(c)}
                          title="Edit Customer"
                          className="h-8 w-8 flex items-center justify-center rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:text-[#C9A84C] hover:border-[#C9A84C]/50 transition-colors cursor-pointer"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(c)}
                          title="Delete Customer"
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
                    No customers found matching search filters.
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
              Page {currentPage} of {totalPages} ({filtered.length} customers total)
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

      {/* Edit Customer Form Modal */}
      {editModalOpen && selectedCust && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setEditModalOpen(false)} className="absolute inset-0 bg-black/75 backdrop-blur-sm"></div>

          <div className="relative w-full max-w-lg bg-zinc-950 border border-[#C9A84C]/35 rounded-3xl p-6 md:p-8 shadow-2xl animate-scale-up text-left">
            <button
              onClick={() => setEditModalOpen(false)}
              className="absolute right-5 top-5 text-zinc-500 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-bold font-serif text-white mb-6">
              {selectedCust ? 'Modify Customer Profile' : 'Create Customer Account'}
            </h3>

            <form onSubmit={handleEditSubmit} className="mt-6 space-y-5">
              {/* Customer Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Customer Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jonathan Sterling"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C]"
                />
              </div>

              {/* Customer Email */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. customer@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C]"
                />
              </div>

              {/* Membership Tier */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Membership Tier</label>
                <select
                  value={tier}
                  onChange={(e) => setTier(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C] cursor-pointer"
                >
                  <option value="Standard">Standard Client</option>
                  <option value="Pro Barber">Pro Barber Partner</option>
                  <option value="Sovereign VIP">Sovereign VIP Club</option>
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
            
            <h3 className="text-lg font-bold text-white font-serif tracking-wide">Delete Customer Account</h3>
            <p className="mt-2 text-xs text-zinc-400 font-light leading-relaxed">
              Are you sure you want to delete customer account <strong className="text-white font-semibold">"{customerToDelete?.name}"</strong>? This will permanently erase their credentials and spend history.
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

export default AdminCustomers;
