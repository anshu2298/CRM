import "./StatsCards.css";
import { GrCurrency } from "react-icons/gr";
import { IoPerson } from "react-icons/io5";
import { MdOutlineHandshake } from "react-icons/md";
import { IoSpeedometerOutline } from "react-icons/io5";

const StatsCards = () => {
  const stats = [
    {
      title: "Unassigned Leads",
      value: "12",
      icon: <GrCurrency />,
      color: "#ececec",
    },
    {
      title: "Assigned This Week",
      value: "24",
      icon: <IoPerson />,
      color: "#ececec",
    },
    {
      title: "Active Salespeople",
      value: "5",
      icon: <MdOutlineHandshake />,
      color: "#ececec",
    },
    {
      title: "Conversion Rate",
      value: "32%",
      icon: <IoSpeedometerOutline />,
      color: "#ececec",
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
