import { InputHTMLAttributes } from 'react';
import { mergeClassNames } from '../utils/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = (props: InputProps) => {
  const { className, ...rest } = props;

  return (
    <input
      className={mergeClassNames('flex items-center rounded-xl h-10 px-4', className)}
      {...rest}
    />
  );
};

export default Input;
