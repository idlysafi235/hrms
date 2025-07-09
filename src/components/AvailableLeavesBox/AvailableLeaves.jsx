import React, { useEffect, useState } from 'react';
import "./AvailableLeaves.css";
import { fetchAvailableLeaves } from '../../api/services';

function AvailableLeaves() {
  const [remainingLeaves, setRemainingLeaves] = useState({
    Casual: 0,
    Sick: 0
  });

  useEffect(() => {
    const loadLeaveData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser?.token) throw new Error("Token not found");

        const response = await fetchAvailableLeaves(storedUser.token);


        const { Sick, Casual } = response?.summary?.remaining || {};

        setRemainingLeaves({
          Casual: Casual !== undefined ? Casual : 0,
          Sick: Sick !== undefined ? Sick : 0       
        });
      } catch (error) {
        console.error("Failed to fetch available leaves:", error);
      }
    };

    loadLeaveData();
  }, []);

  return (
    <div className="avl-leaves_content-wrapper card-p">
      <h2 className="rpr">Available Leaves</h2>
      <div className="avl-leaves_content">
        <div className="avl-leaves_earned">
          <p className="osns color-grey">Casual</p>
          <h5 className="rpr">{remainingLeaves.Casual}</h5> 
          <p className="avl-leaves_days osns color-grey">Days</p>
        </div>

        <div className="avl-leaves_sick">
          <p className="osns color-grey">Sick</p>
          <h5 className="rpr">{remainingLeaves.Sick}</h5> 
          <p className="avl-leaves_days osns color-grey">Days</p>
        </div>
      </div>
    </div>
  );
}

export default AvailableLeaves;
