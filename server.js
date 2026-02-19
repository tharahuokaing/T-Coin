import express from 'express';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import crypto from 'crypto';
import rateLimit from 'express-rate-limit';
import cors from 'cors';

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'tcoin_master_key_2026';
const AES_KEY = crypto.scryptSync('dutyfree_security', 'salt', 32); 
const AES_IV_LENGTH = 16;

/**
 * IN-MEMORY DATA STORE
 * Replaces SQL for maximum speed and "index.html only" compatibility.
 * Note: Data will reset if the server restarts.
 */
const wallets = new Map(); // Stores userId -> balance
const transactions = [];   // Stores encrypted transaction objects

// AES-256 Encryption for Audit Logs
function encryptLog(plainText) {
  const iv = crypto.randomBytes(AES_IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', AES_KEY, iv);
  let encrypted = cipher.update(plainText, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return iv.toString('base64') + ':' + encrypted;
}

const app = express();
app.use(bodyParser.json());
app.use(cors({
  origin: ['https://tharahuokaing.github.io'],
  credentials: true
}));

// Rate limiting to prevent bot attacks
app.use(rateLimit({ windowMs: 1000, max: 20 }));

// JWT Auth Middleware
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Auth required' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Session expired' });
    req.user = user;
    next();
  });
}

// --- T-COIN ROUTES ---

// Simulated Login: Creates a wallet in memory
app.post('/login', (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId required' });
  
  if (!wallets.has(userId)) wallets.set(userId, 0);
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, userId, balance: wallets.get(userId) });
});

// Get Balance
app.get('/balance', authenticateToken, (req, res) => {
  res.json({ balance: wallets.get(req.user.userId) || 0 });
});

// Universal Transaction Engine (Deposit, Withdraw, Transfer)
app.post('/execute', authenticateToken, (req, res) => {
  const { userId } = req.user;
  const { type, amount, targetId } = req.body; // type: 'deposit', 'withdraw', 'transfer'

  if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });

  let currentBalance = wallets.get(userId) || 0;

  try {
    if (type === 'deposit') {
      currentBalance += amount;
    } 
    else if (type === 'withdraw') {
      if (currentBalance < amount) return res.status(400).json({ error: 'Insufficient funds' });
      currentBalance -= amount;
    } 
    else if (type === 'transfer') {
      if (!targetId) return res.status(400).json({ error: 'Recipient required' });
      if (currentBalance < amount) return res.status(400).json({ error: 'Insufficient funds' });
      
      // Execute P2P Transfer in Memory
      const recipientBalance = wallets.get(targetId) || 0;
      wallets.set(targetId, recipientBalance + amount);
      currentBalance -= amount;
    }

    // Update Ledger
    wallets.set(userId, currentBalance);

    // Encrypt Audit Trail
    const logEntry = encryptLog(JSON.stringify({ userId, type, amount, targetId, date: new Date() }));
    transactions.push({ id: transactions.length, data: logEntry });

    res.json({ status: 'success', balance: currentBalance });
  } catch (err) {
    res.status(500).json({ error: 'Transaction failed' });
  }
});

app.get('/health', (req, res) => res.json({ status: 'online', users: wallets.size }));

app.listen(PORT, () => console.log(`T-Coin In-Memory Ledger active on port ${PORT}`));
