import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const pageTitles = {
  '/': 'Dashboard',
  '/products': 'Products',
  '/orders': 'Orders',
  '/customers': 'Customers',
  '/categories': 'Categories',
  '/coupons': 'Coupons',
  '/reviews': 'Reviews',
  '/settings': 'Settings',
};

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const { admin } = useAuth();
  const location = useLocation();

  const pageTitle = pageTitles[location.pathname] || 'Admin';

  return (
    <div className="admin-shell">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <main className={`admin-main ${collapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Header */}
        <header className="admin-header">
          <div className="flex items-center gap-md">
            <button
              className="btn-icon"
              onClick={() => setCollapsed(!collapsed)}
              style={{ display: 'none' }}
            >
              <Menu size={18} />
            </button>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{pageTitle}</h2>
            </div>
          </div>

          <div className="flex items-center gap-md">
            <button className="btn-icon">
              <Bell size={18} />
            </button>
            <div className="flex items-center gap-sm">
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--accent-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                }}
              >
                {admin?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <span className="text-sm font-medium">{admin?.name || 'Admin'}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="admin-content animate-in">
          {children}
        </div>
      </main>
    </div>
  );
}
