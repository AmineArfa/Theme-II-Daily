(function () {
    pagination(true);
})();

// Live ticker functionality
(function() {
    const ticker = document.getElementById('liveTickerTrack');
    if (!ticker) return;
    
    // Clone items for seamless scrolling
    const items = Array.from(ticker.children);
    items.forEach(item => {
        const clone = item.cloneNode(true);
        ticker.appendChild(clone);
    });
    
    // Pause animation on hover
    ticker.addEventListener('mouseenter', function() {
        this.style.animationPlayState = 'paused';
    });
    
    ticker.addEventListener('mouseleave', function() {
        this.style.animationPlayState = 'running';
    });
    
    // Smooth scroll reset when animation completes
    ticker.addEventListener('animationiteration', function() {
        this.style.transform = 'translateX(100%)';
    });
})();

(function () {
    if (!document.body.classList.contains('post-template')) return;

    const cover = document.querySelector('.gh-cover');
    if (!cover) return;

    const image = cover.querySelector('.gh-cover-image');

    window.addEventListener('load', function () {
        cover.style.setProperty('--cover-height', image.clientWidth * image.naturalHeight / image.naturalWidth + 'px');
        cover.classList.remove('loading');
    });
})();
