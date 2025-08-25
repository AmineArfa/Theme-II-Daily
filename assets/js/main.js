(function () {
    pagination(true);
})();

// Live ticker functionality
document.addEventListener('DOMContentLoaded', function () {
    const ticker = document.querySelector('.gh-live-ticker');
    if (!ticker) return;

    const tickerTrack = document.getElementById('liveTickerTrack');
    if (!tickerTrack) return;

    let items = tickerTrack.querySelectorAll('.gh-live-ticker-item');
    if (items.length <= 1) return;

    let currentItem = 0;
    let tickerInterval;

    const cycleItems = () => {
        items[currentItem].classList.remove('is-active');
        currentItem = (currentItem + 1) % items.length;
        items[currentItem].classList.add('is-active');
    };

    const startTicker = () => {
        // Stop any existing interval to prevent duplicates
        clearInterval(tickerInterval);
        // Cycle every 5 seconds
        tickerInterval = setInterval(cycleItems, 5000);
    };

    const stopTicker = () => {
        clearInterval(tickerInterval);
    };

    const initializeTicker = async () => {
        try {
            const response = await fetch('/ghost/api/v3/content/posts/?key=' + (window.ghostAPIKey || '') + '&filter=tag:live&limit=10&fields=title,published_at,url&order=published_at%20desc');
            const data = await response.json();

            if (data.posts && data.posts.length > 0) {
                tickerTrack.innerHTML = data.posts.map((post, index) => `
                    <a href="${post.url}" class="gh-live-ticker-item${index === 0 ? ' is-active' : ''}">
                        <span class="gh-live-ticker-time">${new Date(post.published_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        <h3 class="gh-live-ticker-headline">${post.title}</h3>
                    </a>
                `).join('');

                // Re-select items after updating HTML
                items = tickerTrack.querySelectorAll('.gh-live-ticker-item');
                if (items.length > 1) {
                    currentItem = 0;
                    startTicker();
                }
            } else {
                ticker.style.display = 'none'; // Hide ticker if no live posts
            }
        } catch (error) {
            console.error('Could not fetch live posts:', error);
            ticker.style.display = 'none'; // Hide ticker on API error
        }
    };

    ticker.addEventListener('mouseenter', stopTicker);
    ticker.addEventListener('mouseleave', startTicker);

    // Initial load and set refresh interval
    initializeTicker();
    setInterval(initializeTicker, 300000); // Refresh every 5 minutes
});

// Live Banner Auto-refresh functionality
document.addEventListener('DOMContentLoaded', function() {
    const liveBanners = document.querySelectorAll('.gh-live-banner');
    if (liveBanners.length === 0) return;

    async function refreshLiveBanner() {
        try {
            const response = await fetch('/ghost/api/v3/content/posts/?key=' + (window.ghostAPIKey || '') + '&filter=tag:live&limit=10&fields=title,published_at,url,excerpt&order=published_at%20desc');
            const data = await response.json();

            if (data.posts && data.posts.length > 0) {
                liveBanners.forEach(banner => {
                    const content = banner.querySelector('.gh-live-banner-content');
                    if (content) {
                        const newContent = data.posts.map(post => `
                            <article class="gh-live-banner-item">
                                <a href="${post.url}" class="gh-live-banner-link">
                                    <time class="gh-live-banner-time" datetime="${new Date(post.published_at).toISOString().split('T')[0]}">${new Date(post.published_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</time>
                                    <h4 class="gh-live-banner-headline">${post.title}</h4>
                                    ${post.excerpt ? `<p class="gh-live-banner-excerpt">${post.excerpt.split(' ').slice(0, 15).join(' ')}...</p>` : ''}
                                </a>
                            </article>
                        `).join('');
                        
                        content.innerHTML = newContent;
                    }
                });
            }
        } catch (error) {
            console.log('Could not refresh live banner:', error);
        }
    }

    // Refresh live banner every 3 minutes
    setInterval(refreshLiveBanner, 180000);
});

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