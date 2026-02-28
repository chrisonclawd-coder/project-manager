// Article-to-Flashcards - Content Script
// Injected into web pages to extract article content

console.log('Article-to-Flashcards content script loaded');

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'extractContent') {
        const content = extractArticleContent();
        sendResponse({content: content});
    }
});

function extractArticleContent() {
    // Use Readability to extract article content
    const article = extractArticleContentFromDOM();

    return {
        title: article.title,
        content: article.content,
        url: window.location.href,
        text: article.textContent,
        meta: {
            description: article.metaDescription,
            keywords: article.keywords,
            author: article.author
        }
    };
}

function extractArticleContentFromDOM() {
    try {
        // Get the main content area
        const mainContent = document.querySelector('main, article, .content, .article, #content, #main');
        if (!mainContent) {
            // Fallback to body if no main content found
            return {
                title: document.title,
                content: document.body.textContent,
                text: document.body.textContent,
                metaDescription: document.querySelector('meta[name="description"]')?.content || '',
                keywords: document.querySelector('meta[name="keywords"]')?.content || '',
                author: document.querySelector('meta[name="author"]')?.content || ''
            };
        }

        // Extract title (look for H1, or first H2)
        const title = document.querySelector('h1')?.textContent ||
                     mainContent.querySelector('h1')?.textContent ||
                     document.title;

        // Extract text content
        const text = mainContent.textContent;

        // Extract meta tags
        const metaDescription = document.querySelector('meta[name="description"]')?.content || '';
        const keywords = document.querySelector('meta[name="keywords"]')?.content || '';
        const author = document.querySelector('meta[name="author"]')?.content || '';

        return {
            title: title,
            content: text,
            text: text,
            metaDescription: metaDescription,
            keywords: keywords,
            author: author
        };
    } catch (error) {
        console.error('Error extracting article content:', error);
        return {
            title: document.title,
            content: document.body.textContent,
            text: document.body.textContent,
            metaDescription: document.querySelector('meta[name="description"]')?.content || '',
            keywords: document.querySelector('meta[name="keywords"]')?.content || '',
            author: document.querySelector('meta[name="author"]')?.content || ''
        };
    }
}

// Expose function globally for debugging
window.extractArticleContent = extractArticleContent;
