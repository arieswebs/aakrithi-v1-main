import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';
import { useToast } from '../components/Toast';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { addToast, ToastContainer } = useToast();

  // Form state
  const [form, setForm] = useState({
    name: '', price: '', mrp: '', category: '', badge: '',
    image: '', description: '', slug: '', sizes: '',
    is_wholesale: false,
  });

  useEffect(() => { fetchProducts(); }, [page, search]);

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams({ page, limit: 15, search });
      const res = await fetch(`/api/admin/products?${params}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditProduct(null);
    setForm({ name: '', price: '', mrp: '', category: '', badge: '', image: '', description: '', slug: '', sizes: '', is_wholesale: false });
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditProduct(product);
    setForm({
      name: product.name || '',
      price: product.price || '',
      mrp: product.mrp || '',
      category: product.category || '',
      badge: product.badge || '',
      image: product.image || '',
      description: product.description || '',
      slug: product.slug || '',
      sizes: Array.isArray(product.sizes) ? JSON.stringify(product.sizes) : (product.sizes || ''),
      is_wholesale: product.is_wholesale || false,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price) || 0,
        mrp: form.mrp ? parseFloat(form.mrp) : null,
        sizes: form.sizes ? (typeof form.sizes === 'string' ? (() => { try { return JSON.parse(form.sizes); } catch { return null; } })() : form.sizes) : null,
      };

      const url = editProduct
        ? `/api/admin/products/${editProduct.id}`
        : '/api/admin/products';
      const method = editProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        addToast(editProduct ? 'Product updated!' : 'Product created!', 'success');
        setShowModal(false);
        fetchProducts();
      } else {
        addToast(data.message || 'Failed to save', 'error');
      }
    } catch (err) {
      addToast('Error saving product', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        addToast('Product deleted', 'success');
        fetchProducts();
      } else {
        addToast(data.message || 'Delete failed', 'error');
      }
    } catch {
      addToast('Error deleting product', 'error');
    }
  };

  const formatCurrency = (val) => '₹' + Number(val || 0).toLocaleString('en-IN');

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner spinner-lg" />
        <span>Loading products…</span>
      </div>
    );
  }

  return (
    <div className="animate-in">
      <ToastContainer />

      <div className="page-header">
        <div>
          <h1>Products</h1>
          <p className="subtitle">Manage your product catalog</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Table */}
      <div className="table-container">
        <div className="table-header">
          <h3>{products.length} Products</h3>
          <div className="search-input-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search products…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>MRP</th>
              <th>Category</th>
              <th>Wholesale</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-state"><p>No products found</p></td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="product-info-cell">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="product-thumb"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <div>
                        <div className="product-name">{p.name}</div>
                        <div className="product-category">{p.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="font-semibold">{formatCurrency(p.price)}</td>
                  <td className="text-muted">{p.mrp ? formatCurrency(p.mrp) : '—'}</td>
                  <td><span className="badge badge-neutral">{p.category}</span></td>
                  <td><StatusBadge status={p.is_wholesale ? 'active' : 'inactive'} /></td>
                  <td>
                    <div className="flex gap-xs">
                      <button className="btn-icon" onClick={() => openEdit(p)} title="Edit">
                        <Edit size={15} />
                      </button>
                      <button className="btn-icon" onClick={() => handleDelete(p.id)} title="Delete"
                        style={{ color: 'var(--danger)' }}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="table-footer">
          <span>Page {page} of {totalPages}</span>
          <div className="pagination">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)}>←</button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const p = i + 1;
              return (
                <button key={p} className={page === p ? 'active' : ''} onClick={() => setPage(p)}>
                  {p}
                </button>
              );
            })}
            <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>→</button>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editProduct ? 'Edit Product' : 'Create Product'}
        size="lg"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>
              {editProduct ? 'Update' : 'Create'}
            </button>
          </>
        }
      >
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Product Name</label>
            <input className="form-input" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Product name" />
          </div>
          <div className="form-group">
            <label className="form-label">Slug</label>
            <input className="form-input" value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="product-slug" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Price (₹)</label>
            <input className="form-input" type="number" value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="999" />
          </div>
          <div className="form-group">
            <label className="form-label">MRP (₹)</label>
            <input className="form-input" type="number" value={form.mrp}
              onChange={(e) => setForm({ ...form, mrp: e.target.value })} placeholder="1499" />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <input className="form-input" value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category name" />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Image URL</label>
          <input className="form-input" value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Badge</label>
            <input className="form-input" value={form.badge}
              onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="New, Sale, etc." />
          </div>
          <div className="form-group">
            <label className="form-label">Sizes (JSON array)</label>
            <input className="form-input" value={form.sizes}
              onChange={(e) => setForm({ ...form, sizes: e.target.value })} placeholder='["S","M","L","XL"]' />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-textarea" value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Product description…" />
        </div>

        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.is_wholesale}
              onChange={(e) => setForm({ ...form, is_wholesale: e.target.checked })} />
            <span className="text-sm">Wholesale product</span>
          </label>
        </div>
      </Modal>
    </div>
  );
}
