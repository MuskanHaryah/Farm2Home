// Addresses Page - Steps 10-26 Implementation
let allAddressesData = [];

// Helper function to get CSRF token from cookies
function getCookie(name) {
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

// Get CSRF token
const csrftoken = getCookie('csrftoken');

// Step 10: Initialize with authentication check
document.addEventListener('DOMContentLoaded', function() {
    const customerId = localStorage.getItem('customer_id');
    if (!customerId) {
        window.location.replace('/landing/');
        return;
    }
    updateSidebarProfile();
    fetchCustomerAddresses();
    initializeAddressModal();
    initializeAddressActions();
});

// Step 11: Fetch addresses from API
async function fetchCustomerAddresses() {
    const customerId = localStorage.getItem('customer_id');
    if (!customerId) {
        handleAuthError();
        return;
    }
    
    // Show loading state
    const loadingState = document.getElementById('loadingState');
    const emptyState = document.getElementById('emptyState');
    if (loadingState) loadingState.style.display = 'block';
    if (emptyState) emptyState.style.display = 'none';
    
    try {
        const response = await fetch(`/api/customer/addresses/?customer_id=${customerId}`);
        if (!response.ok) {
            if (response.status === 404 || response.status === 401 || response.status === 403) {
                handleAuthError();
                return;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (data.status === 'success') {
            allAddressesData = data.data || [];
            renderAddressesUI(allAddressesData);
        } else {
            allAddressesData = [];
            renderAddressesUI([]);
        }
    } catch (error) {
        console.error('Error fetching addresses:', error);
        allAddressesData = [];
        renderAddressesUI([]);
    }
}

// Step 12: Render addresses UI
function renderAddressesUI(addresses) {
    const container = document.getElementById('addressesContainer');
    const emptyState = document.getElementById('emptyState');
    const loadingState = document.getElementById('loadingState');
    
    if (!container) return;
    
    // Hide loading state
    if (loadingState) {
        loadingState.style.display = 'none';
    }
    
    // Clear container
    container.innerHTML = '';
    
    if (!addresses || addresses.length === 0) {
        // No addresses - hide container and show empty state
        container.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }
    
    // Has addresses - show container and hide empty state
    container.style.display = 'grid';
    if (emptyState) emptyState.style.display = 'none';
    
    addresses.forEach((address, index) => {
        const card = renderAddressCard(address);
        card.style.animation = `fadeIn 0.4s ease forwards`;
        card.style.animationDelay = `${index * 0.1}s`;
        card.style.opacity = '0';
        container.appendChild(card);
    });
    
    // Add the "Add New Address" card at the end
    const addNewCard = document.createElement('div');
    addNewCard.className = 'address-card add-new-card';
    addNewCard.innerHTML = `
        <div class="add-new-content">
            <div class="add-icon">
                <i class="fas fa-plus"></i>
            </div>
            <h3>ADD NEW ADDRESS</h3>
            <p>SAVE A NEW DELIVERY LOCATION</p>
        </div>
    `;
    container.appendChild(addNewCard);
}

// Step 13: Render individual address card
function renderAddressCard(address) {
    const card = document.createElement('div');
    card.className = 'address-card';
    card.setAttribute('data-address-id', address.address_id);
    
    const iconClass = getAddressIconClass(address.label);
    const iconType = address.label ? address.label.toLowerCase() : 'other';
    
    const cardHeader = document.createElement('div');
    cardHeader.className = 'address-card-header';
    
    const iconLabel = document.createElement('div');
    iconLabel.className = 'address-icon-label';
    
    const iconDiv = document.createElement('div');
    iconDiv.className = `address-icon ${iconType}-icon`;
    iconDiv.innerHTML = `<i class="${iconClass}"></i>`;
    
    const typeDiv = document.createElement('div');
    typeDiv.className = 'address-type';
    
    const typeHeading = document.createElement('h3');
    typeHeading.textContent = address.label ? address.label.toUpperCase() : 'OTHER';
    typeDiv.appendChild(typeHeading);
    
    if (address.is_default) {
        const badge = document.createElement('span');
        badge.className = 'default-badge';
        badge.innerHTML = '<i class="fas fa-star"></i> DEFAULT';
        typeDiv.appendChild(badge);
    }
    
    iconLabel.appendChild(iconDiv);
    iconLabel.appendChild(typeDiv);
    
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'address-actions';
    
    const editBtn = document.createElement('button');
    editBtn.className = 'icon-btn edit-btn';
    editBtn.title = 'Edit address';
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        editAddress(address.address_id);
    });
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'icon-btn delete-btn';
    deleteBtn.title = 'Delete address';
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteAddress(address.address_id);
    });
    
    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);
    cardHeader.appendChild(iconLabel);
    cardHeader.appendChild(actionsDiv);
    
    const cardBody = document.createElement('div');
    cardBody.className = 'address-card-body';
    
    const addressLine = document.createElement('p');
    addressLine.className = 'address-line';
    addressLine.textContent = address.address_line || 'No address';
    
    const cityPostal = document.createElement('p');
    cityPostal.className = 'address-city';
    cityPostal.textContent = `${address.city || ''} ${address.postal_code || ''}`;
    
    const phone = document.createElement('p');
    phone.className = 'address-phone';
    phone.textContent = formatPhoneNumber(address.phone || '');
    
    cardBody.appendChild(addressLine);
    cardBody.appendChild(cityPostal);
    cardBody.appendChild(phone);
    
    card.appendChild(cardHeader);
    card.appendChild(cardBody);
    
    if (!address.is_default) {
        const footer = document.createElement('div');
        footer.className = 'address-card-footer';
        
        const setDefaultBtn = document.createElement('button');
        setDefaultBtn.className = 'set-default-btn';
        setDefaultBtn.innerHTML = '<i class="far fa-star"></i> SET AS DEFAULT';
        setDefaultBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            setDefaultAddress(address.address_id);
        });
        
        footer.appendChild(setDefaultBtn);
        card.appendChild(footer);
    }
    
    return card;
}

// Step 14: Update sidebar profile
function updateSidebarProfile() {
    const name = localStorage.getItem('customer_name');
    const email = localStorage.getItem('customer_email');
    
    const nameEl = document.getElementById('profileName');
    const emailEl = document.getElementById('profileEmail');
    
    if (nameEl && name) nameEl.textContent = name.toUpperCase();
    if (emailEl && email) emailEl.textContent = email.toUpperCase();
    
    updateOrdersCount();
}

function updateOrdersCount() {
    const el = document.getElementById('sidebarTotalOrders');
    const customerId = localStorage.getItem('customer_id');
    if (!el || !customerId) return;
    
    fetch(`/api/customer/orders/?customer_id=${customerId}`)
        .then(r => r.json())
        .then(data => {
            if (data.status === 'success' && data.data) {
                const count = data.data.length;
                el.textContent = `${count} ${count === 1 ? 'Order' : 'Orders'}`;
            }
        })
        .catch(err => console.log('Could not fetch orders:', err));
}

function handleAuthError() {
    localStorage.removeItem('customer_id');
    localStorage.removeItem('customer_name');
    localStorage.removeItem('customer_email');
    window.location.replace('/landing/');
}

function getAddressIconClass(label) {
    const icons = {
        'HOME': 'fas fa-home',
        'WORK': 'fas fa-briefcase',
        'OTHER': 'fas fa-map-marker-alt'
    };
    return icons[label] || 'fas fa-map-marker-alt';
}

function formatPhoneNumber(phone) {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length >= 11 && cleaned.startsWith('92')) {
        return `+${cleaned.slice(0, 2)} (${cleaned.slice(2, 5)}) ${cleaned.slice(5)}`;
    } else if (cleaned.length >= 10) {
        return `+92 (${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    }
    return phone;
}

// Steps 15-26: Modal and CRUD Operations

function initializeAddressModal() {
    const modal = document.getElementById('addressModal');
    const addNewCard = document.querySelector('.add-new-card');
    const addHeaderBtn = document.querySelector('.add-address-btn-header');
    const closeBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const form = document.getElementById('addressForm');
    
    if (addNewCard) {
        addNewCard.addEventListener('click', () => showAddAddressModal());
    }
    if (addHeaderBtn) {
        addHeaderBtn.addEventListener('click', () => showAddAddressModal());
    }
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.getElementById('addressModal');
            if (modal && modal.classList.contains('active')) closeModal();
        }
    });
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const addressId = form.getAttribute('data-address-id');
            if (addressId) {
                handleUpdateAddress(addressId);
            } else {
                handleAddAddress();
            }
        });
    }
    
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        const newBtn = logoutBtn.cloneNode(true);
        logoutBtn.parentNode.replaceChild(newBtn, logoutBtn);
        newBtn.addEventListener('click', handleLogout);
    }
}

function initializeAddressActions() {
    console.log('Address actions initialized');
}

// Step 15: Show add modal
function showAddAddressModal() {
    const modal = document.getElementById('addressModal');
    const title = document.getElementById('modalTitle');
    const form = document.getElementById('addressForm');
    if (!modal || !title || !form) return;
    
    title.textContent = 'ADD DELIVERY ADDRESS';
    form.reset();
    form.removeAttribute('data-address-id');
    openModal();
}

// Step 16: Add address
async function handleAddAddress() {
    const customerId = localStorage.getItem('customer_id');
    if (!customerId) {
        handleAuthError();
        return;
    }
    
    const label = document.getElementById('addressType').value.toUpperCase();
    const addressLine = document.getElementById('addressLine').value.trim();
    const city = document.getElementById('city').value.trim();
    const postalCode = document.getElementById('postalCode').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const isDefault = document.getElementById('isDefault').checked;
    
    const validation = validateAddressForm();
    if (!validation.isValid) {
        if (typeof notifications !== 'undefined') {
            notifications.error(validation.errors[0]);
        } else {
            alert(validation.errors[0]);
        }
        return;
    }
    
    showLoadingState();
    
    try {
        const response = await fetch('/api/customer/addresses/add/', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({
                customer_id: parseInt(customerId),
                label, address_line: addressLine, city, postal_code: postalCode, phone, is_default: isDefault
            })
        });
        
        const data = await response.json();
        if (response.ok && data.status === 'success') {
            if (typeof notifications !== 'undefined') {
                notifications.success('✅ Address added successfully!');
            }
            closeModal();
            await fetchCustomerAddresses();
        } else {
            if (typeof notifications !== 'undefined') {
                notifications.error(data.message || 'Failed to add address');
            } else {
                alert(data.message || 'Failed to add address');
            }
        }
    } catch (error) {
        if (typeof notifications !== 'undefined') {
            notifications.error('Network error. Please try again.');
        } else {
            alert('Network error. Please try again.');
        }
    } finally {
        hideLoadingState();
    }
}

// Step 17: Show edit modal
function showEditAddressModal(addressId) {
    const address = allAddressesData.find(a => a.address_id === addressId);
    if (!address) return;
    
    const modal = document.getElementById('addressModal');
    const title = document.getElementById('modalTitle');
    const form = document.getElementById('addressForm');
    if (!modal || !title || !form) return;
    
    title.textContent = 'EDIT ADDRESS';
    document.getElementById('addressType').value = address.label ? address.label.toLowerCase() : 'home';
    document.getElementById('addressLine').value = address.address_line || '';
    document.getElementById('city').value = address.city || '';
    document.getElementById('postalCode').value = address.postal_code || '';
    document.getElementById('phone').value = address.phone || '';
    document.getElementById('isDefault').checked = address.is_default || false;
    form.setAttribute('data-address-id', addressId);
    openModal();
}

// Step 18: Update address
async function handleUpdateAddress(addressId) {
    const customerId = localStorage.getItem('customer_id');
    if (!customerId) {
        handleAuthError();
        return;
    }
    
    const label = document.getElementById('addressType').value.toUpperCase();
    const addressLine = document.getElementById('addressLine').value.trim();
    const city = document.getElementById('city').value.trim();
    const postalCode = document.getElementById('postalCode').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const isDefault = document.getElementById('isDefault').checked;
    
    const validation = validateAddressForm();
    if (!validation.isValid) {
        if (typeof notifications !== 'undefined') {
            notifications.error(validation.errors[0]);
        } else {
            alert(validation.errors[0]);
        }
        return;
    }
    
    showLoadingState();
    
    try {
        const response = await fetch(`/api/customer/addresses/${addressId}/`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({
                customer_id: parseInt(customerId),
                label, address_line: addressLine, city, postal_code: postalCode, phone, is_default: isDefault
            })
        });
        
        const data = await response.json();
        if (response.ok && data.status === 'success') {
            if (typeof notifications !== 'undefined') {
                notifications.success('✅ Address updated successfully!');
            }
            closeModal();
            await fetchCustomerAddresses();
        } else {
            if (typeof notifications !== 'undefined') {
                notifications.error(data.message || 'Failed to update address');
            } else {
                alert(data.message || 'Failed to update address');
            }
        }
    } catch (error) {
        if (typeof notifications !== 'undefined') {
            notifications.error('Network error. Please try again.');
        } else {
            alert('Network error. Please try again.');
        }
    } finally {
        hideLoadingState();
    }
}

// Step 19: Delete address
async function handleDeleteAddress(addressId) {
    const customerId = localStorage.getItem('customer_id');
    if (!customerId) {
        handleAuthError();
        return;
    }
    
    const address = allAddressesData.find(a => a.address_id === addressId);
    const label = address ? address.label : 'this address';
    
    // Show custom delete confirmation modal
    showDeleteConfirmation(label, async () => {
        showLoadingState();
        
        try {
            const response = await fetch(`/api/customer/addresses/${addressId}/delete/?customer_id=${customerId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRFToken': csrftoken
                }
            });
            
            const data = await response.json();
            if (response.ok && data.status === 'success') {
                if (typeof notifications !== 'undefined') {
                    notifications.success('✅ Address deleted successfully!');
                }
                await fetchCustomerAddresses();
            } else {
                if (typeof notifications !== 'undefined') {
                    notifications.error(data.message || 'Failed to delete address');
                } else {
                    alert(data.message || 'Failed to delete address');
                }
            }
        } catch (error) {
            if (typeof notifications !== 'undefined') {
                notifications.error('Network error. Please try again.');
            } else {
                alert('Network error. Please try again.');
            }
        } finally {
            hideLoadingState();
        }
    });
}

// Step 20: Set default address
async function handleSetDefaultAddress(addressId) {
    const customerId = localStorage.getItem('customer_id');
    if (!customerId) {
        handleAuthError();
        return;
    }
    
    showLoadingState();
    
    try {
        const response = await fetch(`/api/customer/addresses/${addressId}/set-default/`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({ customer_id: parseInt(customerId) })
        });
        
        const data = await response.json();
        if (response.ok && data.status === 'success') {
            if (typeof notifications !== 'undefined') {
                notifications.success('✅ Default address updated!');
            }
            await fetchCustomerAddresses();
        } else {
            if (typeof notifications !== 'undefined') {
                notifications.error(data.message || 'Failed to set default');
            } else {
                alert(data.message || 'Failed to set default');
            }
        }
    } catch (error) {
        if (typeof notifications !== 'undefined') {
            notifications.error('Network error. Please try again.');
        } else {
            alert('Network error. Please try again.');
        }
    } finally {
        hideLoadingState();
    }
}

// Step 21: Loading states
function showLoadingState() {
    const addBtn = document.querySelector('.add-address-btn-header');
    const saveBtn = document.querySelector('.btn-save');
    if (addBtn) {
        addBtn.disabled = true;
        addBtn.style.opacity = '0.6';
    }
    if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.textContent = 'SAVING...';
    }
}

function hideLoadingState() {
    const addBtn = document.querySelector('.add-address-btn-header');
    const saveBtn = document.querySelector('.btn-save');
    if (addBtn) {
        addBtn.disabled = false;
        addBtn.style.opacity = '1';
    }
    if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.textContent = 'SAVE ADDRESS';
    }
}

// Step 22: Validation
function validateAddressForm() {
    const errors = [];
    const type = document.getElementById('addressType').value;
    const line = document.getElementById('addressLine').value.trim();
    const city = document.getElementById('city').value.trim();
    const postal = document.getElementById('postalCode').value.trim();
    const phone = document.getElementById('phone').value.trim();
    
    if (!type) errors.push('Address type is required');
    if (!line) errors.push('Street address is required');
    if (!city) errors.push('City is required');
    if (!postal) {
        errors.push('Postal code is required');
    } else if (!validatePostalCode(postal)) {
        errors.push('Postal code must be 5 digits');
    }
    if (!phone) {
        errors.push('Phone number is required');
    } else if (!validatePhoneNumber(phone)) {
        errors.push('Invalid phone number format');
    }
    
    return { isValid: errors.length === 0, errors };
}

function validatePhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 15;
}

function validatePostalCode(postal) {
    return /^\d{5}$/.test(postal);
}

// Step 23: Modal utilities
function openModal() {
    const modal = document.getElementById('addressModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('addressModal');
    const form = document.getElementById('addressForm');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    if (form) {
        form.reset();
        form.removeAttribute('data-address-id');
    }
}

// Step 25: Logout - Use centralized function from account.js
function handleLogout() {
    if (window.accountFunctions && window.accountFunctions.handleAccountLogout) {
        window.accountFunctions.handleAccountLogout();
    } else {
        // Fallback if account.js not loaded
        if (!confirm('Are you sure you want to logout?')) return;
        localStorage.removeItem('customer_id');
        localStorage.removeItem('customer_name');
        localStorage.removeItem('customer_email');
        localStorage.removeItem('farm2home_cart');
        localStorage.removeItem('checkoutCart');
        window.location.replace('/landing/');
    }
}

// Step 26: Helper functions
function getAddressIcon(label) {
    const icons = {
        'HOME': 'fas fa-home',
        'WORK': 'fas fa-briefcase',
        'OTHER': 'fas fa-map-marker-alt'
    };
    return icons[label] || 'fas fa-map-marker-alt';
}

function getAddressLabel(label) {
    const labels = { 'HOME': 'Home', 'WORK': 'Work', 'OTHER': 'Other' };
    return labels[label] || 'Other';
}

// Step 24: Wrappers for event listeners
function editAddress(id) { showEditAddressModal(id); }
function deleteAddress(id) { handleDeleteAddress(id); }
function setDefaultAddress(id) { handleSetDefaultAddress(id); }

// Custom Delete Confirmation Modal
function showDeleteConfirmation(addressLabel, onConfirm) {
    // Create modal backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'delete-modal-backdrop';
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
    modal.className = 'delete-modal';
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
                Delete Address?
            </h3>
            <p style="color: #718096; margin: 0; font-size: 0.95rem; line-height: 1.5;">
                Are you sure you want to delete your <strong>${addressLabel}</strong> address? This action cannot be undone.
            </p>
        </div>
        <div style="display: flex; gap: 0.75rem; justify-content: center;">
            <button id="cancelDelete" style="
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
            <button id="confirmDelete" style="
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
            ">Delete</button>
        </div>
    `;
    
    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);
    
    // Add hover effects
    const cancelBtn = modal.querySelector('#cancelDelete');
    const confirmBtn = modal.querySelector('#confirmDelete');
    
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
        onConfirm();
    });
    
    // Close on backdrop click
    backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
            backdrop.style.animation = 'fadeOut 0.2s ease';
            setTimeout(() => backdrop.remove(), 200);
        }
    });
    
    // Close on Escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            backdrop.style.animation = 'fadeOut 0.2s ease';
            setTimeout(() => backdrop.remove(), 200);
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

// Animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeOut {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.9); }
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
