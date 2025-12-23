// Dynamic blog post loader for blog.html
(function() {
    // Load and render blog posts from JSON
    async function loadBlogPosts() {
        try {
            const response = await fetch('blog-posts.json');
            const blogPosts = await response.json();
            
            const blogGrid = document.querySelector('.blog-grid');
            if (!blogGrid) {
                console.error('Blog grid container not found');
                return;
            }
            
            // Clear existing content
            blogGrid.innerHTML = '';
            
            // Generate HTML for each blog post
            blogPosts.forEach(post => {
                const article = document.createElement('article');
                article.className = 'blog-card';
                article.onclick = () => window.location.href = post.url;
                
                const tagsHTML = post.tags.map(tag => 
                    `<span class="blog-tag">${tag}</span>`
                ).join('');
                
                article.innerHTML = `
                    <div class="blog-image">${post.icon}</div>
                    <div class="blog-content">
                        <div class="blog-meta">
                            <span>${post.date}</span>
                            <span>•</span>
                            <span>${post.readingTime}</span>
                        </div>
                        <h2>${post.title}</h2>
                        <p>${post.description}</p>
                        <div>${tagsHTML}</div>
                        <a href="${post.url}" class="read-more">Read More →</a>
                    </div>
                `;
                
                blogGrid.appendChild(article);
            });
            
            console.log(`✅ Loaded ${blogPosts.length} blog posts`);
        } catch (error) {
            console.error('Error loading blog posts:', error);
        }
    }
    
    // Load posts when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadBlogPosts);
    } else {
        loadBlogPosts();
    }
})();
