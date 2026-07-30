import React from 'react';

const statusConfig = {
  // Order statuses
  confirmed:    { className: 'badge-info',    label: 'Confirmed' },
  processing:   { className: 'badge-warning', label: 'Processing' },
  shipped:      { className: 'badge-info',    label: 'Shipped' },
  delivered:    { className: 'badge-success', label: 'Delivered' },
  cancelled:    { className: 'badge-danger',  label: 'Cancelled' },
  returned:     { className: 'badge-danger',  label: 'Returned' },

  // Payment statuses
  pending:      { className: 'badge-warning', label: 'Pending' },
  verified:     { className: 'badge-success', label: 'Verified' },
  failed:       { className: 'badge-danger',  label: 'Failed' },

  // Generic
  active:       { className: 'badge-success', label: 'Active' },
  inactive:     { className: 'badge-neutral', label: 'Inactive' },
  approved:     { className: 'badge-success', label: 'Approved' },
  rejected:     { className: 'badge-danger',  label: 'Rejected' },

  // Boolean-like
  true:         { className: 'badge-success', label: 'Active' },
  false:        { className: 'badge-neutral', label: 'Inactive' },
};

export default function StatusBadge({ status }) {
  const key = String(status).toLowerCase();
  const config = statusConfig[key] || { className: 'badge-neutral', label: status };

  return <span className={`badge ${config.className}`}>{config.label}</span>;
}
