// ===============================================
// FARM2HOME - PRODUCT CATALOG PAGE
// Handles product display, filtering, cart, and backend integration
// ===============================================

// ===============================================
// PRODUCTS DATA - LOADED FROM BACKEND API
// ===============================================
let productsData = [];  // Will be populated from backend API

// ===============================================
// STATE MANAGEMENT
// ===============================================
let cart = [];
let filteredProducts = [];
let productQuantities = {};
let currentView = localStorage.getItem('preferredView') || 'grid';
let itemsPerPage = 6;
let isLoadingProducts = false;

// ===============================================
// INITIALIZATION
// ===============================================
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🌾 Farm2Home Catalog Initializing...');
    
    // Clear old localStorage cart to prevent cross-account cart issues
    localStorage.removeItem('farm2home_cart');
    
    // Update auth UI (login button vs profile icon)
    updateCatalogAuthUI();
    
    // Load products from backend
    await loadProductsFromBackend();
    
    // Initialize the app once products are loaded
    if (productsData.length > 0) {
        initializeApp();
    } else {
        showErrorState();
    }
});

// ===============================================
// BACKEND DATA LOADING
// ===============================================
async function loadProductsFromBackend() {
    console.log('📡 Fetching products from backend API...');
    
    const loadingSpinner = document.getElementById('loadingSpinner');
    const productsGrid = document.getElementById('productsGrid');
    const productsList = document.getElementById('productsList');
    
    // Show loading state
    if (loadingSpinner) {
        loadingSpinner.classList.remove('hidden');
    }
    if (productsGrid) {
        productsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px;"><i class="fas fa-spinner fa-spin" style="font-size: 36px; color: var(--primary-green);"></i><p style="margin-top: 16px; color: var(--text-gray);">Loading fresh products...</p></div>';
    }
    
    isLoadingProducts = true;
    
    try {
        // Fetch products from backend API
        const response = await fetch('/api/catalog/products/');
        
        // Check if response is ok
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
        }
        
        // Parse JSON response
        const data = await response.json();
        
        // Validate data
        if (!Array.isArray(data)) {
            throw new Error('Invalid data format: Expected an array of products');
        }
        
        // Store products data
        productsData = data;
        filteredProducts = [...productsData];
        
        console.log(`✅ Successfully loaded ${productsData.length} products from backend`);
        
        // Hide loading spinner
        if (loadingSpinner) {
            loadingSpinner.classList.add('hidden');
        }
        
        isLoadingProducts = false;
        
        // Show success notification
        if (typeof notifications !== 'undefined') {
            notifications.success(`Loaded ${productsData.length} fresh products!`);
        }
        
        return true;
        
    } catch (error) {
        console.error('❌ Error loading products from backend:', error);
        
        isLoadingProducts = false;
        
        // Hide loading spinner
        if (loadingSpinner) {
            loadingSpinner.classList.add('hidden');
        }
        
        // Show error in grid
        if (productsGrid) {
            productsGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: #e74c3c; margin-bottom: 16px;"></i>
                    <h3 style="color: var(--text-dark); margin-bottom: 8px;">Failed to Load Products</h3>
                    <p style="color: var(--text-gray); margin-bottom: 20px;">${error.message}</p>
                    <button onclick="location.reload()" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 8px;">
                        <i class="fas fa-sync-alt"></i> Retry
                    </button>
                </div>
            `;
        }
        
        // Show error notification
        if (typeof notifications !== 'undefined') {
            notifications.error('Failed to load products. Please refresh the page.');
        }
        
        return false;
    }
}

function showErrorState() {
    console.error('⚠️ No products loaded. Showing error state.');
    
    const productsGrid = document.getElementById('productsGrid');
    if (productsGrid) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <i class="fas fa-box-open" style="font-size: 48px; color: var(--text-gray); margin-bottom: 16px;"></i>
                <h3 style="color: var(--text-dark); margin-bottom: 8px;">No Products Available</h3>
                <p style="color: var(--text-gray); margin-bottom: 20px;">Unable to load products at this time.</p>
                <button onclick="location.reload()" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 8px;">
                    <i class="fas fa-sync-alt"></i> Refresh Page
                </button>
            </div>
        `;
    }
}

function initializeApp() {
    console.log('🚀 Initializing Farm2Home app...');
    
    // Initialize product quantities
    productsData.forEach(product => {
        productQuantities[product.id] = 0;
    });
    console.log(`📦 Product quantities initialized: ${Object.keys(productQuantities).length} products`);
    
    // Update current season indicator
    updateCurrentSeasonIndicator();
    
    // Update filter counts based on active products
    updateFilterCounts();
    
    // Render products
    renderProducts(productsData);
    updateProductCount();
    
    // Set initial view
    setCurrentView(currentView);
    
    // Initialize grid columns to default (4 columns)
    const productsGrid = document.getElementById('productsGrid');
    if (productsGrid) {
        productsGrid.style.gridTemplateColumns = 'repeat(4, 1fr)';
    }
    
    // Set up event listeners
    setupEventListeners();
    
    // Load cart from backend if user is logged in
    loadCartFromBackend();
    
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
    
    window.reloadProducts = async () => {
        await loadProductsFromBackend();
        if (productsData.length > 0) {
            // Re-initialize product quantities
            productsData.forEach(product => {
                if (!productQuantities[product.id]) {
                    productQuantities[product.id] = 0;
                }
            });
            // Update filter counts
            updateFilterCounts();
            // Re-render products
            renderProducts(productsData);
            updateProductCount();
            console.log('✅ Products reloaded and filter counts updated');
        }
    };
    
    // Test function to simulate different months/seasons
    window.testSeason = (month) => {
        if (month < 0 || month > 11) {
            console.error('Invalid month. Use 0-11 (0=January, 11=December)');
            return;
        }
        const originalGetMonth = Date.prototype.getMonth;
        Date.prototype.getMonth = function() { return month; };
        updateCurrentSeasonIndicator();
        Date.prototype.getMonth = originalGetMonth;
        console.log(`Testing season for month ${month + 1}`);
    };
    
    console.log('✅ App initialization complete');
    console.log('💡 Debug commands: window.reloadProducts(), window.testSeason(month), window.viewCart()');
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
                if (typeof notifications !== 'undefined') {
                    notifications.warning('Your cart is empty. Add some items before checking out.');
                } else {
                    alert('Your cart is empty. Add some items before checking out.');
                }
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
        clearCartBtn.addEventListener('click', async function() {
            if (cart.length === 0) {
                if (typeof notifications !== 'undefined') {
                    notifications.info('Your cart is already empty.');
                } else {
                    alert('Your cart is already empty.');
                }
                return;
            }
            
            // Show custom confirmation modal
            showClearCartConfirmation(async () => {
                const customerId = localStorage.getItem('customer_id');
                
                if (customerId) {
                    try {
                        // Call backend API to clear cart from database
                        const response = await fetch(`/api/cart/clear/?customer_id=${customerId}`, {
                            method: 'DELETE',
                            headers: {
                                'X-CSRFToken': getCsrfToken()
                            }
                        });
                        
                        if (response.ok) {
                            // Reload cart from backend to sync UI
                            await loadCartFromBackend();
                            if (typeof notifications !== 'undefined') {
                                notifications.success('Cart cleared successfully!');
                            }
                        } else {
                            throw new Error('Failed to clear cart');
                        }
                    } catch (error) {
                        console.error('Error clearing cart:', error);
                        if (typeof notifications !== 'undefined') {
                            notifications.error('Failed to clear cart. Please try again.');
                        }
                    }
                } else {
                    // No customer logged in, just clear local cart
                    cart = [];
                    renderCartItems();
                    updateCartCount();
                    if (typeof notifications !== 'undefined') {
                        notifications.success('Cart cleared successfully!');
                    }
                }
            });
        });
        console.log('Clear cart button listener attached');
    }
}

// ===============================================
// UPDATE FILTER COUNTS
// ===============================================
function updateFilterCounts() {
    // Only count active products (products that are loaded from backend)
    const activeProducts = productsData;
    
    // Count by season
    const winterCount = activeProducts.filter(p => p.season === 'winter').length;
    const summerCount = activeProducts.filter(p => p.season === 'summer').length;
    const yearRoundCount = activeProducts.filter(p => p.season === 'year-round').length;
    
    // Count by category
    const vegetablesCount = activeProducts.filter(p => p.category === 'vegetables').length;
    const fruitsCount = activeProducts.filter(p => p.category === 'fruits').length;
    const herbsCount = activeProducts.filter(p => p.category === 'herbs').length;
    
    // Update the DOM elements
    const countWinter = document.getElementById('count-winter');
    const countSummer = document.getElementById('count-summer');
    const countYearRound = document.getElementById('count-year-round');
    const countVegetables = document.getElementById('count-vegetables');
    const countFruits = document.getElementById('count-fruits');
    const countHerbs = document.getElementById('count-herbs');
    
    if (countWinter) countWinter.textContent = `(${winterCount})`;
    if (countSummer) countSummer.textContent = `(${summerCount})`;
    if (countYearRound) countYearRound.textContent = `(${yearRoundCount})`;
    if (countVegetables) countVegetables.textContent = `(${vegetablesCount})`;
    if (countFruits) countFruits.textContent = `(${fruitsCount})`;
    if (countHerbs) countHerbs.textContent = `(${herbsCount})`;
    
    console.log('📊 Filter counts updated:', {
        winter: winterCount,
        summer: summerCount,
        yearRound: yearRoundCount,
        vegetables: vegetablesCount,
        fruits: fruitsCount,
        herbs: herbsCount
    });
}

// ===============================================
// UPDATE CURRENT SEASON INDICATOR
// ===============================================
function updateCurrentSeasonIndicator() {
    const seasonIndicator = document.getElementById('currentSeasonIndicator');
    if (!seasonIndicator) return;
    
    // Get current month (0 = January, 11 = December)
    const currentMonth = new Date().getMonth();
    
    // Define seasons based on Pakistani climate
    // Winter: November (10) to February (1)
    // Summer: March (2) to October (9)
    let currentSeason, seasonIcon, seasonText, seasonClass;
    
    if (currentMonth >= 10 || currentMonth <= 1) {
        // Winter season (November to February)
        currentSeason = 'winter';
        seasonIcon = 'fas fa-snowflake';
        seasonText = 'Currently Winter Season';
        seasonClass = 'winter';
    } else {
        // Summer season (March to October)
        currentSeason = 'summer';
        seasonIcon = 'fas fa-sun';
        seasonText = 'Currently Summer Season';
        seasonClass = 'summer';
    }
    
    // Update the season indicator with icon and text
    seasonIndicator.innerHTML = `<i class="${seasonIcon}"></i> ${seasonText}`;
    
    // Add/remove season-specific class for styling
    seasonIndicator.classList.remove('winter', 'summer');
    seasonIndicator.classList.add(seasonClass);
    
    console.log(`🌡️ Current season: ${currentSeason} (Month: ${currentMonth + 1})`);
    
    return currentSeason;
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
    if (!productsGrid) {
        console.error('Products grid element not found');
        return;
    }
    
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
    
    // Stock status badge - only show if in stock
    const stockBadge = product.inStock ? '<span class="badge stock">In Stock</span>' : '';
    
    card.innerHTML = `
        <h3 class="product-name">${product.name}</h3>
        <p class="product-variety">${product.variety}</p>
        <div class="product-image-container">
            <div class="product-badges">
                ${stockBadge}
                ${seasonBadge}
            </div>
            <img src="/static/${product.image}" alt="${product.name}" class="product-image" onerror="this.src='https://via.placeholder.com/200/6b8e23/ffffff?text=${product.name}'">
        </div>
        <div class="product-price">Rs. ${Math.round(product.price)}/kg</div>
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
            e.stopPropagation();
            decreaseQuantity(product.id);
        });
        increaseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            increaseQuantity(product.id);
        });
        addToCartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
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
    
    const quantity = productQuantities[productId] || 0;
    
    // Update all quantity displays for this product (grid and list view)
    const quantityElements = document.querySelectorAll(`[id="qty-${productId}"]`);
    if (quantityElements.length > 0) {
        quantityElements.forEach(element => {
            element.textContent = quantity;
        });
        console.log(`[updateQuantityDisplay] Updated ${quantityElements.length} element(s) for product ${productId} to quantity ${quantity}`);
    } else {
        console.warn(`[updateQuantityDisplay] Quantity element NOT FOUND for product ${productId}`);
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
        if (typeof notifications !== 'undefined') {
            notifications.warning('Please select quantity first!');
        } else {
            alert('Please select quantity first!');
        }
        return;
    }
    
    // Find product by ID
    const product = productsData.find(p => p.id === productId);
    
    if (!product) {
        console.error(`Product not found with ID: ${productId}`);
        if (typeof notifications !== 'undefined') {
            notifications.error('Product not found!');
        } else {
            alert('Product not found!');
        }
        return;
    }
    
    console.log('Found product:', product.name);
    
    // Get customer ID from localStorage
    const customerId = localStorage.getItem('customer_id');
    
    if (!customerId) {
        // User not logged in - show login modal
        if (typeof notifications !== 'undefined') {
            notifications.error('Please log in to add items to cart');
        }
        // Open login modal
        openLoginModal();
        return;
    }
    
    // Send to backend API
    addToCartBackend(customerId, productId, quantity, product.name);
}

async function addToCartBackend(customerId, productId, quantity, productName) {
    try {
        const response = await fetch('/api/cart/add_item/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfToken()
            },
            body: JSON.stringify({
                customer_id: customerId,
                product_id: productId,
                quantity: quantity
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Success - item added to backend cart
            console.log('Item added to backend cart:', data);
            
            // Show feedback notification
            showCartFeedback(productName, quantity);
            
            // Reset quantity
            productQuantities[productId] = 0;
            updateQuantityDisplay(productId);
            
            // Reload cart from backend to update UI
            await loadCartFromBackend();
            
            // Update cart count
            updateCartCountFromBackend(customerId);
            
            // Show side cart after a small delay
            setTimeout(() => {
                openCart();
            }, 500);
        } else {
            throw new Error(data.error || 'Failed to add item to cart');
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        if (typeof notifications !== 'undefined') {
            notifications.error('Failed to add item to cart. Please try again.');
        }
    }
}

// Removed updateLocalCart - cart is now only stored in backend

async function updateCartCountFromBackend(customerId) {
    try {
        const response = await fetch(`/api/cart/summary/?customer_id=${customerId}`);
        const data = await response.json();
        
        if (response.ok) {
            const totalItems = data.total_items || 0;
            console.log('updateCartCount from backend: Total items =', totalItems);
            const cartCountElem = document.getElementById('cartCount');
            if (cartCountElem) {
                cartCountElem.textContent = totalItems;
                console.log('Cart count updated in UI from backend');
            }
        }
    } catch (error) {
        console.error('Error fetching cart count:', error);
        // Fallback to local cart count
        updateCartCount();
    }
}

function getCsrfToken() {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, 10) === 'csrftoken=') {
                cookieValue = decodeURIComponent(cookie.substring(10));
                break;
            }
        }
    }
    return cookieValue;
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
    if (typeof notifications !== 'undefined') {
        notifications.success(`✅ Added ${quantity} kg of ${productName} to cart!`);
    } else {
        console.log(`✅ Added ${quantity} kg of ${productName} to cart!`);
    }
}

// ===============================================
// CART BACKEND INTEGRATION
// ===============================================
async function loadCartFromBackend() {
    const customerId = localStorage.getItem('customer_id');
    if (!customerId) {
        console.log('No customer logged in, skipping cart load');
        cart = [];
        return;
    }
    
    try {
        const response = await fetch(`/api/cart/summary/?customer_id=${customerId}`);
        const data = await response.json();
        
        if (response.ok && data.items) {
            // Transform backend cart items to frontend format
            cart = data.items.map(item => ({
                id: item.product,
                name: item.product_name,
                variety: item.product_category,
                price: parseFloat(item.product_price),
                quantity: item.quantity,
                category: item.product_category,
                image: item.product_image || 'images/' + item.product_category + '/' + item.product_name.toLowerCase() + '.png'
            }));
            console.log(`Loaded ${cart.length} items from backend cart`);
            updateCartCount();
            renderCartItems();
            updateCartProgress();
        }
    } catch (error) {
        console.error('Error loading cart from backend:', error);
        cart = [];
    }
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
            <div class="cart-empty">
                <i class="fas fa-shopping-basket"></i>
                <h3>Your cart is empty</h3>
                <p>Add some fresh produce to get started!</p>
            </div>
        `;
        updateCartSubtotal();
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-product-id="${item.id}">
            <img src="/static/${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.src='https://via.placeholder.com/70/6b8e23/ffffff?text=${item.name}'">
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
                <p class="cart-item-total">Rs. ${Math.round(item.price)} × ${item.quantity}</p>
            </div>
        </div>
    `).join('');
    
    updateCartSubtotal();
}

async function increaseCartQty(productId) {
    const customerId = localStorage.getItem('customer_id');
    if (!customerId) return;
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        try {
            const response = await fetch('/api/cart/add_item/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCsrfToken()
                },
                body: JSON.stringify({
                    customer_id: customerId,
                    product_id: productId,
                    quantity: 1
                })
            });
            
            if (response.ok) {
                // Reload cart from backend to sync UI
                await loadCartFromBackend();
            }
        } catch (error) {
            console.error('Error updating cart:', error);
        }
    }
}

async function decreaseCartQty(productId) {
    const customerId = localStorage.getItem('customer_id');
    if (!customerId) {
        console.log('No customer ID, cannot decrease cart quantity');
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    console.log('Decrease cart qty for product:', productId, 'Current item:', item);
    
    if (!item) {
        console.error('Item not found in cart');
        return;
    }
    
    if (item.quantity === 1) {
        // If quantity is 1, remove the item instead
        console.log('Quantity is 1, removing item instead');
        removeCartItem(productId);
        return;
    }
    
    if (item.quantity > 1) {
        try {
            console.log('Fetching cart from backend to find cart_id...');
            // Find the cart item in backend
            const cartResponse = await fetch(`/api/cart/?customer_id=${customerId}`);
            const cartData = await cartResponse.json();
            console.log('Backend cart data:', cartData);
            
            // cartData is paginated, so get results array
            const cartItems = cartData.results || cartData;
            const backendItem = cartItems.find(ci => ci.product === productId);
            console.log('Found backend item:', backendItem);
            
            if (backendItem) {
                const newQuantity = item.quantity - 1;
                console.log(`Updating backend: cart_id=${backendItem.cart_id}, new quantity=${newQuantity}`);
                
                // Update quantity in backend
                const response = await fetch(`/api/cart/${backendItem.cart_id}/`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCsrfToken()
                    },
                    body: JSON.stringify({
                        customer: customerId,
                        product: productId,
                        quantity: newQuantity
                    })
                });
                
                console.log('PUT response status:', response.status);
                const responseData = await response.json();
                console.log('PUT response data:', responseData);
                
                if (response.ok) {
                    console.log('Successfully decreased quantity in backend');
                    // Reload cart from backend to sync UI
                    await loadCartFromBackend();
                } else {
                    console.error('Failed to update backend:', responseData);
                    if (typeof notifications !== 'undefined') {
                        notifications.error('Failed to update cart. Please try again.');
                    }
                }
            } else {
                console.error('Backend item not found for product:', productId);
            }
        } catch (error) {
            console.error('Error updating cart:', error);
            if (typeof notifications !== 'undefined') {
                notifications.error('Error updating cart. Please try again.');
            }
        }
    }
}

async function removeCartItem(productId) {
    const customerId = localStorage.getItem('customer_id');
    if (!customerId) return;
    
    const index = cart.findIndex(item => item.id === productId);
    if (index !== -1) {
        const removedItem = cart[index];
        
        try {
            // Find the cart item in backend
            const cartResponse = await fetch(`/api/cart/?customer_id=${customerId}`);
            const cartData = await cartResponse.json();
            // cartData is paginated, so get results array
            const cartItems = cartData.results || cartData;
            const backendItem = cartItems.find(ci => ci.product === productId);
            
            if (backendItem) {
                // Delete from backend
                const response = await fetch(`/api/cart/${backendItem.cart_id}/`, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRFToken': getCsrfToken()
                    }
                });
                
                if (response.ok) {
                    // Reload cart from backend to sync UI
                    await loadCartFromBackend();
                    
                    if (typeof notifications !== 'undefined') {
                        notifications.info(`Removed ${removedItem.name} from cart`);
                    }
                }
            }
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    }
}

function updateCartSubtotal() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const subtotalElement = document.querySelector('.cart-subtotal-amount');
    const totalElement = document.querySelector('.total-amount');
    const itemCountElement = document.getElementById('cartItemCount');
    
    if (subtotalElement) {
        subtotalElement.textContent = `Rs. ${Math.round(subtotal)}`;
    }
    if (totalElement) {
        totalElement.textContent = `Rs. ${Math.round(subtotal)}`;
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
    const inSeasonNow = document.getElementById('inSeasonNow');
    if (inSeasonNow && inSeasonNow.checked) {
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
    const sortBy = document.getElementById('sortBy');
    if (!sortBy) return;
    
    const sortValue = sortBy.value;
    let sorted = [...filteredProducts];
    
    switch(sortValue) {
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
    const headerSearch = document.getElementById('headerSearch');
    const productSearch = document.getElementById('productSearch');
    
    if (event.target.id === 'headerSearch' && productSearch) {
        productSearch.value = searchTerm;
    } else if (event.target.id === 'productSearch' && headerSearch) {
        headerSearch.value = searchTerm;
    }
    
    // If search term is empty, show all filtered products
    if (searchTerm === '') {
        renderProducts(filteredProducts);
        updateProductCount();
        return;
    }
    
    // Filter by search term only
    const searched = filteredProducts.filter(product => {
        return product.name.toLowerCase().includes(searchTerm) ||
               product.variety.toLowerCase().includes(searchTerm);
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
    
    if (!gridViewBtn || !listViewBtn || !productsGrid || !productsList) {
        console.warn('View toggle elements not found');
        return;
    }
    
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
    if (!productsList) {
        console.error('Products list element not found');
        return;
    }
    
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
    const stockBadge = product.inStock ? '<span class="badge stock">In Stock</span>' : '';
    
    item.innerHTML = `
        <img src="/static/${product.image}" alt="${product.name}" class="product-list-image" onerror="this.src='https://via.placeholder.com/150/6b8e23/ffffff?text=${product.name}'">
        
        <div class="product-list-middle">
            <div class="product-list-name">${product.name}</div>
            <div class="product-list-variety">${product.variety}</div>
            <div class="product-list-badges">
                ${stockBadge}
                ${seasonBadge}
            </div>
            <div class="product-list-description">Fresh ${product.category} from Pakistani farms, ${product.season === 'year-round' ? 'available all year' : 'seasonal produce'}.</div>
        </div>
        
        <div class="product-list-right">
            <div class="product-list-price">Rs. ${Math.round(product.price)}/kg</div>
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
        decreaseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            decreaseQuantity(product.id);
        });
        
        increaseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            increaseQuantity(product.id);
        });
        
        addToCartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            addToCart(product.id);
        });
    } else {
        console.error('Could not find buttons for list item:', product.id);
    }
    
    return item;
}

// ===============================================
// CLEAR CART CONFIRMATION MODAL
// ===============================================
function showClearCartConfirmation(callback) {
    // Create modal backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'clear-cart-modal-backdrop';
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
    modal.className = 'clear-cart-modal';
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
    
    // Modal content
    modal.innerHTML = `
        <div style="margin-bottom: 1.5rem;">
            <div style="width: 64px; height: 64px; background: #fee; border-radius: 50%; 
                        display: flex; align-items: center; justify-content: center; 
                        margin: 0 auto 1rem;">
                <i class="fas fa-trash-alt" style="font-size: 28px; color: #dc3545;"></i>
            </div>
            <h3 style="color: #2d3748; margin: 0 0 0.5rem 0; font-size: 1.5rem; font-weight: 600;">
                Clear Cart?
            </h3>
            <p style="color: #718096; margin: 0; font-size: 0.95rem; line-height: 1.5;">
                Are you sure you want to remove all items from your cart? This action cannot be undone.
            </p>
        </div>
        <div style="display: flex; gap: 0.75rem; justify-content: center;">
            <button id="cancelClearCart" style="
                padding: 0.75rem 1.5rem;
                border: 2px solid #e2e8f0;
                background: white;
                color: #4a5568;
                border-radius: 8px;
                font-size: 0.95rem;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s;
                min-width: 100px;
            ">Cancel</button>
            <button id="confirmClearCart" style="
                padding: 0.75rem 1.5rem;
                border: none;
                background: #dc3545;
                color: white;
                border-radius: 8px;
                font-size: 0.95rem;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s;
                min-width: 100px;
            ">Clear All</button>
        </div>
    `;
    
    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);
    
    // Add hover effects
    const cancelBtn = modal.querySelector('#cancelClearCart');
    const confirmBtn = modal.querySelector('#confirmClearCart');
    
    cancelBtn.addEventListener('mouseenter', () => {
        cancelBtn.style.background = '#f7fafc';
        cancelBtn.style.borderColor = '#cbd5e0';
    });
    cancelBtn.addEventListener('mouseleave', () => {
        cancelBtn.style.background = 'white';
        cancelBtn.style.borderColor = '#e2e8f0';
    });
    
    confirmBtn.addEventListener('mouseenter', () => {
        confirmBtn.style.background = '#c82333';
    });
    confirmBtn.addEventListener('mouseleave', () => {
        confirmBtn.style.background = '#dc3545';
    });
    
    // Handle button clicks
    cancelBtn.addEventListener('click', () => {
        backdrop.style.animation = 'fadeOut 0.2s ease';
        setTimeout(() => backdrop.remove(), 200);
    });
    
    confirmBtn.addEventListener('click', () => {
        backdrop.style.animation = 'fadeOut 0.2s ease';
        setTimeout(() => backdrop.remove(), 200);
        callback();
    });
    
    // Close on backdrop click
    backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
            backdrop.style.animation = 'fadeOut 0.2s ease';
            setTimeout(() => backdrop.remove(), 200);
        }
    });
    
    // Add animation keyframes if not already added
    if (!document.querySelector('#clearCartModalAnimations')) {
        const style = document.createElement('style');
        style.id = 'clearCartModalAnimations';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
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
        `;
        document.head.appendChild(style);
    }
}

// ===============================================
// AUTH UI UPDATE FOR CATALOG PAGE
// ===============================================
function updateCatalogAuthUI() {
    const accountIcon = document.getElementById('accountIcon');
    const loginBtn = document.getElementById('catalogLoginBtn');
    const customerId = localStorage.getItem('customer_id');
    
    if (customerId) {
        // User is logged in - show profile icon
        if (accountIcon) accountIcon.style.display = 'block';
        if (loginBtn) loginBtn.style.display = 'none';
    } else {
        // User is logged out - show login button
        if (accountIcon) accountIcon.style.display = 'none';
        if (loginBtn) loginBtn.style.display = 'block';
    }
    
    // Add click handler to login button
    if (loginBtn) {
        loginBtn.onclick = function() {
            openLoginModal();
        };
    }
}

// ===============================================
// AUTH MODAL FUNCTIONS
// ===============================================
function openLoginModal() {
    const modal = document.getElementById('authModal');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (modal && loginForm && signupForm) {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function openSignupModal() {
    const modal = document.getElementById('authModal');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (modal && loginForm && signupForm) {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function switchToSignup() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm && signupForm) {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
    }
}

function switchToLogin() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm && signupForm) {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
    }
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.parentElement.querySelector('.toggle-password');
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Close modal on outside click
document.addEventListener('click', function(e) {
    const modal = document.getElementById('authModal');
    if (e.target === modal) {
        closeAuthModal();
    }
});

// ===============================================
// AUTH FORM HANDLERS
// ===============================================
// Initialize auth form handlers when DOM is ready
const loginFormElement = document.getElementById('loginFormElement');
const signupFormElement = document.getElementById('signupFormElement');

if (loginFormElement) {
    loginFormElement.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('login_email').value.trim();
        const password = document.getElementById('login_password').value.trim();
        
        if (!email || !password) {
            if (typeof notifications !== 'undefined') {
                notifications.error('Please fill in all fields');
            }
            return;
        }

        try {
            const response = await fetch('/api/auth/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCsrfToken()
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok && data.success === true) {
                localStorage.setItem('customer_id', data.customer_id);
                localStorage.setItem('customer_name', data.name);
                localStorage.setItem('customer_email', data.email);
                
                if (typeof notifications !== 'undefined') {
                    notifications.success('Login successful! Welcome back, ' + data.name);
                }
                
                closeAuthModal();
                updateCatalogAuthUI();
                
                // Reload cart from backend
                await loadCartFromBackend();
            } else {
                if (typeof notifications !== 'undefined') {
                    notifications.error(data.error || data.message || 'Login failed. Please check your credentials.');
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            if (typeof notifications !== 'undefined') {
                notifications.error('An error occurred during login. Please try again.');
            }
        }
    });
}

if (signupFormElement) {
    signupFormElement.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const fullName = document.getElementById('signup_fullname').value.trim();
        const email = document.getElementById('signup_email').value.trim();
        const phone = document.getElementById('signup_phone').value.trim();
        const address = document.getElementById('signup_address').value.trim();
        const password = document.getElementById('signup_password').value.trim();
        const confirmPassword = document.getElementById('signup_confirm_password').value.trim();
        const agreeTerms = document.getElementById('agreeTerms').checked;
        
        if (!fullName || !email || !phone || !address || !password || !confirmPassword) {
            if (typeof notifications !== 'undefined') {
                notifications.error('Please fill in all fields');
            }
            return;
        }
        
        if (password !== confirmPassword) {
            if (typeof notifications !== 'undefined') {
                notifications.error('Passwords do not match');
            }
            return;
        }
        
        if (!agreeTerms) {
            if (typeof notifications !== 'undefined') {
                notifications.error('Please agree to the Terms & Conditions');
            }
            return;
        }

        try {
            const response = await fetch('/api/auth/signup/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCsrfToken()
                },
                body: JSON.stringify({
                    name: fullName,
                    email: email,
                    phone: phone,
                    address: address,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok && data.success === true) {
                localStorage.setItem('customer_id', data.customer_id);
                localStorage.setItem('customer_name', data.name);
                localStorage.setItem('customer_email', data.email);
                
                if (typeof notifications !== 'undefined') {
                    notifications.success('Account created successfully! Welcome, ' + data.name);
                }
                
                closeAuthModal();
                updateCatalogAuthUI();
                
                // Reload cart from backend
                await loadCartFromBackend();
            } else {
                if (typeof notifications !== 'undefined') {
                    notifications.error(data.error || data.message || 'Signup failed. Please try again.');
                }
            }
        } catch (error) {
            console.error('Signup error:', error);
            if (typeof notifications !== 'undefined') {
                notifications.error('An error occurred during signup. Please try again.');
            }
        }
    });
}

// ===============================================
// MAKE FUNCTIONS GLOBALLY ACCESSIBLE
// For cart operations called from HTML onclick attributes
// ===============================================
window.increaseCartQty = increaseCartQty;
window.decreaseCartQty = decreaseCartQty;
window.removeCartItem = removeCartItem;
