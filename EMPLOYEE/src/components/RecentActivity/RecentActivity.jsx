import "./RecentActivity.css";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
function RecentActivity() {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/employee/${user._id}/get-recent-activity`
        );
        const data = await res.json();
        setActivities(data.recentActivity.reverse());
      } catch (err) {
        console.error(
          "Failed to fetch recent activity:",
          err
        );
      }
    };

    if (user?._id) {
      fetchActivity();
    }
  }, [user]);
  return (
    <section className='recent-activity'>
      <h3 className='section-title'>Recent Activity</h3>
      <div className='activity-list'>
        {activities.map((activity, index) => (
          <div
            key={index}
            className='activity-item'
          >
            <li className='activity-content'>
              <p className='activity-text'>
                {activity.message}
              </p>
              <span className='activity-time'>
                {" "}
                -{" "}
                {formatDistanceToNow(
                  new Date(activity.timestamp),
                  { addSuffix: true }
                )}
              </span>
            </li>
          </div>
        ))}
      </div>
    </section>
  );
}

export default RecentActivity;
