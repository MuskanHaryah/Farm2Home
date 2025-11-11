// Orders Page Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize orders page
    initializeOrdersPage();
    initializeFilterTabs();
    initializeSearchFunctionality();
    initializeOrderActions();
});

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
    const ordersContainer = document.querySelector('.orders-container');
    const emptyState = document.querySelector('.empty-state');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');

            // Update active tab
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // Filter orders
            filterOrders(filter, ordersContainer, emptyState);
        });
    });

    // Set "All" tab as active by default
    if (filterTabs.length > 0) {
        filterTabs[0].classList.add('active');
    }
}

/**
 * Filter orders based on selected status
 */
function filterOrders(filter, container, emptyState) {
    const orderItems = container.querySelectorAll('.order-item');
    let visibleCount = 0;

    orderItems.forEach(order => {
        // Remove hidden class
        order.classList.remove('hidden');

        // Apply filter
        if (filter === 'all') {
            order.style.display = 'block';
            visibleCount++;
        } else {
            const orderStatus = order.getAttribute('data-status');
            if (orderStatus === filter) {
                order.style.display = 'block';
                visibleCount++;
            } else {
                order.style.display = 'none';
            }
        }
    });

    // Show/hide empty state
    if (emptyState) {
        if (visibleCount === 0) {
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
        }
    }

    // Add animation
    orderItems.forEach(order => {
        if (order.style.display !== 'none') {
            order.style.animation = 'none';
            setTimeout(() => {
                order.style.animation = 'fadeIn 0.5s ease';
            }, 10);
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
        const orderItems = document.querySelectorAll('.order-item');
        const emptyState = document.querySelector('.empty-state');
        let visibleCount = 0;

        orderItems.forEach(order => {
            // Get searchable content
            const orderNumber = order.querySelector('.order-number')?.textContent.toLowerCase() || '';
            const orderDate = order.querySelector('.order-date')?.textContent.toLowerCase() || '';
            const itemNames = Array.from(order.querySelectorAll('.item-name'))
                .map(el => el.textContent.toLowerCase())
                .join(' ');

            // Search in order number, date, and item names
            const isMatch = orderNumber.includes(searchTerm) ||
                          orderDate.includes(searchTerm) ||
                          itemNames.includes(searchTerm);

            if (searchTerm === '' || isMatch) {
                order.style.display = 'block';
                visibleCount++;
            } else {
                order.style.display = 'none';
            }
        });

        // Show/hide empty state
        if (emptyState) {
            if (visibleCount === 0 && searchTerm !== '') {
                emptyState.style.display = 'block';
            } else {
                emptyState.style.display = 'none';
            }
        }
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
}

/**
 * Show order details (modal or navigate to details page)
 */
function showOrderDetails(orderId) {
    console.log('Viewing details for order:', orderId);
    
    // TODO: Implement order details modal or navigate to details page
    // For now, show a simple notification
    notifications.info(`📦 Order #${orderId} details - To be implemented`);
    
    // Example: Could navigate to order-details.html
    // window.location.href = `order-details.html?id=${orderId}`;
}

/**
 * Handle reorder functionality
 */
function handleReorder(orderId) {
    console.log('Reordering from order:', orderId);
    
    // Get order items
    const orderCard = document.querySelector(`[data-order-id="${orderId}"]`);
    if (!orderCard) return;

    const itemNames = Array.from(orderCard.querySelectorAll('.item-name'))
        .map(el => el.textContent)
        .join(', ');

    // Show confirmation and redirect to catalog
    const confirmed = confirm(`Add items from Order #${orderId} to cart?\n\nItems: ${itemNames}`);
    
    if (confirmed) {
        // In a real app, would add items to cart
        // For now, navigate to product catalog
        window.location.href = '../prod-catalog/index.html';
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
