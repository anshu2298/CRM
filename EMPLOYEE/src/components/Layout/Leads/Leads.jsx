import { useState, useEffect, useRef } from "react";
import "./Leads.css";
import { FaRegClock, FaSearch } from "react-icons/fa";
import { FaSliders } from "react-icons/fa6";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { IoChevronDownCircleOutline } from "react-icons/io5";
import { SlCalender } from "react-icons/sl";
import { useLeads } from "../../../context/LeadsContext";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";

function Leads() {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [showFilterDropdown, setShowFilterDropdown] =
    useState(false);
  const [activeDropdowns, setActiveDropdowns] = useState(
    {}
  );
  const { user } = useAuth();
  const {
    employeeLeads,
    updateLead,
    pendingStatus,
    setPendingStatus,
    pendingReminder,
    setPendingReminder,
    updateLeadReminder,
  } = useLeads();

  const dropdownRefs = useRef({});
  const filterDropdownRef = useRef(null);

  const handleReminderSave = (leadId) => {
    const reminder = pendingReminder[leadId];

    if (
      !reminder?.date ||
      !reminder?.hour ||
      !reminder?.minute ||
      !reminder?.period
    ) {
      alert(
        "Please select date, hour, minute, and period."
      );
      return;
    }

    const lead = employeeLeads.find(
      (lead) => lead._id === leadId
    );
    const isCold = lead?.type === "Cold";

    const formattedTime = `${reminder.hour}:${reminder.minute} ${reminder.period}`;

    const fullReminder = {
      date: reminder.date,
      time: formattedTime,
      callType: isCold ? "Cold call" : "Referral",
    };

    updateLeadReminder(leadId, fullReminder);

    toast.success("Reminder updated", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleClickOutside = (event) => {
    if (
      filterDropdownRef.current &&
      !filterDropdownRef.current.contains(event.target)
    ) {
      setShowFilterDropdown(false);
    }

    Object.keys(activeDropdowns).forEach((key) => {
      const ref = dropdownRefs.current[key];
      if (ref && !ref.contains(event.target)) {
        setActiveDropdowns((prev) => ({
          ...prev,
          [key]: false,
        }));
      }
    });
  };

  useEffect(() => {
    document.addEventListener(
      "mousedown",
      handleClickOutside
    );
    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, [activeDropdowns]);

  const filteredLeads = employeeLeads.filter((item) => {
    const matchesSearch =
      item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.email
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const todayStr = new Date().toISOString().split("T")[0];
    const itemDate = new Date(item.createdAt)
      .toISOString()
      .split("T")[0];

    const matchesFilter =
      filter === "All"
        ? true
        : filter === "Today"
        ? itemDate === todayStr
        : true;

    return matchesSearch && matchesFilter;
  });
  const toggleDropdown = (leadId, type) => {
    const key = `${leadId}-${type}`;
    setActiveDropdowns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className='leads'>
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
            ref={filterDropdownRef}
          >
            <button
              className='filter-button'
              onClick={() =>
                setShowFilterDropdown(!showFilterDropdown)
              }
            >
              <span className='filter-icon'>
                <FaSliders />
              </span>
            </button>

            {showFilterDropdown && (
              <div className='filter-dropdown'>
                <div className='filter-header'>Filter</div>
                <select
                  className='filter-select'
                  value={filter}
                  onChange={(e) =>
                    setFilter(e.target.value)
                  }
                >
                  <option value='All'>All</option>
                  <option value='Today'>Today</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className='leads-list'>
        {filteredLeads.map((lead) => (
          <div
            key={lead._id}
            className='leads-card'
          >
            <div className='lead-header'>
              <div className='lead-info'>
                <div
                  className={`lead-indicator ${lead.type.toLowerCase()}`}
                ></div>
                <div className='lead-details'>
                  <h3 className='lead-name'>{lead.name}</h3>
                  <p className='lead-email'>{lead.email}</p>
                </div>
              </div>
              <div
                className={`status-badge ${
                  lead.type === "Hot"
                    ? "border-hot"
                    : lead.type === "Warm"
                    ? "border-warm"
                    : "border-cold"
                } ${
                  lead.leadStatus === "Closed"
                    ? "closed"
                    : ""
                }`}
              >
                {lead.leadStatus}
              </div>
            </div>

            <div className='lead-footer'>
              <div className='lead-date'>
                <span className='calendar-icon'>
                  <SlCalender />
                </span>
                <span className='date-text'>
                  {new Date(lead.createdAt).toLocaleString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </span>
              </div>

              <div className='lead-actions'>
                {/* Type */}
                <div
                  className='action-dropdown'
                  ref={(el) =>
                    (dropdownRefs.current[
                      `${lead._id}-type`
                    ] = el)
                  }
                >
                  <button
                    className={`action-button type-button ${
                      lead.leadStatus === "Closed"
                        ? "closed"
                        : ""
                    }`}
                    disabled={
                      lead.leadStatus === "Closed"
                        ? true
                        : ""
                    }
                    onClick={() => {
                      toggleDropdown(lead._id, "type");
                    }}
                  >
                    <HiOutlinePencilSquare size={25} />
                  </button>
                  {activeDropdowns[`${lead._id}-type`] && (
                    <div className='dropdown-menu type-dropdown'>
                      <div className='dropdown-header'>
                        Type
                      </div>
                      <div className='dropdown-options'>
                        {["Hot", "Warm", "Cold"].map(
                          (opt) => (
                            <button
                              key={opt}
                              className={`dropdown-option ${opt.toLowerCase()}`}
                              onClick={async () => {
                                await updateLead(
                                  lead._id,
                                  "type",
                                  opt
                                );
                                toast.info(
                                  "Lead type updated.",
                                  {
                                    position: "top-right",
                                    autoClose: 2000,
                                  }
                                );
                                setActiveDropdowns(
                                  (prev) => ({
                                    ...prev,
                                    [`${lead._id}-type`]: false,
                                  })
                                );
                              }}
                            >
                              {opt}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Reminder */}
                <div
                  className='action-dropdown'
                  ref={(el) =>
                    (dropdownRefs.current[
                      `${lead._id}-time`
                    ] = el)
                  }
                >
                  <button
                    className={`action-button type-button ${
                      lead.leadStatus === "Closed"
                        ? "closed"
                        : ""
                    }`}
                    disabled={
                      lead.leadStatus === "Closed"
                        ? true
                        : ""
                    }
                    onClick={() =>
                      toggleDropdown(lead._id, "time")
                    }
                  >
                    <FaRegClock size={20} />
                  </button>
                  {activeDropdowns[`${lead._id}-time`] && (
                    <div className='dropdown-menu time-dropdown'>
                      <div className='dropdown-header'>
                        <input
                          type='date'
                          className='time-input'
                          onChange={(e) =>
                            setPendingReminder((prev) => ({
                              ...prev,
                              [lead._id]: {
                                ...(prev[lead._id] || {}),
                                date: e.target.value,
                              },
                            }))
                          }
                        />
                      </div>
                      <div className='time-input-wrapper'>
                        <div className='custom-time-selectors'>
                          <select
                            onChange={(e) =>
                              setPendingReminder(
                                (prev) => ({
                                  ...prev,
                                  [lead._id]: {
                                    ...(prev[lead._id] ||
                                      {}),
                                    hour: e.target.value,
                                  },
                                })
                              )
                            }
                          >
                            {[...Array(12)].map((_, i) => {
                              const hour = String(
                                i + 1
                              ).padStart(2, "0");
                              return (
                                <option key={hour}>
                                  {hour}
                                </option>
                              );
                            })}
                          </select>

                          <span>:</span>

                          <select
                            onChange={(e) =>
                              setPendingReminder(
                                (prev) => ({
                                  ...prev,
                                  [lead._id]: {
                                    ...(prev[lead._id] ||
                                      {}),
                                    minute: e.target.value,
                                  },
                                })
                              )
                            }
                          >
                            {["00", "15", "30", "45"].map(
                              (min) => (
                                <option key={min}>
                                  {min}
                                </option>
                              )
                            )}
                          </select>

                          <select
                            onChange={(e) =>
                              setPendingReminder(
                                (prev) => ({
                                  ...prev,
                                  [lead._id]: {
                                    ...(prev[lead._id] ||
                                      {}),
                                    period: e.target.value,
                                  },
                                })
                              )
                            }
                          >
                            <option>AM</option>
                            <option>PM</option>
                          </select>
                        </div>
                      </div>
                      <button
                        className='save-dropdown-button'
                        onClick={() => {
                          {
                            handleReminderSave(lead._id);
                            setActiveDropdowns((prev) => ({
                              ...prev,
                              [`${lead._id}-time`]: false,
                            }));
                          }
                        }}
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>

                {/* Status */}
                <div
                  className='action-dropdown'
                  ref={(el) =>
                    (dropdownRefs.current[
                      `${lead._id}-leadStatus`
                    ] = el)
                  }
                >
                  <button
                    className={`action-button type-button ${
                      lead.leadStatus === "Closed"
                        ? "closed"
                        : ""
                    }`}
                    disabled={
                      lead.leadStatus === "Closed"
                        ? true
                        : ""
                    }
                    onClick={() =>
                      toggleDropdown(lead._id, "leadStatus")
                    }
                  >
                    <IoChevronDownCircleOutline size={25} />
                  </button>
                  {activeDropdowns[
                    `${lead._id}-leadStatus`
                  ] && (
                    <div className='dropdown-menu status-dropdown'>
                      <div className='dropdown-header'>
                        Lead Status
                      </div>
                      <div className='dropdown-options'>
                        <select
                          defaultValue={lead.leadStatus}
                          onChange={(e) =>
                            setPendingStatus((prev) => ({
                              ...prev,
                              [lead._id]: e.target.value,
                            }))
                          }
                        >
                          <option value='Ongoing'>
                            Ongoing
                          </option>
                          <option value='Closed'>
                            Closed
                          </option>
                        </select>
                      </div>
                      <button
                        disabled={loading}
                        className='save-dropdown-button'
                        onClick={async () => {
                          setLoading(true);
                          await updateLead(
                            lead._id,
                            "leadStatus",
                            pendingStatus[lead._id] ||
                              lead.leadStatus,
                            user._id
                          );
                          setLoading(false);
                          toast.info(
                            `Lead status changed to ${
                              pendingStatus[lead._id] ||
                              lead.leadStatus
                            }`,
                            {
                              position: "top-right",
                              autoClose: 2000,
                            }
                          );
                          setActiveDropdowns((prev) => ({
                            ...prev,
                            [`${lead._id}-leadStatus`]: false,
                          }));
                        }}
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Leads;
