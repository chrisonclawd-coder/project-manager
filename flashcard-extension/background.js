// Article-to-Flashcards - Background Service Worker

console.log('Article-to-Flashcards background script loaded');

// Listen for extension installation
chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason === 'install') {
        console.log('Extension installed');
        // Initialize storage
        initializeStorage();
    } else if (details.reason === 'update') {
        console.log('Extension updated');
    }
});

function initializeStorage() {
    chrome.storage.local.set({
        flashcards: [],
        settings: {
            apiKey: '',
            template: 'simple',
            autoSave: true
        },
        stats: {
            totalFlashcards: 0,
            studied: 0,
            lastStudied: null
        }
    }, function() {
        console.log('Storage initialized');
    });
}

// Listen for messages from popup and content scripts
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'getFlashcards') {
        chrome.storage.local.get(['flashcards'], function(result) {
            sendResponse({flashcards: result.flashcards || []});
        });
        return true; // Keep message channel open for async response
    }

    if (request.action === 'saveFlashcards') {
        chrome.storage.local.get(['flashcards'], function(result) {
            const flashcards = result.flashcards || [];
            const newFlashcards = [...flashcards, ...request.flashcards];
            chrome.storage.local.set({flashcards: newFlashcards}, function() {
                sendResponse({success: true, total: newFlashcards.length});
            });
        });
        return true;
    }

    if (request.action === 'clearFlashcards') {
        chrome.storage.local.set({flashcards: []}, function() {
            sendResponse({success: true});
        });
        return true;
    }

    if (request.action === 'getStats') {
        chrome.storage.local.get(['stats'], function(result) {
            sendResponse({stats: result.stats || {totalFlashcards: 0, studied: 0, lastStudied: null}});
        });
        return true;
    }
});

// Listen for web requests to extract article content
chrome.webRequest.onCompleted.addListener(
    function(details) {
        // This could be used to auto-detect article URLs
        // For now, it's a placeholder
        console.log('Web request completed:', details.url);
    },
    {urls: ['<all_urls>']}
);

// Listen for history changes
chrome.history.onVisited.addListener(function(details) {
    console.log('History visited:', details.url);
});
