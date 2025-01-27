export const GuessGrid = ({ guesses, remainingAttempts, secretWordLength }) => {
  return (
    <div className="grid gap-2 mb-6">
      {guesses.map((guess, index) => (
        <div key={index} className="flex gap-2">
          {guess.map(({ char, color }, idx) => (
            <div
              key={idx}
              className={`
                w-12 h-12 flex items-center justify-center 
                font-bold text-lg border-2 rounded-lg
                transform transition-all duration-300
                ${color === "green" 
                  ? "bg-green-500 border-green-600" 
                  : color === "yellow" 
                  ? "bg-yellow-500 border-yellow-600" 
                  : "bg-gray-500 border-gray-600"}
              `}
            >
              {char}
            </div>
          ))}
        </div>
      ))}
      
      {/* Empty rows for remaining attempts */}
      {[...Array(remainingAttempts)].map((_, i) => (
        <div key={`empty-${i}`} className="flex gap-2">
          {[...Array(secretWordLength)].map((_, j) => (
            <div
              key={j}
              className="w-12 h-12 border-2 border-gray-300 rounded-lg"
            />
          ))}
        </div>
      ))}
    </div>
  );
};