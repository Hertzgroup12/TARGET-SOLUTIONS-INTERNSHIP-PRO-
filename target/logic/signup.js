document.getElementById('signupForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Reset previous errors
            const formGroups = document.querySelectorAll('.form-group');
            formGroups.forEach(group => {
                group.classList.remove('error');
            });
            
            let isValid = true;
            
            // Validate full name
            const fullName = document.getElementById('fullName').value.trim();
            if (fullName === '') {
                document.querySelector('#fullName').parentElement.classList.add('error');
                isValid = false;
            }
            
            // Validate email
            const email = document.getElementById('email').value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                document.querySelector('#email').parentElement.classList.add('error');
                isValid = false;
            }
            
            // Validate password
            const password = document.getElementById('password').value;
            if (password.length < 8) {
                document.querySelector('#password').parentElement.classList.add('error');
                isValid = false;
            }
            
            // Validate confirm password
            const confirmPassword = document.getElementById('confirmPassword').value;
            if (password !== confirmPassword) {
                document.querySelector('#confirmPassword').parentElement.classList.add('error');
                isValid = false;
            }
            
            // Validate terms agreement
            const agreeTerms = document.getElementById('agreeTerms').checked;
            if (!agreeTerms) {
                alert('Please agree to the Terms of Service and Privacy Policy');
                isValid = false;
            }
            
            if (isValid) {
                signup(fullName, email, password);

                // Reset form
                this.reset();
            }
        });
        
        // Password strength indicator
        document.getElementById('password').addEventListener('input', function() {
            const password = this.value;
            const strengthBar = document.getElementById('passwordStrength');
            let strength = 0;
            
            if (password.length >= 8) strength += 25;
            if (/[A-Z]/.test(password)) strength += 25;
            if (/[0-9]/.test(password)) strength += 25;
            if (/[^A-Za-z0-9]/.test(password)) strength += 25;
            
            strengthBar.style.width = strength + '%';
            
            if (strength < 50) {
                strengthBar.style.backgroundColor = '#e74c3c';
            } else if (strength < 75) {
                strengthBar.style.backgroundColor = '#f39c12';
            } else {
                strengthBar.style.backgroundColor = '#2ecc71';
            }
        });


        const signup = async (fullName, email, password) => {
            const spinner = document.getElementById('spinner');
            const submitButton = document.querySelector('.btn[type="submit"]');
            const form = document.getElementById('signupForm');
            
            try {
                // Disable button and show spinner
                submitButton.disabled = true;
                spinner.style.display = 'flex';

                const response = await fetch("http://localhost:3000/api/signup", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        fullname: fullName,
                        email,
                        password,
                    }),
                });

                const data = await response.json();
                
                if (!response.ok) {
                    // Show error message in modal
                    const modalMessage = document.getElementById('modal_message');
                    modalMessage.innerHTML = data.error || 'Signup failed. Please try again.';
                    modalMessage.style.color = '#e74c3c';
                    document.getElementById('modal').classList.add('show');
                    modal.classList.add('show');

                    // Auto-hide after 3 seconds
                    setTimeout(() => {
                        closeModal();
                    }, 3000);
                    
                    return;
                }

                // Show success message and redirect to login
                const modal = document.getElementById('modal');
                const modalMessage = document.getElementById('modal_message');
                
                modalMessage.innerHTML = 'Account created successfully! Redirecting to login...';
                modalMessage.style.color = '#2ecc71';
                
                // Show modal with animation
                modal.classList.add('show');

                // Redirect after 3 seconds
                setTimeout(() => {
                    closeModal();
                    window.location.href = '/target/LOG-IN.html'; // Update this to your login page path
                }, 3000);
                
            } catch (error) {
                console.error('Signup error:', error);
                alert('An error occurred. Please try again later.');
            }
        };


    const closeModal = () => {
        const modal = document.getElementById('modal');
        const spinner = document.getElementById('spinner');
        modal.classList.remove('show');
        spinner.style.display = 'none';
    };
    
    // Close modal when clicking outside the content
    document.getElementById('modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
    
    // Close modal with escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    // Close modal when clicking outside the content
    document.getElementById('modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
    
    // Close modal with escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
        