import { ResponsiveContainer, PieChart as PieChartInner, Pie, Cell, Tooltip } from 'recharts';
import { mergeClassNames } from '../utils/utils';
import React from 'react';
import EmptyState from './EmptyState';

interface PieChartProps {
  className?: string;
  data: {
    name: string;
    value: number;
  }[];
}

const PieChart = React.memo((props: PieChartProps) => {
  const { data, className } = props;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className={mergeClassNames('bg-white border rounded-md shadow p-2 flex-1', className)}>
      {data.length ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChartInner>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              labelLine={false}
              label={({ name }) => name}
            >
              {data.map((_, idx) => (
                <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChartInner>
        </ResponsiveContainer>
      ) : (
        <EmptyState className="h-full" text="Select one or more fields to load data." />
      )}
    </div>
  );
});

export default PieChart;
