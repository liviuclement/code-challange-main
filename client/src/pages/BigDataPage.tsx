import { useState, useMemo, useCallback } from 'react';
import PageLayout from '../components/PageLayout';
import { MultiValue } from 'react-select';
import { useGenericQuery } from '../hooks/useGenericQuery';
import { useGenericMutation } from '../hooks/useGenericMutation';
import useDebounce from '../hooks/useDebounce';
import BarChart from '../components/BarChart';
import LineChart from '../components/LineChart';
import Slider from '../components/Slider';
import PieChart from '../components/PieChart';
import { SelectOption } from '../utils/types';
import STDTable from '../components/STDTable';
import Select from '../components/Select';
import useToast from '../hooks/useToast';
import {
  getMaxLength,
  computeBarAndLineData,
  computeWindowCounts,
  buildPieData,
  buildStdData,
  WINDOW_SIZE,
} from '../utils/bigDataUtils';

const BigDataPage = () => {
  const { data: fields } = useGenericQuery<string[]>('/big-data/fields');

  const [selectedFields, setSelectedFields] = useState<MultiValue<SelectOption>>([]);
  const [windowIndex, setWindowIndex] = useState<number>(0);

  const debouncedWindowIndex = useDebounce(windowIndex, 500);

  const toast = useToast();

  const { data: bigData, mutate: fetchBigData } = useGenericMutation<
    Record<string, number[]>,
    Error,
    { fields: string[] }
  >('/big-data', 'POST', {
    onError: (error) => toast.error('An error occurred: ', error.message),
  });

  // Maximum length among the selected fields
  const maxLength = useMemo(
    () => getMaxLength(bigData ?? {}, selectedFields),
    [bigData, selectedFields],
  );

  const totalPages = bigData ? Math.ceil(maxLength / WINDOW_SIZE) : 0;
  const maxSliderValue = Math.max(0, totalPages - 1);

  const start = debouncedWindowIndex * WINDOW_SIZE;
  const end = Math.min(start + WINDOW_SIZE, maxLength);

  const windowIndices = useMemo(() => {
    return Array.from({ length: end - start }, (_, i) => start + i);
  }, [end, start]);

  const barAndChartData = useMemo(
    () => computeBarAndLineData(bigData ?? {}, selectedFields, windowIndices),
    [bigData, selectedFields, windowIndices],
  );

  const windowCounts = useMemo(
    () => computeWindowCounts(bigData ?? {}, selectedFields, windowIndices),
    [bigData, selectedFields, windowIndices],
  );

  const pieData = useMemo(
    () => buildPieData(windowCounts, selectedFields),
    [windowCounts, selectedFields],
  );

  const stdData = useMemo(
    () => buildStdData(bigData ?? {}, selectedFields, start, end),
    [bigData, selectedFields, start, end],
  );

  const getSliderLabel = () => {
    if (bigData && selectedFields.length > 0) {
      return `Showing entries ${windowIndex * WINDOW_SIZE} to ${Math.min((windowIndex + 1) * WINDOW_SIZE - 1, maxLength)}`;
    }

    return 'Select one or more fields to load data.';
  };

  const options = useMemo(
    () => (fields ?? []).map((field) => ({ label: field, value: field })),
    [fields],
  );

  const selectHandler = useCallback(
    (newValue: MultiValue<SelectOption>) => {
      setSelectedFields(newValue);

      const fieldNames = newValue.map((o) => o.value);

      fetchBigData({ fields: fieldNames });
    },
    [fetchBigData],
  );

  return (
    <PageLayout title="Big Data Page">
      <div className="flex flex-col lg:flex-row gap-4 w-full">
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Select
              containerClassName="w-full sm:w-1/2"
              isMulti
              options={options}
              value={selectedFields}
              onChange={selectHandler}
              placeholder="Select one or more fields…"
            />

            <Slider
              containerClassName="w-full sm:w-1/2"
              value={windowIndex}
              isDisabled={!bigData || selectedFields.length === 0}
              maxValue={maxSliderValue}
              onChange={(e) => setWindowIndex(Number(e.target.value))}
              label={getSliderLabel()}
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-4 flex-1">
            <div className="flex flex-col gap-4 lg:w-2/3">
              <BarChart className="h-48" data={barAndChartData} />
              <LineChart className="h-48" data={barAndChartData} />
            </div>
            <PieChart className="h-96 lg:h-auto" data={pieData} />
          </div>
        </div>

        <STDTable data={stdData} className="w-full lg:w-1/4" />
      </div>
    </PageLayout>
  );
};

export default BigDataPage;
