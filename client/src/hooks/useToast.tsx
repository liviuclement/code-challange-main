import { useRef } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import Toast, { type ToastProps } from '../components/Toast';

type ToastDuration = number | 'infinite';

const useToast = () => {
  const roots = useRef<Map<HTMLDivElement, Root>>(new Map());

  const hide = (container: HTMLDivElement) => {
    const root = roots.current.get(container);
    if (root) {
      root.unmount();
      roots.current.delete(container);
      container.remove();
    }
  };

  const show = (props: ToastProps, duration: ToastDuration = 5000) => {
    const portalRoot = document.getElementById('toast-root');

    if (!portalRoot) {
      throw new Error("Couldn't find #toast-root in document");
    }

    const container = document.createElement('div');

    portalRoot.appendChild(container);

    const root = createRoot(container);
    roots.current.set(container, root);

    let timeout: ReturnType<typeof setTimeout> | null = null;

    const closeHandler = () => {
      hide(container);
      props.onClose?.();
      if (timeout) clearTimeout(timeout);
    };

    if (duration !== 'infinite') {
      timeout = setTimeout(closeHandler, duration);
    }

    root.render(<Toast {...props} onClose={closeHandler} />);
  };

  const info = (message: string, title: string = 'Info', duration: ToastDuration = 5000): void =>
    show({ variant: 'info', messageTitle: title, messageBody: message }, duration);

  const success = (message: string, title: string = 'Success', duration: ToastDuration = 5000) =>
    show({ variant: 'success', messageTitle: title, messageBody: message }, duration);

  const warning = (
    message: string,
    title: string = 'Warning',
    duration: ToastDuration = 'infinite',
  ) => show({ variant: 'warning', messageTitle: title, messageBody: message }, duration);

  const error = (message: string, title: string = 'Error', duration: ToastDuration = 'infinite') =>
    show({ variant: 'error', messageTitle: title, messageBody: message }, duration);

  return { info, success, warning, error };
};

export default useToast;
