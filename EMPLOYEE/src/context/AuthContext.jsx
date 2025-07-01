import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { API_PATHS } from "../utils/apiPaths";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const changeActiveStatus = async (employeeId, status) => {
    try {
      const res = await fetch(
        API_PATHS.EMPLOYEE.UPDATE(employeeId),
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );

      if (!res.ok)
        throw new Error("Failed to update employee");
    } catch (error) {
      console.error(
        "Update employee error:",
        error.message
      );
      throw error;
    }
  };

  const logSessionEvent = async (employeeId, type) => {
    try {
      await fetch(
        API_PATHS.EMPLOYEE.UPDATE_SESSION(employeeId),
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ type }),
        }
      );
    } catch (err) {
      console.error(`Failed to log ${type} event`, err);
    }
  };

  const login = async (email, password) => {
    const res = await fetch(API_PATHS.EMPLOYEE.LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      setUser(data.user);
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );
      localStorage.setItem(
        "employeeId",
        data.user.employeeId
      );
      await logSessionEvent(data.user._id, "login");
      await changeActiveStatus(data.user._id, "Active");
      return { success: true };
    } else {
      return { success: false, message: data.message };
    }
  };

  const logout = async () => {
    if (user?._id) {
      await logSessionEvent(user._id, "logout");
      await changeActiveStatus(user._id, "Inactive");
    }
    setUser({});
    localStorage.removeItem("user");
    localStorage.removeItem("employeeId");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);
