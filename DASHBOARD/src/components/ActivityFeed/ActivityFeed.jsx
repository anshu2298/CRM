import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import "./ActivityFeed.css";
import { API_PATHS } from "../../utils/apiPaths";

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);

  const getActivityIcon = (type) => {
    const icons = {
      assign: "👤",
      close: "✅",
      add: "📧",
      schedule: "📅",
    };
    return icons[type] || "📝";
  };

  const getActivityColor = (type) => {
    const colors = {
      assign: "blue",
      close: "green",
      add: "purple",
      schedule: "orange",
    };
    return colors[type] || "gray";
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(API_PATHS.EVENTS.GET);
        if (!res.ok)
          throw new Error("Failed to fetch notifications");
        const data = await res.json();
        setActivities(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className='activity-feed'>
      <h3 className='activity-title'>
        Recent Activity Feed
      </h3>
      <div className='activity-list'>
        {activities.length === 0 ? (
          <p>No recent activity.</p>
        ) : (
          activities.map((activity) => (
            <div
              key={activity._id}
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
                  –{" "}
                  {formatDistanceToNow(
                    new Date(activity.createdAt),
                    { addSuffix: true }
                  )}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
