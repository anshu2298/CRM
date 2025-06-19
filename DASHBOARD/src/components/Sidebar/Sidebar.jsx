import "./Sidebar.css";
import { VscGraph } from "react-icons/vsc";
import { IoPerson } from "react-icons/io5";
import { SiGoogleads } from "react-icons/si";
import { FaGears } from "react-icons/fa6";
import { IoIosLogOut } from "react-icons/io";
const Sidebar = ({ menuState, setMenuState }) => {
  const menuItems = [
    { name: "Dashboard", icon: <VscGraph /> },
    { name: "Leads", icon: <SiGoogleads /> },
    { name: "Employees", icon: <IoPerson /> },
    { name: "Settings", icon: <FaGears /> },
  ];

  return (
    <>
      <div className='sidebar'>
        <div className='sidebar-header'>
          <h2 className='sidebar-logo'>
            <span className='logo-text'>Canova</span>
            <span className='logo-accent'>CRM</span>
          </h2>
        </div>

        <nav className='sidebar-nav'>
          {menuItems.map((item) => (
            <button
              key={item.name}
              className={`nav-item ${
                menuState === item.name
                  ? "nav-item-active"
                  : ""
              }`}
              onClick={() => setMenuState(item.name)}
            >
              <span className='nav-icon'>{item.icon}</span>
              <span className='nav-text'>{item.name}</span>
            </button>
          ))}
        </nav>

        <div className='sidebar-footer'>
          <button className='logout-btn'>
            <span className='nav-icon'>
              <IoIosLogOut />
            </span>
            <span className='nav-text'>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
