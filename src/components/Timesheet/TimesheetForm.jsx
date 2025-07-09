import React from 'react';
import TimesheetRow from './TimesheetRow';

const TimesheetForm = ({ entries, onChange, onAdd, onRemove, disabled }) => {
  const maxRowsReached = entries.length >= 3;

  return (
    <div className="timesheet-form">
      <button
        className="add-btn-form"
        onClick={onAdd}
        disabled={disabled || maxRowsReached}
        title={
          disabled
            ? "Editing disabled"
            : maxRowsReached
            ? "Maximum 3 rows allowed"
            : ""
        }
        type="button"
      >
        + Add Row
      </button>

      {entries && entries.length > 0 ? (
        entries.map((entry, index) => (
          <TimesheetRow
            key={index}
            index={index}
            entry={entry}
            onChange={onChange}
            onRemove={() => onRemove(index)}
            disabled={disabled || entry.isSubmitted}
          />
        ))
      ) : (
        <div>No entries for selected date.</div>
      )}
    </div>
  );
};

export default TimesheetForm;
