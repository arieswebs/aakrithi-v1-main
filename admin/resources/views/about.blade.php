@extends('layouts.app')
@section('title', 'Our Story | Aakrithi - The Shape of Modern Tradition')
@section('meta_title', 'About Aakrithi | Handcrafted Ethnic Wear & Artisanal Journey')
@section('meta_description', 'Discover the story behind Aakrithi – a boutique dedicated to blending traditional Indian craftsmanship with modern fashion. Learn about our commitment to sustainable and artisanal clothing.')
@section('meta_keywords', 'Aakrithi story, traditional Indian boutique, handcrafted ethnic wear, sustainable fashion, artisanal clothing journey')

@section('content')
<section class="about-hero hero cinematic-hero" style="background: url('{{ asset('images/craftsmanship.png') }}') no-repeat center center; background-size: cover; height: 60vh; position: relative;">
    <div class="hero-overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to bottom, rgba(7, 40, 33, 0.4), rgba(7, 40, 33, 0.95)); z-index: 1;"></div>
    <div class="container h-100 d-flex flex-column align-items-center justify-content-center text-center position-relative" style="z-index: 2;">
        <div class="about-hero-content reveal-blur">
            <h1 class="shimmer-text" style="font-family: var(--font-serif); font-size: 4rem;">Our Artisanal Journey</h1>
            <p style="font-size: 1.2rem; opacity: 0.8; letter-spacing: 2px; text-transform: uppercase;">The Shape of Modern Tradition</p>
        </div>
    </div>
</section>

<div class="container py-5 mt-5">
    <div class="about-section reveal-up">
        <div class="about-text">
            <h2 style="font-family: var(--font-serif); font-size: 2.5rem; margin-bottom: 1.5rem;">The Beginning</h2>
            <p style="font-size: 1.1rem; line-height: 1.8; opacity: 0.8;">Founded in 2026, Aakrithi Clothing was born out of a desire to blend traditional Indian craftsmanship with modern, minimalist silhouettes. Our journey started in a small workshop with a single mission: to create clothing that speaks to the contemporary soul while honoring our rich textile heritage.</p>
        </div>
        <div class="about-image-wrapper reveal-scale">
            <img src="{{ asset('images/landing-hero.png') }}" alt="Aakrithi Workshop" style="border-radius: 40px; box-shadow: 0 30px 60px rgba(0,0,0,0.3); width: 100%;">
        </div>
    </div>

    <div class="about-section reveal-up" style="direction: rtl; margin-top: 8rem;">
        <div class="about-text" style="direction: ltr;">
            <h2 style="font-family: var(--font-serif); font-size: 2.5rem; margin-bottom: 1.5rem;">Our Philosophy</h2>
            <p style="font-size: 1.1rem; line-height: 1.8; opacity: 0.8;">Every garment is a dialogue between tradition and innovation. We source textiles from local artisans across India, ensuring fair wages and sustainable practices. Our designs are minimal yet expressive, functional yet beautiful.</p>
        </div>
        <div class="about-image-wrapper reveal-scale" style="direction: ltr;">
            <img src="{{ asset('images/boutique-hero.png') }}" alt="Aakrithi Philosophy" style="border-radius: 40px; box-shadow: 0 30px 60px rgba(0,0,0,0.3); width: 100%;">
        </div>
    </div>

    <div style="text-align:center; margin: 10rem 0 5rem;">
        <h2 class="reveal-up" style="font-family: var(--font-serif); font-size: 3rem; margin-bottom: 4rem;">Our Core Values</h2>
        <div class="values-grid reveal-up reveal-delay-2">
            <div class="value-card glass-card p-5">
                <i data-lucide="leaf" style="width: 40px; height: 40px; color: var(--color-accent); margin-bottom: 1.5rem;"></i>
                <h3 style="margin-bottom: 1rem;">Sustainability</h3>
                <p style="opacity: 0.7;">Ethically sourced materials and eco-friendly practices at every step of production.</p>
            </div>
            <div class="value-card glass-card p-5">
                <i data-lucide="award" style="width: 40px; height: 40px; color: var(--color-accent); margin-bottom: 1.5rem;"></i>
                <h3 style="margin-bottom: 1rem;">Craftsmanship</h3>
                <p style="opacity: 0.7;">Each piece is meticulously crafted by skilled artisans preserving traditional techniques.</p>
            </div>
            <div class="value-card glass-card p-5">
                <i data-lucide="users" style="width: 40px; height: 40px; color: var(--color-accent); margin-bottom: 1.5rem;"></i>
                <h3 style="margin-bottom: 1rem;">Inclusivity</h3>
                <p style="opacity: 0.7;">Fashion for every body, every age, and every occasion. Style knows no boundaries.</p>
            </div>
        </div>
    </div>
</div>
@endsection
