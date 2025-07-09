import React from 'react';

const TimesheetRow = ({ entry, index, onChange, onRemove, disabled }) => {
  const date = new Date(entry.date);

  return (
    <div className="timesheet-entry">
      <div className="entry-top-row">
        <input
          type="text"
          name="date"
          value={date.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}
          readOnly
          disabled
          className="readonly-date"
        />

        <input
          type="text"
          name="project"
          placeholder="Project"
          value={entry.project}
          onChange={(e) => onChange(date, index, e)}
          required
          disabled={disabled}
          maxLength={18}
        />

        <input
          type="text"
          name="hoursWorked"
          placeholder="Hours Worked"
          value={entry.hoursWorked}
          onChange={(e) => {
            const value = e.target.value;
            const regex = /^([1-9]|[1-9]\.[0-9]?)?$/;
            if (value === '' || regex.test(value)) {
              onChange(date, index, e);
            }
          }}
          inputMode="decimal"
          required
          disabled={disabled}
        />

        {(index === 0 || disabled) ? (
          <div className="button-placeholder" style={{ width: '36px' }} />
        ) : (
          <button
            type="button"
            className="remove-btn"
            onClick={onRemove}
            title="Remove row"
          >
            ✕
          </button>
        )}
      </div>
      <div className="entry-description-row">
        <textarea
          name="taskDescription"
          placeholder="Task Description"
          value={entry.taskDescription}
          onChange={(e) => onChange(date, index, e)}
          disabled={disabled}
          rows={3}
          maxLength={300}
        />
      </div>
    </div>
  );
};

export default TimesheetRow;
