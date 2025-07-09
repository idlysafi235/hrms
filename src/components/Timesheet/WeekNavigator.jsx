import React from 'react';
import { format, endOfWeek } from 'date-fns';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const WeekNavigator = ({ currentWeekStart, onWeekChange }) => {
  const weekStartFormatted = format(currentWeekStart, 'dd MMM');
  const weekEndFormatted = format(endOfWeek(currentWeekStart, { weekStartsOn: 1 }), 'dd MMM');

  return (
    <div className="week-nav">
      <FaArrowLeft className="arrow" onClick={() => onWeekChange('prev')}/>
      <span>{`${weekStartFormatted} - ${weekEndFormatted}`}</span>
      <FaArrowRight className="arrow"  onClick={() => onWeekChange('next')}/>
    </div>
  );
};

export default WeekNavigator;
