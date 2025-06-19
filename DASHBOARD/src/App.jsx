import { useState } from "react";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import Dashboard from "./components/Layout/Dashboard/Dashboard";
import Settings from "./components/Layout/Settings/Settings";
import Employees from "./components/Layout/Employees/Employees";
import LoginSignup from "./components/Auth/LoginSignup";
import Leads from "./components/Layout/Leads/Leads";

const App = () => {
  const [menuState, setMenuState] = useState("Dashboard");
  const [user, setUser] = useState(true);
  return (
    <div className='app'>
      {user ? (
        <div className='app-container'>
          <Sidebar
            menuState={menuState}
            setMenuState={setMenuState}
          />
          <div className='main-content'>
            <Header menuState={menuState} />
            {menuState === "Dashboard" && (
              <Dashboard menuState={menuState} />
            )}
            {menuState === "Leads" && <Leads />}
            {menuState === "Employees" && (
              <Employees menuState={menuState} />
            )}
            {menuState === "Settings" && <Settings />}
          </div>
        </div>
      ) : (
        <LoginSignup />
      )}
    </div>
  );
};

export default App;
