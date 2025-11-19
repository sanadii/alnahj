import { describe, it, expect } from 'vitest';
import { selectElectorsSortedByName, selectElectorsBySearch } from '../electorsSelector';
import type { RootState } from 'store';
import type { Elector } from 'types/electors';
import type { ElectorsState } from 'store/electors/reducer';

const baseFilters: ElectorsState['filters'] = {
  search: '',
  gender: '',
  committee: undefined,
  department: undefined,
  team: undefined,
  section: undefined,
  nameFirst: undefined,
  nameSecond: undefined,
  nameThird: undefined,
  nameFourth: undefined,
  subFamilyName: undefined,
  familyName: undefined,
  page: 1,
  pageSize: 25
};

const baseElectorsState: ElectorsState = {
  electors: [],
  currentElector: null,
  electorStats: null,
  groups: null,
  totalCount: 0,
  currentPage: 1,
  pageSize: 25,
  loading: false,
  error: null,
  filters: baseFilters
};

const createState = (overrides: Partial<ElectorsState>): RootState =>
  ({
    electors: {
      ...baseElectorsState,
      ...overrides,
      filters: {
        ...baseFilters,
        ...(overrides.filters || {})
      }
    }
  } as unknown as RootState);

const createElector = (overrides: Partial<Elector>): Elector => ({
  kocId: '000',
  fullName: 'Unknown',
  gender: 'M',
  isActive: true,
  ...overrides
});

describe('electors selectors', () => {
  it('selectElectorsSortedByName sorts case-insensitively', () => {
    const state = createState({
      electors: [
        createElector({ kocId: '2', fullName: 'beta' }),
        createElector({ kocId: '1', fullName: 'Alpha' }),
        createElector({ kocId: '3', fullName: 'charlie' })
      ]
    });

    const sorted = selectElectorsSortedByName(state);
    expect(sorted?.map((e) => e.fullName)).toEqual(['Alpha', 'beta', 'charlie']);
  });

  it('selectElectorsBySearch matches fullName and kocId', () => {
    const state = createState({
      electors: [
        createElector({ kocId: '100', fullName: 'Nasser Ali' }),
        createElector({ kocId: '200', fullName: 'Bashir' }),
        createElector({ kocId: '300', fullName: 'Another Person' })
      ],
      filters: {
        ...baseFilters,
        search: '200'
      }
    });

    const filteredById = selectElectorsBySearch(state);
    expect(filteredById).toHaveLength(1);
    expect(filteredById?.[0].kocId).toBe('200');

    const stateByName = createState({
      electors: state.electors,
      filters: {
        ...baseFilters,
        search: 'nasser'
      }
    });

    const filteredByName = selectElectorsBySearch(stateByName);
    expect(filteredByName).toHaveLength(1);
    expect(filteredByName?.[0].fullName).toBe('Nasser Ali');
  });
});

