import Button from 'react-bootstrap/Button';
import { BsArrowRepeat } from 'react-icons/bs';
import './LoaderButton.css';

export default function LoaderButton({
  isLoading,
  className = '',
  disabled = false,
  children,
  ...rest
}) {
  return (
    <Button
      disabled={disabled || isLoading}
      className={`LoaderButton ${className}`}
      {...rest}>
      {isLoading && <BsArrowRepeat className="spinning" />}
      {children}
    </Button>
  );
}
