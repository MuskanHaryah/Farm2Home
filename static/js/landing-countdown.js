/* ================================
   COUNTDOWN TIMER FOR DEALS
   ================================ */

function startCountdown() {
    // Set the target date for the countdown (24 hours from now as example)
    const targetDate = new Date();
    targetDate.setHours(targetDate.getHours() + 4, 14, 48, 18); // 4 days, 14 hours, 48 min, 18 sec from now

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate.getTime() - now;

        if (distance < 0) {
            document.querySelector('.countdown-timer').innerHTML = '<p>Sale Ended!</p>';
            return;
        }

        // Calculate time units
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update timer display
        const timerItems = document.querySelectorAll('.timer-item');
        if (timerItems.length >= 4) {
            timerItems[0].querySelector('.timer-number').textContent = String(days).padStart(2, '0');
            timerItems[1].querySelector('.timer-number').textContent = String(hours).padStart(2, '0');
            timerItems[2].querySelector('.timer-number').textContent = String(minutes).padStart(2, '0');
            timerItems[3].querySelector('.timer-number').textContent = String(seconds).padStart(2, '0');
        }
    }

    // Update immediately and then every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Start countdown when page loads
document.addEventListener('DOMContentLoaded', startCountdown);

/* ================================
   SMOOTH SCROLL NAVIGATION
   ================================ */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

/* ================================
   HAMBURGER MENU
   ================================ */

const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

/* ================================
   DEAL BUTTON FUNCTIONALITY
   ================================ */

const dealButtons = document.querySelectorAll('.deal-btn');
dealButtons.forEach(button => {
    button.addEventListener('click', function() {
        const productName = this.parentElement.querySelector('h4').textContent;
        const price = this.parentElement.querySelector('.deal-price-value').textContent;
        
        // Show notification
        showNotification(`${productName} added to cart! ${price}`, 'success');
        
        // Animate button
        this.textContent = '✓ Added';
        this.style.background = '#4da83d';
        
        setTimeout(() => {
            this.textContent = 'Add to Cart';
            this.style.background = '';
        }, 2000);
    });
});

/* ================================
   CATEGORY CLICK NAVIGATION
   ================================ */

const categoryCards = document.querySelectorAll('.category-card');
categoryCards.forEach(card => {
    card.addEventListener('click', function() {
        // Navigate to catalog with category filter (can be implemented later)
        window.location.href = '/products/';
    });
});

/* ================================
   MOBILE RESPONSIVE ADJUSTMENTS
   ================================ */

function adjustForMobile() {
    if (window.innerWidth <= 768) {
        document.querySelector('.b2b-card').style.gridTemplateColumns = '1fr';
    } else {
        document.querySelector('.b2b-card').style.gridTemplateColumns = '1fr 1fr';
    }
}

window.addEventListener('resize', adjustForMobile);
window.addEventListener('load', adjustForMobile);
