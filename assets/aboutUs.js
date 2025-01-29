
import {loadHeader} from './function'














// Counter animation
document.addEventListener('DOMContentLoaded', function() {
    loadHeader()

    // Animate counters when they come into view
    const counters = document.querySelectorAll('.counter');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const value = target.innerText;
                
                // Remove any non-numeric characters and parse the number
                const number = parseInt(value.replace(/\D/g, ''));
                let current = 0;
                const increment = Math.ceil(number / 50);
                const duration = 1000; // 1 second
                const steps = 50;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= number) {
                        target.innerText = value; // Set final value with original formatting
                        clearInterval(timer);
                    } else {
                        target.innerText = current.toLocaleString() + '+';
                    }
                }, duration / steps);
                
                // Unobserve after animation
                observer.unobserve(target);
            }
        });
    }, {
        threshold: 0.5
    });

    counters.forEach(counter => observer.observe(counter));
});

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});