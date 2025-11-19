import React from 'react';
import { Box, Chip, Typography } from '@mui/material';

interface TagsDisplayProps {
  tags: string[];
  maxDisplay?: number;
  showLabel?: boolean;
  size?: 'small' | 'medium';
  color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

const TagsDisplay: React.FC<TagsDisplayProps> = ({ tags = [], maxDisplay = 5, showLabel = true, size = 'small', color = 'primary' }) => {
  if (!tags || tags.length === 0) {
    return showLabel ? (
      <Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Tags
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          No tags assigned
        </Typography>
      </Box>
    ) : null;
  }

  const displayTags = tags.slice(0, maxDisplay);
  const remainingCount = tags.length - maxDisplay;

  return (
    <Box>
      {showLabel && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Tags
        </Typography>
      )}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {displayTags.map((tag, index) => (
          <Chip
            key={index}
            label={tag}
            size={size}
            color={color}
            variant="outlined"
            sx={{
              fontSize: '0.75rem',
              height: size === 'small' ? 24 : 32,
              '& .MuiChip-label': {
                px: 1
              }
            }}
          />
        ))}
        {remainingCount > 0 && (
          <Chip
            label={`+${remainingCount} more`}
            size={size}
            variant="outlined"
            sx={{
              fontSize: '0.75rem',
              height: size === 'small' ? 24 : 32,
              color: 'text.secondary',
              borderColor: 'text.secondary',
              '& .MuiChip-label': {
                px: 1
              }
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default TagsDisplay;
