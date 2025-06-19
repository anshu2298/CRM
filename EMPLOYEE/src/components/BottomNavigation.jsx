import './BottomNavigation.css'

function BottomNavigation({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'leads', label: 'Leads', icon: '👥' },
    { id: 'schedule', label: 'Schedule', icon: '📅' },
    { id: 'profile', label: 'Profile', icon: '👤' }
  ]

  return (
    <nav className="bottom-navigation">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
        >
          <span className="nav-icon">{tab.icon}</span>
          <span className="nav-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}

export default BottomNavigation