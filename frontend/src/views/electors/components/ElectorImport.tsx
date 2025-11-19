/**
 * Elector Import Page
 * Election Management System - Bulk import electors from CSV
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Alert,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { Upload as UploadIcon, Download as DownloadIcon } from '@mui/icons-material';
import { PremiumCard } from 'shared/components';
import { IconFileImport } from '@tabler/icons-react';

const ElectorImport: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setImportResult(null);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    setImporting(true);

    // Simulate import
    setTimeout(() => {
      setImportResult({
        success: true,
        imported: 150,
        updated: 25,
        failed: 5,
        errors: [
          { row: 10, message: 'Invalid KOC ID format' },
          { row: 25, message: 'Missing required field: nameFirst' },
          { row: 67, message: 'Committee not found' }
        ]
      });
      setImporting(false);
    }, 2000);
  };

  const handleDownloadTemplate = () => {
  };

  return (
    <PremiumCard title="Import Electors" icon={<IconFileImport size={24} />} variant="elevated" color="primary">
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Instructions */}
          <Grid size={12}>
            <Alert severity="info">
              <Typography variant="h6" gutterBottom>
                How to Import Electors
              </Typography>
              <Typography component="div">
                <ol>
                  <li>Download the CSV template below</li>
                  <li>Fill in the elector information</li>
                  <li>Upload the completed CSV file</li>
                  <li>Review the import results</li>
                </ol>
              </Typography>
            </Alert>
          </Grid>

          {/* Template Download */}
          <Grid size={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Step 1: Download Template
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  Download the CSV template with all required columns and format specifications.
                </Typography>
                <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleDownloadTemplate}>
                  Download CSV Template
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* File Upload */}
          <Grid size={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Step 2: Upload CSV File
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  Select the completed CSV file to import electors.
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <input accept=".csv" style={{ display: 'none' }} id="csv-file-input" type="file" onChange={handleFileSelect} />
                  <label htmlFor="csv-file-input">
                    <Button variant="outlined" component="span" startIcon={<UploadIcon />}>
                      Select CSV File
                    </Button>
                  </label>
                  {selectedFile && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Selected: {selectedFile.name}
                    </Typography>
                  )}
                </Box>

                {selectedFile && !importing && !importResult && (
                  <Button variant="contained" onClick={handleImport}>
                    Start Import
                  </Button>
                )}

                {importing && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Importing electors...
                    </Typography>
                    <LinearProgress />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Import Results */}
          {importResult && (
            <Grid size={12}>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Import Results
                  </Typography>

                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 6, md: 3 }}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.lighter', borderRadius: 1 }}>
                        <Typography variant="h4" color="success.main">
                          {importResult.imported}
                        </Typography>
                        <Typography variant="body2">Imported</Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 6, md: 3 }}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'info.lighter', borderRadius: 1 }}>
                        <Typography variant="h4" color="info.main">
                          {importResult.updated}
                        </Typography>
                        <Typography variant="body2">Updated</Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 6, md: 3 }}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'error.lighter', borderRadius: 1 }}>
                        <Typography variant="h4" color="error.main">
                          {importResult.failed}
                        </Typography>
                        <Typography variant="body2">Failed</Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  {importResult.errors && importResult.errors.length > 0 && (
                    <>
                      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                        Errors
                      </Typography>
                      <Paper sx={{ maxHeight: 300, overflow: 'auto' }}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Row</TableCell>
                              <TableCell>Error Message</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {importResult.errors.map((error: any, index: number) => (
                              <TableRow key={index}>
                                <TableCell>{error.row}</TableCell>
                                <TableCell>{error.message}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Paper>
                    </>
                  )}

                  <Box sx={{ mt: 3 }}>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setSelectedFile(null);
                        setImportResult(null);
                      }}
                      sx={{ mr: 1 }}
                    >
                      Import Another File
                    </Button>
                    <Button variant="contained" onClick={() => navigate('/electors/list')}>
                      View Electors
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Actions */}
          <Grid size={12}>
            <Button variant="outlined" onClick={() => navigate('/electors/list')}>
              Back to Electors
            </Button>
          </Grid>
        </Grid>
      </Box>
    </PremiumCard>
  );
};

export default ElectorImport;
