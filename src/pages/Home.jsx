import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';
import '../components/HoverCards/HoverCards.css';

import AttendanceCard from '../components/AttendanceCard/AttendanceCard';
import ProfileCard from '../components/ProfileCard/ProfileCard';
import SummaryCard from '../components/StatusSummaryCard/StatusSummaryCard';

import TimesheetHoverCard from '../components/HoverCards/TimesheetHoverCard';
import ESSHoverCard from '../components/HoverCards/ESSHoverCard';
import AssetsHoverCard from '../components/HoverCards/AssetsHoverCard';

import UpcomingBirthdays from '../components/UpcomingBirthdays/UpcomingBirthdays';
import Announcements from '../components/Announcements/Announcements';
import Events from '../components/Events/Events';
// import ApprovalsAndTasksCard from '../components/ApprovalsCard/ApprovalsAndTasksCard';

import { useAuth } from '../components/context/AuthContext';

import { FaRegClock, FaUserCog, FaHandsHelping, FaMoneyCheckAlt, FaBoxOpen } from 'react-icons/fa';

function Home() {
  const navigate = useNavigate();
  const { token, role } = useAuth();
  const [hoveredCard, setHoveredCard] = useState(null);

  const getIconBg = (name) => {
    switch (name) {
      case 'Timesheet':
        return '#E3EEFF';
      case 'Employee Self Service':
        return '#E2F3FA';
      case 'Payroll':
        return '#FFF6CE';
      case 'Assets':
        return '#FFE8E7';
      default:
        return '#EEE';
    }
  };

  const getCardSubText = (name) => {
    switch (name) {
      case 'Timesheet':
        return 'Track your work hours';
      case 'Employee Self Service':
        return 'Update profile and more';
      case 'Payroll':
        return 'Payslips & tax details';
      case 'Assets':
        return 'View assigned items';
      default:
        return '';
    }
  };

  const renderCard = (card, idx) => {
    const cardClass = `home_card ${card.name.toLowerCase().replace(/\s+/g, '-')}-card`;

    return (
      <div
        className="home_card-wrapper"
        key={`${card.name}-${idx}`}
        onMouseEnter={() => setHoveredCard(card.name)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <Link to={card.url} className={cardClass}>
          <div className="styled-icon-circle" style={{ backgroundColor: getIconBg(card.name) }}>
            {card.icon}
          </div>
          <div className="styled-card-title">{card.name}</div>
          <div className="styled-card-subtext">{getCardSubText(card.name)}</div>
        </Link>

        {card.name === 'Timesheet' && hoveredCard === 'Timesheet' && (
          <TimesheetHoverCard navigate={navigate} token={token} />
        )}
        {card.name === 'Employee Self Service' && hoveredCard === 'Employee Self Service' && (
          <ESSHoverCard roles={role} />
        )}
        {card.name === 'Assets' && hoveredCard === 'Assets' && <AssetsHoverCard token={token} />}
      </div>
    );
  };

  return (
    <div className="home_wrapper">
      <div className="home_main-layout">
        <div className="home_cards-grid">
          <div className="first-rowF">
            <ProfileCard />
            <SummaryCard />
            <AttendanceCard />
          </div>

          <div className="announcements-events">
            <Announcements />
            <Events />
          </div>

          <div className="quick-links">
            <div className="quick-links-title"></div>
            <div className="quick-links-grid">
              {renderCard({
                name: 'Timesheet',
                icon: <FaRegClock />,
                url: '/attendance/timesheet',
              })}
              {renderCard({
                name: 'Employee Self Service',
                icon: <FaUserCog />,
                url: '/profile',
              })}

              {renderCard({
                name: 'Assets',
                icon: <FaBoxOpen />,
                url: '/profile/assets',
              })}
              {renderCard({
                name: 'Payroll',
                icon: <FaMoneyCheckAlt />,
                url: '/pay/pay',
              })}
            </div>
          </div>

          <div className="home_side-panel"></div>
          {/* <div className="side-panel-card">
            <ApprovalsAndTasksCard token={token} />
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default Home;
