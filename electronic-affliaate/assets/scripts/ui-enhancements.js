// UI Enhancements and Interactive Features

// Notification System
class NotificationManager {
    constructor() {
        this.container = document.getElementById('notification-container');
    }

    show(message, type = 'success', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                ${this.getIcon(type)}
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">×</button>
        `;
        
        this.container.appendChild(notification);
        
        // Auto remove after duration
        setTimeout(() => {
            notification.style.animation = 'slideUp 0.3s ease-out forwards';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }

    getIcon(type) {
        const icons = {
            success: '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>',
            error: '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>',
            info: '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>'
        };
        return icons[type] || icons.info;
    }
}

const notifications = new NotificationManager();

// Smooth Scroll Enhancement
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

// Enhanced Mobile Menu
class MobileMenu {
    constructor() {
        this.menuToggle = document.querySelector('.menu-toggle');
        this.nav = document.querySelector('.nav:not(.desktop-only)');
        this.overlay = document.querySelector('.mobile-overlay');
        
        if (this.menuToggle && this.nav) {
            this.init();
        }
    }

    init() {
        this.menuToggle.addEventListener('click', () => this.toggle());
        this.overlay?.addEventListener('click', () => this.close());
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.close();
            }
        });
    }

    toggle() {
        this.nav.classList.toggle('active');
        this.overlay?.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
        
        // Update aria-expanded
        const isOpen = this.isOpen();
        this.menuToggle.setAttribute('aria-expanded', isOpen);
    }

    close() {
        this.nav.classList.remove('active');
        this.overlay?.classList.remove('active');
        document.body.classList.remove('no-scroll');
        this.menuToggle.setAttribute('aria-expanded', 'false');
    }

    isOpen() {
        return this.nav.classList.contains('active');
    }
}

new MobileMenu();

// Enhanced Scroll to Top
class ScrollToTop {
    constructor() {
        this.button = document.querySelector('.scroll-top');
        if (this.button) {
            this.init();
        }
    }

    init() {
        // Show/hide based on scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                this.button.classList.add('visible');
            } else {
                this.button.classList.remove('visible');
            }
        });

        // Smooth scroll to top
        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

new ScrollToTop();

// Cookie Consent Enhancement
class CookieConsent {
    constructor() {
        this.consent = document.getElementById('cookie-consent');
        if (this.consent && !this.hasConsented()) {
            this.show();
        }
    }

    show() {
        setTimeout(() => {
            this.consent.classList.add('visible');
        }, 1000);
    }

    hasConsented() {
        return localStorage.getItem('cookieConsent') === 'true';
    }
}

window.acceptCookies = function() {
    localStorage.setItem('cookieConsent', 'true');
    const consent = document.getElementById('cookie-consent');
    consent.classList.remove('visible');
    notifications.show('Cookie preferences saved!', 'success');
};

new CookieConsent();

// Newsletter Form Enhancement
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = e.target.querySelector('input[type="email"]').value;
        const button = e.target.querySelector('button[type="submit"]');
        const originalText = button.innerHTML;
        
        // Show loading state
        button.disabled = true;
        button.innerHTML = '<span class="loading-dots"><span></span><span></span><span></span></span>';
        
        // Simulate API call
        setTimeout(() => {
            button.disabled = false;
            button.innerHTML = originalText;
            e.target.reset();
            notifications.show('🎉 Successfully subscribed! Check your email for confirmation.', 'success', 5000);
        }, 1500);
    });
}

// Filter Toggle for Mobile
const filterToggle = document.querySelector('.filter-toggle');
const sidebar = document.querySelector('.sidebar');

if (filterToggle && sidebar) {
    filterToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });
    
    // Close filters when clicking outside
    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !filterToggle.contains(e.target) && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    });
}

// Reset Filters Function
window.resetFilters = function() {
    // Reset all checkboxes
    document.querySelectorAll('.filters input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Reset price inputs
    document.querySelectorAll('.price-input').forEach(input => {
        input.value = input.placeholder === 'Min' ? '0' : '2000';
    });
    
    // Reset select
    document.getElementById('sort').selectedIndex = 0;
    
    notifications.show('Filters reset successfully', 'info');
    
    // Trigger filter update
    if (window.filterProducts) {
        window.filterProducts();
    }
};

// Add to Cart Animation
window.addToCart = function(productId, button) {
    const originalText = button.innerHTML;
    button.innerHTML = '✓ Added!';
    button.classList.add('success');
    
    // Create flying animation
    const productCard = button.closest('.product-card');
    const rect = productCard.getBoundingClientRect();
    const flyingItem = document.createElement('div');
    flyingItem.className = 'flying-item';
    flyingItem.style.left = rect.left + 'px';
    flyingItem.style.top = rect.top + 'px';
    flyingItem.style.width = rect.width + 'px';
    flyingItem.style.height = rect.height + 'px';
    
    document.body.appendChild(flyingItem);
    
    // Animate to cart icon (assuming it's in the header)
    setTimeout(() => {
        flyingItem.style.transform = 'translate(calc(100vw - 100px), -50px) scale(0.1)';
        flyingItem.style.opacity = '0';
    }, 100);
    
    // Clean up
    setTimeout(() => {
        flyingItem.remove();
        button.innerHTML = originalText;
        button.classList.remove('success');
    }, 1000);
    
    notifications.show('Product added to cart!', 'success');
};

// Lazy Loading Enhancement
const lazyImages = document.querySelectorAll('img[loading="lazy"]');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.classList.add('fade-in');
            observer.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// Add Ripple Effect
document.querySelectorAll('.ripple').forEach(element => {
    element.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple-effect');
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Product Quick View
window.quickView = function(productId) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" onclick="this.closest('.quick-view-modal').remove()">×</button>
            <div class="loading-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Simulate loading product details
    setTimeout(() => {
        modal.querySelector('.modal-content').innerHTML = `
            <button class="modal-close" onclick="this.closest('.quick-view-modal').remove()">×</button>
            <h2>Product Quick View</h2>
            <p>Product details would load here...</p>
            <button class="btn btn-primary">View Full Details</button>
        `;
    }, 500);
};

// Initialize tooltips
document.querySelectorAll('[data-tooltip]').forEach(element => {
    element.addEventListener('mouseenter', function() {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = this.dataset.tooltip;
        document.body.appendChild(tooltip);
        
        const rect = this.getBoundingClientRect();
        tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
    });
    
    element.addEventListener('mouseleave', function() {
        document.querySelectorAll('.tooltip').forEach(t => t.remove());
    });
}); 