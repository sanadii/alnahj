import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Chip, IconButton, Box } from '@mui/material';

// Component, Constants & Hooks
import { StatusOptions } from 'shared/constants';

const handleValidDate = (date: string): string => {
  return moment(date).format('YYYY-MM-DD');
};

// CheckBox props
type CheckboxHeaderProps = {
  checkedAll: () => void;
};

const CheckboxHeader: React.FC<CheckboxHeaderProps> = ({ checkedAll }) => (
  <input type="checkbox" id="checkBoxAll" className="form-check-input" onClick={checkedAll} />
);

// CheckBox props
type CheckboxCellProps = {
  row: {
    original: {
      id: string;
    };
  };
  deleteCheckbox: () => void;
};

const CheckboxCell: React.FC<CheckboxCellProps> = ({ row, deleteCheckbox }) => (
  <input type="checkbox" className="checkboxSelector form-check-input" value={row.original.id} onChange={deleteCheckbox} />
);

// Id props
type IdProps = {
  row: {
    original: {
      id: string;
      slug: string;
    };
  };
};
const Id: React.FC<IdProps> = ({ row }) => (
  <Link to={`/dashboard/elections/${row.original.slug}`} className="fw-medium link-primary">
    {row.original.id}
  </Link>
);

const Name = (cell: any) => {
  return (
    <React.Fragment>
      <Link to="/apps-projects-overview" className="fw-medium link-primary">
        {cell.getValue()}
      </Link>
    </React.Fragment>
  );
};

const Notes = (cell: any) => {
  return (
    <React.Fragment>
      <span className="fw-medium link-primary">{cell.getValue()}</span>
    </React.Fragment>
  );
};
// Description props & value
type DescriptionProps = {
  row: {
    original: {
      value: string;
    };
  };
};

const Description: React.FC<DescriptionProps> = ({ row }) => <b>{row.original.value}</b>;

const Amount = (cell: any) => {
  return (
    <React.Fragment>
      <strong className="fw-medium link-primary">{cell.getValue()} KD</strong>
    </React.Fragment>
  );
};

const DateComponent = (cell: any) => {
  return (
    <React.Fragment>
      <strong className="fw-medium link-primary">{cell.getValue()}</strong>
    </React.Fragment>
  );
};
const Status = (cell: any) => {
  return (
    <React.Fragment>
      {cell.getValue() === 'declined' ? (
        <span className="badge bg-secondary-subtle text-secondary text-uppercase">{cell.getValue()}</span>
      ) : cell.getValue() === 'declined' ? (
        <span className="badge bg-info-subtle text-info text-uppercase">{cell.getValue()}</span>
      ) : cell.getValue() === 'reviewed' ? (
        <span className="badge bg-success-subtle text-success text-uppercase">{cell.getValue()}</span>
      ) : cell.getValue() === 'pending' ? (
        <span className="badge bg-warning-subtle text-warning text-uppercase">{cell.getValue()}</span>
      ) : null}
    </React.Fragment>
  );
};

const StatusExpenses = (cell: any) => {
  return (
    <React.Fragment>
      {cell.getValue() === 'paid' ? (
        <span className="badge bg-secondary-subtle text-secondary text-uppercase">{cell.getValue()}</span>
      ) : cell.getValue() === 'pending' ? (
        <span className="badge bg-warning-subtle text-warning text-uppercase">{cell.getValue()}</span>
      ) : null}
    </React.Fragment>
  );
};

const Priority = (cell: any) => {
  return (
    <React.Fragment>
      {cell.getValue() === 'Medium' ? (
        <span className="badge bg-warning text-uppercase">{cell.getValue()}</span>
      ) : cell.getValue() === 'High' ? (
        <span className="badge bg-danger text-uppercase">{cell.getValue()}</span>
      ) : cell.getValue() === 'Low' ? (
        <span className="badge bg-success text-uppercase">{cell.getValue()}</span>
      ) : null}
    </React.Fragment>
  );
};

const CreateBy = (cell: any) => {
  return <React.Fragment>{cell.getValue()}</React.Fragment>;
};

type ActionsProps = {
  cell: {
    value: string;
    row: {
      original: any; // Replace 'any' with a more specific type if possible
    };
  };
  handleItemClick: (itemData: any) => void; // Replace 'any' with a more specific type if possible
  onClickDelete: (itemData: any) => void; // Replace 'any' with a more specific type if possible
};

const Actions: React.FC<ActionsProps> = ({ cell, handleItemClick, onClickDelete }) => {
  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <button
        className="btn btn-sm btn-soft-info edit-list"
        onClick={() => {
          const itemData = cell.row.original;
          handleItemClick(itemData);
        }}
      >
        <i className="ri-pencil-fill align-bottom" />
      </button>
      <button
        className="btn btn-sm btn-soft-danger remove-list"
        onClick={() => {
          const itemData = cell.row.original;
          onClickDelete(itemData);
        }}
      >
        <i className="ri-delete-bin-5-fill align-bottom" />
      </button>
    </Box>
  );
};

export {
  Id,
  CheckboxHeader,
  CheckboxCell,
  Name,
  Notes,
  Description,
  DateComponent as Date,
  Status,
  StatusExpenses,
  CreateBy,
  Amount,
  Actions
};
