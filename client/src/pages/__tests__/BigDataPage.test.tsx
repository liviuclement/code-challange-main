/**
 * @jest-environment jsdom
 */
import { render, screen, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import BigDataPage from '../BigDataPage';
import { useGenericQuery } from '../../hooks/useGenericQuery';
import { useGenericMutation } from '../../hooks/useGenericMutation';

// ─── Stubs ──────────────────────────────────────────────────────────────
jest.mock('../../components/BarChart', () => () => <div data-testid="bar-chart" />);
jest.mock('../../components/LineChart', () => () => <div data-testid="line-chart" />);
jest.mock('../../components/PieChart', () => () => <div data-testid="pie-chart" />);
jest.mock('../../components/STDTable', () => () => <div data-testid="std-table" />);

jest.mock('../../components/Select', () => (props: any) => (
  <select
    data-testid="select"
    multiple
    onChange={(e) => {
      const vals = Array.from(e.target.selectedOptions).map((o) => ({
        label: o.value,
        value: o.value,
      }));
      props.onChange(vals);
    }}
  >
    {props.options.map((o: any) => (
      <option key={o.value} value={o.value}>
        {o.label}
      </option>
    ))}
  </select>
));

jest.mock('../../components/Slider', () => (props: any) => (
  <>
    <input
      data-testid="slider"
      type="range"
      value={props.value}
      max={props.maxValue}
      disabled={props.isDisabled}
      onChange={props.onChange}
    />
    <span>{props.label}</span>
  </>
));

jest.mock('../../hooks/useToast', () => () => ({ error: jest.fn() }));

// ─── Hook mocks ────────────────────────────────────────────────────────
jest.mock('../../hooks/useGenericQuery');
jest.mock('../../hooks/useGenericMutation');

const mockFields = ['a', 'b'];
const mockBigData: Record<string, number[]> = {
  a: Array.from({ length: 400 }, (_, i) => i),
  b: Array.from({ length: 400 }, () => 0),
};

// ─── Helpers ────────────────────────────────────────────────────────────
const renderPage = () =>
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
    >
      <BigDataPage />
    </QueryClientProvider>,
  );

// ─── Tests ──────────────────────────────────────────────────────────────
describe('BigDataPage integration', () => {
  beforeEach(() => {
    (useGenericQuery as jest.Mock).mockReturnValue({ data: mockFields });
    (useGenericMutation as jest.Mock).mockReturnValue({ data: mockBigData, mutate: jest.fn() });
    jest.useFakeTimers(); // for debounce
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('starts with helper text and disabled slider', () => {
    renderPage();
    expect(screen.getByText(/select one or more fields/i)).toBeInTheDocument();
    expect(screen.getByTestId('slider')).toBeDisabled();
  });

  it('label starts 0‑199 and becomes 200‑399 when the slider goes to 1', async () => {
    renderPage();

    /* pick a field */
    await userEvent.selectOptions(screen.getByTestId('select'), ['a']);
    act(() => jest.runOnlyPendingTimers()); // flush debounce

    expect(screen.getByText(/Showing entries 0 to 199/i)).toBeInTheDocument();

    /* change slider to 1 */
    const slider = screen.getByTestId('slider') as HTMLInputElement;
    fireEvent.change(slider, { target: { value: '1' } });
    act(() => jest.runOnlyPendingTimers());

    expect(screen.getByText(/Showing entries 200 to 399/i)).toBeInTheDocument();
  });
});
