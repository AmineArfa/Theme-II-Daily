(function () {
    pagination(true);
})();

// Live ticker functionality
(function() {
    const tickerTrack = document.getElementById('liveTickerTrack');
    const ticker = document.getElementById('liveTicker');
    if (!tickerTrack) return;

    const items = tickerTrack.querySelectorAll('.gh-live-ticker-item');
    if (items.length <= 1) return;

    let currentItem = 0;
    let tickerInterval;

    const cycleItems = () => {
        items[currentItem].classList.remove('is-active');
        currentItem = (currentItem + 1) % items.length;
        items[currentItem].classList.add('is-active');
    };

    const startTicker = () => {
        // Cycle every 5 seconds
        tickerInterval = setInterval(cycleItems, 5000);
    };

    const stopTicker = () => {
        clearInterval(tickerInterval);
    };

    ticker.addEventListener('mouseenter', stopTicker);
    ticker.addEventListener('mouseleave', startTicker);

    startTicker();
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