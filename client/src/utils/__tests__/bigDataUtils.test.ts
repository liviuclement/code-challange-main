import {
  getMaxLength,
  computeBarAndLineData,
  computeWindowCounts,
  buildPieData,
  buildStdData,
  WINDOW_SIZE,
} from '../bigDataUtils';

// quick local std‑dev helper (avoids circular import)
const calculateStandardDeviation = (array: number[]) => {
  const mean = array.reduce((sum, value) => sum + value, 0) / (array.length || 1);
  const variance = array.reduce((sum, value) => sum + (value - mean) ** 2, 0) / (array.length || 1);

  return parseFloat(Math.sqrt(variance).toFixed(2));
};

describe('bigDataUtils helpers', () => {
  const sample: Record<string, number[]> = {
    a: [1, 2, 3, 4],
    b: [4, 3, 2, 1],
    c: [10, 0, 10, 0],
  };
  const fields = [
    { label: 'a', value: 'a' },
    { label: 'b', value: 'b' },
    { label: 'c', value: 'c' },
  ];

  it('getMaxLength returns the longest array length', () => {
    expect(getMaxLength(sample, fields)).toBe(4);
    expect(getMaxLength(sample, fields.slice(0, 1))).toBe(4);
    expect(getMaxLength({}, [])).toBe(0);
  });

  it('computeBarAndLineData returns the max per index', () => {
    const res = computeBarAndLineData(sample, fields, [0, 1, 2, 3]);
    expect(res).toEqual([
      { chunk: 0, count: 10 },
      { chunk: 1, count: 3 },
      { chunk: 2, count: 10 },
      { chunk: 3, count: 4 },
    ]);
  });

  it('computeWindowCounts tallies winners correctly', () => {
    const wc = computeWindowCounts(sample, fields, [0, 1, 2, 3]);
    // c wins index 0 & 2, a wins 3, b wins 1
    expect(wc).toEqual({ a: 1, b: 1, c: 2 });
  });

  it('buildPieData groups identical counts', () => {
    const counts = { a: 2, b: 1, c: 2 };
    const pie = buildPieData(counts, fields);
    expect(pie).toEqual(
      expect.arrayContaining([
        { name: expect.stringContaining('a'), value: 2 },
        { name: expect.stringContaining('c'), value: 2 },
        { name: 'b', value: 1 },
      ]),
    );
  });

  it('buildStdData computes standard deviation for each field', () => {
    const res = buildStdData(sample, fields, 0, 4);
    expect(res).toEqual([
      { letter: 'a', deviation: calculateStandardDeviation(sample.a) },
      { letter: 'b', deviation: calculateStandardDeviation(sample.b) },
      { letter: 'c', deviation: calculateStandardDeviation(sample.c) },
    ]);
  });

  it('WINDOW_SIZE constant is 200', () => {
    expect(WINDOW_SIZE).toBe(200);
  });
});
