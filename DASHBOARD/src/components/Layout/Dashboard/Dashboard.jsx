import "./Dashboard.css";
import StatsCards from "../../StatsChart/StatsCards";
import SalesChart from "../../SalesChart/SalesChart";
import ActivityFeed from "../../ActivityFeed/ActivityFeed";
import EmployeesTable from "../../EmployeesTable/EmployeesTable";

import { useState } from "react";
import { useEmployeesContext } from "../../../context/EmployeeContext.jsx";
const Dashboard = ({ menuState }) => {
  const [selectedEmployees, setSelectedEmployees] =
    useState([]);
  const { employees } = useEmployeesContext();
  return (
    <div className='dashboard-content'>
      <StatsCards />
      <div className='dashboard-grid'>
        <SalesChart />
        {/* <div className='chart-section'>
        </div> */}
        <div className='activity-section'>
          <ActivityFeed />
        </div>
      </div>
      <EmployeesTable
        menuState={menuState}
        employees={employees}
        selectedEmployees={selectedEmployees}
        setSelectedEmployees={setSelectedEmployees}
      />
    </div>
  );
};

export default Dashboard;
