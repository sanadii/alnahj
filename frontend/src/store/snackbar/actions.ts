import * as types from './reducer';

export const openSnackbar = (payload) => ({ type: types.SNACKBAR_OPEN, payload });
export const closeSnackbar = () => ({ type: types.SNACKBAR_CLOSE });
export const handlerDense = (dense) => ({ type: types.SNACKBAR_DENSE, payload: { dense } });
export const handlerIncrease = (maxStack) => ({ type: types.SNACKBAR_INCREASE, payload: { maxStack } });
export const handlerIconVariants = (iconVariant, hideIconVariant) => ({
  type: types.SNACKBAR_ICON_VARIANTS,
  payload: { iconVariant, hideIconVariant }
});
