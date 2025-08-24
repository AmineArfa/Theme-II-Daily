(function () {
    pagination(true);
})();

// Live ticker functionality
document.addEventListener('DOMContentLoaded', function() {
    const ticker = document.querySelector('.gh-live-ticker');
    if (!ticker) return;

    const track = ticker.querySelector('.gh-live-ticker-track');
    if (!track) return;

    let items = [];

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

        // Create a continuous string of all breaking news items
        const newsItems = posts.map(post => 
            `<span class="gh-live-ticker-time">${post.time}</span> ${post.title}`
        ).join(' • • • ');

        // Create the scrolling item
        const item = document.createElement('div');
        item.className = 'gh-live-ticker-item';
        item.innerHTML = newsItems + ' • • • ' + newsItems; // Duplicate for seamless loop

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

        // Show next item
        currentIndex = (currentIndex + 1) % items.length;
        const nextItem = track.children[currentIndex];
        if (nextItem) {
            nextItem.classList.add('is-active');
        }
    }

    // Function to start the ticker
    function startTicker() {
        if (items.length <= 1) return;

        intervalId = setInterval(showNextItem, 5000); // Change every 5 seconds
    }

    // Function to stop the ticker
    function stopTicker() {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    // Initialize ticker
    async function initTicker() {
        items = await fetchLatestPosts();

        if (items.length === 0) return;

        // Clear existing items
        track.innerHTML = '';

        // Create new items
        items.forEach((post, index) => {
            const item = createTickerItem(post, index);
            track.appendChild(item);
        });

        // Show first item
        if (track.children.length > 0) {
            track.children[0].classList.add('is-active');
        }

        // Start rotation if we have multiple items
        if (items.length > 1) {
            startTicker();
        }
    }

    // Pause on hover
    ticker.addEventListener('mouseenter', stopTicker);
    ticker.addEventListener('mouseleave', () => {
        if (items.length > 1) {
            startTicker();
        }
    });

    // Initialize
    initTicker();

    // Refresh every 5 minutes
    setInterval(initTicker, 5 * 60 * 1000);
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