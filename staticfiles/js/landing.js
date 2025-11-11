// Landing Page JavaScript (without authentication functions)

let currentSlide = 0;
const slides = document.querySelectorAll('.slider-item');

// Initialize slider dots
function initDots() {
    const dotsContainer = document.getElementById('sliderDots');
    if (!dotsContainer) return;
    
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
        dot.onclick = () => goToSlide(index);
        dotsContainer.appendChild(dot);
    });
}

// Show slide
function showSlide(n) {
    slides.forEach(slide => slide.classList.remove('active'));
    const dots = document.querySelectorAll('.slider-dot');
    dots.forEach(dot => dot.classList.remove('active'));

    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) {
        dots[currentSlide].classList.add('active');
    }
}

// Next slide
function nextSlide() {
    showSlide(currentSlide + 1);
}

// Previous slide
function prevSlide() {
    showSlide(currentSlide - 1);
}

// Go to specific slide
function goToSlide(n) {
    showSlide(n);
}

// Auto slide every 5 seconds
setInterval(() => {
    if (slides.length > 0) {
        nextSlide();
    }
}, 5000);

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Handle contact form submission
document.querySelector('.contact-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    notifications.success('📧 Thank you for your message! We will get back to you soon.');
    e.target.reset();
});

// Mobile hamburger menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger?.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initDots();
});
