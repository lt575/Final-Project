
const express = require('express');
const User = require('./models.js');


const authController = {
 
  async signup(req, res) {
    try {
      const { name, username,  email } = req.body;
      const existingUser = await User.findOne({
        $or: [{ email , username}]
      });

      if (existingUser) {
        return res.status(400).json({
          message: 'User with this email already exists'
        });
      }
      const newUser = new User({
        name,
        email,
        username,
      });

      await newUser.save();

      res.status(201).json({
        message: 'User created successfully',
       
      });

    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ message: 'Server error during signup' });
    }
  },

  async login(req, res) {
    try {
      const { email, username } = req.body;
     
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      if (
        user.username &&
        user.username.toLowerCase().trim() !==
          username.toLowerCase().trim()
      ) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      res.status(200).json({ message: 'login successfully' });;

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error during login' });
    }
  }
};

const authRoutes = express.Router();
authRoutes.post('/signup', authController.signup);
authRoutes.post('/login', authController.login);

module.exports = {authRoutes}
