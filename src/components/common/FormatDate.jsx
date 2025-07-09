
const formatDate = (dateStr) => {
  if (!dateStr) return '–';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export default formatDate;
