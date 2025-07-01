import { useState } from "react";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import Dashboard from "./components/Layout/Dashboard/Dashboard";
import Settings from "./components/Layout/Settings/Settings";
import Employees from "./components/Layout/Employees/Employees";
import Leads from "./components/Layout/Leads/Leads";

const App = () => {
  const [menuState, setMenuState] = useState("Dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <div className='app'>
      <div className='app-container'>
        <Sidebar
          menuState={menuState}
          setMenuState={setMenuState}
        />
        <div className='main-content'>
          <Header
            menuState={menuState}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          {menuState === "Dashboard" && (
            <Dashboard menuState={menuState} />
          )}
          {menuState === "Leads" && (
            <Leads searchTerm={searchTerm} />
          )}
          {menuState === "Employees" && (
            <Employees
              menuState={menuState}
              searchTerm={searchTerm}
            />
          )}
          {menuState === "Settings" && <Settings />}
        </div>
      </div>
    </div>
  );
};

export default App;
