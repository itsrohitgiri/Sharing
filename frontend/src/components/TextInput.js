import { useState } from 'react';
import axios from 'axios';

const TextInput = ({ onGenerateCode }) => {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmit = async () => {
    if (!text) {
      setError('Text is required');
      return;
    }

    try {
      // Use axios to send a POST request to store the text
      const response = await axios.post('http://localhost:5000/store', {
        text,
      }, {
        headers: {
          'Content-Type': 'application/json',  // Ensure the content type is JSON
        },
      });

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
      <textarea value={text} placeholder='enter text' onChange={handleTextChange}></textarea>
      <button onClick={handleSubmit}>Generate Code</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default TextInput;