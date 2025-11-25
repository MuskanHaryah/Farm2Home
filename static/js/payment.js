    // Payment page modal functionality

// Global variables
let cart = [];
let shippingData = {};
let currentItemIndex = 0;
let selectedPaymentMethod = 'card';
let stripe = null; // Stripe instance
let cardElement = null; // Stripe Card Element
let stripeInitialized = false;

// Initialize Stripe
function initializeStripe() {
    if (stripeInitialized) {
        console.log('✅ Stripe already initialized');
        return;
    }
    
    if (typeof Stripe === 'undefined') {
        console.error('❌ Stripe.js not loaded. Make sure the Stripe script is included.');
        return;
    }
    
    if (typeof STRIPE_PUBLIC_KEY === 'undefined' || !STRIPE_PUBLIC_KEY || STRIPE_PUBLIC_KEY === 'pk_test_your_key_here') {
        console.error('❌ Stripe public key not configured properly. Current value:', STRIPE_PUBLIC_KEY);
        return;
    }
    
    try {
        // Check if card-element exists
        const cardElementContainer = document.getElementById('card-element');
        if (!cardElementContainer) {
            console.error('❌ Card element container not found in DOM!');
            return;
        }
        
        // Show loading state
        cardElementContainer.classList.add('loading');
        
        // Initialize Stripe
        stripe = Stripe(STRIPE_PUBLIC_KEY);
        const elements = stripe.elements();
        
        // Create Card Element with custom styling
        cardElement = elements.create('card', {
            style: {
                base: {
                    fontSize: '16px',
                    color: '#32325d',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
                    fontSmoothing: 'antialiased',
                    '::placeholder': {
                        color: '#aab7c4'
                    }
                },
                invalid: {
                    color: '#fa755a',
                    iconColor: '#fa755a'
                }
            },
            hidePostalCode: true
        });
        
        // Clear the loading message first
        cardElementContainer.innerHTML = '';
        
        // Mount the Card Element
        cardElement.mount('#card-element');
        
        // Listen for mount success
        cardElement.on('ready', function() {
            console.log('✅ Stripe Card Element is ready and interactive');
            cardElementContainer.classList.remove('loading');
            // Ensure the element is interactive
            cardElementContainer.style.pointerEvents = 'auto';
        });
        
        // Handle real-time validation errors from the Card Element
        cardElement.on('change', function(event) {
            const displayError = document.getElementById('card-errors');
            if (event.error) {
                displayError.textContent = event.error.message;
                cardElementContainer.classList.add('StripeElement--invalid');
            } else {
                displayError.textContent = '';
                cardElementContainer.classList.remove('StripeElement--invalid');
            }
            
            // Update card brand in display if available
            if (event.brand) {
                updateCardBrand(event.brand);
            }
            
            // Update button state when card details change
            if (typeof updateCardButtonState === 'function') {
                setTimeout(updateCardButtonState, 0);
            }
        });
        
        // Handle focus/blur for better UX
        cardElement.on('focus', function() {
            cardElementContainer.classList.add('StripeElement--focus');
        });
        
        cardElement.on('blur', function() {
            cardElementContainer.classList.remove('StripeElement--focus');
        });
        
        stripeInitialized = true;
        console.log('✅ Stripe initialized successfully with key:', STRIPE_PUBLIC_KEY.substring(0, 20) + '...');
    } catch (error) {
        console.error('❌ Failed to initialize Stripe:', error);
        const cardElementContainer = document.getElementById('card-element');
        if (cardElementContainer) {
            cardElementContainer.classList.remove('loading');
            cardElementContainer.innerHTML = '<p style="color: #fa755a; padding: 10px;">Failed to load payment form. Please refresh the page.</p>';
        }
    }
}

// Get CSRF token from cookie
function getCsrfToken() {
    const name = 'csrftoken';
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Get modal and define functions at global scope
const modal = document.getElementById('paymentModal');

function openModal() {
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModalFunc() {
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const addPaymentBtnHeader = document.querySelector('.add-payment-btn-header');
    const addNewPaymentCard = document.querySelector('.add-new-payment-card');
    const closeModal = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const paymentForm = document.getElementById('paymentForm');

    // Open modal when clicking add payment button in header
    if (addPaymentBtnHeader) {
        addPaymentBtnHeader.addEventListener('click', function() {
            openModal();
        });
    }

    // Open modal when clicking add new payment card
    if (addNewPaymentCard) {
        addNewPaymentCard.addEventListener('click', function() {
            openModal();
        });
    }

    // Close modal when clicking close button
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            closeModalFunc();
        });
    }

    // Close modal when clicking cancel button
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            closeModalFunc();
        });
    }

    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModalFunc();
            }
        });
    }

    // Handle form submission
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                paymentType: document.getElementById('paymentType').value,
                cardHolder: document.getElementById('cardHolder').value,
                cardNumber: document.getElementById('cardNumber').value,
                expiryDate: document.getElementById('expiryDate').value,
                cvv: document.getElementById('cvv').value,
                bankName: document.getElementById('bankName').value
            };

            console.log('Payment method added:', formData);
            
            // Show success message
            notifications.show('Payment method added successfully!', 'success', 'Payment Method Added');
            
            // Close modal and reset form
            closeModalFunc();
            paymentForm.reset();
        });
    }

    // Format card number input
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
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
    
    // Logout button handler
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        if (window.accountFunctions && window.accountFunctions.handleAccountLogout) {
            logoutBtn.addEventListener('click', window.accountFunctions.handleAccountLogout);
        } else {
            // Fallback if account.js not loaded
            logoutBtn.addEventListener('click', function() {
                if (confirm('Are you sure you want to logout?')) {
                    localStorage.removeItem('customer_id');
                    localStorage.removeItem('customer_name');
                    localStorage.removeItem('customer_email');
                    localStorage.removeItem('farm2home_cart');
                    localStorage.removeItem('checkoutCart');
                    window.location.replace('/login/');
                }
            });
        }
    }

    // CVV input - numbers only
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }

    // Close payment modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeModalFunc();
        }
    });
    
    // Initialize payment page
    loadCartData();
    loadShippingData();
    updateTotal();
    
    // Initialize with card payment visible by default
    switchPaymentMethod('card');
    
    // Setup card formatting and real-time updates
    setupCardFormatting();
    
    // Initialize Stripe with proper checks
    // Check if Stripe.js is loaded, if not wait for it
    if (typeof Stripe !== 'undefined') {
        initializeStripe();
    } else {
        console.log('⏳ Waiting for Stripe.js to load...');
        // Wait for Stripe.js to load
        let stripeCheckAttempts = 0;
        const stripeCheckInterval = setInterval(function() {
            stripeCheckAttempts++;
            if (typeof Stripe !== 'undefined') {
                console.log('✅ Stripe.js loaded, initializing...');
                clearInterval(stripeCheckInterval);
                initializeStripe();
            } else if (stripeCheckAttempts > 20) {
                // Stop trying after 10 seconds (20 attempts * 500ms)
                console.error('❌ Stripe.js failed to load after 10 seconds');
                clearInterval(stripeCheckInterval);
                const cardElement = document.getElementById('card-element');
                if (cardElement) {
                    cardElement.innerHTML = '<p style="color: #fa755a; padding: 10px;">Failed to load Stripe. Please refresh the page.</p>';
                }
            }
        }, 500);
    }
});

// Make switchPaymentMethod globally accessible
window.switchPaymentMethod = switchPaymentMethod;

// Load cart data from localStorage (saved by checkout page)
async function loadCartData() {
    // Try loading from localStorage first
    const cartData = localStorage.getItem('checkoutCart');
    if (cartData) {
        try {
            cart = JSON.parse(cartData);
            console.log('Cart loaded from localStorage:', cart);
            
            if (cart.length > 0) {
                initializeCarousel();
                updateTotal();
                return;
            }
        } catch (e) {
            console.error('Error parsing cart data:', e);
        }
    }
    
    // Fallback: try loading from API
    const customerId = getCustomerId();
    
    if (!customerId) {
        console.error('No customer ID found and no localStorage data');
        notifications.error('Please log in to continue.');
        setTimeout(() => {
            window.location.href = '/catalog/';
        }, 2000);
        return;
    }
    
    try {
        const response = await fetch(`/api/checkout/cart/?customer_id=${customerId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        const data = await response.json();
        
        if (response.ok && data.status === 'success') {
            cart = data.items;
            console.log('Cart loaded from backend API:', cart);
            
            if (cart.length === 0) {
                console.warn('No items in cart');
                notifications.error('No items found. Redirecting to checkout.');
                setTimeout(() => {
                    window.location.href = '/checkout/';
                }, 2000);
                return;
            }
            
            // Save to localStorage for future use
            localStorage.setItem('checkoutCart', JSON.stringify(cart));
            
            // Initialize carousel after cart is loaded
            initializeCarousel();
            updateTotal();
        } else {
            console.error('Failed to load cart:', data);
            notifications.error('Failed to load cart data.');
        }
    } catch (error) {
        console.error('Error loading cart:', error);
        notifications.error('Failed to load cart data.');
    }
}

// Get customer ID from localStorage
function getCustomerId() {
    return localStorage.getItem('customer_id');
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
    setupSwipeGestures();
}

// Setup swipe gestures for carousel (same as checkout page)
function setupSwipeGestures() {
    const carouselContainer = document.getElementById('carouselItems');
    
    if (!carouselContainer || cart.length <= 1) {
        return;
    }
    
    let startX = 0;
    let endX = 0;
    let startY = 0;
    let endY = 0;
    let isDragging = false;
    
    const minSwipeDistance = 50;
    
    // Touch events for mobile
    carouselContainer.addEventListener('touchstart', function(e) {
        startX = e.changedTouches[0].screenX;
        startY = e.changedTouches[0].screenY;
    }, { passive: true });
    
    carouselContainer.addEventListener('touchend', function(e) {
        endX = e.changedTouches[0].screenX;
        endY = e.changedTouches[0].screenY;
        handleSwipeGesture();
    }, { passive: true });
    
    // Double-click for desktop
    carouselContainer.addEventListener('dblclick', function(e) {
        nextCarouselItem();
    });
    
    // Mouse events for desktop drag
    carouselContainer.addEventListener('mousedown', function(e) {
        isDragging = true;
        startX = e.screenX;
        startY = e.screenY;
        carouselContainer.style.cursor = 'grabbing';
    });
    
    carouselContainer.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        e.preventDefault();
    });
    
    carouselContainer.addEventListener('mouseup', function(e) {
        if (!isDragging) return;
        isDragging = false;
        endX = e.screenX;
        endY = e.screenY;
        carouselContainer.style.cursor = 'pointer';
        handleSwipeGesture();
    });
    
    carouselContainer.addEventListener('mouseleave', function() {
        if (isDragging) {
            isDragging = false;
            carouselContainer.style.cursor = 'pointer';
        }
    });
    
    carouselContainer.style.cursor = 'pointer';
    carouselContainer.style.userSelect = 'none';
    
    function handleSwipeGesture() {
        const horizontalDistance = endX - startX;
        const verticalDistance = Math.abs(endY - startY);
        
        if (Math.abs(horizontalDistance) > minSwipeDistance && Math.abs(horizontalDistance) > verticalDistance) {
            if (horizontalDistance > 0) {
                prevCarouselItem();
            } else {
                nextCarouselItem();
            }
        }
    }
}

// Next carousel item
function nextCarouselItem() {
    if (currentItemIndex < cart.length - 1) {
        showCarouselItem(currentItemIndex + 1);
    } else {
        showCarouselItem(0);
    }
}

// Previous carousel item
function prevCarouselItem() {
    if (currentItemIndex > 0) {
        showCarouselItem(currentItemIndex - 1);
    } else {
        showCarouselItem(cart.length - 1);
    }
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
        
        console.log(`Item ${index + 1} (${item.name}): Original image path:`, imagePath);
        
        // Ensure image path is properly formatted
        if (imagePath) {
            if (!imagePath.startsWith('/')) {
                imagePath = `/${imagePath}`;
            }
        } else {
            imagePath = `/static/images/${item.category || 'vegetables'}/default.png`;
        }
        
        console.log(`Item ${index + 1} (${item.name}): Formatted image path:`, imagePath);
        
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

    document.querySelectorAll('.carousel-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });

    document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

// Switch payment method
function switchPaymentMethod(method) {
    console.log('Switching payment method to:', method);
    selectedPaymentMethod = method;

    // Get elements
    const cardToggle = document.getElementById('cardToggle');
    const codToggle = document.getElementById('codToggle');
    const cardPayment = document.getElementById('cardPayment');
    const codPayment = document.getElementById('codPayment');

    // Update toggle buttons
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    if (method === 'card') {
        // Show card payment, hide COD
        if (cardToggle) cardToggle.classList.add('active');
        if (cardPayment) {
            cardPayment.classList.add('active');
            cardPayment.style.display = 'block';
        }
        if (codPayment) {
            codPayment.classList.remove('active');
            codPayment.style.display = 'none';
        }
    } else {
        // Show COD, hide card payment
        if (codToggle) codToggle.classList.add('active');
        if (codPayment) {
            codPayment.classList.add('active');
            codPayment.style.display = 'block';
        }
        if (cardPayment) {
            cardPayment.classList.remove('active');
            cardPayment.style.display = 'none';
        }
        updateTotal();
    }
    
    console.log('Payment method switched successfully');
}

// Update total
function updateTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalFormatted = `PKR ${total.toFixed(2)}`;
    
    // Update COD totals
    const codTotalElement = document.getElementById('codTotal');
    const codOrderTotalElement = document.getElementById('codOrderTotal');
    if (codTotalElement) {
        codTotalElement.textContent = totalFormatted;
    }
    if (codOrderTotalElement) {
        codOrderTotalElement.textContent = totalFormatted;
    }
    
    // Update Card total
    const cardTotalElement = document.getElementById('cardTotal');
    if (cardTotalElement) {
        cardTotalElement.textContent = totalFormatted;
    }
}

// Setup card formatting
function setupCardFormatting() {
    // Only update cardholder name (card details handled by Stripe Element)
    const cardNameInput = document.getElementById('cardName');
    if (cardNameInput) {
        cardNameInput.addEventListener('input', function(e) {
            updateCardDisplay();
        });
    }
}

// Update card display
function updateCardDisplay() {
    const cardName = document.getElementById('cardName')?.value || 'Ahmed Khan';
    const displayNameElement = document.getElementById('displayCardName');
    
    if (displayNameElement) {
        displayNameElement.textContent = cardName.toUpperCase();
    }
    
    // Card details are handled securely by Stripe Element and cannot be read
    // Keep card details as placeholders for visual effect
    const displayCardNumber = document.getElementById('displayCardNumber');
    const displayExpiry = document.getElementById('displayExpiryDate');
    const displayCVV = document.getElementById('displayCVV');
    
    if (displayCardNumber) displayCardNumber.textContent = '•••• •••• •••• ••••';
    if (displayExpiry) displayExpiry.textContent = 'MM/YY';
    if (displayCVV) displayCVV.textContent = '•••';
}

// Update card brand logo
function updateCardBrand(brand) {
    const cardLogo = document.getElementById('cardLogo');
    if (cardLogo) {
        const brandNames = {
            'visa': 'VISA',
            'mastercard': 'MASTERCARD',
            'amex': 'AMEX',
            'discover': 'DISCOVER',
            'diners': 'DINERS',
            'jcb': 'JCB',
            'unionpay': 'UNIONPAY'
        };
        cardLogo.textContent = brandNames[brand] || 'CARD';
    }
}

// Validate card payment
function validateCardPayment() {
    const cardName = document.getElementById('cardName')?.value.trim();
    const cardErrorsDiv = document.getElementById('card-errors');

    if (!cardName) {
        notifications.error('⚠️ Please enter the cardholder name.');
        document.getElementById('cardName')?.focus();
        return false;
    }

    if (!stripe || !stripeInitialized || !cardElement) {
        notifications.error('❌ Payment system not initialized. Please refresh the page.');
        return false;
    }

    // Check if there are any Stripe card errors
    if (cardErrorsDiv && cardErrorsDiv.textContent.trim()) {
        notifications.error('❌ ' + cardErrorsDiv.textContent);
        return false;
    }

    // Don't show validation notification here - processPayment will show "Processing"
    return true;
}

// Process payment
async function processPayment(method) {
    // Validate before showing any notifications
    if (method === 'card') {
        if (!validateCardPayment()) {
            return;
        }
    }

    // Show loading notification only after validation passes
    notifications.show('Processing your order...', 'info', 'Processing');

    try {
        // Get customer ID
        const customerId = getCustomerId();
        if (!customerId) {
            notifications.error('Please log in to complete your order.');
            setTimeout(() => {
                window.location.href = '/landing/';
            }, 2000);
            return;
        }

        // ============ STRIPE PAYMENT VALIDATION (Test Mode) ============
        let stripePaymentIntentId = null;
        
        if (method === 'card' && stripe && stripeInitialized && cardElement) {
            // NEW CARD: Use Stripe Elements validation
            try {
                // Calculate total amount
                const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                
                // Create Payment Intent on backend
                const paymentIntentResponse = await fetch('/api/stripe/create-payment-intent/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCsrfToken()
                    },
                    body: JSON.stringify({
                        amount: totalAmount,
                        currency: 'usd',
                        customer_id: customerId,
                        description: `Farm2Home Order - ${cart.length} items`
                    })
                });

                const paymentIntentData = await paymentIntentResponse.json();
                
                if (!paymentIntentResponse.ok || paymentIntentData.status !== 'success') {
                    notifications.error('Failed to initialize payment. Please try again.');
                    return;
                }

                const clientSecret = paymentIntentData.clientSecret;
                stripePaymentIntentId = paymentIntentData.paymentIntentId;

                // Confirm payment with Stripe using Card Element
                const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card: cardElement,
                        billing_details: {
                            name: document.getElementById('cardName').value
                        }
                    }
                });

                if (stripeError) {
                    console.error('Stripe payment failed:', stripeError);
                    notifications.error(`Payment failed: ${stripeError.message}`);
                    return;
                }

                if (paymentIntent.status !== 'succeeded') {
                    notifications.error('Payment was not successful. Please try again.');
                    return;
                }

                console.log('✅ Stripe payment succeeded:', paymentIntent.id);
                notifications.success('Payment validated successfully!');

                
            } catch (stripeErr) {
                console.error('Stripe error:', stripeErr);
                notifications.error(`Payment error: ${stripeErr.message || 'Unknown error'}`);
                return;
            }
        }
        // =======================================

        // Prepare payment info
        let paymentInfo = '';
        
        if (method === 'card') {
            paymentInfo = 'Card Payment';
            
            // Save payment data for confirmation page
            const paymentData = {
                method: 'card',
                cardName: document.getElementById('cardName').value,
                cardNumber: '****',
                expiryDate: 'MM/YY'
            };
            localStorage.setItem('paymentData', JSON.stringify(paymentData));
        } else {
            paymentInfo = 'Cash on Delivery';
            
            // Save payment data for confirmation page
            const paymentData = {
                method: 'cod',
                total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
            };
            localStorage.setItem('paymentData', JSON.stringify(paymentData));
        }

        // Prepare order data for backend
        const orderData = {
            customer_id: customerId,
            shipping: shippingData,
            items: cart.map(item => ({
                product_id: item.id,
                quantity: item.quantity
            })),
            billing: {
                cardName: method === 'card' ? document.getElementById('cardName').value : '',
                cardNumber: method === 'card' ? '4242424242424242' : '',
                expiryDate: method === 'card' ? '12/25' : '',
                cvv: '',
                billingAddress: shippingData.address || '',
                billingCity: shippingData.city || '',
                billingZip: shippingData.zipCode || ''
            }
        };

        console.log('Submitting order:', orderData);

        // Submit order to backend
        const response = await fetch('/api/checkout/create-order/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfToken()
            },
            body: JSON.stringify(orderData)
        });

        const data = await response.json();
        
        console.log('📊 Response status:', response.status);
        console.log('📊 Response ok:', response.ok);
        console.log('📊 Response data:', data);
        console.log('📊 Has order_id:', !!data.order_id);

        if (response.ok && data.order_id) {
            console.log('✅ Order created successfully:', data);
            
            // Save order ID for confirmation page
            localStorage.setItem('lastOrderId', data.order_id);
            
            // Clear the cart from backend (should already be cleared by API)
            try {
                await fetch(`/api/cart/clear/?customer_id=${customerId}`, {
                    method: 'DELETE'
                });
            } catch (e) {
                console.error('Failed to clear cart:', e);
            }
            
            // Clear only the main cart (keep checkoutCart for confirmation page)
            localStorage.removeItem('farm2home_cart');
            
            // Redirect to confirmation page after short delay
            setTimeout(() => {
                window.location.href = '/checkout/confirmation/';
            }, 1500);
        } else {
            console.error('❌ Order creation failed:', data);
            console.error('Response status:', response.status);
            console.error('Response data:', data);
            
            // Show detailed error message
            const errorMsg = data.error || data.detail || data.details || 'Failed to create order. Please try again.';
            notifications.error(errorMsg);
        }
    } catch (error) {
        console.error('❌ Error creating order:', error);
        console.error('Error stack:', error.stack);
        notifications.error('Failed to process payment. Please try again.');
    }
}

// Go back
function goBack() {
    // Remove any button animation classes before redirecting back to cart
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.classList.remove('button-animate');
    }
    window.location.href = '/checkout/';
}

// Animated order button event handlers
$(document).ready(function() {
    const cardNameInput = document.getElementById('cardName');
    const cardOrderBtn = document.getElementById('cardOrderBtn');
    
    // Enable/disable button based on card name input AND card validation
    function updateCardButtonState() {
        const hasCardName = cardNameInput && cardNameInput.value.trim().length > 0;
        const hasCardDetails = stripe && stripeInitialized && cardElement;
        const cardErrorsDiv = document.getElementById('card-errors');
        const hasCardErrors = cardErrorsDiv && cardErrorsDiv.textContent.trim().length > 0;
        
        if (hasCardName && hasCardDetails && !hasCardErrors) {
            cardOrderBtn.disabled = false;
            cardOrderBtn.title = 'Complete your order';
        } else {
            cardOrderBtn.disabled = true;
            if (!hasCardName) {
                cardOrderBtn.title = 'Please enter cardholder name';
            } else if (hasCardErrors) {
                cardOrderBtn.title = 'Please enter correct card details: ' + (cardErrorsDiv?.textContent || 'Invalid card');
            } else {
                cardOrderBtn.title = 'Please enter complete card details';
            }
        }
    }
    
    if (cardNameInput && cardOrderBtn) {
        // Check state when user types in card name
        cardNameInput.addEventListener('input', function() {
            updateCardButtonState();
        });
        
        // Also check initial state after Stripe initializes
        const checkStripeInterval = setInterval(() => {
            if (stripeInitialized) {
                updateCardButtonState();
                clearInterval(checkStripeInterval);
            }
        }, 100);
    }
    
    // Handle card payment button click
    $('#cardOrderBtn').click(function(e) {
        e.preventDefault();
        
        // Validate card details first
        if (!validateCardPayment()) {
            return; // Validation failed, don't animate
        }
        
        let button = $(this);
        if(!button.hasClass('animate')) {
            // Trigger the animation only after validation passes
            button.addClass('animate');
            
            // Process the payment
            processPayment('card');
            
            // Reset animation after 10 seconds
            setTimeout(() => {
                button.removeClass('animate');
            }, 10000);
        }
    });
    
    // Handle COD payment button click
    $('#codOrderBtn').click(function(e) {
        e.preventDefault();
        let button = $(this);
        if(!button.hasClass('animate')) {
            // Trigger the animation
            button.addClass('animate');
            
            // Process the payment
            processPayment('cod');
            
            // Reset animation after 10 seconds
            setTimeout(() => {
                button.removeClass('animate');
            }, 10000);
        }
    });
});
