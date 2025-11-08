// Landing page JavaScript
console.log('Landing JS loaded');

// Product showcase slider
let currentSlide = 0;
const slides = [
    {
        title: 'Fresh Vegetables',
        description: 'Farm-fresh vegetables delivered daily',
        image: 'vegetables'
    },
    {
        title: 'Juicy Fruits',
        description: 'Sweet and ripe fruits from local farms',
        image: 'fruits'
    },
    {
        title: 'Fresh Herbs',
        description: 'Aromatic herbs for your kitchen',
        image: 'herbs'
    }
];

function showSlide(index) {
    const sliderItems = document.querySelectorAll('.slider-item');
    const dots = document.querySelectorAll('.slider-dot');
    
    if (sliderItems.length === 0) return;
    
    if (index >= sliderItems.length) currentSlide = 0;
    if (index < 0) currentSlide = sliderItems.length - 1;
    
    sliderItems.forEach(item => item.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    sliderItems[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function nextSlide() {
    currentSlide++;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide--;
    showSlide(currentSlide);
}

// Auto-advance slides
setInterval(nextSlide, 5000);

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
