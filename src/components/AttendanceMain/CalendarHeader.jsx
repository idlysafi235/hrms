
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const CalendarHeader = ({ year, setYear, onTodayClick }) => (
  <div className="calendar-header">
    <div className="year-container">
      <FaArrowLeft className="arrow" onClick={() => setYear(year - 1)} />
      <span className="year">{year}</span>
      <FaArrowRight className="arrow" onClick={() => setYear(year + 1)} />

    </div>
    <button className="show-today" onClick={onTodayClick}>
      Show Today
    </button>
  </div>
);

export default CalendarHeader;
