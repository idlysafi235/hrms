import React, { useState, useMemo } from "react";
import "./HelpPage.css";

const mockKBArticlesInitial = [
  { id: 1, title: "How to apply for leave", category: "HR" },
  { id: 2, title: "Resetting your password", category: "IT" },
  { id: 3, title: "Requesting office supplies", category: "Finance" },
  { id: 4, title: "Understanding payroll deductions", category: "Finance" },
  { id: 5, title: "WFH policy overview", category: "HR" },
];

const mockRequests = [
  { id: 101, title: "Laptop not working", type: "Issue", status: "Pending", category: "IT" },
  { id: 102, title: "Request for new monitor", type: "Request", status: "Approved", category: "Finance" },
  { id: 103, title: "Payroll discrepancy", type: "Issue", status: "Resolved", category: "Finance" },
  { id: 104, title: "Annual leave query", type: "Request", status: "Pending", category: "HR" },
];

const mockApprovals = [
  { id: 201, title: "Leave request for 5th June", status: "Waiting Your Approval" },
  { id: 202, title: "Expense reimbursement", status: "Approved" },
];

const departments = ["All", "HR", "IT", "Finance"];

function HelpPage() {
  const userFullName = "Super Admin";

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("requests");
  const [filterDept, setFilterDept] = useState("All");
  const [kbArticles, setKbArticles] = useState(mockKBArticlesInitial);
  const [newKBTitle, setNewKBTitle] = useState("");
  const [newKBCategory, setNewKBCategory] = useState("HR");

  const filteredKB = useMemo(() => {
    let filtered = kbArticles;
    if (searchTerm.trim()) {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (activeTab === "manage-kb" && newKBCategory !== "All") {
      filtered = filtered.filter((item) => item.category === newKBCategory);
    }
    return filtered;
  }, [searchTerm, kbArticles, activeTab, newKBCategory]);

  const filteredRequests = useMemo(() => {
    let filtered = mockRequests;
    if (searchTerm.trim()) {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterDept !== "All") {
      filtered = filtered.filter((item) => item.category === filterDept);
    }
    return filtered;
  }, [searchTerm, filterDept]);


  const filteredApprovals = useMemo(() => {
    if (!searchTerm.trim()) return mockApprovals;
    return mockApprovals.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);


  function renderTabContent() {
    switch (activeTab) {
      case "requests":
        return filteredRequests.length ? (
          <>
            <FilterByDepartment />
            <ul className="list-items">
              {filteredRequests.map(({ id, title, status, category }) => (
                <li key={id}>
                  <strong>{title}</strong>{" "}
                  <span className="status">{status}</span>{" "}
                  <em style={{ fontSize: "0.85rem", color: "#666" }}>({category})</em>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="empty-msg">No matching requests found.</p>
        );

      case "issues": {
        const filteredIssues = filteredRequests.filter((r) => r.type === "Issue");
        return filteredIssues.length ? (
          <>
            <FilterByDepartment />
            <ul className="list-items">
              {filteredIssues.map(({ id, title, status, category }) => (
                <li key={id}>
                  <strong>{title}</strong>{" "}
                  <span className="status">{status}</span>{" "}
                  <em style={{ fontSize: "0.85rem", color: "#666" }}>({category})</em>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="empty-msg">No matching issues found.</p>
        );
      }

      case "approvals":
        return filteredApprovals.length ? (
          <ul className="list-items">
            {filteredApprovals.map(({ id, title, status }) => (
              <li key={id}>
                <strong>{title}</strong> <span className="status">{status}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-msg">No matching approvals found.</p>
        );

      case "manage-kb":
        return (
          <div>
            <div className="kb-add-form">
              <input
                type="text"
                placeholder="New KB Article Title"
                value={newKBTitle}
                onChange={(e) => setNewKBTitle(e.target.value)}
                className="help-search-bar"
                aria-label="New knowledge base article title"
              />
              <select
                value={newKBCategory}
                onChange={(e) => setNewKBCategory(e.target.value)}
                className="kb-category-select"
                aria-label="Select category for new KB article"
              >
                {departments.filter((d) => d !== "All").map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              <button
                className="raise-request-btn"
                onClick={() => {
                  if (!newKBTitle.trim()) {
                    alert("Please enter a title for the KB article.");
                    return;
                  }
                  const newArticle = {
                    id: Date.now(),
                    title: newKBTitle.trim(),
                    category: newKBCategory,
                  };
                  setKbArticles([newArticle, ...kbArticles]);
                  setNewKBTitle("");
                }}
                aria-label="Add new knowledge base article"
              >
                + Add KB Article
              </button>
            </div>

            {filteredKB.length ? (
              <ul className="list-items">
                {filteredKB.map(({ id, title, category }) => (
                  <li key={id}>
                    <strong>{title}</strong>{" "}
                    <em style={{ fontSize: "0.85rem", color: "#666" }}>({category})</em>
                    <button
                      className="kb-delete-btn"
                      aria-label={`Delete KB article ${title}`}
                      onClick={() => {
                        if (window.confirm(`Delete KB article "${title}"?`)) {
                          setKbArticles(kbArticles.filter((a) => a.id !== id));
                        }
                      }}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-msg">No knowledge base articles found.</p>
            )}
          </div>
        );

      default:
        return null;
    }
  }

  function FilterByDepartment() {
    return (
      <div style={{ marginBottom: "12px" }}>
        <label htmlFor="deptFilter" style={{ marginRight: "8px", fontWeight: "600" }}>
          Filter by Department:
        </label>
        <select
          id="deptFilter"
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
          style={{ padding: "6px 10px", borderRadius: "5px", border: "1px solid #bbb" }}
          aria-label="Filter requests by department"
        >
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="help-page-container">
      <header className="help-header">
        <h1>
          Hello <span className="user-name">{userFullName}</span>, here is the overview of all requests and knowledge base.
        </h1>
        <input
          type="search"
          placeholder="Search knowledge base articles or requests..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="help-search-bar"
          aria-label="Search help articles and requests"
        />
      </header>

      <section className="help-request-info-box">
        <h2>Manage requests, issues, approvals, and knowledge base</h2>
        <p>Use the tabs below to review or manage items across departments.</p>
      </section>

      <nav className="help-tabs" role="tablist">
        <button
          className={activeTab === "requests" ? "tab active" : "tab"}
          onClick={() => setActiveTab("requests")}
          aria-selected={activeTab === "requests"}
          role="tab"
        >
          All Requests
        </button>
        <button
          className={activeTab === "issues" ? "tab active" : "tab"}
          onClick={() => setActiveTab("issues")}
          aria-selected={activeTab === "issues"}
          role="tab"
        >
          All Issues
        </button>
        <button
          className={activeTab === "approvals" ? "tab active" : "tab"}
          onClick={() => setActiveTab("approvals")}
          aria-selected={activeTab === "approvals"}
          role="tab"
        >
          All Approvals
        </button>
        <button
          className={activeTab === "manage-kb" ? "tab active" : "tab"}
          onClick={() => setActiveTab("manage-kb")}
          aria-selected={activeTab === "manage-kb"}
          role="tab"
        >
          Manage KB
        </button>
      </nav>

      <section className="help-tab-content">{renderTabContent()}</section>

      <footer className="help-footer">
        {/* For super admin, keep the raise request button */}
        <button
          className="raise-request-btn"
          onClick={() => alert("Open raise request modal or page")}
          aria-label="Raise new request"
        >
          + Raise a Request
        </button>
      </footer>
    </div>
  );
}

export default HelpPage;
