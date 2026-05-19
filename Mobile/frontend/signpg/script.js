document.addEventListener('DOMContentLoaded', function () {
    const pageContainer = document.querySelector('.page-container');
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const toggleBtn = document.getElementById('togglePassword');
    const toggleConfirmBtn = document.getElementById('toggleConfirmPassword');
    const googleBtn = document.getElementById('googleBtn');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const confirmPasswordError = document.getElementById('confirmPassword-error');
    const successMsg = document.getElementById('successMsg');

    // Trigger Arrival Animation
    window.addEventListener('load', () => {
        // Small buffer to ensure browser is ready to render transitions
        setTimeout(() => {
            document.body.classList.add('page-loaded');
        }, 100);
    });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Password toggle for main password field
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function () {
            const currentType = passwordInput.getAttribute('type');
            const newType = currentType === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', newType);

            const isPressed = newType === 'text';
            toggleBtn.setAttribute('aria-pressed', isPressed);
            toggleBtn.setAttribute('aria-label', isPressed ? 'Hide password' : 'Show password');

            const eyeIcon = toggleBtn.querySelector('.eye-icon');
            const eyeOffIcon = toggleBtn.querySelector('.eye-off-icon');

            if (eyeIcon && eyeOffIcon) {
                if (isPressed) {
                    eyeIcon.classList.add('hidden');
                    eyeOffIcon.classList.remove('hidden');
                } else {
                    eyeIcon.classList.remove('hidden');
                    eyeOffIcon.classList.add('hidden');
                }
            }
        });
    }

    // Password toggle for confirm password field
    if (toggleConfirmBtn) {
        toggleConfirmBtn.addEventListener('click', function () {
            const currentType = confirmPasswordInput.getAttribute('type');
            const newType = currentType === 'password' ? 'text' : 'password';
            confirmPasswordInput.setAttribute('type', newType);

            const isPressed = newType === 'text';
            toggleConfirmBtn.setAttribute('aria-pressed', isPressed);
            toggleConfirmBtn.setAttribute('aria-label', isPressed ? 'Hide password' : 'Show password');

            const eyeIcon = toggleConfirmBtn.querySelector('.eye-icon');
            const eyeOffIcon = toggleConfirmBtn.querySelector('.eye-off-icon');

            if (eyeIcon && eyeOffIcon) {
                if (isPressed) {
                    eyeIcon.classList.add('hidden');
                    eyeOffIcon.classList.remove('hidden');
                } else {
                    eyeIcon.classList.remove('hidden');
                    eyeOffIcon.classList.add('hidden');
                }
            }
        });
    }

    if (emailInput) {
        emailInput.addEventListener('input', function () {
            if (emailError.textContent) {
                emailError.textContent = '';
                emailInput.removeAttribute('aria-invalid');
            }
        });
    }

    if (passwordInput) {
        passwordInput.addEventListener('input', function () {
            if (passwordError.textContent) {
                passwordError.textContent = '';
                passwordInput.removeAttribute('aria-invalid');
            }
        });
    }

    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function () {
            if (confirmPasswordError.textContent) {
                confirmPasswordError.textContent = '';
                confirmPasswordInput.removeAttribute('aria-invalid');
            }
        });
    }

    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            let isValid = true;
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();
            const confirmPassword = confirmPasswordInput.value.trim();

            emailError.textContent = '';
            passwordError.textContent = '';
            confirmPasswordError.textContent = '';
            successMsg.textContent = '';
            successMsg.classList.remove('visible');
            emailInput.removeAttribute('aria-invalid');
            passwordInput.removeAttribute('aria-invalid');
            confirmPasswordInput.removeAttribute('aria-invalid');

            if (!email) {
                emailError.textContent = 'Email is required';
                emailInput.setAttribute('aria-invalid', 'true');
                isValid = false;
            } else if (!emailRegex.test(email)) {
                emailError.textContent = 'Please enter a valid email address';
                emailInput.setAttribute('aria-invalid', 'true');
                isValid = false;
            }

            if (!password) {
                passwordError.textContent = 'Password is required';
                passwordInput.setAttribute('aria-invalid', 'true');
                isValid = false;
            } else if (password.length < 8) {
                passwordError.textContent = 'Password must be at least 8 characters';
                passwordInput.setAttribute('aria-invalid', 'true');
                isValid = false;
            }

            if (!confirmPassword) {
                confirmPasswordError.textContent = 'Please confirm your password';
                confirmPasswordInput.setAttribute('aria-invalid', 'true');
                isValid = false;
            } else if (password !== confirmPassword) {
                confirmPasswordError.textContent = 'Passwords do not match';
                confirmPasswordInput.setAttribute('aria-invalid', 'true');
                isValid = false;
            }

            if (isValid) {
                // Call backend signup API
                try {
                    const response = await fetch(MKAVS_CONFIG.API_BASE_URL + '/auth/signup', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ name, email, password })
                    });

                    const data = await response.json();

                    if (response.ok && data.success) {
                        successMsg.textContent = 'Account created successfully! Redirecting...';
                        successMsg.classList.add('visible');

                        setTimeout(function () {
                            window.location.href = '/index.html';
                        }, 2000);
                    } else {
                        const errorMessage = data.error || 'Signup failed';
                        if (errorMessage.toLowerCase().includes('email')) {
                            emailError.textContent = errorMessage;
                            emailInput.setAttribute('aria-invalid', 'true');
                        } else if (errorMessage.toLowerCase().includes('verify')) {
                            emailError.textContent = errorMessage;
                            emailInput.setAttribute('aria-invalid', 'true');
                        } else {
                            passwordError.textContent = errorMessage;
                        }
                    }
                } catch (error) {
                    console.error('Signup error:', error);
                    passwordError.textContent = 'Connection error. Please try again.';
                }
            }
        });
    }

    if (googleBtn) {
        googleBtn.addEventListener('click', function () {
            console.log('Google SSO clicked');
            successMsg.textContent = 'Google SSO initiated...';
            successMsg.classList.add('visible');

            setTimeout(function () {
                successMsg.textContent = '';
                successMsg.classList.remove('visible');
            }, 2000);
        });
    }
});
