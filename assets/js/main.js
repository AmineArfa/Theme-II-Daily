(function () {
    pagination(true);
})();

// Live carousel functionality
(function() {
    const carousel = document.getElementById('liveCarousel');
    if (!carousel) return;
    
    // Clone items for seamless loop
    const items = carousel.children;
    const itemsArray = Array.from(items);
    
    // Clone all items and append to create seamless loop
    itemsArray.forEach(item => {
        const clone = item.cloneNode(true);
        carousel.appendChild(clone);
    });
    
    // Pause on hover, resume on mouse leave
    carousel.addEventListener('mouseenter', function() {
        this.style.animationPlayState = 'paused';
    });
    
    carousel.addEventListener('mouseleave', function() {
        this.style.animationPlayState = 'running';
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
