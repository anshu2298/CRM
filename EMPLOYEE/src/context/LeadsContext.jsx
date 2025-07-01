import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import { API_PATHS } from "../utils/apiPaths";
const LeadsContext = createContext();

export const LeadsProvider = ({ children }) => {
  const { user } = useAuth();
  const [employeeLeads, setEmployeeLeads] = useState([]);
  const [pendingStatus, setPendingStatus] = useState({});
  const [pendingReminder, setPendingReminder] = useState(
    {}
  );

  const fetchEmployeeLeads = async (employeeId) => {
    try {
      const res = await fetch(
        API_PATHS.LEADS.GET(employeeId)
      );
      const data = await res.json();
      if (res.ok) {
        setEmployeeLeads(data.assignedLeads || []);
      } else {
        console.error(
          "Failed to fetch employee leads:",
          data.message
        );
      }
    } catch (err) {
      console.error("Error fetching leads:", err);
    }
  };

  const updateLead = async (
    leadId,
    field,
    value,
    employeeId
  ) => {
    setEmployeeLeads((prev) =>
      prev.map((lead) =>
        lead._id === leadId
          ? { ...lead, [field]: value }
          : lead
      )
    );

    await fetch(API_PATHS.LEADS.UPDATE(leadId), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });

    if (field === "leadStatus") {
      await fetch(API_PATHS.EMPLOYEE.UPDATE(employeeId), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addToClosedLeads: leadId,
        }),
      });
      await fetch(API_PATHS.NOTIFICATION.ADD, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `${user.name} closed a lead`,
          type: "close",
        }),
      });
      await fetch(
        API_PATHS.EMPLOYEE.SET_ACTIVITY(employeeId),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: `You closed a lead`,
          }),
        }
      );
    }
  };

  const updateLeadReminder = async (
    leadId,
    reminderData
  ) => {
    try {
      const res = await fetch(
        API_PATHS.LEADS.SET_REMINDER(leadId),
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reminderData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error(
          "Failed to update reminder:",
          data.message
        );
        return;
      }

      setEmployeeLeads((prev) =>
        prev.map((lead) =>
          lead._id === leadId
            ? { ...lead, reminder: data.lead.reminder }
            : lead
        )
      );
      await fetch(API_PATHS.NOTIFICATION.ADD, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `${user.name} scheduled a call`,
          type: "close",
        }),
      });
      await fetch(
        API_PATHS.EMPLOYEE.SET_ACTIVITY(user._id),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: `you scheduled a call`,
          }),
        }
      );
    } catch (error) {
      console.error("Error updating reminder:", error);
    }
  };

  useEffect(() => {
    if (user?._id) fetchEmployeeLeads(user._id);
  }, [user]);

  return (
    <LeadsContext.Provider
      value={{
        employeeLeads,
        setEmployeeLeads,
        updateLead,
        pendingStatus,
        setPendingStatus,
        pendingReminder,
        setPendingReminder,
        updateLeadReminder,
      }}
    >
      {children}
    </LeadsContext.Provider>
  );
};

export const useLeads = () => useContext(LeadsContext);
