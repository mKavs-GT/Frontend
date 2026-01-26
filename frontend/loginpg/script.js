document.addEventListener('DOMContentLoaded', function () {
    const pageContainer = document.querySelector('.page-container');
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.getElementById('togglePassword');
    const googleBtn = document.getElementById('googleBtn');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const successMsg = document.getElementById('successMsg');

    // Trigger Arrival Animation
    window.addEventListener('load', () => {
        // Small buffer to ensure browser is ready to render transitions
        setTimeout(() => {
            document.body.classList.add('page-loaded');
        }, 100);
    });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            let isValid = true;
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            emailError.textContent = '';
            passwordError.textContent = '';
            successMsg.textContent = '';
            successMsg.classList.remove('visible');
            emailInput.removeAttribute('aria-invalid');
            passwordInput.removeAttribute('aria-invalid');

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
            }

            if (isValid) {
                // Call backend signin API
                try {
                    const response = await fetch('/api/signin', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ email, password })
                    });

                    const data = await response.json();

                    if (response.ok && data.success) {
                        successMsg.textContent = 'Login successful! Redirecting...';
                        successMsg.classList.add('visible');

                        setTimeout(() => {
                            window.location.href = '/index.html';
                        }, 1000);
                    } else {
                        if (errorMessage.toLowerCase().includes('not found')) {
                            emailError.textContent = 'Account not created. Redirecting to signup...';
                            emailInput.setAttribute('aria-invalid', 'true');
                            setTimeout(() => {
                                window.location.href = '../signpg/signup.html';
                            }, 1500);
                        } else if (errorMessage.toLowerCase().includes('credentials') || errorMessage.toLowerCase().includes('password')) {
                            passwordError.textContent = 'Incorrect password';
                            passwordInput.setAttribute('aria-invalid', 'true');
                        } else if (errorMessage.toLowerCase().includes('google')) {
                            emailError.textContent = errorMessage;
                            emailInput.setAttribute('aria-invalid', 'true');
                        } else {
                            passwordError.textContent = errorMessage;
                        }
                    }
                } catch (error) {
                    console.error('Login error:', error);
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
