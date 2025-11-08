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
        image: '../images/vegetables/tomato.png',
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
        image: '../images/vegetables/potatoes.png',
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
        image: '../images/vegetables/onions.png',
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
        image: '../images/vegetables/okra.png',
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
        image: '../images/vegetables/bitter-gourd.png',
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
        image: '../images/vegetables/carrot.png',
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
        image: '../images/vegetables/cucumber.png',
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
        image: '../images/vegetables/bottle-gourd.png',
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
        image: '../images/vegetables/ridge-gourd.png',
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
        image: '../images/vegetables/applegourd.png',
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
        image: '../images/vegetables/pumpkin.png',
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
        image: '../images/vegetables/beetroot.png',
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
        image: '../images/vegetables/radish.png',
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
        image: '../images/vegetables/turnips.png',
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
        image: '../images/vegetables/green-beans.png',
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
        image: '../images/vegetables/peas.png',
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
        image: '../images/vegetables/lettuce.png',
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
        image: '../images/vegetables/greenonins.png',
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
        image: '../images/vegetables/red-chillies.png',
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
        image: '../images/vegetables/greenmustard.png',
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
        image: '../images/vegetables/sweetpotato.png',
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
        image: '../images/vegetables/taroo-root.png',
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
        image: '../images/vegetables/zucchini.png',
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
        image: '../images/vegetables/artichoke.png',
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
        image: '../images/fruits/watermelon.png',
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
        image: '../images/fruits/melon.png',
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
        image: '../images/fruits/sweetmelon.png',
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
        image: '../images/fruits/guava.png',
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
        image: '../images/fruits/green-apples.png',
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
        image: '../images/fruits/pomegranate.png',
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
        image: '../images/fruits/papaya.png',
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
        image: '../images/fruits/pineapple.png',
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
        image: '../images/fruits/grapefruit.png',
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
        image: '../images/fruits/mosambi.png',
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
        image: '../images/fruits/apricot.png',
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
        image: '../images/fruits/peaches.png',
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
        image: '../images/fruits/plums.png',
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
        image: '../images/fruits/cherries.png',
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
        image: '../images/fruits/lychees.png',
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
        image: '../images/fruits/pear.png',
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
        image: '../images/fruits/persimmon.png',
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
        image: '../images/fruits/avacado.png',
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
        image: '../images/fruits/jackfruit.png',
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
        image: '../images/fruits/custard-apple.png',
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
        image: '../images/fruits/Sapodilla.png',
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
        image: '../images/fruits/dates.png',
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
        image: '../images/fruits/figs.png',
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
        image: '../images/fruits/mulberries.png',
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
        image: '../images/herbs/curry-leaves.png',
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
        image: '../images/herbs/basil.png',
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
        image: '../images/herbs/ginger.png',
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
        image: '../images/herbs/lemon-grass.png',
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
        image: '../images/herbs/fenugreek.png',
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
        image: '../images/herbs/celery.png',
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
        image: '../images/herbs/rosemarry.png',
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
        image: '../images/herbs/thyme.png',
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
let itemsPerPage = 24;

// ===============================================
// INITIALIZATION
// ===============================================
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize product quantities
    productsData.forEach(product => {
        productQuantities[product.id] = 0;
    });
    
    // Render products
    renderProducts(productsData);
    updateProductCount();
    
    // Set initial view
    setCurrentView(currentView);
    
    // Set up event listeners
    setupEventListeners();
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
    
    // Item count selector
    const itemCount = document.getElementById('itemCount');
    if (itemCount) {
        itemCount.addEventListener('change', (e) => {
            itemsPerPage = parseInt(e.target.value);
            renderProducts(filteredProducts);
        });
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
            <button class="quantity-btn" onclick="decreaseQuantity(${product.id})">−</button>
            <span class="quantity-value" id="qty-${product.id}">${quantity}</span>
            <button class="quantity-btn" onclick="increaseQuantity(${product.id})">+</button>
        </div>
        <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    
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
    productQuantities[productId] = (productQuantities[productId] || 0) + 1;
    updateQuantityDisplay(productId);
}

function decreaseQuantity(productId) {
    if (productQuantities[productId] > 0) {
        productQuantities[productId]--;
        updateQuantityDisplay(productId);
    }
}

function updateQuantityDisplay(productId) {
    const quantityElement = document.getElementById(`qty-${productId}`);
    if (quantityElement) {
        quantityElement.textContent = productQuantities[productId];
    }
}

// ===============================================
// CART FUNCTIONALITY
// ===============================================
function addToCart(productId) {
    const quantity = productQuantities[productId];
    
    if (quantity === 0) {
        alert('Please select quantity first!');
        return;
    }
    
    const product = productsData.find(p => p.id === productId);
    if (!product) return;
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity: quantity
        });
    }
    
    // Reset quantity
    productQuantities[productId] = 0;
    updateQuantityDisplay(productId);
    
    // Update cart count
    updateCartCount();
    
    // Update cart display
    renderCartItems();
    updateCartProgress();
    
    // Show side cart
    openCart();
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElem = document.getElementById('cartCount');
    if (cartCountElem) {
        cartCountElem.textContent = totalItems;
    }
}

function showCartFeedback(productName, quantity) {
    alert(`Added ${quantity} kg of ${productName} to cart!`);
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
    const cartItemsContainer = document.querySelector('.cart-items');
    
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
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
    } else {
        document.getElementById('headerSearch').value = searchTerm;
    }
    
    if (searchTerm === '') {
        renderProducts(filteredProducts);
        updateProductCount();
        return;
    }
    
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
    
    // Create star rating (mock)
    const stars = '★★★★★';
    const reviews = Math.floor(Math.random() * 50) + 5; // Mock review count
    
    item.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-list-image" onerror="this.src='https://via.placeholder.com/150/6b8e23/ffffff?text=${product.name}'">
        
        <div class="product-list-middle">
            <div class="product-list-name">${product.name}</div>
            <div class="product-list-variety">${product.variety}</div>
            <div class="product-list-rating">
                <span class="stars">${stars}</span>
                <span class="review-count">${reviews} reviews</span>
            </div>
            <div class="product-list-description">Fresh ${product.category} from Pakistani farms, ${product.season === 'year-round' ? 'available all year' : 'seasonal produce'}.</div>
            <a href="#" class="product-list-link">View details →</a>
        </div>
        
        <div class="product-list-right">
            <div class="product-list-price">Rs. ${product.price}/kg</div>
            <button class="product-list-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
    `;
    
    return item;
}

// ===============================================
// INITIALIZATION & EVENT LISTENERS
// ===============================================
document.addEventListener('DOMContentLoaded', function() {
    // Cart icon click - open cart
    const cartIconBtn = document.getElementById('cartIconBtn');
    if (cartIconBtn) {
        cartIconBtn.addEventListener('click', openCart);
    }
    
    // Cart close button
    const cartCloseBtn = document.querySelector('.cart-close');
    if (cartCloseBtn) {
        cartCloseBtn.addEventListener('click', closeCart);
    }
    
    // Cart overlay click - close cart
    const cartOverlay = document.querySelector('.cart-overlay');
    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCart);
    }
    
    // Checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                alert('Your cart is empty. Add some items before checking out.');
                return;
            }
            // Save cart to localStorage before redirecting
            localStorage.setItem('checkoutCart', JSON.stringify(cart));
            // Redirect to checkout page
            window.location.href = '/checkout/';
        });
    }
    
    // Clear cart button
    const clearCartBtn = document.getElementById('clearCartBtn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                alert('Your cart is already empty.');
                return;
            }
            if (confirm('Are you sure you want to clear all items from your cart?')) {
                cart = [];
                renderCartItems();
                updateCartCount();
                updateCartProgress();
            }
        });
    }
    
    // Initialize cart display
    renderCartItems();
    updateCartProgress();
});
