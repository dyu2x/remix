import React, { useState } from 'react';
import { Shield, Lock, User, ArrowRight, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AdminUser, ZitadelConfig } from '../../types';

interface AdminLoginProps {
  users: AdminUser[];
  zitadel?: ZitadelConfig;
  onLoginSuccess: (user: AdminUser) => void;
  onResetPassword: (username: string, newPass: string) => boolean;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  users,
  zitadel,
  onLoginSuccess,
  onResetPassword
}) => {
  const [username, setUsername] = useState('super');
  const [password, setPassword] = useState('abc123!');
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [resetUser, setResetUser] = useState('');
  const [newPass, setNewPass] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const found = users.find(
      u => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password
    );

    if (found) {
      onLoginSuccess(found);
    } else {
      setError('Invalid username or password. Check credentials and try again.');
    }
  };

  const handleZitadelLogin = () => {
    if (!zitadel?.issuer_url) {
      setError('Zitadel OIDC issuer URL is not configured yet.');
      return;
    }
    const redirect = `${window.location.origin}/connect/admin`;
    const authUrl = `${zitadel.issuer_url}/oauth/v2/authorize?client_id=${encodeURIComponent(
      zitadel.client_id
    )}&response_type=code&scope=${encodeURIComponent(
      zitadel.scopes || 'openid profile email'
    )}&redirect_uri=${encodeURIComponent(redirect)}`;
    window.location.href = authUrl;
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = onResetPassword(resetUser.trim(), newPass);
    if (ok) {
      setResetSuccess(`Password for "${resetUser}" has been successfully updated!`);
      setTimeout(() => {
        setShowForgot(false);
        setResetSuccess('');
        setUsername(resetUser);
        setPassword(newPass);
      }, 1500);
    } else {
      setError(`User "${resetUser}" was not found.`);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md bg-card/80 backdrop-blur-xl border border-border/80 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-primary/20 text-primary mx-auto flex items-center justify-center ring-4 ring-primary/10">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-foreground">Staff & Admin Access</h1>
          <p className="text-xs text-muted-foreground">
            Sign in to Mesina Farms administrative portal
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-2xl bg-destructive/15 border border-destructive/30 text-destructive text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {resetSuccess && (
          <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{resetSuccess}</span>
          </div>
        )}

        {!showForgot ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Username</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-muted/60 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter username"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-muted-foreground">Password</label>
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="text-[11px] text-primary hover:underline font-medium"
                >
                  Forgot / Reset?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-muted/60 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25 flex items-center justify-center gap-2"
            >
              <span>Sign In to Admin</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {zitadel?.enabled && (
              <button
                type="button"
                onClick={handleZitadelLogin}
                className="w-full py-3 rounded-2xl glass font-semibold text-xs text-foreground hover:bg-muted transition-all flex items-center justify-center gap-2 border border-border"
              >
                <KeyRound className="w-4 h-4 text-primary" />
                <span>Sign in with Self-Hosted Zitadel SSO</span>
              </button>
            )}

            <div className="p-3 rounded-2xl bg-muted/30 border border-border/40 text-[11px] text-muted-foreground space-y-1">
              <div className="font-semibold text-foreground">Pre-configured Accounts:</div>
              <div>• Super Admin: <code className="text-primary font-bold">super</code> / <code className="text-primary font-bold">abc123!</code></div>
              <div>• Moderator: <code className="text-primary font-bold">moderator</code> / <code className="text-primary font-bold">modpass123!</code></div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleResetSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Username to Reset</label>
              <input
                type="text"
                required
                value={resetUser}
                onChange={e => setResetUser(e.target.value)}
                placeholder="e.g. super or moderator"
                className="w-full px-4 py-3 rounded-2xl bg-muted/60 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">New Password</label>
              <input
                type="password"
                required
                value={newPass}
                onChange={e => setNewPass(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-4 py-3 rounded-2xl bg-muted/60 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-all shadow-md"
            >
              Set New Password
            </button>
            <button
              type="button"
              onClick={() => setShowForgot(false)}
              className="w-full py-2.5 rounded-xl glass text-xs text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
