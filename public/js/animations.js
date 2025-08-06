class Animations {
    constructor() {
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.isMobile = window.innerWidth <= 768;
        this.isLowPerformance = this.detectLowPerformance();
        this.init();
    }

    detectLowPerformance() {

        const start = performance.now();
        for (let i = 0; i < 100000; i++) {
            Math.random();
        }
        const end = performance.now();
        return (end - start) > 10; 
    }

    init() {
        this.initScrollAnimations();

        if (!this.isLowPerformance && !this.isMobile) {
            this.initParallaxEffects();
            this.initCursorEffects();
        }

        this.initCounterAnimations();
        this.initProgressBars();

        if (!this.isReducedMotion && !this.isLowPerformance) {
            this.initOptimizedParticleSystem();
        }
    }

    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);

        const animatedElements = document.querySelectorAll(`
            .service-card,
            .skill-category,
            .contact-item,
            .about-details,
            .hero-stats,
            .section-header
        `);

        animatedElements.forEach(el => {
            el.classList.add('animate-on-scroll');
            observer.observe(el);
        });
    }

    animateElement(element) {
        element.classList.add('animated');

        const children = element.querySelectorAll('.service-card, .skill-item, .detail-item');
        children.forEach((child, index) => {
            setTimeout(() => {
                child.classList.add('animated');
            }, index * 100);
        });
    }

    initParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.floating-element, .matrix-column');

        window.addEventListener('scroll', this.throttle(() => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;

            parallaxElements.forEach((element, index) => {
                const speed = (index + 1) * 0.2;
                element.style.transform = `translateY(${rate * speed}px)`;
            });
        }, 10));
    }

    initCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number');

        const animateCounter = (counter) => {
            const target = parseInt(counter.textContent.replace(/\D/g, ''));
            const increment = target / 100;
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }

                const suffix = counter.textContent.includes('+') ? '+' : '';
                counter.textContent = Math.floor(current) + suffix;
            }, 20);
        };

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    initProgressBars() {
        const progressBars = document.querySelectorAll('.skill-progress');

        const animateProgressBar = (bar) => {
            const skillItem = bar.closest('.skill-item');
            const level = skillItem.dataset.level;

            let width = 0;
            const target = parseInt(level);
            const increment = target / 50;

            const timer = setInterval(() => {
                width += increment;
                if (width >= target) {
                    width = target;
                    clearInterval(timer);
                }
                bar.style.width = width + '%';
            }, 30);
        };

        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target.querySelector('.skill-progress');
                    if (progressBar) {
                        setTimeout(() => animateProgressBar(progressBar), 300);
                        progressObserver.unobserve(entry.target);
                    }
                }
            });
        });

        document.querySelectorAll('.skill-item').forEach(item => {
            progressObserver.observe(item);
        });
    }

    initOptimizedParticleSystem() {
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particle-system';
        document.body.appendChild(particleContainer);

        this.createOptimizedParticles(particleContainer);

        setInterval(() => {
            this.createOptimizedParticles(particleContainer);
        }, 15000);
    }

    createOptimizedParticles(container) {

        const particleCount = this.isMobile ? 5 : 10;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 4 + 3) + 's';
            particle.style.animationDelay = Math.random() * 3 + 's';

            container.appendChild(particle);

            setTimeout(() => {
                if (particle.parentNode) {
                    particle.remove();
                }
            }, 8000);
        }
    }

    initCursorEffects() {

        if ('ontouchstart' in window) return;

        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);

        const cursorFollower = document.createElement('div');
        cursorFollower.className = 'cursor-follower';
        document.body.appendChild(cursorFollower);

        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;
        let isMoving = false;

        const handleMouseMove = this.throttle((e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            isMoving = true;

            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        }, 16); 

        document.addEventListener('mousemove', handleMouseMove);

        const animateFollower = () => {
            if (isMoving) {
                followerX += (mouseX - followerX) * 0.1;
                followerY += (mouseY - followerY) * 0.1;

                cursorFollower.style.left = followerX + 'px';
                cursorFollower.style.top = followerY + 'px';

                if (Math.abs(mouseX - followerX) < 1 && Math.abs(mouseY - followerY) < 1) {
                    isMoving = false;
                }
            }

            requestAnimationFrame(animateFollower);
        };
        animateFollower();

        const interactiveElements = document.querySelectorAll('a, button, .service-card, .skill-item');

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor-hover');
                cursorFollower.classList.add('cursor-hover');
            });

            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor-hover');
                cursorFollower.classList.remove('cursor-hover');
            });
        });
    }

    revealElement(element, delay = 0) {
        setTimeout(() => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'all 0.6s ease-out';

            requestAnimationFrame(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            });
        }, delay);
    }

    staggerReveal(elements, staggerDelay = 100) {
        elements.forEach((element, index) => {
            this.revealElement(element, index * staggerDelay);
        });
    }

    morphText(element, newText, duration = 1000) {
        const originalText = element.textContent;
        const maxLength = Math.max(originalText.length, newText.length);

        let progress = 0;
        const step = 1000 / duration;

        const morphInterval = setInterval(() => {
            progress += step;

            let morphedText = '';
            for (let i = 0; i < maxLength; i++) {
                const progressRatio = Math.min(progress / 1000, 1);
                const charProgress = Math.max(0, Math.min(1, (progressRatio - (i / maxLength)) * maxLength));

                if (charProgress === 1) {
                    morphedText += newText[i] || '';
                } else if (charProgress > 0) {
                    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                    morphedText += chars[Math.floor(Math.random() * chars.length)];
                } else {
                    morphedText += originalText[i] || '';
                }
            }

            element.textContent = morphedText;

            if (progress >= 1000) {
                clearInterval(morphInterval);
                element.textContent = newText;
            }
        }, 16);
    }

    waveText(element) {
        const text = element.textContent;
        element.innerHTML = '';

        [...text].forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.animationDelay = `${index * 0.1}s`;
            span.className = 'wave-char';
            element.appendChild(span);
        });
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

const animationStyles = `
    .animate-on-scroll {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease-out;
    }

    .animate-on-scroll.animated {
        opacity: 1;
        transform: translateY(0);
    }

    .particle-system {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
    }

    .particle {
        position: absolute;
        width: 2px;
        height: 2px;
        background: var(--accent-primary);
        border-radius: 50%;
        animation: particle-float linear infinite;
    }

    @keyframes particle-float {
        0% {
            transform: translateY(100vh) scale(0);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) scale(1);
            opacity: 0;
        }
    }


    .wave-char {
        display: inline-block;
        animation: wave 1s ease-in-out infinite;
    }

    @keyframes wave {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }

    .service-card:nth-child(1) { animation-delay: 0.1s; }
    .service-card:nth-child(2) { animation-delay: 0.2s; }
    .service-card:nth-child(3) { animation-delay: 0.3s; }
    .service-card:nth-child(4) { animation-delay: 0.4s; }
    .service-card:nth-child(5) { animation-delay: 0.5s; }
    .service-card:nth-child(6) { animation-delay: 0.6s; }

    .skill-item:nth-child(1) { animation-delay: 0.1s; }
    .skill-item:nth-child(2) { animation-delay: 0.2s; }
    .skill-item:nth-child(3) { animation-delay: 0.3s; }
    .skill-item:nth-child(4) { animation-delay: 0.4s; }
    .skill-item:nth-child(5) { animation-delay: 0.5s; }

    .service-card {
        transition: all 0.3s ease;
    }

    .service-card:hover {
        transform: translateY(-10px) scale(1.02);
    }

    .skill-item {
        transition: all 0.3s ease;
    }

    .skill-item:hover {
        transform: translateX(10px);
    }

    @media (max-width: 768px) {
        .custom-cursor,
        .cursor-follower {
            display: none;
        }

        .particle {
            display: none;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .animate-on-scroll {
            transition: none;
        }

        .particle {
            animation: none;
        }

        .wave-char {
            animation: none;
        }

        .custom-cursor,
        .cursor-follower {
            display: none;
        }
    }
`;

const animationStyleSheet = document.createElement('style');
animationStyleSheet.textContent = animationStyles;
document.head.appendChild(animationStyleSheet);

document.addEventListener('DOMContentLoaded', () => {
    window.animations = new Animations();
});
