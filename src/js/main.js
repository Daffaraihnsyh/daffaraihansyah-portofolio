document.addEventListener('DOMContentLoaded', () => {
    // Hamburger menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.contains('hidden');
            if (isHidden) {
                mobileMenu.classList.remove('hidden');
                menuIcon.classList.add('hidden');
                closeIcon.classList.remove('hidden');
            } else {
                mobileMenu.classList.add('hidden');
                menuIcon.classList.remove('hidden');
                closeIcon.classList.add('hidden');
            }
        });
    }

    // Highlight active link
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const linkPath = new URL(link.href, window.location.origin).pathname;
        if (currentPath === linkPath || (currentPath === '/' && linkPath === '/index.html')) {
            link.classList.add('text-cyan-400', 'font-semibold');
            link.classList.remove('text-slate-300');
        }
    });

    // Theme Toggle Logic
    const themeToggleDesktop = document.getElementById('theme-toggle-desktop');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');
    const htmlElement = document.documentElement;

    // Check saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        htmlElement.classList.add('light-mode');
        if(themeToggleDesktop) themeToggleDesktop.innerHTML = '<i class="fa-solid fa-toggle-on text-2xl text-cyan-400"></i>';
        if(themeToggleMobile) themeToggleMobile.innerHTML = '<i class="fa-solid fa-toggle-on text-2xl text-cyan-400"></i>';
    }

    const toggleTheme = () => {
        htmlElement.classList.toggle('light-mode');
        const isLight = htmlElement.classList.contains('light-mode');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        
        const iconHtml = isLight ? '<i class="fa-solid fa-toggle-on text-2xl text-cyan-400"></i>' : '<i class="fa-solid fa-toggle-off text-2xl"></i>';
        if(themeToggleDesktop) themeToggleDesktop.innerHTML = iconHtml;
        if(themeToggleMobile) themeToggleMobile.innerHTML = iconHtml;
    };

    if (themeToggleDesktop) themeToggleDesktop.addEventListener('click', toggleTheme);
    if (themeToggleMobile) themeToggleMobile.addEventListener('click', toggleTheme);

    // Background Music Persistence
    const bgMusic = document.getElementById('bg-music');
    if (bgMusic) {
        // Restore previous state
        const savedTime = sessionStorage.getItem('musicTime');
        const isPlaying = sessionStorage.getItem('musicPlaying') === 'true';

        if (savedTime !== null) {
            bgMusic.currentTime = parseFloat(savedTime);
        }

        // Try to resume playing if it was playing before
        if (isPlaying) {
            const playPromise = bgMusic.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("Auto-play prevented by browser. Waiting for interaction.", error);
                    // Add listener to play on first interaction if blocked
                    document.body.addEventListener('click', () => {
                        bgMusic.play();
                        sessionStorage.setItem('musicPlaying', 'true');
                    }, { once: true });
                });
            }
        }

        // Keep track of state changes
        bgMusic.addEventListener('play', () => {
            sessionStorage.setItem('musicPlaying', 'true');
        });
        bgMusic.addEventListener('pause', () => {
            sessionStorage.setItem('musicPlaying', 'false');
        });

        // Save current time before leaving page
        window.addEventListener('beforeunload', () => {
            sessionStorage.setItem('musicTime', bgMusic.currentTime);
        });
    }
});
