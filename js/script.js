const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');


navToggle?.addEventListener('click', () => {
    nav.classList.toggle('active');
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible-section');
        } else {
            entry.target.classList.remove('visible-section');
        }
    });
}, {
    threshold: 0.1
});


document.querySelectorAll('.hidden-section').forEach(section => {
    observer.observe(section);
});


document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }

        nav.classList.remove('active'); 
    });
});
