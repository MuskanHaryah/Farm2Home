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
    // Update prices based on page
    if (document.querySelector('.orders-list')) {
        updateOverviewOrderPrices();
    } else if (document.querySelector('.orders-container')) {
        updateOrdersPagePrices();
    }
    
    console.log('Account overview script initialized');
});

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.accountOverviewFunctions = {
        getProductById,
        calculateOrderTotal,
        getProductNames,
        updateOverviewOrderPrices,
        updateOrdersPagePrices
    };
}
