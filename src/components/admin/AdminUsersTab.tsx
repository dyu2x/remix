import React, { useState } from 'react';
import { Shield, Plus, Trash2, KeyRound, Check, Edit2, Users, AlertCircle } from 'lucide-react';
import { AdminUser, PermissionModule } from '../../types';

interface AdminUsersTabProps {
  users: AdminUser[];
  currentUser: AdminUser;
  onAddUser: (user: AdminUser) => void;
  onUpdateUser: (user: AdminUser) => void;
  onDeleteUser: (id: string) => void;
  onResetPassword: (username: string, newPass: string) => boolean;
}

const ALL_MODULES: { id: PermissionModule; label: string; desc: string }[] = [
  { id: 'hero', label: 'Hero Section', desc: 'Content and multiple slideshow images' },
  { id: 'about', label: 'About Us', desc: 'About bio, content and gallery photos' },
  { id: 'why_choose_us', label: 'Why Choose Us', desc: 'Key advantages, icons and badges' },
  { id: 'catalog', label: 'Fish & Catalog', desc: 'Add fish types, tiers, pricing, and multi-images' },
  { id: 'articles', label: 'Blogs & Articles', desc: 'Create blogs, status, multi-images and videos' },
  { id: 'inquiries', label: 'Order Inquiries', desc: 'View inquiries, update contact logs & notes' },
  { id: 'location', label: 'Location & Map', desc: 'Operating hours, coordinates & map links' },
  { id: 'settings', label: 'Branding & Details', desc: 'Company name, logo, contact & footer' },
  { id: 'smtp_zitadel', label: 'SMTP & Zitadel OIDC', desc: 'Email dispatch & SSO settings' },
  { id: 'visitors', label: 'Visitor Analytics', desc: 'Unique visitor counter & location breakdown' },
  { id: 'chat_support', label: 'Live Chat Widget', desc: 'Enable/disable Rocket.Chat widget & agent status' },
  { id: 'tank_calculator', label: 'Tank Ratio Calculator', desc: 'Calibrate fish/tank ratios, densities & feeding rates' }
];

export const AdminUsersTab: React.FC<AdminUsersTabProps> = ({
  users,
  currentUser,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  onResetPassword
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [resetModalUser, setResetModalUser] = useState<AdminUser | null>(null);
  const [newPassInput, setNewPassInput] = useState('');
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  const [formName, setFormName] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState<'super_admin' | 'moderator'>('moderator');
  const [formPermissions, setFormPermissions] = useState<PermissionModule[]>([
    'catalog',
    'articles',
    'inquiries'
  ]);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormName('');
    setFormUsername('');
    setFormPassword('');
    setFormRole('moderator');
    setFormPermissions(['catalog', 'articles', 'inquiries']);
    setModalOpen(true);
  };

  const handleOpenEdit = (u: AdminUser) => {
    setEditingUser(u);
    setFormName(u.name);
    setFormUsername(u.username);
    setFormPassword(u.password);
    setFormRole(u.role);
    setFormPermissions(u.permissions);
    setModalOpen(true);
  };

  const togglePermission = (mod: PermissionModule) => {
    if (formPermissions.includes(mod)) {
      setFormPermissions(formPermissions.filter(p => p !== mod));
    } else {
      setFormPermissions([...formPermissions, mod]);
    }
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      const updated: AdminUser = {
        ...editingUser,
        name: formName,
        username: formUsername.trim().toLowerCase(),
        password: formPassword,
        role: formRole,
        permissions: formRole === 'super_admin' ? ALL_MODULES.map(m => m.id) : formPermissions
      };
      onUpdateUser(updated);
      showToast('User updated successfully');
    } else {
      const newUser: AdminUser = {
        id: `user-${Date.now()}`,
        name: formName,
        username: formUsername.trim().toLowerCase(),
        password: formPassword || 'temp123!',
        role: formRole,
        permissions: formRole === 'super_admin' ? ALL_MODULES.map(m => m.id) : formPermissions,
        created_at: new Date().toISOString()
      };
      onAddUser(newUser);
      showToast('New user created successfully');
    }
    setModalOpen(false);
  };

  const handleDoResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (resetModalUser && newPassInput) {
      onResetPassword(resetModalUser.username, newPassInput);
      showToast(`Password updated for ${resetModalUser.name}`);
      setResetModalUser(null);
      setNewPassInput('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" /> User Roles & Access Control
          </h2>
          <p className="text-xs text-muted-foreground">
            Manage super administrators and company website moderators with granular module permissions.
          </p>
        </div>

        {currentUser.role === 'super_admin' && (
          <button
            onClick={handleOpenAdd}
            className="py-2.5 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-xs flex items-center gap-2 shadow-md hover:bg-primary/90 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Moderator / Admin</span>
          </button>
        )}
      </div>

      {toast && (
        <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          ✓ {toast}
        </div>
      )}

      {/* Users List */}
      <div className="grid md:grid-cols-2 gap-4">
        {users.map(u => (
          <div key={u.id} className="glass-card rounded-2xl p-5 border border-border/70 space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-foreground text-sm">{u.name}</h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      u.role === 'super_admin'
                        ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                        : 'bg-primary/20 text-primary border border-primary/30'
                    }`}
                  >
                    {u.role === 'super_admin' ? 'Super Admin' : 'Website Moderator'}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground font-mono">@{u.username}</div>
              </div>

              {currentUser.role === 'super_admin' && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setResetModalUser(u);
                      setNewPassInput('');
                    }}
                    title="Reset Password"
                    className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
                  >
                    <KeyRound className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(u)}
                    title="Edit Permissions"
                    className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {u.id !== currentUser.id && (
                    <button
                      onClick={() => {
                        if (confirm(`Delete user ${u.name}?`)) {
                          onDeleteUser(u.id);
                          showToast('User removed');
                        }
                      }}
                      title="Delete User"
                      className="p-1.5 rounded-lg hover:bg-destructive/20 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>

            <div>
              <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Allowed Website Sections ({u.role === 'super_admin' ? 'All Access' : u.permissions.length}):
              </div>
              <div className="flex flex-wrap gap-1.5">
                {u.role === 'super_admin' ? (
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                    Full Unrestricted Administrative Privileges
                  </span>
                ) : (
                  u.permissions.map(perm => (
                    <span
                      key={perm}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-muted text-foreground border border-border/50"
                    >
                      {ALL_MODULES.find(m => m.id === perm)?.label || perm}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 max-h-[90vh] overflow-y-auto animate-scale-in">
            <h3 className="text-lg font-bold text-foreground">
              {editingUser ? 'Edit User & Designate Permissions' : 'Create New User Account'}
            </h3>

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Full Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="e.g. Maria Clara"
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Username</label>
                  <input
                    type="text"
                    required
                    value={formUsername}
                    onChange={e => setFormUsername(e.target.value)}
                    placeholder="e.g. mclara"
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Password</label>
                  <input
                    type="password"
                    required
                    value={formPassword}
                    onChange={e => setFormPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Role</label>
                <select
                  value={formRole}
                  onChange={e => setFormRole(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm"
                >
                  <option value="moderator">Company Website Moderator</option>
                  <option value="super_admin">Super Administrator</option>
                </select>
              </div>

              {formRole === 'moderator' && (
                <div className="space-y-2 pt-2 border-t border-border/40">
                  <div className="text-xs font-bold text-foreground">
                    Designate Which Part of Website this Moderator Can Modify:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {ALL_MODULES.map(mod => {
                      const checked = formPermissions.includes(mod.id);
                      return (
                        <button
                          key={mod.id}
                          type="button"
                          onClick={() => togglePermission(mod.id)}
                          className={`p-2.5 rounded-xl border text-left flex items-start gap-2 transition-all ${
                            checked
                              ? 'bg-primary/10 border-primary text-foreground font-semibold'
                              : 'bg-muted/40 border-border/50 text-muted-foreground hover:bg-muted'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 ${
                              checked ? 'bg-primary text-primary-foreground' : 'border border-border'
                            }`}
                          >
                            {checked && <Check className="w-3 h-3" />}
                          </div>
                          <div>
                            <div className="text-xs">{mod.label}</div>
                            <div className="text-[10px] opacity-75">{mod.desc}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl glass text-xs text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 shadow-md"
                >
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {resetModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 max-w-sm w-full space-y-4 animate-scale-in">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-primary" /> Reset Password for {resetModalUser.name}
            </h3>
            <form onSubmit={handleDoResetPassword} className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassInput}
                  onChange={e => setNewPassInput(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setResetModalUser(null)}
                  className="px-4 py-2 rounded-xl glass text-xs text-muted-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs"
                >
                  Save Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
