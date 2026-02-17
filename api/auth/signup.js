const { neon } = require('@neondatabase/serverless');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const SALT_ROUNDS = 10;

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
    const { username, phone, email, password } = req.body || {};

    if (!username || !phone || !email || !password) {
      return res.status(400).json({
        error_msg: 'Username, phone, email and password are required',
      });
    }

    if (username.length < 3) {
      return res.status(400).json({ error_msg: 'Username must be at least 3 characters' });
    }

    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      return res.status(400).json({ error_msg: 'Please enter a valid phone number (at least 10 digits)' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error_msg: 'Please enter a valid email address' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error_msg: 'Password must be at least 6 characters' });
    }

    const sql = neon(process.env.DATABASE_URL);

    const existingEmail = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existingEmail.length > 0) {
      return res.status(400).json({ error_msg: 'Email already registered' });
    }

    const existingUsername = await sql`SELECT id FROM users WHERE username = ${username}`;
    if (existingUsername.length > 0) {
      return res.status(400).json({ error_msg: 'Username already taken' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    await sql`INSERT INTO users (username, phone, email, password_hash) VALUES (${username}, ${phone}, ${email}, ${passwordHash})`;

    const token = jwt.sign(
      { email },
      JWT_SECRET,
      { expiresIn: '30d' },
    );

    return res.status(201).json({ jwt_token: token });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ error_msg: 'Registration failed' });
  }
};
