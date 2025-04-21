import { ChangeEvent } from 'react';
import { mergeClassNames } from '../utils/utils';

interface SliderProps {
  className?: string;
  containerClassName?: string;
  value: number;
  isDisabled: boolean;
  maxValue: number;
  label?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Slider = (props: SliderProps) => {
  const { className, containerClassName, value, isDisabled, maxValue, label, onChange } = props;

  return (
    <div className={mergeClassNames('flex flex-col', containerClassName)}>
      <input
        disabled={isDisabled}
        value={value}
        onChange={onChange}
        type="range"
        className={mergeClassNames(
          'w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer',
          className,
        )}
        max={maxValue}
      />
      {!!label && <span className="disabled:text-gray-500 mt-1">{label}</span>}
    </div>
  );
};

export default Slider;
