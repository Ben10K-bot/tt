class WhatsAppIntegration {
    constructor() {
        this.phoneNumber = '+966547540321';
        this.baseURL = 'https://wa.me/';
        this.init();
    }

    init() {
        this.initServiceButtons();
        this.initContactForm();
        this.initQuickContact();
    }

    initServiceButtons() {

        const checkServices = setInterval(() => {
            const serviceButtons = document.querySelectorAll('.service-btn');
            if (serviceButtons.length > 0) {
                clearInterval(checkServices);
                this.setupServiceButtons(serviceButtons);
            }
        }, 100);
    }

    setupServiceButtons(buttons) {
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const serviceName = button.dataset.service;
                this.openWhatsAppForService(serviceName);
            });
        });
    }

    openWhatsAppForService(serviceName) {
        const message = `Hi! I am interested in \`${serviceName}\`. Could you please provide more details about this service?`;
        const whatsappURL = this.generateWhatsAppURL(message);

        const button = document.querySelector(`[data-service="${serviceName}"]`);
        if (button) {
            button.style.animation = 'glitch-btn 0.3s ease-in-out';
            setTimeout(() => {
                button.style.animation = '';
            }, 300);
        }

        window.open(whatsappURL, '_blank');

        this.trackWhatsAppInteraction('service', serviceName);
    }

    initContactForm() {
        const contactForm = document.getElementById('contact-form');
        if (!contactForm) return;

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleContactFormSubmission(contactForm);
        });
    }

    handleContactFormSubmission(form) {
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            service: formData.get('service'),
            message: formData.get('message')
        };

        if (!this.validateFormData(data)) {
            this.showFormError('Please fill in all required fields.');
            return;
        }

        const whatsappMessage = this.generateContactMessage(data);
        const whatsappURL = this.generateWhatsAppURL(whatsappMessage);

        this.showFormSuccess();

        setTimeout(() => {
            window.open(whatsappURL, '_blank');
        }, 500);

        this.trackWhatsAppInteraction('contact_form', data.service || 'general');

        setTimeout(() => {
            form.reset();
            this.hideFormFeedback();
        }, 2000);
    }

    generateContactMessage(data) {
        let message = `Hi! My name is \`${data.name}\`.\n\n`;

        if (data.service) {
            message += `I'm interested in: \`${data.service}\`\n\n`;
        }

        message += `Message: \`${data.message}\` \n\n`;
        message += `Email: ${data.email}`;

        return message;
    }

    validateFormData(data) {
        return data.name && data.email && data.message;
    }

    showFormError(message) {
        this.showFormFeedback(message, 'error');
    }

    showFormSuccess() {
        this.showFormFeedback('Message prepared! Opening WhatsApp...', 'success');
    }

    showFormFeedback(message, type) {

        this.hideFormFeedback();

        const feedback = document.createElement('div');
        feedback.className = `form-feedback form-feedback-${type}`;
        feedback.textContent = message;

        const form = document.getElementById('contact-form');
        form.appendChild(feedback);

        setTimeout(() => {
            feedback.classList.add('show');
        }, 10);
    }

    hideFormFeedback() {
        const existingFeedback = document.querySelector('.form-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }
    }

    initQuickContact() {

        this.addQuickContactButton();
        this.addFloatingWhatsAppButton();
    }

    addQuickContactButton() {
        const contactItems = document.querySelectorAll('.contact-item');
        contactItems.forEach(item => {
            const icon = item.querySelector('.contact-icon');
            if (icon && icon.textContent.includes('📱')) {
                const button = document.createElement('button');
                button.className = 'btn btn-secondary quick-contact-btn';
                button.innerHTML = '<span>Chat on WhatsApp</span>';
                button.addEventListener('click', () => {
                    this.openWhatsAppForQuickContact();
                });
                item.appendChild(button);
            }
        });
    }

    addFloatingWhatsAppButton() {
        const floatingBtn = document.createElement('div');
        floatingBtn.className = 'floating-whatsapp-btn';
        floatingBtn.innerHTML = `
            <div class="whatsapp-icon"><i class="fab fa-whatsapp"></i></div>
            <div class="whatsapp-tooltip">Chat with us!</div>
        `;

        floatingBtn.addEventListener('click', () => {
            this.openWhatsAppForQuickContact();
        });

        document.body.appendChild(floatingBtn);

        window.addEventListener('scroll', this.throttle(() => {
            if (window.scrollY > 500) {
                floatingBtn.classList.add('show');
            } else {
                floatingBtn.classList.remove('show');
            }
        }, 100));
    }

    openWhatsAppForQuickContact() {
        const message = "Hi! I'd like to discuss a potential project. Are you available for a quick chat?";
        const whatsappURL = this.generateWhatsAppURL(message);
        window.open(whatsappURL, '_blank');
        this.trackWhatsAppInteraction('quick_contact', 'general');
    }

    generateWhatsAppURL(message) {
        const encodedMessage = encodeURIComponent(message);
        const cleanPhoneNumber = this.phoneNumber.replace(/\D/g, '');
        return `${this.baseURL}${cleanPhoneNumber}?text=${encodedMessage}`;
    }

    trackWhatsAppInteraction(type, service) {

        const interaction = {
            type: type,
            service: service,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        };

        const interactions = JSON.parse(localStorage.getItem('whatsapp_interactions') || '[]');
        interactions.push(interaction);
        localStorage.setItem('whatsapp_interactions', JSON.stringify(interactions));

        console.log('WhatsApp interaction tracked:', interaction);
    }

    getAnalytics() {
        return JSON.parse(localStorage.getItem('whatsapp_interactions') || '[]');
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

    formatPhoneNumber(phone) {
        return phone.replace(/\D/g, '');
    }

    getServiceMessageTemplate(serviceName) {
        const templates = {
            'Discord Bot Development': 'Hi! I need a custom Discord bot. Can we discuss the features and pricing?',
            'Telegram Bot Solutions': 'Hello! I\'m interested in developing a Telegram bot for my business.',
            'Full-Stack Web Development': 'Hi! I need a website/web application developed. Can we talk about the requirements?',
            'Automation & Scripting': 'Hello! I need some automation scripts. Can you help with this?',
            'API Development & Integration': 'Hi! I need API development services. Are you available to discuss?',
            'Custom Software Solutions': 'Hello! I have a custom software requirement. Can we schedule a discussion?'
        };

        return templates[serviceName] || `Hi! I am interested in ${serviceName}. Could you please provide more details?`;
    }
}

const whatsappStyles = `
    .form-feedback {
        margin-top: 1rem;
        padding: 0.75rem;
        border-radius: var(--radius-md);
        font-weight: 500;
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.3s ease;
    }

    .form-feedback.show {
        opacity: 1;
        transform: translateY(0);
    }

    .form-feedback-success {
        background-color: rgba(34, 197, 94, 0.1);
        color: #22c55e;
        border: 1px solid rgba(34, 197, 94, 0.3);
    }

    .form-feedback-error {
        background-color: rgba(239, 68, 68, 0.1);
        color: #ef4444;
        border: 1px solid rgba(239, 68, 68, 0.3);
    }

    .quick-contact-btn {
        margin-top: 1rem;
        width: 100%;
    }

    .floating-whatsapp-btn {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #25d366, #128c7e);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(37, 211, 102, 0.3);
        z-index: 1000;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
    }

    .floating-whatsapp-btn.show {
        transform: translateY(0);
        opacity: 1;
    }

    .floating-whatsapp-btn:hover {
        transform: translateY(-5px) scale(1.1);
        box-shadow: 0 8px 30px rgba(37, 211, 102, 0.4);
    }

    .whatsapp-icon {
        font-size: 1.5rem;
        color: white;
    }

    .whatsapp-tooltip {
        position: absolute;
        right: 70px;
        background: var(--bg-primary);
        color: var(--text-primary);
        padding: 0.5rem 1rem;
        border-radius: var(--radius-md);
        font-size: 0.875rem;
        white-space: nowrap;
        opacity: 0;
        transform: translateX(10px);
        transition: all 0.3s ease;
        border: 1px solid var(--border-color);
        box-shadow: 0 4px 20px var(--shadow-color);
    }

    .floating-whatsapp-btn:hover .whatsapp-tooltip {
        opacity: 1;
        transform: translateX(0);
    }

    .whatsapp-tooltip::after {
        content: '';
        position: absolute;
        top: 50%;
        right: -5px;
        transform: translateY(-50%);
        width: 0;
        height: 0;
        border-left: 5px solid var(--bg-primary);
        border-top: 5px solid transparent;
        border-bottom: 5px solid transparent;
    }

    @media (max-width: 768px) {
        .floating-whatsapp-btn {
            bottom: 1rem;
            right: 1rem;
            width: 50px;
            height: 50px;
        }

        .whatsapp-icon {
            font-size: 1.25rem;
        }

        .whatsapp-tooltip {
            display: none;
        }
    }

    .service-btn {
        position: relative;
        overflow: hidden;
    }

    .service-btn::after {
        content: '💬';
        position: absolute;
        top: 50%;
        right: 1rem;
        transform: translateY(-50%);
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .service-btn:hover::after {
        opacity: 1;
    }

    .contact-form {
        position: relative;
    }

    .contact-form .btn-primary {
        position: relative;
        overflow: hidden;
    }

    .contact-form .btn-primary::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        transition: left 0.5s;
    }

    .contact-form .btn-primary:hover::before {
        left: 100%;
    }
`;

const whatsappStyleSheet = document.createElement('style');
whatsappStyleSheet.textContent = whatsappStyles;
document.head.appendChild(whatsappStyleSheet);

document.addEventListener('DOMContentLoaded', () => {

    setTimeout(() => {
        window.whatsappIntegration = new WhatsAppIntegration();
    }, 1000);
});
