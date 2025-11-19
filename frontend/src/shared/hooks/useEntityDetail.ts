import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

export interface UseEntityDetailConfig<T> {
  /** Redux selector to get entity data */
  selector: (state: any) => {
    data: T | null;
    loading: boolean;
    error: any;
  };
  /** Redux action to fetch entity */
  fetchAction: (id: number) => any;
  /** Base route for navigation */
  baseRoute: string;
  /** Optional: Transform ID from params */
  transformId?: (id: string) => number;
}

export interface UseEntityDetailReturn<T> {
  entity: T | null;
  loading: boolean;
  error: any;
  id: string | undefined;
  tabValue: number;
  setTabValue: (value: number) => void;
  navigate: ReturnType<typeof useNavigate>;
  dispatch: ReturnType<typeof useDispatch>;
}

/**
 * Generic hook for entity detail pages
 * Handles common logic for fetching, state management, and navigation
 *
 * @example
 * ```typescript
 * const { entity: client, loading, error, tabValue, setTabValue, navigate } = useEntityDetail({
 *   selector: (state) => state.clients,
 *   fetchAction: getClientRequest,
 *   baseRoute: '/application/crm/clients'
 * });
 * ```
 */
export function useEntityDetail<T = any>(config: UseEntityDetailConfig<T>): UseEntityDetailReturn<T> {
  const { selector, fetchAction, transformId = (id) => parseInt(id) } = config;

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get entity state from Redux using useSelector
  const entityState = useSelector(selector);
  const { data: entity, loading, error } = entityState || { data: null, loading: false, error: null };

  // Local state
  const [tabValue, setTabValue] = useState(0);

  // Fetch entity data
  useEffect(() => {
    if (id) {
      dispatch(fetchAction(transformId(id)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id]);

  return {
    entity,
    loading,
    error,
    id,
    tabValue,
    setTabValue,
    navigate,
    dispatch
  };
}
