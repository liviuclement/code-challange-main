import { MultiValue } from 'react-select';
import { SelectOption } from './types';
import { calculateStandardDeviation } from './utils';

export const getMaxLength = (data: Record<string, number[]>, fields: MultiValue<SelectOption>) => {
  if (data && fields.length) {
    return fields.reduce((max, { value }) => {
      const length = data[value]?.length ?? 0;

      return length > max ? length : max;
    }, 0);
  }

  return 0;
};

export const WINDOW_SIZE = 200;

export const computeBarAndLineData = (
  data: Record<string, number[]>,
  fields: MultiValue<SelectOption>,
  indices: number[],
) =>
  indices.map((i) => {
    const counts = fields.map(({ value }) => data?.[value]?.[i] ?? 0);

    return { chunk: i, count: counts.length ? Math.max(...counts) : 0 };
  });

export const computeWindowCounts = (
  data: Record<string, number[]>,
  fields: MultiValue<SelectOption>,
  indices: number[],
) => {
  const counts: Record<string, number> = {};

  fields.forEach(({ value }) => {
    counts[value] = 0;
  });

  indices.forEach((i) => {
    let best = fields[0]?.value as string | undefined;
    let bestCount = best ? (data?.[best]?.[i] ?? 0) : 0;

    fields.forEach(({ value }) => {
      const count = data?.[value]?.[i] ?? 0;

      if (count > bestCount) {
        best = value;
        bestCount = count;
      }
    });

    if (best) {
      counts[best]!++;
    }
  });

  return counts;
};

export const buildPieData = (
  windowCounts: Record<string, number>,
  fields: MultiValue<SelectOption>,
) => {
  const countToNames: Record<number, string[]> = {};

  fields.forEach(({ value }) => {
    const count = windowCounts[value] || 0;

    if (count > 0) {
      if (!countToNames[count]) countToNames[count] = [];
      countToNames[count].push(value);
    }
  });

  return Object.entries(countToNames).map(([count, names]) => ({
    name: names.join(', '),
    value: Number(count),
  }));
};

export const buildStdData = (
  data: Record<string, number[]>,
  fields: MultiValue<SelectOption>,
  start: number,
  end: number,
) =>
  fields.map(({ value }) => {
    const arr = data?.[value]?.slice(start, end) ?? [];
    const deviation = calculateStandardDeviation(arr);

    return { letter: value, deviation };
  });
