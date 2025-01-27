export const Alert = ({ type = 'info', children, className = '' }) => {
  let bgColor = '';

  // Set different background colors based on alert type
  switch (type) {
    case 'won':
      bgColor = 'bg-green-500';
      break;
    case 'lost':
      bgColor = 'bg-red-500';
      break;
    case 'info':
      bgColor = 'bg-gray-500';
      break;
    default:
      bgColor = 'bg-gray-500';
  }

  return (
    <div className={`p-4 rounded-md ${bgColor} ${className}`}>
      <AlertDescription>{children}</AlertDescription>
    </div>
  );
};

export const AlertDescription = ({ children }) => {
  return <span className="text-white">{children}</span>;
};
