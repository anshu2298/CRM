import './RecentActivity.css'

function RecentActivity() {
  const activities = [
    {
      text: 'You were assigned 3 more new lead',
      time: '1 hour ago'
    },
    {
      text: 'You Closed a deal today',
      time: '2 hours ago'
    }
  ]

  return (
    <section className="recent-activity">
      <h3 className="section-title">Recent Activity</h3>
      <div className="activity-list">
        {activities.map((activity, index) => (
          <div key={index} className="activity-item">
            <div className="activity-dot"></div>
            <div className="activity-content">
              <p className="activity-text">{activity.text}</p>
              <span className="activity-time"> - {activity.time}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default RecentActivity