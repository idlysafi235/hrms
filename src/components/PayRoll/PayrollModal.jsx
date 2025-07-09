import React from 'react';
import formatDate from '../common/FormatDate';

const PayrollModal= ({ payroll, onClose }) => {
  const excludeFields = new Set(['id', 'isHourly', 'payType']);
  const hourlyExclude = [
    'basic', 'hra', 'specialAllowance', 'medicalAllowance',
    'conveyanceAllowance', 'leavetravelAssistance',
    'phoneinternetReimbursment', 'foodReimbursment',
    'pf', 'professionalTax', 'lop'
  ];
  const regularExclude = ['hourlyRate', 'hoursWorked'];

  if (payroll.isHourly || payroll.payType === 'hourly') {
    hourlyExclude.forEach(f => excludeFields.add(f));
  } else {
    regularExclude.forEach(f => excludeFields.add(f));
  }

  const fields = Object.entries(payroll).filter(([key]) => !excludeFields.has(key));

  return (
    <div className="timesheetmodal-overlay">
      <div className="timesheetmodal">
        <div className="timesheetmodal-header">
          <h2>Payroll Details - {payroll.employeeId}</h2>
        </div>
        <div className="timesheetmodal-content grid-container">
          {fields.map(([key, value]) => (
            <div className="field" key={key}>
              <label>{key}</label>
              <span>{String(value)}</span>
            </div>
          ))}
        </div>
        <div className="timesheetmodal-footer">
          <button className="timesheetmodal-close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default PayrollModal;
