import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Upload, Video, Camera, Star, BookOpen, Filter } from 'lucide-react';
import { BlogArticle } from '../../types';
import { VideoPlayer } from '../VideoPlayer';

interface AdminArticlesTabProps {
  articles: BlogArticle[];
  onAddArticle: (article: BlogArticle) => void;
  onUpdateArticle: (article: BlogArticle) => void;
  onDeleteArticle: (id: string) => void;
}

export const AdminArticlesTab: React.FC<AdminArticlesTabProps> = ({
  articles,
  onAddArticle,
  onUpdateArticle,
  onDeleteArticle
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [editingArticle, setEditingArticle] = useState<BlogArticle | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [toast, setToast] = useState('');
  const [newImgUrl, setNewImgUrl] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const filteredArticles = filterStatus === 'all'
    ? articles
    : articles.filter(a => (a.status || 'active') === filterStatus);

  const handleStartAdd = () => {
    const newArt: BlogArticle = {
      id: `art-${Date.now()}`,
      title: 'New Hatchery & Aquaculture Guide',
      excerpt: 'Comprehensive guidance on catfish management, water quality, and bio-security.',
      content: 'Write full guide markdown or plain text here...',
      category: 'Hatchery Management',
      author: 'Mesina Farms Team',
      published_date: new Date().toISOString().split('T')[0],
      read_time: '5 min read',
      image_url: 'https://media.base44.com/images/public/6a761d1d3d52f761433ccbdd/aa6a39100_generated_c37d0ca2.png',
      images: [
        'https://media.base44.com/images/public/6a761d1d3d52f761433ccbdd/aa6a39100_generated_c37d0ca2.png'
      ],
      video_url: '',
      video_type: 'youtube',
      status: 'active',
      featured: false
    };
    setEditingArticle(newArt);
    setIsNew(true);
  };

  const handleStartEdit = (art: BlogArticle) => {
    const currentImgs = art.images && art.images.length > 0 ? art.images : [art.image_url];
    setEditingArticle({
      ...art,
      status: art.status || 'active',
      images: currentImgs
    });
    setIsNew(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingArticle) return;
    const files = e.target.files;
    if (!files || files.length === 0) return;

    (Array.from(files) as File[]).forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => {
        if (ev.target?.result) {
          const dataUrl = ev.target.result as string;
          setEditingArticle(prev => {
            if (!prev) return null;
            const cur = prev.images && prev.images.length > 0 ? prev.images : [prev.image_url];
            return {
              ...prev,
              images: [...cur, dataUrl]
            };
          });
          showToast('Article image uploaded');
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingArticle) return;
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev => {
      if (ev.target?.result) {
        setEditingArticle({
          ...editingArticle,
          video_url: ev.target.result as string,
          video_type: 'upload'
        });
        showToast('Video file uploaded');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddImgUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImgUrl.trim() || !editingArticle) return;
    const cur = editingArticle.images && editingArticle.images.length > 0
      ? editingArticle.images
      : [editingArticle.image_url];
    setEditingArticle({
      ...editingArticle,
      images: [...cur, newImgUrl.trim()]
    });
    setNewImgUrl('');
    showToast('Photo added');
  };

  const handleRemoveImage = (index: number) => {
    if (!editingArticle) return;
    const cur = editingArticle.images || [editingArticle.image_url];
    if (cur.length <= 1) {
      alert('Must maintain at least 1 image.');
      return;
    }
    const updated = cur.filter((_, i) => i !== index);
    setEditingArticle({
      ...editingArticle,
      images: updated,
      image_url: updated[0] || editingArticle.image_url
    });
  };

  const handleSetPrimary = (index: number) => {
    if (!editingArticle) return;
    const cur = editingArticle.images || [editingArticle.image_url];
    const selected = cur[index];
    const rest = cur.filter((_, i) => i !== index);
    setEditingArticle({
      ...editingArticle,
      image_url: selected,
      images: [selected, ...rest]
    });
    showToast('Primary photo set');
  };

  const handleQuickStatusChange = (article: BlogArticle, newStatus: 'active' | 'inactive' | 'archived') => {
    onUpdateArticle({
      ...article,
      status: newStatus
    });
    showToast(`Article status set to "${newStatus}"`);
  };

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;
    const images = editingArticle.images && editingArticle.images.length > 0
      ? editingArticle.images
      : [editingArticle.image_url];
    const fullArticle: BlogArticle = {
      ...editingArticle,
      image_url: editingArticle.image_url || images[0],
      images
    };

    if (isNew) {
      onAddArticle(fullArticle);
      showToast('Article published');
    } else {
      onUpdateArticle(fullArticle);
      showToast('Article updated');
    }
    setEditingArticle(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" /> Blogs, Articles & Video Guides
          </h2>
          <p className="text-xs text-muted-foreground">
            Manage bio-care articles, upload multi-image galleries, attach videos, and control Active / Inactive / Archived status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border">
            <Filter className="w-3.5 h-3.5 text-muted-foreground ml-1.5" />
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="bg-transparent text-xs font-semibold text-foreground focus:outline-none pr-2"
            >
              <option value="all">All Articles ({articles.length})</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
              <option value="archived">Archived Only</option>
            </select>
          </div>

          <button
            onClick={handleStartAdd}
            className="py-2.5 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-xs flex items-center gap-2 shadow-md hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Blog / Article</span>
          </button>
        </div>
      </div>

      {toast && (
        <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          ✓ {toast}
        </div>
      )}

      {/* Articles Table / Cards */}
      <div className="space-y-3">
        {filteredArticles.map(art => {
          const imgs = art.images && art.images.length > 0 ? art.images : [art.image_url];
          const st = art.status || 'active';
          return (
            <div key={art.id} className="glass-card rounded-2xl p-4 sm:p-5 border border-border/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-20 h-16 rounded-xl overflow-hidden bg-black/40 shrink-0 relative border border-border/60">
                  <img src={art.image_url || imgs[0]} alt={art.title} className="w-full h-full object-cover" />
                  {imgs.length > 1 && (
                    <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/70 text-white text-[9px] font-bold">
                      {imgs.length}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                      {art.category}
                    </span>
                    {art.video_url && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600/20 text-red-600 dark:text-red-400 flex items-center gap-1">
                        <Video className="w-3 h-3" /> Video Included
                      </span>
                    )}
                    <span className="text-[10px] text-muted-foreground">
                      {art.published_date} • {art.read_time}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-foreground text-sm">{art.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-1">{art.excerpt}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                {/* Status Dropdown */}
                <select
                  value={st}
                  onChange={e => handleQuickStatusChange(art, e.target.value as any)}
                  className={`text-xs font-bold py-1.5 px-3 rounded-xl border focus:outline-none transition-colors ${
                    st === 'active'
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                      : st === 'inactive'
                      ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                      : 'bg-neutral-500/15 text-neutral-600 dark:text-neutral-400 border-neutral-500/30'
                  }`}
                >
                  <option value="active">Active (Visible)</option>
                  <option value="inactive">Inactive (Hidden)</option>
                  <option value="archived">Archived</option>
                </select>

                <button
                  type="button"
                  onClick={() => handleStartEdit(art)}
                  className="p-2 rounded-xl glass text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Delete article "${art.title}"?`)) {
                      onDeleteArticle(art.id);
                      showToast('Article deleted');
                    }
                  }}
                  className="p-2 rounded-xl glass text-xs text-muted-foreground hover:text-destructive flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Article Editor Modal */}
      {editingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <form
            onSubmit={handleSaveArticle}
            className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 max-w-3xl w-full space-y-4 max-h-[92vh] overflow-y-auto animate-scale-in"
          >
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <h3 className="text-lg font-bold text-foreground">
                {isNew ? 'Create New Blog / Article' : `Edit: ${editingArticle.title}`}
              </h3>
              {/* Dropdown status */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-muted-foreground">Publication Status:</label>
                <select
                  value={editingArticle.status}
                  onChange={e => setEditingArticle({ ...editingArticle, status: e.target.value as any })}
                  className="px-3 py-1.5 rounded-xl bg-muted border border-border text-xs font-bold text-foreground"
                >
                  <option value="active">Active (Visible)</option>
                  <option value="inactive">Inactive (Draft)</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Article Title</label>
                <input
                  type="text"
                  required
                  value={editingArticle.title}
                  onChange={e => setEditingArticle({ ...editingArticle, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Category</label>
                <input
                  type="text"
                  required
                  value={editingArticle.category}
                  onChange={e => setEditingArticle({ ...editingArticle, category: e.target.value })}
                  placeholder="e.g. Water Quality, Hatchery Setup"
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Author</label>
                <input
                  type="text"
                  value={editingArticle.author}
                  onChange={e => setEditingArticle({ ...editingArticle, author: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Published Date</label>
                <input
                  type="date"
                  value={editingArticle.published_date}
                  onChange={e => setEditingArticle({ ...editingArticle, published_date: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Estimated Read Time</label>
                <input
                  type="text"
                  value={editingArticle.read_time}
                  onChange={e => setEditingArticle({ ...editingArticle, read_time: e.target.value })}
                  placeholder="e.g. 5 min read"
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground">Excerpt (Short Summary)</label>
              <textarea
                rows={2}
                required
                value={editingArticle.excerpt}
                onChange={e => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm"
              />
            </div>

            {/* Multiple Images Upload & Gallery */}
            <div className="p-4 rounded-2xl bg-muted/40 border border-border/50 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-primary" /> Multi-Image Gallery ({editingArticle.images?.length || 1})
                </label>
                <label className="cursor-pointer py-1 px-3 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 text-xs font-semibold flex items-center gap-1">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Images</span>
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} />
                </label>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {(editingArticle.images || [editingArticle.image_url]).map((img, idx) => (
                  <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-border/60 group bg-black/40">
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                    {idx === 0 && (
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-primary text-primary-foreground text-[9px] font-bold">
                        Cover
                      </span>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                      {idx !== 0 && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimary(idx)}
                          title="Set as Cover"
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
                  onClick={handleAddImgUrl}
                  className="px-3 py-1.5 rounded-lg glass text-xs font-semibold text-foreground"
                >
                  Add URL
                </button>
              </div>
            </div>

            {/* Video Integration (Direct File Upload & Social Media URL) */}
            <div className="p-4 rounded-2xl bg-muted/40 border border-border/50 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-primary" /> Video (Direct Upload or Social Media Embed)
                </label>
                <label className="cursor-pointer py-1 px-3 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 text-xs font-semibold flex items-center gap-1">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Video File (.mp4)</span>
                  <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
                </label>
              </div>

              <div className="grid sm:grid-cols-3 gap-2">
                <div className="sm:col-span-1">
                  <label className="text-[10px] text-muted-foreground">Video Source / Platform</label>
                  <select
                    value={editingArticle.video_type || 'youtube'}
                    onChange={e => setEditingArticle({ ...editingArticle, video_type: e.target.value as any })}
                    className="w-full px-2.5 py-2 rounded-xl bg-muted border border-border text-foreground text-xs"
                  >
                    <option value="youtube">YouTube Link</option>
                    <option value="facebook">Facebook Video</option>
                    <option value="tiktok">TikTok Video</option>
                    <option value="upload">Uploaded Video File</option>
                    <option value="other">Other / Direct MP4 URL</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] text-muted-foreground">Video URL / Social Link</label>
                  <input
                    type="text"
                    value={editingArticle.video_url || ''}
                    onChange={e => setEditingArticle({ ...editingArticle, video_url: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=... or https://facebook.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-xs"
                  />
                </div>
              </div>

              {editingArticle.video_url && (
                <div className="pt-2">
                  <div className="text-[10px] text-muted-foreground mb-1">Live Video Preview:</div>
                  <div className="max-w-md">
                    <VideoPlayer
                      url={editingArticle.video_url}
                      type={editingArticle.video_type}
                      title={editingArticle.title}
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground">Full Article Content (Markdown / Text)</label>
              <textarea
                rows={8}
                required
                value={editingArticle.content}
                onChange={e => setEditingArticle({ ...editingArticle, content: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm font-mono leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
              <button
                type="button"
                onClick={() => setEditingArticle(null)}
                className="px-4 py-2 rounded-xl glass text-xs text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-md hover:bg-primary/90"
              >
                Save Article
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
