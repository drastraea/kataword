import React, { useState, useRef, useEffect } from "react";

export const Select = ({ value, onValueChange, children }) => {
  const [open, setOpen] = useState(false);
  const selectRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle option selection
  const handleOptionClick = (newValue) => {
    onValueChange(newValue);
    setOpen(false);
  };

  return (
    <div className="custom-select" ref={selectRef}>
      {/* Trigger */}
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="custom-select-trigger"
      >
        {children.find((child) => child.props.value === value)?.props.children ||
          "Select..."}
      </div>

      {/* Dropdown */}
      {open && (
        <ul className="custom-select-dropdown">
          {React.Children.map(children, (child) => (
            <li
              key={child.props.value}
              className="custom-select-option"
              aria-selected={child.props.value === value}
              onClick={() => handleOptionClick(child.props.value)}
            >
              {child.props.children}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
