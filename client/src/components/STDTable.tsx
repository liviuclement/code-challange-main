import React from 'react';
import { mergeClassNames } from '../utils/utils';
import EmptyState from './EmptyState';

interface STDTableProps {
  className?: string;
  data: {
    letter: string;
    deviation: number;
  }[];
}

const STDTable = React.memo((props: STDTableProps) => {
  const { className, data } = props;

  return (
    <div className={mergeClassNames('bg-white border rounded-md shadow overflow-auto', className)}>
      {data.length ? (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Letter</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Std Dev</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map(({ letter, deviation }) => (
              <tr key={letter}>
                <td className="px-4 py-2 text-sm text-gray-600">{letter}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{deviation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <EmptyState className="h-full" text="Select one or more fields to load data." />
      )}
    </div>
  );
});

export default STDTable;
