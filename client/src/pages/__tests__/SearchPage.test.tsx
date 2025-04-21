import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SearchPage from '../SearchPage';

// -----------------------------------------------------------------------------
// helpers
// -----------------------------------------------------------------------------
const createTestClient = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

const renderWithClient = () =>
  render(
    <QueryClientProvider client={createTestClient()}>
      <SearchPage />
    </QueryClientProvider>,
  );

const mockCountries = ['Romania', 'United States', 'United Kingdom'];

beforeEach(() => {
  jest.useFakeTimers();

  global.fetch = jest.fn(async (input: RequestInfo | URL) => {
    const url = new URL(input.toString(), 'http://localhost');
    const q = (url.searchParams.get('search') ?? '').toLowerCase();
    const filtered = mockCountries.filter((c) => c.toLowerCase().includes(q));

    return Promise.resolve({
      ok: true,
      json: async () => filtered,
    } as Response);
  }) as unknown as typeof fetch;
});

afterEach(() => {
  jest.clearAllTimers();
  jest.useRealTimers();
  jest.resetAllMocks();
});

// -----------------------------------------------------------------------------
// tests
// -----------------------------------------------------------------------------
describe('SearchPage', () => {
  it('debounces input and shows the matching results list', async () => {
    renderWithClient();

    // useGenericQuery fired once on mount → ignore that call for the debounce test
    (global.fetch as jest.Mock).mockClear();

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'United' } });

    // 400 ms – still inside debounce window
    await act(async () => {
      jest.advanceTimersByTime(400);
    });

    expect(global.fetch).not.toHaveBeenCalled();

    // reach 500 ms mark → request should be sent
    await act(async () => {
      jest.advanceTimersByTime(100);
    });

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    expect(await screen.findByText('United States')).toBeInTheDocument();
    expect(screen.getByText('United Kingdom')).toBeInTheDocument();
  });

  it('renders the empty state when nothing matches', async () => {
    renderWithClient();

    (global.fetch as jest.Mock).mockClear();

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'xyz' },
    });

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    expect(await screen.findByText(/No Results Found\./i)).toBeInTheDocument();
  });
});
