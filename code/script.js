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
    
    // Handle Resources Page Tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons and panes
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanes.forEach(pane => pane.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Activate corresponding tab pane
                const tabId = this.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }
});
