// Article-to-Flashcards - Popup Script

document.addEventListener('DOMContentLoaded', function() {
    const urlInput = document.getElementById('articleUrl');
    const createBtn = document.getElementById('createFlashcards');
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const errorMessage = document.getElementById('errorMessage');
    const flashcardsDiv = document.getElementById('flashcards');
    const flashcardList = document.getElementById('flashcardList');
    const totalFlashcards = document.getElementById('totalFlashcards');
    const studiedCount = document.getElementById('studiedCount');

    // Load saved flashcards from storage
    loadFlashcards();

    // Event listeners
    createBtn.addEventListener('click', generateFlashcards);
    urlInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            generateFlashcards();
        }
    });

    // Export buttons
    document.getElementById('exportAnki').addEventListener('click', exportToAnki);
    document.getElementById('exportCSV').addEventListener('click', exportToCSV);
    document.getElementById('exportQuizlet').addEventListener('click', exportToQuizlet);

    // Template buttons
    document.querySelectorAll('.btn-template').forEach(btn => {
        btn.addEventListener('click', function() {
            const template = this.dataset.template;
            applyTemplate(template);
        });
    });

    function generateFlashcards() {
        const url = urlInput.value.trim();

        if (!url) {
            showError('Please enter an article URL');
            return;
        }

        // Show loading
        loading.style.display = 'block';
        error.style.display = 'none';
        flashcardsDiv.style.display = 'none';

        // Send message to content script to extract article content
        chrome.tabs.query({active: true, currentTab: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: 'extractContent'}, function(response) {
                if (chrome.runtime.lastError) {
                    showError('Failed to extract article content');
                    loading.style.display = 'none';
                    return;
                }

                if (response && response.content) {
                    fetchFlashcardsFromGemini(response.content);
                } else {
                    showError('No content extracted from article');
                    loading.style.display = 'none';
                }
            });
        });
    }

    async function fetchFlashcardsFromGemini(articleContent) {
        try {
            // Call Gemini API to generate flashcards
            const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=GEMINI_API_KEY', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        role: 'user',
                        parts: [{
                            text: `Extract key concepts and create flashcards from this article. Format as JSON array:
[
  {
    "question": "Question here",
    "answer": "Answer here",
    "type": "simple" or "multiple-choice"
  }
]

Create 10 flashcards maximum. Focus on the most important concepts.`
                        }]
                    }]
                })
            });

            const data = await response.json();
            const flashcards = parseFlashcardsFromGemini(data);

            if (flashcards && flashcards.length > 0) {
                displayFlashcards(flashcards);
                saveFlashcards(flashcards);
            } else {
                showError('Failed to generate flashcards');
            }

            loading.style.display = 'none';
        } catch (error) {
            showError('Error calling Gemini API: ' + error.message);
            loading.style.display = 'none';
        }
    }

    function parseFlashcardsFromGemini(geminiResponse) {
        try {
            // Gemini response might be in different formats
            let text = '';

            if (geminiResponse.candidates && geminiResponse.candidates[0]) {
                text = geminiResponse.candidates[0].content.parts[0].text;
            }

            // Try to extract JSON from the response
            const jsonMatch = text.match(/\[.*\]/s);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }

            return [];
        } catch (error) {
            console.error('Error parsing flashcards:', error);
            return [];
        }
    }

    function displayFlashcards(flashcards) {
        flashcardList.innerHTML = '';
        flashcardsDiv.style.display = 'block';

        flashcards.forEach((flashcard, index) => {
            const card = document.createElement('div');
            card.className = 'flashcard';
            card.dataset.index = index;

            const questionDiv = document.createElement('div');
            questionDiv.className = 'card-question';
            questionDiv.textContent = flashcard.question || `Question ${index + 1}`;

            const answerDiv = document.createElement('div');
            answerDiv.className = 'card-answer';
            answerDiv.textContent = flashcard.answer || 'Answer hidden';

            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'toggle-btn';
            toggleBtn.textContent = 'Show Answer';
            toggleBtn.addEventListener('click', function() {
                if (answerDiv.style.display === 'none') {
                    answerDiv.style.display = 'block';
                    toggleBtn.textContent = 'Hide Answer';
                } else {
                    answerDiv.style.display = 'none';
                    toggleBtn.textContent = 'Show Answer';
                }
            });

            const studyBtn = document.createElement('button');
            studyBtn.className = 'study-btn';
            studyBtn.textContent = 'Study Now';
            studyBtn.addEventListener('click', function() {
                studyFlashcard(index);
            });

            card.appendChild(questionDiv);
            card.appendChild(answerDiv);
            card.appendChild(toggleBtn);
            card.appendChild(studyBtn);
            flashcardList.appendChild(card);
        });

        totalFlashcards.textContent = flashcards.length;
    }

    function studyFlashcard(index) {
        const flashcard = getFlashcard(index);
        if (flashcard) {
            chrome.tabs.create({url: chrome.runtime.getURL('study.html')});
        }
    }

    function getFlashcard(index) {
        const flashcards = loadFlashcards();
        return flashcards[index] || null;
    }

    function loadFlashcards() {
        return JSON.parse(localStorage.getItem('flashcards') || '[]');
    }

    function saveFlashcards(flashcards) {
        const currentFlashcards = loadFlashcards();
        const newFlashcards = [...currentFlashcards, ...flashcards];
        localStorage.setItem('flashcards', JSON.stringify(newFlashcards));
    }

    function exportToAnki() {
        const flashcards = loadFlashcards();
        let ankiContent = '# Article-to-Flashcards\n\n';

        flashcards.forEach((flashcard, index) => {
            ankiContent += `## Card ${index + 1}\n\n`;
            ankiContent += `:::${flashcard.question || `Question ${index + 1}`}\n\n`;
            ankiContent += `:::${flashcard.answer || `Answer ${index + 1}`}\n\n`;
            ankiContent += '---\n\n';
        });

        downloadFile(ankiContent, 'flashcards.anki', 'text/plain');
    }

    function exportToCSV() {
        const flashcards = loadFlashcards();
        let csvContent = 'Question,Answer\n';

        flashcards.forEach((flashcard, index) => {
            csvContent += `"${flashcard.question || `Question ${index + 1}`}","${flashcard.answer || `Answer ${index + 1}`}"\n`;
        });

        downloadFile(csvContent, 'flashcards.csv', 'text/csv');
    }

    function exportToQuizlet() {
        const flashcards = loadFlashcards();
        let quizletContent = JSON.stringify(flashcards);

        downloadFile(quizletContent, 'flashcards.json', 'application/json');
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

    function showError(message) {
        errorMessage.textContent = message;
        error.style.display = 'block';
    }

    function applyTemplate(template) {
        // Apply template to flashcards (simple implementation)
        console.log('Applying template:', template);
    }
});
