const BASE_URL = "http://localhost:3000/api";

export const API_PATHS = {
  LEADS: {
    GET: (employeeId) =>
      `${BASE_URL}/employee/${employeeId}/leads`,
    UPDATE: (leadId) => `${BASE_URL}/leads/${leadId}`,
    SET_REMINDER: (leadId) =>
      `${BASE_URL}/leads/${leadId}/reminder`,
  },
  EMPLOYEE: {
    LOGIN: `${BASE_URL}/employee/login`,
    UPDATE: (employeeId) =>
      `${BASE_URL}/employee/update/${employeeId}`,
    SET_ACTIVITY: (employeeId) =>
      `${BASE_URL}/employee/activity/${employeeId}`,
    UPDATE_SESSION: (employeeId) =>
      `${BASE_URL}/employee/session/${employeeId}`,
    GET_ATTENDANCE: (employeeId) =>
      `${BASE_URL}/employee/attendance/${employeeId}`,
  },
  NOTIFICATION: {
    ADD: `${BASE_URL}/events/add-event`,
  },
};
