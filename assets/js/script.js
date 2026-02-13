// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
});

// Gallery Album Navigation
document.addEventListener('DOMContentLoaded', function() {
    const albumButtons = document.querySelectorAll('.album-btn');
    const albums = document.querySelectorAll('.album');

    if (albumButtons.length > 0 && albums.length > 0) {
        albumButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetAlbum = this.getAttribute('data-album');
                
                // Remove active class from all buttons and albums
                albumButtons.forEach(btn => btn.classList.remove('active'));
                albums.forEach(album => album.classList.remove('active'));
                
                // Add active class to clicked button and corresponding album
                this.classList.add('active');
                const targetElement = document.getElementById(targetAlbum);
                if (targetElement) {
                    targetElement.classList.add('active');
                }
            });
        });
    }
});

// Smooth Scrolling for Anchor Links
document.addEventListener('DOMContentLoaded', function() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed header
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Form Validation (if forms are added later)
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return true;

    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('error');
            isValid = false;
        } else {
            field.classList.remove('error');
        }
    });

    return isValid;
}

// Add error styling for form validation
const style = document.createElement('style');
style.textContent = `
    .error {
        border-color: #e74c3c !important;
        box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.2) !important;
    }
`;
document.head.appendChild(style);

// Progress Counter Animation (for future use)
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Intersection Observer for Animations
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements that should animate on scroll
    const animateElements = document.querySelectorAll('.progress-card, .goal-card, .gallery-item, .lesson-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Table of Contents Generator (for documentation pages)
function generateTableOfContents() {
    const content = document.querySelector('main');
    if (!content) return;

    const headings = content.querySelectorAll('h2, h3');
    if (headings.length < 2) return;

    const toc = document.createElement('div');
    toc.className = 'table-of-contents';
    toc.innerHTML = '<h3>Table of Contents</h3><ul></ul>';

    const tocList = toc.querySelector('ul');
    
    headings.forEach((heading, index) => {
        if (!heading.id) {
            heading.id = `heading-${index}`;
        }
        
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${heading.id}`;
        a.textContent = heading.textContent;
        a.className = heading.tagName === 'H3' ? 'toc-sub-item' : 'toc-main-item';
        li.appendChild(a);
        tocList.appendChild(li);
    });

    // Insert TOC after the first h2 or at the beginning of main content
    const firstHeading = content.querySelector('h2');
    if (firstHeading) {
        firstHeading.parentNode.insertBefore(toc, firstHeading.nextSibling);
    } else {
        content.insertBefore(toc, content.firstChild);
    }
}

// Generate TOC for documentation pages
if (window.location.pathname.includes('/docs/') || window.location.pathname.includes('/meeting-minutes/')) {
    document.addEventListener('DOMContentLoaded', generateTableOfContents);
}

// Print-friendly styles
window.addEventListener('beforeprint', function() {
    document.body.classList.add('printing');
});

window.addEventListener('afterprint', function() {
    document.body.classList.remove('printing');
});

// Add print styles
const printStyles = document.createElement('style');
printStyles.textContent = `
    @media print {
        .navbar, .hamburger, footer, .cta, .album-nav, .minutes-nav, .docs-nav {
            display: none !important;
        }
        
        .page-header {
            background: none !important;
            color: #000 !important;
            padding: 1rem 0 !important;
        }
        
        .page-header h1,
        .page-header p {
            color: #000 !important;
        }
        
        body {
            font-size: 12pt;
            line-height: 1.4;
        }
        
        h1 { font-size: 18pt; }
        h2 { font-size: 16pt; }
        h3 { font-size: 14pt; }
        
        .card, .lesson-item, .meeting-info, .attendees, .agenda, .discussions, .decisions, .action-items {
            break-inside: avoid;
            page-break-inside: avoid;
        }
        
        .table-container {
            overflow-x: visible;
        }
        
        .gallery-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }
`;
document.head.appendChild(printStyles);

// External link handling
document.addEventListener('DOMContentLoaded', function() {
    const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="' + window.location.hostname + '"])');
    
    externalLinks.forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
        
        // Add external link indicator
        if (!link.querySelector('.external-indicator')) {
            const indicator = document.createElement('span');
            indicator.textContent = ' ↗';
            indicator.className = 'external-indicator';
            indicator.style.fontSize = '0.8em';
            indicator.style.opacity = '0.7';
            link.appendChild(indicator);
        }
    });
});

// Search functionality (for future enhancement)
function initializeSearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search documentation...';
    searchInput.className = 'search-input';
    
    const searchResults = document.createElement('div');
    searchResults.className = 'search-results';
    
    // This is a placeholder for future search functionality
    // Would need to implement actual search logic
}

// Accessibility improvements
document.addEventListener('DOMContentLoaded', function() {
    // Add ARIA labels for better screen reader support
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
        hamburger.setAttribute('aria-label', 'Toggle navigation menu');
        hamburger.setAttribute('aria-expanded', 'false');
        
        hamburger.addEventListener('click', function() {
            const isExpanded = this.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded);
        });
    }
    
    // Add skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Style the skip link
    const skipStyles = document.createElement('style');
    skipStyles.textContent = `
        .skip-link {
            position: absolute;
            top: -40px;
            left: 6px;
            background: #3498db;
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 10000;
        }
        
        .skip-link:focus {
            top: 6px;
        }
    `;
    document.head.appendChild(skipStyles);
});

// Error handling for broken images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            if (this.nextElementSibling && this.nextElementSibling.classList.contains('placeholder-content')) {
                this.nextElementSibling.style.display = 'flex';
            }
        });
    });
});

// Console message for development
console.log('Dream Builders website loaded successfully!');
console.log('If you need help with the website, check the documentation or contact the development team.');
