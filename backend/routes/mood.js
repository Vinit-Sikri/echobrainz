const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const CheckIn = require('../models/CheckIn');
const User = require('../models/User');
const Token = require('../models/Token');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data'); // Make sure this line is present

// Configure multer for audio uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/audio';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const fileTypes = /webm|mp3|wav|ogg|m4a/; // Added m4a for broader support
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Audio files only!');
    }
  }
});

// @route   POST api/mood/analyze-voice
// @desc    Analyze voice recording
// @access  Private
router.post('/analyze-voice', auth, upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No audio file uploaded' });
    }

    const audioPath = req.file.path;

    // Call Python AI service to analyze audio
    const formData = new FormData();
    formData.append('audio', fs.createReadStream(audioPath));
    
    // **FIX: Added Authorization header to the request to the AI service.**
    const response = await axios.post(`${process.env.AI_SERVICE_URL}/analyze-voice`, formData, {
      headers: {
        // This forwards the user's login token to the AI service
        'Authorization': req.headers.authorization,
        // This lets the form-data library set the correct Content-Type with boundary
        ...formData.getHeaders()
      }
    });

    // Clean up the uploaded file after analysis
    fs.unlinkSync(audioPath);

    res.json(response.data);
  } catch (err) {
    // Log the actual error from Axios if it exists
    console.error('Error analyzing voice:', err.response ? err.response.data : err.message);
    res.status(500).json({ message: 'Error analyzing voice recording' });
  }
});

// @route   POST api/mood/analyze-text
// @desc    Analyze text sentiment
// @access  Private
router.post('/analyze-text', auth, async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ message: 'Text is required' });
    }

    // **FIX: Added Authorization header to the request to the AI service.**
    const response = await axios.post(`${process.env.AI_SERVICE_URL}/analyze-text`, { text }, {
        headers: {
            'Authorization': req.headers.authorization
        }
    });
    
    res.json(response.data);
  } catch (err) {
    console.error('Error analyzing text:', err.response ? err.response.data : err.message);
    res.status(500).json({ message: 'Error analyzing text' });
  }
});

// @route   POST api/mood/check-in
// @desc    Save mood check-in
// @access  Private
router.post('/check-in', auth, async (req, res) => {
  try {
    const { 
      mood, 
      moodScore, 
      energyLevel, 
      emotionalState, 
      detectedEmotions, 
      sentimentScore, 
      method,
      text
    } = req.body;
    
    const newCheckIn = new CheckIn({
      user: req.user.id,
      mood,
      moodScore,
      energyLevel,
      emotionalState,
      detectedEmotions,
      sentimentScore,
      method,
      text: text || null
    });
    
    const checkIn = await newCheckIn.save();
    
    const user = await User.findById(req.user.id);
    
    let tokensToAward = 0;
    let tokenDescription = '';
    
    if (!user.streak.lastCheckIn) {
      user.streak.count = 1;
      user.streak.lastCheckIn = new Date();
      user.streak.plantLevel = 'sprout';
      tokensToAward = 10;
      tokenDescription = 'First check-in';
    } else {
      const lastCheckIn = new Date(user.streak.lastCheckIn);
      const today = new Date();
      lastCheckIn.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((today - lastCheckIn) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        user.streak.count += 1;
        user.streak.lastCheckIn = new Date();
        
        if (user.streak.count >= 14) user.streak.plantLevel = 'tree';
        else if (user.streak.count >= 7) user.streak.plantLevel = 'flower';
        else if (user.streak.count >= 3) user.streak.plantLevel = 'leaf';
        
        const streakMilestones = { 3: 15, 7: 25, 14: 50, 30: 100 };
        if (streakMilestones[user.streak.count]) {
          tokensToAward = streakMilestones[user.streak.count];
          tokenDescription = `${user.streak.count}-day streak milestone`;
        } else {
          tokensToAward = 5;
          tokenDescription = `Day ${user.streak.count} streak`;
        }
      } else if (diffDays > 1) {
        user.streak.count = 1;
        user.streak.lastCheckIn = new Date();
        user.streak.plantLevel = 'sprout';
        tokensToAward = 2;
        tokenDescription = 'Returned for check-in';
      }
    }
    
    if (tokensToAward > 0) {
      if (!user.tokens) {
        user.tokens = { balance: 0, lifetime: 0, lastUpdated: new Date() };
      }
      user.tokens.balance += tokensToAward;
      user.tokens.lifetime += tokensToAward;
      user.tokens.lastUpdated = new Date();
      
      const newToken = new Token({
        user: req.user.id,
        amount: tokensToAward,
        type: 'earned',
        source: 'streak',
        description: tokenDescription
      });
      await newToken.save();
    }
    
    await user.save();
    
    // **FIX: Added Authorization header to the request to the AI service.**
    axios.post(`${process.env.AI_SERVICE_URL}/generate-recommendations`, {
      userId: req.user.id,
      mood,
      moodScore,
      energyLevel,
      emotionalState,
      detectedEmotions
    }, {
        headers: {
            'Authorization': req.headers.authorization
        }
    }).catch(err => console.error('Error generating recommendations:', err.response ? err.response.data : err.message));
    
    res.json({
      checkIn,
      streak: user.streak,
      tokensAwarded: tokensToAward > 0 ? {
        amount: tokensToAward,
        reason: tokenDescription,
        newBalance: user.tokens.balance
      } : null
    });
  } catch (err) {
    console.error('Error saving check-in:', err);
    res.status(500).json({ message: 'Error saving check-in' });
  }
});

// @route   GET api/mood/history
// @desc    Get user's mood history
// @access  Private
router.get('/history', auth, async (req, res) => {
  try {
    const checkIns = await CheckIn.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    
    res.json(checkIns);
  } catch (err) {
    console.error('Error fetching mood history:', err);
    res.status(500).json({ message: 'Error fetching mood history' });
  }
});

module.exports = router;
