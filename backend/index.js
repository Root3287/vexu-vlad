import express from 'express';
import pool from './db.js'
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

// Determines if the database is connected or not
app.get('/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'connected' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', db: 'disconnected' });
  }
});

app.listen(PORT, () => {
  console.log(`VLAD backend running on http://localhost:${PORT}`);
});

async function checkServer() {
  try {
    const result = await fetch(`http://localhost:${PORT}/health`);
    const data = await result.json();
    
    if (data.status === 'ok' && data.db === 'connected') {
      console.log('Connected.');
    } else {
      console.log('Could not connect to database.', data);
    }
  } catch (err) {
    console.error('Could not connect to server.', err.message);
  }
}

// Checks the status of the server at runtime
checkServer();
// Checks the status of the server every 10 seconds
setInterval(checkServer, 10000);