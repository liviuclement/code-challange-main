import { mergeClassNames } from '../utils/utils';

interface EmptyStateProps {
  text?: string;
  className?: string;
}

const EmptyState = (props: EmptyStateProps) => {
  const { text = 'No Results Found.', className } = props;

  return (
    <p
      className={mergeClassNames(
        'w-full flex items-center justify-center text-sm text-gray-500',
        className,
      )}
    >
      {text}
    </p>
  );
};

export default EmptyState;
