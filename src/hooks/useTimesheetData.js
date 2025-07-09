// hooks/useTimesheetData.js
import { useCallback, useState } from "react";
import {
  fetchAllTimeSheetsAPI,
  fetchTeamTimeSheetsAPI,
  updateTimesheetStatusAPI,
} from "../api/timeSheet";
import { useUser } from "./useUser";
import { notifySuccess, notifyError } from "../components/Toast/ToastProvider";

export const useTimesheetData = () => {
  const { token, hasRole, employeeId } = useUser();
  const [timesheets, setTimesheets] = useState([]);

  const loadTimesheets = useCallback(
    async (showMyApprovals = false) => {
      if (!token) return;

      try {
        let data = [];

        if (showMyApprovals) {
          data = await fetchTeamTimeSheetsAPI(token);
        } else if (hasRole(["admin", "hr"])) {
          data = await fetchAllTimeSheetsAPI(token);
        } else if (hasRole(["manager"])) {
          data = await fetchTeamTimeSheetsAPI(token);
        } else {
          console.warn("This role does not have access to timesheets.");
        }

        setTimesheets(data || []);
      } catch (error) {
        console.error("Failed to load timesheets:", error);
      }
    },
    [token, hasRole]
  );

  const updateStatus = async (id, status, reason = "") => {
    if (!token) return alert("Missing authentication token.");

    try {
      await updateTimesheetStatusAPI(id, { status, reason }, token);

      setTimesheets((prev) =>
        prev.map((entry) =>
          entry.id === id
            ? {
                ...entry,
                status,
                reason: status === "Rejected" ? reason : "",
                approvedAt: status === "Approved" ? new Date().toISOString() : null,
              }
            : entry
        )
      );
      notifySuccess(`Timesheet ${status.toLowerCase()} successfully.`);
    } catch (err) {
      console.error("Failed to update timesheet status:", err);

      const backendMessage = err?.response?.data?.message || err?.message;

      if (
        backendMessage ===
        "Only the assigned approver can approve/reject this timesheet"
      ) {
        notifyError("You don't have permission to approve/reject this timesheet.");
      } else {
        notifyError(`Failed to ${status.toLowerCase()} timesheet. Try again.`);
      }
    }
  };

  const approveTimesheet = (id) => updateStatus(id, "Approved");

  return {
    timesheets,
    loadTimesheets,
    updateStatus,
    approveTimesheet,
  };
};
