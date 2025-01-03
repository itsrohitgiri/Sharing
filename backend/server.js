const express = require('express');
const cors = require('cors');
const uuid = require('uuid').v4;

const app = express();
const PORT = process.env.PORT || 5000;

let storage = {}; // Temporary storage; use a database for production

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // Restrict CORS to frontend URL (you can replace '*' with your frontend's URL on Vercel)
  methods: ['GET', 'POST'],
}));

// Endpoint to store text and generate code with expiration
app.post('/store', (req, res) => {
  const code = uuid().slice(0, 6).toLowerCase();
  const { text, duration } = req.body;

  if (!text) {
    return res.status(400).json({ message: 'Text is required' });
  }

  if (![1, 2, 5, 10].includes(duration)) {
    return res.status(400).json({ message: 'Invalid duration. Allowed: 1, 2, 5, or 10 minutes.' });
  }

  // Store the text with the generated code
  storage[code] = { text };

  // Set a timeout to delete the code after 'duration' minutes
  setTimeout(() => {
    delete storage[code];
    console.log(`Code ${code} has expired and been removed.`);
  }, duration * 60 * 1000); // Convert minutes to milliseconds

  res.json({ code, expiresIn: `${duration} minutes` });
});

// Endpoint to retrieve text by code
app.get('/retrieve/:code', (req, res) => {
  const code = req.params.code.toLowerCase();
  if (storage[code]) {
    res.json({ text: storage[code].text });
  } else {
    res.status(404).json({ message: 'Code not found' });
  }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
