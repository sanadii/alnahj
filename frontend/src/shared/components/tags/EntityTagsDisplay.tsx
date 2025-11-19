import React, { useState } from 'react';
import {
  Box,
  Stack,
  Chip,
  alpha,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography
} from '@mui/material';
import { IconTag, IconX } from '@tabler/icons-react';

export interface EntityTagsDisplayProps {
  tags: string[];
  entityId: number;
  maxDisplayTags?: number;
  onUpdate?: (tags: string[]) => void;
  updateApiCall: (id: number, data: { tags: string[] }) => Promise<any>;
  size?: 'small' | 'medium';
  variant?: 'filled' | 'outlined';
  showManageButton?: boolean;
  readonly?: boolean;
}

/**
 * EntityTagsDisplay Component
 * Reusable tags display and management component for any entity
 *
 * @example
 * ```tsx
 * <EntityTagsDisplay
 *   tags={client.tags || []}
 *   entityId={client.id}
 *   maxDisplayTags={3}
 *   updateApiCall={updateClientApi}
 *   onUpdate={handleTagsUpdate}
 * />
 * ```
 */
const EntityTagsDisplay: React.FC<EntityTagsDisplayProps> = ({
  tags = [],
  entityId,
  maxDisplayTags = 3,
  onUpdate,
  updateApiCall,
  size = 'small',
  variant = 'filled',
  showManageButton = true,
  readonly = false
}) => {
  const theme = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editedTags, setEditedTags] = useState<string[]>(tags);
  const [newTag, setNewTag] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenDialog = () => {
    setEditedTags(tags);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setNewTag('');
  };

  const handleAddTag = () => {
    if (newTag.trim() && !editedTags.includes(newTag.trim())) {
      setEditedTags([...editedTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditedTags(editedTags.filter((tag) => tag !== tagToRemove));
  };

  const handleSaveTags = async () => {
    setIsSaving(true);
    try {
      await updateApiCall(entityId, { tags: editedTags });
      if (onUpdate) {
        onUpdate(editedTags);
      }
      handleCloseDialog();
    } catch (error) {
    } finally {
      setIsSaving(false);
    }
  };

  // Display logic: show up to maxDisplayTags, then "+X more"
  const displayTags = tags.slice(0, maxDisplayTags);
  const remainingTagsCount = tags.length - maxDisplayTags;

  return (
    <>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {/* Display Tags */}
        {displayTags.map((tag, index) => (
          <Chip
            key={index}
            label={tag}
            size={size}
            icon={<IconTag size={12} />}
            variant={variant}
            sx={{
              fontSize: '0.75rem',
              bgcolor: variant === 'filled' ? alpha(theme.palette.primary.main, 0.1) : undefined,
              color: variant === 'filled' ? theme.palette.primary.main : undefined,
              '& .MuiChip-icon': {
                color: variant === 'filled' ? theme.palette.primary.main : undefined
              }
            }}
          />
        ))}

        {/* "+X more" indicator */}
        {remainingTagsCount > 0 && (
          <Chip
            label={`+${remainingTagsCount} more`}
            size={size}
            variant="filled"
            onClick={!readonly ? handleOpenDialog : undefined}
            sx={{
              fontSize: '0.75rem',
              bgcolor: alpha(theme.palette.grey[500], 0.1),
              color: theme.palette.grey[700],
              cursor: readonly ? 'default' : 'pointer',
              '&:hover': !readonly
                ? {
                    bgcolor: alpha(theme.palette.grey[500], 0.2)
                  }
                : {}
            }}
          />
        )}

        {/* Manage Tags Button */}
        {showManageButton && !readonly && (
          <Chip
            label="Manage Tags"
            size={size}
            icon={<IconTag size={12} />}
            variant="outlined"
            onClick={handleOpenDialog}
            sx={{
              fontSize: '0.75rem',
              borderStyle: 'dashed',
              cursor: 'pointer',
              '&:hover': {
                borderColor: theme.palette.primary.main,
                bgcolor: alpha(theme.palette.primary.main, 0.04)
              }
            }}
          />
        )}
      </Stack>

      {/* Tags Management Dialog */}
      {!readonly && (
        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconTag size={20} />
              <Typography variant="h6">Manage Tags</Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 1 }}>
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <TextField
                  size="small"
                  placeholder="Add new tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  sx={{ flex: 1 }}
                />
                <Button variant="contained" onClick={handleAddTag} disabled={!newTag.trim()}>
                  Add
                </Button>
              </Stack>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Current Tags:
              </Typography>

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {editedTags.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    No tags assigned
                  </Typography>
                ) : (
                  editedTags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => handleRemoveTag(tag)}
                      deleteIcon={<IconX size={14} />}
                      color="primary"
                      variant="outlined"
                    />
                  ))
                )}
              </Stack>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSaveTags} variant="contained" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Tags'}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default EntityTagsDisplay;
