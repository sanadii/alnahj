import { describe, it, expect } from 'vitest';
import {
  selectGuaranteesByStatus,
  selectGuaranteesGroupedByCommittee,
  selectGuarantees
} from '../selectors';
import type { RootState } from 'store';
import type { GuaranteeState } from '../types';
import type { GuaranteeListItem } from 'types/guarantees';

const baseGuaranteeState: GuaranteeState = {
  guarantees: [],
  groups: [],
  statistics: null,
  loading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  pageSize: 25,
  filters: {}
};

const createGuarantee = (overrides: Partial<GuaranteeListItem>): GuaranteeListItem => ({
  id: overrides.id ?? Math.random(),
  elector: overrides.elector ?? 1,
  electorKocId: overrides.electorKocId ?? null,
  electorName: overrides.electorName ?? 'Unknown',
  electorMobile: overrides.electorMobile ?? '000',
  electorSection: overrides.electorSection ?? null,
  electorDepartment: overrides.electorDepartment ?? null,
  electorTeam: overrides.electorTeam ?? null,
  electorCommitteeName: overrides.electorCommitteeName ?? null,
  guaranteeStatus: overrides.guaranteeStatus ?? 'PENDING',
  guaranteeStatusDisplay: overrides.guaranteeStatusDisplay ?? 'Pending',
  group: overrides.group ?? null,
  groupName: overrides.groupName ?? null,
  groupColor: overrides.groupColor ?? null,
  quickNote: overrides.quickNote ?? '',
  mobile: overrides.mobile,
  confirmationStatus: overrides.confirmationStatus ?? 'PENDING',
  confirmationStatusDisplay: overrides.confirmationStatusDisplay ?? 'Pending',
  isConfirmed: overrides.isConfirmed ?? false,
  hasNotes: overrides.hasNotes ?? false,
  createdAt: overrides.createdAt ?? new Date().toISOString()
});

const createState = (overrides: Partial<GuaranteeState>): RootState =>
  ({
    guarantees: {
      ...baseGuaranteeState,
      ...overrides
    }
  } as unknown as RootState);

describe('guarantees selectors', () => {
  it('selectGuaranteesByStatus splits guarantees correctly', () => {
    const state = createState({
      guarantees: [
        createGuarantee({ id: 1, guaranteeStatus: 'GUARANTEED' }),
        createGuarantee({ id: 2, guaranteeStatus: 'PENDING' }),
        createGuarantee({ id: 3, guaranteeStatus: 'GUARANTEED' })
      ]
    });

    const groups = selectGuaranteesByStatus(state);
    expect(groups.guaranteed).toHaveLength(2);
    expect(groups.pending).toHaveLength(1);
  });

  it('selectGuaranteesGroupedByCommittee groups by committee name', () => {
    const state = createState({
      guarantees: [
        createGuarantee({ id: 1, electorCommitteeName: 'A' }),
        createGuarantee({ id: 2, electorCommitteeName: 'B' }),
        createGuarantee({ id: 3, electorCommitteeName: 'A' }),
        createGuarantee({ id: 4, electorCommitteeName: null })
      ]
    });

    const grouped = selectGuaranteesGroupedByCommittee(state);
    expect(Object.keys(grouped)).toEqual(['A', 'B', 'Unassigned']);
    expect(grouped['A']).toHaveLength(2);
    expect(grouped['Unassigned']).toHaveLength(1);
  });

  it('selectGuarantees returns original array for baseline coverage', () => {
    const guarantees = [createGuarantee({ id: 1 })];
    const state = createState({ guarantees });
    expect(selectGuarantees(state)).toBe(guarantees);
  });
});

