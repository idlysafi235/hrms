import React, { useState, useMemo, useEffect } from "react";
import { useUser } from "../../hooks/useUser";
import { useLeaveData } from "../../hooks/useLeaveData";
import { useLeaveActions } from "../../hooks/useLeaveActions";
import LeaveStats from "../../components/LeaveManagement/LeaveStats";
import LeaveFilters from "../../components/LeaveManagement/LeaveFilters";
import LeaveTable from "../../components/LeaveManagement/LeaveTable";
import LeaveModal from "../../components/LeaveManagement/LeaveModal";

import "./LeaveManagement.css";

function LeaveManagement() {
  const { token, roles, hasRole, employeeId } = useUser(); 
  const [showMyApprovals, setShowMyApprovals] = useState(false);
  const { leaveRequests, setLeaveRequests, stats } = useLeaveData(token, roles, showMyApprovals);
  const { handleDecision } = useLeaveActions(token, setLeaveRequests);

  const [modalData, setModalData] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const getFullName = (r) => `${r.firstName} ${r.lastName}`;

  useEffect(() => {}, [showMyApprovals, leaveRequests]);

  const filteredLeaves = useMemo(() => {
    const search = searchName.trim().toLowerCase();

    return leaveRequests.filter((req) => {
      const fullName = getFullName(req).toLowerCase();
      const empId = req.employeeId?.toLowerCase() || "";

      const matchesSearch =
        search === "" ||
        fullName.includes(search) ||
        empId.includes(search);

      const matchesType = filterType === "All" || req.leaveType === filterType;
      const matchesStatus = filterStatus === "All" || req.status === filterStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [leaveRequests, searchName, filterType, filterStatus]);

  return (
    <div>
      <LeaveStats leaveRequests={leaveRequests} stats={stats} />
      <div className="leave-management-table">
        <LeaveFilters
          searchName={searchName}
          setSearchName={setSearchName}
          filterType={filterType}
          setFilterType={setFilterType}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          showMyApprovals={showMyApprovals}
          toggleMyApprovals={() => setShowMyApprovals((prev) => !prev)}
          pendingCount={
            leaveRequests.filter(
              (r) =>
                r.status === "Pending" &&
                r.approverEmployeeId === employeeId 
            ).length
          }
          isApprovalButtonVisible={hasRole("Admin") || hasRole("HR")}
          leaveData={filteredLeaves}
        />

        <LeaveTable
          filteredLeaves={filteredLeaves}
          setModalData={setModalData}
          handleDecision={handleDecision}
          roles={roles}
        />
      </div>
      <LeaveModal modalData={modalData} onClose={() => setModalData(null)} />
    </div>
  );
}

export default LeaveManagement;
