import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import {
  Chip,
  CircularProgress,
  Tabs,
  Tab,
  Stack,
  Typography,
  Box,
  IconButton,
  Tooltip,
  useMediaQuery,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from '@mui/icons-material';
import { getElectorRelationships } from 'helpers/api/electors';
import ElectorCard from '../ElectorCard';
import type { Elector } from 'types/electors';
import type { Relative } from './types';

type WorkTab = 'department' | 'team' | 'family';
type RelationshipsResponse = Awaited<ReturnType<typeof getElectorRelationships>>;

interface RelationshipsCardProps {
  elector: Elector | null;
  open: boolean;
  renderRelationActions: (relative: Relative) => React.ReactNode;
}

export interface RelationshipsCardHandle {
  updateRelative: (kocId: string, updater: (relative: Relative) => Relative) => void;
}

const RelationshipsCard = forwardRef<RelationshipsCardHandle, RelationshipsCardProps>(({ elector, open, renderRelationActions }, ref) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<WorkTab>('department');

  const [sameDepartment, setSameDepartment] = useState<Relative[]>([]);
  const [sameDepartmentCount, setSameDepartmentCount] = useState(0);
  const [departmentPage, setDepartmentPage] = useState(1);
  const [departmentPageSize, setDepartmentPageSize] = useState(10);
  const [departmentHasNext, setDepartmentHasNext] = useState(false);
  const [departmentHasPrevious, setDepartmentHasPrevious] = useState(false);

  const [sameTeam, setSameTeam] = useState<Relative[]>([]);
  const [sameTeamCount, setSameTeamCount] = useState(0);
  const [teamPage, setTeamPage] = useState(1);
  const [teamPageSize, setTeamPageSize] = useState(10);
  const [teamHasNext, setTeamHasNext] = useState(false);
  const [teamHasPrevious, setTeamHasPrevious] = useState(false);

  const [familyRelationships, setFamilyRelationships] = useState<Relative[]>([]);
  const [familyCount, setFamilyCount] = useState(0);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setDepartmentPage(1);
    setTeamPage(1);
    setActiveTab('department');
    setHasHydrated(false);
  }, [elector?.kocId, open]);

  useEffect(() => {
    if (!open || !elector?.kocId) {
      setSameDepartment([]);
      setSameDepartmentCount(0);
      setSameTeam([]);
      setSameTeamCount(0);
      setFamilyRelationships([]);
      setFamilyCount(0);
      setDepartmentHasNext(false);
      setDepartmentHasPrevious(false);
      setTeamHasNext(false);
      setTeamHasPrevious(false);
      setDepartmentPageSize(10);
      setTeamPageSize(10);
      setLoading(false);
      setHasHydrated(false);
      return;
    }

    setLoading(true);
    getElectorRelationships(elector.kocId, departmentPage, teamPage, departmentPageSize, teamPageSize)
      .then((response: RelationshipsResponse) => {
        const familyList = response.data?.family || [];
        setFamilyRelationships(familyList);
        setFamilyCount(familyList.length);

        const departmentPayload = response.data?.sameDepartment;
        const departmentList = departmentPayload?.results || [];
        const departmentTotalCount = departmentPayload?.pagination?.count ?? departmentList.length;
        setSameDepartment(departmentList);
        setSameDepartmentCount(departmentTotalCount);
        setDepartmentHasNext(departmentPayload?.pagination?.hasNext ?? false);
        setDepartmentHasPrevious(departmentPayload?.pagination?.hasPrevious ?? false);
        setDepartmentPage(departmentPayload?.pagination?.page ?? departmentPage);
        setDepartmentPageSize(departmentPayload?.pagination?.pageSize ?? departmentPageSize);

        const teamPayload = response.data?.sameTeam;
        const teamList = teamPayload?.results || [];
        const teamTotalCount = teamPayload?.pagination?.count ?? teamList.length;
        setSameTeam(teamList);
        setSameTeamCount(teamTotalCount);
        setTeamHasNext(teamPayload?.pagination?.hasNext ?? false);
        setTeamHasPrevious(teamPayload?.pagination?.hasPrevious ?? false);
        setTeamPage(teamPayload?.pagination?.page ?? teamPage);
        setTeamPageSize(teamPayload?.pagination?.pageSize ?? teamPageSize);

        let defaultTab: WorkTab = 'department';
        if (departmentTotalCount) {
          defaultTab = 'department';
        } else if (teamTotalCount) {
          defaultTab = 'team';
        } else if (familyList.length) {
          defaultTab = 'family';
        }
        setActiveTab(defaultTab);
        setHasHydrated(true);
      })
      .catch((error) => {
        console.error('❌ [RelationshipsCard] Failed to load relationships:', error);
        setSameDepartment([]);
        setSameDepartmentCount(0);
        setSameTeam([]);
        setSameTeamCount(0);
        setFamilyRelationships([]);
        setFamilyCount(0);
        setDepartmentHasNext(false);
        setDepartmentHasPrevious(false);
        setTeamHasNext(false);
        setTeamHasPrevious(false);
        setActiveTab('department');
        setHasHydrated(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [open, elector?.kocId, departmentPage, teamPage, departmentPageSize, teamPageSize]);

  const departmentTotalPages = useMemo(() => {
    if (!sameDepartmentCount || departmentPageSize <= 0) return 0;
    return Math.max(1, Math.ceil(sameDepartmentCount / departmentPageSize));
  }, [sameDepartmentCount, departmentPageSize]);

  const teamTotalPages = useMemo(() => {
    if (!sameTeamCount || teamPageSize <= 0) return 0;
    return Math.max(1, Math.ceil(sameTeamCount / teamPageSize));
  }, [sameTeamCount, teamPageSize]);

  const isDepartmentTab = activeTab === 'department';
  const isTeamTab = activeTab === 'team';
  const isFamilyTab = activeTab === 'family';

  const list = isDepartmentTab ? sameDepartment : isTeamTab ? sameTeam : familyRelationships;
  const totalPages = isDepartmentTab ? departmentTotalPages : isTeamTab ? teamTotalPages : 1;
  const currentPage = isDepartmentTab ? departmentPage : isTeamTab ? teamPage : 1;
  const hasPrev = isDepartmentTab ? departmentHasPrevious : isTeamTab ? teamHasPrevious : false;
  const hasNext = isDepartmentTab ? departmentHasNext : isTeamTab ? teamHasNext : false;
  const showPagination = isDepartmentTab || isTeamTab;
  const emptyStateText = isFamilyTab ? 'No family relationships found.' : 'No colleagues found in this category.';

  const handlePrev = () => {
    if (isDepartmentTab) {
      setDepartmentPage(Math.max(departmentPage - 1, 1));
    } else if (isTeamTab) {
      setTeamPage(Math.max(teamPage - 1, 1));
    }
  };

  const handleNext = () => {
    if (isDepartmentTab) {
      setDepartmentPage(departmentPage + 1);
    } else if (isTeamTab) {
      setTeamPage(teamPage + 1);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, value: WorkTab) => {
    setActiveTab(value);
    if (value === 'department') {
      setDepartmentPage(1);
    } else if (value === 'team') {
      setTeamPage(1);
    }
  };

  useImperativeHandle(ref, () => ({
    updateRelative: (kocId: string, updater: (relative: Relative) => Relative) => {
      setSameDepartment((prev) => prev.map((rel) => (rel.kocId === kocId ? updater(rel) : rel)));
      setSameTeam((prev) => prev.map((rel) => (rel.kocId === kocId ? updater(rel) : rel)));
      setFamilyRelationships((prev) => prev.map((rel) => (rel.kocId === kocId ? updater(rel) : rel)));
    }
  }));

  if (!elector) {
    return null;
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="scrollable"
        allowScrollButtonsMobile
        sx={{
          mb: isMobile ? 1 : 2,
          minHeight: isMobile ? 32 : 48,
          '& .MuiTabs-indicator': {
            height: isMobile ? 2 : 3,
            borderRadius: 3,
            bgcolor: theme.palette.primary.main
          },
          '& .MuiTab-root': {
            minHeight: isMobile ? 32 : 48,
            textTransform: 'none',
            fontWeight: 700,
            fontSize: isMobile ? '0.75rem' : '0.95rem',
            color: alpha(theme.palette.text.primary, 0.7),
            gap: isMobile ? 0.4 : 8,
            flexDirection: 'row',
            alignItems: 'center',
            px: isMobile ? 0.75 : 2
          },
          '& .Mui-selected': {
            color: theme.palette.text.primary
          }
        }}
      >
        <Tab
          label={
            <Stack direction="row" spacing={isMobile ? 0.4 : 1} alignItems="center">
              <Typography variant={isMobile ? 'body2' : 'body1'} fontWeight={700} sx={{ fontSize: isMobile ? '0.75rem' : undefined }}>
                Departments
              </Typography>
              <Chip
                label={sameDepartmentCount}
                size="small"
                color="primary"
                variant="outlined"
                sx={{
                  height: isMobile ? 18 : 24,
                  fontSize: isMobile ? '0.65rem' : undefined,
                  '& .MuiChip-label': {
                    px: isMobile ? 0.5 : 1
                  }
                }}
              />
            </Stack>
          }
          value="department"
          disabled={!sameDepartmentCount}
        />
        <Tab
          label={
            <Stack direction="row" spacing={isMobile ? 0.4 : 1} alignItems="center">
              <Typography variant={isMobile ? 'body2' : 'body1'} fontWeight={700} sx={{ fontSize: isMobile ? '0.75rem' : undefined }}>
                Team
              </Typography>
              <Chip
                label={sameTeamCount}
                size="small"
                color="primary"
                variant="outlined"
                sx={{
                  height: isMobile ? 18 : 24,
                  fontSize: isMobile ? '0.65rem' : undefined,
                  '& .MuiChip-label': {
                    px: isMobile ? 0.5 : 1
                  }
                }}
              />
            </Stack>
          }
          value="team"
          disabled={!sameTeamCount}
        />
        <Tab
          label={
            <Stack direction="row" spacing={isMobile ? 0.4 : 1} alignItems="center">
              <Typography variant={isMobile ? 'body2' : 'body1'} fontWeight={700} sx={{ fontSize: isMobile ? '0.75rem' : undefined }}>
                Family
              </Typography>
              <Chip
                label={familyCount}
                size="small"
                color="primary"
                variant="outlined"
                sx={{
                  height: isMobile ? 18 : 24,
                  fontSize: isMobile ? '0.65rem' : undefined,
                  '& .MuiChip-label': {
                    px: isMobile ? 0.5 : 1
                  }
                }}
              />
            </Stack>
          }
          value="family"
          disabled={!familyCount}
        />
      </Tabs>

      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2, position: 'relative', minHeight: 200 }}>
        {!hasHydrated && loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress size={24} />
          </Box>
        ) : list.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {emptyStateText}
          </Typography>
        ) : (
          <>
            {loading && hasHydrated && (
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  bgcolor: 'rgba(255,255,255,0.6)',
                  backdropFilter: 'blur(2px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1
                }}
              >
                <CircularProgress size={28} />
              </Box>
            )}
            {isMobile ? (
              // Mobile: Card layout
              <Stack spacing={2}>
                {list.map((person) => (
                  <ElectorCard
                    key={`${activeTab}-${person.kocId}`}
                    elector={person}
                    renderActions={(p) => renderRelationActions(p as Relative)}
                  />
                ))}
              </Stack>
            ) : (
              // Desktop: Table layout
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>KOC ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Mobile</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {list.map((person) => (
                      <TableRow key={`${activeTab}-${person.kocId}`} hover>
                        <TableCell>
                          <Chip
                            label={person.kocId}
                            size="small"
                            sx={{
                              bgcolor: theme.palette.primary.main,
                              color: 'white',
                              fontWeight: 600,
                              '&:hover': {
                                bgcolor: theme.palette.primary.dark
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{person.fullName}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{person.mobile || '-'}</Typography>
                        </TableCell>
                        <TableCell align="center">{renderRelationActions(person as Relative)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {showPagination && (
              <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center" sx={{ mt: 2 }}>
                <Tooltip title="Previous page">
                  <span>
                    <IconButton size="small" disabled={loading || !hasPrev} onClick={handlePrev}>
                      <ChevronLeftIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Next page">
                  <span>
                    <IconButton size="small" disabled={loading || !hasNext} onClick={handleNext}>
                      <ChevronRightIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
                {totalPages > 0 && (
                  <Typography variant="caption" color="text.secondary">
                    Page {Math.min(currentPage, totalPages)} of {totalPages}
                  </Typography>
                )}
              </Stack>
            )}
          </>
        )}
      </Box>
    </Box>
  );
});

RelationshipsCard.displayName = 'RelationshipsCard';

export default RelationshipsCard;
