import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const EmployeeContext = createContext();

export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const [activeEmployees, setActiveEmployees] =
    useState("");
  const [loading, setLoading] = useState(true);

  // 🔁 Fetch all employees
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

      const activeCount = data.filter(
        (emp) => emp.status === "Active"
      ).length;
      setActiveEmployees(activeCount);
    } catch (error) {
      console.error(
        "Error fetching employees:",
        error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // ➕ Add
  const addEmployee = async (employeeData) => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/employee/add",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(employeeData),
        }
      );

      if (!res.ok)
        throw new Error("Failed to add employee");

      await fetchEmployees();
    } catch (error) {
      console.error("Add employee error:", error.message);
      throw error;
    }
  };

  // ✏️ Update
  const updateEmployee = async (id, employeeData) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/employee/update/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(employeeData),
        }
      );

      if (!res.ok)
        throw new Error("Failed to update employee");

      await fetchEmployees();
    } catch (error) {
      console.error(
        "Update employee error:",
        error.message
      );
      throw error;
    }
  };

  // ❌ Delete
  const deleteEmployee = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/employee/delete/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok)
        throw new Error("Failed to delete employee");

      await fetchEmployees();
    } catch (error) {
      console.error(
        "Delete employee error:",
        error.message
      );
      throw error;
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        loading,
        fetchEmployees,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        activeEmployees,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployeesContext = () =>
  useContext(EmployeeContext);
