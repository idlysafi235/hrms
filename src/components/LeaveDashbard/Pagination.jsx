function Pagination({ currentPage, totalItems, rowsPerPage, onPageChange }) {
  const totalPages = Math.ceil(totalItems / rowsPerPage) || 1;

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const noData = totalItems === 0;

  return (
    <div className="pagination">
      <button onClick={handlePrev} disabled={noData || currentPage === 1}>
        Prev
      </button>
      <span>
        {noData ? "0 of 0" : `${currentPage} of ${totalPages}`}
      </span>
      <button onClick={handleNext} disabled={noData || currentPage === totalPages}>
        Next
      </button>
    </div>
  );
}

export default Pagination;
