const { neon } = require('@neondatabase/serverless');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error_msg: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error_msg: 'Email and password are required' });
    }

    const sql = neon(process.env.DATABASE_URL);

    const users = await sql`SELECT id, password_hash FROM users WHERE email = ${email}`;

    if (users.length === 0) {
      return res.status(401).json({ error_msg: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(password, users[0].password_hash);
    if (!match) {
      return res.status(401).json({ error_msg: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { email },
      JWT_SECRET,
      { expiresIn: '30d' },
    );

    return res.status(200).json({ jwt_token: token });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error_msg: 'Login failed' });
  }
};
