import React from 'react';

const ExportDataButton = ({ data, filename = 'attendance_data.csv' }) => {
  const handleExport = () => {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','), 
      ...data.map(row => headers.map(field => JSON.stringify(row[field] ?? '')).join(',')),
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
  };

//   return (
//     // <button onClick={handleExport} className="export-data-button">
//     //   Export CSV
//     // </button>
//   );
};

export default ExportDataButton;
