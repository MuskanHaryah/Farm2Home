// Account Page JavaScript

// Navigation handling
document.addEventListener('DOMContentLoaded', function() {
    // Get all navigation items
    const navItems = document.querySelectorAll('.nav-item');
    
    // Add click event to navigation items
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Allow default navigation - just update active state
            
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
        });
    });
    
    
    // Logout button
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                // Redirect to landing page or login page
                window.location.href = '../landing/index.html';
            }
        });
    }
    
    // Navigation links - update active state based on current page
    updateActiveNavigation();
    
    // Order card click handling
    const orderCards = document.querySelectorAll('.order-card');
    orderCards.forEach(card => {
        card.addEventListener('click', function() {
            const orderId = this.querySelector('.order-id').textContent;
            console.log('Viewing order:', orderId);
            // You can add logic to show order details
            notifications.info(`Order details for ${orderId} will be shown here`);
        });
    });
    
    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.stat-card, .order-card, .action-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
});

// Function to update user info (can be called from other scripts)
function updateUserInfo(name, email) {
    document.querySelector('.profile-name').textContent = name.toUpperCase();
    document.querySelector('.profile-email').textContent = email.toUpperCase();
    document.querySelector('.welcome-title').textContent = `WELCOME BACK, ${name.toUpperCase()}! 👋`;
}

// Function to update stats
function updateStats(totalSpent, totalOrders) {
    document.querySelector('.stat-value').textContent = `Rs.${totalSpent.toLocaleString()}`;
    document.querySelectorAll('.stat-value')[1].textContent = totalOrders;
    document.querySelector('.orders-count').textContent = `${totalOrders} Orders`;
}

// Function to add new order to the list
function addOrder(orderId, status, items, price, date) {
    const ordersList = document.querySelector('.orders-list');
    const statusClass = status.toLowerCase().replace(' ', '-');
    const iconClass = status === 'In Transit' ? 'order-icon-transit' : '';
    const icon = status === 'In Transit' ? 'fa-truck' : 'fa-box';
    
    const orderHTML = `
        <div class="order-card">
            <div class="order-icon ${iconClass}">
                <i class="fas ${icon}"></i>
            </div>
            <div class="order-details">
                <div class="order-id-row">
                    <span class="order-id">${orderId}</span>
                    <span class="order-status status-${statusClass}">${status}</span>
                </div>
                <div class="order-items">${items}</div>
            </div>
            <div class="order-meta">
                <div class="order-price">Rs.${price.toLocaleString()}</div>
                <div class="order-date">${date}</div>
            </div>
        </div>
    `;
    
    ordersList.insertAdjacentHTML('afterbegin', orderHTML);
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        updateUserInfo,
        updateStats,
        addOrder
    };
}

/**
 * Update active navigation based on current page
 */
function updateActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.classList.remove('active');
        const href = item.getAttribute('href');
        
        if ((currentPage === 'index.html' && href === 'index.html') ||
            (currentPage === 'orders.html' && href === 'orders.html') ||
            (currentPage === 'addresses.html' && href === 'addresses.html') ||
            (currentPage === 'payment.html' && href === 'payment.html') ||
            (currentPage === 'settings.html' && href === 'settings.html')) {
            item.classList.add('active');
        }
    });
}

