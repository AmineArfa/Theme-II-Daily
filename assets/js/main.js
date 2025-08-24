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

            return {
                title: title ? title.textContent : '',
                time: time ? time.textContent : new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                url: '#',
                excerpt: ''
            };
        });
    }

    // Function to create continuous scrolling content
    function createScrollingContent(posts) {
        if (posts.length === 0) return;

        // Clear existing content
        track.innerHTML = '';

        // Create a continuous string of all breaking news items with proper spacing
        const newsItems = posts.map(post => 
            `<span class="gh-live-ticker-time">${post.time}</span> ${post.title}`
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