import React, { useContext, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { Search, Mail, MailOpen, Trash2, ChevronLeft, ChevronRight, X, AlertTriangle } from 'lucide-react';

const AdminMessages = () => {
  const { contactMessages, toggleMessageRead, deleteMessage } = useContext(ShopContext);

  // Search and pagination states
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modals state
  const [msgOpen, setMsgOpen] = useState(null); // stores active message object to display
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [msgToDelete, setMsgToDelete] = useState(null);

  // Filter messages
  let filtered = contactMessages.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.message.toLowerCase().includes(search.toLowerCase())
  );

  // Sort messages (Newest first)
  filtered.sort((a, b) => b.date.localeCompare(a.date));

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedMessages = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleOpenMessage = (msg) => {
    setMsgOpen(msg);
    if (msg.unread) {
      toggleMessageRead(msg.id);
    }
  };

  const handleOpenDelete = (msg) => {
    setMsgToDelete(msg);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (msgToDelete) {
      deleteMessage(msgToDelete.id);
      setDeleteConfirmOpen(false);
      setMsgToDelete(null);
    }
  };

  return (
    <div className="space-y-8 text-left relative">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white font-serif tracking-wide">Contact Messages Inbox</h2>
        <p className="text-xs text-zinc-400 font-light mt-1">Audit customer inquiries, support requests, and business propositions.</p>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 gap-4 bg-zinc-950/80 border border-white/5 p-4 rounded-2xl">
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
            <Search className="h-4.5 w-4.5" />
          </span>
          <input
            type="text"
            placeholder="Search messages by sender name, email, or keywords..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full rounded-xl bg-zinc-900 border border-white/10 pl-11 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#C9A84C]"
          />
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-900/80 border-b border-white/5 text-zinc-500 uppercase tracking-wider font-semibold">
                <th className="py-4.5 px-6">Sender Details</th>
                <th className="py-4.5 px-6">Message Excerpt</th>
                <th className="py-4.5 px-6">Received Date</th>
                <th className="py-4.5 px-6">Status</th>
                <th className="py-4.5 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              {paginatedMessages.length > 0 ? (
                paginatedMessages.map((msg) => (
                  <tr key={msg.id} className={`hover:bg-white/2 transition-colors ${msg.unread ? 'bg-white/[0.01]' : ''}`}>
                    {/* Sender Details */}
                    <td className="py-4.5 px-6">
                      <span className={`text-sm tracking-wide block ${msg.unread ? 'font-bold text-white' : 'font-semibold text-zinc-300'}`}>
                        {msg.name}
                      </span>
                      <span className="text-[10px] text-zinc-500 block mt-0.5">{msg.email}</span>
                    </td>

                    {/* Excerpt */}
                    <td className="py-4.5 px-6 max-w-sm">
                      <p className={`line-clamp-1 font-light ${msg.unread ? 'text-zinc-200 font-medium' : 'text-zinc-400'}`}>
                        {msg.message}
                      </p>
                    </td>

                    {/* Received Date */}
                    <td className="py-4.5 px-6 text-zinc-400 font-medium">
                      {msg.date}
                    </td>

                    {/* Status */}
                    <td className="py-4.5 px-6">
                      {msg.unread ? (
                        <span className="text-rose-400 bg-rose-500/10 border border-rose-500/20 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1.5 w-max">
                          <Mail className="h-3 w-3" /> Unread
                        </span>
                      ) : (
                        <span className="text-zinc-500 bg-zinc-800 border border-white/5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1.5 w-max">
                          <MailOpen className="h-3 w-3" /> Read
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4.5 px-6 text-center">
                      <div className="flex justify-center items-center gap-3">
                        <button
                          onClick={() => handleOpenMessage(msg)}
                          title="Read Message"
                          className="h-8 w-8 flex items-center justify-center rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:text-[#C9A84C] hover:border-[#C9A84C]/50 transition-colors cursor-pointer"
                        >
                          <MailOpen className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(msg)}
                          title="Delete Message"
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
                    No contact messages found.
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
              Page {currentPage} of {totalPages} ({filtered.length} messages total)
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

      {/* Message Reader Modal */}
      {msgOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setMsgOpen(null)} className="absolute inset-0 bg-black/75 backdrop-blur-sm"></div>

          <div className="relative w-full max-w-lg bg-zinc-950 border border-[#C9A84C]/35 rounded-3xl p-6 md:p-8 shadow-2xl animate-scale-up text-left">
            <button
              onClick={() => setMsgOpen(null)}
              className="absolute right-5 top-5 text-zinc-500 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-bold text-white font-serif tracking-wide border-b border-white/5 pb-3">
              Message details: {msgOpen.id}
            </h3>

            <div className="mt-6 space-y-5 text-xs">
              <div className="bg-zinc-900/40 p-4 border border-white/5 rounded-2xl">
                <span className="text-[10px] text-[#C9A84C] font-bold uppercase tracking-wider block">Sender</span>
                <strong className="text-white text-sm font-semibold mt-1 block">{msgOpen.name}</strong>
                <span className="text-[10px] text-zinc-500 block mt-0.5">{msgOpen.email}</span>
                <span className="text-[10px] text-zinc-400 block mt-2 text-right">Received Date: {msgOpen.date}</span>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] text-[#C9A84C] font-bold uppercase tracking-wider block">Message Content</span>
                <div className="bg-zinc-900/20 border border-white/5 rounded-2xl p-4 text-zinc-300 font-light leading-relaxed text-sm whitespace-pre-line max-h-60 overflow-y-auto">
                  {msgOpen.message}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/5">
                <button
                  onClick={() => {
                    toggleMessageRead(msgOpen.id);
                    setMsgOpen(null);
                  }}
                  className="rounded-xl border border-white/10 bg-transparent px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  Mark as Unread
                </button>
                <button
                  onClick={() => setMsgOpen(null)}
                  className="rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E8C97E] text-black px-6 py-2.5 text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-colors cursor-pointer font-bold"
                >
                  Close Message
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
            
            <h3 className="text-lg font-bold text-white font-serif tracking-wide">Delete Contact Message</h3>
            <p className="mt-2 text-xs text-zinc-400 font-light leading-relaxed">
              Are you sure you want to delete message <strong className="text-white font-semibold">"{msgToDelete?.id}"</strong>? This will permanently wipe this message from the administrator inbox records.
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

export default AdminMessages;
