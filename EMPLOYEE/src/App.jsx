import { useState } from "react";
import Header from "./components/Header/Header.jsx";
import BottomNavigation from "./components/BottomNavigation/BottomNavigation.jsx";
import LoginSignup from "./components/Layout/LoginSignup/LoginSignup.jsx";
import Profile from "./components/Layout/Profile/Profile.jsx";
import Home from "./components/Layout/Home/Home.jsx";
import Schedule from "./components/Layout/Schedule/Schedule.jsx";
import Leads from "./components/Layout/Leads/Leads.jsx";
import { useAuth } from "./context/AuthContext.jsx";

function App() {
  const [activeTab, setActiveTab] = useState("Home");

  const { user } = useAuth();
  return (
    <>
      {!user._id ? (
        <LoginSignup />
      ) : (
        <div className='app'>
          <Header
            user={user}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <main className='main-content'>
            {activeTab === "Home" && <Home />}
            {activeTab === "Leads" && <Leads />}
            {activeTab === "Schedule" && <Schedule />}
            {activeTab === "Profile" && <Profile />}
          </main>
          <BottomNavigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>
      )}
    </>
  );
}

export default App;
