@extends('layouts.admin')

@section('admin_title', 'Inquiries & Requests')

@section('admin_content')
<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
    <p style="opacity: 0.7;">Manage customer feedback, inquiries, and custom bulk requests.</p>
</div>

<div class="admin-table-container">
    <table class="admin-table">
        <thead>
            <tr>
                <th>Type</th>
                <th>Sender</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach($messages as $msg)
            <tr style="{{ !$msg->is_read ? 'background: rgba(197, 160, 89, 0.05);' : '' }}">
                <td>
                    <span class="admin-badge" style="background: {{ $msg->type === 'bulk_request' ? 'rgba(197, 160, 89, 0.2)' : 'rgba(255,255,255,0.05)' }}; color: {{ $msg->type === 'bulk_request' ? '#C5A059' : 'inherit' }};">
                        {{ ucfirst(str_replace('_', ' ', $msg->type)) }}
                    </span>
                </td>
                <td>
                    <div style="font-weight: 600;">{{ $msg->name }}</div>
                    <div style="font-size: 0.75rem; opacity: 0.7;">{{ $msg->email }}</div>
                </td>
                <td>{{ $msg->subject }}</td>
                <td style="max-width: 300px;">
                    <div style="font-size: 0.85rem; line-height: 1.4; opacity: 0.9;">
                        {{ Str::limit($msg->message, 100) }}
                    </div>
                </td>
                <td>{{ $msg->created_at->format('M d, H:i') }}</td>
                <td>
                    <span class="admin-badge {{ $msg->is_read ? 'badge-green' : '' }}" style="{{ !$msg->is_read ? 'background: #ff4d4f; color: white;' : '' }}">
                        {{ $msg->is_read ? 'Read' : 'New' }}
                    </span>
                </td>
                <td>
                    <div style="display: flex; gap: 0.5rem;">
                        <form action="{{ route('admin.messages.toggle-read', $msg->id) }}" method="POST">
                            @csrf
                            <button type="submit" class="admin-nav-link" style="margin: 0; padding: 5px; height: auto; background: rgba(255,255,255,0.05);" title="{{ $msg->is_read ? 'Mark as Unread' : 'Mark as Read' }}">
                                <i data-lucide="{{ $msg->is_read ? 'eye-off' : 'eye' }}" style="width: 16px;"></i>
                            </button>
                        </form>
                        <a href="mailto:{{ $msg->email }}?subject=Re: {{ $msg->subject }}" class="admin-nav-link" style="margin: 0; padding: 5px; height: auto; background: rgba(197, 160, 89, 0.1); color: #C5A059;" title="Reply">
                            <i data-lucide="reply" style="width: 16px;"></i>
                        </a>
                    </div>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
    <div style="padding: 1rem;">
        {{ $messages->links() }}
    </div>
</div>
@endsection
