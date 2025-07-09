import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './EmployeeProfileModal.css';
import { reverseGeocode } from '../../utils/locationUtils';
import { formatTotalHours } from '../../utils/timeUtils';
import formatDate from '../common/FormatDate';

Modal.setAppElement('#root');

const EmployeeProfileModal = ({ isOpen, onClose, employeeId, selectedDate, attendanceData }) => {
  const [employeeData, setEmployeeData] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    if (employeeId && selectedDate) {
      const filtered = attendanceData.filter(
        item => item.employeeId === employeeId && item.date === selectedDate
      );
      setEmployeeData(filtered);
      console.log('Filtered employee attendance data:', filtered);

      Promise.all(
        filtered.map(async (item, idx) => {
          if (item.clockInLatitude && item.clockInLongitude) {
            const locationName = await reverseGeocode(item.clockInLatitude, item.clockInLongitude);
            console.log(`Reverse geocoded location for item ${idx} [${item.clockInLatitude}, ${item.clockInLongitude}]:`, locationName);
            return locationName;
          }
          console.log(`No lat/lng for item ${idx}, returning 'Unknown'`);
          return 'Unknown';
        })
      ).then((locationsArray) => {
        console.log('All resolved locations:', locationsArray);
        setLocations(locationsArray);
      });
    } else {
      setEmployeeData([]);
      setLocations([]);
      console.log('No employeeId or selectedDate provided - cleared data and locations');
    }
  }, [employeeId, selectedDate, attendanceData]);

  if (!employeeData.length) {
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        contentLabel="Employee Profile Modal"
        overlayClassName="emp-modal-overlay"
        className="emp-modal-content"
        shouldCloseOnOverlayClick={true}
      >
        <button onClick={onClose} className="emp-modal-close-btn" aria-label="Close modal">×</button>
        <div className="emp-modal-no-data">
          <p>No data available for selected date</p>
        </div>
      </Modal>
    );
  }

  const employee = employeeData[0];

 
  const formatTime = (timeStr) => {
    if (!timeStr) return '-';
    return new Date(timeStr).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Employee Profile Modal"
      overlayClassName="emp-modal-overlay"
      className="emp-modal-content"
      shouldCloseOnOverlayClick={true}
    >
      <button onClick={onClose} className="emp-modal-close-btn" aria-label="Close modal">×</button>

      <div className="emp-summary-row">
        <div><strong>Name:</strong> {employee.fullName}</div>
        <div><strong>Date:</strong> {formatDate(selectedDate)}</div>
        <div><strong>Status:</strong> {employee.status || '-'}</div>
      </div>

      <div className="emp-content-split">
        <div className="emp-left-panel">
          <h3>Total Hours & Location</h3>
          <p><strong>Total Hours:</strong> {employee.totalHours != null ? formatTotalHours(employee.totalHours) : '-'}</p>
          <p><strong>Location:</strong> {locations[0] || 'Loading...'}</p>
        </div>

        <div className="emp-right-panel">
          <h3>Timeline</h3>
          <ul className="emp-timeline-list">
            {employeeData.map((item, index) => (
              <li key={index} className="emp-timeline-item">
                <span className="emp-timeline-label">Clock In:</span> {formatTime(item.clockInTime)} <br />
                <span className="emp-timeline-label">Clock Out:</span> {formatTime(item.clockOutTime)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default EmployeeProfileModal;
