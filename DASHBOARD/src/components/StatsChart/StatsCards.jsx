import "./StatsCards.css";
import { GrCurrency } from "react-icons/gr";
import { IoPerson } from "react-icons/io5";
import { MdOutlineHandshake } from "react-icons/md";
import { IoSpeedometerOutline } from "react-icons/io5";
import { useEmployeesContext } from "../../context/EmployeeContext";
import { useLeadsContext } from "../../context/LeadsContext";

const StatsCards = () => {
  const { activeEmployees } = useEmployeesContext();
  const {
    weeklyAssigned,
    conversionRate,
    totalUnassignedLeads,
  } = useLeadsContext();
  const stats = [
    {
      title: "Unassigned Leads",
      value: totalUnassignedLeads,
      icon: <GrCurrency />,
    },
    {
      title: "Assigned This Week",
      value: weeklyAssigned,
      icon: <IoPerson />,
    },
    {
      title: "Active Salespeople",
      value: activeEmployees,
      icon: <MdOutlineHandshake />,
    },
    {
      title: "Conversion Rate",
      value: `${conversionRate}%`,
      icon: <IoSpeedometerOutline />,
    },
  ];

  return (
    <div className='stats-grid'>
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`stat-card stat-card-${stat.color}`}
        >
          <div className='stat-icon'>
            <span>{stat.icon}</span>
          </div>
          <div className='stat-content'>
            <h3 className='stat-title'>{stat.title}</h3>
            <p className='stat-value'>{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
