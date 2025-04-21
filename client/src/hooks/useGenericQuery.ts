import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useEffect } from 'react';
import useToast from './useToast';

type Params = Record<string, any>;

export function useGenericQuery<TData = unknown, TError = Error>(
  endpoint: string,
  params?: Params,
  options?: UseQueryOptions<TData, TError, TData>,
) {
  const toast = useToast();

  const completeEndpoint = 'http://localhost:8081' + endpoint;
  const queryKey = [completeEndpoint, params] as const;

  const queryFn = async ({ signal }: { signal: AbortSignal }): Promise<TData> => {
    const url = new URL(completeEndpoint, window.location.origin);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(url.toString(), { signal });

    if (!response.ok) {
      throw new Error(`Error fetching ${completeEndpoint}: ${response.statusText}`);
    }

    return (await response.json()) as TData;
  };

  const queryResult = useQuery<TData, TError>({
    queryKey,
    queryFn,
    ...options,
  });

  const { isError, error } = queryResult;

  useEffect(() => {
    if (isError) {
      toast.error('An error occurred');
      console.error(error);
    }
  }, [isError, error]);

  return queryResult;
}
