// Addresses Page Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize addresses page
    initializeAddressesPage();
    initializeAddressModal();
    initializeAddressActions();
});

/**
 * Initialize addresses page
 */
function initializeAddressesPage() {
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle) {
        pageTitle.textContent = 'Addresses';
    }
}

/**
 * Initialize address modal
 */
function initializeAddressModal() {
    const modal = document.getElementById('addressModal');
    const addNewCard = document.querySelector('.add-new-card');
    const addHeaderBtn = document.querySelector('.add-address-btn-header');
    const closeModalBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const addressForm = document.getElementById('addressForm');

    // Open modal when clicking add new card
    if (addNewCard) {
        addNewCard.addEventListener('click', function() {
            openAddressModal();
        });
    }

    // Open modal when clicking header button
    if (addHeaderBtn) {
        addHeaderBtn.addEventListener('click', function() {
            openAddressModal();
        });
    }

    // Close modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeAddressModal);
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeAddressModal);
    }

    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeAddressModal();
            }
        });
    }

    // Handle form submission
    if (addressForm) {
        addressForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveAddress();
        });
    }
}

/**
 * Initialize address actions (edit, delete, set default)
 */
function initializeAddressActions() {
    // Edit buttons
    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const addressCard = this.closest('.address-card');
            const addressId = addressCard?.getAttribute('data-address-id');
            if (addressId) {
                editAddress(addressId);
            }
        });
    });

    // Delete buttons
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const addressCard = this.closest('.address-card');
            const addressId = addressCard?.getAttribute('data-address-id');
            if (addressId) {
                deleteAddress(addressId);
            }
        });
    });

    // Set default buttons
    const setDefaultButtons = document.querySelectorAll('.set-default-btn');
    setDefaultButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const addressCard = this.closest('.address-card');
            const addressId = addressCard?.getAttribute('data-address-id');
            if (addressId) {
                setDefaultAddress(addressId);
            }
        });
    });
}

/**
 * Open address modal (add new or edit)
 */
function openAddressModal(addressData = null) {
    const modal = document.getElementById('addressModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('addressForm');

    if (addressData) {
        // Edit mode
        modalTitle.textContent = 'EDIT ADDRESS';
        populateForm(addressData);
    } else {
        // Add new mode
        modalTitle.textContent = 'ADD NEW ADDRESS';
        form.reset();
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Close address modal
 */
function closeAddressModal() {
    const modal = document.getElementById('addressModal');
    const form = document.getElementById('addressForm');
    
    modal.classList.remove('active');
    document.body.style.overflow = '';
    form.reset();
}

/**
 * Populate form with address data (for editing)
 */
function populateForm(addressData) {
    document.getElementById('addressType').value = addressData.type || 'home';
    document.getElementById('fullName').value = addressData.name || '';
    document.getElementById('addressLine').value = addressData.line || '';
    document.getElementById('city').value = addressData.city || '';
    document.getElementById('province').value = addressData.province || '';
    document.getElementById('postalCode').value = addressData.postalCode || '';
    document.getElementById('phone').value = addressData.phone || '';
    document.getElementById('setDefault').checked = addressData.isDefault || false;
}

/**
 * Save address (add new or update existing)
 */
function saveAddress() {
    const formData = {
        type: document.getElementById('addressType').value,
        name: document.getElementById('fullName').value,
        line: document.getElementById('addressLine').value,
        city: document.getElementById('city').value,
        province: document.getElementById('province').value,
        postalCode: document.getElementById('postalCode').value,
        phone: document.getElementById('phone').value,
        isDefault: document.getElementById('setDefault').checked
    };

    console.log('Saving address:', formData);

    // TODO: Implement actual save logic (API call)
    // For now, show success message
    alert('Address saved successfully!');
    closeAddressModal();

    // In a real app, you would:
    // 1. Send data to backend API
    // 2. Reload addresses list or add new card to DOM
    // 3. Update UI accordingly
}

/**
 * Edit address
 */
function editAddress(addressId) {
    console.log('Editing address:', addressId);

    // Get address data from card (in real app, fetch from API)
    const addressCard = document.querySelector(`[data-address-id="${addressId}"]`);
    if (!addressCard) return;

    const addressData = {
        id: addressId,
        type: addressCard.querySelector('.address-type h3').textContent.toLowerCase(),
        name: addressCard.querySelector('.address-name')?.textContent || '',
        line: addressCard.querySelector('.address-line')?.textContent || '',
        city: addressCard.querySelector('.address-city')?.textContent.split(',')[0] || '',
        province: addressCard.querySelector('.address-city')?.textContent.split(',')[1]?.split(' ')[1] || '',
        postalCode: addressCard.querySelector('.address-city')?.textContent.split(' ').pop() || '',
        phone: addressCard.querySelector('.address-phone')?.textContent || '',
        isDefault: addressCard.querySelector('.default-badge') !== null
    };

    openAddressModal(addressData);
}

/**
 * Delete address
 */
function deleteAddress(addressId) {
    console.log('Deleting address:', addressId);

    const confirmed = confirm('Are you sure you want to delete this address?');
    
    if (confirmed) {
        // TODO: Implement actual delete logic (API call)
        const addressCard = document.querySelector(`[data-address-id="${addressId}"]`);
        if (addressCard) {
            addressCard.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                addressCard.remove();
            }, 300);
        }

        // Show success message
        console.log('Address deleted successfully');
    }
}

/**
 * Set address as default
 */
function setDefaultAddress(addressId) {
    console.log('Setting default address:', addressId);

    // Remove default badge from all addresses
    const allDefaultBadges = document.querySelectorAll('.default-badge');
    allDefaultBadges.forEach(badge => {
        badge.remove();
    });

    // Remove all set-default buttons
    const allSetDefaultBtns = document.querySelectorAll('.set-default-btn');
    allSetDefaultBtns.forEach(btn => {
        const footer = btn.closest('.address-card-footer');
        if (footer) footer.remove();
    });

    // Add default badge to selected address
    const addressCard = document.querySelector(`[data-address-id="${addressId}"]`);
    if (addressCard) {
        const addressType = addressCard.querySelector('.address-type');
        if (addressType) {
            const defaultBadge = document.createElement('span');
            defaultBadge.className = 'default-badge';
            defaultBadge.innerHTML = '<i class="fas fa-star"></i> DEFAULT';
            addressType.appendChild(defaultBadge);
        }
    }

    // TODO: Implement actual API call to update default address
    console.log('Default address updated successfully');
}

/**
 * Helper function to format phone number
 */
function formatPhoneNumber(phone) {
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '');
    
    // Format as +92 (XXX) XXXXXXX
    if (cleaned.length >= 11) {
        return `+${cleaned.slice(0, 2)} (${cleaned.slice(2, 5)}) ${cleaned.slice(5)}`;
    }
    
    return phone;
}

/**
 * Helper function to validate form
 */
function validateAddressForm() {
    const requiredFields = [
        'fullName',
        'addressLine',
        'city',
        'province',
        'postalCode',
        'phone'
    ];

    let isValid = true;

    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field || !field.value.trim()) {
            isValid = false;
            field?.classList.add('error');
        } else {
            field?.classList.remove('error');
        }
    });

    return isValid;
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
window.addressesFunctions = {
    openAddressModal,
    closeAddressModal,
    editAddress,
    deleteAddress,
    setDefaultAddress,
    formatPhoneNumber,
    validateAddressForm
};
