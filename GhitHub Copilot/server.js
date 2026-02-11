const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Data Storage (in-memory, can be replaced with database)
let users = {};

// Quote Database
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
    }
];

// =============== API Routes ===============

// 1. GET - Random Quote
app.get('/api/quote', (req, res) => {
    try {
        const { category } = req.query;
        let filteredQuotes = quotes;

        if (category && category !== 'all') {
            filteredQuotes = quotes.filter(q => q.category === category);
        }

        if (filteredQuotes.length === 0) {
            return res.status(404).json({ error: 'No quotes found for this category' });
        }

        const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
        res.json({
            success: true,
            quote: randomQuote
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// 2. GET - All Quotes
app.get('/api/quotes', (req, res) => {
    try {
        const { category } = req.query;
        let filteredQuotes = quotes;

        if (category && category !== 'all') {
            filteredQuotes = quotes.filter(q => q.category === category);
        }

        res.json({
            success: true,
            count: filteredQuotes.length,
            quotes: filteredQuotes
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// 3. POST - Add Favorite
app.post('/api/favorites', (req, res) => {
    try {
        const { userId, quote } = req.body;

        if (!userId || !quote) {
            return res.status(400).json({ error: 'Missing userId or quote' });
        }

        if (!users[userId]) {
            users[userId] = {
                favorites: [],
                viewCount: 0
            };
        }

        const exists = users[userId].favorites.some(fav => fav.text === quote.text);
        if (exists) {
            return res.status(400).json({ error: 'Quote already in favorites' });
        }

        users[userId].favorites.push(quote);
        res.json({
            success: true,
            message: 'Quote added to favorites',
            favoritesCount: users[userId].favorites.length
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// 4. GET - User Favorites
app.get('/api/favorites/:userId', (req, res) => {
    try {
        const { userId } = req.params;

        if (!users[userId]) {
            return res.json({
                success: true,
                favorites: []
            });
        }

        res.json({
            success: true,
            count: users[userId].favorites.length,
            favorites: users[userId].favorites
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// 5. DELETE - Remove Favorite
app.delete('/api/favorites/:userId/:quoteIndex', (req, res) => {
    try {
        const { userId, quoteIndex } = req.params;

        if (!users[userId]) {
            return res.status(404).json({ error: 'User not found' });
        }

        const index = parseInt(quoteIndex);
        if (index < 0 || index >= users[userId].favorites.length) {
            return res.status(400).json({ error: 'Invalid quote index' });
        }

        users[userId].favorites.splice(index, 1);
        res.json({
            success: true,
            message: 'Quote removed from favorites',
            favoritesCount: users[userId].favorites.length
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// 6. POST - Track View
app.post('/api/track-view', (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'Missing userId' });
        }

        if (!users[userId]) {
            users[userId] = {
                favorites: [],
                viewCount: 0
            };
        }

        users[userId].viewCount++;
        res.json({
            success: true,
            viewCount: users[userId].viewCount
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// 7. GET - User Stats
app.get('/api/stats/:userId', (req, res) => {
    try {
        const { userId } = req.params;

        if (!users[userId]) {
            return res.json({
                success: true,
                viewCount: 0,
                favoritesCount: 0
            });
        }

        res.json({
            success: true,
            viewCount: users[userId].viewCount,
            favoritesCount: users[userId].favorites.length
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// 8. GET - All Categories
app.get('/api/categories', (req, res) => {
    try {
        const categories = [...new Set(quotes.map(q => q.category))];
        res.json({
            success: true,
            categories
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// 9. POST - Create User Session
app.post('/api/users', (req, res) => {
    try {
        const userId = `user_${Date.now()}`;
        users[userId] = {
            favorites: [],
            viewCount: 0,
            createdAt: new Date()
        };

        res.json({
            success: true,
            userId,
            message: 'User session created'
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// 10. GET - Health Check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date()
    });
});

// Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Quote Generator Server running on http://localhost:${PORT}`);
});