// Orders Page Functionality

// Global variable to store all orders data
let allOrdersData = [];

// Helper function to get CSRF token from cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Get CSRF token
const csrftoken = getCookie('csrftoken');

document.addEventListener('DOMContentLoaded', function() {
    // Step 11: Check authentication first
    const customerId = localStorage.getItem('customer_id');
    
    if (!customerId) {
        // No customer logged in, redirect to landing page
        window.location.href = '/landing/';
        return;
    }
    
    // Customer is logged in, proceed with page initialization
    updateSidebarProfile();
    showLoadingState();
    
    // Fetch orders data
    fetchCustomerOrders().then(() => {
        hideLoadingState();
        // Initialize existing functionality after data loads
        initializeOrdersPage();
        initializeFilterTabs();
        initializeSearchFunctionality();
        initializeOrderActions();
    }).catch(() => {
        hideLoadingState();
    });
});

/**
 * Step 7: Fetch all customer orders from API
 */
async function fetchCustomerOrders() {
    const customerId = localStorage.getItem('customer_id');
    
    if (!customerId) {
        handleAuthError('No customer ID found');
        return;
    }
    
    try {
        const response = await fetch(`/api/customer/orders/?customer_id=${customerId}`);
        
        if (response.status === 404) {
            handleAuthError('Customer not found');
            return;
        }
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status === 'success') {
            // Store orders data globally
            allOrdersData = data.data || [];
            
            // Render orders UI
            renderOrdersUI(allOrdersData);
            
            // Update orders count in sidebar
            updateOrdersCount();
        } else {
            throw new Error(data.message || 'Failed to fetch orders');
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
        
        // Show error notification if notifications system is available
        if (typeof notifications !== 'undefined') {
            notifications.error('Failed to load orders. Please try again.');
        }
        
        // Show empty state on error
        const emptyState = document.getElementById('emptyState');
        if (emptyState) {
            emptyState.style.display = 'block';
        }
    }
}

/**
 * Step 8: Render orders UI
 */
function renderOrdersUI(orders) {
    const ordersContainer = document.getElementById('ordersContainer');
    const emptyState = document.getElementById('emptyState');
    
    if (!ordersContainer) {
        console.error('Orders container not found');
        return;
    }
    
    // Clear existing orders
    ordersContainer.innerHTML = '';
    
    // Check if there are orders
    if (!orders || orders.length === 0) {
        // Show empty state
        if (emptyState) {
            emptyState.style.display = 'block';
        }
        return;
    }
    
    // Hide empty state
    if (emptyState) {
        emptyState.style.display = 'none';
    }
    
    // Render each order
    orders.forEach(order => {
        const orderCard = renderOrderCard(order);
        ordersContainer.appendChild(orderCard);
    });

    // After rendering, re-bind action button handlers (details, reorder, etc.)
    initializeOrderActions();

    // Add a subtle fade-in animation for rendered items
    Array.from(ordersContainer.children).forEach((child, idx) => {
        child.style.opacity = '0';
        child.style.transform = 'translateY(6px)';
        setTimeout(() => {
            child.style.transition = 'opacity 220ms ease, transform 220ms ease';
            child.style.opacity = '1';
            child.style.transform = 'translateY(0)';
        }, 30 + idx * 30);
    });
}

/**
 * Step 9: Render individual order card
 */
function renderOrderCard(order) {
    const orderDiv = document.createElement('div');
    
    // Determine status class for styling
    const statusClass = getStatusClass(order.status);
    const statusBadgeText = getStatusBadgeText(order.status);
    const statusBadgeClass = `${statusClass}-badge`;
    
    // Set data attributes for filtering
    orderDiv.className = `order-item ${statusClass}-order`;
    orderDiv.setAttribute('data-status', statusClass);
    orderDiv.setAttribute('data-order-id', order.order_id);
    
    // Build order HTML
    orderDiv.innerHTML = `
        <div class="order-header">
            <div class="order-icon-box ${statusClass}">
                <i class="fas fa-box"></i>
            </div>
            <div class="order-info">
                <h3 class="order-number">${order.order_id_formatted}</h3>
                <p class="order-date">PLACED ON ${order.order_date_formatted}</p>
            </div>
            <span class="order-status-badge ${statusBadgeClass}">${statusBadgeText}</span>
        </div>

        <div class="order-content">
            <div class="order-items">
                <div class="items-grid">
                    ${renderOrderItems(order.order_items)}
                </div>
            </div>

            <div class="order-footer">
                <div class="total-amount">
                    <span class="amount-label">TOTAL AMOUNT</span>
                    <span class="amount-value">${formatCurrency(order.total_amount)}</span>
                </div>
                <div class="order-actions">
                    <button class="action-btn details-btn">
                        <i class="fas fa-eye"></i>
                        DETAILS
                    </button>
                    ${order.status === 'DELIVERED' ? `
                    <button class="action-btn reorder-btn">
                        <i class="fas fa-redo"></i>
                        REORDER
                    </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
    
    return orderDiv;
}

/**
 * Render order items (product thumbnails)
 */
function renderOrderItems(orderItems) {
    if (!orderItems || orderItems.length === 0) {
        return '<p>No items</p>';
    }
    
    return orderItems.map(item => {
        const imagePath = getProductImagePath(item.product_image, item.product_category);
        return `
            <div class="product-thumb">
                <img src="${imagePath}" alt="${item.product_name}" onerror="this.src='/static/images/${item.product_category}/default.png'">
                <span class="item-name">${item.product_name.toUpperCase()}</span>
                <span class="item-qty">${item.quantity}kg</span>
            </div>
        `;
    }).join('');
}

/**
 * Step 10: Update sidebar profile information
 */
function updateSidebarProfile() {
    const customerName = localStorage.getItem('customer_name');
    const customerEmail = localStorage.getItem('customer_email');
    
    // Update profile name
    const profileNameElement = document.getElementById('profileName');
    if (profileNameElement && customerName) {
        profileNameElement.textContent = customerName.toUpperCase();
    }
    
    // Update profile email
    const profileEmailElement = document.getElementById('profileEmail');
    if (profileEmailElement && customerEmail) {
        profileEmailElement.textContent = customerEmail.toUpperCase();
    }
    
    // Update total orders count (will be updated after orders are fetched)
    updateOrdersCount();
}

/**
 * Update orders count in sidebar
 */
function updateOrdersCount() {
    const sidebarTotalOrdersElement = document.getElementById('sidebarTotalOrders');
    if (sidebarTotalOrdersElement) {
        const count = allOrdersData.length;
        sidebarTotalOrdersElement.textContent = `${count} ${count === 1 ? 'Order' : 'Orders'}`;
    }
}

/**
 * Step 18: Show loading state
 * Displays loading spinner and disables user interactions during data fetch
 * Ensures UI remains responsive and accessible during loading
 */
function showLoadingState() {
    const ordersContainer = document.getElementById('ordersContainer');
    const emptyState = document.getElementById('emptyState');
    
    // Hide empty state if visible
    if (emptyState) {
        emptyState.style.display = 'none';
    }
    
    // Show loading spinner in orders container
    if (ordersContainer) {
        ordersContainer.innerHTML = `
            <div class="loading-state" style="text-align: center; padding: 60px 40px; color: #666;" role="status" aria-live="polite">
                <i class="fas fa-spinner fa-spin" style="font-size: 48px; margin-bottom: 20px; color: #8BBC3E;" aria-hidden="true"></i>
                <p style="font-size: 16px; font-weight: 500;">Loading your orders...</p>
                <p style="font-size: 14px; color: #999; margin-top: 8px;">Please wait</p>
            </div>
        `;
    }
    
    // Disable filter tabs to prevent interaction during loading
    const filterTabs = document.querySelectorAll('.tab-btn');
    filterTabs.forEach(tab => {
        tab.disabled = true;
        tab.style.opacity = '0.5';
        tab.style.pointerEvents = 'none';
        tab.setAttribute('aria-disabled', 'true');
    });
    
    // Disable search input
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.disabled = true;
        searchInput.style.opacity = '0.5';
        searchInput.setAttribute('aria-busy', 'true');
        searchInput.placeholder = 'Loading...';
    }
}

/**
 * Step 18: Hide loading state
 * Re-enables user interactions after data has loaded
 * Restores all interactive elements to their functional state
 */
function hideLoadingState() {
    // Enable filter tabs
    const filterTabs = document.querySelectorAll('.tab-btn');
    filterTabs.forEach(tab => {
        tab.disabled = false;
        tab.style.opacity = '1';
        tab.style.pointerEvents = 'auto';
        tab.removeAttribute('aria-disabled');
    });
    
    // Enable search input
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.disabled = false;
        searchInput.style.opacity = '1';
        searchInput.removeAttribute('aria-busy');
        searchInput.placeholder = 'Search orders...';
    }
}

/**
 * Step 19: Handle authentication errors
 * Manages authentication failures by cleaning up session and redirecting to login
 * Ensures secure handling of expired/invalid sessions
 */
function handleAuthError(message) {
    // Log error for debugging (but don't expose sensitive info)
    console.error('Authentication error:', message || 'Unknown auth error');
    
    // Clear all authentication-related data from localStorage
    try {
        localStorage.removeItem('customer_id');
        localStorage.removeItem('customer_name');
        localStorage.removeItem('customer_email');
        
        // Optional: Clear any other session-related data
        // This ensures complete cleanup
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.startsWith('customer_') || key.startsWith('session_'))) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
    } catch (error) {
        console.error('Error clearing localStorage:', error);
    }
    
    // Show user-friendly error message
    const errorMessage = message === 'Customer not found' 
        ? 'Your account session has expired or is invalid. Please log in again.'
        : 'Your session has expired. Please log in again.';
    
    alert(errorMessage);
    
    // Redirect to landing page (which has login modal)
    // Use replace to prevent back button from returning to this page
    window.location.replace('/landing/');
}

/**
 * Step 16: Get status class for styling
 * Maps order status from backend to CSS class names
 * Matches Order.STATUS_CHOICES from Django models: PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED
 */
function getStatusClass(status) {
    // Normalize status - handle both uppercase and potential case variations
    const normalizedStatus = (status || '').toString().toUpperCase().trim();
    
    const statusMap = {
        'DELIVERED': 'delivered',
        'SHIPPED': 'active',
        'CONFIRMED': 'active',
        'PENDING': 'active',
        'CANCELLED': 'cancelled'
    };
    
    return statusMap[normalizedStatus] || 'active';
}

/**
 * Step 16: Get status badge text for display
 * Maps order status to user-friendly display text
 * Returns uppercase text for consistency with UI design
 */
function getStatusBadgeText(status) {
    // Normalize status - handle both uppercase and potential case variations
    const normalizedStatus = (status || '').toString().toUpperCase().trim();
    
    const statusMap = {
        'DELIVERED': 'DELIVERED',
        'SHIPPED': 'IN TRANSIT',
        'CONFIRMED': 'CONFIRMED',
        'PENDING': 'PENDING',
        'CANCELLED': 'CANCELLED'
    };
    
    // Return mapped text or fallback to normalized status
    return statusMap[normalizedStatus] || normalizedStatus || 'UNKNOWN';
}

/**
 * Step 17: Format currency for display
 * Converts amount to Pakistani Rupees format with proper number formatting
 * Handles edge cases: null, undefined, NaN, negative values
 */
function formatCurrency(amount) {
    // Handle null, undefined, or non-numeric values
    if (amount === null || amount === undefined || amount === '') {
        return 'Rs.0';
    }
    
    const numAmount = parseFloat(amount);
    
    // Handle NaN after parsing
    if (isNaN(numAmount)) {
        console.warn('Invalid amount for currency formatting:', amount);
        return 'Rs.0';
    }
    
    // Handle negative amounts (display as 0 or show negative)
    if (numAmount < 0) {
        console.warn('Negative amount encountered:', numAmount);
        return 'Rs.0';
    }
    
    // Format with Pakistani locale
    return `Rs.${numAmount.toLocaleString('en-PK', { 
        minimumFractionDigits: 0, 
        maximumFractionDigits: 0 
    })}`;
}

/**
 * Step 17: Get product image path
 * Converts relative/absolute image paths to correct static file URLs
 * Handles missing images with category-specific default fallback
 */
function getProductImagePath(imagePath, category) {
    // Handle missing or empty image path - use category default
    if (!imagePath || imagePath.trim() === '') {
        const safeCategory = (category || 'vegetables').toLowerCase().trim();
        return `/static/images/${safeCategory}/default.png`;
    }
    
    // Trim whitespace from path
    const trimmedPath = imagePath.trim();
    
    // If path already starts with /, return as is (absolute path)
    if (trimmedPath.startsWith('/')) {
        return trimmedPath;
    }
    
    // If path starts with 'static/', add leading /
    if (trimmedPath.startsWith('static/')) {
        return `/${trimmedPath}`;
    }
    
    // If path starts with 'images/', assume it needs /static/ prefix
    if (trimmedPath.startsWith('images/')) {
        return `/static/${trimmedPath}`;
    }
    
    // Otherwise assume it's a relative path under static
    return `/static/${trimmedPath}`;
}

/**
 * Initialize orders page
 */
function initializeOrdersPage() {
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle) {
        pageTitle.textContent = 'Orders';
    }
}

/**
 * Initialize filter tabs
 */
function initializeFilterTabs() {
    const filterTabs = document.querySelectorAll('.tab-btn');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');

            // Update active tab
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // Filter orders from in-memory data and render
            filterOrders(filter);
        });
    });

    // Set "All" tab as active by default
    if (filterTabs.length > 0) {
        filterTabs[0].classList.add('active');
    }

    // Update tab counts based on current data
    updateFilterTabCounts();
}

/**
 * Filter orders based on selected status
 */
function filterOrders(filter) {
    // Use the in-memory orders array to compute filtered results
    const filtered = (allOrdersData || []).filter(order => {
        if (filter === 'all') return true;
        return getStatusClass(order.status) === filter;
    });

    // Render filtered results
    renderOrdersUI(filtered);

    // Update tab counts (keeps labels up-to-date)
    updateFilterTabCounts();
}

/**
 * Update counts displayed on each filter tab using `allOrdersData`.
 */
function updateFilterTabCounts() {
    const filterTabs = document.querySelectorAll('.tab-btn');
    const counts = {
        all: (allOrdersData || []).length,
        delivered: (allOrdersData || []).filter(o => getStatusClass(o.status) === 'delivered').length,
        active: (allOrdersData || []).filter(o => getStatusClass(o.status) === 'active').length,
        cancelled: (allOrdersData || []).filter(o => getStatusClass(o.status) === 'cancelled').length
    };

    filterTabs.forEach(tab => {
        const key = tab.getAttribute('data-filter');
        const labelSpan = tab.querySelector('span');
        const baseLabel = (labelSpan && labelSpan.textContent) ? labelSpan.textContent.split(' (')[0].trim() : (key || '').toUpperCase();
        const count = counts[key] || 0;
        if (labelSpan) {
            labelSpan.textContent = `${baseLabel} (${count})`;
        }
    });
}

/**
 * Initialize search functionality
 */
function initializeSearchFunctionality() {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();

        // Determine the currently active filter (if any) so search respects it
        const activeTab = document.querySelector('.tab-btn.active');
        const activeFilter = activeTab ? activeTab.getAttribute('data-filter') : 'all';

        // If search is empty, just re-apply the active filter
        if (searchTerm === '') {
            filterOrders(activeFilter);
            return;
        }

        const matches = (allOrdersData || []).filter(order => {
            // Skip orders that don't match the active tab
            if (activeFilter !== 'all' && getStatusClass(order.status) !== activeFilter) return false;

            const orderNumber = (order.order_id_formatted || '').toLowerCase();
            const orderDate = (order.order_date_formatted || '').toLowerCase();
            const itemsText = (order.order_items || []).map(i => (i.product_name || '').toLowerCase()).join(' ');

            return orderNumber.includes(searchTerm) || orderDate.includes(searchTerm) || itemsText.includes(searchTerm);
        });

        // Render matching results
        renderOrdersUI(matches);
    });
}

/**
 * Initialize order action buttons
 */
function initializeOrderActions() {
    // Details buttons
    const detailsButtons = document.querySelectorAll('.details-btn');
    detailsButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const orderCard = this.closest('.order-item');
            const orderId = orderCard?.getAttribute('data-order-id');
            
            if (orderId) {
                showOrderDetails(orderId);
            }
        });
    });

    // Reorder buttons
    const reorderButtons = document.querySelectorAll('.reorder-btn');
    reorderButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const orderCard = this.closest('.order-item');
            const orderId = orderCard?.getAttribute('data-order-id');
            
            if (orderId) {
                handleReorder(orderId);
            }
        });
    });
    
    // Step 20: Logout button
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        // Remove any existing listeners to prevent duplicates
        const newLogoutBtn = logoutBtn.cloneNode(true);
        logoutBtn.parentNode.replaceChild(newLogoutBtn, logoutBtn);
        
        newLogoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    }
}

/**
 * Step 20: Handle logout
 * Manages user logout with confirmation, session cleanup, and redirect
 * Ensures complete cleanup of all user session data
 */
function handleLogout() {
    // Show confirmation dialog
    const confirmed = confirm('Are you sure you want to logout?');
    
    if (!confirmed) {
        return; // User cancelled logout
    }
    
    try {
        // Clear all customer-related data from localStorage
        localStorage.removeItem('customer_id');
        localStorage.removeItem('customer_name');
        localStorage.removeItem('customer_email');
        
        // Optional: Clear any other session-related data for complete cleanup
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.startsWith('customer_') || key.startsWith('session_') || key.startsWith('cart_'))) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        console.log('User logged out successfully');
        
        // Show success message
        alert('You have been logged out successfully.');
        
        // Redirect to landing page
        // Use replace to prevent back button from returning to protected page
        window.location.replace('/landing/');
        
    } catch (error) {
        console.error('Error during logout:', error);
        
        // Even if there's an error, try to redirect
        alert('Logout completed. Redirecting...');
        window.location.replace('/landing/');
    }
}

/**
 * Step 14: Show order details using stored data
 */
function showOrderDetails(orderId) {
    // Find order in allOrdersData
    const order = (allOrdersData || []).find(o => o.order_id === parseInt(orderId));
    
    if (!order) {
        console.error('Order not found:', orderId);
        if (typeof notifications !== 'undefined') {
            notifications.error('Order not found');
        }
        return;
    }
    
    // Build detailed order info message
    const itemsList = (order.order_items || [])
        .map(item => `  • ${item.product_name} - ${item.quantity}kg @ ${formatCurrency(item.price)}`)
        .join('\n');
    
    const detailsMessage = `
ORDER DETAILS
${'-'.repeat(50)}

Order ID: ${order.order_id_formatted}
Status: ${order.status_display}
Date: ${order.order_date_formatted}
Payment: ${order.payment || 'N/A'}

ITEMS (${order.items_count} items):
${itemsList}

${'-'.repeat(50)}
TOTAL: ${formatCurrency(order.total_amount)}
    `.trim();
    
    // Show details in alert (simple implementation)
    // For a more sophisticated UI, you could create a modal overlay
    alert(detailsMessage);
    
    // Optional: log for debugging
    console.log('Order details:', order);
}

/**
 * Step 15: Handle reorder functionality - add all items from order to cart
 */
async function handleReorder(orderId) {
    // Find order in allOrdersData
    const order = (allOrdersData || []).find(o => o.order_id === parseInt(orderId));
    
    if (!order) {
        console.error('Order not found:', orderId);
        if (typeof notifications !== 'undefined') {
            notifications.error('Order not found');
        }
        return;
    }
    
    // Build confirmation message with item names
    const itemNames = (order.order_items || [])
        .map(item => item.product_name)
        .join(', ');
    
    const confirmed = confirm(
        `Add all items from ${order.order_id_formatted} to your cart?\n\nItems: ${itemNames}\n\nTotal: ${formatCurrency(order.total_amount)}`
    );
    
    if (!confirmed) {
        return;
    }
    
    // Get customer_id from localStorage
    const customerId = localStorage.getItem('customer_id');
    
    if (!customerId) {
        handleAuthError('No customer ID found');
        return;
    }
    
    // Show loading notification
    if (typeof notifications !== 'undefined') {
        notifications.info('Adding items to cart...');
    }
    
    // Add each item to cart via API
    let successCount = 0;
    let failCount = 0;
    
    for (const item of order.order_items) {
        try {
            const response = await fetch('/api/cart/add_item/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken
                },
                body: JSON.stringify({
                    customer_id: customerId,
                    product_id: item.product,
                    quantity: item.quantity
                })
            });
            
            if (response.ok) {
                successCount++;
            } else {
                console.error(`Failed to add ${item.product_name}:`, await response.text());
                failCount++;
            }
        } catch (error) {
            console.error(`Error adding ${item.product_name}:`, error);
            failCount++;
        }
    }
    
    // Show result notification
    if (typeof notifications !== 'undefined') {
        if (failCount === 0) {
            notifications.success(`✓ All ${successCount} items added to cart!`);
        } else if (successCount > 0) {
            notifications.warning(`⚠ ${successCount} items added, ${failCount} failed`);
        } else {
            notifications.error('Failed to add items to cart');
            return;
        }
    } else {
        // Fallback alert if notifications not available
        if (failCount === 0) {
            alert(`✓ All ${successCount} items added to cart!`);
        } else {
            alert(`Added ${successCount} items to cart. ${failCount} failed.`);
        }
    }
    
    // Ask if user wants to go to checkout
    const goToCheckout = confirm('Items added to cart! Go to checkout now?');
    if (goToCheckout) {
        window.location.href = '/checkout/';
    }
}

/**
 * Export order as PDF (optional enhancement)
 */
function exportOrderAsPDF(orderId) {
    console.log('Exporting order:', orderId);
    // TODO: Implement PDF export functionality
    // Could use libraries like jsPDF or html2pdf
}

/**
 * Helper function to format date
 */
function formatDate(date) {
    if (typeof date === 'string') {
        date = new Date(date);
    }
    
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Helper function to format currency
 */
function formatCurrency(amount) {
    return `Rs.${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
}

/**
 * Helper function to get status badge text
 */
function getStatusBadgeText(status) {
    const statusMap = {
        'delivered': 'Delivered',
        'active': 'In Transit',
        'cancelled': 'Cancelled'
    };
    return statusMap[status] || status;
}

/**
 * Helper function to get status icon
 */
function getStatusIcon(status) {
    const iconMap = {
        'delivered': '✓',
        'active': '→',
        'cancelled': '✕'
    };
    return iconMap[status] || '•';
}

// Export functions for use in other modules if needed
window.ordersPageFunctions = {
    showOrderDetails,
    handleReorder,
    exportOrderAsPDF,
    formatDate,
    formatCurrency,
    getStatusBadgeText,
    getStatusIcon
};
