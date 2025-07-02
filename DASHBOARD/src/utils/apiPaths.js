const BASE_URL = "http://localhost:3000";
// const BASE_URL = "https://crm-backend-sooty.vercel.app";
export const API_PATHS = {
  LEADS: {
    GET_ALL: `${BASE_URL}/api/leads/all`,
  },
  CSV_DATA: {
    GET: `${BASE_URL}/api/csv/get-csv-data`,
    UPLOAD: `${BASE_URL}/api/csv/upload-leads`,
  },
  EMPLOYEES: {
    GET: `${BASE_URL}/api/employee/all`,
    ADD: `${BASE_URL}/api/employee/add`,
    UPDATE: (employeeId) =>
      `${BASE_URL}/api/employee/update/${employeeId}`,
    DELETE: (employeeId) =>
      `${BASE_URL}/api/employee/delete/${employeeId}`,
  },
  EVENTS: {
    GET: `${BASE_URL}/api/events/getAllEvents`,
  },
  ADMIN: {
    GET_ADMIN_DATA: `${BASE_URL}/api/admin-auth/getUser`,
    UPDATE: `${BASE_URL}/api/admin-auth/update`,
  },
};
