import {
  Legend,
  Line,
  LineChart as LineChartInner,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { mergeClassNames } from '../utils/utils';
import React from 'react';
import EmptyState from './EmptyState';

interface LineChartProps {
  className?: string;
  data: {
    chunk: number;
    count: number;
  }[];
}

const LineChart = React.memo((props: LineChartProps) => {
  const { data, className } = props;

  return (
    <div className={mergeClassNames('bg-white border rounded-md shadow p-2', className)}>
      {data.length ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChartInner data={data}>
            <XAxis dataKey="chunk" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" name="Max Count" dot={false} />
          </LineChartInner>
        </ResponsiveContainer>
      ) : (
        <EmptyState className="h-full" text="Select one or more fields to load data." />
      )}
    </div>
  );
});

export default LineChart;
