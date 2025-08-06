class PortfolioApp {
    constructor() {
        this.data = {
            info: null,
            services: null,
            skills: null
        };
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    async init() {
        try {

            this.showLoading();

            await this.loadData();

            this.initTheme();
            this.initNavigation();
            this.initScrollEffects();
            this.populateContent();
            this.initAnimations();

            setTimeout(() => this.hideLoading(), 2000);

        } catch (error) {
            console.error('Failed to initialize portfolio:', error);
            this.hideLoading();
        }
    }

    showLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.remove('hidden');
        }
    }

    hideLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }

    async loadData() {
        try {
            const [infoResponse, servicesResponse, skillsResponse] = await Promise.all([
                fetch('/api/info'),
                fetch('/api/services'),
                fetch('/api/skills')
            ]);

            this.data.info = await infoResponse.json();
            this.data.services = await servicesResponse.json();
            this.data.skills = await skillsResponse.json();

        } catch (error) {
            console.error('Error loading data:', error);

            this.data.info = {
                name: "Alex DevGlitch",
                title: "Full-Stack Developer & Bot Specialist",
                tagline: "Crafting digital experiences with a glitch aesthetic"
            };
        }
    }

    initTheme() {
        const body = document.body;
        const themeToggle = document.getElementById('theme-toggle');
        const themeIcon = themeToggle?.querySelector('.theme-icon');

        body.className = `${this.currentTheme}-theme`;
        if (themeIcon) {
            themeIcon.textContent = this.currentTheme === 'dark' ? '☀️' : '🌙';
        }

        themeToggle?.addEventListener('click', () => {
            this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
            body.className = `${this.currentTheme}-theme`;

            if (themeIcon) {
                themeIcon.textContent = this.currentTheme === 'dark' ? '☀️' : '🌙';
            }

            localStorage.setItem('theme', this.currentTheme);

            themeToggle.style.animation = 'glitch-btn 0.3s ease-in-out';
            setTimeout(() => {
                themeToggle.style.animation = '';
            }, 300);
        });
    }

    initNavigation() {
        const navbar = document.getElementById('navbar');
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        navToggle?.addEventListener('click', () => {
            navMenu?.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu?.classList.remove('active');
                navToggle?.classList.remove('active');
            });
        });

        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar?.classList.add('scrolled');
            } else {
                navbar?.classList.remove('scrolled');
            }
        });

        this.updateActiveNavLink();
        window.addEventListener('scroll', () => this.updateActiveNavLink());
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    initScrollEffects() {

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');

                    if (entry.target.classList.contains('skill-item')) {
                        this.animateSkillBar(entry.target);
                    }
                }
            });
        }, observerOptions);

        document.querySelectorAll('.service-card, .skill-item, .contact-item').forEach(el => {
            observer.observe(el);
        });
    }

    populateContent() {
        this.populateInfo();
        this.populateServices();
        this.populateSkills();
    }

    populateInfo() {
        if (!this.data.info) return;

        const info = this.data.info;

        document.getElementById('hero-subtitle').textContent = info.title || '';
        document.getElementById('hero-description').textContent = info.tagline || '';
        document.getElementById('experience').textContent = info.experience || '5+';
        document.getElementById('projects').textContent = info.projects || '150';
        document.getElementById('clients').textContent = info.clients || '85';

        document.getElementById('about-bio').textContent = info.bio || '';
        document.getElementById('location').textContent = info.location || '';
        document.getElementById('email').textContent = info.email || '';
        document.getElementById('availability').textContent = info.availability || '';

        document.getElementById('contact-email').textContent = info.email || '';
        document.getElementById('contact-phone').textContent = info.phone || '';
        document.getElementById('contact-location').textContent = info.location || '';

        this.populateSocialLinks(info.social);
    }

    populateSocialLinks(social) {
        if (!social) return;

        const socialContainer = document.getElementById('social-links');
        if (!socialContainer) return;

        socialContainer.innerHTML = null
            .filter(platform => social[platform.key])
            .map(platform => `
                <a href="${social[platform.key]}" target="_blank" rel="noopener noreferrer" class="social-link glitch-hover">
                    <span>${platform.icon}</span>
                    <span>${platform.label}</span>
                </a>
            `).join('');
    }

    populateServices() {
        if (!this.data.services?.services) return;

        const servicesGrid = document.getElementById('services-grid');
        if (!servicesGrid) return;

        servicesGrid.innerHTML = this.data.services.services.map(service => `
            <div class="service-card" data-service-id="${service.id}">
                <div class="service-header">
                    <div class="service-icon">${service.icon}</div>
                    <h3 class="service-title">${service.name}</h3>
                </div>
                <p class="service-description">${service.description}</p>
                <ul class="service-features">
                    ${service.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
                <div class="service-footer">
                    <div class="service-price">${service.price}</div>
                    <div class="service-delivery">${service.deliveryTime}</div>
                </div>
                <button class="btn btn-primary glitch-btn service-btn" data-service="${service.name}">
                    <span>Get Started</span>
                </button>
            </div>
        `).join('');

        document.querySelectorAll('.service-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const serviceName = e.target.closest('.service-btn').dataset.service;
                this.handleServiceClick(serviceName);
            });
        });
    }

    populateSkills() {
        if (!this.data.skills?.categories) return;

        const skillsContainer = document.getElementById('skills-container');
        if (!skillsContainer) return;

        skillsContainer.innerHTML = this.data.skills.categories.map(category => `
            <div class="skill-category">
                <h3 class="skill-category-title">${category.name}</h3>
                <div class="skills-grid">
                    ${category.skills.map(skill => `
                        <div class="skill-item" data-level="${skill.level}">
                            <div class="skill-icon" style="color: ${skill.color}">${skill.icon}</div>
                            <div class="skill-info">
                                <div class="skill-name">${skill.name}</div>
                                <div class="skill-bar">
                                    <div class="skill-progress" style="background-color: ${skill.color}; width: ${skill.level}%; height: 100%"></div>
                                </div>
                            </div>
                            <div class="skill-level">${skill.level}%</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');

        this.populateServiceOptions();
    }

    populateServiceOptions() {
        const serviceSelect = document.getElementById('service');
        if (!serviceSelect || !this.data.services?.services) return;

        const options = this.data.services.services.map(service => 
            `<option value="${service.name}">${service.name}</option>`
        ).join('');

        serviceSelect.innerHTML = '<option value="">Select a service</option>' + options;
    }

    initAnimations() {

        this.initTypingEffect();

        this.initFloatingElements();

        this.initMatrixEffect();

        this.addAnimationClasses();
    }

    initTypingEffect() {
        const heroTitle = document.querySelector('.hero-title .glitch-text');
        if (!heroTitle || !this.data.info?.name) return;

        const text = this.data.info.name;
        heroTitle.textContent = '';
        heroTitle.setAttribute('data-text', text);

        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };

        setTimeout(typeWriter, 1000);
    }

    initFloatingElements() {
        const floatingElements = document.querySelectorAll('.floating-element');
        floatingElements.forEach((element, index) => {
            const speed = element.dataset.speed || 2;
            element.style.animationDuration = `${6 / speed}s`;
            element.style.animationDelay = `${index * 0.5}s`;
        });
    }

    initMatrixEffect() {

        const matrixBg = document.createElement('div');
        matrixBg.className = 'matrix-bg';
        document.body.appendChild(matrixBg);

        const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';

        for (let i = 0; i < 50; i++) {
            const column = document.createElement('div');
            column.className = 'matrix-column';
            column.style.left = `${Math.random() * 100}%`;
            column.style.animationDuration = `${Math.random() * 3 + 2}s`;
            column.style.animationDelay = `${Math.random() * 2}s`;

            let text = '';
            for (let j = 0; j < 20; j++) {
                text += characters.charAt(Math.floor(Math.random() * characters.length)) + '<br>';
            }
            column.innerHTML = text;

            matrixBg.appendChild(column);
        }
    }

    addAnimationClasses() {

        document.querySelectorAll('.service-card').forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });

        document.querySelectorAll('.skill-category').forEach((category, index) => {
            category.style.animationDelay = `${index * 0.2}s`;
        });
    }

    animateSkillBar(skillItem) {
        const level = skillItem.dataset.level;
        const progressBar = skillItem.querySelector('.skill-progress');

        if (progressBar && level) {

            setTimeout(() => {
                progressBar.style.width = `${level}%`;
            }, 300);
        }
    }

    handleServiceClick(serviceName) {
        console.log(`Service clicked: ${serviceName}`);

    }

    initContactForm() {
        const contactForm = document.getElementById('contact-form');
        if (!contactForm) return;

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            console.log('Contact form submitted');
        });
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
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

document.addEventListener('DOMContentLoaded', () => {
    window.portfolioApp = new PortfolioApp();
});

document.addEventListener('DOMContentLoaded', () => {
    const noiseOverlay = document.createElement('div');
    noiseOverlay.className = 'noise-overlay';
    document.body.appendChild(noiseOverlay);
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {

    });
}

document.addEventListener("DOMContentLoaded", () => {
    const skillsContainer = document.getElementById("skills-container");
    if (skillsContainer) {
        const skills = [
            { name: "HTML", level: 95 },
            { name: "CSS", level: 90 },
            { name: "JavaScript", level: 85 },
            { name: "Node.js", level: 80 },
            { name: "Python", level: 75 }
        ];

        skills.forEach(skill => {
            const skillItem = document.createElement("div");
            skillItem.className = "skill-item";
            skillItem.innerHTML = `
                <h4>${skill.name}</h4>
                <div class="skill-bar">
                    <div class="skill-bar-fill" style="width: ${skill.level}%"></div>
                </div>
            `;
            skillsContainer.appendChild(skillItem);
        });
    }
})
