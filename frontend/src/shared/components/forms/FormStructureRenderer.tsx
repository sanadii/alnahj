import React from 'react';
import { Grid, FormLabel, FormHelperText } from '@mui/material';

interface FormStructureRendererProps {
  formStructure: string;
  renderInputFields: () => JSX.Element;
  validation: {
    touched: { [key: string]: boolean };
    errors: { [key: string]: string };
  };
  colSize?: number;
  icon?: string;
  id: string;
  label: string;
  name: string;
}

const FormStructureRenderer: React.FC<FormStructureRendererProps> = ({
  formStructure,
  renderInputFields,
  validation,
  colSize,
  icon,
  id,
  label,
  name
}) => {
  switch (formStructure) {
    case 'table':
      return (
        <React.Fragment>
          {renderInputFields()}
          {validation.touched[name] && validation.errors[name] && <FormHelperText error>{validation.errors[name]}</FormHelperText>}
        </React.Fragment>
      );
    default:
      return (
        <Grid size={12} lg={colSize || 12} sx={{ mb: 3 }}>
          {!icon && (
            <FormLabel htmlFor={id} sx={{ mb: 1, display: 'block' }}>
              {label}
            </FormLabel>
          )}
          {renderInputFields()}
          {validation.touched[name] && validation.errors[name] && <FormHelperText error>{validation.errors[name]}</FormHelperText>}
        </Grid>
      );
  }
};

export default FormStructureRenderer;
