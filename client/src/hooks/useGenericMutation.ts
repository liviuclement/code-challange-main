import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';

type MutationMethod = 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export function useGenericMutation<
  TData = unknown,
  TError = Error,
  TVariables = any,
  TContext = unknown,
>(
  endpoint: string,
  method: MutationMethod = 'POST',
  options?: UseMutationOptions<TData, TError, TVariables, TContext>,
) {
  const completeEndpoint = 'http://localhost:8081' + endpoint;
  const queryClient = useQueryClient();
  const {
    onSuccess: userOnSuccess,
    onError: userOnError,
    onSettled: userOnSettled,
    ...restOptions
  } = options ?? {};

  const mutationFn = async (variables: TVariables): Promise<TData> => {
    const res = await fetch(completeEndpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(variables),
    });

    if (!res.ok) {
      throw new Error(`Error ${method} ${completeEndpoint}: ${res.status} ${res.statusText}`);
    }

    return (await res.json()) as TData;
  };

  return useMutation<TData, TError, TVariables, TContext>({
    mutationFn,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [completeEndpoint] });
      userOnSuccess?.(data, variables, context);
    },
    onError: userOnError,
    onSettled: userOnSettled,
    ...restOptions,
  });
}
