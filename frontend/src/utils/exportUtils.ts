/**
 * Export Utilities
 *
 * Helper functions for exporting data to various formats
 */

import type { Employee } from 'types/hr';

// ==============================|| EXPORT TO CSV ||============================== //

export const exportToCSV = (data: Employee[], columns: string[], filename: string = 'employees.csv') => {
  // Column headers mapping
  const columnLabels: Record<string, string> = {
    employee_id: 'Employee ID',
    full_name: 'Full Name',
    first_name: 'First Name',
    last_name: 'Last Name',
    email: 'Email',
    phone: 'Phone',
    mobile: 'Mobile',
    position: 'Position',
    job_title: 'Job Title',
    department_name: 'Department',
    employment_type: 'Employment Type',
    hire_date: 'Hire Date',
    salary: 'Salary',
    commission_rate: 'Commission Rate (%)',
    manager_name: 'Manager',
    is_active: 'Status',
    is_bookable: 'Bookable',
    address: 'Address',
    city: 'City',
    country: 'Country'
  };

  // Create CSV header
  const headers = columns.map((col) => columnLabels[col] || col).join(',');

  // Create CSV rows
  const rows = data.map((employee) => {
    return columns
      .map((col) => {
        let value = employee[col as keyof Employee];

        // Format specific fields
        if (col === 'is_active') {
          value = employee.is_active ? 'Active' : 'Inactive';
        } else if (col === 'is_bookable') {
          value = employee.is_bookable ? 'Yes' : 'No';
        } else if (col === 'employment_type') {
          value = (value as string).replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
        }

        // Handle null/undefined
        if (value === null || value === undefined) {
          return '';
        }

        // Escape quotes and wrap in quotes if contains comma
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }

        return stringValue;
      })
      .join(',');
  });

  // Combine header and rows
  const csv = [headers, ...rows].join('\n');

  // Create blob and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  downloadFile(blob, filename);
};

// ==============================|| EXPORT TO EXCEL ||============================== //

export const exportToExcel = (data: Employee[], columns: string[], filename: string = 'employees.xlsx') => {
  // For a real implementation, you would use a library like xlsx or exceljs
  // For now, we'll use CSV as a fallback (Excel can open CSV files)
  const csvFilename = filename.replace('.xlsx', '.csv');
  exportToCSV(data, columns, csvFilename);

  // TODO: Implement proper Excel export using xlsx library
  // Example implementation:
  /*
  import * as XLSX from 'xlsx';
  
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Employees');
  XLSX.writeFile(wb, filename);
  */
};

// ==============================|| EXPORT TO PDF ||============================== //

export const exportToPDF = (data: Employee[], columns: string[], filename: string = 'employees.pdf') => {
  // For a real implementation, you would use a library like jsPDF
  // For now, we'll create a simple HTML table and use browser print
  const columnLabels: Record<string, string> = {
    employee_id: 'Employee ID',
    full_name: 'Full Name',
    email: 'Email',
    phone: 'Phone',
    mobile: 'Mobile',
    position: 'Position',
    job_title: 'Job Title',
    department_name: 'Department',
    employment_type: 'Employment Type',
    hire_date: 'Hire Date',
    salary: 'Salary',
    commission_rate: 'Commission Rate',
    manager_name: 'Manager',
    is_active: 'Status',
    is_bookable: 'Bookable',
    address: 'Address',
    city: 'City',
    country: 'Country'
  };

  // Create HTML table
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Employee Export</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #4CAF50; color: white; font-weight: bold; }
        tr:nth-child(even) { background-color: #f2f2f2; }
        .footer { margin-top: 20px; font-size: 12px; color: #666; }
        @media print {
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <h1>Employee Report</h1>
      <p>Generated: ${new Date().toLocaleString()}</p>
      <p>Total Employees: ${data.length}</p>
      
      <table>
        <thead>
          <tr>
            ${columns.map((col) => `<th>${columnLabels[col] || col}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
  `;

  data.forEach((employee) => {
    html += '<tr>';
    columns.forEach((col) => {
      let value = employee[col as keyof Employee];

      // Format specific fields
      if (col === 'is_active') {
        value = employee.is_active ? 'Active' : 'Inactive';
      } else if (col === 'is_bookable') {
        value = employee.is_bookable ? 'Yes' : 'No';
      } else if (col === 'employment_type') {
        value = (value as string).replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
      }

      html += `<td>${value || '-'}</td>`;
    });
    html += '</tr>';
  });

  html += `
        </tbody>
      </table>
      
      <div class="footer">
        <p>This is a system-generated report.</p>
      </div>
      
      <div class="no-print" style="margin-top: 30px;">
        <button onclick="window.print()" style="padding: 10px 20px; font-size: 16px; cursor: pointer;">
          Print / Save as PDF
        </button>
        <button onclick="window.close()" style="padding: 10px 20px; font-size: 16px; cursor: pointer; margin-left: 10px;">
          Close
        </button>
      </div>
    </body>
    </html>
  `;

  // Open in new window for printing
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  }

  // TODO: Implement proper PDF generation using jsPDF
  // Example implementation:
  /*
  import jsPDF from 'jspdf';
  import 'jspdf-autotable';
  
  const doc = new jsPDF();
  doc.text('Employee Report', 14, 15);
  doc.autoTable({
    head: [columns.map(col => columnLabels[col] || col)],
    body: data.map(emp => columns.map(col => emp[col as keyof Employee] || '')),
  });
  doc.save(filename);
  */
};

// ==============================|| DOWNLOAD FILE HELPER ||============================== //

const downloadFile = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// ==============================|| FORMAT DATE ||============================== //

export const formatDate = (dateString: string | null): string => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
