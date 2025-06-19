import { useState } from "react";
import Header from "./components/Header";
import Timings from "./components/Timings";
import RecentActivity from "./components/RecentActivity";
import BottomNavigation from "./components/BottomNavigation";

function App() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className='app'>
      <Header />
      <main className='main-content'>
        <Timings />
        <RecentActivity />
      </main>
      <BottomNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}

export default App;
