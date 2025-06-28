document.addEventListener('DOMContentLoaded', () => {
    const productDetailContainer = document.getElementById('product-detail-container');
    const relatedProductsGrid = document.getElementById('related-products-grid');
    const relatedProductsSection = document.getElementById('related-products-section');

    const getProductId = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    };

    const fetchProducts = async () => {
        try {
            const response = await fetch('/data/products.json');
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch products:', error);
            productDetailContainer.innerHTML = '<p class="error">Failed to load product data. Please try again later.</p>';
            return null;
        }
    };

    const renderProduct = (product, allProducts) => {
        if (!product) {
            productDetailContainer.innerHTML = '<p class="error">Product not found.</p>';
            return;
        }

        // Update metadata
        document.title = `${product.name} - Review & Best Prices | TechDeals`;
        document.querySelector('meta[name="description"]').setAttribute('content', product.meta_description);

        // Render product details
        productDetailContainer.innerHTML = `
            <div class="container">
                <nav aria-label="Breadcrumb">
                    <ul class="breadcrumb">
                        <li class="breadcrumb-item"><a href="index.html">Home</a></li>
                        <li class="breadcrumb-item"><a href="categories.html">Categories</a></li>
                        <li class="breadcrumb-item"><a href="category-detail.html?category=${product.category}">${product.category}</a></li>
                        <li class="breadcrumb-item active">${product.name}</li>
                    </ul>
                </nav>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-xl">
                    <!-- Image Gallery -->
                    <div class="gallery">
                        <div class="gallery-main">
                            <img src="${product.images[0]}" alt="${product.name}" id="main-image" class="fade-in">
                        </div>
                        <div class="gallery-thumbs">
                            ${product.images.map((img, index) => `
                                <img src="${img}" alt="${product.name} thumbnail ${index + 1}" class="gallery-thumb ${index === 0 ? 'active' : ''}" onclick="changeImage('${img}')">
                            `).join('')}
                        </div>
                    </div>

                    <!-- Product Info -->
                    <div>
                        <span class="badge badge-info">${product.brand}</span>
                        <h1>${product.name}</h1>
                        <div class="flex items-center gap-md mb-lg">
                            <div class="rating">
                                ${getRatingStars(product.rating)}
                            </div>
                            <a href="#reviews" class="text-muted">(${product.reviews_count} reviews)</a>
                            <span class="badge ${product.in_stock ? 'badge-success' : 'badge-danger'}">
                                ${product.in_stock ? 'In Stock' : 'Out of Stock'}
                            </span>
                        </div>
                        <p class="lead mb-xl">${product.short_description}</p>
                        
                        <!-- Price Box -->
                        <div class="price-box card">
                            <div class="card-body">
                                <div class="price-header">
                                    <div class="price-current">
                                        <span class="price-label">Best Price</span>
                                        <span class="price-amount">$${product.price}</span>
                                        ${product.old_price ? `<span class="price-old">$${product.old_price}</span>` : ''}
                                    </div>
                                    <div class="price-badge">
                                        <span class="badge badge-warning">-${calculateDiscount(product.price, product.old_price)}%</span>
                                    </div>
                                </div>
                                <a href="${product.affiliate_link}" class="btn btn-primary btn-lg btn-block ripple" target="_blank" rel="noopener noreferrer" data-affiliate>
                                    Get This Deal
                                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
                                </a>
                                <p class="text-small text-muted text-center mt-sm">via ${product.vendor}</p>
                            </div>
                        </div>
                        
                        <!-- Key Features -->
                        <div class="key-features mt-xl">
                            <h3 class="mb-md">Key Features</h3>
                            <ul>
                                ${product.key_features.map(feature => `<li>${feature}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- Tabs for details -->
                <div class="tabs-container mt-3xl">
                    <div class="tab-list" role="tablist">
                        <button class="tab-item active" role="tab" aria-selected="true" aria-controls="tab-specs">Specifications</button>
                        <button class="tab-item" role="tab" aria-selected="false" aria-controls="tab-review">Expert Review</button>
                        <button class="tab-item" role="tab" aria-selected="false" aria-controls="tab-compare">Compare Prices</button>
                    </div>
                    <div id="tab-specs" class="tab-panel active" role="tabpanel">
                        <table class="specs-table">
                            ${Object.entries(product.specifications).map(([key, value]) => `
                                <tr>
                                    <td>${key.replace(/_/g, ' ')}</td>
                                    <td>${value}</td>
                                </tr>
                            `).join('')}
                        </table>
                    </div>
                    <div id="tab-review" class="tab-panel" role="tabpanel">
                        ${product.expert_review}
                    </div>
                    <div id="tab-compare" class="tab-panel" role="tabpanel">
                        <table class="specs-table">
                            ${product.price_comparison.map(item => `
                                <tr>
                                    <td><strong>${item.vendor}</strong></td>
                                    <td>$${item.price}</td>
                                    <td>${item.shipping}</td>
                                    <td><a href="${item.link}" class="btn btn-secondary btn-sm" target="_blank" rel="noopener noreferrer">View Deal</a></td>
                                </tr>
                            `).join('')}
                        </table>
                    </div>
                </div>
            </div>
        `;

        renderRelatedProducts(product, allProducts);
        initTabs();
    };

    const renderRelatedProducts = (currentProduct, allProducts) => {
        const related = allProducts.filter(p => p.category === currentProduct.category && p.id !== currentProduct.id).slice(0, 4);
        
        if (related.length > 0) {
            relatedProductsGrid.innerHTML = related.map(product => `
                <a href="product.html?id=${product.id}" class="card product-card">
                    <img src="${product.images[0]}" alt="${product.name}" class="card-image" loading="lazy">
                    <div class="card-body">
                        <h4 class="card-title">${product.name}</h4>
                        <div class="rating mb-sm">
                            ${getRatingStars(product.rating)}
                        </div>
                        <div class="product-price">$${product.price}</div>
                    </div>
                </a>
            `).join('');
            relatedProductsSection.style.display = 'block';
        }
    };

    const init = async () => {
        const productId = getProductId();
        if (!productId) {
            productDetailContainer.innerHTML = '<p class="error">No product specified.</p>';
            return;
        }

        const productsData = await fetchProducts();
        if (productsData) {
            const product = productsData.products.find(p => p.id === productId);
            renderProduct(product, productsData.products);
        }
    };

    init();
});

function getRatingStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<span class="rating-star ${i <= rating ? 'filled' : 'empty'}">★</span>`;
    }
    return stars;
}

function calculateDiscount(price, oldPrice) {
    if (!oldPrice || oldPrice <= price) return 0;
    return Math.round(((oldPrice - price) / oldPrice) * 100);
}

function changeImage(src) {
    const mainImage = document.getElementById('main-image');
    mainImage.classList.remove('fade-in');
    setTimeout(() => {
        mainImage.src = src;
        mainImage.classList.add('fade-in');
    }, 100);
    
    // Update active thumbnail
    document.querySelectorAll('.gallery-thumb').forEach(thumb => {
        thumb.classList.toggle('active', thumb.src === src);
    });
}

function initTabs() {
    const tabList = document.querySelector('.tab-list');
    const tabItems = document.querySelectorAll('.tab-item');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabList.addEventListener('click', e => {
        if (e.target.matches('.tab-item')) {
            // Deactivate all
            tabItems.forEach(tab => tab.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));

            // Activate clicked
            e.target.classList.add('active');
            const targetPanel = document.getElementById(e.target.getAttribute('aria-controls'));
            targetPanel.classList.add('active');
        }
    });
} 