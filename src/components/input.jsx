import { useState } from 'react';
import { KeyboardLayout } from './keyboard';

export const WordInput = ({ onGuess, keyStatus, secretWordLength, disabled }) => {
  const [guess, setGuess] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (guess.length === secretWordLength) {
      onGuess(guess);
      setGuess("");
    }
  };

  const handleKeyClick = (key) => {
    if (!disabled && guess.length < secretWordLength) {
      setGuess(prev => prev + key);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value.toUpperCase())}
          maxLength={secretWordLength}
          className="wordForm"
          placeholder={`Guess ${secretWordLength}-letter word`}
          disabled={disabled} autoFocus
        />
        <button
          type="submit"
          disabled={disabled || guess.length !== secretWordLength}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
        >
          Submit
        </button>
      </form>
      <KeyboardLayout 
        keyStatus={keyStatus} 
        onKeyClick={handleKeyClick}
        disabled={disabled}
      />
    </div>
  );
};