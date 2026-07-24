@extends('layouts.auth')

@section('content')
<h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1.5rem; text-align: center;">Administrator Login</h2>

@if($errors->any())
    <div style="background: rgba(255, 77, 79, 0.1); border: 1px solid #ff4d4f; color: #ff4d4f; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; font-size: 0.85rem;">
        {{ $errors->first() }}
    </div>
@endif

<form method="POST" action="{{ route('login') }}">
    @csrf
    <div class="form-group">
        <label>Email Address</label>
        <input type="email" name="email" value="{{ old('email') }}" required autofocus placeholder="admin@aakrithi.in">
    </div>

    <div class="form-group">
        <label>Password</label>
        <input type="password" name="password" required placeholder="••••••••">
    </div>

    <button type="submit" class="btn-auth">Sign In to Dashboard</button>
</form>

<div style="margin-top: 1.5rem; text-align: center;">
    <a href="{{ env('STORE_URL', 'https://www.aakrithiclothings.in') }}" style="color: #C5A059; text-decoration: none; font-size: 0.85rem;">&larr; Back to Storefront</a>
</div>
@endsection
