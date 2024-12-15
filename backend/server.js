const express = require('express');
const cors = require('cors'); // Import cors package
const path = require('path');
const uuid = require('uuid').v4;
const app = express();
const PORT = 5000;

let storage = {};

// Middleware
app.use(express.json());
app.use(cors()); // Add this line to allow CORS

// Endpoint to store text and generate code
app.post('/store', (req, res) => {
  const code = uuid().slice(0, 6).toLowerCase();
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: 'Text is required' });
  }

  // Store the text with the generated code
  storage[code] = text;
  res.json({ code });
});

// Endpoint to retrieve text by code
app.get('/retrieve/:code', (req, res) => {
  const code = req.params.code.toLowerCase();
  if (storage[code]) {
    res.json({ text: storage[code] });
  } else {
    res.status(404).json({ message: 'Code not found' });
  }
});

// Serve the React frontend
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));

  // For any route, serve the React app
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));