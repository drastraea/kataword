export const KeyboardLayout = ({ keyStatus, onKeyClick, disabled }) => {
  const keyboardRows = [
    "QWERTYUIOP",
    "ASDFGHJKL",
    "ZXCVBNM"
  ];

  return (
    <div className="flex flex-col items-center gap-2">
      {keyboardRows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1">
          {row.split("").map((key) => (
            <button
              key={key}
              onClick={() => onKeyClick(key)}
              disabled={disabled}
              className={`
                keyboard-button
                ${keyStatus[key] === "green"
                  ? "keyboard-button-green"
                  : keyStatus[key] === "yellow"
                  ? "keyboard-button-yellow"
                  : keyStatus[key] === "gray"
                  ? "keyboard-button-gray"
                  : "keyboard-button-default"}
              `}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};