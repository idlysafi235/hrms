import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatTotalHours } from "../../utils/timeUtils";

const getLocalDateKey = (date) => date.toLocaleDateString("en-CA");

const DateBox = ({
  date,
  currentMonth,
  today,
  record = null,
  onClick,
  selected = false,
  tags = [],
  holidayLookup = {},
}) => {
  const [showAllTags, setShowAllTags] = useState(false);

  if (!date) {
    console.error("DateBox received undefined or null date prop");
    return null;
  }


  const isCurrentMonth = date.getMonth() === currentMonth;
  const isWeekend = date.getDay() === 6 || date.getDay() === 0;
  const isToday = date.toDateString() === today.toDateString();
  const isPastOrToday = date <= today;

  const parseHoursString = (hoursStr) => {
    if (!hoursStr || typeof hoursStr !== "string") return 0;
    const parts = hoursStr.trim().split(" ");
    if (parts.length !== 2) return 0;
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    if (isNaN(hours) || isNaN(minutes)) return 0;
    return hours + minutes / 60;
  };

  let hoursRaw = 0;
  if (typeof record?.totalHours === "string") {
    hoursRaw = parseHoursString(record.totalHours);
  } else if (typeof record?.totalHours === "number") {
    hoursRaw = record.totalHours;
  } else if (typeof record?.totalHoursRaw === "number") {
    hoursRaw = record.totalHoursRaw;
  }

  const hoursDisplay = formatTotalHours(hoursRaw);
  const totalHoursClass =
    hoursRaw >= 8 ? "positive" : hoursRaw > 0 ? "grey" : "zero";

  const leaveTags = tags.filter((tag) => typeof tag === "object" && tag.leaveType);
  const holidayTags = tags.filter((tag) => typeof tag === "string");

  const allTags = [
    ...holidayTags.map((tag) => ({ type: "holiday", label: tag })),
    ...leaveTags.map((tag) => ({
      type: "leave",
      label: tag.leaveType + (tag.fraction === 0.5 ? " (Half Day)" : ""),
    })),
  ];

  const maxVisibleTags = 2;

  const visibleTags = showAllTags ? allTags : allTags.slice(0, maxVisibleTags);

  const hiddenCount = allTags.length - maxVisibleTags;

  const handleToggleTags = (e) => {
    e.stopPropagation();
    setShowAllTags((prev) => !prev);
  };

  return (
    <div
      className={`date-box ${!isCurrentMonth ? "faded" : ""} ${isWeekend ? "weekend" : ""}`}
      onClick={onClick}
    >
      <div className={`date-number ${isToday ? "today" : ""} ${selected ? "selected" : ""}`}>
        {date.getDate()}
      </div>

      {isToday && <div className="emoji">😊</div>}

      <div className="tag-container">
        {visibleTags.map((tag, i) => (
          <div
            key={`${tag.type}-${i}`}
            className={`tag ${tag.type}`}
            title={tag.label} 
          >
            {tag.label}
          </div>
        ))}

        {!showAllTags && hiddenCount > 0 && (
          <div
            className="tag more-tag"
            onClick={handleToggleTags}
            style={{ cursor: "pointer", fontWeight: "bold" }}
            title="View more tags"
          >
            +{hiddenCount} more
          </div>
        )}

        {showAllTags && hiddenCount > 0 && (
          <div
            className="tag more-tag"
            onClick={handleToggleTags}
            style={{ cursor: "pointer", fontWeight: "bold" }}
            title="Show less"
          >
            Show less ▲
          </div>
        )}

        {isPastOrToday &&
          (hoursRaw > 0 || allTags.length === 0) &&
          (!isWeekend || hoursRaw > 0) && (
            // Tooltip fully disabled, only hours shown:
            <div className={`total-hours ${totalHoursClass}`}>
              {hoursDisplay}
            </div>

            // Tooltip UI (commented out):
            /*
            <div className="tooltip-wrapper">
              <div className={`total-hours ${totalHoursClass}`}>
                {hoursDisplay}
              </div>
              {(totalHoursClass === "zero" || totalHoursClass === "grey") && (
                <div className="tooltip-box">
                  <p>{tooltipMessage}</p>
                  <button className="tooltip-button" onClick={handleRequestClick}>
                    Request Time Change
                  </button>
                </div>
              )}
            </div>
            */
          )}
      </div>
    </div>
  );
};

export default DateBox;
