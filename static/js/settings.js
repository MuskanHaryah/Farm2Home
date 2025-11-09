// Settings Page Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize settings page
    initializeSettingsPage();
    initializeProfilePicture();
    initializePersonalInfoForm();
    initializePasswordForm();
    initializePreferences();
    initializeDataActions();
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
 * Initialize profile picture upload
 */
function initializeProfilePicture() {
    const uploadBtn = document.getElementById('uploadBtn');
    const removeBtn = document.getElementById('removeBtn');
    const fileInput = document.getElementById('profilePicInput');
    const preview = document.getElementById('profilePicPreview');

    // Upload button click
    if (uploadBtn && fileInput) {
        uploadBtn.addEventListener('click', function() {
            fileInput.click();
        });
    }

    // File input change
    if (fileInput && preview) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        preview.src = event.target.result;
                        console.log('Profile picture updated');
                        
                        // TODO: Upload to server
                        // uploadProfilePicture(file);
                    };
                    reader.readAsDataURL(file);
                } else {
                    notifications.warning('Please select an image file.');
                }
            }
        });
    }

    // Remove button click
    if (removeBtn && preview) {
        removeBtn.addEventListener('click', function() {
            const confirmed = confirm('Are you sure you want to remove your profile picture?');
            if (confirmed) {
                // Reset to default avatar
                const userName = 'Ahmed Khan';
                preview.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=8fbc3e&color=fff&size=150`;
                fileInput.value = '';
                console.log('Profile picture removed');
                
                // TODO: Remove from server
                // removeProfilePicture();
            }
        });
    }
}

/**
 * Initialize personal information form
 */
function initializePersonalInfoForm() {
    const form = document.getElementById('personalInfoForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value
            };
            
            console.log('Saving personal information:', formData);
            
            // TODO: Implement actual save logic (API call)
            // For now, show success message
            notifications.success('✅ Personal information updated successfully!');
            
            // In a real app, you would:
            // 1. Validate form data
            // 2. Send to backend API
            // 3. Update user session/profile
            // 4. Show success/error notification
        });
    }
}

/**
 * Initialize password form
 */
function initializePasswordForm() {
    const form = document.getElementById('passwordForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Validate passwords match
            if (newPassword !== confirmPassword) {
                notifications.error('New passwords do not match!');
                return;
            }
            
            // Validate password strength
            if (newPassword.length < 8) {
                notifications.error('New password must be at least 8 characters long!');
                return;
            }
            
            console.log('Updating password...');
            
            // TODO: Implement actual password update (API call)
            // For now, show success message
            notifications.success('🔐 Password updated successfully!');
            form.reset();
            
            // In a real app, you would:
            // 1. Verify current password
            // 2. Hash and send new password to backend
            // 3. Invalidate old sessions
            // 4. Show success/error notification
        });
    }
}

/**
 * Initialize notification and shopping preferences
 */
function initializePreferences() {
    // Get all toggle switches
    const toggles = {
        orderUpdates: document.getElementById('orderUpdates'),
        promotionalEmails: document.getElementById('promotionalEmails'),
        smsNotifications: document.getElementById('smsNotifications'),
        newsletter: document.getElementById('newsletter'),
        organicOnly: document.getElementById('organicOnly'),
        localPriority: document.getElementById('localPriority'),
        seasonalRecommendations: document.getElementById('seasonalRecommendations')
    };
    
    // Add event listeners to all toggles
    Object.keys(toggles).forEach(key => {
        const toggle = toggles[key];
        if (toggle) {
            toggle.addEventListener('change', function() {
                savePreference(key, this.checked);
            });
        }
    });
}

/**
 * Save preference setting
 */
function savePreference(preferenceName, value) {
    console.log(`Saving preference: ${preferenceName} = ${value}`);
    
    // TODO: Implement actual save logic (API call)
    // Store in localStorage for now
    localStorage.setItem(`pref_${preferenceName}`, value);
    
    // Show subtle notification (optional)
    showNotification(`Preference updated: ${formatPreferenceName(preferenceName)}`);
    
    // In a real app, you would:
    // 1. Send to backend API
    // 2. Update user preferences
    // 3. Apply changes to UI/behavior
}

/**
 * Format preference name for display
 */
function formatPreferenceName(name) {
    return name
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
}

/**
 * Show notification message
 */
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'settings-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: var(--primary-green);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

/**
 * Initialize data action buttons
 */
function initializeDataActions() {
    const downloadBtn = document.querySelector('.btn-download-data');
    const deleteBtn = document.querySelector('.btn-delete-account');
    
    // Download data button
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            downloadUserData();
        });
    }
    
    // Delete account button
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function() {
            deleteAccount();
        });
    }
}

/**
 * Download user data
 */
function downloadUserData() {
    const confirmed = confirm('Download your account data?\n\nThis will include your profile information, order history, and preferences.');
    
    if (confirmed) {
        console.log('Downloading user data...');
        
        // TODO: Implement actual data export (API call)
        // For now, simulate download
        
        // Create dummy data
        const userData = {
            profile: {
                name: 'Ahmed Khan',
                email: 'ahmed.khan@email.com',
                phone: '+92 (300) 1234567'
            },
            orders: 47,
            addresses: 3,
            paymentMethods: 3,
            downloadDate: new Date().toISOString()
        };
        
        // Create blob and download
        const dataStr = JSON.stringify(userData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'farm2home-user-data.json';
        link.click();
        URL.revokeObjectURL(url);
        
        showNotification('Your data has been downloaded successfully!');
    }
}

/**
 * Delete user account
 */
function deleteAccount() {
    const warningMessage = `⚠️ DELETE ACCOUNT WARNING ⚠️

This action is PERMANENT and CANNOT be undone!

All of the following will be permanently deleted:
• Your profile and account information
• All order history and invoices
• Saved addresses and payment methods
• Wishlist and preferences
• Farm2Home Wallet balance

Are you absolutely sure you want to delete your account?`;

    const firstConfirm = confirm(warningMessage);
    
    if (firstConfirm) {
        const password = prompt('Please enter your password to confirm account deletion:');
        
        if (password) {
            // TODO: Verify password with backend
            const secondConfirm = confirm('This is your FINAL WARNING.\n\nType your password and click OK to permanently delete your account.');
            
            if (secondConfirm) {
                console.log('Deleting account...');
                
                // TODO: Implement actual account deletion (API call)
                notifications.warning('⚠️ Account deletion request submitted. You will receive a confirmation email within 24 hours.');
                
                // In a real app, you would:
                // 1. Verify user password
                // 2. Send deletion request to backend
                // 3. Start deletion process (may have grace period)
                // 4. Log out user
                // 5. Redirect to home page
                
                // Simulate logout
                // window.location.href = '../landing/index.html';
            }
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

// Load preferences when page loads
loadPreferences();

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Export functions for use in other modules if needed
window.settingsFunctions = {
    savePreference,
    downloadUserData,
    deleteAccount,
    showNotification,
    loadPreferences
};
