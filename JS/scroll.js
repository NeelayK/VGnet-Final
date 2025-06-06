function isInViewport(xel) {
    const rect = xel.getBoundingClientRect();
    return rect.top <= window.innerHeight && rect.bottom >= 0;
}

function handleScroll() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    fadeElements.forEach(el => {
        if (isInViewport(el)) {
            el.classList.add('visible');
        }
    });
}


window.addEventListener('scroll', handleScroll);
document.addEventListener('DOMContentLoaded', handleScroll);

