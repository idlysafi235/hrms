import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import LeaveSummaryCards from "../../components/LeaveDashbard/LeaveSummaryCards";
import LeaveChart from "../../components/LeaveDashbard/LeaveChart";
import LeaveFilters from "../../components/LeaveDashbard/LeaveFilters";
import LeaveTable from "../../components/LeaveDashbard/LeaveTable";
import { fetchAvailableLeaves } from "../../api/services";
import { getToken } from "../../utils/auth";
import "./LeaveDashboard.css";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const rowsPerPage = 5;

function LeaveDashboard() {
  const navigate = useNavigate();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [totalLeaves, setTotalLeaves] = useState({});
  const [usedLeaves, setUsedLeaves] = useState({});
  const [remainingLeaves, setRemainingLeaves] = useState({});
  const [filterType, setFilterType] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const token = getToken();


  useEffect(() => {
    const loadLeaveData = async () => {
      try {
        const availableLeavesData = await fetchAvailableLeaves(token);
        const leaves = availableLeavesData || [];

        const total = {
          "Sick Leave": leaves.summary.total.Sick || 0,
          "Casual Leave": leaves.summary.total.Casual || 0,
          "Total": (leaves.summary.total.Sick || 0) + (leaves.summary.total.Casual || 0),
        };
        setTotalLeaves(total);
        
        const used = {
          "Sick Leave": leaves.summary.used.Sick || 0,
          "Casual Leave": leaves.summary.used.Casual || 0,
          "Total": (leaves.summary.used.Sick || 0) + (leaves.summary.used.Casual || 0),
        };
        setUsedLeaves(used);
        
        const remaining = {
          "Sick Leave": total["Sick Leave"] - used["Sick Leave"],
          "Casual Leave": total["Casual Leave"] - used["Casual Leave"],
          "Total": total["Total"] - used["Total"],
        };
        setRemainingLeaves(remaining);
        

        setLeaveRequests(leaves.history || []);
      } catch (error) {
        console.error("Error loading leave data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      loadLeaveData();
    }
  }, [token]);

  
  const getLeaveDurationDays = (leave) => {
    const start = new Date(leave.startDate);
    const end = new Date(leave.endDate);
    return Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
  };

  const filteredLeaves = leaveRequests.filter((leave) => {
    const matchesType = filterType === "All" || leave.leaveType === filterType;
    const matchesStatus = statusFilter === "All" || leave.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesType && matchesStatus;
  });

  const yearlyLeaveData = months.map((month, index) => {
    const approvedMonthLeaves = leaveRequests.filter((leave) => {
      const leaveMonth = new Date(leave.startDate).getMonth();
      return leaveMonth === index && leave.status.toLowerCase() === "approved";
    });
  
    const leaveTypeTotals = {};
  
    approvedMonthLeaves.forEach((leave) => {
      const type = leave.leaveType;
      const days = parseFloat(leave.numberOfDays) || 0;
  
      if (!leaveTypeTotals[type]) {
        leaveTypeTotals[type] = 0;
      }
      leaveTypeTotals[type] += days;
    });

    Object.keys(leaveTypeTotals).forEach((type) => {
      leaveTypeTotals[type] = parseFloat(leaveTypeTotals[type].toFixed(1));
    });
  
    return {
      month,
      ...leaveTypeTotals,
    };
  });
  

  const todayDate = new Date().toLocaleDateString("en-US", {
    day: "2-digit", month: "short", year: "numeric",
  });

  return (
    <div className="outlet-dashboard">
      {/* Top Cards and Button */}
      <div className="outlet-top-bar">
        <LeaveSummaryCards
         remainingLeaves={remainingLeaves}
         usedLeaves={usedLeaves}
         totalLeaves={totalLeaves} 
         />
        <div className="leave-buttons">
          <button
            className="apply-button"
            onClick={() => navigate("/leaves/apply")}
          >
            Apply Leave
          </button>
        </div>
      </div>

      <div className="last-updated">Last Updated: {todayDate}</div>

      {/* Chart */}
      <div className="middle-section">
        <LeaveChart data={yearlyLeaveData} />
      </div>

      {/* History */}
          <LeaveFilters
          filterType={filterType}
          setFilterType={setFilterType}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
        <LeaveTable
          leaves={filteredLeaves}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          onPageChange={setCurrentPage}
        />
      <ToastContainer />
    </div>
  );
}

export default LeaveDashboard;
