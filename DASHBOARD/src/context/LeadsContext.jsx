import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const LeadsContext = createContext();

export const LeadsProvider = ({ children }) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  //   Fetch leads once on mount
  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "http://localhost:3000/api/cvs/get-cvs-data"
      );
      if (!res.ok) throw new Error("Failed to fetch leads");

      const data = await res.json();
      setLeads(data);
    } catch (error) {
      console.error("Error fetching leads:", error.message);
    } finally {
      setLoading(false);
    }
  };
  // Call on mount
  useEffect(() => {
    fetchLeads();
  }, []);

  return (
    <LeadsContext.Provider
      value={{ leads, setLeads, fetchLeads, loading }}
    >
      {children}
    </LeadsContext.Provider>
  );
};

export const useLeadsContext = () =>
  useContext(LeadsContext);
