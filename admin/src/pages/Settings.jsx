import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { useToast } from '../components/Toast';

export default function Settings() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { addToast, ToastContainer } = useToast();

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data.success) {
        const settingsMap = {};
        data.settings.forEach(s => { settingsMap[s.key] = s.value; });
        setSettings(settingsMap);
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });
      const data = await res.json();
      if (data.success) {
        addToast('Settings saved successfully', 'success');
      } else {
        addToast('Failed to save settings', 'error');
      }
    } catch {
      addToast('Error saving settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner spinner-lg" />
        <span>Loading settings…</span>
      </div>
    );
  }

  return (
    <div className="animate-in">
      <ToastContainer />
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p className="subtitle">Global store configuration</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? <span className="spinner" /> : <Save size={18} />} Save Settings
        </button>
      </div>

      <div className="glass-card" style={{ maxWidth: 800 }}>
        <h3 className="mb-md">Store Information</h3>
        <div className="form-group">
          <label className="form-label">Store Name</label>
          <input className="form-input" value={settings['store_name'] || ''}
            onChange={(e) => handleChange('store_name', e.target.value)} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Contact Email</label>
            <input className="form-input" type="email" value={settings['contact_email'] || ''}
              onChange={(e) => handleChange('contact_email', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Contact Phone</label>
            <input className="form-input" value={settings['contact_phone'] || ''}
              onChange={(e) => handleChange('contact_phone', e.target.value)} />
          </div>
        </div>

        <h3 className="mb-md mt-xl">Shipping & Fees</h3>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Free Shipping Threshold (₹)</label>
            <input className="form-input" type="number" value={settings['free_shipping_threshold'] || ''}
              onChange={(e) => handleChange('free_shipping_threshold', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Standard Shipping Rate (₹)</label>
            <input className="form-input" type="number" value={settings['shipping_rate'] || ''}
              onChange={(e) => handleChange('shipping_rate', e.target.value)} />
          </div>
        </div>

        <h3 className="mb-md mt-xl">Social Links</h3>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Instagram URL</label>
            <input className="form-input" value={settings['social_instagram'] || ''}
              onChange={(e) => handleChange('social_instagram', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Facebook URL</label>
            <input className="form-input" value={settings['social_facebook'] || ''}
              onChange={(e) => handleChange('social_facebook', e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  );
}
