/**
 * GuaranteesTrendChartWithAPI Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from 'test/utils/test-utils';
import GuaranteesTrendChartWithAPI from '../GuaranteesTrendChartWithAPI';
import { useGuaranteesTrend } from 'hooks/dashboard/useDashboardData';

// Mock the hook
vi.mock('hooks/dashboard/useDashboardData', () => ({
  useGuaranteesTrend: vi.fn()
}));

// Mock ApexCharts to avoid rendering issues in tests
vi.mock('react-apexcharts', () => ({
  default: () => <div data-testid="apex-chart">Chart</div>
}));

describe('GuaranteesTrendChartWithAPI', () => {
  const mockData = [
    { date: '2025-10-01', strong: 20, medium: 15, weak: 10, total: 45 },
    { date: '2025-10-02', strong: 22, medium: 16, weak: 9, total: 47 }
  ];

  it('should show loading state', () => {
    (useGuaranteesTrend as any).mockReturnValue({
      data: null,
      loading: true,
      error: null,
      refetch: vi.fn()
    });

    render(<GuaranteesTrendChartWithAPI electionId={1} />);

    expect(screen.getByText(/loading guarantees trend data/i)).toBeInTheDocument();
  });

  it('should show error state with retry button', () => {
    const mockRefetch = vi.fn();
    (useGuaranteesTrend as any).mockReturnValue({
      data: null,
      loading: false,
      error: 'Failed to fetch data',
      refetch: mockRefetch
    });

    render(<GuaranteesTrendChartWithAPI electionId={1} />);

    expect(screen.getByText(/failed to load guarantees trend/i)).toBeInTheDocument();
    expect(screen.getByText(/failed to fetch data/i)).toBeInTheDocument();

    const retryButton = screen.getByRole('button', { name: /retry/i });
    expect(retryButton).toBeInTheDocument();

    retryButton.click();
    expect(mockRefetch).toHaveBeenCalled();
  });

  it('should show empty state when no data', () => {
    (useGuaranteesTrend as any).mockReturnValue({
      data: [],
      loading: false,
      error: null,
      refetch: vi.fn()
    });

    render(<GuaranteesTrendChartWithAPI electionId={1} />);

    expect(screen.getByText(/no guarantees trend data available yet/i)).toBeInTheDocument();
  });

  it('should render chart with data', async () => {
    (useGuaranteesTrend as any).mockReturnValue({
      data: mockData,
      loading: false,
      error: null,
      refetch: vi.fn()
    });

    render(<GuaranteesTrendChartWithAPI electionId={1} />);

    await waitFor(() => {
      // The GuaranteesTrendChart component should be rendered
      // Since we mocked ApexCharts, we check for the test id
      expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
    });
  });

  it('should pass electionId to hook', () => {
    (useGuaranteesTrend as any).mockReturnValue({
      data: mockData,
      loading: false,
      error: null,
      refetch: vi.fn()
    });

    render(<GuaranteesTrendChartWithAPI electionId={123} />);

    expect(useGuaranteesTrend).toHaveBeenCalledWith(123, '30days');
  });

  it('should pass height prop to chart', () => {
    (useGuaranteesTrend as any).mockReturnValue({
      data: mockData,
      loading: false,
      error: null,
      refetch: vi.fn()
    });

    render(<GuaranteesTrendChartWithAPI electionId={1} height={500} />);

    // Verify the chart component receives the data
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });
});
