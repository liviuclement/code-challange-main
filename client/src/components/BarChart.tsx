import {
  BarChart as BarChartInner,
  Bar,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { mergeClassNames } from '../utils/utils';
import React from 'react';
import EmptyState from './EmptyState';

interface BarChartProps {
  className?: string;
  data: {
    chunk: number;
    count: number;
  }[];
}

const BarChart = React.memo((props: BarChartProps) => {
  const { data, className } = props;

  return (
    <div className={mergeClassNames('bg-white border rounded-md shadow p-2', className)}>
      {data.length ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChartInner data={data}>
            <XAxis dataKey="chunk" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" name="Max Count" />
          </BarChartInner>
        </ResponsiveContainer>
      ) : (
        <EmptyState className="h-full" text="Select one or more fields to load data." />
      )}
    </div>
  );
});

export default BarChart;
