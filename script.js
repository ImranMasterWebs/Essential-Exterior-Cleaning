document.addEventListener("DOMContentLoaded", () => {
    // 1. Navbar & Mobile Menu
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });
    }

    // 2. FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                // Close all
                faqItems.forEach(i => {
                    i.classList.remove('active');
                    i.querySelector('.faq-answer').style.maxHeight = null;
                });
                // Open clicked if it wasn't active
                if (!isActive) {
                    item.classList.add('active');
                    const answer = item.querySelector('.faq-answer');
                    answer.style.maxHeight = answer.scrollHeight + "px";
                }
            });
        });
    }

    // 3. Before/After Slider
    const sliderContainers = document.querySelectorAll('.slider-container');
    
    if (sliderContainers.length > 0) {
        sliderContainers.forEach(container => {
            const sliderForeground = container.querySelector('.img-foreground-container');
            const sliderHandle = container.querySelector('.slider-handle');
            let isDragging = false;

            const moveSlider = (clientX) => {
                const rect = container.getBoundingClientRect();
                let x = clientX - rect.left;
                // Clamp between 0 and width
                x = Math.max(0, Math.min(x, rect.width));
                const percentage = (x / rect.width) * 100;
                
                if (sliderForeground) sliderForeground.style.width = `${percentage}%`;
                if (sliderHandle) sliderHandle.style.left = `${percentage}%`;
            };

            // Mouse Events
            container.addEventListener('mousedown', (e) => {
                isDragging = true;
                moveSlider(e.clientX);
            });
            window.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                moveSlider(e.clientX);
            });
            window.addEventListener('mouseup', () => {
                isDragging = false;
            });

            // Touch Events
            container.addEventListener('touchstart', (e) => {
                isDragging = true;
                moveSlider(e.touches[0].clientX);
            });
            window.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                moveSlider(e.touches[0].clientX);
            });
            window.addEventListener('touchend', () => {
                isDragging = false;
            });
        });
    }

    // 4. GSAP & ScrollTrigger Animations
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Hero Cinematic Scroll (Only if hero section exists)
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            const heroTl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".hero-section",
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1, // Smooth scrubbing
                }
            });

            // Phase 1: Zoom in slightly on dirty
            heroTl.to(".hero-img.dirty-img", { scale: 1.1, duration: 1 }, 0);
            // Phase 2: Fade out overlay slightly
            heroTl.to(".hero-section .overlay", { opacity: 0.5, duration: 1 }, 0);
            // Phase 3: Wipe reveal the clean image (clip-path inset from right)
            if (document.querySelector('.clean-reveal-container')) {
                heroTl.to(".clean-reveal-container", {
                    clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                    ease: "none",
                    duration: 2
                }, 1);
            }
            // Phase 4: Zoom out clean image to standard
            heroTl.fromTo(".hero-img.clean-img", { scale: 1.1 }, { scale: 1.0, duration: 1 }, 2);
        }

        // Standard Fade Ups
        const fadeUps = document.querySelectorAll('.fade-up');
        if (fadeUps.length > 0) {
            fadeUps.forEach(elem => {
                gsap.to(elem, {
                    scrollTrigger: {
                        trigger: elem,
                        start: "top 85%",
                    },
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power2.out"
                });
            });
        }

        // Image Parallax
        const parallaxImgs = document.querySelectorAll('.parallax-img img');
        if (parallaxImgs.length > 0) {
            parallaxImgs.forEach(img => {
                gsap.to(img, {
                    scrollTrigger: {
                        trigger: img.parentElement,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true
                    },
                    y: "20%",
                    ease: "none"
                });
            });
        }
    }
});
