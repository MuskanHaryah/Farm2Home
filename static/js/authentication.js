// ========================================
// AUTHENTICATION FUNCTIONS
// ========================================

// Open Login Modal
function openLoginModal() {
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    if (loginModal) {
        loginModal.classList.add('active');
        signupModal?.classList.remove('active');
    }
}

// Close Login Modal
function closeLoginModal() {
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.classList.remove('active');
    }
}

// Open Signup Modal
function openSignupModal() {
    const signupModal = document.getElementById('signupModal');
    const loginModal = document.getElementById('loginModal');
    if (signupModal) {
        signupModal.classList.add('active');
        loginModal?.classList.remove('active');
    }
}

// Close Signup Modal
function closeSignupModal() {
    const signupModal = document.getElementById('signupModal');
    if (signupModal) {
        signupModal.classList.remove('active');
    }
}

// Switch to Login from Signup
function switchToLogin() {
    closeSignupModal();
    openLoginModal();
}

// Switch to Signup from Login
function switchToSignup() {
    closeLoginModal();
    openSignupModal();
}

// Close modal when clicking outside
window.onclick = function(event) {
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    
    if (event.target == loginModal) {
        closeLoginModal();
    }
    if (event.target == signupModal) {
        closeSignupModal();
    }
}

// Handle Login Form Submission
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Login successful! Redirecting...');
            closeLoginModal();
            loginForm.reset();
        });
    }

    // Handle Signup Form Submission
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Account created successfully! Welcome to Farm2Home!');
            closeSignupModal();
            signupForm.reset();
        });
    }
});
