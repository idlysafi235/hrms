import React, { useState, useEffect } from "react";
import "./AssetDashboard.css";
import {
  FaCheckCircle,
  FaHourglass,
  FaTools,
  FaExclamationCircle,
  FaBox,
  FaQuestionCircle,
} from "react-icons/fa";

import { fetchAssets, fetchAllAssetRequests } from "../../api/assets";
import { getToken } from "../../utils/auth";

const AssetDashboard = () => {
  const [assetData, setAssetData] = useState([]);
  const [showStatus, setShowStatus] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingRequests, setPendingRequests] = useState(0);

  const licenseDue = 0;
  const licenseUpcoming = 0;
  const warrantyDue = 0;
  const warrantyUpcoming = 0;


  const normalizeStatus = (status) => {
    switch (status) {
      case "Retired":
        return "Archived";
      case "In Repair":
        return "Out for Repair";
      default:
        return status;
    }
  };

  useEffect(() => {
    const loadAssets = async () => {
      try {
        const token = getToken();
        const data = await fetchAssets(token);
        setAssetData(data);

        const requests = await fetchAllAssetRequests(token);
        const pending = requests.filter((req) => req.status === "Pending").length;
        setPendingRequests(pending);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadAssets();
  }, []);

  const statusCounts = {
    Available: 0,
    Assigned: 0,
    "Out for Repair": 0,
    "Broken - Not Fixable": 0,
    Archived: 0,
    "Lost / Stolen": 0,
  };

  assetData.forEach((asset) => {
    const normalized = normalizeStatus(asset.status);
    if (statusCounts.hasOwnProperty(normalized)) {
      statusCounts[normalized]++;
    }
  });

  return (
    <div className="asset-container">
      {loading ? (
        <p>Loading asset data...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <>

          <div className="top-summary">
            <div className="card blue">
              <h3>{statusCounts["Available"]}</h3>
              <p>Available Assets</p>
            </div>
            <div className="card green">
              <h3>{pendingRequests}</h3>
              <p>Pending Requests</p>
            </div>
            <div className="card gray">
              <div className="row">
                <div>
                  <h4>{licenseDue}</h4>
                  <p>Due</p>
                </div>
                <div>
                  <h4>{licenseUpcoming}</h4>
                  <p>Upcoming</p>
                </div>
              </div>
              <p>License Renewal</p>
            </div>
            <div className="card red">
              <div className="row">
                <div>
                  <h4>{warrantyDue}</h4>
                  <p>Due</p>
                </div>
                <div>
                  <h4>{warrantyUpcoming}</h4>
                  <p>Upcoming</p>
                </div>
              </div>
              <p>Warranty Renewal</p>
            </div>
          </div>


          <div className="status-section">
            <div className="status-header">
              <h3>Assets Status</h3>
            </div>
            {showStatus && (
              <div className="status-summary">
                <StatusCard
                  icon={<FaCheckCircle />}
                  color="available"
                  count={statusCounts["Available"]}
                  label="Available"
                />
                <StatusCard
                  icon={<FaHourglass />}
                  color="assigned"
                  count={statusCounts["Assigned"]}
                  label="Assigned"
                />
                <StatusCard
                  icon={<FaTools />}
                  color="repair"
                  count={statusCounts["Out for Repair"]}
                  label="In Repair"
                />
                <StatusCard
                  icon={<FaExclamationCircle />}
                  color="broken"
                  count={statusCounts["Broken - Not Fixable"]}
                  label="Broken"
                />
                <StatusCard
                  icon={<FaBox />}
                  color="archived"
                  count={statusCounts["Archived"]}
                  label="Retired"
                />
                <StatusCard
                  icon={<FaQuestionCircle />}
                  color="lost"
                  count={statusCounts["Lost / Stolen"]}
                  label="Lost / Stolen"
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const StatusCard = ({ icon, color, count, label }) => (
  <div className="status-card">
    <div className={`status-icon ${color}`}>{icon}</div>
    <h4>{count}</h4>
    <p>{label}</p>
  </div>
);

export default AssetDashboard;
