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
    
    // Initialize functionality
    setupMobileNav();
    setupTabs();
    
    // Responsive layout adjustments
    window.addEventListener('resize', function() {
        // Could add dynamic adjustments here if needed
    });
});
