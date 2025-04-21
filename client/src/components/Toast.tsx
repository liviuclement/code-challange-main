import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { mergeClassNames } from '../utils/utils';

export interface ToastProps {
  className?: string;
  variant?: 'error' | 'warning' | 'info' | 'success';
  messageTitle?: string;
  messageBody: string;
  buttonText?: string;
  onButtonClick?: () => void;
  onClose?: () => void;
}

const Toast = (props: ToastProps) => {
  const { className, variant = 'success', messageTitle, messageBody, onClose } = props;

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const variantBorders: Record<string, string> = {
    error: 'border-red-500',
    info: 'border-blue-500',
    warning: 'border-yellow-500',
    success: 'border-green-500',
  };

  return createPortal(
    <div
      className={mergeClassNames(
        `bg-white rounded-lg shadow-lg border-l-4 px-4 py-3 flex gap-4 w-full max-w-md
           transition-all duration-300 opacity-0 -translate-y-4`,
        variantBorders[variant],
        {
          'translate-y-0 opacity-100': mounted,
        },
        className,
      )}
    >
      <div className="flex flex-col justify-center gap-1">
        {messageTitle && (
          <h3 className="text-sm font-raleway font-semibold leading-4 text-gray-900">
            {messageTitle}
          </h3>
        )}
        <p className="flex items-center text-xs leading-4 text-gray-700">{messageBody}</p>
      </div>
      <button onClick={onClose}>x</button>
    </div>,
    document.getElementById('toast-root') as HTMLElement,
  );
};

export default Toast;
