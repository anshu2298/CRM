import "./EmployeesTable.css";
import { useState, useMemo } from "react";
import { getInitials } from "../../utils/support";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBinLine } from "react-icons/ri";

const EmployeesTable = ({
  menuState,
  employees,
  setShowDeleteModal,
  setEmployeeToDelete,
  onEditEmployee,
}) => {
  const [activeDropdown, setActiveDropdown] =
    useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  const handleDropdownToggle = (employeeId) => {
    setActiveDropdown(
      activeDropdown === employeeId ? null : employeeId
    );
  };

  const handleEditEmployee = (employee) => {
    onEditEmployee(employee);
    setActiveDropdown(null);
  };

  const handleDeleteEmployee = (employeeId) => {
    setActiveDropdown(null);
    setShowDeleteModal(true);
    setEmployeeToDelete(employeeId);
  };

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction:
            prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  const sortedEmployees = useMemo(() => {
    const sorted = [...employees];
    if (!sortConfig.key) return sorted;

    sorted.sort((a, b) => {
      const valA = a[sortConfig.key];
      const valB = b[sortConfig.key];

      if (typeof valA === "string") {
        return sortConfig.direction === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      return sortConfig.direction === "asc"
        ? valA - valB
        : valB - valA;
    });

    return sorted;
  }, [employees, sortConfig]);

  return (
    <div className='employees-table-container'>
      <div className='table-wrapper'>
        <table className='employees-table'>
          <thead>
            <tr>
              <th onClick={() => handleSort("name")}>
                Name{" "}
                {sortConfig.key === "name"
                  ? sortConfig.direction === "asc"
                    ? "▲"
                    : "▼"
                  : ""}
              </th>
              <th onClick={() => handleSort("employeeId")}>
                Employee ID{" "}
                {sortConfig.key === "employeeId"
                  ? sortConfig.direction === "asc"
                    ? "▲"
                    : "▼"
                  : ""}
              </th>
              <th
                onClick={() => handleSort("assignedLeads")}
              >
                Assigned Leads{" "}
                {sortConfig.key === "assignedLeads"
                  ? sortConfig.direction === "asc"
                    ? "▲"
                    : "▼"
                  : ""}
              </th>
              <th onClick={() => handleSort("closedLeads")}>
                Closed Leads{" "}
                {sortConfig.key === "closedLeads"
                  ? sortConfig.direction === "asc"
                    ? "▲"
                    : "▼"
                  : ""}
              </th>
              <th onClick={() => handleSort("status")}>
                Status{" "}
                {sortConfig.key === "status"
                  ? sortConfig.direction === "asc"
                    ? "▲"
                    : "▼"
                  : ""}
              </th>
              <th className='actions-column'></th>
            </tr>
          </thead>
          <tbody>
            {sortedEmployees.map((employee) => (
              <tr key={employee._id}>
                <td className='name-cell'>
                  <div className='employee-info'>
                    <div className='employee-avatar'>
                      {employee.avatar.startsWith(
                        "http"
                      ) ? (
                        <img
                          src={employee.avatar}
                          alt={employee.name}
                        />
                      ) : (
                        <span className='avatar-text'>
                          {getInitials(employee.name)}
                        </span>
                      )}
                    </div>
                    <div className='employee-details'>
                      <div className='employee-name'>
                        {employee.name}
                      </div>
                      <div className='employee-email'>
                        {employee.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td>{employee.employeeId}</td>
                <td>{employee.assignedLeads.length}</td>
                <td>{employee.closedLeads.length}</td>
                <td>
                  <span
                    className={`status-badge ${
                      employee.status.toLowerCase() ===
                      "active"
                        ? "status-active"
                        : "status-inactive"
                    }`}
                  >
                    <span
                      className={`status-dot ${
                        employee.status.toLowerCase() ===
                        "active"
                          ? "dot-active"
                          : "dot-inactive"
                      }`}
                    ></span>
                    {employee.status}
                  </span>
                </td>
                {menuState === "Employees" && (
                  <td className='actions-column'>
                    <div className='action-menu-container'>
                      <button
                        className='action-menu-btn'
                        onClick={() =>
                          handleDropdownToggle(employee._id)
                        }
                      >
                        <span className='action-dots'>
                          ⋮
                        </span>
                      </button>
                      {activeDropdown === employee._id && (
                        <div className='action-dropdown'>
                          <button
                            className='dropdown-item edit-item'
                            onClick={() =>
                              handleEditEmployee(employee)
                            }
                          >
                            <span className='dropdown-icon'>
                              <CiEdit size={25} />
                            </span>
                            Edit
                          </button>
                          <button
                            className='dropdown-item delete-item'
                            onClick={() =>
                              handleDeleteEmployee(
                                employee._id
                              )
                            }
                          >
                            <span className='dropdown-icon'>
                              <RiDeleteBinLine />
                            </span>
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeesTable;
