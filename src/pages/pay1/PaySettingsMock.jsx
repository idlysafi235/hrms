import React, { useState } from 'react';
import './PaySettingsMock.css';

export default function PaySettingsMock() {
  const [settings, setSettings] = useState({
    paySchedule: 'Monthly',
    cutoffDay: 25,
    fiscalYearStart: '2025-04-01',
    fiscalYearEnd: '2026-03-31',
    defaultWorkHoursPerDay: 8,
    defaultPayType: 'Salaried',
    autoGeneratePayroll: true,
    enableTDS: true,
    lopCalculation: 'Per Day Basis',
    holidaysConsideredPaid: true
  });

  return (
    <div className="pay-settings">
      <div className="setting-group">
        <label>Pay Schedule:</label>
        <select value={settings.paySchedule} disabled>
          <option>Monthly</option>
          <option>Bi-weekly</option>
          <option>Weekly</option>
        </select>
      </div>

      <div className="setting-group">
        <label>Payroll Cutoff Date:</label>
        <input type="text" value={settings.cutoffDay} disabled /> (e.g., 25th of each month)
      </div>

      <div className="setting-group">
        <label>Fiscal Year Start:</label>
        <input type="date" value={settings.fiscalYearStart} disabled />
      </div>

      <div className="setting-group">
        <label>Fiscal Year End:</label>
        <input type="date" value={settings.fiscalYearEnd} disabled />
      </div>

      <div className="setting-group">
        <label>Default Work Hours/Day:</label>
        <input type="text" value={settings.defaultWorkHoursPerDay} disabled />
      </div>

      <div className="setting-group">
        <label>Default Pay Type:</label>
        <select value={settings.defaultPayType} disabled>
          <option>Salaried</option>
          <option>Hourly</option>
        </select>
      </div>

      <div className="setting-group">
        <label>Loss of Pay (LOP) Calculation:</label>
        <select value={settings.lopCalculation} disabled>
          <option>Per Day Basis</option>
          <option>Per Hour Basis</option>
          <option>Monthly Fixed</option>
        </select>
      </div>

      <div className="setting-group">
        <label>Holidays Considered as Paid?</label>
        <input type="checkbox" checked={settings.holidaysConsideredPaid} disabled />
      </div>

      <div className="setting-group">
        <label>Enable Auto Payroll Generation:</label>
        <input type="checkbox" checked={settings.autoGeneratePayroll} disabled />
      </div>

      <div className="setting-group">
        <label>Enable TDS Deduction:</label>
        <input type="checkbox" checked={settings.enableTDS} disabled />
      </div>
    </div>
  );
}
