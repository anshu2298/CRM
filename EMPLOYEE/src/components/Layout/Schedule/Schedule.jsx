import { useState, useEffect, useRef } from "react";
import "./Schedule.css";
import { FaSliders } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";
import { IoPersonSharp } from "react-icons/io5";
import { useLeads } from "../../../context/LeadsContext";
function Schedule() {
  const { employeeLeads } = useLeads();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] =
    useState(false);
  const [selectedFilter, setSelectedFilter] =
    useState("All");
  const dropdownRef = useRef(null);
  const [highlightedId, setHighlightedId] = useState(null);
  const leadsWithReminders = employeeLeads.filter(
    (lead) =>
      lead.reminder &&
      lead.reminder.date &&
      lead.reminder.time &&
      lead.reminder.callType
  );

  const scheduleItems = leadsWithReminders.map((lead) => ({
    id: lead._id,
    type: lead.reminder.callType,
    phone: lead.phoneNumber,
    date: `${lead.reminder.date}`,
    time: lead.reminder.time,
    contact: lead.name,
    avatar: "👤",
  }));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowFilterDropdown(false);
      }
    };

    if (showFilterDropdown) {
      document.addEventListener(
        "mousedown",
        handleClickOutside
      );
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [showFilterDropdown]);

  const todayStr = new Date().toISOString().split("T")[0];

  const filteredItems = scheduleItems
    .filter((item) => {
      return (
        item.contact
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.phone.includes(searchTerm) ||
        item.type
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    })
    .filter((item) => {
      if (selectedFilter === "Today") {
        const itemDateStr = new Date(item.date)
          .toISOString()
          .split("T")[0];
        return itemDateStr === todayStr;
      }
      return true;
    });

  const handleFilterClick = (e) => {
    e.stopPropagation();
    setShowFilterDropdown(!showFilterDropdown);
  };

  const handleSaveFilter = () => {
    setShowFilterDropdown(false);
  };

  return (
    <div className='schedule'>
      <div className='search-section'>
        <div className='search-container'>
          <div className='search-input-wrapper'>
            <span className='search-icon'>
              <FaSearch />
            </span>
            <input
              type='text'
              placeholder='Search'
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className='search-input'
            />
          </div>
          <div
            className='filter-wrapper'
            ref={dropdownRef}
          >
            <button
              className='filter-button'
              onClick={handleFilterClick}
            >
              <span className='filter-icon'>
                <FaSliders />
              </span>
            </button>

            {showFilterDropdown && (
              <div className='filter-dropdown'>
                <div className='filter-header'>Filter</div>
                <select
                  value={selectedFilter}
                  onChange={(e) =>
                    setSelectedFilter(e.target.value)
                  }
                >
                  <option value='Today'>Today</option>
                  <option value='All'>All</option>
                </select>

                <button
                  className='save-filter-button'
                  onClick={handleSaveFilter}
                >
                  Save
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className='schedule-list'>
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setHighlightedId(item.id)}
            className={`schedule-item ${
              highlightedId === item.id ? "highlighted" : ""
            }`}
          >
            <div className='schedule-header'>
              <div className='schedule-type'>
                <p className='label'>{item.type}</p>
                <p className='contact-number'>
                  {item.phone}
                </p>
              </div>
              <div className='schedule-details'>
                <div className='contact-info'>
                  <span className='call-icon'>
                    <CiLocationOn size={20} />
                  </span>
                  <span className='call-label'>Call</span>
                </div>

                <div className='contact-person'>
                  <span className='avatar'>
                    <IoPersonSharp size={20} />
                  </span>
                  <span className='contact-name'>
                    {item.contact}
                  </span>
                </div>
              </div>
            </div>

            <div className='schedule-footer'>
              <div className='schedule-date'>
                <p>Date</p>
                <p>
                  {new Date(item.date).toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </p>
              </div>
              <div className='schedule-time'>
                <p>Time</p>
                <p>{item.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Schedule;
