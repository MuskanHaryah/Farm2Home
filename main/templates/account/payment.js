// Payment Methods Page Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize payment page
    initializePaymentPage();
    initializePaymentModal();
    initializePaymentActions();
    initializeWalletActions();
});

/**
 * Initialize payment page
 */
function initializePaymentPage() {
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle) {
        pageTitle.textContent = 'Payment';
    }

    // Handle payment type selection to show/hide relevant fields
    const paymentTypeSelect = document.getElementById('paymentType');
    if (paymentTypeSelect) {
        paymentTypeSelect.addEventListener('change', function() {
            togglePaymentFields(this.value);
        });
    }
}

/**
 * Initialize payment modal
 */
function initializePaymentModal() {
    const modal = document.getElementById('paymentModal');
    const addNewCard = document.querySelector('.add-new-payment-card');
    const addHeaderBtn = document.querySelector('.add-payment-btn-header');
    const closeModalBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const paymentForm = document.getElementById('paymentForm');

    // Open modal when clicking add new card
    if (addNewCard) {
        addNewCard.addEventListener('click', function() {
            openPaymentModal();
        });
    }

    // Open modal when clicking header button
    if (addHeaderBtn) {
        addHeaderBtn.addEventListener('click', function() {
            openPaymentModal();
        });
    }

    // Close modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closePaymentModal);
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', closePaymentModal);
    }

    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closePaymentModal();
            }
        });
    }

    // Handle form submission
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            savePaymentMethod();
        });
    }

    // Format card number input
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            this.value = formatCardNumber(this.value);
        });
    }

    // Format expiry date input
    const expiryInput = document.getElementById('expiryDate');
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            this.value = formatExpiryDate(this.value);
        });
    }

    // CVV validation
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/\D/g, '');
        });
    }
}

/**
 * Initialize payment actions (edit, delete, set default)
 */
function initializePaymentActions() {
    // Edit buttons
    const editButtons = document.querySelectorAll('.edit-btn-payment');
    editButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const paymentCard = this.closest('.payment-card');
            const paymentId = paymentCard?.getAttribute('data-payment-id');
            if (paymentId) {
                editPaymentMethod(paymentId);
            }
        });
    });

    // Delete buttons
    const deleteButtons = document.querySelectorAll('.delete-btn-payment');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const paymentCard = this.closest('.payment-card');
            const paymentId = paymentCard?.getAttribute('data-payment-id');
            if (paymentId) {
                deletePaymentMethod(paymentId);
            }
        });
    });

    // Set default buttons
    const setDefaultButtons = document.querySelectorAll('.set-default-payment-btn');
    setDefaultButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const paymentCard = this.closest('.payment-card');
            const paymentId = paymentCard?.getAttribute('data-payment-id');
            if (paymentId) {
                setDefaultPayment(paymentId);
            }
        });
    });
}

/**
 * Initialize wallet actions
 */
function initializeWalletActions() {
    const addFundsBtn = document.querySelector('.add-funds-btn');
    const viewHistoryBtn = document.querySelector('.view-history-btn');

    if (addFundsBtn) {
        addFundsBtn.addEventListener('click', function() {
            addFundsToWallet();
        });
    }

    if (viewHistoryBtn) {
        viewHistoryBtn.addEventListener('click', function() {
            viewWalletHistory();
        });
    }
}

/**
 * Toggle payment form fields based on payment type
 */
function togglePaymentFields(paymentType) {
    const cardNumberGroup = document.getElementById('cardNumberGroup');
    const cardHolderGroup = document.getElementById('cardHolderGroup');
    const cardDetailsRow = document.getElementById('cardDetailsRow');
    const bankGroup = document.getElementById('bankGroup');

    if (paymentType === 'jazzcash' || paymentType === 'easypaisa') {
        // Hide card-specific fields for mobile wallets
        cardNumberGroup.style.display = 'none';
        cardHolderGroup.style.display = 'none';
        cardDetailsRow.style.display = 'none';
        bankGroup.style.display = 'none';

        // Change labels/placeholders for mobile wallet
        // Could add email/phone field here
    } else {
        // Show card fields
        cardNumberGroup.style.display = 'block';
        cardHolderGroup.style.display = 'block';
        cardDetailsRow.style.display = 'grid';
        bankGroup.style.display = 'block';
    }
}

/**
 * Open payment modal (add new or edit)
 */
function openPaymentModal(paymentData = null) {
    const modal = document.getElementById('paymentModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('paymentForm');

    if (paymentData) {
        // Edit mode
        modalTitle.textContent = 'EDIT PAYMENT METHOD';
        populatePaymentForm(paymentData);
    } else {
        // Add new mode
        modalTitle.textContent = 'ADD PAYMENT METHOD';
        form.reset();
        togglePaymentFields('debit'); // Show card fields by default
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Close payment modal
 */
function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    const form = document.getElementById('paymentForm');
    
    modal.classList.remove('active');
    document.body.style.overflow = '';
    form.reset();
}

/**
 * Populate form with payment data (for editing)
 */
function populatePaymentForm(paymentData) {
    document.getElementById('paymentType').value = paymentData.type || 'debit';
    document.getElementById('cardNumber').value = paymentData.cardNumber || '';
    document.getElementById('cardHolder').value = paymentData.cardHolder || '';
    document.getElementById('expiryDate').value = paymentData.expiry || '';
    document.getElementById('bankName').value = paymentData.bank || '';
    document.getElementById('setDefaultPayment').checked = paymentData.isDefault || false;

    togglePaymentFields(paymentData.type || 'debit');
}

/**
 * Save payment method (add new or update existing)
 */
function savePaymentMethod() {
    const paymentType = document.getElementById('paymentType').value;
    
    const formData = {
        type: paymentType,
        cardNumber: document.getElementById('cardNumber').value,
        cardHolder: document.getElementById('cardHolder').value,
        expiry: document.getElementById('expiryDate').value,
        cvv: document.getElementById('cvv').value,
        bank: document.getElementById('bankName').value,
        isDefault: document.getElementById('setDefaultPayment').checked
    };

    console.log('Saving payment method:', formData);

    // TODO: Implement actual save logic (API call)
    // For now, show success message
    alert('Payment method saved successfully!');
    closePaymentModal();

    // In a real app, you would:
    // 1. Validate card details
    // 2. Send data to secure payment gateway
    // 3. Reload payment methods list or add new card to DOM
    // 4. Update UI accordingly
}

/**
 * Edit payment method
 */
function editPaymentMethod(paymentId) {
    console.log('Editing payment method:', paymentId);

    // Get payment data from card (in real app, fetch from API)
    const paymentCard = document.querySelector(`[data-payment-id="${paymentId}"]`);
    if (!paymentCard) return;

    let paymentData = {
        id: paymentId,
        isDefault: paymentCard.classList.contains('default-payment')
    };

    // Check if it's JazzCash
    if (paymentId === 'jazzcash') {
        paymentData.type = 'jazzcash';
        paymentData.email = paymentCard.querySelector('.jazzcash-email')?.textContent || '';
    } else {
        // Regular card
        paymentData.type = paymentCard.querySelector('.card-bank')?.textContent.includes('CREDIT') ? 'credit' : 'debit';
        paymentData.cardNumber = paymentCard.querySelector('.card-number')?.textContent || '';
        paymentData.cardHolder = paymentCard.querySelector('.card-holder')?.textContent || '';
        paymentData.expiry = paymentCard.querySelector('.card-expiry')?.textContent || '';
        paymentData.bank = paymentCard.querySelector('.card-bank')?.textContent.replace(' DEBIT CARD', '').replace(' CREDIT CARD', '') || '';
    }

    openPaymentModal(paymentData);
}

/**
 * Delete payment method
 */
function deletePaymentMethod(paymentId) {
    console.log('Deleting payment method:', paymentId);

    const paymentCard = document.querySelector(`[data-payment-id="${paymentId}"]`);
    
    // Check if it's the default payment method
    if (paymentCard && paymentCard.classList.contains('default-payment')) {
        alert('Cannot delete the default payment method. Please set another payment method as default first.');
        return;
    }

    const confirmed = confirm('Are you sure you want to delete this payment method?');
    
    if (confirmed) {
        // TODO: Implement actual delete logic (API call)
        if (paymentCard) {
            paymentCard.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                paymentCard.remove();
            }, 300);
        }

        console.log('Payment method deleted successfully');
    }
}

/**
 * Set payment method as default
 */
function setDefaultPayment(paymentId) {
    console.log('Setting default payment method:', paymentId);

    // Remove default styling from all cards
    const allPaymentCards = document.querySelectorAll('.payment-card');
    allPaymentCards.forEach(card => {
        card.classList.remove('default-payment');
        
        // Remove default badge
        const defaultBadge = card.querySelector('.default-badge-payment');
        if (defaultBadge) {
            defaultBadge.remove();
        }

        // Replace footer with set-default button if not add-new card
        if (!card.classList.contains('add-new-payment-card')) {
            const footer = card.querySelector('.payment-card-footer');
            if (footer && !footer.querySelector('.set-default-payment-btn')) {
                footer.innerHTML = `
                    <button class="set-default-payment-btn">
                        <i class="far fa-star"></i>
                        SET AS DEFAULT
                    </button>
                    <div class="footer-actions">
                        <button class="icon-btn-payment edit-btn-payment" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="icon-btn-payment delete-btn-payment" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
            }
        }
    });

    // Add default styling to selected card
    const selectedCard = document.querySelector(`[data-payment-id="${paymentId}"]`);
    if (selectedCard) {
        selectedCard.classList.add('default-payment');
        
        // Add default badge to header
        const cardIconSection = selectedCard.querySelector('.card-icon-section');
        if (cardIconSection) {
            const defaultBadge = document.createElement('div');
            defaultBadge.className = 'default-badge-payment';
            defaultBadge.innerHTML = '<i class="fas fa-star"></i> DEFAULT';
            cardIconSection.appendChild(defaultBadge);
        }

        // Update footer to only show action buttons
        const footer = selectedCard.querySelector('.payment-card-footer');
        if (footer) {
            footer.innerHTML = `
                <button class="icon-btn-payment edit-btn-payment" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="icon-btn-payment delete-btn-payment" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            `;
        }
    }

    // Reinitialize event listeners
    initializePaymentActions();

    // TODO: Implement actual API call to update default payment
    console.log('Default payment method updated successfully');
}

/**
 * Add funds to wallet
 */
function addFundsToWallet() {
    const amount = prompt('Enter amount to add (Rs.):');
    
    if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
        console.log('Adding funds:', amount);
        // TODO: Implement actual add funds logic
        alert(`Rs.${amount} will be added to your wallet.`);
        
        // In real app: redirect to payment gateway or show payment modal
    } else if (amount !== null) {
        alert('Please enter a valid amount.');
    }
}

/**
 * View wallet transaction history
 */
function viewWalletHistory() {
    console.log('Viewing wallet history');
    // TODO: Implement wallet history page/modal
    alert('Wallet history - To be implemented');
    
    // In real app: navigate to wallet-history.html or show modal with transactions
}

/**
 * Format card number with spaces
 */
function formatCardNumber(value) {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, '');
    
    // Add space every 4 digits
    const formatted = cleaned.match(/.{1,4}/g);
    
    return formatted ? formatted.join(' ') : cleaned;
}

/**
 * Format expiry date as MM/YY
 */
function formatExpiryDate(value) {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, '');
    
    // Add slash after 2 digits
    if (cleaned.length >= 2) {
        return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    
    return cleaned;
}

/**
 * Validate card number using Luhn algorithm
 */
function validateCardNumber(cardNumber) {
    const cleaned = cardNumber.replace(/\D/g, '');
    
    if (cleaned.length < 13 || cleaned.length > 19) {
        return false;
    }

    let sum = 0;
    let isEven = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
        let digit = parseInt(cleaned[i], 10);

        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        isEven = !isEven;
    }

    return sum % 10 === 0;
}

/**
 * Add fadeOut animation for delete
 */
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.9);
        }
    }
`;
document.head.appendChild(style);

// Export functions for use in other modules if needed
window.paymentFunctions = {
    openPaymentModal,
    closePaymentModal,
    editPaymentMethod,
    deletePaymentMethod,
    setDefaultPayment,
    addFundsToWallet,
    viewWalletHistory,
    formatCardNumber,
    formatExpiryDate,
    validateCardNumber
};
