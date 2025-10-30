        document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('signinForm');
    const signinBtn = document.getElementById('signinBtn');
    const btnText = document.querySelector('.btn-text');
    const spinner = document.getElementById('loginSpinner');
    const modal = document.getElementById('loginModal');
    const modalMessage = document.getElementById('modalMessage');
    const closeModalBtn = document.getElementById('closeModal');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

    // Show modal with message
    function showModal(message, isError = false) {
        modalMessage.textContent = message;
        modalMessage.style.color = isError ? '#e74c3c' : '#2ecc71';
        modal.classList.add('show');
    }

    // Hide modal
    function hideModal() {
        modal.classList.remove('show');
    }

    // Close modal when clicking the close button
    closeModalBtn.addEventListener('click', hideModal);

    // Close modal when clicking outside the modal content
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            hideModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideModal();
        }
    });

    // Form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form values
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('remember').checked;
        
        // Reset error messages
        emailError.style.display = 'none';
        passwordError.style.display = 'none';
        
        // Validation
        let isValid = true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            emailError.textContent = 'Email is required';
            emailError.style.display = 'block';
            isValid = false;
        } else if (!emailRegex.test(email)) {
            emailError.textContent = 'Please enter a valid email';
            emailError.style.display = 'block';
            isValid = false;
        }
        
        if (!password) {
            passwordError.textContent = 'Password is required';
            passwordError.style.display = 'block';
            isValid = false;
        } else if (password.length < 6) {
            passwordError.textContent = 'Password must be at least 6 characters';
            passwordError.style.display = 'block';
            isValid = false;
        }
        
        if (!isValid) return;

        try {
            // Show loading state
            signinBtn.disabled = true;
            btnText.style.opacity = '0.7';
            if (spinner) spinner.style.display = 'block';

            // Send login request
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    remember_me: rememberMe
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Store the token if needed
                if (data.user_token) {
                    localStorage.setItem('authToken', data.user_token);
                }
                
                // Show success message and redirect
                showModal('Login successful! Redirecting to dashboard...');
                setTimeout(() => {
                    window.location.href = '/target/dashboard.html';
                }, 1500);
            } else {
                // Show error message
                showModal(data.error || 'Login failed. Please check your credentials and try again.', true);
                // Reset form
                this.reset();
            }
        } catch (error) {
            console.error('Login error:', error);
            showModal('An error occurred. Please check your connection and try again.', true);
        } finally {
            // Reset button state
            if (signinBtn) signinBtn.disabled = false;
            if (btnText) btnText.style.opacity = '1';
            if (spinner) spinner.style.display = 'none';
        }
    });

    // Real-time validation
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    if (emailInput) {
        emailInput.addEventListener('input', function() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailRegex.test(this.value)) {
                emailError.style.display = 'none';
            }
        });
    }

    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            if (this.value.length >= 6) {
                passwordError.style.display = 'none';
            }
        });
    }
});