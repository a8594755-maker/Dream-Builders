document.addEventListener('DOMContentLoaded', () => {

    /* ── Mobile Navigation ── */
    const hamburger = document.querySelector('.hamburger');
    const navMenu   = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        document.querySelectorAll('.nav-link').forEach(link =>
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            })
        );
    }

    /* ── Gallery Album Tabs ── */
    const albumBtns = document.querySelectorAll('.album-btn');
    const albums    = document.querySelectorAll('.album');

    albumBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.album;
            albumBtns.forEach(b => b.classList.remove('active'));
            albums.forEach(a => a.classList.remove('active'));
            btn.classList.add('active');
            const target = document.getElementById(id);
            if (target) target.classList.add('active');
        });
    });

    /* ── Scroll-reveal animation ── */
    const reveal = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('revealed');
                reveal.unobserve(e.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll(
        '.progress-card, .goal-card, .gallery-item, .lesson-item, ' +
        '.funding-item, .support-option, .partner-section, .doc-card'
    ).forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(16px)';
        el.style.transition = 'opacity .5s ease, transform .5s ease';
        reveal.observe(el);
    });

    /* ── Broken-image fallback ── */
    document.querySelectorAll('.image-placeholder img').forEach(img => {
        img.addEventListener('error', function () {
            this.style.display = 'none';
            const ph = this.nextElementSibling;
            if (ph && ph.classList.contains('placeholder-content')) ph.style.display = 'flex';
        });
        if (img.complete && img.naturalWidth === 0) img.dispatchEvent(new Event('error'));
    });

    /* ── External links open in new tab ── */
    document.querySelectorAll('a[href^="http"]').forEach(a => {
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
    });
});

/* Revealed-state class (used by IntersectionObserver) */
const revealStyle = document.createElement('style');
revealStyle.textContent = '.revealed { opacity: 1 !important; transform: translateY(0) !important; }';
document.head.appendChild(revealStyle);
