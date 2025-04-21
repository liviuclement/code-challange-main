import classNames, { ArgumentArray } from 'classnames';
import { twMerge } from 'tailwind-merge';

export const mergeClassNames = (...classes: ArgumentArray) => twMerge(classNames(...classes));

export const calculateStandardDeviation = (array: number[]) => {
  const mean = array.reduce((sum, value) => sum + value, 0) / (array.length || 1);
  const variance = array.reduce((sum, value) => sum + (value - mean) ** 2, 0) / (array.length || 1);

  return parseFloat(Math.sqrt(variance).toFixed(2));
};
