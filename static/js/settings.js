// Settings Page Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize settings page
    initializeSettingsPage();
    initializePersonalInfoForm();
    initializePasswordForm();
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

// Export functions for use in other modules if needed
window.settingsFunctions = {
    loadPreferences
};
