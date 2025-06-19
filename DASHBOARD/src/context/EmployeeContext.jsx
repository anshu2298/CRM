import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const EmployeeContext = createContext();

export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch employees once on mount
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "http://localhost:3000/api/employee/all"
      );
      if (!res.ok)
        throw new Error("Failed to fetch employees");

      const data = await res.json();
      setEmployees(data);
    } catch (error) {
      console.error(
        "Error fetching employees:",
        error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // Call on mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        setEmployees,
        fetchEmployees,
        loading,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployeesContext = () =>
  useContext(EmployeeContext);
