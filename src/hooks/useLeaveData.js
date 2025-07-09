import { useState, useEffect } from "react";
import {
  fetchManagerLeaveRequests,
  fetchAllLeavesForAdmin,
} from "../api/leave";

export const useLeaveData = (token, roles = [], showMyApprovals = false) => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token || roles.length === 0) {
      setLeaveRequests([]);
      setStats({});
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const lowerRoles = roles.map((r) => r.toLowerCase());
        let data = [];

        if (showMyApprovals) {
          data = await fetchManagerLeaveRequests(token);
        } else {
          if (
            lowerRoles.includes("admin") ||
            lowerRoles.includes("hr") ||
            lowerRoles.includes("superadmin")
          ) {
            data = await fetchAllLeavesForAdmin(token);
          } else {
            data = await fetchManagerLeaveRequests(token);
          }
        }

        const leaveArray = Array.isArray(data)
          ? data
          : data.requests || [];

        const normalizedData = leaveArray.map((item) => ({
          ...item,
          department: item.department || "N/A",
        }));

        setLeaveRequests(normalizedData);

        const computedStats = {
          total: normalizedData.length,
          approved: normalizedData.filter((r) => r.status === "Approved").length,
          pending: normalizedData.filter((r) => r.status === "Pending").length,
          rejected: normalizedData.filter((r) => r.status === "Rejected").length,
        };
        setStats(computedStats);

        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [token, roles, showMyApprovals]);

  return { leaveRequests, setLeaveRequests, stats, loading, error };
};
