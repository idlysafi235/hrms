import { DownloadIcon } from "lucide-react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useCallback } from "react";

const LEAVE_TYPES = ["All", "Casual", "Sick", "Comp Off", "Maternity", "Unpaid"];
const LEAVE_STATUS = ["All", "Pending", "Approved", "Rejected"];

function LeaveFilters({
  searchName,
  setSearchName,
  filterType,
  setFilterType,
  filterStatus,
  setFilterStatus,
  showMyApprovals,
  toggleMyApprovals,
  pendingCount,
  isApprovalButtonVisible,
  leaveData = [],
}) {
  const formatDate = (d) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const exportLeaveDataToExcel = useCallback(async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Leave Requests");

    worksheet.columns = [
      { header: "Name", key: "name", width: 25 },
      { header: "Employee ID", key: "employeeId", width: 15 },
      { header: "Email", key: "email", width: 25 },
      { header: "Department", key: "department", width: 20 },
      { header: "Leave Type", key: "leaveType", width: 15 },
      { header: "From", key: "startDate", width: 15 },
      { header: "To", key: "endDate", width: 15 },
      { header: "Days", key: "numberOfDays", width: 10 },
      { header: "Applied On", key: "appliedDate", width: 15 },
      { header: "Approved On", key: "approvedDate", width: 15 },
      { header: "Status", key: "status", width: 15 },
      { header: "Reason", key: "reason", width: 30 },
      { header: "Comments", key: "comments", width: 30 },
      { header: "Attachment", key: "attachment", width: 30 },
      { header: "Approver", key: "approver", width: 25 },
      { header: "Approved By", key: "approvedBy", width: 25 },
    ];

    leaveData.forEach((leave) => {
      worksheet.addRow({
        name: `${leave.firstName} ${leave.lastName}`,
        employeeId: leave.employeeId || "-",
        email: leave.email || "-",
        department: leave.department || "N/A",
        leaveType: leave.leaveType || "-",
        startDate: formatDate(leave.startDate),
        endDate: formatDate(leave.endDate),
        numberOfDays: leave.numberOfDays ?? "-",
        appliedDate: formatDate(leave.appliedDate),
        approvedDate: leave.approvedDate ? formatDate(leave.approvedDate) : "-",
        status: leave.status || "-",
        reason: leave.reason || "No reason provided",
        comments: leave.comments || "No comments provided",
        attachment: leave.attachment || "N/A",
        approver:
          leave.approverFullName && leave.approverEmployeeId
            ? `${leave.approverFullName} (${leave.approverEmployeeId})`
            : "-",
        approvedBy: leave.approvedByFullName || "-",
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "leave_requests.xlsx");
  }, [leaveData]);

  return (
    <div className="filters">
      <input
        id="searchName"
        type="text"
        placeholder="Search by name or employee ID"
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
        className="search-input"
      />

      <label htmlFor="filterType" style={{ fontWeight: "600", marginLeft: 16, marginRight: 8 }}>
        Leave Type
      </label>
      <select
        id="filterType"
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
        className="filter-select"
      >
        {LEAVE_TYPES.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      <label htmlFor="filterStatus" style={{ fontWeight: "600", marginLeft: 16, marginRight: 8 }}>
        Status
      </label>
      <select
        id="filterStatus"
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        className="filter-select"
      >
        {LEAVE_STATUS.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>

      {isApprovalButtonVisible && (
        <button
          className="approval-toggle-btn"
          onClick={toggleMyApprovals}
          style={{ marginLeft: 16 }}
        >
          {showMyApprovals ? "Show All Leaves" : `My Approvals (${pendingCount})`}
        </button>
      )}

      <button
        className="export-btn"
        style={{ marginLeft: "16px" }}
        onClick={exportLeaveDataToExcel}
      >
        <DownloadIcon size={16} /> Export Excel
      </button>
    </div>
  );
}

export default LeaveFilters;
