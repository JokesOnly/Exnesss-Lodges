// Quote Data with Categories
const quotes = [
    {
        text: "The only way to do great work is to love what you do.",
        author: "Steve Jobs",
        category: "motivation"
    },
    {
        text: "Innovation distinguishes between a leader and a follower.",
        author: "Steve Jobs",
        category: "success"
    },
    {
        text: "Life is what happens when you're busy making other plans.",
        author: "John Lennon",
        category: "life"
    },
    {
        text: "The future belongs to those who believe in the beauty of their dreams.",
        author: "Eleanor Roosevelt",
        category: "courage"
    },
    {
        text: "It is during our darkest moments that we must focus to see the light.",
        author: "Aristotle",
        category: "wisdom"
    },
    {
        text: "The only impossible journey is the one you never begin.",
        author: "Tony Robbins",
        category: "motivation"
    },
    {
        text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        author: "Winston Churchill",
        category: "success"
    },
    {
        text: "Believe you can and you're halfway there.",
        author: "Theodore Roosevelt",
        category: "motivation"
    },
    {
        text: "The best time to plant a tree was 20 years ago. The second best time is now.",
        author: "Chinese Proverb",
        category: "wisdom"
    },
    {
        text: "Don't let yesterday take up too much of today.",
        author: "Will Rogers",
        category: "life"
    },
    {
        text: "You learn more from failure than from success.",
        author: "Unknown",
        category: "success"
    },
    {
        text: "It's not whether you get knocked down, it's whether you get up.",
        author: "Vince Lombardi",
        category: "courage"
    },
    {
        text: "The way to get started is to quit talking and begin doing.",
        author: "Walt Disney",
        category: "motivation"
    },
    {
        text: "Don't watch the clock; do what it does. Keep going.",
        author: "Sam Levenson",
        category: "success"
    },
    {
        text: "The only limit to our realization of tomorrow is our doubts of today.",
        author: "Franklin D. Roosevelt",
        category: "courage"
    },
    {
        text: "Everything you want is on the other side of fear.",
        author: "George Addair",
        category: "courage"
    },
    {
        text: "Believe in yourself. You are braver than you think, more talented than you know, and capable of more than you imagine.",
        author: "Roy T. Bennett",
        category: "motivation"
    },
    {
        text: "I learned that courage was not the absence of fear, but the triumph over it.",
        author: "Nelson Mandela",
        category: "courage"
    },
    {
        text: "The only thing we have to fear is fear itself.",
        author: "Franklin D. Roosevelt",
        category: "wisdom"
    },
    {
        text: "Success usually comes to those who are too busy to be looking for it.",
        author: "Henry David Thoreau",
        category: "success"
    }
];

let currentQuote = null;
let viewCount = 0;
let favorites = [];
let currentCategory = "all";

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    updateStats();
    setActiveNav();
});

// Local Storage Functions
function loadFromLocalStorage() {
    const stored = localStorage.getItem('quoteData');
    if (stored) {
        const data = JSON.parse(stored);
        viewCount = data.viewCount || 0;
        favorites = data.favorites || [];
    }
}

function saveToLocalStorage() {
    const data = {
        viewCount,
        favorites
    };
    localStorage.setItem('quoteData', JSON.stringify(data));
}

// Get Quote
function getQuote() {
    const loading = document.getElementById('loading');
    const quoteBox = document.getElementById('quoteBox');

    if (loading) loading.style.display = 'block';
    if (quoteBox) quoteBox.style.opacity = '0.5';

    setTimeout(() => {
        let filteredQuotes = quotes;

        if (currentCategory !== 'all') {
            filteredQuotes = quotes.filter(q => q.category === currentCategory);
        }

        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        currentQuote = filteredQuotes[randomIndex];

        if (loading) loading.style.display = 'none';
        if (quoteBox) {
            quoteBox.innerHTML = `
                <p class="quote-text">"${currentQuote.text}"</p>
                <p class="quote-author">- ${currentQuote.author}</p>
                <p class="quote-category">${currentQuote.category.charAt(0).toUpperCase() + currentQuote.category.slice(1)}</p>
            `;
            quoteBox.style.opacity = '1';
        }

        viewCount++;
        updateStats();
        saveToLocalStorage();
    }, 500);
}

// Add to Favorites
function addToFavorites() {
    if (!currentQuote) {
        alert('Please get a quote first!');
        return;
    }

    const exists = favorites.some(fav => fav.text === currentQuote.text);
    if (exists) {
        alert('This quote is already in your favorites!');
        return;
    }

    favorites.push(currentQuote);
    saveToLocalStorage();
    alert('✅ Quote added to favorites!');
}

// Copy Quote
function copyQuote() {
    if (!currentQuote) {
        alert('Please get a quote first!');
        return;
    }

    const fullQuote = `"${currentQuote.text}" - ${currentQuote.author}`;
    navigator.clipboard.writeText(fullQuote).then(() => {
        alert('📋 Quote copied to clipboard!');
    }).catch(() => {
        alert('Failed to copy quote');
    });
}

// Share Quote
function shareQuote() {
    if (!currentQuote) {
        alert('Please get a quote first!');
        return;
    }

    const fullQuote = `"${currentQuote.text}" - ${currentQuote.author}`;
    if (navigator.share) {
        navigator.share({
            title: 'Check out this quote!',
            text: fullQuote
        });
    } else {
        alert('Sharing: ' + fullQuote);
    }
}

// Filter by Category
function filterByCategory() {
    const select = document.getElementById('categoryFilter');
    currentCategory = select.value;
    getQuote();
}

// Update Stats
function updateStats() {
    const viewCount_el = document.getElementById('viewCount');
    const favCount_el = document.getElementById('favCount');

    if (viewCount_el) viewCount_el.textContent = viewCount;
    if (favCount_el) favCount_el.textContent = favorites.length;
}

// Toggle Theme
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

// Load Theme
window.addEventListener('load', () => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
    }
});

// Set Active Nav
function setActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage || 
            (currentPage === '' && link.getAttribute('href') === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Display Favorites (for favorites.html)
function displayFavorites() {
    const container = document.getElementById('favoritesContainer');
    if (!container) return;

    if (favorites.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h2>No Favorites Yet</h2>
                <p>Start adding quotes to your favorites!</p>
                <a href="index.html" class="btn btn-primary" style="display: inline-block; margin-top: 20px; text-decoration: none;">Go to Home</a>
            </div>
        `;
        return;
    }

    container.innerHTML = favorites.map((quote, index) => `
        <div class="favorite-item">
            <div class="favorite-text">
                <p>"${quote.text}"</p>
                <small>- ${quote.author}</small>
            </div>
            <div class="favorite-actions">
                <button class="btn-small btn-delete" onclick="removeFavorite(${index})">Delete</button>
            </div>
        </div>
    `).join('');
}

// Remove Favorite
function removeFavorite(index) {
    favorites.splice(index, 1);
    saveToLocalStorage();
    displayFavorites();
}