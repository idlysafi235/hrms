import React from 'react';

const PrintViewButton = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button onClick={handlePrint} className="print-view-button">
      Print View
    </button>
  );
};

export default PrintViewButton;
