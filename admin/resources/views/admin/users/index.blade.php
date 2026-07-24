@extends('layouts.admin')

@section('admin_title', 'User Management')

@section('admin_content')
<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
    <p style="opacity: 0.7;">View and manage your registered customers.</p>
</div>

<div class="admin-table-container">
    <table class="admin-table">
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Registered At</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach($users as $user)
            <tr>
                <td>#{{ $user->id }}</td>
                <td style="font-weight: 600;">{{ $user->name }}</td>
                <td>{{ $user->email }}</td>
                <td>
                    <span class="admin-badge {{ $user->is_admin ? 'badge-accent' : 'badge-green' }}" style="{{ $user->is_admin ? 'background: rgba(197, 160, 89, 0.1); color: #C5A059; border: 1px solid rgba(197, 160, 89, 0.2);' : '' }}">
                        {{ $user->is_admin ? 'Admin' : 'Customer' }}
                    </span>
                </td>
                <td>{{ $user->created_at->format('M d, Y') }}</td>
                <td>
                    <div style="display: flex; gap: 0.5rem; align-items: center;">
                        <a href="mailto:{{ $user->email }}" style="color: var(--color-accent); text-decoration: none;" title="Email User">
                            <i data-lucide="mail" style="width: 18px;"></i>
                        </a>
                        @if($user->id !== auth()->id())
                        <form id="delete-user-form-{{ $user->id }}" action="{{ route('admin.users.destroy', $user->id) }}" method="POST" style="display: none;">
                            @csrf
                            @method('DELETE')
                        </form>
                        <button type="button" onclick="confirmUserDelete('{{ $user->id }}')" style="background: none; border: none; color: #ff4d4f; cursor: pointer; padding: 0;" title="Delete User">
                            <i data-lucide="trash-2" style="width: 18px;"></i>
                        </button>
                        @endif
                    </div>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
    <div style="padding: 1rem;">
        {{ $users->links() }}
    </div>
</div>

<script>
function confirmUserDelete(id) {
    Swal.fire({
        title: 'Delete User?',
        text: "This will permanently remove the user's account and history.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ff4d4f',
        cancelButtonColor: '#C5A059',
        confirmButtonText: 'Yes, delete!',
        background: '#072821',
        color: '#FEFEE3',
        backdrop: `rgba(7, 40, 33, 0.8)`
    }).then((result) => {
        if (result.isConfirmed) {
            document.getElementById('delete-user-form-' + id).submit();
        }
    })
}
</script>
@endsection
