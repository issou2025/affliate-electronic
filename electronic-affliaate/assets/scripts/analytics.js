// Google Analytics 4 Configuration
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-XXXXXXXXXX'); // Replace with your GA4 tracking ID

// Custom Analytics for Affiliate Links
class AffiliateTracker {
    constructor() {
        this.init();
    }

    init() {
        // Track all affiliate link clicks
        document.addEventListener('click', (e) => {
            const affiliateLink = e.target.closest('[data-affiliate]');
            if (affiliateLink) {
                this.trackAffiliateClick(affiliateLink);
            }
        });

        // Track filter usage
        const filters = document.querySelectorAll('.filters input, .filters select');
        filters.forEach(filter => {
            filter.addEventListener('change', () => {
                this.trackFilterUsage(filter);
            });
        });

        // Track search queries
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('change', () => {
                this.trackSearch(searchInput.value);
            });
        }
    }

    trackAffiliateClick(link) {
        const productData = {
            id: link.dataset.productId,
            name: link.dataset.productName,
            price: link.dataset.productPrice,
            brand: link.dataset.productBrand,
            category: link.dataset.productCategory
        };

        // Send to Google Analytics
        gtag('event', 'affiliate_click', {
            'event_category': 'Affiliate',
            'event_label': productData.name,
            'value': productData.price,
            'items': [productData]
        });

        // Store in local analytics
        this.storeLocalAnalytics('affiliate_click', productData);

        // Send to custom backend if needed
        this.sendToBackend('affiliate_click', productData);
    }

    trackFilterUsage(filter) {
        gtag('event', 'filter_use', {
            'event_category': 'Engagement',
            'event_label': filter.name,
            'value': filter.value
        });
    }

    trackSearch(query) {
        gtag('event', 'search', {
            'event_category': 'Engagement',
            'event_label': query
        });
    }

    storeLocalAnalytics(eventType, data) {
        const analytics = JSON.parse(localStorage.getItem('analytics') || '{}');
        if (!analytics[eventType]) {
            analytics[eventType] = [];
        }
        analytics[eventType].push({
            timestamp: new Date().toISOString(),
            data: data
        });
        localStorage.setItem('analytics', JSON.stringify(analytics));
    }

    sendToBackend(eventType, data) {
        fetch('/api/analytics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                eventType,
                data,
                timestamp: new Date().toISOString()
            })
        }).catch(console.error); // Silent fail if backend is not available
    }
}

// Initialize tracker
const tracker = new AffiliateTracker();

// Session tracking
class SessionTracker {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.startTime = new Date();
        this.init();
    }

    init() {
        // Track page views
        this.trackPageView();

        // Track time on page
        window.addEventListener('beforeunload', () => {
            this.trackSessionDuration();
        });

        // Track scroll depth
        this.trackScrollDepth();
    }

    generateSessionId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    trackPageView() {
        gtag('event', 'page_view', {
            'page_title': document.title,
            'page_location': window.location.href,
            'session_id': this.sessionId
        });
    }

    trackSessionDuration() {
        const duration = (new Date() - this.startTime) / 1000; // in seconds
        gtag('event', 'session_duration', {
            'event_category': 'Engagement',
            'value': duration,
            'session_id': this.sessionId
        });
    }

    trackScrollDepth() {
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100;
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                if (maxScroll >= 25 && maxScroll % 25 === 0) { // Track at 25%, 50%, 75%, 100%
                    gtag('event', 'scroll_depth', {
                        'event_category': 'Engagement',
                        'value': maxScroll,
                        'session_id': this.sessionId
                    });
                }
            }
        });
    }
}

// Initialize session tracking
const sessionTracker = new SessionTracker(); 