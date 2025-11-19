import React from 'react';
import { Box, Tabs, Tab, useTheme, alpha } from '@mui/material';

export interface TabItem {
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

interface EntityTabsProps {
  tabs: TabItem[];
  value?: number;
  onChange?: (event: React.SyntheticEvent, newValue: number) => void;
  variant?: 'standard' | 'scrollable' | 'fullWidth';
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <Box role="tabpanel" hidden={value !== index} id={`entity-tabpanel-${index}`} aria-labelledby={`entity-tab-${index}`}>
      {value === index && <Box sx={{ py: 3, px: { xs: 2, sm: 3 } }}>{children}</Box>}
    </Box>
  );
};

/**
 * Reusable tabbed interface component with premium styling
 * Can be used for any entity detail page
 *
 * @example
 * ```typescript
 * <EntityTabs
 *   tabs={[
 *     { label: "Overview", icon: <IconHome />, content: <OverviewContent /> },
 *     { label: "Details", icon: <IconInfoCircle />, content: <DetailsContent /> },
 *     { label: "History", icon: <IconHistory />, content: <HistoryContent /> }
 *   ]}
 *   value={activeTab}
 *   onChange={(e, newValue) => setActiveTab(newValue)}
 * />
 * ```
 */
const EntityTabs: React.FC<EntityTabsProps> = ({ tabs, value: controlledValue, onChange, variant = 'standard' }) => {
  const theme = useTheme();
  const [internalValue, setInternalValue] = React.useState(0);

  // Use controlled value if provided, otherwise use internal state
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    if (onChange) {
      onChange(event, newValue);
    } else {
      setInternalValue(newValue);
    }
  };

  return (
    <Box>
      {/* Tabs Header */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          background: `linear-gradient(to bottom, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.default, 0.4)} 100%)`
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          variant={variant}
          scrollButtons="auto"
          aria-label="entity tabs"
          sx={{
            px: 2,
            '& .MuiTab-root': {
              minHeight: 48,
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.9rem',
              marginRight: 0.5,
              borderRadius: '8px 8px 0 0',
              transition: 'all 0.2s',
              '&:first-of-type': {
                ml: 0
              },
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                color: theme.palette.primary.main
              },
              '&.Mui-selected': {
                color: theme.palette.primary.main,
                fontWeight: 600,
                backgroundColor: alpha(theme.palette.primary.main, 0.12)
              }
            },
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: '3px 3px 0 0',
              background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
            }
          }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
              icon={tab.icon}
              iconPosition="start"
              disabled={tab.disabled}
              id={`entity-tab-${index}`}
              aria-controls={`entity-tabpanel-${index}`}
            />
          ))}
        </Tabs>
      </Box>

      {/* Tab Panels */}
      {tabs.map((tab, index) => (
        <TabPanel key={index} value={value} index={index}>
          {tab.content}
        </TabPanel>
      ))}
    </Box>
  );
};

export default EntityTabs;
