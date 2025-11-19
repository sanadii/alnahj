/**
 * Party Card Component
 * Displays individual party information with candidate count and statistics
 * Expandable to show list of candidates
 */

import React, { useState } from 'react';
import { Paper, Typography, Stack, Box, LinearProgress, Collapse, Divider, Chip, Avatar, IconButton, Tooltip } from '@mui/material';
import { IconChevronDown, IconChevronUp, IconUser } from '@tabler/icons-react';

export interface Candidate {
  id: number | string;
  name: string;
  number?: number;
  status?: string;
}

export interface PartyCardProps {
  party: {
    id: number | string;
    name: string;
    color: string;
    logo?: string | null;
    candidateCount?: number;
    isIndependent?: boolean; // Flag for independent candidates
  };
  candidates?: Candidate[]; // List of candidates in this party
  totalCandidates: number;
  expanded?: boolean; // Controlled expand state from parent
}

export const PartyCard: React.FC<PartyCardProps> = ({ party, candidates = [], totalCandidates, expanded: controlledExpanded }) => {
  const [localExpanded, setLocalExpanded] = useState(false);

  // Use controlled state from parent if provided, otherwise use local state
  const expanded = controlledExpanded !== undefined ? controlledExpanded : localExpanded;

  const candidateCount = party.candidateCount || candidates.length || 0;
  const sharePercentage = totalCandidates > 0 ? Math.round((candidateCount / totalCandidates) * 100) : 0;
  const isIndependent = party.isIndependent || party.name.toLowerCase() === 'independent';

  const handleToggleExpand = () => {
    // Only toggle local state if not controlled by parent
    if (controlledExpanded === undefined) {
      setLocalExpanded(!localExpanded);
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2.5,
        borderRadius: 2,
        border: '2px solid',
        borderColor: expanded ? party.color : 'divider',
        height: '100%',
        transition: 'all 0.3s ease',
        cursor: candidateCount > 0 && controlledExpanded === undefined ? 'pointer' : 'default',
        '&:hover': {
          elevation: 6,
          transform: candidateCount > 0 && controlledExpanded === undefined ? 'translateY(-4px)' : 'none',
          boxShadow: 4,
          borderColor: party.color
        }
      }}
      onClick={candidateCount > 0 && controlledExpanded === undefined ? handleToggleExpand : undefined}
    >
      <Stack spacing={2}>
        {/* Party Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ flex: 1 }}>
            {party.logo ? (
              <Avatar
                src={party.logo}
                alt={party.name}
                variant={isIndependent ? 'rounded' : 'circular'}
                sx={{
                  width: 36,
                  height: 36,
                  border: '3px solid',
                  borderColor: 'background.paper',
                  boxShadow: 3
                }}
              />
            ) : (
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: isIndependent ? '8px' : '50%',
                  backgroundColor: party.color,
                  border: '3px solid',
                  borderColor: 'background.paper',
                  boxShadow: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {isIndependent && <IconUser size={16} color="white" />}
              </Box>
            )}
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="h6" fontWeight={700}>
                  {party.name}
                </Typography>
                {isIndependent && <Chip label="Independent" size="small" color="default" sx={{ height: 20, fontSize: '0.7rem' }} />}
              </Stack>
              <Typography variant="caption" color="text.secondary">
                {isIndependent ? 'Independent Candidates' : 'Political Party'}
              </Typography>
            </Box>
          </Stack>

          {/* Expand/Collapse Button - Only show when NOT controlled by parent */}
          {candidateCount > 0 && controlledExpanded === undefined && (
            <Tooltip title={expanded ? 'Hide candidates' : 'Show candidates'}>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleExpand();
                }}
              >
                {expanded ? <IconChevronUp size={20} /> : <IconChevronDown size={20} />}
              </IconButton>
            </Tooltip>
          )}
        </Stack>

        {/* Candidate Count */}
        <Box
          sx={{
            bgcolor: 'background.default',
            p: 2,
            borderRadius: 1.5,
            textAlign: 'center'
          }}
        >
          <Typography variant="h3" fontWeight={700} color={party.color}>
            {candidateCount}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Candidates
          </Typography>
        </Box>

        {/* Progress */}
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              Share of Total
            </Typography>
            <Typography variant="caption" fontWeight={700}>
              {sharePercentage}%
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={sharePercentage}
            sx={{
              height: 8,
              borderRadius: 1,
              bgcolor: 'action.hover',
              '& .MuiLinearProgress-bar': {
                bgcolor: party.color
              }
            }}
          />
        </Box>

        {/* Candidates List (Expandable) */}
        {candidates.length > 0 && (
          <Collapse in={expanded} timeout={300}>
            <Box sx={{ pt: 2 }}>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
                Candidates ({candidates.length})
              </Typography>
              <Stack spacing={1}>
                {candidates.map((candidate, index) => (
                  <Box
                    key={candidate.id}
                    sx={{
                      p: 1.5,
                      borderRadius: 1,
                      bgcolor: 'background.default',
                      border: '1px solid',
                      borderColor: 'divider',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: 'action.hover',
                        borderColor: party.color,
                        transform: 'translateX(4px)'
                      }
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: party.color,
                          fontSize: '0.875rem',
                          fontWeight: 700
                        }}
                      >
                        {candidate.number || index + 1}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" fontWeight={600}>
                          {candidate.name}
                        </Typography>
                        {candidate.status && (
                          <Typography variant="caption" color="text.secondary">
                            {candidate.status}
                          </Typography>
                        )}
                      </Box>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Collapse>
        )}

        {/* Show hint when no candidates data but count exists */}
        {candidates.length === 0 && candidateCount > 0 && expanded && (
          <Collapse in={expanded} timeout={300}>
            <Box sx={{ pt: 2 }}>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
                Candidate details not loaded
              </Typography>
            </Box>
          </Collapse>
        )}
      </Stack>
    </Paper>
  );
};

export default PartyCard;
