import React from 'react';
import { Card, CardContent, Chip, CircularProgress, Divider, Stack, Typography, Box } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import type { Relative } from './types';

interface FamilyRelationshipsCardProps {
  loading: boolean;
  brothers: Relative[];
  fathers: Relative[];
  sons: Relative[];
  cousins: Relative[];
  renderRelationActions: (relative: Relative) => React.ReactNode;
}

const FamilyRelationshipsCard: React.FC<FamilyRelationshipsCardProps> = ({
  loading,
  brothers,
  fathers,
  sons,
  cousins,
  renderRelationActions
}) => {
  const theme = useTheme();
  const relationshipGroups = [
    { label: 'Brother', color: 'primary' as const, data: brothers },
    { label: 'Father', color: 'success' as const, data: fathers },
    { label: 'Son', color: 'warning' as const, data: sons },
    { label: 'Cousin', color: 'secondary' as const, data: cousins }
  ];

  return (
    <Card
      sx={{
        position: 'relative',
        borderRadius: 3,
        border: '2px solid',
        borderColor: alpha(theme.palette.primary.main, 0.1),
        background:
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)'
            : 'linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%)',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '5px',
          height: '100%',
          background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)'
        }
      }}
    >
      <CardContent sx={{ position: 'relative' }}>
        <Divider textAlign="left" sx={{ mb: 2 }}>
          <Chip label="Family Relationships" color="secondary" variant="outlined" />
        </Divider>

        <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress size={24} />
            </Box>
          ) : relationshipGroups.every((group) => group.data.length === 0) ? (
            <Typography variant="body2" color="text.secondary">
              No family relationships found.
            </Typography>
          ) : (
            <Stack spacing={1.5}>
              {relationshipGroups
                .flatMap((group) => group.data.map((relative) => ({ group, relative })))
                .map(({ group, relative }) => (
                  <Stack
                    key={`${group.label}-${relative.kocId}`}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ px: 1.5, py: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip label={group.label} color={group.color} variant="outlined" size="small" sx={{ fontWeight: 600 }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {relative.fullName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          KOC: {relative.kocId}
                        </Typography>
                      </Box>
                    </Stack>
                    {renderRelationActions(relative)}
                  </Stack>
                ))}
            </Stack>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default FamilyRelationshipsCard;
