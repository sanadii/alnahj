/**
 * ScrollableCardContainer Component
 * 
 * A reusable horizontal scrollable container for displaying cards.
 * Shows 2 cards at a time on mobile, with horizontal scrolling to view more.
 * 
 * @component ScrollableCardContainer
 */

import React, { ReactNode } from 'react';
import { Box, BoxProps } from '@mui/material';

export interface ScrollableCardContainerProps extends Omit<BoxProps, 'children'> {
  /** Card components to display */
  children: ReactNode | ReactNode[];
}

/**
 * ScrollableCardContainer
 * 
 * Displays cards in a horizontal scrollable layout with:
 * - 2 cards visible at a time
 * - Smooth scrolling with snap points
 * - Hidden scrollbar on mobile
 * - Styled scrollbar on desktop
 */
const ScrollableCardContainer: React.FC<ScrollableCardContainerProps> = ({
  children,
  sx,
  ...otherProps
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        overflowX: { xs: 'auto', md: 'visible' },
        overflowY: 'hidden',
        scrollSnapType: { xs: 'x mandatory', md: 'none' },
        scrollbarWidth: 'thin',
        // Smooth scrolling for mobile
        WebkitOverflowScrolling: 'touch',
        '&::-webkit-scrollbar': {
          height: 8
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'transparent'
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          borderRadius: 4
        },
        '&::-webkit-scrollbar-thumb:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.3)'
        },
        // Hide scrollbar on mobile for cleaner look
        '@media (max-width: 600px)': {
          '&::-webkit-scrollbar': {
            display: 'none'
          },
          scrollbarWidth: 'none'
        },
        ...sx
      }}
      {...otherProps}
    >
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        
        return (
          <Box
            key={index}
            sx={{
              minWidth: { xs: 'calc(50% - 8px)', md: 'calc(25% - 12px)' },
              flexShrink: 0,
              scrollSnapAlign: 'start',
              // On desktop, allow cards to grow to fill space
              flex: { xs: '0 0 auto', md: '1 1 auto' }
            }}
          >
            {child}
          </Box>
        );
      })}
    </Box>
  );
};

export default ScrollableCardContainer;

