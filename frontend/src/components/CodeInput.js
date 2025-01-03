import { useState } from 'react';
import axios from 'axios';

const CodeInput = ({ onRetrieveText }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [retrievedText, setRetrievedText] = useState(''); // For displaying the retrieved text

  // Get the backend URL from the environment variable
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handleSubmit = async () => {
    if (!code) {
      setError('Code is required');
      return;
    }

    try {
      // Use axios to fetch data from the backend
      const response = await axios.get(`${BACKEND_URL}/retrieve/${code}`);

      // Store the retrieved text
      const text = response.data.text || 'No text found';
      setRetrievedText(text); // Save the retrieved text
      onRetrieveText(text); // Pass the retrieved text to parent component
      setError(''); // Clear any errors
    } catch (error) {
      console.error('Error:', error);
      if (error.response && error.response.status === 404) {
        setError('Error retrieving text. Code may not exist or may have expired.');
      } else {
        setError('There was an issue retrieving the text.');
      }
      setRetrievedText('');    // Clear any previously displayed text
    }
  };

  return (
    <div>
      <div>
        <input
          type="text"
          value={code}
          onChange={handleCodeChange}
          maxLength="6"
          placeholder="Enter code"
        />
        <button onClick={handleSubmit}>Retrieve Text</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>

      {/* Only display retrieved text here with preserved formatting */}
      {retrievedText && (
        <div
          className="retrieved-text"
          style={{
            whiteSpace: 'pre-wrap', // Preserve whitespace and newlines
            wordBreak: 'break-word', // Break long words appropriately
            backgroundColor: '#f5f5f5', // Light background for readability
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            marginTop: '15px',
            fontFamily: 'Courier, monospace', // Monospace font for code-like display
            color: 'black',
            textAlign: 'left', // Ensure text is aligned to the left (not centered)
            overflowX: 'auto', // Ensure horizontal scrolling if needed
          }}
        >
          {retrievedText}
        </div>
      )}
    </div>
  );
};

export default CodeInput;
