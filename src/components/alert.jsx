import { Alert } from '@/components/ui/alert';

export const GameAlert = ({ type, message }) => {
  if (!message) return null;
  
  return (
    <Alert type={type} className="mb-4">
      <span>{message}</span>
    </Alert>
  );
};
