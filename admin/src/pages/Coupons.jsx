import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';
import { useToast } from '../components/Toast';

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCoupon, setEditCoupon] = useState(null);
  const { addToast, ToastContainer } = useToast();

  const [form, setForm] = useState({
    code: '', type: 'percentage', value: '', min_order_amount: '',
    usage_limit: '', expires_at: '', is_active: true,
  });

  useEffect(() => { fetchCoupons(); }, []);

  const fetchCoupons = async () => {
    try {
      const res = await fetch('/api/admin/coupons');
      const data = await res.json();
      if (data.success) setCoupons(data.coupons);
    } catch (err) {
      console.error('Failed to fetch coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditCoupon(null);
    setForm({
      code: '', type: 'percentage', value: '', min_order_amount: '0',
      usage_limit: '', expires_at: '', is_active: true,
    });
    setShowModal(true);
  };

  const openEdit = (coupon) => {
    setEditCoupon(coupon);
    setForm({
      code: coupon.code || '',
      type: coupon.type || 'percentage',
      value: coupon.value || '',
      min_order_amount: coupon.min_order_amount || '0',
      usage_limit: coupon.usage_limit || '',
      expires_at: coupon.expires_at ? new Date(coupon.expires_at).toISOString().slice(0, 16) : '',
      is_active: coupon.is_active !== false,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...form,
        value: parseFloat(form.value) || 0,
        min_order_amount: parseFloat(form.min_order_amount) || 0,
        usage_limit: form.usage_limit ? parseInt(form.usage_limit) : null,
      };

      const url = editCoupon ? `/api/admin/coupons/${editCoupon.id}` : '/api/admin/coupons';
      const method = editCoupon ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        addToast(editCoupon ? 'Coupon updated!' : 'Coupon created!', 'success');
        setShowModal(false);
        fetchCoupons();
      } else {
        addToast(data.message || 'Failed to save', 'error');
      }
    } catch {
      addToast('Error saving coupon', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this coupon?')) return;
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        addToast('Coupon deleted', 'success');
        fetchCoupons();
      } else {
        addToast(data.message || 'Delete failed', 'error');
      }
    } catch {
      addToast('Error deleting', 'error');
    }
  };

  const formatCurrency = (val) => '₹' + Number(val || 0).toLocaleString('en-IN');
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN') : 'Never';

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner spinner-lg" />
        <span>Loading coupons…</span>
      </div>
    );
  }

  return (
    <div className="animate-in">
      <ToastContainer />
      <div className="page-header">
        <div>
          <h1>Coupons</h1>
          <p className="subtitle">Manage discount codes</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={18} /> Add Coupon
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Discount</th>
              <th>Usage</th>
              <th>Expires</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-state"><p>No coupons found</p></td>
              </tr>
            ) : (
              coupons.map((c) => (
                <tr key={c.id}>
                  <td className="font-bold" style={{ color: 'var(--accent-primary)' }}>{c.code}</td>
                  <td>
                    {c.type === 'percentage' ? `${c.value}% off` : `${formatCurrency(c.value)} off`}
                    <div className="text-xs text-muted">Min order: {formatCurrency(c.min_order_amount)}</div>
                  </td>
                  <td>
                    {c.used_count} / {c.usage_limit || '∞'}
                  </td>
                  <td className="text-sm">{formatDate(c.expires_at)}</td>
                  <td><StatusBadge status={c.is_active} /></td>
                  <td>
                    <div className="flex gap-xs">
                      <button className="btn-icon" onClick={() => openEdit(c)}><Edit size={15} /></button>
                      <button className="btn-icon" onClick={() => handleDelete(c.id)} style={{ color: 'var(--danger)' }}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editCoupon ? 'Edit Coupon' : 'Create Coupon'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>Save</button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Coupon Code</label>
          <input className="form-input" value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="SUMMER50" />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Type</label>
            <select className="form-select" value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (₹)</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Discount Value</label>
            <input className="form-input" type="number" value={form.value}
              onChange={(e) => setForm({ ...form, value: e.target.value })} placeholder={form.type === 'percentage' ? '10' : '500'} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Min Order Amount (₹)</label>
            <input className="form-input" type="number" value={form.min_order_amount}
              onChange={(e) => setForm({ ...form, min_order_amount: e.target.value })} placeholder="0" />
          </div>
          <div className="form-group">
            <label className="form-label">Usage Limit (Total)</label>
            <input className="form-input" type="number" value={form.usage_limit}
              onChange={(e) => setForm({ ...form, usage_limit: e.target.value })} placeholder="Leave empty for unlimited" />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Expiry Date</label>
          <input className="form-input" type="datetime-local" value={form.expires_at}
            onChange={(e) => setForm({ ...form, expires_at: e.target.value })} />
        </div>
        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
            <span className="text-sm">Active</span>
          </label>
        </div>
      </Modal>
    </div>
  );
}
