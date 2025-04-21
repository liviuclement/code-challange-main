import { mergeClassNames } from '../utils/utils';

interface LoadingSpinnerProps {
  text?: string;
  className?: string;
}

const LoadingSpinner = (props: LoadingSpinnerProps) => {
  const { text = 'Loading...', className } = props;

  return (
    <p className={mergeClassNames('w-full flex justify-center text-sm text-gray-500', className)}>
      {text}
    </p>
  );
};

export default LoadingSpinner;
