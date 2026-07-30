import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, FolderOpen, Layers } from 'lucide-react';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';
import { useToast } from '../components/Toast';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('categories');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const { addToast, ToastContainer } = useToast();

  const [form, setForm] = useState({ name: '', slug: '', description: '', image: '', is_active: true });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [catRes, colRes] = await Promise.all([
        fetch('/api/admin/categories'),
        fetch('/api/admin/collections'),
      ]);
      const catData = await catRes.json();
      const colData = await colRes.json();
      if (catData.success) setCategories(catData.categories);
      if (colData.success) setCollections(colData.collections);
    } catch (err) {
      console.error('Failed to fetch:', err);
    } finally {
      setLoading(false);
    }
  };

  const items = tab === 'categories' ? categories : collections;
  const endpoint = tab === 'categories' ? 'categories' : 'collections';

  const openCreate = () => {
    setEditItem(null);
    setForm({ name: '', slug: '', description: '', image: '', is_active: true });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      name: item.name || '',
      slug: item.slug || '',
      description: item.description || '',
      image: item.image || '',
      is_active: item.is_active !== false,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      const url = editItem
        ? `/api/admin/${endpoint}/${editItem.id}`
        : `/api/admin/${endpoint}`;
      const method = editItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.success) {
        addToast(`${tab === 'categories' ? 'Category' : 'Collection'} saved!`, 'success');
        setShowModal(false);
        fetchData();
      } else {
        addToast(data.message || 'Save failed', 'error');
      }
    } catch {
      addToast('Error saving', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return;
    try {
      const res = await fetch(`/api/admin/${endpoint}/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        addToast('Deleted!', 'success');
        fetchData();
      }
    } catch {
      addToast('Delete failed', 'error');
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner spinner-lg" />
        <span>Loading…</span>
      </div>
    );
  }

  return (
    <div className="animate-in">
      <ToastContainer />

      <div className="page-header">
        <div>
          <h1>Categories & Collections</h1>
          <p className="subtitle">Organize your products</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={18} /> Add {tab === 'categories' ? 'Category' : 'Collection'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-sm mb-lg">
        <button
          className={`btn ${tab === 'categories' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setTab('categories')}
        >
          <FolderOpen size={16} /> Categories
        </button>
        <button
          className={`btn ${tab === 'collections' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setTab('collections')}
        >
          <Layers size={16} /> Collections
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={4} className="empty-state"><p>No {tab} found</p></td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id}>
                  <td className="font-semibold">{item.name}</td>
                  <td className="text-muted text-sm">{item.slug}</td>
                  <td><StatusBadge status={item.is_active} /></td>
                  <td>
                    <div className="flex gap-xs">
                      <button className="btn-icon" onClick={() => openEdit(item)}><Edit size={15} /></button>
                      <button className="btn-icon" onClick={() => handleDelete(item.id)} style={{ color: 'var(--danger)' }}>
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
        title={editItem ? `Edit ${tab === 'categories' ? 'Category' : 'Collection'}` : `Create ${tab === 'categories' ? 'Category' : 'Collection'}`}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>Save</button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Name</label>
          <input className="form-input" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Category name" />
        </div>
        <div className="form-group">
          <label className="form-label">Slug</label>
          <input className="form-input" value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="category-slug" />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-textarea" value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional description…" />
        </div>
        <div className="form-group">
          <label className="form-label">Image URL</label>
          <input className="form-input" value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
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
