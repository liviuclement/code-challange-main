import { useState } from 'react';
import Input from '../components/Input';
import PageLayout from '../components/PageLayout';
import useDebounce from '../hooks/useDebounce';
import LoadingSpinner from '../components/LoadingSpinner';
import List from '../components/List';
import EmptyState from '../components/EmptyState';
import { useGenericQuery } from '../hooks/useGenericQuery';

const SearchPage = () => {
  const [inputValue, setInputValue] = useState('');

  const debouncedInputValue = useDebounce(inputValue, 500);

  const { data: results, isLoading } = useGenericQuery<string[]>('/slow-search', {
    search: debouncedInputValue,
  });

  return (
    <PageLayout title="Search Page">
      <Input
        className="w-full border border-gray-900"
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
      />
      {isLoading && <LoadingSpinner className="mt-8" />}
      {!isLoading &&
        (results?.length ? (
          <List className="mt-8">
            {results?.map((country: any) => <List.Item key={country}>{country}</List.Item>)}
          </List>
        ) : (
          <EmptyState className="mt-8" />
        ))}
    </PageLayout>
  );
};

export default SearchPage;
