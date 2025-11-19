// Action Types
export const SNACKBAR_OPEN = 'SNACKBAR_OPEN';
export const SNACKBAR_CLOSE = 'SNACKBAR_CLOSE';
export const SNACKBAR_DENSE = 'SNACKBAR_DENSE';
export const SNACKBAR_INCREASE = 'SNACKBAR_INCREASE';
export const SNACKBAR_ICON_VARIANTS = 'SNACKBAR_ICON_VARIANTS';

const initialState = {
  action: false,
  open: false,
  message: 'Note archived',
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'right'
  },
  severity: 'success',
  variant: 'default',
  alert: {
    color: 'primary',
    variant: 'filled'
  },
  transition: 'Fade',
  close: true,
  maxStack: 3,
  dense: false,
  iconVariant: 'usedefault',
  actionButton: false,
  hideIconVariant: false
};

export default function snackbarReducer(state = initialState, action) {
  switch (action.type) {
    case SNACKBAR_OPEN: {
      const { open, message, anchorOrigin, variant, alert, transition, close, actionButton, severity, hideIconVariant } = action.payload;
      return {
        ...state,
        action: !state.action,
        open: open || initialState.open,
        message: message || initialState.message,
        anchorOrigin: anchorOrigin || initialState.anchorOrigin,
        variant: variant || initialState.variant,
        alert: {
          color: alert?.color || initialState.alert.color,
          variant: alert?.variant || initialState.alert.variant
        },
        severity: severity || initialState.severity,
        transition: transition || initialState.transition,
        close: close === false ? close : initialState.close,
        actionButton: actionButton || initialState.actionButton,
        hideIconVariant: hideIconVariant === undefined ? initialState.hideIconVariant : hideIconVariant
      };
    }
    case SNACKBAR_CLOSE:
      return { ...state, open: false };
    case SNACKBAR_DENSE:
      return { ...state, dense: action.payload.dense };
    case SNACKBAR_INCREASE:
      return { ...state, maxStack: action.payload.maxStack };
    case SNACKBAR_ICON_VARIANTS:
      return {
        ...state,
        iconVariant: action.payload.iconVariant || initialState.iconVariant,
        hideIconVariant: action.payload.hideIconVariant === undefined ? initialState.hideIconVariant : action.payload.hideIconVariant
      };
    default:
      return state;
  }
}
