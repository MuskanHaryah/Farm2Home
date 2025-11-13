// ==================== CHECKOUT PAGE - BACKEND INTEGRATED ====================
// This script handles the complete checkout flow with backend API integration
// UI remains exactly the same, but data now comes from backend instead of localStorage

let cart = [];
let currentStep = 1;
let currentItemIndex = 0;
let shippingData = {};
let billingData = {};
let orderData = null; // Store created order data

// Initialize checkout page
document.addEventListener('DOMContentLoaded', function() {
    loadCartData();
    initializeCarousel();
    setupFormValidation();
});

// ==================== HELPER FUNCTIONS ====================

/**
 * Get customer ID from localStorage
 * This should be set during login/authentication
 * For testing, you can manually set it: localStorage.setItem('customer_id', '1');
 */
function getCustomerId() {
    const customerId = localStorage.getItem('customer_id');
    
    if (!customerId) {
        console.warn('No customer ID found in localStorage');
        return null;
    }
    
    return customerId;
}

/**
 * Get CSRF token from Django cookie
 * Required for all POST requests to Django backend
 */
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

/**
 * Show or hide loading spinner
 */
function showLoading(show) {
    // You can implement a loading spinner here if needed
    // For now, we'll just log it
    if (show) {
        console.log('Loading...');
    } else {
        console.log('Loading complete');
    }
}

// ==================== CART DATA LOADING (BACKEND) ====================

/**
 * Load cart data from backend API instead of localStorage
 * Fetches cart items for the logged-in customer
 */
async function loadCartData() {
    const customerId = getCustomerId();
    
    // Check if customer is logged in
    if (!customerId) {
        notifications.error('Please log in to continue checkout.');
        setTimeout(() => {
            openLoginModal();
        }, 1000);
        return;
    }
    
    try {
        showLoading(true);
        
        // Fetch cart data from backend API
        const response = await fetch(`/api/checkout/cart/?customer_id=${customerId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        const data = await response.json();
        
        showLoading(false);
        
        // Check if request was successful
        if (!response.ok) {
            throw new Error(data.error || 'Failed to load cart');
        }
        
        // Check if cart has items
        if (!data.items || data.items.length === 0) {
            console.warn('No items in cart');
            notifications.error('Your cart is empty. Redirecting to catalog.');
            setTimeout(() => {
                window.location.href = '/catalog/';
            }, 2000);
            return;
        }
        
        // Store cart data
        cart = data.items;
        console.log('Cart loaded from backend:', cart);
        console.log('Total items:', data.count);
        console.log('Total amount: Rs.', data.total);
        
        // Debug: Log each item's image path
        console.log('=== Image Path Debug ===');
        cart.forEach((item, idx) => {
            console.log(`${idx + 1}. ${item.name}: image="${item.image}"`);
        });
        console.log('========================');
        
    } catch (error) {
        showLoading(false);
        console.error('Error loading cart:', error);
        notifications.error('Failed to load cart data. Please try again.');
        
        // Redirect to catalog after error
        setTimeout(() => {
            window.location.href = '/catalog/';
        }, 3000);
    }
}

// ==================== CAROUSEL FUNCTIONS (UI - UNCHANGED) ====================

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
        
        // Robust image path handling
        let imagePath = item.image || '';
        
        // Log the original image path for debugging
        console.log(`Item ${index + 1} (${item.name}): Original image path:`, imagePath);
        
        // Ensure image path is properly formatted
        if (imagePath) {
            // If path doesn't start with /, add it
            if (!imagePath.startsWith('/')) {
                imagePath = `/${imagePath}`;
            }
        } else {
            // If no image, use category-based default
            imagePath = `/static/images/${item.category || 'vegetables'}/default.png`;
        }
        
        console.log(`Item ${index + 1} (${item.name}): Formatted image path:`, imagePath);
        
        // Fallback placeholder image
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
                 onerror="this.onerror=null; this.src='${fallbackImage}'; console.error('Image failed to load:', '${imagePath}');">
        `;

        container.appendChild(itemEl);
    });

    console.log('Rendered', cart.length, 'items with images');
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

// ==================== CHECKOUT FLOW & NAVIGATION ====================

/**
 * Go to next step in checkout process
 * Step 1: Shipping form validation and collection
 * Step 2: Billing form validation and ORDER SUBMISSION to backend
 */
async function nextStep() {
    if (currentStep === 1) {
        // Step 1: Validate and collect shipping information
        if (validateShippingForm()) {
            collectShippingData();
            // Redirect to payment page
            window.location.href = '/checkout/payment/';
        }
    } else if (currentStep === 2) {
        // Step 2: Validate billing, collect data, and submit order to backend
        if (validateBillingForm()) {
            collectBillingData();
            
            // Submit order to backend
            await submitOrderToBackend();
        }
    }
}

/**
 * Submit complete order to backend API
 * Sends shipping, billing, and cart items data
 * Creates order in database and clears cart
 */
async function submitOrderToBackend() {
    const customerId = getCustomerId();
    
    if (!customerId) {
        notifications.error('Customer session expired. Please log in again.');
        setTimeout(() => {
            window.location.href = '/login/';
        }, 2000);
        return;
    }
    
    // Prepare order data in the format expected by backend
    const orderPayload = {
        shipping: shippingData,
        billing: {
            cardName: billingData.cardName,
            cardNumber: document.getElementById('cardNumber').value.replace(/\s/g, ''), // Send full number to backend
            expiryDate: billingData.expiryDate,
            cvv: document.getElementById('cvv').value, // Send CVV for validation (backend won't store it)
            billingAddress: billingData.billingAddress,
            billingCity: billingData.billingCity,
            billingZip: billingData.billingZip
        },
        items: cart.map(item => ({
            product_id: item.id,
            quantity: item.quantity
        })),
        customer_id: parseInt(customerId)
    };
    
    try {
        showLoading(true);
        
        // Send POST request to create order
        const response = await fetch('/api/checkout/create-order/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfToken()
            },
            body: JSON.stringify(orderPayload)
        });
        
        const result = await response.json();
        
        showLoading(false);
        
        // Check if order was created successfully
        if (response.ok) {
            // Order created successfully
            console.log('Order created successfully:', result);
            
            // Store order data for confirmation display
            orderData = result;
            
            // Store order number in localStorage for reference
            localStorage.setItem('lastOrderId', result.orderNumber);
            
            // Move to confirmation step
            currentStep = 3;
            updateFormDisplay();
            updateProgressSteps();
            showConfirmation();
            
            notifications.success('Order placed successfully!');
            
        } else {
            // Order creation failed
            console.error('Order creation failed:', result);
            
            // Show specific error message from backend
            if (result.error) {
                notifications.error(result.error);
            } else if (result.details) {
                // Show validation errors
                const errorMessages = Object.values(result.details).flat().join(', ');
                notifications.error(`Validation error: ${errorMessages}`);
            } else {
                notifications.error('Failed to create order. Please try again.');
            }
        }
        
    } catch (error) {
        showLoading(false);
        console.error('Error submitting order:', error);
        notifications.error('Network error. Please check your connection and try again.');
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

// ==================== FORM VALIDATION (UNCHANGED) ====================

// Validate shipping form
function validateShippingForm() {
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    const zipCode = document.getElementById('zipCode').value.trim();

    if (!fullName || !email || !phone || !address || !city || !zipCode) {
        notifications.error('Please fill in all shipping fields.');
        return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        notifications.error('Please enter a valid email address.');
        return false;
    }

    if (!/^\d{10,}$/.test(phone.replace(/\D/g, ''))) {
        notifications.error('Please enter a valid phone number.');
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
        notifications.error('Please fill in all billing fields.');
        return false;
    }

    // Validate card number (basic check)
    if (!/^\d{13,19}$/.test(cardNumber.replace(/\s/g, ''))) {
        notifications.error('Please enter a valid card number.');
        return false;
    }

    // Validate expiry date
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
        notifications.error('Please enter expiry date in MM/YY format.');
        return false;
    }

    // Validate CVV
    if (!/^\d{3,4}$/.test(cvv)) {
        notifications.error('Please enter a valid CVV.');
        return false;
    }

    return true;
}

// ==================== DATA COLLECTION ====================

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
    // Store masked card number for display (only last 4 digits)
    const cardNumberFull = document.getElementById('cardNumber').value;
    const last4Digits = cardNumberFull.replace(/\s/g, '').slice(-4);
    
    billingData = {
        cardName: document.getElementById('cardName').value,
        cardNumber: '****' + last4Digits, // Only store last 4 for display
        expiryDate: document.getElementById('expiryDate').value,
        billingAddress: document.getElementById('billingAddress').value,
        billingCity: document.getElementById('billingCity').value,
        billingZip: document.getElementById('billingZip').value
    };
    
    // Store in localStorage for session persistence (only masked data)
    localStorage.setItem('billingData', JSON.stringify(billingData));
}

// ==================== UI UPDATE FUNCTIONS (UNCHANGED) ====================

// Update form display
function updateFormDisplay() {
    document.querySelectorAll('.checkout-form').forEach((form, index) => {
        form.classList.toggle('active-form', index + 1 === currentStep);
    });
}

// Update progress steps
function updateProgressSteps() {
    const progressSteps = document.querySelector('.progress-steps');
    if (progressSteps) {
        progressSteps.setAttribute('data-active', currentStep);
    }
    document.querySelectorAll('.step').forEach((step, index) => {
        step.classList.toggle('active', index + 1 <= currentStep);
    });
}

// ==================== CONFIRMATION DISPLAY ====================

/**
 * Show confirmation after successful order creation
 * Displays order details and shipping information
 * Can use data from orderData (backend response) or cart (fallback)
 */
function showConfirmation() {
    const confirmationDetails = document.getElementById('confirmationDetails');
    const confirmationShipping = document.getElementById('confirmationShipping');

    // Build order details HTML
    let detailsHTML = `<div class="confirmation-items">`;
    
    // Calculate total from cart
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Display each item
    cart.forEach((item, index) => {
        detailsHTML += `
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px;">
                <span>${index + 1}. ${item.name} x${item.quantity}</span>
                <span>Rs. ${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `;
    });

    // Add total
    detailsHTML += `
        <div style="border-top: 1px solid rgba(255, 255, 255, 0.3); padding-top: 10px; margin-top: 10px; display: flex; justify-content: space-between; font-weight: 600; font-size: 14px;">
            <span>TOTAL</span>
            <span>Rs. ${total.toFixed(2)}</span>
        </div>
    </div>`;

    // If we have order data from backend, show order number
    if (orderData && orderData.orderNumber) {
        detailsHTML = `
            <div style="margin-bottom: 15px; padding: 10px; background: rgba(76, 175, 80, 0.1); border-radius: 5px;">
                <strong>Order #${orderData.orderNumber}</strong><br>
                <small style="opacity: 0.8;">${orderData.orderDate || 'Just now'}</small>
            </div>
        ` + detailsHTML;
    }

    confirmationDetails.innerHTML = detailsHTML;

    // Build shipping information HTML
    const shippingHTML = `
        <strong>${shippingData.fullName}</strong><br>
        ${shippingData.address}<br>
        ${shippingData.city}, ${shippingData.zipCode}<br>
        ${shippingData.phone}<br>
        ${shippingData.email}
    `;

    confirmationShipping.innerHTML = shippingHTML;
}

// ==================== FORM INPUT FORMATTING (UNCHANGED) ====================
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

// ==================== CLEANUP & NAVIGATION ====================

/**
 * Go back to home page
 * Clears checkout session data but NOT customer ID
 */
function backToHome() {
    // Clear checkout-specific data
    localStorage.removeItem('checkoutCart');
    localStorage.removeItem('shippingData');
    localStorage.removeItem('billingData');
    
    // Navigate to home
    window.location.href = '/';
}

/**
 * Download order receipt as text file
 * Generates receipt from cart and shipping data
 */
function downloadReceipt() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    let receiptContent = `FARM2HOME - ORDER RECEIPT\n`;
    receiptContent += `========================================\n\n`;
    
    // Add order number if available
    if (orderData && orderData.orderNumber) {
        receiptContent += `ORDER NUMBER: ${orderData.orderNumber}\n`;
        receiptContent += `ORDER DATE: ${orderData.orderDate || new Date().toLocaleString()}\n`;
        receiptContent += `========================================\n\n`;
    }
    
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
    
    // Use order number in filename if available
    const filename = orderData && orderData.orderNumber 
        ? `receipt-order-${orderData.orderNumber}.txt` 
        : `receipt-${Date.now()}.txt`;
    
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
    
    notifications.success('Receipt downloaded successfully!');
}

/**
 * Go back button handler
 * Confirms before leaving checkout page
 */
function goBack() {
    if (confirm('Are you sure you want to go back? Your checkout progress will be lost.')) {
        window.location.href = '/catalog/';
    }
}

// ==================== END OF CHECKOUT SCRIPT ====================