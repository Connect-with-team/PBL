document.addEventListener("DOMContentLoaded", function () {
    // Get current page filename
    const currentPage = window.location.pathname.split('/').pop();
    
    // Set active class based on current page
    const navLinks = document.querySelectorAll("nav ul li a");
    navLinks.forEach(link => {
        // Get href attribute
        const href = link.getAttribute("href");
        
        // If this is the current page or we're on index.html and the link is to home
        if (href === currentPage || 
            (currentPage === "" && href === "index.html") || 
            (currentPage === "/" && href === "index.html")) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
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
