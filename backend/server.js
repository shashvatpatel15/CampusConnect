require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Production readiness configs
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Add basic security headers
app.use(helmet());

// Apply rate limiting to all requests
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 500, // Limit each IP to 500 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    message: { message: "Too many requests from this IP, please try again in 15 minutes" }
});

app.use(limiter);

// Request logging (useful for debugging)
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        if (process.env.NODE_ENV !== 'production') {
            console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
        }
    });
    next();
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const workshopRoutes = require('./routes/workshopRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const userRoutes = require('./routes/userRoutes');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/workshops', workshopRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), uptime: process.uptime() });
});

// Base route for testing
app.get('/', (req, res) => {
    res.json({
        name: 'Workshop Hub API',
        version: '1.0.0',
        status: 'running',
        endpoints: {
            auth: '/api/auth',
            workshops: '/api/workshops',
            registrations: '/api/registrations',
            users: '/api/users',
            health: '/api/health'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err.stack);
    res.status(500).json({
        message: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message || 'Something broke inside the backend!'
    });
});

app.listen(PORT, () => {
    console.log(`\n🚀 Workshop Hub API running on http://localhost:${PORT}`);
    console.log(`📋 Health check: http://localhost:${PORT}/api/health\n`);
});
