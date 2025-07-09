const HolidayList = ({ upcomingHolidays }) => (
    <div className="holiday-section">
      <div className="holiday-title">🎉 Holidays List</div>
      <ul className="holiday-list">
  {upcomingHolidays.length === 0 ? (
    <li>No holidays.</li>
  ) : (
    upcomingHolidays.map(({ id, holidayDate, name }) => {
      const dateObj = new Date(holidayDate);
      const formattedDate = dateObj.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      const key = id ?? `${holidayDate}-${name}`;

      return (
        <li key={key} className="holiday-item">
          <span className="holiday-date">{formattedDate}</span>
          <span className="holiday-name">{name}</span>
        </li>
      );
    })
  )}
</ul>

    </div>
  );
  
  export default HolidayList;
  