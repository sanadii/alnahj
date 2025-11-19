import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Breadcrumbs } from '@mui/material';

interface BreadCrumbProps {
  title: string;
  pageTitle: string;
}

const BreadCrumb: React.FC<BreadCrumbProps> = ({ title, pageTitle }) => {
  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h4" sx={{ mb: 0 }}>
          {title}
        </Typography>

        <Breadcrumbs aria-label="breadcrumb">
          <Link to="#" style={{ textDecoration: 'none', color: 'inherit' }}>
            {pageTitle}
          </Link>
          <Typography color="text.primary">{title}</Typography>
        </Breadcrumbs>
      </Box>
    </React.Fragment>
  );
};

export default BreadCrumb;
