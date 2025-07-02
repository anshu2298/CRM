import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { getLastNDays } from "../utils/support";
import { API_PATHS } from "../utils/apiPaths";
const LeadsContext = createContext();

export const LeadsProvider = ({ children }) => {
  const [csvStats, setCsvStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weeklyAssigned, setWeeklyAssigned] = useState(0);
  const [leads, setLeads] = useState([]);
  const [conversionRate, setConversionRate] = useState(0);
  const [totalUnassignedLeads, setTotalUnassignedLeads] =
    useState(0);

  const [salesData, setSalesData] = useState([]);
  const fetchCsvStats = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_PATHS.CSV_DATA.GET);
      if (!res.ok) throw new Error("Failed to fetch leads");

      const data = await res.json();
      setCsvStats(data);

      const now = new Date();
      const currentDay = now.getDay();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - currentDay);
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      const assignedThisWeek = data.reduce((sum, csv) => {
        const csvDate = new Date(csv.Date);
        return csvDate >= startOfWeek &&
          csvDate <= endOfWeek
          ? sum + csv.assignedLeads
          : sum;
      }, 0);

      // Sum of all unassigned leads
      const totalUnassignedLeads = data.reduce(
        (sum, csv) => {
          return sum + (csv.unassignedLeads || 0);
        },
        0
      );
      console.log(totalUnassignedLeads);
      setTotalUnassignedLeads(totalUnassignedLeads);
      setWeeklyAssigned(assignedThisWeek);
    } catch (error) {
      console.error("Error fetching leads:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchClosedLeads = async () => {
    try {
      const res = await fetch(API_PATHS.LEADS.GET_ALL);
      const { leads } = await res.json();
      const closedLeads = leads.filter(
        (lead) => lead.leadClosedAt
      );
      const last14Days = getLastNDays(14);
      const dayMap = {};
      last14Days.forEach((entry) => {
        dayMap[entry.date] = { day: entry.day, count: 0 };
      });

      closedLeads.forEach((lead) => {
        const closedDate = new Date(lead.leadClosedAt)
          .toISOString()
          .split("T")[0];
        if (dayMap[closedDate]) {
          dayMap[closedDate].count += 1;
        }
      });

      const chartData = Object.values(dayMap).map((d) => ({
        day: d.day,
        percentage: d.count,
      }));

      setSalesData(chartData);
    } catch (err) {
      console.error("Failed to fetch leads", err);
    }
  };

  const fetchLeads = async () => {
    try {
      const res = await fetch(API_PATHS.LEADS.GET_ALL);
      const data = await res.json();

      if (res.ok && data.leads) {
        setLeads(data.leads);

        const totalLeads = data.leads.length;

        const closedLeads = data.leads.filter(
          (lead) => lead.leadStatus === "Closed"
        ).length;

        const rate =
          totalLeads > 0
            ? Math.round((closedLeads / totalLeads) * 100)
            : 0;

        setConversionRate(rate);
      } else {
        console.error("Failed to fetch leads.");
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  // Call on mount
  useEffect(() => {
    fetchLeads();
    fetchCsvStats();
    fetchClosedLeads();
  }, []);

  return (
    <LeadsContext.Provider
      value={{
        csvStats,
        setCsvStats,
        fetchLeads,
        loading,
        weeklyAssigned,
        leads,
        conversionRate,
        totalUnassignedLeads,
        salesData,
      }}
    >
      {children}
    </LeadsContext.Provider>
  );
};

export const useLeadsContext = () =>
  useContext(LeadsContext);
