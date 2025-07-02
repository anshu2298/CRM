// const BASE_URL = "http://localhost:3000/api";
const BASE_URL = "https://crm-backend-sooty.vercel.app";
export const API_PATHS = {
  LEADS: {
    GET: (employeeId) =>
      `${BASE_URL}/api/employee/${employeeId}/leads`,
    UPDATE: (leadId) => `${BASE_URL}/api/leads/${leadId}`,
    SET_REMINDER: (leadId) =>
      `${BASE_URL}/api/leads/${leadId}/reminder`,
  },
  EMPLOYEE: {
    LOGIN: `${BASE_URL}/api/employee/login`,
    UPDATE: (employeeId) =>
      `${BASE_URL}/api/employee/update/${employeeId}`,
    SET_ACTIVITY: (employeeId) =>
      `${BASE_URL}/api/employee/activity/${employeeId}`,
    UPDATE_SESSION: (employeeId) =>
      `${BASE_URL}/api/employee/session/${employeeId}`,
    GET_ATTENDANCE: (employeeId) =>
      `${BASE_URL}/api/employee/attendance/${employeeId}`,
  },
  NOTIFICATION: {
    ADD: `${BASE_URL}/api/events/add-event`,
  },
};
