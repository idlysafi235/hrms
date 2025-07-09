const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

const MonthSelector = ({ currentMonth, setCurrentMonth }) => (
  <div className="month-row">
    {months.map((month, i) => (
      <div
        key={month}
        className={`month ${i === currentMonth ? "selected" : ""}`}
        onClick={() => setCurrentMonth(i)}
      >
        {month}
      </div>
    ))}
  </div>
);

export default MonthSelector;
