/**
 * TechDeals - Enhanced JavaScript Functionality
 * Provides search, navigation, filtering, and interactive features
 */

class TechDealsApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initSearch();
        this.initMegaMenu();
        this.initMobileMenu();
        this.initScrollEffects();
        this.initFilters();
        this.initAnimations();
        this.initLazyLoading();
        this.initKeyboardNavigation();
    }

    setupEventListeners() {
        // Scroll to top functionality
        const scrollTopBtn = document.querySelector('.scroll-top');
        if (scrollTopBtn) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                    scrollTopBtn.classList.add('visible');
                } else {
                    scrollTopBtn.classList.remove('visible');
                }
            });

            scrollTopBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }

    // Enhanced Search Functionality
    initSearch() {
        const searchInput = document.querySelector('.search-input');
        const searchSuggestions = document.querySelector('.search-suggestions');
        let searchTimeout;

        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();

            if (query.length < 2) {
                this.hideSuggestions();
                return;
            }

            searchTimeout = setTimeout(() => {
                this.performSearch(query);
            }, 300);
        });

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideSuggestions();
            }
        });

        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.hideSuggestions();
            }
        });
    }

    async performSearch(query) {
        // Mock search results - in real implementation, this would fetch from API or JSON
        const mockResults = this.getMockSearchResults(query);
        this.displaySearchSuggestions(mockResults);
    }

    getMockSearchResults(query) {
        const mockData = [
            { name: 'iPhone 15 Pro', category: 'Smartphones', price: '$999' },
            { name: 'MacBook Air M3', category: 'Laptops', price: '$1099' },
            { name: 'Sony WH-1000XM5', category: 'Audio', price: '$349' },
            { name: 'Samsung Galaxy S24', category: 'Smartphones', price: '$799' },
            { name: 'Dell XPS 13', category: 'Laptops', price: '$999' }
        ];

        return mockData.filter(item => 
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.category.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 6);
    }

    displaySearchSuggestions(results) {
        const suggestionsContainer = document.querySelector('.search-suggestions');
        if (!suggestionsContainer) return;

        if (results.length === 0) {
            this.hideSuggestions();
            return;
        }

        const html = results.map(item => `
            <div class="suggestion-item" data-name="${item.name}">
                <div class="suggestion-category">${item.category}</div>
                <div class="fw-medium">${item.name}</div>
                <div class="text-primary fs-sm">${item.price}</div>
            </div>
        `).join('');

        suggestionsContainer.innerHTML = html;
        suggestionsContainer.classList.add('active');

        // Add click handlers to suggestions
        suggestionsContainer.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                const productName = item.dataset.name;
                this.selectSearchResult(productName);
            });
        });
    }

    selectSearchResult(productName) {
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.value = productName;
        }
        this.hideSuggestions();
        console.log(`Navigating to product: ${productName}`);
    }

    hideSuggestions() {
        const suggestionsContainer = document.querySelector('.search-suggestions');
        if (suggestionsContainer) {
            suggestionsContainer.classList.remove('active');
        }
    }

    // Mega Menu Functionality
    initMegaMenu() {
        const categoriesLink = document.querySelector('[data-mega-menu="categories"]');
        const megaMenu = document.querySelector('.mega-menu');
        let menuTimeout;

        if (!categoriesLink || !megaMenu) return;

        categoriesLink.addEventListener('mouseenter', () => {
            clearTimeout(menuTimeout);
            megaMenu.classList.add('active');
        });

        categoriesLink.addEventListener('mouseleave', () => {
            menuTimeout = setTimeout(() => {
                megaMenu.classList.remove('active');
            }, 300);
        });

        megaMenu.addEventListener('mouseenter', () => {
            clearTimeout(menuTimeout);
        });

        megaMenu.addEventListener('mouseleave', () => {
            megaMenu.classList.remove('active');
        });
    }

    // Mobile Menu Enhancement
    initMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const nav = document.querySelector('.nav.d-lg-none');
        const overlay = document.querySelector('.mobile-overlay');

        if (!menuToggle || !nav) return;

        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            overlay?.classList.toggle('active');
            menuToggle.classList.toggle('active');
            
            document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
        });

        overlay?.addEventListener('click', () => {
            this.closeMobileMenu();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && nav.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });
    }

    closeMobileMenu() {
        const nav = document.querySelector('.nav.d-lg-none');
        const overlay = document.querySelector('.mobile-overlay');
        const menuToggle = document.querySelector('.menu-toggle');

        nav?.classList.remove('active');
        overlay?.classList.remove('active');
        menuToggle?.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Scroll Effects & Animations
    initScrollEffects() {
        // Reveal animations on scroll
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            // Observe elements with .reveal class
            document.querySelectorAll('.reveal').forEach(el => {
                observer.observe(el);
            });
        }

        // Parallax effect for hero sections
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.parallax');
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }

    // Filter System
    initFilters() {
        // Collapsible filter groups
        document.querySelectorAll('.filter-toggle').forEach(toggle => {
            toggle.addEventListener('click', () => {
                const content = toggle.nextElementSibling;
                const isActive = toggle.classList.contains('active');

                toggle.classList.toggle('active');
                content?.classList.toggle('active');
            });
        });
    }

    // Enhanced Animations
    initAnimations() {
        // Stagger animations for product grids
        this.staggerAnimations('.product-grid .product-card', 100);
        this.staggerAnimations('.feature-grid .feature-item', 150);

        // Add hover animations to interactive elements
        document.querySelectorAll('.card, .btn, .tag').forEach(element => {
            if (!element.classList.contains('hover-lift') && 
                !element.classList.contains('hover-scale')) {
                element.classList.add('hover-scale-sm');
            }
        });
    }

    staggerAnimations(selector, delay) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, index) => {
            element.style.animationDelay = `${index * delay}ms`;
            element.classList.add('animate-fade-in-up');
        });
    }

    // Lazy Loading Enhancement
    initLazyLoading() {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.classList.add('img-fade-in');
                        
                        img.addEventListener('load', () => {
                            img.classList.add('loaded');
                        });
                        
                        imageObserver.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }

    // Keyboard Navigation
    initKeyboardNavigation() {
        // Product card keyboard navigation
        document.querySelectorAll('.product-card').forEach(card => {
            card.setAttribute('tabindex', '0');
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const link = card.querySelector('a') || card.querySelector('button');
                    if (link) link.click();
                }
            });
        });
    }

    // Utility Methods
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="fw-medium">${message}</div>
            <button class="btn-close" onclick="this.parentElement.remove()">×</button>
        `;

        const container = document.querySelector('.toast-container') || this.createToastContainer();
        container.appendChild(toast);

        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);

        // Auto remove after 5 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }

    createToastContainer() {
        const container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
        return container;
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    window.techDealsApp = new TechDealsApp();
    console.log('TechDeals Enhanced App Initialized');

    // Product filtering and sorting functionality
    const filterForm = document.querySelector('.filters');
    const productsGrid = document.querySelector('.grid');
    let products = []; // Will store all products

    // Fetch products from JSON
    fetch('/data/products.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            renderProducts(products);
        });

    // Filter products based on criteria
    function filterProducts() {
        const minPrice = document.querySelector('input[placeholder="Min"]').value;
        const maxPrice = document.querySelector('input[placeholder="Max"]').value;
        const selectedBrands = [...document.querySelectorAll('.form-check-input:checked')]
            .map(input => input.id.replace('brand-', ''));

        let filtered = products;

        // Price filter
        if (minPrice) {
            filtered = filtered.filter(p => p.price >= parseInt(minPrice));
        }
        if (maxPrice) {
            filtered = filtered.filter(p => p.price <= parseInt(maxPrice));
        }

        // Brand filter
        if (selectedBrands.length) {
            filtered = filtered.filter(p => selectedBrands.includes(p.brand.toLowerCase()));
        }

        renderProducts(filtered);
    }

    // Sort products
    document.getElementById('sort').addEventListener('change', (e) => {
        const sortBy = e.target.value;
        let sorted = [...products];

        switch(sortBy) {
            case 'Price: Low to High':
                sorted.sort((a, b) => a.price - b.price);
                break;
            case 'Price: High to Low':
                sorted.sort((a, b) => b.price - a.price);
                break;
            case 'Best Rated':
                sorted.sort((a, b) => b.rating - a.rating);
                break;
            case 'Newest First':
                sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
        }

        renderProducts(sorted);
    });

    // Apply filters button
    document.querySelector('.btn-block').addEventListener('click', filterProducts);

    // Render products to grid
    function renderProducts(productsToRender) {
        productsGrid.innerHTML = productsToRender.map(product => `
            <a href="product.html?id=${product.id}" class="card product-card">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                <img src="${product.image}" alt="${product.name}" class="card-image" loading="lazy">
                <div class="card-body">
                    <h3 class="card-title">${product.name}</h3>
                    <div class="rating mb-sm">
                        ${getRatingStars(product.rating)}
                        <small class="text-muted">(${product.reviews})</small>
                    </div>
                    <p class="card-text">${product.description}</p>
                    <div class="product-price">
                        $${product.price}
                        ${product.oldPrice ? `<span class="product-price-old">$${product.oldPrice}</span>` : ''}
                    </div>
                    <button class="btn btn-primary btn-block mt-md" 
                            onclick="trackAffiliate('${product.affiliateLink}')">View Deal</button>
                </div>
            </a>
        `).join('');
    }

    // Generate rating stars
    function getRatingStars(rating) {
        return Array(5).fill('').map((_, i) => 
            `<span class="rating-star ${i < rating ? 'filled' : 'empty'}">★</span>`
        ).join('');
    }

    // Track affiliate clicks
    window.trackAffiliate = (link) => {
        // Analytics tracking
        gtag('event', 'affiliate_click', {
            'event_category': 'Affiliate',
            'event_label': link
        });
        // Open affiliate link in new tab
        window.open(link, '_blank');
    }
});

// Lazy loading for images
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
});

// Mobile responsiveness improvements
const mobileMenu = () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav:not(.desktop-only)');
    const overlay = document.querySelector('.mobile-overlay');
    
    if (menuToggle && nav && overlay) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
        
        overlay.addEventListener('click', () => {
            nav.classList.remove('active');
            overlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    }
};

// Initialize mobile menu
mobileMenu();
