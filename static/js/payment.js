let cart = [];
let currentItemIndex = 0;
let shippingData = {};
let selectedPaymentMethod = 'card';

// Initialize payment page
document.addEventListener('DOMContentLoaded', function() {
    loadCartData();
    loadShippingData();
    initializeCarousel();
    setupCardFormatting();
    updateTotal();
});

// Load cart data from localStorage
function loadCartData() {
    const cartData = localStorage.getItem('checkoutCart');
    if (cartData) {
        try {
            cart = JSON.parse(cartData);
            console.log('Cart loaded:', cart);
        } catch (e) {
            console.error('Error loading cart data:', e);
            cart = [];
        }
    }
    
    if (cart.length === 0) {
        console.warn('No items in cart');
        alert('No items found. Redirecting to checkout.');
        window.location.href = '/checkout/index.html';
    }
}

// Load shipping data
function loadShippingData() {
    const data = localStorage.getItem('shippingData');
    if (data) {
        try {
            shippingData = JSON.parse(data);
        } catch (e) {
            console.error('Error loading shipping data:', e);
        }
    }
}

// Initialize carousel
function initializeCarousel() {
    renderCarouselItems();
    renderCarouselDots();
    showCarouselItem(0);
}

// Render carousel items
function renderCarouselItems() {
    const container = document.getElementById('carouselItems');
    container.innerHTML = '';

    if (cart.length === 0) {
        container.innerHTML = '<p>No items in cart</p>';
        return;
    }

    cart.forEach((item, index) => {
        const itemEl = document.createElement('div');
        itemEl.className = `carousel-item ${index === 0 ? 'active' : ''}`;
        itemEl.dataset.index = index;

        const itemTotal = (item.price * item.quantity).toFixed(2);
        
        const imagePath = item.image.startsWith('/') ? item.image : `/${item.image}`;
        const fallbackImage = `https://via.placeholder.com/320x320/6b8e23/ffffff?text=${encodeURIComponent(item.name)}`;

        itemEl.innerHTML = `
            <div class="item-info">
                <div class="item-number">Item ${index + 1} of ${cart.length}</div>
                <div class="item-name">${item.name.toUpperCase()}</div>
                <div class="item-price">RS. ${itemTotal}</div>
            </div>
            <img src="${imagePath}" 
                 alt="${item.name}" 
                 class="item-image" 
                 onerror="this.onerror=null; this.src='${fallbackImage}'">
        `;

        container.appendChild(itemEl);
    });
}

// Render carousel dots
function renderCarouselDots() {
    const dotsContainer = document.getElementById('carouselDots');
    dotsContainer.innerHTML = '';

    cart.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        dot.onclick = () => showCarouselItem(index);
        dotsContainer.appendChild(dot);
    });
}

// Show carousel item
function showCarouselItem(index) {
    currentItemIndex = index;

    document.querySelectorAll('.carousel-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });

    document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

// Switch payment method
function switchPaymentMethod(method) {
    selectedPaymentMethod = method;

    // Update toggle buttons
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    if (method === 'card') {
        document.getElementById('cardToggle').classList.add('active');
        document.getElementById('cardPayment').classList.add('active');
        document.getElementById('codPayment').classList.remove('active');
    } else {
        document.getElementById('codToggle').classList.add('active');
        document.getElementById('codPayment').classList.add('active');
        document.getElementById('cardPayment').classList.remove('active');
        updateTotal();
    }
}

// Update total
function updateTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const codTotalElement = document.getElementById('codTotal');
    const cardTotalElement = document.getElementById('cardTotal');
    
    if (codTotalElement) {
        codTotalElement.textContent = `Rs. ${total.toFixed(2)}`;
    }
    if (cardTotalElement) {
        cardTotalElement.textContent = `Rs. ${total.toFixed(2)}`;
    }
}

// Setup card formatting
function setupCardFormatting() {
    // Format card number input
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s+/g, '').replace(/[^\d]/gi, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
            updateCardDisplay();
        });
    }

    // Format expiry date input
    const expiryDateInput = document.getElementById('expiryDate');
    if (expiryDateInput) {
        expiryDateInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
            updateCardDisplay();
        });
    }

    // Format CVV input (numbers only)
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '');
            updateCardDisplay();
        });
    }

    // Update cardholder name
    const cardNameInput = document.getElementById('cardName');
    if (cardNameInput) {
        cardNameInput.addEventListener('input', function(e) {
            updateCardDisplay();
        });
    }
}

// Update card display
function updateCardDisplay() {
    const cardName = document.getElementById('cardName').value || 'Your Name';
    const cardNumber = document.getElementById('cardNumber').value || '•••• •••• •••• ••••';
    const expiryDate = document.getElementById('expiryDate').value || 'MM/YY';
    const cvv = document.getElementById('cvv').value;
    const cvvDisplay = cvv ? '•'.repeat(cvv.length) : '•••';

    document.getElementById('displayCardName').textContent = cardName.toUpperCase();
    document.getElementById('displayCardNumber').textContent = cardNumber || '•••• •••• •••• ••••';
    document.getElementById('displayExpiryDate').textContent = expiryDate;
    document.getElementById('displayCVV').textContent = cvvDisplay;
}

// Validate card payment
function validateCardPayment() {
    const cardName = document.getElementById('cardName').value.trim();
    const cardNumber = document.getElementById('cardNumber').value.trim();
    const expiryDate = document.getElementById('expiryDate').value.trim();
    const cvv = document.getElementById('cvv').value.trim();

    if (!cardName || !cardNumber || !expiryDate || !cvv) {
        alert('Please fill in all card details.');
        return false;
    }

    // Validate card number (13-19 digits)
    if (!/^\d{13,19}$/.test(cardNumber.replace(/\s/g, ''))) {
        alert('Please enter a valid card number (13-19 digits).');
        return false;
    }

    // Validate expiry date
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
        alert('Please enter expiry date in MM/YY format.');
        return false;
    }

    // Check if expiry date is not in the past
    const [month, year] = expiryDate.split('/').map(Number);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
        alert('Card has expired. Please use a valid card.');
        return false;
    }

    // Validate CVV
    if (!/^\d{3,4}$/.test(cvv)) {
        alert('Please enter a valid CVV (3-4 digits).');
        return false;
    }

    return true;
}

// Process payment
function processPayment(method) {
    if (method === 'card') {
        if (!validateCardPayment()) {
            return;
        }

        // Save payment data
        const paymentData = {
            method: 'card',
            cardName: document.getElementById('cardName').value,
            cardNumber: '****' + document.getElementById('cardNumber').value.replace(/\s/g, '').slice(-4),
            expiryDate: document.getElementById('expiryDate').value
        };
        localStorage.setItem('paymentData', JSON.stringify(paymentData));
        
    } else {
        // Cash on Delivery
        const paymentData = {
            method: 'cod',
            total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        };
        localStorage.setItem('paymentData', JSON.stringify(paymentData));
    }

    // Redirect to confirmation page
    window.location.href = '/checkout/confirmation.html';
}

// Go back
function goBack() {
    window.location.href = '/checkout/index.html';
}
