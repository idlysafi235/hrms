// TimesheetDashboard.jsx
import React, { useState, useEffect } from "react";
import { useUser } from "../../hooks/useUser";
import "./TimesheetDashboard.css";

import KPISection from "../../components/TimesheetDashboard/KPISection";
import TimesheetTable from "../../components/TimesheetDashboard/TimesheetTable";
import RejectModal from "../../components/TimesheetDashboard/RejectModal";
import TimesheetDetails from "../../components/TimesheetDashboard/TimesheetDetails";
import FiltersSection from "../../components/TimesheetDashboard/FiltersSection";

import { useTimesheetData } from "../../hooks/useTimesheetData";

const TimesheetDashboard = () => {
  const { employeeId, hasRole } = useUser();
  const {
    timesheets,
    loadTimesheets,
    updateStatus,
    approveTimesheet,
  } = useTimesheetData();

  const [showMyApprovals, setShowMyApprovals] = useState(false);

  const [search, setSearch] = useState("");
  const [filterProject, setFilterProject] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectingTimesheetId, setRejectingTimesheetId] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const pad = (num) => String(num).padStart(2, "0");
  const formatLocalDate = (date) =>
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

  useEffect(() => {
    loadTimesheets(showMyApprovals);
  }, [loadTimesheets, showMyApprovals]);

  const openRejectModal = (id) => {
    setRejectingTimesheetId(id);
    setRejectReason("");
    setShowRejectModal(true);
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setRejectReason("");
    setRejectingTimesheetId(null);
  };

  const submitReject = () => {
    if (!rejectReason.trim()) return alert("Please enter a rejection reason.");
    updateStatus(rejectingTimesheetId, "Rejected", rejectReason);
  };

  const handleViewDetails = (entry) => setSelectedEntry(entry);
  const closeDetails = () => setSelectedEntry(null);

  const filteredTimesheets = timesheets.filter((entry) => {
    const keyword = search.toLowerCase();
    const matchesSearch =
      entry.fullName?.toLowerCase().includes(keyword) ||
      entry.projectName?.toLowerCase().includes(keyword) ||
      entry.taskDescription?.toLowerCase().includes(keyword);

    const matchesProject =
      filterProject === "All" || entry.projectName === filterProject;

    const entryDate = new Date(entry.date);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    const matchesDate =
      (!from || entryDate >= from) && (!to || entryDate <= to);

    const matchesStatus =
      statusFilter === "All" ||
      entry.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesProject && matchesDate && matchesStatus;
  });

  const statusCounts = filteredTimesheets.reduce(
    (acc, entry) => {
      acc.total += 1;
      acc.hours += entry.hoursWorked || 0;
      const status = (entry.status || "Pending").toLowerCase();
      if (status in acc) acc[status] += 1;
      return acc;
    },
    { total: 0, approved: 0, pending: 0, rejected: 0, hours: 0 }
  );

  const pendingApprovalsCount = timesheets.filter(
    (t) =>
      t.status === "Pending" && t.approverEmployeeId === employeeId
  ).length;

  return (
    <div>
      <KPISection statusCounts={statusCounts} />

      <div className="time-management-table">
        <FiltersSection
          search={search}
          setSearch={setSearch}
          filterProject={filterProject}
          setFilterProject={setFilterProject}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          fromDate={fromDate}
          toDate={toDate}
          setFromDate={setFromDate}
          setToDate={setToDate}
          timesheets={timesheets}
          filteredTimesheets={filteredTimesheets}
          showMyApprovals={showMyApprovals}
          toggleMyApprovals={() => setShowMyApprovals((prev) => !prev)}
          pendingApprovalsCount={pendingApprovalsCount}
          isApprovalButtonVisible={hasRole("admin") || hasRole("hr")}
        />

        <TimesheetTable
          timesheets={filteredTimesheets}
          onApprove={approveTimesheet}
          onReject={openRejectModal}
          onViewDetails={handleViewDetails}
        />
      </div>

      {showRejectModal && (
        <RejectModal
          reason={rejectReason}
          setReason={setRejectReason}
          onClose={closeRejectModal}
          onSubmit={submitReject}
        />
      )}

      {selectedEntry && (
        <TimesheetDetails entry={selectedEntry} onClose={closeDetails} />
      )}
    </div>
  );
};

export default TimesheetDashboard;
