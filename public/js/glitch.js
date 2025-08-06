class GlitchEffects {
    constructor() {
        this.init();
    }

    init() {
        this.initGlitchText();
        this.initRandomGlitches();
        this.initHoverEffects();
        this.initScrollGlitches();
    }

    initGlitchText() {
        const glitchTexts = document.querySelectorAll('.glitch-text');

        glitchTexts.forEach(text => {
            setInterval(() => {
                if (Math.random() < 0.1) { 
              this.triggerGlitch(text);
                }
            }, 3000);
        });
    }

    triggerGlitch(element) {
        element.classList.add('glitch-active');
        setTimeout(() => {
            element.classList.remove('glitch-active');
        }, 300);
    }

    initRandomGlitches() {
        const glitchableElements = document.querySelectorAll('.service-card, .skill-category, .contact-item');

        setInterval(() => {
            if (Math.random() < 0.05) { 
                const randomElement = glitchableElements[Math.floor(Math.random() * glitchableElements.length)];
                this.applyRandomGlitch(randomElement);
            }
        }, 5000);
    }

    applyRandomGlitch(element) {
        const glitchTypes = ['shake', 'flicker', 'distort'];
        const randomGlitch = glitchTypes[Math.floor(Math.random() * glitchTypes.length)];

        element.classList.add(`glitch-${randomGlitch}`);
        setTimeout(() => {
            element.classList.remove(`glitch-${randomGlitch}`);
        }, 500);
    }

    initHoverEffects() {
            document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.createGlitchRipple(card);
            });
        });

        document.querySelectorAll('.glitch-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.createClickGlitch(e.target, e);
            });
        });
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('mouseenter', () => {
                this.createTextGlitch(link);
            });
        });
    }

    createGlitchRipple(element) {
        const ripple = document.createElement('div');
        ripple.className = 'glitch-ripple';

        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (rect.width / 2 - size / 2) + 'px';
        ripple.style.top = (rect.height / 2 - size / 2) + 'px';

        element.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    createClickGlitch(element, event) {
        const glitchEffect = document.createElement('div');
        glitchEffect.className = 'click-glitch';

        const rect = element.getBoundingClientRect();
        glitchEffect.style.left = (event.clientX - rect.left) + 'px';
        glitchEffect.style.top = (event.clientY - rect.top) + 'px';

        element.appendChild(glitchEffect);

        setTimeout(() => {
            glitchEffect.remove();
        }, 400);
    }

    createTextGlitch(element) {
        const originalText = element.textContent;
        const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

        let glitchText = '';
        for (let i = 0; i < originalText.length; i++) {
            if (Math.random() < 0.3) {
                glitchText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
            } else {
                glitchText += originalText[i];
            }
        }

        element.textContent = glitchText;

        setTimeout(() => {
            element.textContent = originalText;
        }, 100);
    }

    initScrollGlitches() {
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', this.throttle(() => {
            const currentScrollY = window.scrollY;
            const scrollSpeed = Math.abs(currentScrollY - lastScrollY);

            if (scrollSpeed > 50) { 
                this.triggerScrollGlitch();
            }

            lastScrollY = currentScrollY;
        }, 100));
    }

    triggerScrollGlitch() {
        const elements = document.querySelectorAll('.glitch-text');
        const randomElement = elements[Math.floor(Math.random() * elements.length)];

        if (randomElement) {
            this.triggerGlitch(randomElement);
        }
    }

    createScreenGlitch() {
        const screenGlitch = document.createElement('div');
        screenGlitch.className = 'screen-glitch';
        screenGlitch.innerHTML = `
            <div class="glitch-line" style="top: ${Math.random() * 100}%"></div>
            <div class="glitch-line" style="top: ${Math.random() * 100}%"></div>
            <div class="glitch-line" style="top: ${Math.random() * 100}%"></div>
        `;

        document.body.appendChild(screenGlitch);

        setTimeout(() => {
            screenGlitch.remove();
        }, 200);
    }

    corruptText(element, duration = 1000) {
        const originalText = element.textContent;
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';

        const interval = setInterval(() => {
            let corruptedText = '';
            for (let i = 0; i < originalText.length; i++) {
                if (Math.random() < 0.1) {
                    corruptedText += chars[Math.floor(Math.random() * chars.length)];
                } else {
                    corruptedText += originalText[i];
                }
            }
            element.textContent = corruptedText;
        }, 50);

        setTimeout(() => {
            clearInterval(interval);
            element.textContent = originalText;
        }, duration);
    }

    terminalType(element, text, speed = 50) {
        element.textContent = '';
        let i = 0;

        const typeInterval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;

                if (Math.random() < 0.1) {
                    const glitchChar = '█▓▒░';
                    element.textContent += glitchChar[Math.floor(Math.random() * glitchChar.length)];
                    setTimeout(() => {
                        element.textContent = element.textContent.slice(0, -1);
                    }, 50);
                }
            } else {
                clearInterval(typeInterval);
            }
        }, speed);
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

const glitchStyles = `
    .glitch-active {
        animation: intense-glitch 0.3s ease-in-out !important;
    }

    @keyframes intense-glitch {
        0%, 100% { transform: translateX(0); }
        10% { transform: translateX(-5px) skewX(-10deg); }
        20% { transform: translateX(5px) skewX(10deg); }
        30% { transform: translateX(-3px) skewX(-5deg); }
        40% { transform: translateX(3px) skewX(5deg); }
        50% { transform: translateX(-2px) skewX(-2deg); }
        60% { transform: translateX(2px) skewX(2deg); }
        70% { transform: translateX(-1px) skewX(-1deg); }
        80% { transform: translateX(1px) skewX(1deg); }
        90% { transform: translateX(0) skewX(0deg); }
    }

    .glitch-shake {
        animation: glitch-shake 0.5s ease-in-out;
    }

    @keyframes glitch-shake {
        0%, 100% { transform: translateX(0); }
        10% { transform: translateX(-2px) translateY(-2px); }
        20% { transform: translateX(2px) translateY(2px); }
        30% { transform: translateX(-2px) translateY(2px); }
        40% { transform: translateX(2px) translateY(-2px); }
        50% { transform: translateX(-1px) translateY(-1px); }
        60% { transform: translateX(1px) translateY(1px); }
        70% { transform: translateX(-1px) translateY(1px); }
        80% { transform: translateX(1px) translateY(-1px); }
        90% { transform: translateX(0) translateY(0); }
    }

    .glitch-flicker {
        animation: glitch-flicker 0.5s ease-in-out;
    }

    @keyframes glitch-flicker {
        0%, 100% { opacity: 1; }
        10% { opacity: 0.8; }
        20% { opacity: 1; }
        30% { opacity: 0.6; }
        40% { opacity: 1; }
        50% { opacity: 0.9; }
        60% { opacity: 1; }
        70% { opacity: 0.7; }
        80% { opacity: 1; }
        90% { opacity: 0.95; }
    }

    .glitch-distort {
        animation: glitch-distort 0.5s ease-in-out;
    }

    @keyframes glitch-distort {
        0%, 100% { transform: scaleX(1) scaleY(1); }
        25% { transform: scaleX(1.05) scaleY(0.95); }
        50% { transform: scaleX(0.95) scaleY(1.05); }
        75% { transform: scaleX(1.02) scaleY(0.98); }
    }

    .glitch-ripple {
        position: absolute;
        border-radius: 50%;
        background: radial-gradient(circle, transparent 40%, var(--accent-primary) 50%, transparent 60%);
        animation: glitch-ripple-anim 0.6s ease-out;
        pointer-events: none;
        z-index: 1;
    }

    @keyframes glitch-ripple-anim {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(1);
            opacity: 0;
        }
    }

    .click-glitch {
        position: absolute;
        width: 20px;
        height: 20px;
        background: var(--accent-primary);
        border-radius: 50%;
        animation: click-glitch-anim 0.4s ease-out;
        pointer-events: none;
        z-index: 2;
    }

    @keyframes click-glitch-anim {
        0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
        }
        50% {
            transform: scale(1.5) rotate(180deg);
            opacity: 0.7;
        }
        100% {
            transform: scale(3) rotate(360deg);
            opacity: 0;
        }
    }

    .screen-glitch {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9998;
        animation: screen-glitch-anim 0.2s ease-out;
    }

    .glitch-line {
        position: absolute;
        left: 0;
        width: 100%;
        height: 2px;
        background: var(--accent-primary);
        animation: glitch-line-anim 0.2s ease-out;
    }

    @keyframes screen-glitch-anim {
        0%, 100% { opacity: 0; }
        50% { opacity: 0.8; }
    }

    @keyframes glitch-line-anim {
        0% { transform: translateX(-100%); }
        50% { transform: translateX(0%); }
        100% { transform: translateX(100%); }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = glitchStyles;
document.head.appendChild(styleSheet);

document.addEventListener('DOMContentLoaded', () => {
    window.glitchEffects = new GlitchEffects();
});
