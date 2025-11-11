// ===============================================
// PRODUCTS DATA
// ===============================================
const productsData = [
    // VEGETABLES (24 items)
    {
        id: 1,
        name: 'Tomato',
        variety: 'Tamatar',
        price: 120,
        image: '/static/images/vegetables/tomato.png',
        category: 'vegetables',
        season: 'summer',
        inStock: true,
        inSeasonNow: true
    },
    {
        id: 2,
        name: 'Potato',
        variety: 'Aloo',
        price: 80,
        image: '/static/images/vegetables/potatoes.png',
        category: 'vegetables',
        season: 'year-round',
        inStock: true,
        inSeasonNow: true
    },
    {
        id: 3,
        name: 'Onion',
        variety: 'Pyaz',
        price: 100,
        image: '/static/images/vegetables/onions.png',
        category: 'vegetables',
        season: 'year-round',
        inStock: true,
        inSeasonNow: true
    },
    {
        id: 4,
        name: 'Okra',
        variety: 'Bhindi',
        price: 150,
        image: '/static/images/vegetables/okra.png',
        category: 'vegetables',
        season: 'summer',
        inStock: true,
        inSeasonNow: true
    },
    {
        id: 5,
        name: 'Bitter Gourd',
        variety: 'Karela',
        price: 110,
        image: '/static/images/vegetables/bitter-gourd.png',
        category: 'vegetables',
        season: 'summer',
        inStock: true,
        inSeasonNow: true
    },
    {
        id: 6,
        name: 'Carrot',
        variety: 'Gajar',
        price: 95,
        image: '/static/images/vegetables/carrot.png',
        category: 'vegetables',
        season: 'winter',
        inStock: true,
        inSeasonNow: false
    },
    {
        id: 7,
        name: 'Cucumber',
        variety: 'Kheera',
        price: 70,
        image: '/static/images/vegetables/cucumber.png',
        category: 'vegetables',
        season: 'summer',
        inStock: true,
        inSeasonNow: true
    },
    {
        id: 8,
        name: 'Bottle Gourd',
        variety: 'Lauki',
        price: 60,
        image: '/static/images/vegetables/bottle-gourd.png',
        category: 'vegetables',
        season: 'summer',
        inStock: true,
        inSeasonNow: true
    },
    {
        id: 9,
        name: 'Ridge Gourd',
        variety: 'Tori',
        price: 85,
        image: '/static/images/vegetables/ridge-gourd.png',
        category: 'vegetables',
        season: 'summer',
        inStock: true,
        inSeasonNow: true
    },
    {
        id: 10,
        name: 'Apple Gourd',
        variety: 'Tinda',
        price: 90,
        image: '/static/images/vegetables/applegourd.png',
        category: 'vegetables',
        season: 'summer',
        inStock: true,
        inSeasonNow: true
    },
    {
        id: 11,
        name: 'Pumpkin',
        variety: 'Kaddu',
        price: 75,
        image: '/static/images/vegetables/pumpkin.png',
        category: 'vegetables',
        season: 'year-round',
        inStock: true,
        inSeasonNow: true
    },
    {
        id: 12,
        name: 'Beetroot',
        variety: 'Chukandar',
        price: 110,
        image: '/static/images/vegetables/beetroot.png',
        category: 'vegetables',
        season: 'winter',
        inStock: true,
        inSeasonNow: false
    },
    {
        id: 13,
        name: 'Radish',
        variety: 'Mooli',
        price: 65,
        image: '/static/images/vegetables/radish.png',
        category: 'vegetables',
        season: 'winter',
        inStock: true,
        inSeasonNow: false
    },
    {
        id: 14,
        name: 'Turnip',
        variety: 'Shaljam',
        price: 70,
        image: '/static/images/vegetables/turnips.png',
        category: 'vegetables',
        season: 'winter',
        inStock: true,
        inSeasonNow: false
    },
    {
        id: 15,
        name: 'Green Beans',
        variety: 'Sem',
        price: 140,
        image: '/static/images/vegetables/green-beans.png',
        category: 'vegetables',
        season: 'year-round',
        inStock: true,
        inSeasonNow: true
    },
    {
        id: 16,
        name: 'Peas',
        variety: 'Matar',
        price: 130,
        image: '/static/images/vegetables/peas.png',
        category: 'vegetables',
        season: 'winter',
        inStock: true,
        inSeasonNow: false
    },
    {
        id: 17,
        name: 'Lettuce',
        variety: 'Salad Patta',
        price: 80,
        image: '/static/images/vegetables/lettuce.png',
        category: 'vegetables',
        season: 'winter',
        inStock: true,
        inSeasonNow: false
    },
    {
        id: 18,
        name: 'Green Onions',
        variety: 'Hara Pyaz',
        price: 50,
        image: '/static/images/vegetables/greenonins.png',
        category: 'vegetables',
        season: 'year-round',
        inStock: true,
        inSeasonNow: true
    },
    {
        id: 19,
        name: 'Red Chillies',
        variety: 'Lal Mirch',
        price: 350,
        image: '/static/images/vegetables/red-chillies.png',
        category: 'vegetables',
        season: 'year-round',
        inStock: true,
        inSeasonNow: true
    },
    {
        id: 20,
        name: 'Green Mustard',
        variety: 'Sarson',
        price: 90,
        image: '/static/images/vegetables/greenmustard.png',
        category: 'vegetables',
        season: 'winter',
        inStock: true,
        inSeasonNow: false
    },
    {
        id: 21,
        name: 'Sweet Potato',
        variety: 'Shakarkandi',
        price: 95,
        image: '/static/images/vegetables/sweetpotato.png',
        category: 'vegetables',
        season: 'winter',
        inStock: true,
        inSeasonNow: false
    },
    {
        id: 22,
        name: 'Taro Root',
        variety: 'Arvi',
        price: 110,
        image: '/static/images/vegetables/taroo-root.png',
        category: 'vegetables',
        season: 'year-round',
        inStock: true,
        inSeasonNow: true
    },
    {
        id: 23,
        name: 'Zucchini',
        variety: 'Zucchini',
        price: 180,
        image: '/static/images/vegetables/zucchini.png',
        category: 'vegetables',
        season: 'summer',
        inStock: true,
        inSeasonNow: true
    },
    {
        id: 24,
        name: 'Artichoke',
        variety: 'Artichoke',
        price: 400,
        image: '/static/images/vegetables/artichoke.png',
        category: 'vegetables',
        season: 'year-round',
        inStock: true,
        inSeasonNow: true
    },
    
    // FRUITS (24 items)
    {
        id: 25,
        name: 'Watermelon',
        variety: 'Tarbooz',
        price: 60,
        image: '/static/images/fruits/watermelon.png',
        category: 'fruits',
        season: 'summer',
        inStock: true,
        inSeasonNow: true
    },
    {
        id: 26,
        name: 'Melon',
        variety: 'Kharboza',
        price: 70,
        image: '/static/images/fruits/melon.png',
        category: 'fruits',
        season: 'summer',
        inStock: true,
        inSeasonNow: true
    },
    {
        id: 27,
        name: 'Sweet Melon',
        variety: 'Garam',
        price: 55,
        image: '/static/images/fruits/sweetmelon.png',
        category: 'fruits',
        season: 'summer',
        inStock: true,
        inSeasonNow: true
    },
    {
        id: 28,
        name: 'Guava',
        variety: 'Amrood',
        price: 120,
        image: '/static/images/fruits/guava.png',
        category: 'fruits',
        season: 'winter',
        inStock: true,
        inSeasonNow: false
    },
    {
        id: 29,
        name: 'Green Apple',
        variety: 'Hara Seb',
        price: 350,
        image: '/static/images/fruits/green-apples.png',
        category: 'fruits',
        season: 'winter',
        inStock: true,
        inSeasonNow: false
    },
    {
        id: 30,
        name: 'Pomegranate',
        variety: 'Anar',
        price: 280,
        image: '/static/images/fruits/pomegranate.png',
        category: 'fruits',
        season: 'winter',
        inStock: true,
        inSeasonNow: false
    },
    {
        id: 31,
        name: 'Papaya',
        variety: 'Papita',
        price: 90,
        image: '/static/images/fruits/papaya.png',
        category: 'fruits',
        season: 'year-round',
        inStock: true,
        inSeasonNow: true
    },
    {
        id: 32,
        name: 'Pineapple',
        variety: 'Ananas',
        price: 150,
        image: '/static/images/fruits/pineapple.png',
        category: 'fruits',
        season: 'summer',
        inStock: true,
        inSeasonNow: true
    },
    {
        id: 33,
        name: 'Grapefruit',
        variety: 'Chakotra',
        price: 200,
        image: '/static/images/fruits/grapefruit.png',
        category: 'fruits',
        season: 'winter',
        inStock: true,
        inSeasonNow: false
    },
    {
        id: 34,
        name: 'Mosambi',
        variety: 'Sweet Lime',
        price: 140,
        image: '/static/images/fruits/mosambi.png',
        category: 'fruits',
        season: 'winter',
        inStock: true,
        inSeasonNow: false
    },
    {
        id: 35,
        name: 'Apricot',
        variety: 'Khubani',
        price: 450,
        image: '/static/images/fruits/apricot.png',
        category: 'fruits',
        season: 'summer',
        inStock: true,
        inSeasonNow: true
    },
    {
        id: 36,
        name: 'Peaches',
        variety: 'Aaru',
        price: 320,
        image: '/static/images/fruits/peaches.png',
        category: 'fruits',
        season: 'summer',
        inStock: true,
        inSeasonNow: true
    },
    {
        id: 37,
        name: 'Plums',
        variety: 'Alubukhara',
        price: 380,
        image: '/static/images/fruits/plums.png',
        category: 'fruits',
        season: 'summer',
        inStock: true,
        inSeasonNow: true
    },
    {
        id: 38,
        name: 'Cherries',
        variety: 'Cherry',
        price: 850,
        image: '/static/images/fruits/cherries.png',
        category: 'fruits',
        season: 'summer',
        inStock: true,
        inSeasonNow: true
    },
    {
        id: 39,
        name: 'Lychee',
        variety: 'Leechi',
        price: 420,
        image: '/static/images/fruits/lychees.png',
        category: 'fruits',
        season: 'summer',
        inStock: true,
        inSeasonNow: true
    },
    {
        id: 40,
        name: 'Pear',
        variety: 'Nashpati',
        price: 250,
        image: '/static/images/fruits/pear.png',
        category: 'fruits',
        season: 'winter',
        inStock: true,
        inSeasonNow: false
    },
    {
        id: 41,
        name: 'Persimmon',
        variety: 'Japani Phal',
        price: 380,
        image: '/static/images/fruits/persimmon.png',
        category: 'fruits',
        season: 'winter',
        inStock: true,
        inSeasonNow: false
    },
    {
        id: 42,
        name: 'Avocado',
        variety: 'Avocado',
        price: 600,
        image: '/static/images/fruits/avacado.png',
        category: 'fruits',
        season: 'year-round',
        inStock: true,
        inSeasonNow: true
    },
    {
        id: 43,
        name: 'Jackfruit',
        variety: 'Kathal',
        price: 120,
        image: '/static/images/fruits/jackfruit.png',
        category: 'fruits',
        season: 'summer',
        inStock: true,
        inSeasonNow: true
    },
    {
        id: 44,
        name: 'Custard Apple',
        variety: 'Sharifa',
        price: 220,
        image: '/static/images/fruits/custard-apple.png',
        category: 'fruits',
        season: 'winter',
        inStock: true,
        inSeasonNow: false
    },
    {
        id: 45,
        name: 'Sapodilla',
        variety: 'Chikoo',
        price: 180,
        image: '/static/images/fruits/Sapodilla.png',
        category: 'fruits',
        season: 'year-round',
        inStock: true,
        inSeasonNow: true
    },
    {
        id: 46,
        name: 'Dates',
        variety: 'Khajoor',
        price: 550,
        image: '/static/images/fruits/dates.png',
        category: 'fruits',
        season: 'year-round',
        inStock: true,
        inSeasonNow: true
    },
    {
        id: 47,
        name: 'Figs',
        variety: 'Anjeer',
        price: 750,
        image: '/static/images/fruits/figs.png',
        category: 'fruits',
        season: 'summer',
        inStock: true,
        inSeasonNow: true
    },
    {
        id: 48,
        name: 'Mulberries',
        variety: 'Shahtoot',
        price: 320,
        image: '/static/images/fruits/mulberries.png',
        category: 'fruits',
        season: 'summer',
        inStock: true,
        inSeasonNow: true
    },
    
    // HERBS (8 items)
    {
        id: 49,
        name: 'Curry Leaves',
        variety: 'Kari Patta',
        price: 40,
        image: '/static/images/herbs/curry-leaves.png',
        category: 'herbs',
        season: 'year-round',
        inStock: true,
        inSeasonNow: true
    },
    {
        id: 50,
        name: 'Basil',
        variety: 'Tulsi',
        price: 60,
        image: '/static/images/herbs/basil.png',
        category: 'herbs',
        season: 'year-round',
        inStock: true,
        inSeasonNow: true
    },
    {
        id: 51,
        name: 'Ginger',
        variety: 'Adrak',
        price: 200,
        image: '/static/images/herbs/ginger.png',
        category: 'herbs',
        season: 'year-round',
        inStock: true,
        inSeasonNow: true
    },
    {
        id: 52,
        name: 'Lemongrass',
        variety: 'Lemon Ghaas',
        price: 80,
        image: '/static/images/herbs/lemon-grass.png',
        category: 'herbs',
        season: 'year-round',
        inStock: true,
        inSeasonNow: true
    },
    {
        id: 53,
        name: 'Fenugreek',
        variety: 'Methi',
        price: 50,
        image: '/static/images/herbs/fenugreek.png',
        category: 'herbs',
        season: 'winter',
        inStock: true,
        inSeasonNow: false
    },
    {
        id: 54,
        name: 'Celery',
        variety: 'Celery',
        price: 120,
        image: '/static/images/herbs/celery.png',
        category: 'herbs',
        season: 'year-round',
        inStock: true,
        inSeasonNow: true
    },
    {
        id: 55,
        name: 'Rosemary',
        variety: 'Rosemary',
        price: 150,
        image: '/static/images/herbs/rosemarry.png',
        category: 'herbs',
        season: 'year-round',
        inStock: true,
        inSeasonNow: true
    },
    {
        id: 56,
        name: 'Thyme',
        variety: 'Thyme',
        price: 140,
        image: '/static/images/herbs/thyme.png',
        category: 'herbs',
        season: 'year-round',
        inStock: true,
        inSeasonNow: true
    }
];

// ===============================================
// STATE MANAGEMENT
// ===============================================
let cart = [];
let filteredProducts = [...productsData];
let productQuantities = {};
let currentView = localStorage.getItem('preferredView') || 'grid';
let itemsPerPage = 6;

// ===============================================
// INITIALIZATION
// ===============================================
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    console.log('Initializing Farm2Home app...');
    
    // Initialize product quantities
    productsData.forEach(product => {
        productQuantities[product.id] = 0;
    });
    console.log('Product quantities initialized:', Object.keys(productQuantities).length, 'products');
    
    // Render products
    renderProducts(productsData);
    updateProductCount();
    
    // Set initial view
    setCurrentView(currentView);
    
    // Initialize grid columns to default (6 columns)
    const productsGrid = document.getElementById('productsGrid');
    if (productsGrid) {
        productsGrid.style.gridTemplateColumns = 'repeat(6, 1fr)';
    }
    
    // Set up event listeners
    setupEventListeners();
    
    // Make functions globally accessible for debugging
    window.testAddToCart = (productId) => {
        console.log('TEST: Attempting to add product', productId);
        productQuantities[productId] = 2;
        updateQuantityDisplay(productId);
        addToCart(productId);
    };
    
    window.viewCart = () => {
        console.log('Current cart:', cart);
        console.log('Product quantities:', productQuantities);
    };
    
    console.log('App initialization complete');
}

// ===============================================
// EVENT LISTENERS
// ===============================================
function setupEventListeners() {
    // Filter checkboxes - add change listeners
    document.querySelectorAll('input[name="season"]').forEach(cb => cb.addEventListener('change', applyFilters));
    document.querySelectorAll('input[name="category"]').forEach(cb => cb.addEventListener('change', applyFilters));
    document.querySelectorAll('input[name="price"]').forEach(cb => cb.addEventListener('change', applyFilters));
    
    const inSeasonCheckbox = document.getElementById('inSeasonNow');
    if (inSeasonCheckbox) {
        inSeasonCheckbox.addEventListener('change', applyFilters);
    }
    
    // Sort dropdown
    const sortBy = document.getElementById('sortBy');
    if (sortBy) {
        sortBy.addEventListener('change', handleSort);
    }
    
    // Search inputs
    const productSearch = document.getElementById('productSearch');
    const headerSearch = document.getElementById('headerSearch');
    if (productSearch) {
        productSearch.addEventListener('input', handleSearch);
    }
    if (headerSearch) {
        headerSearch.addEventListener('input', handleSearch);
    }
    
    // Search category dropdown - filter by category
    const searchCategory = document.getElementById('searchCategory');
    if (searchCategory) {
        searchCategory.addEventListener('change', handleSearch);
    }
    
    // View toggle buttons
    const gridViewBtn = document.getElementById('gridViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    if (gridViewBtn) {
        gridViewBtn.addEventListener('click', () => switchView('grid'));
    }
    if (listViewBtn) {
        listViewBtn.addEventListener('click', () => switchView('list'));
    }
    
    // Item count selector - changes number of columns/items per row
    const itemCount = document.getElementById('itemCount');
    if (itemCount) {
        itemCount.addEventListener('change', (e) => {
            const columns = parseInt(e.target.value);
            const productsGrid = document.getElementById('productsGrid');
            if (productsGrid) {
                productsGrid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
                console.log(`Grid columns changed to: ${columns}`);
            }
        });
    }
    
    // CART EVENT LISTENERS
    // Cart icon click - open cart
    const cartIconBtn = document.getElementById('cartIconBtn');
    if (cartIconBtn) {
        cartIconBtn.addEventListener('click', openCart);
        console.log('Cart icon listener attached');
    }
    
    // Cart close button
    const cartCloseBtn = document.getElementById('cartCloseBtn');
    if (cartCloseBtn) {
        cartCloseBtn.addEventListener('click', closeCart);
        console.log('Cart close button listener attached');
    }
    
    // Cart overlay click - close cart
    const cartOverlay = document.querySelector('.cart-overlay');
    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCart);
        console.log('Cart overlay listener attached');
    }
    
    // Checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                notifications.warning('Your cart is empty. Add some items before checking out.');
                return;
            }
            // Save cart to localStorage before redirecting
            localStorage.setItem('checkoutCart', JSON.stringify(cart));
            // Redirect to checkout page
            window.location.href = '/checkout/';
        });
        console.log('Checkout button listener attached');
    }
    
    // Clear cart button
    const clearCartBtn = document.getElementById('clearCartBtn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                notifications.info('Your cart is already empty.');
                return;
            }
            if (confirm('Are you sure you want to clear all items from your cart?')) {
                cart = [];
                renderCartItems();
                updateCartCount();
                notifications.success('Cart cleared successfully!');
            }
        });
        console.log('Clear cart button listener attached');
    }
}

// ===============================================
// RENDER PRODUCTS
// ===============================================
function renderProducts(products) {
    if (currentView === 'grid') {
        renderProductsGrid(products);
    } else {
        renderProductsList(products);
    }
}

function renderProductsGrid(products) {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';
    
    if (products.length === 0) {
        productsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: #999;"><h3>No products found</h3><p>Try adjusting your filters</p></div>';
        return;
    }
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.productId = product.id;
    
    const seasonBadge = getSeasonBadge(product.season);
    const quantity = productQuantities[product.id] || 0;
    
    card.innerHTML = `
        <h3 class="product-name">${product.name}</h3>
        <p class="product-variety">${product.variety}</p>
        <div class="product-image-container">
            <div class="product-badges">
                <span class="badge stock">In Stock</span>
                ${seasonBadge}
            </div>
            <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='https://via.placeholder.com/200/6b8e23/ffffff?text=${product.name}'">
        </div>
        <div class="product-price">Rs. ${product.price}/kg</div>
        <div class="quantity-selector">
            <button class="quantity-btn decrease-btn" data-product-id="${product.id}">−</button>
            <span class="quantity-value" id="qty-${product.id}">${quantity}</span>
            <button class="quantity-btn increase-btn" data-product-id="${product.id}">+</button>
        </div>
        <button class="add-to-cart-btn" data-product-id="${product.id}">Add to Cart</button>
    `;
    
    // Add event listeners after creating the element
    const decreaseBtn = card.querySelector('.decrease-btn');
    const increaseBtn = card.querySelector('.increase-btn');
    const addToCartBtn = card.querySelector('.add-to-cart-btn');
    
    if (decreaseBtn && increaseBtn && addToCartBtn) {
        decreaseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Decrease clicked for product:', product.id);
            decreaseQuantity(product.id);
        });
        increaseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Increase clicked for product:', product.id);
            increaseQuantity(product.id);
        });
        addToCartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Add to cart clicked for product:', product.id);
            addToCart(product.id);
        });
    } else {
        console.error('Could not find buttons for product:', product.id);
    }
    
    return card;
}

function getSeasonBadge(season) {
    const badges = {
        'summer': '<span class="badge season">☀️ Summer</span>',
        'winter': '<span class="badge season">❄️ Winter</span>',
        'year-round': '<span class="badge all-year">🔄 All Year</span>'
    };
    return badges[season] || '';
}

// ===============================================
// QUANTITY MANAGEMENT
// ===============================================
function increaseQuantity(productId) {
    // Ensure productId is valid
    if (!productId) {
        console.error('No productId provided to increaseQuantity');
        return;
    }
    
    // Convert to integer to match productsData IDs
    productId = parseInt(productId);
    if (isNaN(productId)) {
        console.error('Invalid productId:', productId);
        return;
    }
    
    const oldQty = productQuantities[productId] || 0;
    productQuantities[productId] = oldQty + 1;
    updateQuantityDisplay(productId);
    console.log(`[increaseQuantity] Product ${productId}: ${oldQty} → ${productQuantities[productId]}`);
}

function decreaseQuantity(productId) {
    // Ensure productId is valid
    if (!productId) {
        console.error('No productId provided to decreaseQuantity');
        return;
    }
    
    // Convert to integer to match productsData IDs
    productId = parseInt(productId);
    if (isNaN(productId)) {
        console.error('Invalid productId:', productId);
        return;
    }
    
    if (productQuantities[productId] > 0) {
        const oldQty = productQuantities[productId];
        productQuantities[productId]--;
        updateQuantityDisplay(productId);
        console.log(`[decreaseQuantity] Product ${productId}: ${oldQty} → ${productQuantities[productId]}`);
    } else {
        console.warn(`[decreaseQuantity] Cannot decrease product ${productId}: already at 0`);
    }
}

function updateQuantityDisplay(productId) {
    // Ensure productId is valid
    if (!productId) {
        console.error('No productId provided to updateQuantityDisplay');
        return;
    }
    
    // Convert to integer to match productsData IDs
    productId = parseInt(productId);
    if (isNaN(productId)) {
        console.error('Invalid productId:', productId);
        return;
    }
    
    const quantityElement = document.getElementById(`qty-${productId}`);
    if (quantityElement) {
        const quantity = productQuantities[productId] || 0;
        quantityElement.textContent = quantity;
        console.log(`[updateQuantityDisplay] Updated display for product ${productId}: now shows ${quantity}`);
    } else {
        console.warn(`[updateQuantityDisplay] Quantity element NOT FOUND for product ${productId}. ID searched: qty-${productId}`);
        console.warn('Available qty elements:', Array.from(document.querySelectorAll('[id^="qty-"]')).map(el => el.id));
    }
}

// ===============================================
// CART FUNCTIONALITY
// ===============================================
function addToCart(productId) {
    console.log('addToCart called with productId:', productId);
    
    // Ensure productId is valid and convert to integer
    if (!productId) {
        console.error('No productId provided to addToCart');
        return;
    }
    
    productId = parseInt(productId);
    if (isNaN(productId)) {
        console.error('Invalid productId:', productId);
        return;
    }
    
    const quantity = productQuantities[productId] || 0;
    console.log(`Quantity for product ${productId}:`, quantity);
    
    if (quantity === 0 || !quantity) {
        notifications.warning('Please select quantity first!');
        return;
    }
    
    // Find product by ID
    const product = productsData.find(p => p.id === productId);
    
    if (!product) {
        console.error(`Product not found with ID: ${productId}`);
        notifications.error('Product not found!');
        return;
    }
    
    console.log('Found product:', product.name);
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
        console.log(`Updated existing item. New quantity: ${existingItem.quantity}`);
    } else {
        cart.push({
            ...product,
            quantity: quantity
        });
        console.log('Added new item to cart');
    }
    
    // Show feedback notification
    showCartFeedback(product.name, quantity);
    
    // Reset quantity
    productQuantities[productId] = 0;
    updateQuantityDisplay(productId);
    
    // Update cart count
    updateCartCount();
    
    // Update cart display
    renderCartItems();
    updateCartProgress();
    
    // Show side cart after a small delay to see the notification
    setTimeout(() => {
        openCart();
    }, 500);
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    console.log('updateCartCount: Total items =', totalItems);
    const cartCountElem = document.getElementById('cartCount');
    if (cartCountElem) {
        cartCountElem.textContent = totalItems;
        console.log('Cart count updated in UI');
    } else {
        console.error('Cart count element not found!');
    }
}

function showCartFeedback(productName, quantity) {
    notifications.success(`✅ Added ${quantity} kg of ${productName} to cart!`);
}

// ===============================================
// SIDE CART FUNCTIONS
// ===============================================
function openCart() {
    const cartOverlay = document.querySelector('.cart-overlay');
    const sideCart = document.querySelector('.side-cart');
    
    if (cartOverlay && sideCart) {
        cartOverlay.classList.add('active');
        sideCart.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

function closeCart() {
    const cartOverlay = document.querySelector('.cart-overlay');
    const sideCart = document.querySelector('.side-cart');
    
    if (cartOverlay && sideCart) {
        cartOverlay.classList.remove('active');
        sideCart.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

function renderCartItems() {
    console.log('renderCartItems called. Cart contents:', cart);
    const cartItemsContainer = document.querySelector('.cart-items');
    
    if (!cartItemsContainer) {
        console.error('Cart items container not found!');
        return;
    }
    
    if (cart.length === 0) {
        console.log('Cart is empty, showing empty state');
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-basket"></i>
                <p>Your cart is empty</p>
                <p>Add some fresh produce to get started!</p>
            </div>
        `;
        updateCartSubtotal();
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-product-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h4 class="cart-item-name">${item.name}</h4>
                <p class="cart-item-variety">${item.variety}</p>
                <div class="cart-item-quantity">
                    <button class="qty-btn qty-decrease" onclick="decreaseCartQty(${item.id})">
                        <i class="fas fa-minus"></i>
                    </button>
                    <input type="number" value="${item.quantity}" min="1" readonly class="qty-input">
                    <button class="qty-btn qty-increase" onclick="increaseCartQty(${item.id})">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
            <div class="cart-item-right">
                <button class="remove-item" onclick="removeCartItem(${item.id})" title="Remove item">
                    <i class="fas fa-times"></i>
                </button>
                <p class="cart-item-total">Rs. ${item.price} × ${item.quantity}</p>
            </div>
        </div>
    `).join('');
    
    updateCartSubtotal();
}

function increaseCartQty(productId) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity++;
        renderCartItems();
        updateCartCount();
        updateCartProgress();
    }
}

function decreaseCartQty(productId) {
    const item = cart.find(item => item.id === productId);
    if (item && item.quantity > 1) {
        item.quantity--;
        renderCartItems();
        updateCartCount();
        updateCartProgress();
    }
}

function removeCartItem(productId) {
    const index = cart.findIndex(item => item.id === productId);
    if (index !== -1) {
        cart.splice(index, 1);
        renderCartItems();
        updateCartCount();
        updateCartProgress();
    }
}

function updateCartSubtotal() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const subtotalElement = document.querySelector('.cart-subtotal-amount');
    const totalElement = document.querySelector('.total-amount');
    const itemCountElement = document.getElementById('cartItemCount');
    
    if (subtotalElement) {
        subtotalElement.textContent = `Rs. ${subtotal}`;
    }
    if (totalElement) {
        totalElement.textContent = `Rs. ${subtotal}`;
    }
    if (itemCountElement) {
        itemCountElement.textContent = itemCount;
    }
}

function updateCartProgress() {
    // Progress bar removed from design
    // Can be re-enabled if needed in future
}

// ===============================================
// FILTERING
// ===============================================
function applyFilters() {
    let filtered = [...productsData];
    
    // In Season Now filter
    const inSeasonNow = document.getElementById('inSeasonNow').checked;
    if (inSeasonNow) {
        filtered = filtered.filter(p => p.inSeasonNow);
    }
    
    // Season filters
    const selectedSeasons = Array.from(document.querySelectorAll('input[name="season"]:checked'))
        .map(cb => cb.value);
    if (selectedSeasons.length > 0) {
        filtered = filtered.filter(p => selectedSeasons.includes(p.season));
    }
    
    // Category filters
    const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked'))
        .map(cb => cb.value);
    if (selectedCategories.length > 0) {
        filtered = filtered.filter(p => selectedCategories.includes(p.category));
    }
    
    // Price range filters
    const selectedPrices = Array.from(document.querySelectorAll('input[name="price"]:checked'))
        .map(cb => cb.value);
    if (selectedPrices.length > 0) {
        filtered = filtered.filter(p => {
            return selectedPrices.some(range => {
                if (range === '0-100') return p.price < 100;
                if (range === '100-200') return p.price >= 100 && p.price < 200;
                if (range === '200-500') return p.price >= 200 && p.price < 500;
                if (range === '500+') return p.price >= 500;
                return true;
            });
        });
    }
    
    filteredProducts = filtered;
    renderProducts(filteredProducts);
    updateProductCount();
}

// ===============================================
// SORTING
// ===============================================
function handleSort() {
    const sortBy = document.getElementById('sortBy').value;
    let sorted = [...filteredProducts];
    
    switch(sortBy) {
        case 'price-low':
            sorted.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sorted.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            sorted.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            sorted.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'date-new':
            sorted.sort((a, b) => b.id - a.id); // Sort by ID descending (newer first)
            break;
        default: // featured
            // Keep original order
            break;
    }
    
    renderProducts(sorted);
}

// ===============================================
// SEARCH
// ===============================================
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    
    // Sync both search inputs
    if (event.target.id === 'headerSearch') {
        document.getElementById('productSearch').value = searchTerm;
    } else if (event.target.id === 'productSearch') {
        document.getElementById('headerSearch').value = searchTerm;
    }
    
    // Get category filter from top search bar
    const searchCategory = document.getElementById('searchCategory');
    const selectedCategory = searchCategory ? searchCategory.value : 'all';
    
    // If search term is empty, show filtered products by category only
    if (searchTerm === '') {
        if (selectedCategory === 'all') {
            renderProducts(filteredProducts);
        } else {
            const categoryFiltered = filteredProducts.filter(product => product.category === selectedCategory);
            renderProducts(categoryFiltered);
            updateProductCount(categoryFiltered.length);
            return;
        }
        updateProductCount();
        return;
    }
    
    // Filter by both search term and category
    const searched = filteredProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                            product.variety.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });
    
    renderProducts(searched);
    updateProductCount(searched.length);
}

// ===============================================
// UPDATE PRODUCT COUNT
// ===============================================
function updateProductCount(count = null) {
    const displayCount = count !== null ? count : filteredProducts.length;
    const totalCount = productsData.length;
    const countElement = document.getElementById('productCount');
    if (countElement) {
        countElement.textContent = `Showing ${displayCount} of ${totalCount} products`;
    }
}

// ===============================================
// VIEW MANAGEMENT
// ===============================================
function switchView(view) {
    currentView = view;
    localStorage.setItem('preferredView', view);
    setCurrentView(view);
    renderProducts(filteredProducts);
    console.log(`View switched to: ${view}`);
}

function setCurrentView(view) {
    const gridViewBtn = document.getElementById('gridViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    const productsGrid = document.getElementById('productsGrid');
    const productsList = document.getElementById('productsList');
    
    if (view === 'grid') {
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
        productsGrid.classList.remove('hidden');
        productsList.classList.remove('active', 'hidden');
    } else {
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
        productsGrid.classList.add('hidden');
        productsList.classList.add('active');
    }
}

function renderProductsList(products) {
    const productsList = document.getElementById('productsList');
    productsList.innerHTML = '';
    
    if (products.length === 0) {
        productsList.innerHTML = '<div style="padding: 60px 20px; text-align: center; color: #999;"><h3>No products found</h3><p>Try adjusting your filters</p></div>';
        return;
    }
    
    products.forEach(product => {
        const listItem = createProductListItem(product);
        productsList.appendChild(listItem);
    });
}

function createProductListItem(product) {
    const item = document.createElement('div');
    item.className = 'product-list-item';
    item.dataset.productId = product.id;
    
    const quantity = productQuantities[product.id] || 0;
    const seasonBadge = getSeasonBadge(product.season);
    
    item.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-list-image" onerror="this.src='https://via.placeholder.com/150/6b8e23/ffffff?text=${product.name}'">
        
        <div class="product-list-middle">
            <div class="product-list-name">${product.name}</div>
            <div class="product-list-variety">${product.variety}</div>
            <div class="product-list-badges">
                <span class="badge stock">In Stock</span>
                ${seasonBadge}
            </div>
            <div class="product-list-description">Fresh ${product.category} from Pakistani farms, ${product.season === 'year-round' ? 'available all year' : 'seasonal produce'}.</div>
            <a href="#" class="product-list-link">View details →</a>
        </div>
        
        <div class="product-list-right">
            <div class="product-list-price">Rs. ${product.price}/kg</div>
            <div class="quantity-selector">
                <button class="quantity-btn decrease-btn" data-product-id="${product.id}">−</button>
                <span class="quantity-value" id="qty-${product.id}">${quantity}</span>
                <button class="quantity-btn increase-btn" data-product-id="${product.id}">+</button>
            </div>
            <button class="product-list-cart-btn" data-product-id="${product.id}">Add to Cart</button>
        </div>
    `;
    
    // Add event listeners after creating the element
    const decreaseBtn = item.querySelector('.decrease-btn');
    const increaseBtn = item.querySelector('.increase-btn');
    const addToCartBtn = item.querySelector('.product-list-cart-btn');
    
    if (decreaseBtn && increaseBtn && addToCartBtn) {
        console.log(`Attaching listeners for list product ${product.id}`, {
            hasBtns: true,
            decreaseBtnClass: decreaseBtn.className,
            increaseBtnClass: increaseBtn.className
        });
        
        decreaseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('List: Decrease clicked for product:', product.id, 'Current:', productQuantities[product.id]);
            decreaseQuantity(product.id);
        });
        
        increaseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('List: Increase clicked for product:', product.id, 'Current:', productQuantities[product.id]);
            increaseQuantity(product.id);
        });
        
        addToCartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('List: Add to cart clicked for product:', product.id);
            addToCart(product.id);
        });
    } else {
        console.error('Could not find buttons for list item:', product.id, {
            hasDecreaseBtn: !!decreaseBtn,
            hasIncreaseBtn: !!increaseBtn,
            hasAddToCartBtn: !!addToCartBtn
        });
    }
    
    return item;
}

// ===============================================
// INITIALIZATION & EVENT LISTENERS (kept for initial cart render)
// ===============================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart display on page load
    renderCartItems();
    updateCartProgress();
    console.log('Cart initialized on page load');
});
