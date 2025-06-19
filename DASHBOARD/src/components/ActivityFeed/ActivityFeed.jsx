import "./ActivityFeed.css";

const ActivityFeed = () => {
  const activities = [
    {
      id: 1,
      message: "You assigned a lead to Priya",
      time: "1 hour ago",
      type: "assignment",
    },
    {
      id: 2,
      message: "Jay closed a deal",
      time: "2 hours ago",
      type: "success",
    },
    {
      id: 3,
      message: "New lead from website",
      time: "3 hours ago",
      type: "info",
    },
    {
      id: 4,
      message: "Meeting scheduled with client",
      time: "4 hours ago",
      type: "meeting",
    },
    {
      id: 5,
      message: "Follow-up reminder set",
      time: "5 hours ago",
      type: "reminder",
    },
    {
      id: 6,
      message: "Follow-up reminder set",
      time: "2 hours ago",
      type: "reminder",
    },
    {
      id: 7,
      message: "Follow-up reminder set",
      time: "7 hours ago",
      type: "reminder",
    },
  ];

  const getActivityIcon = (type) => {
    const icons = {
      assignment: "👤",
      success: "✅",
      info: "📧",
      meeting: "📅",
      reminder: "⏰",
    };
    return icons[type] || "📝";
  };

  const getActivityColor = (type) => {
    const colors = {
      assignment: "blue",
      success: "green",
      info: "purple",
      meeting: "orange",
      reminder: "gray",
    };
    return colors[type] || "gray";
  };

  return (
    <div className='activity-feed'>
      <h3 className='activity-title'>
        Recent Activity Feed
      </h3>
      <div className='activity-list'>
        {activities.map((activity) => (
          <div
            key={activity.id}
            className='activity-item'
          >
            <div
              className={`activity-icon activity-icon-${getActivityColor(
                activity.type
              )}`}
            >
              {getActivityIcon(activity.type)}
            </div>
            <div className='activity-content'>
              <p className='activity-message'>
                {activity.message}
              </p>
              <span className='activity-time'>
                – {activity.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
