/**
 * Strategic Command Center - Reducer
 */

import type { StrategicRecommendation, StrategicState } from 'types/strategic';
import {
  GET_STRATEGIC_DATA_REQUEST,
  GET_STRATEGIC_DATA_SUCCESS,
  GET_STRATEGIC_DATA_FAILURE,
  SET_STRATEGIC_FILTERS,
  CREATE_STRATEGIC_SNAPSHOT_REQUEST,
  CREATE_STRATEGIC_SNAPSHOT_SUCCESS,
  CREATE_STRATEGIC_SNAPSHOT_FAILURE
} from './actionTypes';
import type { StrategicActionTypes } from './types';

const initialState: StrategicState = {
  loading: false,
  error: null,
  overview: null,
  coverage: null,
  trends: null,
  guaranteeDistribution: null,
  committeeComparison: null,
  recommendations: [],
  filters: {
    timeRange: '30days',
    focus: 'coverage',
    selectedCommittee: null
  },
  lastUpdated: undefined
};

const HIGH_COVERAGE_THRESHOLD = 80;
const MEDIUM_COVERAGE_THRESHOLD = 65;

const buildRecommendations = (state: StrategicState): StrategicRecommendation[] => {
  const recs: StrategicRecommendation[] = [];
  const { overview, coverage, trends, filters } = state;

  if (!overview || !coverage) {
    return recs;
  }

  const overallCoverage = coverage.summary.coveragePercentage;

  if (overallCoverage < MEDIUM_COVERAGE_THRESHOLD) {
    recs.push({
      id: 'coverage-critical',
      title: 'Critical Coverage Push',
      description: 'System-wide coverage is below target. Deploy full campaign surge teams to priority committees.',
      priority: 'critical',
      actions: [
        'Activate top-performing guarantee collectors for high-priority committees',
        'Schedule daily follow-up events focused on low-coverage sections',
        'Deploy supervisor coaching sessions to boost conversion quality'
      ],
      expectedImpact: 'Increase overall coverage by +10% within one week'
    });
  } else if (overallCoverage < HIGH_COVERAGE_THRESHOLD) {
    recs.push({
      id: 'coverage-boost',
      title: 'Guarantee Surge Blitz',
      description: 'Coverage is approaching targets. Concentrate efforts on trailing committees to reach 80%+ guarantee confirmation.',
      priority: 'high',
      actions: [
        'Assign focused teams to bottom 5 committees by coverage',
        'Run outreach events with strongest conversion agents',
        'Monitor daily progress via Strategic Command Center'
      ],
      expectedImpact: 'Lift coverage in weak zones by +8%'
    });
  }

  const lowCoverageCommittees = coverage.byCommittee
    .filter((item) => item.coveragePercentage < MEDIUM_COVERAGE_THRESHOLD)
    .slice(0, 3)
    .map((item) => `${item.committeeCode} (${item.coveragePercentage}%)`);

  if (lowCoverageCommittees.length) {
    recs.push({
      id: 'committee-gap-plan',
      title: 'Coverage Gap Closure Plan',
      description: 'Target committees with the lowest coverage to prevent vote loss.',
      priority: 'high',
      actions: [
        'Deploy on-the-ground visits for underperforming committees',
        'Reassign top agents to reinforce coverage gaps',
        'Track conversions daily and escalate blockers immediately'
      ],
      targetCommittees: lowCoverageCommittees,
      expectedImpact: 'Close remaining coverage gap by +5-7%'
    });
  }

  if (trends) {
    const recentMomentum = trends.guarantees.slice(-3);
    if (recentMomentum.length === 3) {
      const [d1, d2, d3] = recentMomentum;
      if (d3 < d2 && d2 < d1) {
        recs.push({
          id: 'momentum-recovery',
          title: 'Momentum Recovery Sprint',
          description: 'Guarantee collection momentum is slowing. Initiate re-engagement sprint to recover growth.',
          priority: 'medium',
          actions: [
            'Launch motivational briefings with field teams',
            'Introduce incentive program for rapid confirmation',
            'Communicate urgency to supporters via tailored messaging'
          ],
          expectedImpact: 'Restore positive momentum and add +50 guarantees over 3 days'
        });
      }
    }
  }

  if (filters.focus === 'resources' && overview.users.supervisors < Math.max(3, overview.users.total / 10)) {
    recs.push({
      id: 'resource-escalation',
      title: 'Resource Escalation Plan',
      description: 'Supervisor coverage may be insufficient for campaign scale. Reinforce leadership bandwidth.',
      priority: 'medium',
      actions: [
        'Promote high-performing agents to temporary supervisors',
        'Implement shift-based coverage for high-volume committees',
        'Audit daily task completion to ensure accountability'
      ],
      expectedImpact: 'Increase field oversight capacity by 25%'
    });
  }

  return recs;
};

const strategicReducer = (state = initialState, action: StrategicActionTypes): StrategicState => {
  switch (action.type) {
    case GET_STRATEGIC_DATA_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case GET_STRATEGIC_DATA_SUCCESS: {
      const nextState: StrategicState = {
        ...state,
        loading: false,
        error: null,
        overview: action.payload.overview,
        coverage: action.payload.coverage,
        trends: action.payload.trends,
        guaranteeDistribution: action.payload.guaranteeDistribution,
        committeeComparison: action.payload.committeeComparison,
        recommendations: state.recommendations,
        lastUpdated: action.payload.lastUpdated
      };

      return {
        ...nextState,
        recommendations: buildRecommendations(nextState)
      };
    }
    case GET_STRATEGIC_DATA_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case SET_STRATEGIC_FILTERS: {
      const updatedState: StrategicState = {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload
        }
      };

      return {
        ...updatedState,
        recommendations: buildRecommendations(updatedState)
      };
    }
    case CREATE_STRATEGIC_SNAPSHOT_REQUEST:
      return {
        ...state,
        loading: true
      };
    case CREATE_STRATEGIC_SNAPSHOT_SUCCESS:
      return {
        ...state,
        loading: false
      };
    case CREATE_STRATEGIC_SNAPSHOT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

export const strategicReducerInitialState = initialState;
export default strategicReducer;
