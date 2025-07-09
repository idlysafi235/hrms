import { useState, useEffect, useRef } from 'react';
import { clockIn, clockOut, fetchTodaySessions,fetchClockStatus } from '../api/clock';
import { secondsToDuration } from '../utils/timeUtils';
import { getCurrentLocation, reverseGeocode } from '../utils/locationUtils';
import { parseUTCToLocalDate } from '../utils/dateUtils';
import { getWeekDateRange, formatDateRange } from '../utils/dateRangeUtils';
import { getToken } from '../utils/auth';

export function useStatusSummary() {
  const [clockedIn, setClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);
  const [duration, setDuration] = useState({ hours: 0, mins: 0,secs: 0 });
  const [locationMessage, setLocationMessage] = useState('');

  const intervalRef = useRef(null);
  const baseSecondsRef = useRef(0);
  const currentClockInRef = useRef(null);

  const [weeklySummaries, setWeeklySummaries] = useState({
    thisWeek: { range: '', hours: '-' },
    lastWeek: { range: '', hours: '-' },
  });

  const updateLiveDuration = () => {
    let totalSeconds = baseSecondsRef.current;

    if (clockedIn && currentClockInRef.current) {
      const now = new Date();
      const clockInDate = new Date(currentClockInRef.current);
      const diff = Math.floor((now - clockInDate) / 1000);
      totalSeconds += diff;
    }

    const dur = secondsToDuration(totalSeconds);
    setDuration(dur);
  };


  const loadStatus = async () => {
    try {
      const token = getToken(); 
        if (!token) throw new Error('User token not found');

      const nowLocal = new Date();
      const todayLocalStr = nowLocal.toLocaleDateString('en-CA'); 

      const data = await fetchTodaySessions(token);
      const { sessions, currentStatus } = data;

      const filteredSessions = sessions.filter(session => {
        const localClockIn = parseUTCToLocalDate(session.clockIn);
        const localClockInDateStr = localClockIn.toLocaleDateString('en-CA'); 
        return localClockInDateStr === todayLocalStr;
      });

      const isClockedIn = currentStatus === 'Clocked In';
      setClockedIn(isClockedIn);

      const activeSession = isClockedIn ? filteredSessions.find(s => !s.clockOut) : null;
      currentClockInRef.current = activeSession
        ? parseUTCToLocalDate(activeSession.clockIn)
        : null;

      if (filteredSessions.length > 0) {
        const last = filteredSessions[filteredSessions.length - 1];
        setClockInTime(last.clockIn ? parseUTCToLocalDate(last.clockIn) : null);
        setClockOutTime(last.clockOut ? parseUTCToLocalDate(last.clockOut) : null);
      } else {
        setClockInTime(null);
        setClockOutTime(null);
      }

      const total = filteredSessions.reduce((acc, session) => {
        if (session.clockIn && session.clockOut) {
          const start = parseUTCToLocalDate(session.clockIn);
          const end = parseUTCToLocalDate(session.clockOut);
          const seconds = Math.floor((end - start) / 1000);
          return acc + seconds;
        }
        return acc;
      }, 0);

      baseSecondsRef.current = total;
      updateLiveDuration();
    } catch (err) {
      console.error(' Error loading status summary:', err.message || err);
    }
  };

  const loadWeeklySummary = async () => {
    const token = getToken(); 
        if (!token) throw new Error('User token not found');
  
    const data = await fetchClockStatus(token);
    const sessions = data || [];
  
    const [currentStart, currentEnd] = getWeekDateRange(0);
    const [lastStart, lastEnd] = getWeekDateRange(1);
  
    const sumHours = (start, end) => {
      const total = sessions.reduce((acc, session) => {
        const date = new Date(session.date);
        if (date >= start && date <= end && session.totalHours) {
          return acc + parseFloat(session.totalHours || 0);
        }
        return acc;
      }, 0);
      return total > 0 ? total.toFixed(2) : '-';
    };
  
    setWeeklySummaries({
      thisWeek: {
        range: formatDateRange(currentStart, currentEnd),
        hours: sumHours(currentStart, currentEnd),
      },
      lastWeek: {
        range: formatDateRange(lastStart, lastEnd),
        hours: sumHours(lastStart, lastEnd),
      },
    });
  };
  
  useEffect(() => {
    loadStatus();
    loadWeeklySummary();
  }, []);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (clockedIn) {
      intervalRef.current = setInterval(() => {
        updateLiveDuration();
      }, 1000);
      updateLiveDuration();
    } else {
      updateLiveDuration();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [clockedIn]);

  const showLocationTemporarily = (locationName) => {
    setLocationMessage(locationName);
    setTimeout(() => setLocationMessage(''), 10000);
  };

  const handleClockIn = async () => {
    try {
      const token = getToken(); 
      if (!token) throw new Error('User token not found');

      const coords = await getCurrentLocation();
      const locationName = await reverseGeocode(coords.latitude, coords.longitude);
      showLocationTemporarily(locationName);

      const body = {
        clockInlatitude: +coords.latitude.toFixed(6),
        clockInlongitude: +coords.longitude.toFixed(6),
      };

      const response = await clockIn(token, body);
      if (response) {
        await loadStatus();
      }
    } catch (err) {
      console.error('Failed to clock in:', err.message || err);
    }
  };

  const handleClockOut = async () => {
    try {
      const token = getToken(); 
        if (!token) throw new Error('User token not found');

      const coords = await getCurrentLocation();
      const locationName = await reverseGeocode(coords.latitude, coords.longitude);
      showLocationTemporarily(locationName);

      const body = {
        clockOutlatitude: +coords.latitude.toFixed(6),
        clockOutlongitude: +coords.longitude.toFixed(6),
      };

      await clockOut(token, body);
      await loadStatus();
      await loadWeeklySummary();
    } catch (err) {
      console.error(' Failed to clock out:', err.message || err);
    }
  };

  return {
    clockedIn,
    clockInTime,
    clockOutTime,
    duration,
    locationMessage,
    handleClockIn,
    handleClockOut,
    refresh: loadStatus,
    refresh: loadWeeklySummary,
    weeklySummaries,
  };
}
