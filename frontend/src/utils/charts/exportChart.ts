/**
 * Chart Export Utilities
 * Export charts as images or data
 */

/**
 * Export chart as PNG image
 */
export const exportChartAsPNG = (elementId: string, filename: string = 'chart') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id "${elementId}" not found`);
    return;
  }

  // Use html2canvas if available
  if (typeof window !== 'undefined' && (window as any).html2canvas) {
    (window as any).html2canvas(element).then((canvas: HTMLCanvasElement) => {
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  } else {
  }
};

/**
 * Export data as CSV
 */
export const exportDataAsCSV = (data: any[], filename: string = 'data') => {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          // Escape commas and quotes
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        })
        .join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
};

/**
 * Export data as Excel (simple format)
 */
export const exportDataAsExcel = (data: any[], filename: string = 'data', sheetName: string = 'Sheet1') => {
  // This is a placeholder - in a real implementation, you'd use a library like xlsx

  // For now, fall back to CSV
  exportDataAsCSV(data, filename);
};

/**
 * Copy data to clipboard
 */
export const copyDataToClipboard = async (data: string) => {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(data);
      return true;
    } catch (err) {
      console.error('Failed to copy:', err);
      return false;
    }
  }
  return false;
};

export default {
  exportChartAsPNG,
  exportDataAsCSV,
  exportDataAsExcel,
  copyDataToClipboard
};
