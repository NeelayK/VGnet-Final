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




let darkModeInitialized = false;

function toggleDarkMode() {
    const toggleBtn = document.getElementById("toggle-btn");
    if (toggleBtn && !darkModeInitialized) {
        darkModeInitialized = true;
        toggleBtn.addEventListener("click", (e) => {
            e.preventDefault();
            document.body.style.transition = "background-color 0.5s ease-in-out, color 0.5s ease-in-out";
            document.body.classList.toggle("dark-mode");
            const isDark = document.body.classList.contains("dark-mode");
            localStorage.setItem("theme", isDark ? "dark" : "light");
            loadPage("home");
        });
    }
}
