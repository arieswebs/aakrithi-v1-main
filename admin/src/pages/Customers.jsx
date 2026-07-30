import React, { useState, useEffect } from 'react';
import { Search, Mail, Phone } from 'lucide-react';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => { fetchCustomers(); }, [page, search]);

  const fetchCustomers = async () => {
    try {
      const params = new URLSearchParams({ page, limit: 20, search });
      const res = await fetch(`/api/admin/customers?${params}`);
      const data = await res.json();
      if (data.success) {
        setCustomers(data.customers);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner spinner-lg" />
        <span>Loading customers…</span>
      </div>
    );
  }

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1>Customers</h1>
          <p className="subtitle">View registered users</p>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h3>{customers.length} Customers</h3>
          <div className="search-input-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Joined</th>
              <th>Admin</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty-state"><p>No customers found</p></td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.id}>
                  <td className="font-semibold">{c.name}</td>
                  <td>
                    <div className="flex items-center gap-xs text-sm">
                      <Mail size={13} className="text-muted" /> {c.email}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-xs text-sm">
                      <Phone size={13} className="text-muted" /> {c.phone || '—'}
                    </div>
                  </td>
                  <td className="text-sm">{formatDate(c.created_at)}</td>
                  <td>
                    {c.is_admin ? (
                      <span className="badge badge-info">Admin</span>
                    ) : (
                      <span className="badge badge-neutral">User</span>
                    )}
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
