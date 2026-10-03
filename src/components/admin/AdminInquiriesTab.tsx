import React, { useState } from 'react';
import { ShoppingBag, Search, Phone, Mail, Clock, Calendar, CheckCircle2, User, AlertCircle, Edit2, Trash2 } from 'lucide-react';
import { OrderInquiry, AdminUser } from '../../types';

interface AdminInquiriesTabProps {
  inquiries: OrderInquiry[];
  currentUser: AdminUser;
  onUpdateInquiry: (inquiry: OrderInquiry) => void;
  onDeleteInquiry: (id: string) => void;
}

export const AdminInquiriesTab: React.FC<AdminInquiriesTabProps> = ({
  inquiries,
  currentUser,
  onUpdateInquiry,
  onDeleteInquiry
}) => {
  const [search, setSearch] = useState('');
  const [filterContact, setFilterContact] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [editingInquiry, setEditingInquiry] = useState<OrderInquiry | null>(null);
  const [contactStatusVal, setContactStatusVal] = useState<'not_contacted' | 'contacted' | 'follow_up'>('contacted');
  const [contactedByVal, setContactedByVal] = useState('');
  const [contactDateVal, setContactDateVal] = useState('');
  const [contactNotesVal, setContactNotesVal] = useState('');
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const filtered = inquiries.filter(inq => {
    const q = search.toLowerCase();
    const matchSearch =
      inq.customer_name.toLowerCase().includes(q) ||
      inq.email.toLowerCase().includes(q) ||
      inq.phone.toLowerCase().includes(q) ||
      inq.fingerling_name.toLowerCase().includes(q);

    const contactSt = inq.contact_status || 'not_contacted';
    const matchContact = filterContact === 'all' || contactSt === filterContact;
    const matchStatus = filterStatus === 'all' || inq.status === filterStatus;

    return matchSearch && matchContact && matchStatus;
  });

  const handleOpenContactModal = (inq: OrderInquiry) => {
    setEditingInquiry(inq);
    setContactStatusVal(inq.contact_status || 'contacted');
    setContactedByVal(inq.contacted_by || `${currentUser.name} (${currentUser.username})`);
    setContactDateVal(
      inq.contacted_date || new Date().toISOString()
    );
    setContactNotesVal(inq.contact_notes || '');
  };

  const handleSaveContactRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInquiry) return;
    const updated: OrderInquiry = {
      ...editingInquiry,
      contact_status: contactStatusVal,
      contacted_by: contactStatusVal !== 'not_contacted' ? contactedByVal : undefined,
      contacted_date: contactStatusVal !== 'not_contacted' ? contactDateVal : undefined,
      contact_notes: contactNotesVal
    };
    onUpdateInquiry(updated);
    setEditingInquiry(null);
    showToast('Customer contact record updated');
  };

  const handleQuickContactToggle = (inq: OrderInquiry, newStatus: 'not_contacted' | 'contacted' | 'follow_up') => {
    const updated: OrderInquiry = {
      ...inq,
      contact_status: newStatus,
      contacted_by: newStatus !== 'not_contacted' ? inq.contacted_by || `${currentUser.name} (${currentUser.username})` : undefined,
      contacted_date: newStatus !== 'not_contacted' ? inq.contacted_date || new Date().toISOString() : undefined
    };
    onUpdateInquiry(updated);
    showToast(`Inquiry marked as "${newStatus.replace('_', ' ')}"`);
  };

  const handleStatusChange = (inq: OrderInquiry, status: OrderInquiry['status']) => {
    onUpdateInquiry({ ...inq, status });
    showToast(`Order status updated to ${status}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" /> Client Order Inquiries ({inquiries.length})
          </h2>
          <p className="text-xs text-muted-foreground">
            Track inquiries, update contacted/not contacted status, and log who reached out to the customer with date and time.
          </p>
        </div>
      </div>

      {toast && (
        <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          ✓ {toast}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by client name, email, phone, stage..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-muted/60 border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Contact Status Filter */}
          <select
            value={filterContact}
            onChange={e => setFilterContact(e.target.value)}
            className="px-3 py-2.5 rounded-2xl bg-muted border border-border text-foreground text-xs font-semibold"
          >
            <option value="all">Contact: All</option>
            <option value="not_contacted">Not Contacted</option>
            <option value="contacted">Contacted</option>
            <option value="follow_up">Follow-up Required</option>
          </select>

          {/* Order Status Filter */}
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2.5 rounded-2xl bg-muted border border-border text-foreground text-xs font-semibold"
          >
            <option value="all">Order: All</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Inquiries List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-8 text-center glass-card rounded-2xl text-muted-foreground text-xs">
            No order inquiries match your filter criteria.
          </div>
        ) : (
          filtered.map(inq => {
            const contactSt = inq.contact_status || 'not_contacted';
            return (
              <div
                key={inq.id}
                className="glass-card rounded-2xl p-5 border border-border/70 space-y-4 flex flex-col justify-between hover:ring-1 hover:ring-primary/30 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-extrabold text-foreground text-base">{inq.customer_name}</h3>
                      
                      {/* Contact Status Dropdown */}
                      <select
                        value={contactSt}
                        onChange={e => handleQuickContactToggle(inq, e.target.value as any)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full border focus:outline-none cursor-pointer ${
                          contactSt === 'contacted'
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                            : contactSt === 'follow_up'
                            ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                            : 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30'
                        }`}
                      >
                        <option value="not_contacted">❌ Not Contacted</option>
                        <option value="contacted">✓ Contacted</option>
                        <option value="follow_up">⏳ Follow-up Needed</option>
                      </select>

                      {/* Order Status Dropdown */}
                      <select
                        value={inq.status}
                        onChange={e => handleStatusChange(inq, e.target.value as any)}
                        className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-muted text-foreground border border-border focus:outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap pt-1">
                      <a href={`mailto:${inq.email}`} className="flex items-center gap-1 hover:text-primary">
                        <Mail className="w-3.5 h-3.5" /> {inq.email}
                      </a>
                      <a href={`tel:${inq.phone}`} className="flex items-center gap-1 hover:text-primary font-mono">
                        <Phone className="w-3.5 h-3.5" /> {inq.phone}
                      </a>
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        <Clock className="w-3.5 h-3.5" /> {new Date(inq.created_date).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="sm:text-right">
                    <div className="text-xs font-bold text-primary">{inq.fingerling_name}</div>
                    <div className="text-sm font-extrabold text-foreground">
                      {inq.quantity ? `${inq.quantity.toLocaleString()} pcs` : 'Unspecified'}
                    </div>
                  </div>
                </div>

                {inq.message && (
                  <div className="p-3 rounded-xl bg-muted/40 border border-border/40 text-xs text-muted-foreground leading-relaxed">
                    <div className="font-semibold text-foreground text-[10px] uppercase tracking-wider mb-1">
                      Client Message:
                    </div>
                    {inq.message}
                  </div>
                )}

                {/* Contact History & Details Banner */}
                <div className="p-3 rounded-xl bg-card border border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    {contactSt !== 'not_contacted' ? (
                      <>
                        <div className="font-semibold text-foreground flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span>Contacted by: <b className="text-primary">{inq.contacted_by || 'Staff'}</b></span>
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          Time & Date: <span className="font-mono">{inq.contacted_date ? new Date(inq.contacted_date).toLocaleString() : 'Just now'}</span>
                        </div>
                        {inq.contact_notes && (
                          <div className="text-[11px] text-foreground italic pt-0.5">
                            Note: "{inq.contact_notes}"
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold">
                        <AlertCircle className="w-4 h-4" />
                        <span>Customer has not been contacted yet. Click "Log Contact" below.</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => handleOpenContactModal(inq)}
                      className="py-1.5 px-3 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Log / Edit Contact</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete inquiry from ${inq.customer_name}?`)) {
                          onDeleteInquiry(inq.id);
                          showToast('Inquiry removed');
                        }
                      }}
                      className="p-1.5 rounded-xl glass text-muted-foreground hover:text-destructive"
                      title="Delete Inquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Log Contact Modal */}
      {editingInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <form
            onSubmit={handleSaveContactRecord}
            className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 animate-scale-in"
          >
            <div className="border-b border-border/40 pb-3">
              <h3 className="text-lg font-bold text-foreground">
                Log Customer Contact: {editingInquiry.customer_name}
              </h3>
              <p className="text-xs text-muted-foreground">
                Record who contacted this client, contact date & time, and notes.
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground">Contact Status</label>
              <select
                value={contactStatusVal}
                onChange={e => setContactStatusVal(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm font-semibold"
              >
                <option value="contacted">✓ Contacted</option>
                <option value="follow_up">⏳ Follow-up Required</option>
                <option value="not_contacted">❌ Not Contacted</option>
              </select>
            </div>

            {contactStatusVal !== 'not_contacted' && (
              <>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Who Contacted the Customer?</label>
                  <input
                    type="text"
                    required
                    value={contactedByVal}
                    onChange={e => setContactedByVal(e.target.value)}
                    placeholder="Staff name / Moderator"
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Contact Timestamp (Date & Time)</label>
                  <input
                    type="datetime-local"
                    value={contactDateVal ? contactDateVal.slice(0, 16) : ''}
                    onChange={e => setContactDateVal(new Date(e.target.value).toISOString())}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Contact Notes & Agreement</label>
                  <textarea
                    rows={3}
                    value={contactNotesVal}
                    onChange={e => setContactNotesVal(e.target.value)}
                    placeholder="e.g. Discussed pricing for 10k Starter fingerlings. Scheduled pickup on Saturday morning."
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm"
                  />
                </div>
              </>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
              <button
                type="button"
                onClick={() => setEditingInquiry(null)}
                className="px-4 py-2 rounded-xl glass text-xs text-muted-foreground"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs"
              >
                Save Contact Log
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
