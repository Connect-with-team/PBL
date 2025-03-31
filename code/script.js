// Common JavaScript functionality for the Human Rights & Governance Hub

document.addEventListener('DOMContentLoaded', function() {
    // Get current page path
    const currentPage = window.location.pathname;
    
    // Get all navigation links
    const navLinks = document.querySelectorAll('nav ul li a');
    
    // Loop through links to find the matching one
    navLinks.forEach(link => {
        // Extract the link's path
        const linkPath = link.getAttribute('href');
        
        // Compare with current page and set active class
        if (currentPage === linkPath || 
            (linkPath.includes('/index.html') && (currentPage === '/' || currentPage.endsWith('/code/')))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Authentication-related functionality
    setupAuthFunctionality();
    updateAuthUI();
    
    // Handle form submission on report page
    const reportForm = document.querySelector('.report-form form');
    if (reportForm) {
        reportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Your report has been submitted securely. Thank you for contributing to our efforts.');
            this.reset();
        });
    }
    
    // Handle mobile navigation toggling if needed
    const setupMobileNav = () => {
        // This could be expanded later if we need a hamburger menu
        // or other mobile-specific navigation features
    };
    
    // Tabs functionality for resources page
    const setupTabs = () => {
        const tabButtons = document.querySelectorAll('.tab-btn');
        if (tabButtons.length === 0) return;
        
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // Remove active class from all buttons and panes
                document.querySelectorAll('.tab-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                document.querySelectorAll('.tab-pane').forEach(pane => {
                    pane.classList.remove('active');
                });
                
                // Add active class to clicked button and corresponding pane
                this.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });
    };

    // Setup login page functionality
    const setupLoginPage = () => {
        if (!document.querySelector('.auth-container')) return;

        // Tab switching logic
        const loginTab = document.getElementById('loginTab');
        const registerTab = document.getElementById('registerTab');
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');

        if (loginTab && registerTab) {
            loginTab.addEventListener('click', function() {
                this.classList.add('active');
                registerTab.classList.remove('active');
                loginForm.style.display = 'block';
                registerForm.style.display = 'none';
            });

            registerTab.addEventListener('click', function() {
                this.classList.add('active');
                loginTab.classList.remove('active');
                registerForm.style.display = 'block';
                loginForm.style.display = 'none';
            });
        }

        // Login form submission
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            loginUser(email, password);
        });

        // Register form submission
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('regName').value;
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (password !== confirmPassword) {
                showAuthMessage('registerMessage', 'Passwords do not match', 'error');
                return;
            }
            
            registerUser(name, email, password);
        });

        // Forgot password functionality
        const forgotPasswordLink = document.getElementById('forgotPassword');
        if (forgotPasswordLink) {
            forgotPasswordLink.addEventListener('click', function(e) {
                e.preventDefault();
                const email = document.getElementById('email').value;
                
                if (!email) {
                    showAuthMessage('loginMessage', 'Please enter your email address', 'error');
                    return;
                }
                
                // Simulate password reset
                setTimeout(() => {
                    showAuthMessage('loginMessage', 'Password reset instructions sent to your email', 'success');
                }, 1000);
            });
        }
    };
    
    // Initialize functionality
    setupMobileNav();
    setupTabs();
    setupLoginPage();
    
    // Responsive layout adjustments
    window.addEventListener('resize', function() {
        // Could add dynamic adjustments here if needed
    });
});

// Authentication functions

function setupAuthFunctionality() {
    // Add logout functionality
    document.body.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'logoutBtn' || 
            (e.target.parentElement && e.target.parentElement.id === 'logoutBtn')) {
            e.preventDefault();
            logoutUser();
        }
    });
}

// Function to update authentication UI across the site
function updateAuthUI() {
    const authButtonsContainer = document.getElementById('auth-buttons');
    if (!authButtonsContainer) return;
    
    const user = getCurrentUser();
    
    if (user) {
        // User is logged in
        authButtonsContainer.innerHTML = `
            <div class="user-menu">
                <button class="user-menu-btn">
                    <span class="material-icons">account_circle</span>
                    ${user.name}
                </button>
                <div class="user-dropdown">
                    <a href="#" id="profileLink">
                        <span class="material-icons-outlined">person</span> Profile
                    </a>
                    <a href="#" id="logoutBtn">
                        <span class="material-icons-outlined">logout</span> Logout
                    </a>
                </div>
            </div>
        `;
        
        // Add dropdown toggle functionality
        const userMenuBtn = document.querySelector('.user-menu-btn');
        if (userMenuBtn) {
            userMenuBtn.addEventListener('click', function() {
                document.querySelector('.user-dropdown').classList.toggle('show');
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', function(e) {
                if (!e.target.closest('.user-menu')) {
                    const dropdown = document.querySelector('.user-dropdown');
                    if (dropdown && dropdown.classList.contains('show')) {
                        dropdown.classList.remove('show');
                    }
                }
            });
        }
    } else {
        // User is not logged in
        authButtonsContainer.innerHTML = `
            <a href="/code/login.html" class="auth-btn">
                <span class="material-icons-outlined">login</span> Login
            </a>
        `;
    }
}

// Register a new user
function registerUser(name, email, password) {
    // Check if email already exists
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.some(user => user.email === email)) {
        showAuthMessage('registerMessage', 'Email already registered', 'error');
        return;
    }
    
    // Add new user
    const newUser = { id: Date.now(), name, email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Show success message
    showAuthMessage('registerMessage', 'Registration successful! You can now log in.', 'success');
    
    // Switch to login tab after successful registration
    setTimeout(() => {
        document.getElementById('loginTab').click();
    }, 1500);
}

// Login a user
function loginUser(email, password) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Store current user in session
        const sessionUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            loggedInAt: new Date().toISOString()
        };
        sessionStorage.setItem('currentUser', JSON.stringify(sessionUser));
        
        showAuthMessage('loginMessage', 'Login successful! Redirecting...', 'success');
        
        // Redirect to home page after successful login
        setTimeout(() => {
            window.location.href = '/code/index.html';
        }, 1500);
    } else {
        showAuthMessage('loginMessage', 'Invalid email or password', 'error');
    }
}

// Logout the current user
function logoutUser() {
    sessionStorage.removeItem('currentUser');
    updateAuthUI();
    
    // Redirect to home page after logout
    window.location.href = '/code/index.html';
}

// Get the currently logged in user
function getCurrentUser() {
    const userJson = sessionStorage.getItem('currentUser');
    if (!userJson) return null;
    
    try {
        return JSON.parse(userJson);
    } catch (e) {
        console.error('Error parsing user data:', e);
        return null;
    }
}

// Show authentication messages (success or error)
function showAuthMessage(elementId, message, type) {
    const messageElement = document.getElementById(elementId);
    if (!messageElement) return;
    
    messageElement.textContent = message;
    messageElement.className = 'auth-message';
    messageElement.classList.add(type);
    messageElement.style.display = 'block';
    
    // Hide message after 5 seconds
    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 5000);
}
