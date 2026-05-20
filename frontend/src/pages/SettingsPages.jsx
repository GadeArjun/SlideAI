import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Lock, Bell, Palette, Loader2, Check } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useAuthStore } from '../store/authStore'
import { useUIStore } from '../store/uiStore'
import { authApi } from '../api/auth'
import { getInitials, generateAvatarColor, getErrorMessage } from '../lib/utils'
import { toast } from 'sonner'

export function ProfilePage() {
  const { user } = useAuth()
  const { updateUser } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: user?.name || '', bio: user?.bio || '' })

  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await authApi.updateProfile(form)
      updateUser(res.data.user)
      toast.success('Profile updated')
    } catch (e) {
      toast.error(getErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Profile</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-0.5">Manage your personal information</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card p-6 space-y-5">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white text-xl font-bold ${generateAvatarColor(user?.name || user?.username || '')}`}>
            {getInitials(user?.name || user?.username || 'U')}
          </div>
          <div>
            <p className="font-semibold text-[var(--text-primary)]">{user?.name || user?.username}</p>
            <p className="text-sm text-[var(--text-muted)]">@{user?.username}</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">{user?.email}</p>
          </div>
        </div>

        <div className="h-px bg-[var(--border)]" />

        <div className="grid gap-4">
          <div>
            <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">Display Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
              className="input-field"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm(f => ({ ...f, bio: e.target.value }))}
              className="input-field resize-none"
              rows={3}
              placeholder="Tell us about yourself…"
            />
          </div>
        </div>

        <button onClick={handleSave} disabled={loading} className="btn-primary">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          Save Changes
        </button>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
        <h2 className="font-semibold text-[var(--text-primary)] mb-4">Usage Stats</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Projects', value: user?.totalProjects || 0 },
            { label: 'Slides Generated', value: user?.totalSlidesGenerated || 0 },
            { label: 'Tokens Used', value: user?.totalTokensUsed || 0 },
          ].map(({ label, value }) => (
            <div key={label} className="text-center p-3 rounded-xl bg-[var(--bg-tertiary)]">
              <p className="text-xl font-bold text-[var(--text-primary)]">{value.toLocaleString()}</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export function SettingsPage() {
  const { theme, toggleTheme } = useUIStore()
  const { user } = useAuth()
  const { updateUser } = useAuthStore()
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' })
  const [pwLoading, setPwLoading] = useState(false)

  const handleChangePassword = async () => {
    if (!pwForm.currentPassword || !pwForm.newPassword) { toast.error('Fill both fields'); return }
    setPwLoading(true)
    try {
      await authApi.changePassword(pwForm)
      toast.success('Password changed')
      setPwForm({ currentPassword: '', newPassword: '' })
    } catch (e) {
      toast.error(getErrorMessage(e))
    } finally {
      setPwLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Settings</h1>
      </motion.div>

      {/* Appearance */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Palette className="w-4 h-4 text-[var(--text-muted)]" />
          <h2 className="font-semibold text-[var(--text-primary)]">Appearance</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">Theme</p>
            <p className="text-xs text-[var(--text-muted)]">Currently: {theme}</p>
          </div>
          <button onClick={toggleTheme} className="btn-secondary text-xs capitalize">
            Switch to {theme === 'light' ? 'Dark' : 'Light'}
          </button>
        </div>
      </motion.div>

      {/* Security */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Lock className="w-4 h-4 text-[var(--text-muted)]" />
          <h2 className="font-semibold text-[var(--text-primary)]">Security</h2>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">Current Password</label>
            <input
              type="password"
              value={pwForm.currentPassword}
              onChange={(e) => setPwForm(f => ({ ...f, currentPassword: e.target.value }))}
              className="input-field"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">New Password</label>
            <input
              type="password"
              value={pwForm.newPassword}
              onChange={(e) => setPwForm(f => ({ ...f, newPassword: e.target.value }))}
              className="input-field"
              placeholder="••••••••"
            />
          </div>
          <button onClick={handleChangePassword} disabled={pwLoading} className="btn-primary">
            {pwLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
            Update Password
          </button>
        </div>
      </motion.div>

      {/* Notifications coming soon */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card p-6">
        <div className="flex items-center gap-2 mb-1">
          <Bell className="w-4 h-4 text-[var(--text-muted)]" />
          <h2 className="font-semibold text-[var(--text-primary)]">Notifications</h2>
          <span className="ml-2 text-xs bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400 px-2 py-0.5 rounded-full font-semibold">Coming Soon</span>
        </div>
        <p className="text-sm text-[var(--text-muted)]">Email and push notification preferences will be available soon.</p>
      </motion.div>
    </div>
  )
}

export function AnalyticsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center py-24 space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-[var(--bg-tertiary)] flex items-center justify-center mx-auto">
          <span className="text-2xl">📊</span>
        </div>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Analytics</h1>
        <p className="text-[var(--text-secondary)]">Detailed analytics and insights coming soon.</p>
        <span className="inline-block text-xs bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400 px-3 py-1 rounded-full font-semibold">Coming Soon</span>
      </motion.div>
    </div>
  )
}

export function BillingPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center py-24 space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-[var(--bg-tertiary)] flex items-center justify-center mx-auto">
          <span className="text-2xl">💳</span>
        </div>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Billing</h1>
        <p className="text-[var(--text-secondary)]">Subscription management and billing coming soon.</p>
        <span className="inline-block text-xs bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400 px-3 py-1 rounded-full font-semibold">Coming Soon</span>
      </motion.div>
    </div>
  )
}
