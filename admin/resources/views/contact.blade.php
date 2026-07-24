@extends('layouts.app')
@section('meta_title', 'Contact Us | Aakrithi')
@section('meta_description', 'Get in touch with Aakrithi for inquiries, collaborations, or support. We are here to help you with your fashion needs.')

@section('content')
<div class="container contact-page">
    <div class="contact-header">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you. Get in touch with our team.</p>
    </div>

    <div class="contact-layout">
        <div class="contact-info">
            <div class="info-item">
                <i data-lucide="mail" style="font-size:1.5rem; margin-top:2px;"></i>
                <div>
                    <h3>Email</h3>
                    <p>hello@aakrithi.com</p>
                    <p>support@aakrithi.com</p>
                </div>
            </div>
            <div class="info-item">
                <i data-lucide="phone" style="font-size:1.5rem; margin-top:2px;"></i>
                <div>
                    <h3>Phone</h3>
                    <p>+91 98765 43210</p>
                    <p>Mon-Sat: 10am - 7pm</p>
                </div>
            </div>
            <div class="info-item">
                <i data-lucide="map-pin" style="font-size:1.5rem; margin-top:2px;"></i>
                <div>
                    <h3>Flagship Store</h3>
                    <p>45 Fashion Street, 1st Floor</p>
                    <p>Indiranagar, Bangalore - 560038</p>
                </div>
            </div>
            <div>
                <h3 style="font-size:0.875rem; text-transform:uppercase; letter-spacing:1px; margin-bottom:1rem;">Follow Us</h3>
                <div class="social-links" style="color: var(--color-primary);">
                    <a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg></a>
                    <a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
                    <a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16zM4 20l6.768 -6.768M15.232 10.232l4.768 -6.232"/></svg></a>
                </div>
            </div>
        </div>

        <div class="contact-form-container">
            <form class="contact-form" method="POST" action="#">
                @csrf
                <div class="form-group">
                    <label>Full Name</label>
                    <input type="text" placeholder="Your name" required>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" placeholder="your@email.com" required>
                </div>
                <div class="form-group">
                    <label>Subject</label>
                    <select>
                        <option>General Inquiry</option>
                        <option>Order Support</option>
                        <option>Returns & Exchange</option>
                        <option>Collaboration</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Message</label>
                    <textarea rows="5" placeholder="Tell us how we can help..." required></textarea>
                </div>
                <button type="submit" class="btn-dark">Send Message</button>
            </form>
        </div>
    </div>
</div>
@endsection
