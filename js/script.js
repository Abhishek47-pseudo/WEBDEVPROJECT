// JavaScript for mobile navigation and scroll animations

// Mobile navigation toggle
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
    });
}

// Scroll animation for sections
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible-section');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1
});

// Observe all sections with the hidden-section class
const hiddenSections = document.querySelectorAll('.hidden-section');
hiddenSections.forEach(section => {
    observer.observe(section);
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Offset by header height
                behavior: 'smooth'
            });
        }
        
        // Close mobile nav after clicking a link
        if (nav.classList.contains('active')) {
            nav.classList.remove('active');
        }
    });
});
