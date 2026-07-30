import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { useToast } from '../components/Toast';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { addToast, ToastContainer } = useToast();

  useEffect(() => { fetchReviews(); }, [page]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/admin/reviews?page=${page}&limit=20`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, is_approved) => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_approved }),
      });
      const data = await res.json();
      if (data.success) {
        addToast(`Review ${is_approved ? 'approved' : 'rejected'}`, 'success');
        fetchReviews();
      } else {
        addToast('Update failed', 'error');
      }
    } catch {
      addToast('Error updating review', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this review completely?')) return;
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        addToast('Review deleted', 'success');
        fetchReviews();
      }
    } catch {
      addToast('Delete failed', 'error');
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner spinner-lg" />
        <span>Loading reviews…</span>
      </div>
    );
  }

  return (
    <div className="animate-in">
      <ToastContainer />
      <div className="page-header">
        <div>
          <h1>Reviews</h1>
          <p className="subtitle">Moderate customer reviews</p>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Rating</th>
              <th>Product</th>
              <th>User</th>
              <th>Comment</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-state"><p>No reviews found</p></td>
              </tr>
            ) : (
              reviews.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div className="flex gap-xs" style={{ color: '#fbbf24' }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} style={{ opacity: i < r.rating ? 1 : 0.3 }}>★</span>
                      ))}
                    </div>
                  </td>
                  <td className="text-sm font-medium">{r.product_name}</td>
                  <td className="text-sm">{r.user_name}</td>
                  <td style={{ maxWidth: 300 }}>
                    <p className="text-sm text-muted" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {r.comment}
                    </p>
                  </td>
                  <td><StatusBadge status={r.is_approved ? 'approved' : 'rejected'} /></td>
                  <td>
                    <div className="flex gap-xs">
                      {!r.is_approved ? (
                        <button className="btn-icon" onClick={() => updateStatus(r.id, true)} title="Approve" style={{ color: 'var(--success)' }}>
                          <CheckCircle size={15} />
                        </button>
                      ) : (
                        <button className="btn-icon" onClick={() => updateStatus(r.id, false)} title="Reject" style={{ color: 'var(--warning)' }}>
                          <XCircle size={15} />
                        </button>
                      )}
                      <button className="btn-icon" onClick={() => handleDelete(r.id)} style={{ color: 'var(--danger)' }} title="Delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
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
    </div>
  );
}
