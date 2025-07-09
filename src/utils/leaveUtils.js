// src/utils/leaveUtils.js
export const formatDate = (isoDate) =>
    isoDate ? new Date(isoDate).toLocaleDateString() : "N/A";
  
  export const getFullName = ({ firstName, middleName, lastName }) =>
    [firstName, middleName, lastName].filter(Boolean).join(" ");
  
  export const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) return;
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((row) =>
      Object.values(row)
        .map((val) => `"${val}"`)
        .join(",")
    );
    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  };
  