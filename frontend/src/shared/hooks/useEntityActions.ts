import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

export interface UseEntityActionsConfig {
  /** Base route for navigation */
  baseRoute: string;
  /** Optional: Entity ID for edit/delete actions */
  entityId?: number;
  /** Optional: Entity email for email actions */
  entityEmail?: string;
  /** Optional: Entity mobile for WhatsApp actions */
  entityMobile?: string;
}

export interface UseEntityActionsReturn {
  handleEdit: () => void;
  handleDelete: () => void;
  handleSendEmail: () => void;
  handleSendWhatsApp: () => void;
  handleNavigateToList: () => void;
  handleNavigateToDashboard: () => void;
}

/**
 * Generic hook for entity action handlers
 * Provides common CRUD and communication actions
 *
 * @example
 * ```typescript
 * const handlers = useEntityActions({
 *   baseRoute: '/application/crm/clients',
 *   entityId: client.id,
 *   entityEmail: client.email,
 *   entityMobile: client.mobile
 * });
 * ```
 */
export function useEntityActions(config: UseEntityActionsConfig): UseEntityActionsReturn {
  const { baseRoute, entityId, entityEmail, entityMobile } = config;
  const navigate = useNavigate();

  const handleEdit = useCallback(() => {
    if (entityId) {
      navigate(`${baseRoute}/edit/${entityId}`);
    }
  }, [navigate, baseRoute, entityId]);

  const handleDelete = useCallback(() => {
    if (entityId) {
      // TODO: Implement delete with confirmation dialog
    }
  }, [entityId]);

  const handleSendEmail = useCallback(() => {
    if (entityEmail) {
      window.location.href = `mailto:${entityEmail}`;
    }
  }, [entityEmail]);

  const handleSendWhatsApp = useCallback(() => {
    if (entityMobile) {
      // Remove non-numeric characters
      const cleanMobile = entityMobile.replace(/\D/g, '');
      window.open(`https://wa.me/${cleanMobile}`, '_blank');
    }
  }, [entityMobile]);

  const handleNavigateToList = useCallback(() => {
    navigate(`${baseRoute}/list`);
  }, [navigate, baseRoute]);

  const handleNavigateToDashboard = useCallback(() => {
    navigate(baseRoute);
  }, [navigate, baseRoute]);

  return {
    handleEdit,
    handleDelete,
    handleSendEmail,
    handleSendWhatsApp,
    handleNavigateToList,
    handleNavigateToDashboard
  };
}
