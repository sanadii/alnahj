/**
 * Dashboard API Tests
 * Tests for dashboard API service layer mock data generators
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { mockGuaranteesTrend, mockGroupPerformance, mockHourlyAttendance, mockElectorDemographics } from '../dashboard';

describe('Dashboard API - Mock Data Generators', () => {
  beforeEach(() => {
    // Setup if needed
  });

  describe('mockGuaranteesTrend', () => {
    it('should generate mock guarantee trend data', () => {
      const data = mockGuaranteesTrend(7);

      expect(data).toHaveLength(7);
      expect(data[0]).toHaveProperty('date');
      expect(data[0]).toHaveProperty('strong');
      expect(data[0]).toHaveProperty('medium');
      expect(data[0]).toHaveProperty('weak');
      expect(data[0]).toHaveProperty('total');
      expect(data[0].total).toBe(data[0].strong + data[0].medium + data[0].weak);
    });

    it('should generate correct number of days', () => {
      expect(mockGuaranteesTrend(30)).toHaveLength(30);
      expect(mockGuaranteesTrend(90)).toHaveLength(90);
    });
  });

  describe('mockGroupPerformance', () => {
    it('should generate mock group performance data', () => {
      const data = mockGroupPerformance();

      expect(data.length).toBeGreaterThan(0);
      expect(data[0]).toHaveProperty('id');
      expect(data[0]).toHaveProperty('name');
      expect(data[0]).toHaveProperty('status');
      expect(data[0]).toHaveProperty('guaranteesCount');
      expect(data[0]).toHaveProperty('strongCount');
      expect(data[0]).toHaveProperty('mediumCount');
      expect(data[0]).toHaveProperty('weakCount');
    });

    it('should have valid status values', () => {
      const data = mockGroupPerformance();
      const validStatuses = ['active', 'inactive', 'pending'];
      data.forEach((group) => {
        expect(validStatuses).toContain(group.status);
      });
    });
  });

  describe('mockHourlyAttendance', () => {
    it('should generate mock hourly attendance data', () => {
      const data = mockHourlyAttendance();

      expect(data.length).toBeGreaterThan(0);
      expect(data[0]).toHaveProperty('hour');
      expect(data[0]).toHaveProperty('attendance');
      expect(data[0]).toHaveProperty('votes');
      expect(data[0]).toHaveProperty('target');
    });

    it('should have votes less than or equal to attendance', () => {
      const data = mockHourlyAttendance();
      data.forEach((entry) => {
        expect(entry.votes).toBeLessThanOrEqual(entry.attendance);
      });
    });
  });

  describe('mockElectorDemographics', () => {
    it('should generate mock elector demographics data', () => {
      const data = mockElectorDemographics();

      expect(data).toHaveProperty('total');
      expect(data).toHaveProperty('male');
      expect(data).toHaveProperty('female');
      expect(data.total).toBe(data.male + data.female);
      expect(data.malePercentage + data.femalePercentage).toBeCloseTo(100, 1);
    });

    it('should have demographic breakdowns', () => {
      const data = mockElectorDemographics();

      expect(data.byCommittee).toBeDefined();
      expect(Array.isArray(data.byCommittee)).toBe(true);

      expect(data.byFamily).toBeDefined();
      expect(Array.isArray(data.byFamily)).toBe(true);

      expect(data.byAge).toBeDefined();
      expect(Array.isArray(data.byAge)).toBe(true);
    });

    it('should have correct male/female percentages', () => {
      const data = mockElectorDemographics();

      const expectedMalePercentage = (data.male / data.total) * 100;
      const expectedFemalePercentage = (data.female / data.total) * 100;

      expect(data.malePercentage).toBeCloseTo(expectedMalePercentage, 1);
      expect(data.femalePercentage).toBeCloseTo(expectedFemalePercentage, 1);
    });
  });
});
