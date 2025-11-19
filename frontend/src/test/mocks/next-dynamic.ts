/**
 * Mock for next/dynamic
 * Used in testing since the project uses Vite (not Next.js)
 */

import React from 'react';

const dynamic = (loader: () => Promise<any>) => {
  // Return a simple mock component
  const DynamicComponent = () => React.createElement('div', { 'data-testid': 'dynamic-component' }, 'Dynamic Component');
  return DynamicComponent;
};

export default dynamic;
