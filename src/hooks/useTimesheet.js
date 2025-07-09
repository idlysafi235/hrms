import { useState, useEffect } from 'react';
import {
  format,
  startOfWeek,
  addWeeks,
  subWeeks,
  isSameWeek,
  addDays,
} from 'date-fns';

import { getToken } from '../utils/auth';
import { fetchMyTimeSheetsAPI, submitTimeSheetAPI } from '../api/timeSheet';
import { groupEntriesByDate, calculateTotalHours } from '../utils/timesheetUtils';
import { notifySuccess, notifyError } from '../components/Toast/ToastProvider';

const useTimesheet = (approvedLeaves = []) => {
  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');

  const fullLeaveDates = approvedLeaves
    .filter(l => l.original.numberOfDays !== 0.5)
    .map(l => l.date);

  const [selectedDates, setSelectedDates] = useState([]);
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(today, { weekStartsOn: 1 }));
  const [entriesByDate, setEntriesByDate] = useState({});
  const [token, setToken] = useState('');

  const isInitialWeek = isSameWeek(today, currentWeekStart, { weekStartsOn: 1 });

  useEffect(() => {
    const authToken = getToken();
    if (authToken) {
      setToken(authToken);
      loadTimesheetsForWeek(authToken);
    }
  }, [currentWeekStart]);

  useEffect(() => {
    if (!isInitialWeek) {
      setSelectedDates([]);
      return;
    }

    const thisWeekDates = Array.from({ length: 7 }).map((_, i) => addDays(currentWeekStart, i));
    const todayInThisWeek = thisWeekDates.find(d => format(d, 'yyyy-MM-dd') === todayStr);

    if (todayInThisWeek && !fullLeaveDates.includes(todayStr)) {
      setSelectedDates([todayInThisWeek]);
    } else {
      setSelectedDates([]);
    }
  }, [currentWeekStart, approvedLeaves.join(), fullLeaveDates.join()]);

  const loadTimesheetsForWeek = async (authToken) => {
    try {
      const timesheets = await fetchMyTimeSheetsAPI(authToken);
      const grouped = groupEntriesByDate(timesheets, currentWeekStart);

      for (const date in grouped) {
        grouped[date] = grouped[date].map(entry => ({
          ...entry,
          isSubmitted: true,
        }));
      }

      setEntriesByDate(grouped);

      if (isInitialWeek && !grouped[todayStr] && !fullLeaveDates.includes(todayStr)) {
        setEntriesByDate(prev => ({
          ...prev,
          [todayStr]: [{
            date: todayStr,
            project: '',
            hoursWorked: '',
            taskDescription: '',
            isSubmitted: false,
          }],
        }));
      }
    } catch (error) {
      console.error('Error fetching timesheets:', error);
    }
  };

  const handleDayClick = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    if (fullLeaveDates.includes(dateStr)) return;

    const alreadySelected = selectedDates.some(d => format(d, 'yyyy-MM-dd') === dateStr);
    const updatedDates = alreadySelected
      ? selectedDates.filter(d => format(d, 'yyyy-MM-dd') !== dateStr)
      : [...selectedDates, date];

    setSelectedDates(updatedDates);

    if (!entriesByDate[dateStr]) {
      setEntriesByDate(prev => ({
        ...prev,
        [dateStr]: [{
          date: dateStr,
          project: '',
          hoursWorked: '',
          taskDescription: '',
          isSubmitted: false,
        }],
      }));
    }
  };

  const handleChange = (date, index, e) => {
    const { name, value } = e.target;
    const dateStr = format(date, 'yyyy-MM-dd');

    const updatedEntries = [...(entriesByDate[dateStr] || [])];
    if (!updatedEntries[index].isSubmitted) {
      updatedEntries[index] = {
        ...updatedEntries[index],
        [name]: value,
      };

      setEntriesByDate(prev => ({
        ...prev,
        [dateStr]: updatedEntries,
      }));
    }
  };

  const addRow = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');

    setEntriesByDate(prev => {
      const existingEntries = prev[dateStr] || [];

      if ((existingEntries.length || 0) >= 3) {
        console.warn('Cannot add more than 3 entries for:', dateStr);
        return prev;
      }
      
      const newEntry = {
        date: dateStr,
        project: '',
        hoursWorked: '',
        taskDescription: '',
        isSubmitted: false,
      };

      return {
        ...prev,
        [dateStr]: [...existingEntries, newEntry],
      };
    });
  };

  const removeRow = (date, index) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const existingEntries = entriesByDate[dateStr] || [];

    if (existingEntries[index]?.isSubmitted) return;

    const updatedEntries = existingEntries.filter((_, i) => i !== index);

    setEntriesByDate(prev => ({
      ...prev,
      [dateStr]: updatedEntries.length > 0
        ? updatedEntries
        : [{
            date: dateStr,
            project: '',
            hoursWorked: '',
            taskDescription: '',
            isSubmitted: false,
          }],
    }));
  };

  const handleWeekChange = (direction) => {
    const newStart = direction === 'next'
      ? addWeeks(currentWeekStart, 1)
      : subWeeks(currentWeekStart, 1);
    setCurrentWeekStart(newStart);
  };

  const handleSubmit = async () => {
    let submittedAny = false;
  
    try {
      for (const date of selectedDates) {
        const dateStr = format(date, 'yyyy-MM-dd');
  
        const isFullLeave = approvedLeaves.some(
          l => l.date === dateStr && l.original.numberOfDays !== 0.5
        );
        if (isFullLeave) continue;
  
        const dailyEntries = entriesByDate[dateStr] || [];
  
        let submittedValidEntry = false;
  
        const updated = await Promise.all(
          dailyEntries.map(async e => {
            const isValid =
              e.date &&
              e.project?.trim() &&
              e.taskDescription?.trim() &&
              e.hoursWorked &&
              !isNaN(parseFloat(e.hoursWorked));
  
            if (e.isSubmitted || !isValid) {
              if (!isValid && !e.isSubmitted) {
                console.warn('Skipping invalid entry:', e);
              }
              return e;
            }
  
            const payload = {
              date: e.date,
              hoursWorked: parseFloat(e.hoursWorked),
              taskDescription: e.taskDescription.trim(),
              project: e.project.trim(),
            };
  
            await submitTimeSheetAPI(payload, token);
            submittedValidEntry = true;
  
            return { ...e, isSubmitted: true };
          })
        );
  
        if (submittedValidEntry) {
          submittedAny = true;
        }
  
        setEntriesByDate(prev => ({
          ...prev,
          [dateStr]: updated,
        }));
      }
  
      if (submittedAny) {
        notifySuccess('Timesheet submitted successfully!');
      } else {
        notifyError('No valid entries to submit for selected dates.');
      }
    } catch (error) {
      console.error('Error during submission:', error);
      notifyError('Error submitting timesheet: ' + (error?.message || 'Unknown error'));
    }
  };
  

  return {
    selectedDates,
    currentWeekStart,
    entriesByDate,
    handleWeekChange,
    handleDayClick,
    handleChange,
    addRow,
    removeRow,
    handleSubmit,
    calculateTotalHours,
    setEntriesByDate,
    setSelectedDates,
  };
};

export default useTimesheet;
