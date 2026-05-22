const express = require('express');
const crypto = require('crypto');

const app = express();

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY || 'dev-key';

app.use(express.json());

/**
 * Simple request logger
 */
app.use((req, res, next) => {
    console.log(
        `[${new Date().toISOString()}] ${req.method} ${req.url}`
    );
    next();
});

/**
 * Fake in-memory database
 */
const messages = [];

let requestCounter = 0;

/**
 * Request counter middleware
 */
app.use((req, res, next) => {
    requestCounter++;
    next();
});

/**
 * Home route
 */
app.get('/', (req, res) => {
    res.json({
        success: true,
        app: 'Coolify Advanced Test Server',
        uptimeSeconds: process.uptime(),
        totalRequests: requestCounter,
        currentTime: new Date().toISOString(),
        randomId: crypto.randomUUID()
    });
});

/**
 * Healthcheck
 */
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        memoryUsage: process.memoryUsage(),
        uptime: process.uptime()
    });
});

/**
 * Generate random data
 */
app.get('/random', (req, res) => {
    res.json({
        number: Math.floor(Math.random() * 100000),
        hex: crypto.randomBytes(8).toString('hex'),
        timestamp: Date.now()
    });
});

/**
 * Protected route
 */
app.get('/secret', (req, res) => {
    const providedKey = req.headers['x-api-key'];

    if (providedKey !== API_KEY) {
        return res.status(401).json({
            error: 'Unauthorized'
        });
    }

    res.json({
        secret: '🚀 Coolify rocks',
        server: process.env.HOSTNAME
    });
});

/**
 * Create message
 */
app.post('/messages', (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({
            error: 'Text is required'
        });
    }

    const message = {
        id: crypto.randomUUID(),
        text,
        createdAt: new Date().toISOString()
    };

    messages.push(message);

    res.status(201).json(message);
});

/**
 * Get all messages
 */
app.get('/messages', (req, res) => {
    res.json({
        count: messages.length,
        items: messages
    });
});

/**
 * Delete message
 */
app.delete('/messages/:id', (req, res) => {
    const index = messages.findIndex(
        m => m.id === req.params.id
    );

    if (index === -1) {
        return res.status(404).json({
            error: 'Message not found'
        });
    }

    const deleted = messages.splice(index, 1);

    res.json({
        deleted
    });
});

/**
 * Simulate server error
 */
app.get('/crash', (req, res) => {
    throw new Error('Intentional test crash');
});

/**
 * Global error handler
 */
app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server läuft auf Port ${PORT}`);
});
