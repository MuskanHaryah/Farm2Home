let cart = [];
let shippingData = {};
let paymentData = {};

// Initialize confirmation page
document.addEventListener('DOMContentLoaded', async function() {
    await loadOrderData();
    loadShippingData();
    loadPaymentData();
    displayConfirmationDetails();
});

// Load order data from backend or localStorage
async function loadOrderData() {
    // First, try to get the last order ID
    const lastOrderId = localStorage.getItem('lastOrderId');
    
    if (lastOrderId) {
        // Fetch order from backend
        try {
            console.log('📦 Fetching order #' + lastOrderId);
            const response = await fetch(`/api/checkout/order/${lastOrderId}/`);
            const data = await response.json();
            
            if (response.ok) {
                console.log('✅ Order data loaded from backend:', data);
                // Convert backend format to cart format
                cart = data.items || [];
                
                // Update shipping data if available
                if (data.shipping) {
                    shippingData = data.shipping;
                    localStorage.setItem('shippingData', JSON.stringify(shippingData));
                }
                
                return;
            }
        } catch (error) {
            console.error('❌ Failed to load order from backend:', error);
        }
    }
    
    // Fallback: try to load from localStorage (this data will exist until user clicks Continue Shopping)
    const cartData = localStorage.getItem('checkoutCart');
    if (cartData) {
        try {
            cart = JSON.parse(cartData);
            console.log('Cart loaded from localStorage:', cart);
        } catch (e) {
            console.error('Error loading cart data:', e);
            cart = [];
        }
    }
    
    // If still no data, use saved shipping/payment data to show confirmation
    if (cart.length === 0) {
        console.warn('⚠️ No cart data, but order was placed successfully');
        // Don't redirect - still show confirmation message
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

// Carousel functions removed - no longer needed on confirmation page

// Display confirmation details
function displayConfirmationDetails() {
    const confirmationDetails = document.getElementById('confirmationDetails');
    const confirmationShipping = document.getElementById('confirmationShipping');
    const confirmationPayment = document.getElementById('confirmationPayment');

    // Build order details
    let detailsHTML = '';
    let total = 0;
    
    if (cart && cart.length > 0) {
        total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        cart.forEach((item, index) => {
            const itemDesc = item.description || 'Fresh organic produce';
            
            detailsHTML += `
                <div class="confirmation-item">
                    <div class="confirmation-item-details">
                        <div class="confirmation-item-name">${item.name}</div>
                        <div class="confirmation-item-desc">${itemDesc}</div>
                    </div>
                    <div class="confirmation-item-price">PKR ${(item.price * item.quantity).toFixed(2)}</div>
                </div>
            `;
        });

        detailsHTML += `
            <div class="confirmation-total">
                <span>TOTAL</span>
                <span>PKR ${total.toFixed(2)}</span>
            </div>
        `;
    } else {
        // Show generic success message if no cart data
        detailsHTML = `
            <div style="text-align: center; padding: 40px 20px;">
                <h2 style="color: #4CAF50; margin-bottom: 20px;">✅ Order Placed Successfully!</h2>
                <p style="font-size: 16px; color: #666; margin-bottom: 15px;">
                    Thank you for your order. Your order has been received and is being processed.
                </p>
                <p style="font-size: 14px; color: #888;">
                    📧 A confirmation email will be sent to your email address shortly with your order details.
                </p>
            </div>
        `;
    }

    if (confirmationDetails) {
        confirmationDetails.innerHTML = detailsHTML;
    }

    // Build shipping info
    if (confirmationShipping) {
        const shippingHTML = `
            <div class="info-line">${shippingData.fullName || 'Customer'}</div>
            <div class="info-line">${shippingData.email || ''}</div>
            <div class="info-line">${shippingData.phone || ''}</div>
            ${shippingData.address ? `<div class="info-line">${shippingData.address}</div>` : ''}
            ${shippingData.city ? `<div class="info-line">${shippingData.city}${shippingData.zipCode ? ', ' + shippingData.zipCode : ''}</div>` : ''}
        `;
        confirmationShipping.innerHTML = shippingHTML;
    }

    // Build payment info
    if (confirmationPayment) {
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
}

// Continue shopping - redirect to catalog
function continueShopping() {
    console.log('Continue Shopping clicked!');
    
    try {
        // Clear checkout data
        localStorage.removeItem('checkoutCart');
        localStorage.removeItem('shippingData');
        localStorage.removeItem('paymentData');
        localStorage.removeItem('lastOrderId');
        
        // Show notification if available
        if (typeof notifications !== 'undefined') {
            notifications.success('🎉 Thank you for your order! Continue shopping for more fresh produce.');
        }
        
        // Redirect to catalog
        setTimeout(() => {
            window.location.href = '/catalog/';
        }, 1000);
    } catch (error) {
        console.error('Error in continueShopping:', error);
        // Fallback - direct redirect
        window.location.href = '/catalog/';
    }
}

// Back to home
function backToHome() {
    continueShopping();
}

// Download receipt (optional - can be removed if not needed)
function downloadReceipt() {
    if (!cart || cart.length === 0) {
        notifications.info('Receipt will be sent to your email address.');
        return;
    }
    
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

// Make functions globally accessible
window.continueShopping = continueShopping;
window.backToHome = backToHome;
window.downloadReceipt = downloadReceipt;
window.goBack = goBack;
