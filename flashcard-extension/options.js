// Article-to-Flashcards - Options Page Script

document.addEventListener('DOMContentLoaded', function() {
    const apiKeyInput = document.getElementById('apiKey');
    const templateSelect = document.getElementById('template');
    const autoSaveCheckbox = document.getElementById('autoSave');
    const offlineModeCheckbox = document.getElementById('offlineMode');
    const saveSettingsBtn = document.getElementById('saveSettings');
    const exportAllBtn = document.getElementById('exportAll');
    const clearAllBtn = document.getElementById('clearAll');

    // Load saved settings
    loadSettings();

    // Load statistics
    loadStats();

    // Event listeners
    saveSettingsBtn.addEventListener('click', saveSettings);
    exportAllBtn.addEventListener('click', exportAllFlashcards);
    clearAllBtn.addEventListener('click', clearAllData);

    function loadSettings() {
        chrome.storage.local.get(['settings'], function(result) {
            const settings = result.settings || {
                apiKey: '',
                template: 'simple',
                autoSave: true,
                offlineMode: false
            };

            apiKeyInput.value = settings.apiKey || '';
            templateSelect.value = settings.template || 'simple';
            autoSaveCheckbox.checked = settings.autoSave !== false;
            offlineModeCheckbox.checked = settings.offlineMode || false;
        });
    }

    function saveSettings() {
        const settings = {
            apiKey: apiKeyInput.value.trim(),
            template: templateSelect.value,
            autoSave: autoSaveCheckbox.checked,
            offlineMode: offlineModeCheckbox.checked
        };

        chrome.storage.local.set({settings: settings}, function() {
            alert('Settings saved successfully!');
        });
    }

    function loadStats() {
        chrome.storage.local.get(['stats'], function(result) {
            const stats = result.stats || {
                totalFlashcards: 0,
                studied: 0,
                lastStudied: null
            };

            document.getElementById('totalFlashcards').textContent = stats.totalFlashcards || 0;
            document.getElementById('studiedCount').textContent = stats.studied || 0;
            document.getElementById('lastStudied').textContent = stats.lastStudied || 'Never';
        });
    }

    function exportAllFlashcards() {
        chrome.storage.local.get(['flashcards'], function(result) {
            const flashcards = result.flashcards || [];
            let csvContent = 'Question,Answer\n';

            flashcards.forEach((flashcard, index) => {
                csvContent += `"${flashcard.question || `Question ${index + 1}`}","${flashcard.answer || `Answer ${index + 1}`}"\n`;
            });

            downloadFile(csvContent, 'all-flashcards.csv', 'text/csv');
        });
    }

    function clearAllData() {
        if (confirm('Are you sure you want to clear all flashcards and settings? This cannot be undone.')) {
            chrome.storage.local.clear(function() {
                alert('All data cleared successfully!');
                loadStats();
            });
        }
    }

    function downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], {type: mimeType});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
});
