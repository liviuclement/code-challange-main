import { ReactNode } from 'react';
import { mergeClassNames } from '../utils/utils';

interface ListProps {
  children?: ReactNode;
  className?: string;
}

const List = (props: ListProps) => {
  const { children, className } = props;

  return (
    <ul className={mergeClassNames('bg-white shadow rounded divide-y divide-gray-200', className)}>
      {children}
    </ul>
  );
};

interface ListItemProps {
  children?: ReactNode;
  className?: string;
}

const ListItem = (props: ListItemProps) => {
  const { children, className } = props;
  return <li className={mergeClassNames('px-4 py-2 hover:bg-gray-100', className)}>{children}</li>;
};

List.Item = ListItem;

export default List;
