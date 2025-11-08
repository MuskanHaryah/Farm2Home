let cart = [];
let currentStep = 1;
let currentItemIndex = 0;
let shippingData = {};
let billingData = {};

// Initialize checkout page
document.addEventListener('DOMContentLoaded', function() {
    loadCartData();
    initializeCarousel();
    setupFormValidation();
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
        alert('No items found. Redirecting to home.');
        window.location.href = '/';
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
        
        // Fix image path - make it relative to root
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

    console.log('Rendered', cart.length, 'items');
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

    // Update items
    document.querySelectorAll('.carousel-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });

    // Update dots
    document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

// Next carousel item
function nextCarouselItem() {
    if (currentItemIndex < cart.length - 1) {
        showCarouselItem(currentItemIndex + 1);
    } else {
        showCarouselItem(0); // Loop to beginning
    }
}

// Previous carousel item
function prevCarouselItem() {
    if (currentItemIndex > 0) {
        showCarouselItem(currentItemIndex - 1);
    } else {
        showCarouselItem(cart.length - 1); // Loop to end
    }
}

// Go to next step
function nextStep() {
    if (currentStep === 1) {
        // Validate shipping form
        if (validateShippingForm()) {
            collectShippingData();
            // Redirect to payment page
            window.location.href = '/checkout/payment.html';
        }
    } else if (currentStep === 2) {
        // Validate billing form
        if (validateBillingForm()) {
            collectBillingData();
            currentStep = 3;
            updateFormDisplay();
            updateProgressSteps();
            showConfirmation();
        }
    }
}

// Go to previous step
function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        updateFormDisplay();
        updateProgressSteps();
    }
}

// Validate shipping form
function validateShippingForm() {
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    const zipCode = document.getElementById('zipCode').value.trim();

    if (!fullName || !email || !phone || !address || !city || !zipCode) {
        alert('Please fill in all shipping fields.');
        return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('Please enter a valid email address.');
        return false;
    }

    if (!/^\d{10,}$/.test(phone.replace(/\D/g, ''))) {
        alert('Please enter a valid phone number.');
        return false;
    }

    return true;
}

// Validate billing form
function validateBillingForm() {
    const cardName = document.getElementById('cardName').value.trim();
    const cardNumber = document.getElementById('cardNumber').value.trim();
    const expiryDate = document.getElementById('expiryDate').value.trim();
    const cvv = document.getElementById('cvv').value.trim();
    const billingAddress = document.getElementById('billingAddress').value.trim();
    const billingCity = document.getElementById('billingCity').value.trim();
    const billingZip = document.getElementById('billingZip').value.trim();

    if (!cardName || !cardNumber || !expiryDate || !cvv || !billingAddress || !billingCity || !billingZip) {
        alert('Please fill in all billing fields.');
        return false;
    }

    // Validate card number (basic check)
    if (!/^\d{13,19}$/.test(cardNumber.replace(/\s/g, ''))) {
        alert('Please enter a valid card number.');
        return false;
    }

    // Validate expiry date
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
        alert('Please enter expiry date in MM/YY format.');
        return false;
    }

    // Validate CVV
    if (!/^\d{3,4}$/.test(cvv)) {
        alert('Please enter a valid CVV.');
        return false;
    }

    return true;
}

// Collect shipping data
function collectShippingData() {
    shippingData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        zipCode: document.getElementById('zipCode').value
    };
    localStorage.setItem('shippingData', JSON.stringify(shippingData));
}

// Collect billing data
function collectBillingData() {
    billingData = {
        cardName: document.getElementById('cardName').value,
        cardNumber: '****' + document.getElementById('cardNumber').value.slice(-4),
        expiryDate: document.getElementById('expiryDate').value,
        billingAddress: document.getElementById('billingAddress').value,
        billingCity: document.getElementById('billingCity').value,
        billingZip: document.getElementById('billingZip').value
    };
    localStorage.setItem('billingData', JSON.stringify(billingData));
}

// Update form display
function updateFormDisplay() {
    document.querySelectorAll('.checkout-form').forEach((form, index) => {
        form.classList.toggle('active-form', index + 1 === currentStep);
    });
}

// Update progress steps
function updateProgressSteps() {
    document.querySelectorAll('.step').forEach((step, index) => {
        step.classList.toggle('active', index + 1 <= currentStep);
    });
}

// Show confirmation
function showConfirmation() {
    const confirmationDetails = document.getElementById('confirmationDetails');
    const confirmationShipping = document.getElementById('confirmationShipping');

    // Build order details
    let detailsHTML = `<div class="confirmation-items">`;
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cart.forEach((item, index) => {
        detailsHTML += `
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px;">
                <span>${index + 1}. ${item.name} x${item.quantity}</span>
                <span>Rs. ${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `;
    });

    detailsHTML += `
        <div style="border-top: 1px solid rgba(255, 255, 255, 0.3); padding-top: 10px; margin-top: 10px; display: flex; justify-content: space-between; font-weight: 600; font-size: 14px;">
            <span>TOTAL</span>
            <span>Rs. ${total.toFixed(2)}</span>
        </div>
    </div>`;

    confirmationDetails.innerHTML = detailsHTML;

    // Build shipping info
    const shippingHTML = `
        <strong>${shippingData.fullName}</strong><br>
        ${shippingData.address}<br>
        ${shippingData.city}, ${shippingData.zipCode}<br>
        ${shippingData.phone}<br>
        ${shippingData.email}
    `;

    confirmationShipping.innerHTML = shippingHTML;
}

// Setup form validation
function setupFormValidation() {
    // Format card number input
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s+/g, '').replace(/[^\d]/gi, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
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
        });
    }
}

// Go back to home
function backToHome() {
    // Clear checkout data
    localStorage.removeItem('checkoutCart');
    localStorage.removeItem('shippingData');
    localStorage.removeItem('billingData');
    window.location.href = '/';
}

// Download receipt
function downloadReceipt() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    let receiptContent = `FARM2HOME - ORDER RECEIPT\n`;
    receiptContent += `========================================\n\n`;
    receiptContent += `ORDER ITEMS:\n`;
    
    cart.forEach((item, index) => {
        receiptContent += `${index + 1}. ${item.name} x${item.quantity} - Rs. ${(item.price * item.quantity).toFixed(2)}\n`;
    });
    
    receiptContent += `\nTOTAL: Rs. ${total.toFixed(2)}\n\n`;
    receiptContent += `SHIPPING TO:\n`;
    receiptContent += `${shippingData.fullName}\n`;
    receiptContent += `${shippingData.address}\n`;
    receiptContent += `${shippingData.city}, ${shippingData.zipCode}\n`;
    receiptContent += `${shippingData.phone}\n`;
    receiptContent += `${shippingData.email}\n\n`;
    receiptContent += `Thank you for your order!\n`;
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

// Go back button
function goBack() {
    if (confirm('Are you sure you want to go back? Your checkout progress will be lost.')) {
        window.location.href = '/';
    }
}
