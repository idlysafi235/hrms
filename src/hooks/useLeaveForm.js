import { useEffect, useState } from "react";
import { applyLeave, fetchAvailableLeaves } from "../api/services";
import { getToken } from "../utils/auth";

export default function useLeaveForm(onSuccess) {
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
    contactDuringLeave: '',
    attachment: null,
    startDayType: 'Full Day',
    endDayType: 'Full Day',
  });

  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [duration, setDuration] = useState(null);
  const [leaveBalance, setLeaveBalance] = useState({});
  const [loadingBalance, setLoadingBalance] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        if (!token) throw new Error('User token not found');
        const res = await fetchAvailableLeaves(token);
        setLeaveBalance(res.summary.remaining || {});
      } catch (error) {
        console.error("Failed to fetch leave balances:", error);
        setLeaveBalance({});
      } finally {
        setLoadingBalance(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'attachment' ? files[0] : value,
    }));
  };

  const calculateDuration = () => {
    const { startDate, endDate, startDayType, endDayType } = formData;
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end < start) {
        setDuration("Invalid date range");
        return;
      }

      let count = 0;
      let current = new Date(start);

      while (current <= end) {
        const day = current.getDay(); 
        if (day !== 0 && day !== 6) {
          count++;
        }
        current.setDate(current.getDate() + 1);
      }

      if (startDate === endDate) {
        if (startDayType === "Half Day") {
          setDuration(0.5);
        } else {
          const day = new Date(startDate).getDay();
          setDuration(day !== 0 && day !== 6 ? 1 : 0);
        }
        return;
      }

      if (startDayType === "Half Day") count -= 0.5;
      if (endDayType === "Half Day") count -= 0.5;

      setDuration(count);
    } else {
      setDuration(null);
    }
  };

  useEffect(() => {
    calculateDuration();
  }, [formData.startDate, formData.endDate, formData.startDayType, formData.endDayType]);

  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      if (formData.startDate === formData.endDate && formData.endDayType !== '') {
        setFormData(prev => ({ ...prev, endDayType: '' }));
      } else if (formData.startDate !== formData.endDate && formData.endDayType === '') {
        setFormData(prev => ({ ...prev, endDayType: 'Full Day' }));
      }
    }
  }, [formData.startDate, formData.endDate]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.leaveType) newErrors.leaveType = "Select a Leave Type";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (!formData.reason.trim()) newErrors.reason = "Reason is required";

    const leaveType = formData.leaveType;
    const available = leaveBalance[leaveType] ?? null;

    if (["Casual", "Sick"].includes(leaveType) && typeof duration === "number") {
      if (available !== null && duration > available) {
        newErrors.duration = `You have only ${available} day${available !== 1 ? 's' : ''} of ${leaveType} leave left.`;
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const token = getToken();
        if (!token) throw new Error('User token not found');

      await applyLeave(token, {
        ...formData,
        duration,
      });

      setShowSuccessModal(true);

      setFormData({
        leaveType: '',
        startDate: '',
        endDate: '',
        reason: '',
        contactDuringLeave: '',
        attachment: null,
        startDayType: 'Full Day',
        endDayType: 'Full Day',
      });
      setErrors({});
      setDuration(null);
      setSubmitError(null);
      onSuccess?.();
    } catch (err) {
      setSubmitError(err.message);
    }
  };

  return {
    formData,
    errors,
    duration,
    leaveBalance,
    loadingBalance,
    showSuccessModal,
    submitError,
    handleChange,
    handleSubmit,
    closeSuccessModal: () => setShowSuccessModal(false),
  };
}
