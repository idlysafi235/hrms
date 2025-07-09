import { DownloadIcon } from "lucide-react";
import { useEffect } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import DateInput from "../common/DateInput";

const FiltersSection = ({
  search,
  setSearch,
  filterProject,
  setFilterProject,
  statusFilter,
  setStatusFilter,
  fromDate,
  toDate,
  setFromDate,
  setToDate,
  timesheets,
  filteredTimesheets,
  showMyApprovals,         
  toggleMyApprovals,       
  pendingApprovalsCount,    
  isApprovalButtonVisible,  
}) => {
  useEffect(() => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const toDateFormat = (date) =>
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
        date.getDate()
      ).padStart(2, "0")}`;

    setFromDate(toDateFormat(startOfMonth));
    setToDate(toDateFormat(endOfMonth));
  }, [setFromDate, setToDate]);

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Timesheets");

    worksheet.columns = [
      { header: "Full Name", key: "fullName", width: 20 },
      { header: "Employee ID", key: "employeeId", width: 15 },
      { header: "Date", key: "date", width: 15 },
      { header: "Project Name", key: "projectName", width: 20 },
      { header: "Task Description", key: "taskDescription", width: 30 },
      { header: "Hours Worked", key: "hoursWorked", width: 15 },
      { header: "Status", key: "status", width: 15 },
      { header: "Reject Reason", key: "reason", width: 25 },
      { header: "Additional Notes", key: "additionalNotes", width: 30 },
      { header: "Approved By", key: "approvedBy", width: 20 },
      { header: "Approver", key: "approver", width: 25 },
      { header: "Submitted At", key: "submittedAt", width: 20 },
      { header: "Approved On", key: "approvedAt", width: 20 },
      { header: "Created At", key: "createdAt", width: 20 },
      { header: "Updated At", key: "updatedAt", width: 20 },
    ];

    const formatDate = (dateStr) => {
      if (!dateStr) return "-";
      return new Date(dateStr).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    };

    filteredTimesheets.forEach((entry) => {
      worksheet.addRow({
        fullName: entry.fullName || "-",
        employeeId: entry.employeeId || "-",
        date: formatDate(entry.date),
        projectName: entry.projectName || "-",
        taskDescription: entry.taskDescription || "-",
        hoursWorked: entry.hoursWorked ?? "-",
        status: entry.status || "Pending",
        reason: entry.reason || "-",
        additionalNotes: entry.additionalNotes || "-",
        approvedBy: entry.approvedBy || "-",
        approver:
          entry.approverFullName && entry.approverEmployeeId
            ? `${entry.approverFullName} (${entry.approverEmployeeId})`
            : "-",
        submittedAt: formatDate(entry.submittedAt),
        approvedAt: formatDate(entry.approvedAt),
        createdAt: formatDate(entry.createdAt),
        updatedAt: formatDate(entry.updatedAt),
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "team_timesheets.xlsx");
  };

  return (
    <div className="filters">
      <input
        type="text"
        placeholder="Search name, project, task"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      <DateInput
        value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}
      />
      <DateInput
        value={toDate}
        onChange={(e) => setToDate(e.target.value)}
      />

      <select
        value={filterProject}
        onChange={(e) => setFilterProject(e.target.value)}
      >
        <option value="All">All Projects</option>
        {[...new Set(timesheets.map((t) => t.projectName || "Unassigned"))].map(
          (project, idx) => (
            <option key={idx} value={project}>
              {project}
            </option>
          )
        )}
      </select>

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="All">All Status</option>
        <option value="Approved">Approved</option>
        <option value="Pending">Pending</option>
        <option value="Rejected">Rejected</option>
      </select>

      {isApprovalButtonVisible && (
        <button
          className="approval-toggle-btn"
          style={{ marginLeft: "16px" }}
          onClick={toggleMyApprovals}
        >
          {showMyApprovals
            ? "Show All Timesheets"
            : `My Approvals (${pendingApprovalsCount})`}
        </button>
      )}

      <button className="export-btn" onClick={exportToExcel}>
        <DownloadIcon size={16} /> Export Excel
      </button>
    </div>
  );
};

export default FiltersSection;
