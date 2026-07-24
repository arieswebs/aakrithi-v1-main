// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const menuIcon = document.getElementById('menuIcon');
const menuBackdrop = document.getElementById('menuBackdrop');

function closeMobileMenu() {
    navLinks.classList.remove('open');
    if (menuBackdrop) menuBackdrop.classList.remove('active');
    if (menuIcon) menuIcon.className = 'lucide-menu';
}

function openMobileMenu() {
    navLinks.classList.add('open');
    if (menuBackdrop) menuBackdrop.classList.add('active');
    if (menuIcon) menuIcon.className = 'lucide-x';
}

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        if (navLinks.classList.contains('open')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    // Close menu on backdrop click
    if (menuBackdrop) {
        menuBackdrop.addEventListener('click', closeMobileMenu);
    }

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
}

// Simple Cart (localStorage)
let cart = JSON.parse(localStorage.getItem('aakrithi_cart') || '[]');
updateCartCount();

function addToCart(name, price) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ name, price, qty: 1 });
    }
    localStorage.setItem('aakrithi_cart', JSON.stringify(cart));
    updateCartCount();
    showToast(`${name} added to cart!`);
}

function updateCartCount() {
    const countEl = document.getElementById('cartCount');
    if (countEl) {
        const total = cart.reduce((sum, item) => sum + item.qty, 0);
        countEl.textContent = total;
        countEl.style.display = total > 0 ? 'flex' : 'none';
    }
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
        background: #424B54; color: #FEFEE3; padding: 12px 24px;
        border-radius: 8px; font-family: 'Outfit', sans-serif;
        font-size: 14px; z-index: 9999; opacity: 0;
        transition: opacity 0.3s ease;
        box-shadow: 0 4px 20px rgba(66,75,84,0.3);
    `;
    document.body.appendChild(toast);
    requestAnimationFrame(() => { toast.style.opacity = '1'; });
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// Robust Scroll Reveal System
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Add a staggered delay based on elements appearing at the same time
            const delay = (index % 4) * 100;
            setTimeout(() => {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }, delay);
        }
    });
}, { 
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px' 
});

// Initialize reveal elements
function initReveal() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-up, .reveal-blur, .reveal-scale, .product-card, .category-item, .value-card, .feature-card, .landing-option');
    revealElements.forEach(el => {
        if (!el.classList.contains('active')) {
            revealObserver.observe(el);
        }
    });
}

document.addEventListener('DOMContentLoaded', initReveal);
// Re-init on dynamic content if necessary
window.addEventListener('load', initReveal);
