// ===============================================
// ACCOUNT OVERVIEW PAGE - ORDERS & PRICING
// ===============================================

// Product data (same as in prod-catalog)
const productsData = [
    // VEGETABLES (24 items)
    {id: 1, name: 'Tomato', variety: 'Tamatar', price: 120, category: 'vegetables', season: 'summer'},
    {id: 2, name: 'Potato', variety: 'Aloo', price: 80, category: 'vegetables', season: 'year-round'},
    {id: 3, name: 'Onion', variety: 'Pyaz', price: 100, category: 'vegetables', season: 'year-round'},
    {id: 4, name: 'Okra', variety: 'Bhindi', price: 150, category: 'vegetables', season: 'summer'},
    {id: 5, name: 'Bitter Gourd', variety: 'Karela', price: 110, category: 'vegetables', season: 'summer'},
    {id: 6, name: 'Carrot', variety: 'Gajar', price: 95, category: 'vegetables', season: 'winter'},
    {id: 7, name: 'Cucumber', variety: 'Kheera', price: 70, category: 'vegetables', season: 'summer'},
    {id: 8, name: 'Bottle Gourd', variety: 'Lauki', price: 60, category: 'vegetables', season: 'summer'},
    {id: 9, name: 'Ridge Gourd', variety: 'Tori', price: 85, category: 'vegetables', season: 'summer'},
    {id: 10, name: 'Spinach', variety: 'Palak', price: 75, category: 'vegetables', season: 'winter'},
    {id: 11, name: 'Brinjal', variety: 'Baingan', price: 130, category: 'vegetables', season: 'summer'},
    {id: 12, name: 'Capsicum', variety: 'Shimla Mirch', price: 140, category: 'vegetables', season: 'summer'},
    {id: 13, name: 'Green Chilli', variety: 'Hara Mirch', price: 90, category: 'vegetables', season: 'year-round'},
    {id: 14, name: 'Garlic', variety: 'Lehsun', price: 180, category: 'vegetables', season: 'winter'},
    {id: 15, name: 'Ginger', variety: 'Adrak', price: 160, category: 'vegetables', season: 'year-round'},
    {id: 16, name: 'Radish', variety: 'Mooli', price: 65, category: 'vegetables', season: 'winter'},
    {id: 17, name: 'Cauliflower', variety: 'Gobi', price: 120, category: 'vegetables', season: 'winter'},
    {id: 18, name: 'Cabbage', variety: 'Bandh Gobi', price: 80, category: 'vegetables', season: 'year-round'},
    {id: 19, name: 'Beetroot', variety: 'Chukandar', price: 100, category: 'vegetables', season: 'winter'},
    {id: 20, name: 'Pumpkin', variety: 'Kaddu', price: 95, category: 'vegetables', season: 'summer'},
    {id: 21, name: 'Bean', variety: 'Sem', price: 140, category: 'vegetables', season: 'summer'},
    {id: 22, name: 'Peas', variety: 'Matar', price: 110, category: 'vegetables', season: 'winter'},
    {id: 23, name: 'Turnip', variety: 'Shalgam', price: 85, category: 'vegetables', season: 'winter'},
    {id: 24, name: 'Corn', variety: 'Makkai', price: 120, category: 'vegetables', season: 'summer'},
    
    // FRUITS (20 items)
    {id: 25, name: 'Apple', variety: 'Seb', price: 200, category: 'fruits', season: 'winter'},
    {id: 26, name: 'Mango', variety: 'Aam', price: 180, category: 'fruits', season: 'summer'},
    {id: 27, name: 'Banana', variety: 'Kela', price: 60, category: 'fruits', season: 'year-round'},
    {id: 28, name: 'Orange', variety: 'Santra', price: 150, category: 'fruits', season: 'winter'},
    {id: 29, name: 'Lemon', variety: 'Nimbu', price: 80, category: 'fruits', season: 'year-round'},
    {id: 30, name: 'Papaya', variety: 'Papita', price: 120, category: 'fruits', season: 'summer'},
    {id: 31, name: 'Guava', variety: 'Amrood', price: 100, category: 'fruits', season: 'year-round'},
    {id: 32, name: 'Pomegranate', variety: 'Anar', price: 220, category: 'fruits', season: 'winter'},
    {id: 33, name: 'Watermelon', variety: 'Tarbuz', price: 140, category: 'fruits', season: 'summer'},
    {id: 34, name: 'Muskmelon', variety: 'Kharbuzah', price: 160, category: 'fruits', season: 'summer'},
    {id: 35, name: 'Strawberry', variety: 'Bahaar', price: 250, category: 'fruits', season: 'winter'},
    {id: 36, name: 'Grapes', variety: 'Angoor', price: 280, category: 'fruits', season: 'summer'},
    {id: 37, name: 'Pineapple', variety: 'Anannas', price: 150, category: 'fruits', season: 'summer'},
    {id: 38, name: 'Coconut', variety: 'Nariyal', price: 100, category: 'fruits', season: 'year-round'},
    {id: 39, name: 'Date', variety: 'Khajoor', price: 320, category: 'fruits', season: 'winter'},
    {id: 40, name: 'Peach', variety: 'Aaru', price: 200, category: 'fruits', season: 'summer'},
    {id: 41, name: 'Apricot', variety: 'Khubani', price: 240, category: 'fruits', season: 'summer'},
    {id: 42, name: 'Kiwi', variety: 'Kiwi', price: 280, category: 'fruits', season: 'winter'},
    {id: 43, name: 'Chikoo', variety: 'Sapota', price: 140, category: 'fruits', season: 'year-round'},
    {id: 44, name: 'Chuansa Mango', variety: 'Chuansa', price: 250, category: 'fruits', season: 'summer'},
    
    // HERBS (12 items)
    {id: 45, name: 'Mint', variety: 'Pudina', price: 30, category: 'herbs', season: 'year-round'},
    {id: 46, name: 'Coriander', variety: 'Dhania', price: 40, category: 'herbs', season: 'year-round'},
    {id: 47, name: 'Basil', variety: 'Tulsi', price: 35, category: 'herbs', season: 'year-round'},
    {id: 48, name: 'Parsley', variety: 'Ajwain Patra', price: 45, category: 'herbs', season: 'year-round'},
    {id: 49, name: 'Fenugreek', variety: 'Methi', price: 50, category: 'herbs', season: 'winter'},
    {id: 50, name: 'Curry Leaves', variety: 'Kari Patta', price: 40, category: 'herbs', season: 'year-round'},
    {id: 51, name: 'Thyme', variety: 'Ajwain', price: 60, category: 'herbs', season: 'year-round'},
    {id: 52, name: 'Rosemary', variety: 'Rosemary', price: 70, category: 'herbs', season: 'year-round'},
    {id: 53, name: 'Oregano', variety: 'Oregano', price: 65, category: 'herbs', season: 'year-round'},
    {id: 54, name: 'Dill', variety: 'Soya', price: 35, category: 'herbs', season: 'year-round'},
    {id: 55, name: 'Sage', variety: 'Sage', price: 55, category: 'herbs', season: 'year-round'},
    {id: 56, name: 'Chives', variety: 'Chives', price: 50, category: 'herbs', season: 'year-round'},
];

// Order data structure
// Format: {productIds: [1, 2, 3], quantities: [2, 1, 1]}
const orderData = {
    'ORD-1128': {
        productIds: [1, 10, 2],
        quantities: [1, 1, 1],
        date: 'Nov 28, 2024',
        status: 'delivered'
    },
    'ORD-2024-1128': {
        productIds: [1, 10, 2],
        quantities: [1, 1, 1],
        date: 'Nov 28, 2024',
        status: 'delivered'
    },
    'ORD-1115': {
        productIds: [4, 30, 26],
        quantities: [1, 1, 1],
        date: 'Nov 15, 2024',
        status: 'delivered'
    },
    'ORD-2024-1115': {
        productIds: [4, 30, 44],
        quantities: [1, 1, 1],
        date: 'Nov 15, 2024',
        status: 'delivered'
    },
    'ORD-1102': {
        productIds: [3, 6, 39],
        quantities: [1, 1, 1],
        date: 'Nov 2, 2024',
        status: 'transit'
    },
    'ORD-2024-1102': {
        productIds: [28, 31],
        quantities: [1, 1],
        date: 'Nov 2, 2024',
        status: 'transit'
    },
    'ORD-2024-1020': {
        productIds: [5, 15],
        quantities: [1, 1],
        date: 'Oct 20, 2024',
        status: 'cancelled'
    }
};

/**
 * Get product by ID
 */
function getProductById(productId) {
    return productsData.find(p => p.id === productId);
}

/**
 * Calculate order total price
 */
function calculateOrderTotal(productIds, quantities) {
    let total = 0;
    productIds.forEach((productId, index) => {
        const product = getProductById(productId);
        if (product) {
            total += product.price * (quantities[index] || 1);
        }
    });
    return total;
}

/**
 * Get product names for order
 */
function getProductNames(productIds) {
    const names = productIds.slice(0, 3).map(id => {
        const product = getProductById(id);
        return product ? product.name : 'Unknown';
    });
    
    if (productIds.length > 3) {
        names.push(`+${productIds.length - 3} more`);
    }
    
    return names.join(', ');
}

/**
 * Update order prices in overview
 */
function updateOverviewOrderPrices() {
    const orderItems = document.querySelectorAll('.orders-list .order-item');
    
    orderItems.forEach((item, index) => {
        const orderId = item.querySelector('.order-id')?.textContent;
        const priceElement = item.querySelector('.order-price');
        const itemsElement = item.querySelector('.order-items-text');
        
        if (orderId && orderData[orderId]) {
            const order = orderData[orderId];
            const total = calculateOrderTotal(order.productIds, order.quantities);
            const productNames = getProductNames(order.productIds);
            
            if (priceElement) {
                priceElement.textContent = `Rs.${total.toLocaleString('en-PK')}`;
                console.log(`Updated ${orderId}: Rs.${total}`);
            }
            
            if (itemsElement) {
                itemsElement.textContent = productNames;
                console.log(`Updated ${orderId} items: ${productNames}`);
            }
        }
    });
}

/**
 * Update order prices in orders page
 */
function updateOrdersPagePrices() {
    const orderItems = document.querySelectorAll('.orders-container .order-item');
    
    orderItems.forEach((item) => {
        const orderNumber = item.querySelector('.order-number')?.textContent;
        const amountElement = item.querySelector('.amount-value');
        const itemsContainer = item.querySelector('.items-grid');
        
        if (orderNumber && orderData[orderNumber]) {
            const order = orderData[orderNumber];
            const total = calculateOrderTotal(order.productIds, order.quantities);
            
            if (amountElement) {
                amountElement.textContent = `Rs.${total.toLocaleString('en-PK')}`;
                console.log(`Updated ${orderNumber}: Rs.${total}`);
            }
            
            // Update product items if needed
            if (itemsContainer) {
                updateOrderItemsDisplay(itemsContainer, order.productIds, order.quantities);
            }
        }
    });
}

/**
 * Update product items display in order detail
 */
function updateOrderItemsDisplay(container, productIds, quantities) {
    container.innerHTML = '';
    
    productIds.forEach((productId, index) => {
        const product = getProductById(productId);
        if (product) {
            const qty = quantities[index] || 1;
            const thumb = document.createElement('div');
            thumb.className = 'product-thumb';
            thumb.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <div class="product-name">${product.name}</div>
                    <div class="product-qty">x${qty}</div>
                </div>
            `;
            container.appendChild(thumb);
        }
    });
}

/**
 * Initialize overview page
 */
function initializeOverviewPage() {
    console.log('Initializing account overview page...');
    
    // Check if we're on the overview page
    if (document.querySelector('.orders-list')) {
        updateOverviewOrderPrices();
        console.log('Overview page prices updated');
    }
}

/**
 * Initialize orders page
 */
function initializeOrdersPage() {
    console.log('Initializing orders page...');
    
    // Check if we're on the orders page
    if (document.querySelector('.orders-container')) {
        updateOrdersPagePrices();
        console.log('Orders page prices updated');
    }
}

/**
 * Main initialization
 */
document.addEventListener('DOMContentLoaded', function() {
    // Check if customer is logged in
    const customerId = localStorage.getItem('customer_id');
    
    if (!customerId) {
        // No customer_id found, redirect to login
        console.log('No customer_id found, redirecting to login...');
        window.location.href = '/landing/';
        return;
    }
    
    // Customer is logged in, fetch profile and orders data
    console.log('Customer logged in, fetching data for customer_id:', customerId);
    
    // Show loading states
    showLoadingState();
    
    // Fetch data
    fetchCustomerProfile(customerId);
    fetchOrdersSummary(customerId);
    
    // Set up logout button handler
    setupLogoutHandler();
    
    // Update prices based on page (legacy support)
    if (document.querySelector('.orders-list')) {
        updateOverviewOrderPrices();
    } else if (document.querySelector('.orders-container')) {
        updateOrdersPagePrices();
    }
    
    console.log('Account overview script initialized');
});

// ==================== LOADING STATE FUNCTIONS ====================

/**
 * Show loading indicators
 */
function showLoadingState() {
    // Show loading for stats
    const totalSpentElement = document.getElementById('totalSpent');
    const totalOrdersElement = document.getElementById('totalOrders');
    
    if (totalSpentElement) {
        totalSpentElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    }
    if (totalOrdersElement) {
        totalOrdersElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    }
    
    // Show loading for orders list
    const ordersListElement = document.getElementById('ordersList');
    if (ordersListElement) {
        ordersListElement.innerHTML = '<div style="text-align: center; padding: 2rem;"><i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: #4CAF50;"></i><p style="margin-top: 1rem; color: #666;">Loading orders...</p></div>';
    }
}

/**
 * Hide loading indicators
 */
function hideLoadingState() {
    // Loading will be hidden when data is updated
    console.log('Loading state hidden');
}

// ==================== API INTEGRATION FUNCTIONS ====================

/**
 * Fetch customer profile data from API
 */
async function fetchCustomerProfile(customerId) {
    try {
        const response = await fetch(`/api/customer/profile/?customer_id=${customerId}`);
        const result = await response.json();
        
        if (response.ok && result.status === 'success') {
            console.log('Customer profile fetched successfully:', result.data);
            updateProfileUI(result.data);
            hideLoadingState();
        } else {
            console.error('Failed to fetch customer profile:', result.message);
            
            // Check if customer not found (404)
            if (response.status === 404) {
                handleAuthError('Customer not found. Please login again.');
            } else {
                // Keep hardcoded values as fallback
                hideLoadingState();
            }
        }
    } catch (error) {
        console.error('Error fetching customer profile:', error);
        handleNetworkError('Failed to load profile data');
        hideLoadingState();
    }
}

/**
 * Fetch customer orders summary from API
 */
async function fetchOrdersSummary(customerId) {
    try {
        const response = await fetch(`/api/customer/orders-summary/?customer_id=${customerId}&limit=3`);
        const result = await response.json();
        
        if (response.ok && result.status === 'success') {
            console.log('Orders summary fetched successfully:', result.data);
            updateOrdersUI(result.data);
        } else {
            console.error('Failed to fetch orders summary:', result.message);
            
            // Check if customer not found (404)
            if (response.status === 404) {
                handleAuthError('Customer not found. Please login again.');
            } else {
                // Keep hardcoded orders as fallback
                const ordersListElement = document.getElementById('ordersList');
                if (ordersListElement && ordersListElement.children.length === 0) {
                    ordersListElement.innerHTML = '<p style="text-align: center; padding: 2rem; color: #666;">Unable to load orders</p>';
                }
            }
        }
    } catch (error) {
        console.error('Error fetching orders summary:', error);
        handleNetworkError('Failed to load orders');
        
        // Show error message in orders list
        const ordersListElement = document.getElementById('ordersList');
        if (ordersListElement) {
            ordersListElement.innerHTML = '<p style="text-align: center; padding: 2rem; color: #666;">Unable to load orders</p>';
        }
    }
}

// ==================== ERROR HANDLING FUNCTIONS ====================

/**
 * Handle authentication errors (invalid customer_id)
 */
function handleAuthError(message) {
    console.error('Authentication error:', message);
    
    // Clear localStorage
    localStorage.removeItem('customer_id');
    localStorage.removeItem('customer_name');
    localStorage.removeItem('customer_email');
    
    // Show alert
    alert(message);
    
    // Redirect to login
    window.location.href = '/landing/';
}

/**
 * Handle network errors
 */
function handleNetworkError(message) {
    console.error('Network error:', message);
    // Could show a notification here
    // For now, just log it and keep fallback values
}

// ==================== UI UPDATE FUNCTIONS ====================

/**
 * Update profile UI with data from API
 */
function updateProfileUI(data) {
    // Update profile name (both sidebar and welcome message)
    const profileNameElements = document.querySelectorAll('#profileName, .profile-name');
    profileNameElements.forEach(el => {
        if (el) el.textContent = data.name.toUpperCase();
    });
    
    // Update profile email
    const profileEmailElement = document.getElementById('profileEmail');
    if (profileEmailElement) {
        profileEmailElement.textContent = data.email.toUpperCase();
    }
    
    // Generate and update avatar
    generateAvatar(data.name);
    
    // Update welcome message with first name
    const welcomeTitle = document.querySelector('.welcome-title');
    if (welcomeTitle) {
        const firstName = data.name.split(' ')[0];
        welcomeTitle.textContent = `WELCOME BACK, ${firstName.toUpperCase()}! 👋`;
    }
    
    // Update total spent
    const totalSpentElement = document.getElementById('totalSpent');
    if (totalSpentElement) {
        totalSpentElement.textContent = formatCurrency(data.total_spent);
    }
    
    // Update total orders
    const totalOrdersElement = document.getElementById('totalOrders');
    if (totalOrdersElement) {
        totalOrdersElement.textContent = data.total_orders;
    }
    
    // Update sidebar total orders
    const sidebarTotalOrdersElement = document.getElementById('sidebarTotalOrders');
    if (sidebarTotalOrdersElement) {
        sidebarTotalOrdersElement.textContent = `${data.total_orders} Orders`;
    }
    
    // Update growth percentage
    const growthPercentageElement = document.getElementById('growthPercentage');
    if (growthPercentageElement && data.growth_percentage !== null) {
        const growth = data.growth_percentage;
        if (growth > 0) {
            growthPercentageElement.textContent = `+${growth}%`;
        } else if (growth < 0) {
            growthPercentageElement.textContent = `${growth}%`;
        } else {
            growthPercentageElement.textContent = '0%';
        }
    }
    
    console.log('Profile UI updated successfully');
}

/**
 * Generate and display avatar initials
 */
function generateAvatar(name) {
    if (!name) return;
    
    // Extract initials (first letter of first two words)
    const words = name.trim().split(' ');
    let initials = '';
    
    if (words.length >= 2) {
        initials = words[0].charAt(0).toUpperCase() + words[1].charAt(0).toUpperCase();
    } else if (words.length === 1) {
        initials = words[0].charAt(0).toUpperCase() + words[0].charAt(1).toUpperCase();
    }
    
    // Update avatar in sidebar
    const profileAvatar = document.getElementById('profileAvatar');
    if (profileAvatar) {
        profileAvatar.innerHTML = `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: bold; color: #4CAF50;">${initials}</div>`;
    }
    
    console.log('Avatar generated:', initials);
}

/**
 * Update orders list UI with data from API
 */
function updateOrdersUI(orders) {
    const ordersListElement = document.getElementById('ordersList');
    if (!ordersListElement) {
        console.error('Orders list element not found');
        return;
    }
    
    // Clear existing orders
    ordersListElement.innerHTML = '';
    
    // Check if there are orders
    if (!orders || orders.length === 0) {
        ordersListElement.innerHTML = '<p style="text-align: center; padding: 2rem; color: #666;">No orders yet</p>';
        return;
    }
    
    // Render each order
    orders.forEach(order => {
        const orderHTML = renderOrderItem(order);
        ordersListElement.insertAdjacentHTML('beforeend', orderHTML);
    });
    
    console.log('Orders UI updated successfully');
}

/**
 * Render a single order item HTML
 */
function renderOrderItem(order) {
    // Determine status class and icon
    let statusClass = '';
    let iconClass = 'fa-box';
    
    const status = order.status.toLowerCase();
    if (status === 'delivered') {
        statusClass = 'delivered';
        iconClass = 'fa-box';
    } else if (status === 'shipped' || status === 'in transit') {
        statusClass = 'transit';
        iconClass = 'fa-truck';
    } else if (status === 'pending') {
        statusClass = 'pending';
        iconClass = 'fa-clock';
    } else if (status === 'cancelled') {
        statusClass = 'cancelled';
        iconClass = 'fa-times-circle';
    } else if (status === 'confirmed') {
        statusClass = 'confirmed';
        iconClass = 'fa-check-circle';
    }
    
    return `
        <div class="order-item">
            <div class="order-icon-wrapper ${statusClass}">
                <i class="fas ${iconClass}"></i>
            </div>
            <div class="order-details">
                <div class="order-id-row">
                    <span class="order-id">ORD-${order.order_id}</span>
                    <span class="order-status ${statusClass}">${order.status_display}</span>
                </div>
                <div class="order-items-text">${order.product_names}</div>
            </div>
            <div class="order-meta">
                <div class="order-price">${formatCurrency(order.total_amount)}</div>
                <div class="order-date">${order.order_date_formatted}</div>
            </div>
        </div>
    `;
}

// ==================== LOGOUT FUNCTIONALITY ====================

/**
 * Setup logout button handler
 * Note: Logout handler is now managed by account.js centralized function
 */
function setupLogoutHandler() {
    // Logout button handler is managed by account.js
    // No need to attach handler here as account.js loads after and handles it
    console.log('Logout handler managed by account.js centralized function');
}

/**
 * Handle logout action
 * Note: This function is deprecated - use window.accountFunctions.handleAccountLogout from account.js
 */
function handleLogout() {
    // Use centralized logout function from account.js if available
    if (window.accountFunctions && window.accountFunctions.handleAccountLogout) {
        window.accountFunctions.handleAccountLogout();
    } else {
        // Fallback for legacy support
        console.warn('Centralized logout function not available, using fallback');
        const confirmLogout = confirm('Are you sure you want to logout?');
        
        if (confirmLogout) {
            localStorage.removeItem('customer_id');
            localStorage.removeItem('customer_name');
            localStorage.removeItem('customer_email');
            localStorage.removeItem('farm2home_cart');
            localStorage.removeItem('checkoutCart');
            
            console.log('User logged out, localStorage cleared');
            alert('You have been logged out successfully');
            window.location.href = '/landing/';
        }
    }
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Format currency to Rs.X,XXX format
 */
function formatCurrency(amount) {
    // Convert to number if it's a string
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    // Format with thousand separators
    const formatted = num.toLocaleString('en-PK', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
    
    return `Rs.${formatted}`;
}

/**
 * Format date to 'Nov 28, 2024' format
 */
function formatDate(isoDate) {
    const date = new Date(isoDate);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.accountOverviewFunctions = {
        getProductById,
        calculateOrderTotal,
        getProductNames,
        updateOverviewOrderPrices,
        updateOrdersPagePrices,
        fetchCustomerProfile,
        fetchOrdersSummary,
        updateProfileUI,
        updateOrdersUI,
        renderOrderItem,
        formatCurrency,
        formatDate,
        generateAvatar,
        handleLogout,
        showLoadingState,
        hideLoadingState
    };
}
