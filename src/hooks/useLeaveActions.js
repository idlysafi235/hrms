import { updateLeaveStatus, fetchAllLeavesForAdmin } from "../api/leave";
import { notifySuccess, notifyError } from '../components/Toast/ToastProvider';

export const useLeaveActions = (token, setLeaveRequests) => {
  const fetchLeaves = async () => {
    try {
      const data = await fetchAllLeavesForAdmin(token);
      setLeaveRequests(data);
    } catch (error) {
    }
  };

  const handleDecision = async (id, status, comments = "") => {
    if (!token) {
      notifyError("You are not logged in.");
      return;
    }

    try {
      await updateLeaveStatus(id, status, token, comments);
      notifySuccess(`Leave ${status.toLowerCase()} successfully`);
      await fetchLeaves();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "";

      const isPermissionError =
        error.response?.status === 403 ||
        errorMessage.toLowerCase().includes("access denied") ||
        errorMessage.toLowerCase().includes("permission");

      if (isPermissionError) {
        notifyError("You don't have permission to approve/reject this leave");
      } else {
        notifyError("Failed to update leave status");
      }
    }
  };

  return { handleDecision };
};
