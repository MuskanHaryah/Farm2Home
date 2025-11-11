let cart = [];
let shippingData = {};
let paymentData = {};

// Initialize confirmation page
document.addEventListener('DOMContentLoaded', function() {
    loadCartData();
    loadShippingData();
    loadPaymentData();
    initializeCarousel();
    displayConfirmationDetails();
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
        notifications.error('No items found. Redirecting to checkout.');
        setTimeout(() => {
            window.location.href = '/checkout/';
        }, 2000);
        return;
    }
}

// Load shipping data from localStorage
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

// Load payment data from localStorage
function loadPaymentData() {
    const data = localStorage.getItem('paymentData');
    if (data) {
        try {
            paymentData = JSON.parse(data);
        } catch (e) {
            console.error('Error loading payment data:', e);
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
                <div class="item-price">$${itemTotal}</div>
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
    document.querySelectorAll('.carousel-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });

    document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

// Display confirmation details
function displayConfirmationDetails() {
    const confirmationDetails = document.getElementById('confirmationDetails');
    const confirmationShipping = document.getElementById('confirmationShipping');
    const confirmationPayment = document.getElementById('confirmationPayment');

    // Build order details
    let detailsHTML = '';
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cart.forEach((item, index) => {
        const itemDesc = item.description || 'Fresh organic produce';
        
        detailsHTML += `
            <div class="confirmation-item">
                <div class="confirmation-item-details">
                    <div class="confirmation-item-name">${item.name}</div>
                    <div class="confirmation-item-desc">${itemDesc}</div>
                </div>
                <div class="confirmation-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        `;
    });

    detailsHTML += `
        <div class="confirmation-total">
            <span>TOTAL</span>
            <span>$${total.toFixed(2)}</span>
        </div>
    `;

    confirmationDetails.innerHTML = detailsHTML;

    // Build shipping info
    const shippingHTML = `
        <div class="info-line">${shippingData.fullName || 'John Doe'}</div>
        <div class="info-line">${shippingData.email || 'johndoe@example.com'}</div>
        <div class="info-line">${shippingData.phone || '(555) 123-4567'}</div>
        <div class="info-line">${shippingData.address || '123 Farm Road'}</div>
        <div class="info-line">${shippingData.city || 'Springfield'}, ${shippingData.zipCode || '12345'}</div>
    `;

    confirmationShipping.innerHTML = shippingHTML;

    // Build payment info
    let paymentHTML = '';
    if (paymentData.method === 'card') {
        paymentHTML = `
            <div class="payment-method-display">
                <i class="fas fa-credit-card"></i>
                <span>Credit/Debit Card</span>
            </div>
        `;
    } else {
        paymentHTML = `
            <div class="payment-method-display">
                <i class="fas fa-money-bill-wave"></i>
                <span>Cash on Delivery</span>
            </div>
        `;
    }

    confirmationPayment.innerHTML = paymentHTML;
}

// Back to home
function backToHome() {
    // Show success notification
    notifications.success('🎉 Order confirmed successfully! Thank you for your purchase.');
    
    // Clear checkout data after a delay
    setTimeout(() => {
        localStorage.removeItem('checkoutCart');
        localStorage.removeItem('shippingData');
        localStorage.removeItem('paymentData');
        window.location.href = '/';
    }, 2000);
}

// Download receipt
function downloadReceipt() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    let receiptContent = `FARM2HOME - ORDER RECEIPT\n`;
    receiptContent += `========================================\n`;
    receiptContent += `Order Date: ${new Date().toLocaleDateString()}\n`;
    receiptContent += `Order Time: ${new Date().toLocaleTimeString()}\n`;
    receiptContent += `========================================\n\n`;

    receiptContent += `ORDER ITEMS:\n`;
    cart.forEach((item, index) => {
        receiptContent += `${index + 1}. ${item.name}\n`;
        receiptContent += `   Quantity: ${item.quantity} x $${item.price.toFixed(2)} = $${(item.price * item.quantity).toFixed(2)}\n`;
    });

    receiptContent += `\n========================================\n`;
    receiptContent += `SUBTOTAL: $${total.toFixed(2)}\n`;
    receiptContent += `TOTAL: $${total.toFixed(2)}\n`;
    receiptContent += `========================================\n\n`;

    receiptContent += `SHIPPING INFORMATION:\n`;
    receiptContent += `Name: ${shippingData.fullName || 'N/A'}\n`;
    receiptContent += `Address: ${shippingData.address || 'N/A'}\n`;
    receiptContent += `City: ${shippingData.city || 'N/A'}\n`;
    receiptContent += `ZIP Code: ${shippingData.zipCode || 'N/A'}\n`;
    receiptContent += `Phone: ${shippingData.phone || 'N/A'}\n`;
    receiptContent += `Email: ${shippingData.email || 'N/A'}\n`;

    receiptContent += `\nPAYMENT METHOD:\n`;
    if (paymentData.method === 'card') {
        receiptContent += `Card Payment\n`;
        receiptContent += `Cardholder: ${paymentData.cardName || 'N/A'}\n`;
        receiptContent += `Card: ${paymentData.cardNumber || '****'}\n`;
    } else {
        receiptContent += `Cash on Delivery (COD)\n`;
        receiptContent += `Pay $${paymentData.total ? paymentData.total.toFixed(2) : '0.00'} to delivery person\n`;
    }

    receiptContent += `\n========================================\n`;
    receiptContent += `Thank you for your order!\n`;
    receiptContent += `For support, contact us at support@farm2home.com\n`;
    receiptContent += `========================================\n`;

    // Create blob and download
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${Date.now()}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Go back
function goBack() {
    window.location.href = '/checkout/';
}
