import React, { useState, useEffect } from 'react';
import './HRRequests.css';
import { fetchAllHRRequests } from '../../api/hrrequests';
import DetailsModal from '../../components/Modals/DetailsModal';
import { SearchIcon } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import { getToken } from '../../utils/auth';

function HRRequests() {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 15;

  const token = getToken();
  const roles = JSON.parse(localStorage.getItem('role') || '[]');

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const data = await fetchAllHRRequests(token);
        setRequests(data);
      } catch (err) {
        setError(err.message || 'Failed to load HR requests');
      } finally {
        setLoading(false);
      }
    };
    loadRequests();
  }, [token]);

  useEffect(() => {
    let filtered = [...requests];

    if (statusFilter !== 'All') {
      filtered = filtered.filter((req) => req.status === statusFilter);
    }

    if (searchQuery.trim() !== '') {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (req) =>
          req.requestedByFullName?.toLowerCase().includes(lowerQuery) ||
          req.requestedBy?.toLowerCase().includes(lowerQuery) ||
          req.requestId?.toLowerCase().includes(lowerQuery)
      );
    }

    filtered.sort((a, b) => {
      const statusOrder = {
        'Pending': 0,
        'In Progress': 1,
        'Resolved': 2,
      };
    
      const statusComparison = statusOrder[a.status] - statusOrder[b.status];
      if (statusComparison !== 0) return statusComparison;
    
      return new Date(a.createdAt) - new Date(b.createdAt); 
    });
    filtered.sort((a, b) => {
      if (a.status === 'Pending' && b.status !== 'Pending') return -1;
      if (a.status !== 'Pending' && b.status === 'Pending') return 1;
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

    setFilteredRequests(filtered);
    setCurrentPage(1); 
  }, [requests, statusFilter, searchQuery]);

  const handleUpdateRequest = (updatedRequest) => {
    setRequests((prev) =>
      prev.map((req) => (req.requestId === updatedRequest.requestId ? updatedRequest : req))
    );
    setSelectedRequest(updatedRequest);
  };

  const openDetailsModal = (request) => {
    setSelectedRequest(request);
  };

  const closeModal = () => {
    setSelectedRequest(null);
  };

  const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * requestsPerPage,
    currentPage * requestsPerPage
  );

  return (
    <div className="hr-requests-page table-container">
      <h2>HR Requests</h2>
      <div className="controls">
        <div className="input-group">
          <input
            type="text"
            placeholder="Search by name, request ID, employee ID"
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Resolved">Resolved</option>
          <option value="In Progress">In Progress</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      {loading ? (
        <p>Loading requests...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : filteredRequests.length === 0 ? (
        <p>No HR requests found.</p>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Employee Name</th>
                <th>Category</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Raised On</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRequests.map((req) => (
                <tr key={req.requestId}>
                  <td>
                    <button
                      className="link-button"
                      onClick={() => openDetailsModal(req)}
                      title="View request details"
                    >
                      {req.requestId}
                    </button>
                  </td>
                  <td>{req.requestedByFullName} ({req.requestedBy})</td>
                  <td>{req.category}</td>
                  <td><StatusBadge status={req.status} /></td>
                  <td>{req.assignedToFullName || 'Unassigned'}</td>
                  <td>
                    {new Date(req.createdAt).toLocaleDateString('en-US', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination-controls">
            <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>Prev</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Next</button>
          </div>
        </>
      )}

      {selectedRequest && (
        <DetailsModal
          request={selectedRequest}
          onClose={closeModal}
          onUpdate={handleUpdateRequest}
          token={token}
          roles={roles}
        />
      )}
    </div>
  );
}

export default HRRequests;
