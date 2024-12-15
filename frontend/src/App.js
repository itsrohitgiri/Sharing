import { useState } from "react";
import TextInput from "./components/TextInput";
import CodeInput from "./components/CodeInput";
import Navbar from "./components/Navbar";
import "./App.css"; // Import the styles file

const App = () => {
  const [generatedCode, setGeneratedCode] = useState("");
  const [retrievedText, setRetrievedText] = useState("");

  const handleGeneratedCode = (code) => {
    setGeneratedCode(code);
  };

  const handleRetrievedText = (text) => {
    setRetrievedText(text);
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <h2>Generate a Code</h2>
        <TextInput onGenerateCode={handleGeneratedCode} />
        {generatedCode && <p>Generated Code: <strong>{generatedCode}</strong></p>}
      </div>
      <div className="container">
        <h2>Enter Code to Retrieve Text</h2>
        <CodeInput onRetrieveText={handleRetrievedText} />
      </div>
    </div>
  );
};

export default App;
