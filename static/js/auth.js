/**
 * Auth Page Functions
 * Handles login, signup, and password validation
 */

function initAuthPage() {
    // Initialize auth page elements
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignupSubmit);
    }
}

function togglePasswordVisibility(fieldId) {
    const input = document.getElementById(fieldId);
    const button = event.target.closest('.toggle-password');
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePasswordStrength(password) {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLengthValid = password.length >= 8;
    
    return {
        isValid: hasUpperCase && hasLowerCase && hasNumbers && isLengthValid,
        strength: [hasUpperCase, hasLowerCase, hasNumbers, isLengthValid, hasSpecialChar].filter(Boolean).length,
        hasUpperCase,
        hasLowerCase,
        hasNumbers,
        hasSpecialChar,
        isLengthValid
    };
}

function showPasswordStrength(password) {
    const result = validatePasswordStrength(password);
    let meter = document.querySelector('.password-strength-meter');
    
    if (!meter) {
        meter = document.createElement('div');
        meter.className = 'password-strength-meter';
        document.getElementById('password').parentElement.appendChild(meter);
    }
    
    const percentage = (result.strength / 5) * 100;
    meter.style.width = percentage + '%';
    
    if (result.isValid && result.hasSpecialChar) {
        meter.style.backgroundColor = '#4caf50'; // Green
    } else if (result.strength >= 3) {
        meter.style.backgroundColor = '#ff9800'; // Orange
    } else {
        meter.style.backgroundColor = '#f44336'; // Red
    }
}

function handleLoginSubmit(e) {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Validate email
    if (!validateEmail(email)) {
        e.preventDefault();
        if (typeof notifications !== 'undefined') {
            notifications.error('Please enter a valid email address', 'error', 'Invalid Email');
        } else {
            alert('Please enter a valid email address');
        }
        return false;
    }
    
    // Validate password
    if (password.length < 6) {
        e.preventDefault();
        if (typeof notifications !== 'undefined') {
            notifications.error('Password must be at least 6 characters', 'error', 'Invalid Password');
        } else {
            alert('Password must be at least 6 characters');
        }
        return false;
    }
    
    // If validation passes, allow form submission
    return true;
}

function handleSignupSubmit(e) {
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    // Validate full name
    if (fullName.trim().length < 3) {
        e.preventDefault();
        if (typeof notifications !== 'undefined') {
            notifications.error('Please enter a valid name', 'error', 'Invalid Name');
        } else {
            alert('Please enter a valid name');
        }
        return false;
    }
    
    // Validate email
    if (!validateEmail(email)) {
        e.preventDefault();
        if (typeof notifications !== 'undefined') {
            notifications.error('Please enter a valid email address', 'error', 'Invalid Email');
        } else {
            alert('Please enter a valid email address');
        }
        return false;
    }
    
    // Validate phone
    if (phone.trim().length < 10) {
        e.preventDefault();
        if (typeof notifications !== 'undefined') {
            notifications.error('Please enter a valid phone number', 'error', 'Invalid Phone');
        } else {
            alert('Please enter a valid phone number');
        }
        return false;
    }
    
    // Validate passwords match
    if (password !== confirmPassword) {
        e.preventDefault();
        if (typeof notifications !== 'undefined') {
            notifications.error('Passwords do not match!', 'error', 'Validation Error');
        } else {
            alert('Passwords do not match!');
        }
        return false;
    }
    
    // Validate password strength
    const passwordStrength = validatePasswordStrength(password);
    if (!passwordStrength.isValid) {
        e.preventDefault();
        if (typeof notifications !== 'undefined') {
            notifications.error('Password must contain uppercase, lowercase, numbers, and be at least 8 characters', 'error', 'Weak Password');
        } else {
            alert('Password must contain uppercase, lowercase, numbers, and be at least 8 characters');
        }
        return false;
    }
    
    // Check if terms are agreed
    if (!agreeTerms) {
        e.preventDefault();
        if (typeof notifications !== 'undefined') {
            notifications.error('Please agree to the Terms and Conditions', 'error', 'Accept Terms');
        } else {
            alert('Please agree to the Terms and Conditions');
        }
        return false;
    }
    
    // If all validation passes, allow form submission
    return true;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initAuthPage();
});

// Export functions for global access
window.authFunctions = {
    togglePasswordVisibility,
    validateEmail,
    validatePasswordStrength,
    showPasswordStrength,
    handleLoginSubmit,
    handleSignupSubmit
};
