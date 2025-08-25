(function () {
    pagination(true);
})();

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