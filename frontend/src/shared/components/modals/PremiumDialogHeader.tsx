/**
 * PremiumDialogHeader Component
 * Beautiful gradient header for dialogs with icon, title, subtitle, and close button
 *
 * @component PremiumDialogHeader
 * @description A stunning dialog header with gradient background, glassmorphism icon box,
 * animated close button, and floating effect. Perfect for premium dialog experiences.
 *
 * @example
 * ```tsx
 * <PremiumDialogHeader
 *   icon={<IconEdit size={32} color="white" />}
 *   title="Edit Elector"
 *   subtitle="Update elector information"
 *   onClose={handleClose}
 * />
 * ```
 */

import React from 'react';
import { Box, Stack, Typography, IconButton, alpha } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

export interface PremiumDialogHeaderProps {
  /** Icon to display in the glassmorphism box */
  icon: React.ReactNode;
  /** Main title text */
  title: string;
  /** Subtitle/description text */
  subtitle: string;
  /** Callback when close button is clicked */
  onClose: () => void;
  /** Optional custom gradient (defaults to purple gradient) */
  gradient?: string;
  /** Optional custom background pattern */
  withPattern?: boolean;
}

/**
 * PremiumDialogHeader Component
 *
 * Features:
 * - Beautiful gradient background
 * - Glassmorphism icon container
 * - Animated close button (rotates on hover)
 * - Optional floating pattern effect
 * - Fully customizable colors
 * - Responsive design
 */
const PremiumDialogHeader: React.FC<PremiumDialogHeaderProps> = ({
  icon,
  title,
  subtitle,
  onClose,
  gradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  withPattern = true
}) => {
  return (
    <Box
      sx={{
        background: gradient,
        px: 4,
        py: 3,
        position: 'relative',
        overflow: 'hidden',
        ...(withPattern && {
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-50%',
            right: '-20%',
            width: '40%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            animation: 'float 6s ease-in-out infinite',
            '@keyframes float': {
              '0%, 100%': { transform: 'translateY(0px)' },
              '50%': { transform: 'translateY(-20px)' }
            }
          }
        })
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
          {/* Glassmorphism Icon Box */}
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2.5,
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              flexShrink: 0
            }}
          >
            {icon}
          </Box>

          {/* Title & Subtitle */}
          <Box>
            <Typography
              variant="h4"
              fontWeight={800}
              sx={{
                color: 'white',
                letterSpacing: '-0.5px',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.85)',
                fontWeight: 500
              }}
            >
              {subtitle}
            </Typography>
          </Box>
        </Box>

        {/* Animated Close Button */}
        <IconButton
          onClick={onClose}
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            transition: 'all 0.3s ease',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              transform: 'rotate(90deg)'
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </Stack>
    </Box>
  );
};

export default PremiumDialogHeader;

/**
 * Gradient Presets for PremiumDialogHeader
 */
export const DialogHeaderGradients = {
  purple: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  blue: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  pink: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  green: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  orange: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  red: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
  indigo: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
  teal: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
} as const;
