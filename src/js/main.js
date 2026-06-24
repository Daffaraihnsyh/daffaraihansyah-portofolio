// ──────────────────────────────────────────────────────────────────────────────
// main.js — Shared logic for all pages
// Fixes: hamburger menu, theme toggle, back button, music persistence
// ──────────────────────────────────────────────────────────────────────────────

(function () {
    'use strict';

    function init() {
        // ── 1. Hamburger Mobile Menu ──────────────────────────────────────────
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        const menuIcon = document.getElementById('menu-icon');
        const closeIcon = document.getElementById('close-icon');

        if (mobileMenuButton && mobileMenu) {
            // Use touchstart + click to ensure it works on mobile browsers
            function toggleMenu(e) {
                e.preventDefault(); // Mencegah double tap zoom atau click ganda
                e.stopPropagation();
                const isHidden = mobileMenu.classList.contains('hidden');
                if (isHidden) {
                    mobileMenu.classList.remove('hidden');
                    if (menuIcon) menuIcon.classList.add('hidden');
                    if (closeIcon) closeIcon.classList.remove('hidden');
                } else {
                    mobileMenu.classList.add('hidden');
                    if (menuIcon) menuIcon.classList.remove('hidden');
                    if (closeIcon) closeIcon.classList.add('hidden');
                }
            }

            mobileMenuButton.addEventListener('click', toggleMenu);
            mobileMenuButton.addEventListener('touchstart', toggleMenu, { passive: false });

            // Close menu when clicking outside
            function closeMenu(e) {
                if (mobileMenu && !mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
                    mobileMenu.classList.add('hidden');
                    if (menuIcon) menuIcon.classList.remove('hidden');
                    if (closeIcon) closeIcon.classList.add('hidden');
                }
            }
            document.addEventListener('click', closeMenu);
            document.addEventListener('touchstart', closeMenu, { passive: true });
        }

        // ── 2. Highlight Active Nav Link ──────────────────────────────────────
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('nav a');

        navLinks.forEach(function (link) {
            try {
                const linkPath = new URL(link.href, window.location.origin).pathname;
                if (currentPath === linkPath || (currentPath === '/' && linkPath === '/index.html')) {
                    link.classList.add('text-cyan-400', 'font-semibold');
                    link.classList.remove('text-slate-300', 'text-slate-400');
                }
            } catch (e) { /* skip invalid hrefs like javascript: */ }
        });

        // ── 3. Theme Toggle ────────────────────────────────────────────────────
        const themeToggleDesktop = document.getElementById('theme-toggle-desktop');
        const themeToggleMobile = document.getElementById('theme-toggle-mobile');
        const htmlElement = document.documentElement;

        // Apply saved theme on page load
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            htmlElement.classList.add('light-mode');
            updateToggleIcons(true);
        }

        function updateToggleIcons(isLight) {
            const onIcon = '<i class="fa-solid fa-toggle-on text-2xl text-cyan-400"></i>';
            const offIcon = '<i class="fa-solid fa-toggle-off text-2xl"></i>';
            const html = isLight ? onIcon : offIcon;
            if (themeToggleDesktop) themeToggleDesktop.innerHTML = html;
            if (themeToggleMobile) themeToggleMobile.innerHTML = html;
        }

        function toggleTheme(e) {
            e.preventDefault();
            e.stopPropagation();
            htmlElement.classList.toggle('light-mode');
            const isLight = htmlElement.classList.contains('light-mode');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            updateToggleIcons(isLight);
        }

        if (themeToggleDesktop) {
            themeToggleDesktop.addEventListener('click', toggleTheme);
            themeToggleDesktop.addEventListener('touchstart', toggleTheme, { passive: false });
        }
        if (themeToggleMobile) {
            themeToggleMobile.addEventListener('click', toggleTheme);
            themeToggleMobile.addEventListener('touchstart', toggleTheme, { passive: false });
        }

        // ── 4. Background Music Persistence ──────────────────────────────────
        const bgMusic = document.getElementById('bg-music');
        if (bgMusic) {
            const savedTime = sessionStorage.getItem('musicTime');
            const isPlaying = sessionStorage.getItem('musicPlaying') === 'true';

            if (savedTime !== null) {
                bgMusic.currentTime = parseFloat(savedTime);
            }

            if (isPlaying) {
                var playPromise = bgMusic.play();
                if (playPromise !== undefined) {
                    playPromise.catch(function (error) {
                        console.log('Auto-play prevented, waiting for interaction.', error);
                        document.body.addEventListener('click', function () {
                            bgMusic.play();
                            sessionStorage.setItem('musicPlaying', 'true');
                        }, { once: true });
                    });
                }
            }

            bgMusic.addEventListener('play', function () {
                sessionStorage.setItem('musicPlaying', 'true');
            });
            bgMusic.addEventListener('pause', function () {
                sessionStorage.setItem('musicPlaying', 'false');
            });
            window.addEventListener('beforeunload', function () {
                sessionStorage.setItem('musicTime', bgMusic.currentTime);
            });
        }
    }

    // Run on DOMContentLoaded (or immediately if already ready)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
