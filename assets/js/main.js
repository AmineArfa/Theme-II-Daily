(function () {
    pagination(true);
})();

// Live ticker functionality
document.addEventListener('DOMContentLoaded', function() {
    const ticker = document.querySelector('.gh-live-ticker');
    if (!ticker) return;

    const track = ticker.querySelector('.gh-live-ticker-track');
    if (!track) return;

    // Function to fetch latest posts from Ghost API
    async function fetchLatestPosts() {
        try {
            // Fetch posts with "live" tag for breaking news
            const response = await fetch('/ghost/api/v3/content/posts/?key=' + (window.ghostAPIKey || '') + '&filter=tag:live&limit=10&fields=title,published_at,url,excerpt&order=published_at%20desc');
            const data = await response.json();

            if (data.posts && data.posts.length > 0) {
                return data.posts.map(post => ({
                    title: post.title,
                    time: new Date(post.published_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                    url: post.url,
                    excerpt: post.excerpt
                }));
            }
        } catch (error) {
            console.log('Could not fetch live posts:', error);
        }

        // Fallback to existing items if API fails
        return Array.from(document.querySelectorAll('.gh-live-ticker-item')).map(item => {
            const time = item.querySelector('.gh-live-ticker-time');
            const title = item.querySelector('.gh-live-ticker-headline');
            const link = item.querySelector('.gh-live-ticker-link');
            return {
                title: title ? title.textContent : '',
                time: time ? time.textContent : new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                url: link ? link.href : '/',
                excerpt: ''
            };
        });
    }

    // Function to create continuous scrolling content
    function createScrollingContent(posts) {
        if (posts.length === 0) return;

        // Clear existing content
        track.innerHTML = '';

        // Create a continuous string of all breaking news items with proper spacing and links
        const newsItems = posts.map(post => 
            `<a href="${post.url}" class="gh-live-ticker-link"><span class="gh-live-ticker-time">${post.time}</span> <h3 class="gh-live-ticker-headline">${post.title}</h3></a>`
        ).join(' • ');

        // Create the scrolling item with seamless looping
        const item = document.createElement('div');
        item.className = 'gh-live-ticker-item';
        // Create seamless loop by duplicating content
        item.innerHTML = newsItems + ' • ' + newsItems;

        track.appendChild(item);
    }

    // Initialize the horizontal scrolling ticker
    async function initializeTicker() {
        const posts = await fetchLatestPosts();
        if (posts && posts.length > 0) {
            createScrollingContent(posts);
        }
    }

    // Start the ticker
    initializeTicker();

    // Refresh ticker content every 5 minutes
    setInterval(initializeTicker, 300000);
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