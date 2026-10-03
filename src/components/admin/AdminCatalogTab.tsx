import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Upload, Camera, Layers, Check, Star, Fish } from 'lucide-react';
import { Fingerling, PriceTier } from '../../types';

interface AdminCatalogTabProps {
  fingerlings: Fingerling[];
  onUpdateFingerling: (fingerling: Fingerling) => void;
  onAddFingerling: (fingerling: Fingerling) => void;
  onDeleteFingerling: (id: string) => void;
}

export const AdminCatalogTab: React.FC<AdminCatalogTabProps> = ({
  fingerlings,
  onUpdateFingerling,
  onAddFingerling,
  onDeleteFingerling
}) => {
  const [editingFish, setEditingFish] = useState<Fingerling | null>(null);
  const [isNewFish, setIsNewFish] = useState(false);
  const [toast, setToast] = useState('');
  const [newImgUrl, setNewImgUrl] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleStartAddFish = () => {
    const newFish: Fingerling = {
      id: `fish-${Date.now()}`,
      name: 'African Sharptooth Catfish (Clarias gariepinus)',
      scientific_name: 'Clarias gariepinus',
      category: 'Catfish',
      size_label: '3-5 cm',
      stock_count: 10000,
      low_stock_threshold: 1500,
      sort_order: fingerlings.length + 1,
      description: 'Robust, fast-growing juvenile catfish suited for intensive high-density tank and pond cultures.',
      image_url: 'https://media.base44.com/images/public/6a761d1d3d52f761433ccbdd/7bcb46f1c_generated_dc7ba010.png',
      images: [
        'https://media.base44.com/images/public/6a761d1d3d52f761433ccbdd/7bcb46f1c_generated_dc7ba010.png'
      ],
      price_tiers: [
        { min_qty: 1, max_qty: 499, price_per_unit: 4.0, description: 'Retail Starter Pack' },
        { min_qty: 500, max_qty: 4999, price_per_unit: 3.2, description: 'Semi-Commercial Volume' },
        { min_qty: 5000, max_qty: null, price_per_unit: 2.6, description: 'Commercial Hatchery Bulk' }
      ]
    };
    setEditingFish(newFish);
    setIsNewFish(true);
  };

  const handleStartEdit = (f: Fingerling) => {
    const currentImages = f.images && f.images.length > 0 ? f.images : [f.image_url];
    setEditingFish({
      ...f,
      images: currentImages
    });
    setIsNewFish(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingFish) return;
    const files = e.target.files;
    if (!files || files.length === 0) return;

    (Array.from(files) as File[]).forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => {
        if (ev.target?.result) {
          const dataUrl = ev.target.result as string;
          setEditingFish(prev => {
            if (!prev) return null;
            const curImages = prev.images && prev.images.length > 0 ? prev.images : [prev.image_url];
            return {
              ...prev,
              images: [...curImages, dataUrl]
            };
          });
          showToast('Image uploaded to fish gallery');
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddImageUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImgUrl.trim() || !editingFish) return;
    const curImages = editingFish.images && editingFish.images.length > 0
      ? editingFish.images
      : [editingFish.image_url];
    setEditingFish({
      ...editingFish,
      images: [...curImages, newImgUrl.trim()]
    });
    setNewImgUrl('');
    showToast('Photo added');
  };

  const handleRemoveImage = (index: number) => {
    if (!editingFish) return;
    const curImages = editingFish.images || [editingFish.image_url];
    if (curImages.length <= 1) {
      alert('Must maintain at least 1 image.');
      return;
    }
    const updated = curImages.filter((_, i) => i !== index);
    setEditingFish({
      ...editingFish,
      images: updated,
      image_url: updated[0] || editingFish.image_url
    });
  };

  const handleSetPrimary = (index: number) => {
    if (!editingFish) return;
    const curImages = editingFish.images || [editingFish.image_url];
    const selected = curImages[index];
    const rest = curImages.filter((_, i) => i !== index);
    setEditingFish({
      ...editingFish,
      image_url: selected,
      images: [selected, ...rest]
    });
    showToast('Primary photo updated');
  };

  const handleAddPriceTier = () => {
    if (!editingFish) return;
    const tiers = editingFish.price_tiers;
    const lastTier = tiers[tiers.length - 1];
    const newMin = lastTier ? (lastTier.max_qty ? lastTier.max_qty + 1 : lastTier.min_qty + 1000) : 1;
    const newTier: PriceTier = {
      min_qty: newMin,
      max_qty: null,
      price_per_unit: lastTier ? Math.max(1, lastTier.price_per_unit - 0.5) : 3.0,
      description: 'Volume Tier Discount'
    };
    setEditingFish({
      ...editingFish,
      price_tiers: [...tiers, newTier]
    });
  };

  const handleUpdateTier = (index: number, field: keyof PriceTier, value: any) => {
    if (!editingFish) return;
    const updated = [...editingFish.price_tiers];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    setEditingFish({
      ...editingFish,
      price_tiers: updated
    });
  };

  const handleRemoveTier = (index: number) => {
    if (!editingFish) return;
    if (editingFish.price_tiers.length <= 1) {
      alert('Each stage must have at least one pricing tier.');
      return;
    }
    setEditingFish({
      ...editingFish,
      price_tiers: editingFish.price_tiers.filter((_, i) => i !== index)
    });
  };

  const handleSaveFish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFish) return;
    const images = editingFish.images && editingFish.images.length > 0
      ? editingFish.images
      : [editingFish.image_url];
    const fullFish: Fingerling = {
      ...editingFish,
      image_url: editingFish.image_url || images[0],
      images
    };

    if (isNewFish) {
      onAddFingerling(fullFish);
      showToast('New fish variety added to catalog');
    } else {
      onUpdateFingerling(fullFish);
      showToast('Fish variety & pricing updated');
    }
    setEditingFish(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" /> Fish Catalog & Price Tiers
          </h2>
          <p className="text-xs text-muted-foreground">
            Add new fish types, upload multiple photos per category, manage stock, and edit volume tier descriptions.
          </p>
        </div>

        <button
          onClick={handleStartAddFish}
          className="py-2.5 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-xs flex items-center gap-2 shadow-md hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Type of Fish</span>
        </button>
      </div>

      {toast && (
        <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          ✓ {toast}
        </div>
      )}

      {/* Fish Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {fingerlings.map(fish => {
          const imgs = fish.images && fish.images.length > 0 ? fish.images : [fish.image_url];
          return (
            <div key={fish.id} className="glass-card rounded-2xl p-5 border border-border/70 space-y-4 flex flex-col justify-between">
              <div className="flex items-start gap-4">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-black/40 shrink-0 relative border border-border/60">
                  <img src={fish.image_url || imgs[0]} alt={fish.name} className="w-full h-full object-cover" />
                  {imgs.length > 1 && (
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-white text-[10px] font-bold">
                      {imgs.length} photos
                    </span>
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                      {fish.size_label}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">
                      Stock: <b className="text-foreground">{fish.stock_count.toLocaleString()}</b>
                    </span>
                  </div>
                  <h3 className="font-extrabold text-foreground text-sm">{fish.name}</h3>
                  {fish.scientific_name && (
                    <div className="text-[11px] italic text-emerald-500 dark:text-emerald-400">
                      {fish.scientific_name}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {fish.description}
                  </p>
                </div>
              </div>

              {/* Tiers Preview */}
              <div className="bg-muted/40 p-3 rounded-xl border border-border/40 space-y-1 text-xs">
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Configured Price Tiers ({fish.price_tiers.length}):
                </div>
                <div className="grid grid-cols-3 gap-1 text-center pt-1">
                  {fish.price_tiers.map((t, idx) => (
                    <div key={idx} className="bg-card/70 p-1.5 rounded-lg border border-border/40 text-[11px]">
                      <div>{t.max_qty ? `${t.min_qty}-${t.max_qty}` : `${t.min_qty}+`} pcs</div>
                      <div className="font-bold text-primary">₱{t.price_per_unit.toFixed(2)}</div>
                      {t.description && <div className="text-[9px] text-muted-foreground truncate">{t.description}</div>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
                <button
                  type="button"
                  onClick={() => handleStartEdit(fish)}
                  className="p-1.5 rounded-lg glass text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Fish & Tiers</span>
                </button>
                {fingerlings.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Delete fish "${fish.name}"?`)) {
                        onDeleteFingerling(fish.id);
                        showToast('Fish variety deleted');
                      }
                    }}
                    className="p-1.5 rounded-lg glass text-xs text-muted-foreground hover:text-destructive flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Fish & Tier Editor Modal */}
      {editingFish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <form
            onSubmit={handleSaveFish}
            className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-5 max-h-[92vh] overflow-y-auto animate-scale-in"
          >
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Fish className="w-5 h-5 text-primary" />
                {isNewFish ? 'Add New Type of Fish' : `Edit: ${editingFish.name}`}
              </h3>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Fish / Stage Name</label>
                <input
                  type="text"
                  required
                  value={editingFish.name}
                  onChange={e => setEditingFish({ ...editingFish, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Scientific Name (Species)</label>
                <input
                  type="text"
                  value={editingFish.scientific_name || ''}
                  onChange={e => setEditingFish({ ...editingFish, scientific_name: e.target.value })}
                  placeholder="e.g. Clarias batrachus"
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm italic"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Size Label</label>
                <input
                  type="text"
                  required
                  value={editingFish.size_label}
                  onChange={e => setEditingFish({ ...editingFish, size_label: e.target.value })}
                  placeholder="e.g. 5-8 cm"
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Stock Count (Pcs)</label>
                <input
                  type="number"
                  required
                  value={editingFish.stock_count}
                  onChange={e => setEditingFish({ ...editingFish, stock_count: parseInt(e.target.value, 10) || 0 })}
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Low Stock Alert</label>
                <input
                  type="number"
                  required
                  value={editingFish.low_stock_threshold}
                  onChange={e => setEditingFish({ ...editingFish, low_stock_threshold: parseInt(e.target.value, 10) || 0 })}
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground">Description</label>
              <textarea
                rows={2}
                required
                value={editingFish.description}
                onChange={e => setEditingFish({ ...editingFish, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm"
              />
            </div>

            {/* Multiple Images Upload & Gallery */}
            <div className="p-4 rounded-2xl bg-muted/40 border border-border/50 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-primary" /> Photos Gallery ({editingFish.images?.length || 1})
                </label>
                <label className="cursor-pointer py-1 px-3 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 text-xs font-semibold flex items-center gap-1">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Photos</span>
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} />
                </label>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {(editingFish.images || [editingFish.image_url]).map((img, idx) => (
                  <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-border/60 group bg-black/40">
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                    {idx === 0 && (
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-primary text-primary-foreground text-[9px] font-bold">
                        Main
                      </span>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                      {idx !== 0 && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimary(idx)}
                          title="Set as Main"
                          className="p-1 rounded bg-black/70 text-white hover:text-amber-400"
                        >
                          <Star className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="p-1 rounded bg-black/70 text-white hover:text-destructive"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="Or enter image URL"
                  value={newImgUrl}
                  onChange={e => setNewImgUrl(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 rounded-lg bg-muted border border-border text-foreground text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-3 py-1.5 rounded-lg glass text-xs font-semibold text-foreground"
                >
                  Add URL
                </button>
              </div>
            </div>

            {/* Price Tiers Editor with Descriptions */}
            <div className="p-4 rounded-2xl bg-muted/40 border border-border/50 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Volume Price Tiers & Descriptions
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Define minimum and maximum quantities, unit price, and custom tier descriptions.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAddPriceTier}
                  className="py-1 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Tier</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {editingFish.price_tiers.map((tier, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-card border border-border/60 space-y-2">
                    <div className="grid grid-cols-12 gap-2 items-center text-xs">
                      <div className="col-span-3">
                        <label className="text-[10px] text-muted-foreground">Min Qty</label>
                        <input
                          type="number"
                          value={tier.min_qty}
                          onChange={e => handleUpdateTier(idx, 'min_qty', parseInt(e.target.value, 10) || 1)}
                          className="w-full px-2 py-1.5 rounded-lg bg-muted border border-border text-foreground text-xs"
                        />
                      </div>
                      <div className="col-span-3">
                        <label className="text-[10px] text-muted-foreground">Max Qty (Blank = Max)</label>
                        <input
                          type="number"
                          value={tier.max_qty ?? ''}
                          placeholder="Unlimited"
                          onChange={e =>
                            handleUpdateTier(
                              idx,
                              'max_qty',
                              e.target.value === '' ? null : parseInt(e.target.value, 10)
                            )
                          }
                          className="w-full px-2 py-1.5 rounded-lg bg-muted border border-border text-foreground text-xs"
                        />
                      </div>
                      <div className="col-span-4">
                        <label className="text-[10px] text-muted-foreground">Price per Unit (₱)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={tier.price_per_unit}
                          onChange={e => handleUpdateTier(idx, 'price_per_unit', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1.5 rounded-lg bg-muted border border-border text-foreground text-xs font-bold text-primary"
                        />
                      </div>
                      <div className="col-span-2 flex justify-end pt-3">
                        <button
                          type="button"
                          onClick={() => handleRemoveTier(idx)}
                          className="p-1.5 rounded-lg hover:bg-destructive/20 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-muted-foreground">Tier Description (e.g. Volume Discount, Wholesale)</label>
                      <input
                        type="text"
                        value={tier.description || ''}
                        onChange={e => handleUpdateTier(idx, 'description', e.target.value)}
                        placeholder="e.g. Small Grow-Out Discount (500 - 4,999 pcs)"
                        className="w-full px-2.5 py-1 rounded-lg bg-muted border border-border text-foreground text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
              <button
                type="button"
                onClick={() => setEditingFish(null)}
                className="px-4 py-2 rounded-xl glass text-xs text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-md hover:bg-primary/90"
              >
                Save Fish & Tiers
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
