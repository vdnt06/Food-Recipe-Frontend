import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Settings.css';

/* ── small reusable toggle ── */
function Toggle({ checked, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`settings-toggle ${checked ? 'settings-toggle--on' : ''}`}
    >
      <span className="settings-toggle-knob" />
    </button>
  );
}

/* ── section wrapper ── */
function SettingsCard({ icon, title, subtitle, children }) {
  return (
    <div className="settings-card">
      <div className="settings-card-header">
        <span className="settings-card-icon">{icon}</span>
        <div>
          <h3 className="settings-card-title">{title}</h3>
          {subtitle && <p className="settings-card-subtitle">{subtitle}</p>}
        </div>
      </div>
      <div className="settings-card-body">{children}</div>
    </div>
  );
}

export default function Settings() {
  const { user, token, logout } = useAuth();
  console.log("AUTH DEBUG:", { user, token, userId: user?.id });
  const navigate = useNavigate();

  /* ── password state ── */
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState(null); // { type: 'success'|'error', text }

  /* ── notifications state ── */
  const [notifs, setNotifs] = useState({
    weeklyDigest: true,
    newFollower: true,
    recipeComment: true,
    recipeLike: false,
    newsletter: false,
  });
  const [notifMsg, setNotifMsg] = useState(null);

  /* ── privacy state ── */
  const [privacy, setPrivacy] = useState({
    publicProfile: true,
    showEmail: false,
    showBookmarks: false,
  });
  const [privacyMsg, setPrivacyMsg] = useState(null);

  /* ── delete account state ── */
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);

  /* ── helpers ── */
  const showMsg = (setter, type, text, ms = 3500) => {
    setter({ type, text });
    setTimeout(() => setter(null), ms);
  };

  /* ── handlers ── */
  const handlePasswordSave = async () => {
    if (!pwForm.current || !pwForm.next || !pwForm.confirm) {
      return showMsg(setPwMsg, 'error', 'Please fill in all fields.');
    }
    if (pwForm.next.length < 6) {
      return showMsg(setPwMsg, 'error', 'New password must be at least 6 characters.');
    }
    if (pwForm.next !== pwForm.confirm) {
      return showMsg(setPwMsg, 'error', 'Passwords do not match.');
    }
    setPwLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/users/${user?.id}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.next }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed to update password.');
      }
      setPwForm({ current: '', next: '', confirm: '' });
      showMsg(setPwMsg, 'success', 'Password updated successfully!');
    } catch (e) {
      showMsg(setPwMsg, 'error', e.message);
    } finally {
      setPwLoading(false);
    }
  };

  const handleNotifSave = () => {
    // Persist to backend when you build that endpoint
    showMsg(setNotifMsg, 'success', 'Notification preferences saved!');
  };

  const handlePrivacySave = () => {
    showMsg(setPrivacyMsg, 'success', 'Privacy settings saved!');
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== user?.username) {
      return showMsg(() => {}, 'error', 'Username does not match.');
    }
    setDeleteLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/users/${user?.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete account.');
      logout();
      navigate('/');
    } catch (e) {
      setDeleteLoading(false);
      alert(e.message);
    }
  };

  /* ── nav items ── */
  const NAV = [
    { id: 'password',      icon: '🔒', label: 'Password' },
    { id: 'notifications', icon: '🔔', label: 'Notifications' },
    { id: 'privacy',       icon: '🛡️', label: 'Privacy' },
    { id: 'danger',        icon: '⚠️', label: 'Danger Zone' },
  ];

  const scrollTo = (id) => {
    document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="settings-page">

      {/* ── Sidebar nav ── */}
      <aside className="settings-sidebar">
        <div className="settings-sidebar-inner">
          <Link to="/" className="settings-back-btn">← Back to Profile</Link>
          <p className="settings-sidebar-heading">Settings</p>
          {NAV.map((n) => (
            <button key={n.id} className="settings-nav-item" onClick={() => scrollTo(n.id)}>
              <span>{n.icon}</span>
              <span>{n.label}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="settings-main">
        <div className="settings-page-header">
          <h1 className="settings-page-title">⚙️ Settings</h1>
          <p className="settings-page-sub">Manage your account preferences</p>
        </div>

        {/* ── Password ── */}
        <div id="section-password">
          <SettingsCard icon="🔒" title="Change Password" subtitle="Use a strong password with at least 6 characters">
            {pwMsg && <div className={`settings-msg settings-msg--${pwMsg.type}`}>{pwMsg.text}</div>}
            <div className="settings-field">
              <label className="settings-label">Current Password</label>
              <input
                className="settings-input"
                type="password"
                placeholder="Enter current password"
                value={pwForm.current}
                onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })}
              />
            </div>
            <div className="settings-field-row">
              <div className="settings-field">
                <label className="settings-label">New Password</label>
                <input
                  className="settings-input"
                  type="password"
                  placeholder="New password"
                  value={pwForm.next}
                  onChange={(e) => setPwForm({ ...pwForm, next: e.target.value })}
                />
              </div>
              <div className="settings-field">
                <label className="settings-label">Confirm New Password</label>
                <input
                  className="settings-input"
                  type="password"
                  placeholder="Confirm new password"
                  value={pwForm.confirm}
                  onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
                />
              </div>
            </div>

            {/* Password strength indicator */}
            {pwForm.next && (
              <div className="settings-strength">
                {['Weak', 'Fair', 'Good', 'Strong'].map((label, i) => (
                  <div
                    key={i}
                    className={`settings-strength-bar ${
                      pwForm.next.length > i * 3 + 2 ? `settings-strength-bar--${label.toLowerCase()}` : ''
                    }`}
                  />
                ))}
                <span className="settings-strength-label">
                  {pwForm.next.length < 6 ? 'Too short' : pwForm.next.length < 10 ? 'Fair' : pwForm.next.length < 14 ? 'Good' : 'Strong'}
                </span>
              </div>
            )}

            <button className="settings-save-btn" onClick={handlePasswordSave} disabled={pwLoading}>
              {pwLoading ? 'Updating…' : '🔒 Update Password'}
            </button>
          </SettingsCard>
        </div>

        {/* ── Notifications ── */}
        <div id="section-notifications">
          <SettingsCard icon="🔔" title="Notification Preferences" subtitle="Choose what updates you want to receive">
            {notifMsg && <div className={`settings-msg settings-msg--${notifMsg.type}`}>{notifMsg.text}</div>}

            {[
              { key: 'weeklyDigest',  label: 'Weekly Recipe Digest',    desc: 'A curated list of top recipes every week' },
              { key: 'newFollower',   label: 'New Follower',             desc: 'When someone starts following you' },
              { key: 'recipeComment', label: 'Comments on My Recipes',   desc: 'When someone comments on your recipe' },
              { key: 'recipeLike',    label: 'Likes on My Recipes',      desc: 'When someone likes your recipe' },
              { key: 'newsletter',    label: 'RecipeHub Newsletter',     desc: 'Product updates and cooking tips' },
            ].map((item) => (
              <div key={item.key} className="settings-toggle-row">
                <div>
                  <p className="settings-toggle-label">{item.label}</p>
                  <p className="settings-toggle-desc">{item.desc}</p>
                </div>
                <Toggle
                  checked={notifs[item.key]}
                  onChange={(val) => setNotifs({ ...notifs, [item.key]: val })}
                />
              </div>
            ))}

            <button className="settings-save-btn" onClick={handleNotifSave}>
              🔔 Save Preferences
            </button>
          </SettingsCard>
        </div>

        {/* ── Privacy ── */}
        <div id="section-privacy">
          <SettingsCard icon="🛡️" title="Privacy & Security" subtitle="Control who can see your information">
            {privacyMsg && <div className={`settings-msg settings-msg--${privacyMsg.type}`}>{privacyMsg.text}</div>}

            {[
              { key: 'publicProfile',  label: 'Public Profile',       desc: 'Anyone can view your profile and recipes' },
              { key: 'showEmail',      label: 'Show Email Address',    desc: 'Display your email on your public profile' },
              { key: 'showBookmarks',  label: 'Show Bookmarks',        desc: 'Let others see your saved recipes' },
            ].map((item) => (
              <div key={item.key} className="settings-toggle-row">
                <div>
                  <p className="settings-toggle-label">{item.label}</p>
                  <p className="settings-toggle-desc">{item.desc}</p>
                </div>
                <Toggle
                  checked={privacy[item.key]}
                  onChange={(val) => setPrivacy({ ...privacy, [item.key]: val })}
                />
              </div>
            ))}

            <button className="settings-save-btn" onClick={handlePrivacySave}>
              🛡️ Save Privacy Settings
            </button>
          </SettingsCard>
        </div>

        {/* ── Danger Zone ── */}
        <div id="section-danger">
          <SettingsCard icon="⚠️" title="Danger Zone" subtitle="These actions are permanent and cannot be undone">

            {!showDeleteWarning ? (
              <div className="settings-danger-row">
                <div>
                  <p className="settings-danger-title">Delete Account</p>
                  <p className="settings-danger-desc">
                    Permanently delete your account, all your recipes, bookmarks, and data.
                  </p>
                </div>
                <button
                  className="settings-delete-trigger-btn"
                  onClick={() => setShowDeleteWarning(true)}
                >
                  Delete Account
                </button>
              </div>
            ) : (
              <div className="settings-delete-confirm-box">
                <p className="settings-delete-warning">
                  ⚠️ This will permanently delete your account and all associated data. Type your username <strong>{user?.username}</strong> to confirm.
                </p>
                <input
                  className="settings-input settings-input--danger"
                  placeholder={`Type "${user?.username}" to confirm`}
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                />
                <div className="settings-delete-actions">
                  <button
                    className="settings-cancel-delete-btn"
                    onClick={() => { setShowDeleteWarning(false); setDeleteConfirm(''); }}
                  >
                    Cancel
                  </button>
                  <button
                    className="settings-confirm-delete-btn"
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirm !== user?.username || deleteLoading}
                  >
                    {deleteLoading ? 'Deleting…' : '🗑️ Permanently Delete'}
                  </button>
                </div>
              </div>
            )}
          </SettingsCard>
        </div>

      </main>
    </div>
  );
}