import "./BottomNavigation.css";
import { FaHome } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { SlCalender } from "react-icons/sl";
import { IoPeople } from "react-icons/io5";
function BottomNavigation({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "Home", label: "Home", icon: <FaHome /> },
    { id: "Leads", label: "Leads", icon: <IoPeople /> },
    {
      id: "Schedule",
      label: "Schedule",
      icon: <SlCalender />,
    },
    {
      id: "Profile",
      label: "Profile",
      icon: <CgProfile />,
    },
  ];

  return (
    <nav className='bottom-navigation'>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`nav-item ${
            activeTab === tab.id ? "active" : ""
          }`}
          onClick={() => setActiveTab(tab.id)}
        >
          <span className='nav-icon'>{tab.icon}</span>
          <span className='nav-label'>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}

export default BottomNavigation;
