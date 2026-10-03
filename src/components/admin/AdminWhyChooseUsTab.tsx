import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Check, Sparkles, Award } from 'lucide-react';
import { SiteSettings, WhyChooseUsItem } from '../../types';
import { defaultWhyChooseUs } from '../../data/initialData';

interface AdminWhyChooseUsTabProps {
  settings: SiteSettings;
  onUpdateSettings: (settings: SiteSettings) => void;
}

const AVAILABLE_ICONS = ['Fish', 'Droplets', 'ShieldCheck', 'TrendingUp', 'Award', 'Zap', 'HeartHandshake', 'Truck'];

export const AdminWhyChooseUsTab: React.FC<AdminWhyChooseUsTabProps> = ({ settings, onUpdateSettings }) => {
  const [items, setItems] = useState<WhyChooseUsItem[]>(
    settings.why_choose_us && settings.why_choose_us.length > 0
      ? settings.why_choose_us
      : defaultWhyChooseUs
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<WhyChooseUsItem>({
    id: '',
    title: '',
    description: '',
    icon: 'Fish',
    highlight: ''
  });
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSaveAll = (newItems: WhyChooseUsItem[]) => {
    setItems(newItems);
    onUpdateSettings({
      ...settings,
      why_choose_us: newItems
    });
    showToast('Why Choose Us section updated');
  };

  const handleStartAdd = () => {
    const newItem: WhyChooseUsItem = {
      id: `wcu-${Date.now()}`,
      title: 'New Advantage Reason',
      description: 'Detail why farmers and buyers choose Mesina Farms fingerlings.',
      icon: 'Award',
      highlight: 'Certified'
    };
    setEditForm(newItem);
    setEditingId(newItem.id);
  };

  const handleStartEdit = (item: WhyChooseUsItem) => {
    setEditingId(item.id);
    setEditForm(item);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const exists = items.some(i => i.id === editForm.id);
    let updated: WhyChooseUsItem[];
    if (exists) {
      updated = items.map(i => (i.id === editForm.id ? editForm : i));
    } else {
      updated = [...items, editForm];
    }
    handleSaveAll(updated);
    setEditingId(null);
  };

  const handleRemove = (id: string) => {
    if (items.length <= 1) {
      alert('Must maintain at least 1 reason card.');
      return;
    }
    const updated = items.filter(i => i.id !== id);
    handleSaveAll(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" /> Why Choose Us Section
          </h2>
          <p className="text-xs text-muted-foreground">
            Add, update, or remove key value propositions displayed on the homepage.
          </p>
        </div>
        <button
          onClick={handleStartAdd}
          className="py-2.5 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-xs flex items-center gap-2 shadow-md hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" />
          <span>Add Reason Card</span>
        </button>
      </div>

      {toast && (
        <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          ✓ {toast}
        </div>
      )}

      {/* Editor Modal */}
      {editingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <form
            onSubmit={handleSaveEdit}
            className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 animate-scale-in"
          >
            <h3 className="text-lg font-bold text-foreground">
              {items.some(i => i.id === editForm.id) ? 'Edit Advantage Reason' : 'Add New Advantage Reason'}
            </h3>

            <div>
              <label className="text-xs font-semibold text-muted-foreground">Title</label>
              <input
                type="text"
                required
                value={editForm.title}
                onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground">Highlight Badge (Optional)</label>
              <input
                type="text"
                value={editForm.highlight || ''}
                onChange={e => setEditForm({ ...editForm, highlight: e.target.value })}
                placeholder="e.g. Lab Certified, 98% Purity"
                className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground">Icon</label>
              <div className="flex flex-wrap gap-2 pt-1">
                {AVAILABLE_ICONS.map(ic => (
                  <button
                    key={ic}
                    type="button"
                    onClick={() => setEditForm({ ...editForm, icon: ic })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      editForm.icon === ic
                        ? 'bg-primary text-primary-foreground border-primary shadow'
                        : 'glass text-muted-foreground border-border hover:bg-muted'
                    }`}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground">Description</label>
              <textarea
                rows={3}
                required
                value={editForm.description}
                onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingId(null)}
                className="px-4 py-2 rounded-xl glass text-xs text-muted-foreground"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs"
              >
                Save Reason
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid of Items */}
      <div className="grid sm:grid-cols-2 gap-4">
        {items.map(item => (
          <div key={item.id} className="glass-card rounded-2xl p-5 border border-border/70 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                  Icon: {item.icon}
                </span>
                {item.highlight && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/20 text-accent">
                    {item.highlight}
                  </span>
                )}
              </div>
              <h3 className="font-extrabold text-foreground text-base">{item.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
              <button
                type="button"
                onClick={() => handleStartEdit(item)}
                className="p-1.5 rounded-lg glass text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => handleRemove(item.id)}
                className="p-1.5 rounded-lg glass text-xs text-muted-foreground hover:text-destructive flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
