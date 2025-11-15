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
        logoutBtn.addEventListener('click', handleAccountLogout);
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

/**
 * Centralized logout function for all account pages
 * Clears all user session data and redirects to landing page
 */
function handleAccountLogout() {
    // Show custom confirmation modal
    showLogoutConfirmation(function(confirmed) {
        if (confirmed) {
            try {
                // Clear all customer-related localStorage items
                localStorage.removeItem('customer_id');
                localStorage.removeItem('customer_name');
                localStorage.removeItem('customer_email');
                localStorage.removeItem('farm2home_cart');
                localStorage.removeItem('checkoutCart');
                
                // Show success notification
                if (typeof notifications !== 'undefined') {
                    notifications.success('Logged out successfully', 'success', 'Success');
                }
                
                // Delay redirect so user sees the message
                setTimeout(function() {
                    window.location.replace('/landing/');
                }, 800);
                
            } catch (error) {
                console.error('Error during logout:', error);
                // Redirect even if there's an error
                window.location.replace('/landing/');
            }
        }
    });
}

/**
 * Show custom logout confirmation modal
 */
function showLogoutConfirmation(callback) {
    // Create modal backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'logout-modal-backdrop';
    backdrop.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.2s ease;
    `;
    
    // Create modal container
    const modal = document.createElement('div');
    modal.className = 'logout-confirmation-modal';
    modal.style.cssText = `
        background: white;
        border-radius: 16px;
        padding: 2rem;
        max-width: 420px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: slideUp 0.3s ease;
        text-align: center;
    `;
    
    modal.innerHTML = `
        <div style="margin-bottom: 1.5rem;">
            <div style="width: 64px; height: 64px; background: #fff3cd; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; font-size: 32px;">
                ⚠️
            </div>
            <h2 style="margin: 0 0 0.5rem; font-size: 1.5rem; font-weight: 700; color: #2c3e50;">Confirm Logout</h2>
            <p style="margin: 0; color: #6c757d; font-size: 1rem;">Are you sure you want to logout?</p>
        </div>
        <div style="display: flex; gap: 1rem; justify-content: center;">
            <button class="logout-cancel-btn" style="
                flex: 1;
                padding: 0.875rem 1.5rem;
                border: 2px solid #e0e0e0;
                background: white;
                color: #6c757d;
                border-radius: 8px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
            ">Cancel</button>
            <button class="logout-confirm-btn" style="
                flex: 1;
                padding: 0.875rem 1.5rem;
                border: none;
                background: #dc3545;
                color: white;
                border-radius: 8px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
            ">Logout</button>
        </div>
    `;
    
    // Add animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideUp {
            from { 
                opacity: 0;
                transform: translateY(20px);
            }
            to { 
                opacity: 1;
                transform: translateY(0);
            }
        }
        .logout-cancel-btn:hover {
            background: #f8f9fa !important;
            border-color: #6c757d !important;
        }
        .logout-confirm-btn:hover {
            background: #c82333 !important;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
        }
    `;
    document.head.appendChild(style);
    
    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);
    
    // Handle button clicks
    const cancelBtn = modal.querySelector('.logout-cancel-btn');
    const confirmBtn = modal.querySelector('.logout-confirm-btn');
    
    function closeModal(confirmed) {
        backdrop.style.animation = 'fadeOut 0.2s ease';
        setTimeout(() => {
            backdrop.remove();
            style.remove();
        }, 200);
        callback(confirmed);
    }
    
    cancelBtn.addEventListener('click', () => closeModal(false));
    confirmBtn.addEventListener('click', () => closeModal(true));
    backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeModal(false);
    });
    
    // Add fadeOut animation
    const fadeOutStyle = document.createElement('style');
    fadeOutStyle.textContent = `
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(fadeOutStyle);
}

// Export logout function globally for use in other account pages
window.accountFunctions = window.accountFunctions || {};
window.accountFunctions.handleAccountLogout = handleAccountLogout;

