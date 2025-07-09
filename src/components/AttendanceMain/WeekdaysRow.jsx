const daysOfWeek = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

const WeekdaysRow = () => (
  <div className="weekdays">
    {daysOfWeek.map(day => (
      <div key={day} className="weekday">{day}</div>
    ))}
  </div>
);

export default WeekdaysRow;
