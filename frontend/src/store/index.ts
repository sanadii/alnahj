import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './rootReducer';
import rootSaga from './rootSaga';

const sagaMiddleware = createSagaMiddleware();

export function createAppStore(initialState = {}) {

  const store = configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: false, // Disable thunk since we're using sagas
        serializableCheck: false // Disable serializable check to prevent refresh
      }).concat(sagaMiddleware),
    devTools: import.meta.env.MODE !== 'production'
  });


  sagaMiddleware.run(rootSaga);


  return store;
}

// Create and export the default store instance
const store = createAppStore();

export { store };

// Export RootState type
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks for better type safety
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Re-export untyped hooks for backward compatibility (deprecated - use useAppDispatch/useAppSelector)
export { useSelector, useDispatch } from 'react-redux';

// Export dispatch for backward compatibility (from the default store instance)
export const dispatch = store.dispatch;
