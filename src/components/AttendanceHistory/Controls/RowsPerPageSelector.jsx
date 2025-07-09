import React from 'react';

const RowsPerPageSelector = ({ rowsPerPage, setRowsPerPage }) => {
  const options = [10, 25, 50, 100];

  return (
    <div className="rows-per-page-selector" style={{ marginBottom: 10 }}>
      <label htmlFor="rowsPerPage">Rows per page: </label>
      <select
        id="rowsPerPage"
        value={rowsPerPage}
        onChange={e => setRowsPerPage(Number(e.target.value))}
      >
        {options.map(opt => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RowsPerPageSelector;
