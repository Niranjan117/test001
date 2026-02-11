/**
 * Project Sentinel API Server
 * Handles user authentication, session management, and real-time WebSocket communication
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const WebSocket = require('ws');
const http = require('http');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (replaces MongoDB)
const users = [];
const sessions = [];
let userIdCounter = 1;
let sessionIdCounter = 1;

/**
 * JWT Authentication middleware
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'sentinel_secret', (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

/**
 * User Authentication Routes
 */

// User registration
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        
        // Check if user exists
        const existingUser = users.find(u => u.email === email || u.username === username);
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create user
        const user = {
            id: userIdCounter++,
            username,
            email,
            password: hashedPassword,
            role: role || 'trainee',
            createdAt: new Date(),
            lastLogin: null
        };

        users.push(user);
        
        // Generate token
        const token = jwt.sign(
            { userId: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET || 'sentinel_secret',
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: { id: user.id, username: user.username, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// User login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Find user
        const user = users.find(u => u.username === username);
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Update last login
        user.lastLogin = new Date();

        // Generate token
        const token = jwt.sign(
            { userId: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET || 'sentinel_secret',
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: { id: user.id, username: user.username, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Session Management Routes
 */

// Create new session
app.post('/api/sessions', authenticateToken, async (req, res) => {
    try {
        const { sessionName, scenario } = req.body;
        
        const session = {
            id: sessionIdCounter++,
            userId: req.user.userId,
            sessionName,
            scenario,
            startTime: new Date(),
            endTime: null,
            duration: null,
            sensorData: [],
            performanceScore: null,
            feedback: null,
            isActive: true
        };

        sessions.push(session);
        res.status(201).json({ message: 'Session created', session });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user sessions
app.get('/api/sessions', authenticateToken, async (req, res) => {
    try {
        const userSessions = sessions
            .filter(s => s.userId === req.user.userId)
            .map(s => ({ ...s, sensorData: undefined })) // Exclude large sensor data for list view
            .sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
        
        res.json({ sessions: userSessions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get specific session with full data
app.get('/api/sessions/:id', authenticateToken, async (req, res) => {
    try {
        const session = sessions.find(s => 
            s.id === parseInt(req.params.id) && s.userId === req.user.userId
        );
        
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }
        
        res.json({ session });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// End session
app.put('/api/sessions/:id/end', authenticateToken, async (req, res) => {
    try {
        const session = sessions.find(s => 
            s.id === parseInt(req.params.id) && s.userId === req.user.userId
        );
        
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        session.endTime = new Date();
        session.duration = Math.floor((session.endTime - session.startTime) / 1000);
        session.isActive = false;
        
        res.json({ message: 'Session ended', session });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * WebSocket Server for Real-time Communication
 */
const wss = new WebSocket.Server({ server, path: '/ws' });
const clients = new Set();
let currentSession = null;

wss.on('connection', (ws, req) => {
    console.log('New WebSocket connection established');
    clients.add(ws);

    ws.on('message', async (message) => {
        try {
            const data = JSON.parse(message);
            
            // Handle different message types
            switch (data.type) {
                case 'sensor_data':
                    // Store sensor data in current active session
                    if (currentSession) {
                        const session = sessions.find(s => s.id === currentSession);
                        if (session) {
                            session.sensorData.push(data.payload);
                        }
                    }
                    
                    // Broadcast to all connected clients
                    broadcast(JSON.stringify({
                        type: 'live_sensor_data',
                        data: data.payload
                    }));
                    break;
                    
                case 'start_session':
                    currentSession = data.sessionId;
                    broadcast(JSON.stringify({
                        type: 'session_started',
                        sessionId: currentSession
                    }));
                    break;
                    
                case 'end_session':
                    currentSession = null;
                    broadcast(JSON.stringify({
                        type: 'session_ended'
                    }));
                    break;
            }
        } catch (error) {
            console.error('WebSocket message error:', error);
        }
    });

    ws.on('close', () => {
        clients.delete(ws);
        console.log('WebSocket connection closed');
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        clients.delete(ws);
    });
});

/**
 * Broadcast message to all connected WebSocket clients
 */
function broadcast(message) {
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        connections: clients.size 
    });
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Project Sentinel API Server running on port ${PORT}`);
    console.log(`WebSocket server available at ws://localhost:${PORT}/ws`);
});