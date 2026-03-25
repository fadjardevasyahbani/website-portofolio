/**
 * Portfolio Website Scripts
 * Vanilla JavaScript - No Dependencies
 */

(function() {
    'use strict';

    // ==========================================
    // DOM ELEMENTS
    // ==========================================
    const navbar = document.getElementById('navbar');
    const navMenu = document.getElementById('navMenu');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelectorAll('.nav-link');
    const themeToggle = document.getElementById('themeToggle');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const toggleProjectsBtn = document.getElementById('toggleProjects');
    const contactForm = document.getElementById('contactForm');

    // ==========================================
    // THEME TOGGLE
    // ==========================================
    function initTheme() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        } else if (prefersDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    initTheme();

    // ==========================================
    // NAVBAR
    // ==========================================
    let lastScrollY = window.scrollY;

    function handleScroll() {
        const currentScrollY = window.scrollY;
        
        if (navbar) {
            if (currentScrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        
        lastScrollY = currentScrollY;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navToggle) navToggle.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
        });
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');

    function updateActiveLink() {
        const scrollY = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });

    // ==========================================
    // TAB NAVIGATION
    // ==========================================
    function initTabs() {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const targetTab = this.getAttribute('data-tab');
                
                // Update active button
                tabBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Update active content
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === targetTab) {
                        content.classList.add('active');
                    }
                });
            });
        });
    }

    initTabs();

    // ==========================================
    // 3D TILT EFFECT FOR PROJECT CARDS
    // ==========================================
    function initTiltEffect() {
        const cards = document.querySelectorAll('.project-card');

        cards.forEach(card => {
            // Mouse Move - Tilt
            card.addEventListener('mousemove', (e) => {
                if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -5; // Tilt strength
                const rotateY = ((x - centerX) / centerX) * 5;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });

            // Mouse Leave - Reset
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });
    }

    initTiltEffect();

    // ==========================================
    // PROJECT FILTER & ANIMATION
    // ==========================================
    let isExpanded = false;
    let currentFilter = 'all';
    const VISIBLE_COUNT = 6;

    function initProjectFilter() {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                currentFilter = this.getAttribute('data-filter');
                
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Reset expanded state
                isExpanded = false;
                
                // Apply filter
                applyFilter();
                updateToggleButton();
            });
        });
    }

    function applyFilter() {
        let visibleIndex = 0;
        
        projectCards.forEach((card, index) => {
            const category = card.getAttribute('data-category');
            const matchesFilter = (currentFilter === 'all' || category === currentFilter);
            
            // Reset classes and styles
            card.classList.remove('visible');
            card.style.display = '';
            card.style.transform = ''; 
            
            if (matchesFilter) {
                if (isExpanded || visibleIndex < VISIBLE_COUNT) {
                    card.style.display = 'flex'; // Changed to flex for card layout
                    
                    void card.offsetWidth; 
                    
                    setTimeout(() => {
                        card.classList.add('visible');
                    }, index * 50);

                    visibleIndex++;
                } else {
                    card.style.display = 'none';
                }
            } else {
                card.style.display = 'none';
            }
        });
    }

    function updateToggleButton() {
        const toggleBtn = document.getElementById('toggleProjects');
        if (!toggleBtn) return;
        
        const toggleText = toggleBtn.querySelector('.toggle-text');
        
        // Count total matching projects
        let totalMatching = 0;
        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            if (currentFilter === 'all' || category === currentFilter) {
                totalMatching++;
            }
        });
        
        if (toggleText) {
            toggleText.textContent = isExpanded ? 'See Less' : 'See More';
        }
        
        if (isExpanded) {
            toggleBtn.classList.add('expanded');
        } else {
            toggleBtn.classList.remove('expanded');
        }
        
        toggleBtn.style.display = (totalMatching > VISIBLE_COUNT) ? 'flex' : 'none';
    }

    function initProjectsToggle() {
        const toggleBtn = document.getElementById('toggleProjects');
        if (!toggleBtn) return;

        toggleBtn.addEventListener('click', function() {
            isExpanded = !isExpanded;
            applyFilter();
            updateToggleButton();
            
            if (!isExpanded) {
                const wrapper = document.querySelector('.tab-content-wrapper');
                if (wrapper) {
                    wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    }

    // Initialize
    initProjectFilter();
    initProjectsToggle();
    applyFilter();
    updateToggleButton();

    // ==========================================
    // SCROLL REVEAL ANIMATION
    // ==========================================
    function initScrollReveal() {
        const revealElements = document.querySelectorAll('.reveal');
        
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealElements.forEach(el => revealObserver.observe(el));
    }

    initScrollReveal();

    // ==========================================
    // CONTACT FORM
    // ==========================================
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<span>Sending...</span>';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                console.log('Form submitted:', data);
                
                submitBtn.innerHTML = '<span>Message Sent!</span>';
                submitBtn.style.background = '#22C55E';
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                    contactForm.reset();
                }, 2000);
            }, 1500);
        });
    }

    // ==========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // TECH CARD INTERACTIONS
    // ==========================================
    const techCards = document.querySelectorAll('.tech-card');

    techCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });

    // ==========================================
    // KEYBOARD NAVIGATION
    // ==========================================
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (navToggle) navToggle.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
        }
    });

    // Focus Visible utility
    document.addEventListener('mousedown', () => document.body.classList.add('using-mouse'));
    document.addEventListener('keydown', (e) => { if (e.key === 'Tab') document.body.classList.remove('using-mouse'); });

    // Lazy Load Images
    function initLazyLoad() {
        const lazyImages = document.querySelectorAll('.certificate-image img[loading="lazy"]');
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        imageObserver.unobserve(img);
                    }
                });
            });
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }
    initLazyLoad();

})();

// Dynamic Styles injection for animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .using-mouse *:focus { outline: none; }
`;
document.head.appendChild(styleSheet);