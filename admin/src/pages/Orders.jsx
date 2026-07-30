import React, { useState, useEffect } from 'react';
import { Search, Eye, ChevronDown } from 'lucide-react';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';
import { useToast } from '../components/Toast';

const ORDER_STATUSES = ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { addToast, ToastContainer } = useToast();

  useEffect(() => { fetchOrders(); }, [page, search, statusFilter]);

  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams({ page, limit: 15, search });
      if (statusFilter !== 'all') params.set('status', statusFilter);
      const res = await fetch(`/api/admin/orders?${params}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        addToast(`Order status updated to ${newStatus}`, 'success');
        fetchOrders();
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      } else {
        addToast(data.message || 'Update failed', 'error');
      }
    } catch {
      addToast('Error updating status', 'error');
    }
  };

  const formatCurrency = (val) => '₹' + Number(val || 0).toLocaleString('en-IN');
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner spinner-lg" />
        <span>Loading orders…</span>
      </div>
    );
  }

  return (
    <div className="animate-in">
      <ToastContainer />

      <div className="page-header">
        <div>
          <h1>Orders</h1>
          <p className="subtitle">Track and manage customer orders</p>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <div className="flex items-center gap-md">
            <h3>{orders.length} Orders</h3>
            <select
              className="form-select"
              style={{ width: 'auto', padding: '6px 32px 6px 10px', fontSize: '0.8rem' }}
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            >
              <option value="all">All Statuses</option>
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="search-input-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search order number, customer…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="empty-state"><p>No orders found</p></td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  <td className="font-semibold" style={{ color: 'var(--accent-secondary)' }}>
                    {order.order_number}
                  </td>
                  <td>
                    <div>{order.customer_name}</div>
                    <div className="text-xs text-muted">{order.customer_email}</div>
                  </td>
                  <td className="text-sm">{formatDate(order.created_at)}</td>
                  <td className="font-semibold">{formatCurrency(order.total)}</td>
                  <td><StatusBadge status={order.payment_status} /></td>
                  <td>
                    <select
                      className="form-select"
                      style={{ width: 'auto', padding: '4px 28px 4px 8px', fontSize: '0.78rem', background: 'transparent' }}
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button className="btn-icon" onClick={() => setSelectedOrder(order)} title="View">
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="table-footer">
          <span>Page {page} of {totalPages}</span>
          <div className="pagination">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)}>←</button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
              <button key={i + 1} className={page === i + 1 ? 'active' : ''} onClick={() => setPage(i + 1)}>
                {i + 1}
              </button>
            ))}
            <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>→</button>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order ${selectedOrder?.order_number || ''}`}
        size="lg"
      >
        {selectedOrder && (
          <div>
            <div className="form-row mb-lg">
              <div>
                <div className="form-label">Customer</div>
                <div className="font-semibold">{selectedOrder.customer_name}</div>
                <div className="text-sm text-muted">{selectedOrder.customer_email}</div>
                <div className="text-sm text-muted">{selectedOrder.customer_phone}</div>
              </div>
              <div>
                <div className="form-label">Shipping Address</div>
                <div className="text-sm">{selectedOrder.shipping_address}</div>
                <div className="text-sm">{selectedOrder.city}, {selectedOrder.state} — {selectedOrder.pincode}</div>
              </div>
            </div>

            <div className="form-row mb-lg">
              <div>
                <div className="form-label">Payment</div>
                <div className="text-sm">{selectedOrder.payment_method}</div>
                <StatusBadge status={selectedOrder.payment_status} />
              </div>
              <div>
                <div className="form-label">Total</div>
                <div className="font-bold" style={{ fontSize: '1.2rem' }}>{formatCurrency(selectedOrder.total)}</div>
              </div>
            </div>

            <div className="form-label">Items</div>
            <table className="data-table" style={{ marginTop: 8 }}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Size</th>
                  <th>Qty</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {(Array.isArray(selectedOrder.items) ? selectedOrder.items : []).map((item, i) => (
                  <tr key={i}>
                    <td>
                      <div className="product-info-cell">
                        {item.image && <img src={item.image} alt={item.name} className="product-thumb" />}
                        <span>{item.name}</span>
                      </div>
                    </td>
                    <td>{item.size || '—'}</td>
                    <td>{item.quantity}</td>
                    <td>{formatCurrency(item.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal>
    </div>
  );
}
