// Settings Page Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize settings page
    initializeSettingsPage();
    initializePersonalInfoForm();
    initializePasswordForm();
    initializeDeleteAccountButton();
    loadUserProfile();
    
    // Initialize logout button
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn && window.accountFunctions && window.accountFunctions.handleAccountLogout) {
        // Remove any existing listeners by cloning
        const newLogoutBtn = logoutBtn.cloneNode(true);
        logoutBtn.parentNode.replaceChild(newLogoutBtn, logoutBtn);
        // Add new listener
        newLogoutBtn.addEventListener('click', window.accountFunctions.handleAccountLogout);
    }
});

/**
 * Initialize settings page
 */
function initializeSettingsPage() {
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle) {
        pageTitle.textContent = 'Settings';
    }
}

/**
 * Initialize personal information form
 */
function initializePersonalInfoForm() {
    const form = document.getElementById('personalInfoForm');
    
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const customerId = localStorage.getItem('customer_id');
            if (!customerId) {
                notifications.error('Please login to update your profile');
                window.location.href = '/login/';
                return;
            }
            
            const fullName = document.getElementById('firstName').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            
            // Validate form data
            if (!fullName || !email || !phone) {
                notifications.error('All fields are required');
                return;
            }
            
            try {
                // Get CSRF token from cookie
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
                
                const csrftoken = getCookie('csrftoken');
                
                const response = await fetch('/api/customer/profile/update/', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrftoken
                    },
                    body: JSON.stringify({
                        customer_id: parseInt(customerId),
                        name: fullName,
                        email: email,
                        phone: phone
                    })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // Update localStorage with new data
                    localStorage.setItem('customer_name', result.data.name);
                    localStorage.setItem('customer_email', result.data.email);
                    
                    // Update sidebar display
                    document.getElementById('profileName').textContent = result.data.name.toUpperCase();
                    document.getElementById('profileEmail').textContent = result.data.email.toUpperCase();
                    
                    notifications.success('✅ Personal information updated successfully!');
                } else {
                    notifications.error(result.error || 'Failed to update profile');
                }
            } catch (error) {
                console.error('Error updating profile:', error);
                notifications.error('Failed to update profile. Please try again.');
            }
        });
    }
}

/**
 * Initialize password form
 */
function initializePasswordForm() {
    const form = document.getElementById('passwordForm');
    
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const customerId = localStorage.getItem('customer_id');
            if (!customerId) {
                notifications.error('Please login to change your password');
                window.location.href = '/login/';
                return;
            }
            
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Validate passwords match
            if (newPassword !== confirmPassword) {
                notifications.error('New passwords do not match!');
                return;
            }
            
            // Validate password strength (minimum 6 characters to match backend)
            if (newPassword.length < 6) {
                notifications.error('New password must be at least 6 characters long!');
                return;
            }
            
            try {
                // Get CSRF token
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
                
                const csrftoken = getCookie('csrftoken');
                
                const response = await fetch('/api/customer/change-password/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrftoken
                    },
                    body: JSON.stringify({
                        customer_id: parseInt(customerId),
                        current_password: currentPassword,
                        new_password: newPassword
                    })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    notifications.success('🔐 Password updated successfully!');
                    form.reset();
                } else {
                    notifications.error(result.error || 'Failed to change password');
                }
            } catch (error) {
                console.error('Error changing password:', error);
                notifications.error('Failed to change password. Please try again.');
            }
        });
    }
}

/**
 * Load user profile data from API
 */
async function loadUserProfile() {
    console.log('[Settings] Loading user profile...');
    const customerId = localStorage.getItem('customer_id');
    console.log('[Settings] Customer ID from localStorage:', customerId);
    
    // Check if user is logged in
    if (!customerId) {
        console.warn('No customer ID found. Redirecting to login...');
        window.location.href = '/login/';
        return;
    }
    
    try {
        // Fetch customer profile data
        console.log('[Settings] Fetching profile from API...');
        const response = await fetch(`/api/customer/profile/?customer_id=${customerId}`);
        const result = await response.json();
        console.log('[Settings] API Response:', result);
        
        if (result.status === 'success' && result.data) {
            const customer = result.data;
            console.log('[Settings] Customer data:', customer);
            
            // Update sidebar profile info
            const profileNameEl = document.getElementById('profileName');
            const profileEmailEl = document.getElementById('profileEmail');
            const totalOrdersEl = document.getElementById('totalOrders');
            
            if (profileNameEl) {
                profileNameEl.textContent = customer.name.toUpperCase();
                console.log('[Settings] Updated profile name:', customer.name);
            }
            if (profileEmailEl) {
                profileEmailEl.textContent = customer.email.toUpperCase();
                console.log('[Settings] Updated profile email:', customer.email);
            }
            
            // Update total orders
            const totalOrders = customer.total_orders || 0;
            if (totalOrdersEl) {
                totalOrdersEl.textContent = `${totalOrders} Orders`;
                console.log('[Settings] Updated total orders:', totalOrders);
            }
            
            // Populate form fields with full name (no splitting needed)
            const firstNameEl = document.getElementById('firstName');
            const emailEl = document.getElementById('email');
            const phoneEl = document.getElementById('phone');
            
            if (firstNameEl) firstNameEl.value = customer.name;
            if (emailEl) emailEl.value = customer.email;
            if (phoneEl) phoneEl.value = customer.phone || '';
            
            console.log('[Settings] Populated form fields');
            
            // Update localStorage
            localStorage.setItem('customer_name', customer.name);
            localStorage.setItem('customer_email', customer.email);
            
        } else {
            console.error('Failed to load profile:', result.message);
            if (typeof notifications !== 'undefined') {
                notifications.error('Failed to load profile data');
            }
        }
    } catch (error) {
        console.error('Error loading profile:', error);
        if (typeof notifications !== 'undefined') {
            notifications.error('Failed to load profile data');
        }
    }
}

/**
 * Load saved preferences on page load
 */
function loadPreferences() {
    const toggles = document.querySelectorAll('.toggle-switch input[type="checkbox"]');
    
    toggles.forEach(toggle => {
        const prefName = toggle.id;
        const savedValue = localStorage.getItem(`pref_${prefName}`);
        
        if (savedValue !== null) {
            toggle.checked = savedValue === 'true';
        }
    });
}

/**
 * Initialize delete account button
 */
function initializeDeleteAccountButton() {
    console.log('Initializing delete account button...');
    const deleteBtn = document.querySelector('.btn-delete-account');
    
    if (deleteBtn) {
        console.log('Delete account button found, attaching listener');
        deleteBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            console.log('Delete button clicked');
            
            const customerId = localStorage.getItem('customer_id');
            if (!customerId) {
                console.log('No customer ID found');
                if (typeof notifications !== 'undefined') {
                    notifications.error('Please login to delete your account');
                } else {
                    alert('Please login to delete your account');
                }
                window.location.href = '/login/';
                return;
            }
            
            // Show custom confirmation modal
            showDeleteAccountConfirmation(async () => {
                try {
                    // Get CSRF token
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
                    
                    const csrftoken = getCookie('csrftoken');
                    
                    const response = await fetch('/api/customer/delete-account/', {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': csrftoken
                        },
                        body: JSON.stringify({
                            customer_id: parseInt(customerId)
                        })
                    });
                    
                    const result = await response.json();
                    
                    if (result.status === 'success') {
                        notifications.success('Account deleted successfully. Redirecting...');
                        
                        // Clear localStorage
                        localStorage.removeItem('customer_id');
                        localStorage.removeItem('customer_name');
                        localStorage.removeItem('customer_email');
                        
                        // Redirect to home page after a short delay
                        setTimeout(() => {
                            window.location.href = '/';
                        }, 2000);
                    } else {
                        notifications.error(result.message || 'Failed to delete account');
                    }
                } catch (error) {
                    console.error('Error deleting account:', error);
                    notifications.error('Failed to delete account. Please try again.');
                }
            });
        });
    } else {
        console.error('Delete account button NOT FOUND! Check the selector: .btn-delete-account');
    }
}

/**
 * Show delete account confirmation modal
 */
function showDeleteAccountConfirmation(callback) {
    console.log('Showing delete account confirmation modal');
    // Create modal backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'delete-account-modal-backdrop';
    backdrop.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.2s ease;
    `;
    
    // Create modal container
    const modal = document.createElement('div');
    modal.className = 'delete-account-modal';
    modal.style.cssText = `
        background: white;
        border-radius: 16px;
        padding: 2.5rem;
        max-width: 480px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: slideUp 0.3s ease;
        text-align: center;
    `;
    
    // Modal content
    modal.innerHTML = `
        <div style="margin-bottom: 1.5rem;">
            <div style="width: 80px; height: 80px; background: #fee; border-radius: 50%; 
                        display: flex; align-items: center; justify-content: center; 
                        margin: 0 auto 1.5rem; border: 3px solid #dc3545;">
                <i class="fas fa-exclamation-triangle" style="font-size: 36px; color: #dc3545;"></i>
            </div>
            <h3 style="color: #2d3748; margin: 0 0 0.75rem 0; font-size: 1.75rem; font-weight: 600;">
                Delete Account?
            </h3>
            <p style="color: #718096; margin: 0 0 0.5rem 0; font-size: 1rem; line-height: 1.6;">
                Are you absolutely sure you want to delete your account?
            </p>
            <p style="color: #e53e3e; margin: 0; font-size: 0.9rem; font-weight: 500;">
                This action is <strong>permanent</strong> and cannot be undone.
            </p>
            <div style="background: #fff5f5; border: 1px solid #feb2b2; border-radius: 8px; padding: 1rem; margin-top: 1rem; text-align: left;">
                <p style="margin: 0; font-size: 0.85rem; color: #742a2a; line-height: 1.5;">
                    <strong>⚠️ Warning:</strong> Deleting your account will permanently remove:
                </p>
                <ul style="margin: 0.5rem 0 0 1.5rem; padding: 0; font-size: 0.85rem; color: #742a2a;">
                    <li>Your profile and personal information</li>
                    <li>All your order history</li>
                    <li>Saved addresses and payment methods</li>
                    <li>Shopping cart items</li>
                </ul>
            </div>
        </div>
        <div style="display: flex; gap: 0.75rem; justify-content: center; margin-top: 1.5rem;">
            <button id="cancelDeleteAccount" style="
                padding: 0.875rem 2rem;
                border: 2px solid #e2e8f0;
                background: white;
                color: #4a5568;
                border-radius: 10px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
                min-width: 120px;
            ">Cancel</button>
            <button id="confirmDeleteAccount" style="
                padding: 0.875rem 2rem;
                border: none;
                background: #dc3545;
                color: white;
                border-radius: 10px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
                min-width: 120px;
            ">Delete Forever</button>
        </div>
    `;
    
    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);
    
    // Add hover effects
    const cancelBtn = modal.querySelector('#cancelDeleteAccount');
    const confirmBtn = modal.querySelector('#confirmDeleteAccount');
    
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
        confirmBtn.style.transform = 'scale(1.02)';
    });
    confirmBtn.addEventListener('mouseleave', () => {
        confirmBtn.style.background = '#dc3545';
        confirmBtn.style.transform = 'scale(1)';
    });
    
    // Handle button clicks
    cancelBtn.addEventListener('click', () => {
        backdrop.style.animation = 'fadeOut 0.2s ease';
        setTimeout(() => backdrop.remove(), 200);
    });
    
    confirmBtn.addEventListener('click', () => {
        backdrop.style.animation = 'fadeOut 0.2s ease';
        setTimeout(() => backdrop.remove(), 200);
        callback();
    });
    
    // Close on backdrop click
    backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
            backdrop.style.animation = 'fadeOut 0.2s ease';
            setTimeout(() => backdrop.remove(), 200);
        }
    });
    
    // Add animation keyframes if not already added
    if (!document.querySelector('#deleteAccountModalAnimations')) {
        const style = document.createElement('style');
        style.id = 'deleteAccountModalAnimations';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
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
    }
}

// Export functions for use in other modules if needed
window.settingsFunctions = {
    loadPreferences,
    loadUserProfile
};
