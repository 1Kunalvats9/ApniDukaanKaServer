import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const router = express.Router();

// Register User
router.post('/register', async (req, res) => {
  try {
    const {
      shopName,
      ownerName,
      email,
      password,
      location,
      category,
      phoneNumber,
    } = req.body;

    if (!shopName || !ownerName || !email || !password || !location || !category || !phoneNumber) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      shopName,
      ownerName,
      email,
      password: hashedPassword,
      location,
      category,
      phoneNumber,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', user: newUser });

  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password)
        return res.status(400).json({ error: 'Email and password are required' });
  
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
  
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });
  
      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      console.error('Login Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
export default router