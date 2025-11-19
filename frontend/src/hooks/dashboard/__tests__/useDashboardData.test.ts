/**
 * Dashboard Data Hooks Tests
 * Tests for custom dashboard data fetching hooks
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useGuaranteesTrend, useGroupPerformance, useHourlyAttendance, useElectorDemographics } from '../useDashboardData';
import * as dashboardApi from 'helpers/api/dashboard';

// Mock the API module
vi.mock('helpers/api/dashboard', () => ({
  getGuaranteesTrend: vi.fn(),
  getGroupPerformance: vi.fn(),
  getHourlyAttendance: vi.fn(),
  getElectorDemographics: vi.fn(),
  mockGuaranteesTrend: vi.fn(() => [{ date: '2025-10-01', strong: 20, medium: 15, weak: 10, total: 45 }]),
  mockGroupPerformance: vi.fn(() => [{ id: 1, name: 'Group A', guaranteesCount: 100, status: 'active' }]),
  mockHourlyAttendance: vi.fn(() => [{ hour: '08:00', attendance: 50, votes: 45, target: 100 }]),
  mockElectorDemographics: vi.fn(() => ({
    total: 1000,
    male: 520,
    female: 480,
    malePercentage: 52,
    femalePercentage: 48,
    byCommittee: [],
    byFamily: [],
    byAge: []
  }))
}));

describe('Dashboard Data Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useGuaranteesTrend', () => {
    it('should fetch guarantee trend data on mount', async () => {
      const mockData = [{ date: '2025-10-01', strong: 20, medium: 15, weak: 10, total: 45 }];

      (dashboardApi.getGuaranteesTrend as any).mockResolvedValue({
        data: mockData
      });

      const { result } = renderHook(() => useGuaranteesTrend(1, '30days'));

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(mockData);
      expect(result.current.error).toBeNull();
    });

    it('should handle errors', async () => {
      const errorMessage = 'Failed to fetch data';
      (dashboardApi.getGuaranteesTrend as any).mockRejectedValue({
        message: errorMessage
      });

      const { result } = renderHook(() => useGuaranteesTrend(1, '30days'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toBeNull();
      expect(result.current.error).toBe(errorMessage);
    });

    it('should not fetch if electionId is null', () => {
      const { result } = renderHook(() => useGuaranteesTrend(null, '30days'));

      expect(dashboardApi.getGuaranteesTrend).not.toHaveBeenCalled();
      expect(result.current.data).toBeNull();
    });

    it('should support manual refetch', async () => {
      const mockData = [{ date: '2025-10-01', strong: 20, medium: 15, weak: 10, total: 45 }];

      (dashboardApi.getGuaranteesTrend as any).mockResolvedValue({
        data: mockData
      });

      const { result } = renderHook(() => useGuaranteesTrend(1, '30days', { autoFetch: false }));

      expect(result.current.data).toBeNull();

      await result.current.refetch();

      await waitFor(() => {
        expect(result.current.data).toEqual(mockData);
      });
    });
  });

  describe('useGroupPerformance', () => {
    it('should fetch group performance data', async () => {
      const mockData = [{ id: 1, name: 'Group A', guaranteesCount: 100, status: 'active' as const }];

      (dashboardApi.getGroupPerformance as any).mockResolvedValue({
        data: mockData
      });

      const { result } = renderHook(() => useGroupPerformance(1));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(mockData);
    });

    it('should pass filters to API', async () => {
      const filters = {
        status: 'active' as const,
        sortBy: 'guarantees' as const
      };

      (dashboardApi.getGroupPerformance as any).mockResolvedValue({
        data: []
      });

      renderHook(() => useGroupPerformance(1, filters));

      await waitFor(() => {
        expect(dashboardApi.getGroupPerformance).toHaveBeenCalledWith(1, filters);
      });
    });
  });

  describe('useHourlyAttendance', () => {
    it('should fetch hourly attendance data', async () => {
      const mockData = [{ hour: '08:00', attendance: 50, votes: 45, target: 100 }];

      (dashboardApi.getHourlyAttendance as any).mockResolvedValue({
        data: mockData
      });

      const { result } = renderHook(() => useHourlyAttendance(1));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(mockData);
    });

    it('should pass date parameter to API', async () => {
      (dashboardApi.getHourlyAttendance as any).mockResolvedValue({
        data: []
      });

      renderHook(() => useHourlyAttendance(1, '2025-11-03'));

      await waitFor(() => {
        expect(dashboardApi.getHourlyAttendance).toHaveBeenCalledWith(1, '2025-11-03');
      });
    });
  });

  describe('useElectorDemographics', () => {
    it('should fetch elector demographics data', async () => {
      const mockData = {
        total: 1000,
        male: 520,
        female: 480,
        malePercentage: 52,
        femalePercentage: 48,
        byCommittee: [],
        byFamily: [],
        byAge: []
      };

      (dashboardApi.getElectorDemographics as any).mockResolvedValue({
        data: mockData
      });

      const { result } = renderHook(() => useElectorDemographics(1));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(mockData);
    });
  });
});
