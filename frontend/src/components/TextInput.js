import { useState } from 'react';
import axios from 'axios';

const TextInput = ({ onGenerateCode }) => {
  const [text, setText] = useState('');
  const [duration, setDuration] = useState(1); // Default duration is 1 minute
  const [error, setError] = useState('');

  // Get the backend URL from the environment variable
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleDurationChange = (e) => {
    setDuration(parseInt(e.target.value)); // Convert to integer
  };

  const handleSubmit = async () => {
    if (!text) {
      setError('Text is required');
      return;
    }

    if (![1, 2, 5, 10].includes(duration)) {
      setError('Invalid duration. Allowed: 1, 2, 5, or 10 minutes.');
      return;
    }

    try {
      // Use axios to send a POST request to store the text
      const response = await axios.post(
        `${BACKEND_URL}/store`, // Use the backend URL from the .env file
        { text },
        {
          headers: {
            'Content-Type': 'application/json', // Ensure the content type is JSON
          },
        }
      );

      // If the request is successful, handle the response and pass the code to the parent component
      onGenerateCode(response.data.code);
      setError('');
    } catch (error) {
      console.error('Error:', error);
      setError('There was an error generating the code. Please try again.');
    }
  };

  return (
    <div>
      <textarea
        value={text}
        placeholder="Enter text here"
        onChange={handleTextChange}
        rows={4}
        style={{ width: '100%', marginBottom: '10px' }}
      />
      
      <div>
        <label htmlFor="duration">Code Duration (in minutes): </label>
        <select
          id="duration"
          value={duration}
          onChange={handleDurationChange}
          style={{ marginLeft: '10px' }}
        >
          <option value={1}>1 Minute</option>
          <option value={2}>2 Minutes</option>
          <option value={5}>5 Minutes</option>
          <option value={10}>10 Minutes</option>
        </select>
      </div>

      <button onClick={handleSubmit} style={{ marginTop: '10px' }}>
        Generate Code
      </button>

      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </div>
  );
};

export default TextInput;
