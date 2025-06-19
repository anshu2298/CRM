import "./EmployeesTable.css";
import { useEffect, useState } from "react";
import { getInitials } from "../../utils/support";

const EmployeesTable = ({
  menuState,
  employees,
  handleCheckboxChange,
}) => {
  const [activeDropdown, setActiveDropdown] =
    useState(null);

  const [selectedEmployees, setSelectedEmployees] =
    useState([]);

  const handleDropdownToggle = (employeeId) => {
    setActiveDropdown(
      activeDropdown === employeeId ? null : employeeId
    );
  };

  const handleEditEmployee = (employee) => {
    console.log("Edit employee:", employee);
    setActiveDropdown(null);
    // Here you would typically open an edit modal or navigate to edit page
  };

  const handleDeleteEmployee = (employeeId) => {
    console.log("Delete employee:", employeeId);
    setActiveDropdown(null);
    // Here you would typically show a confirmation dialog and then delete
  };

  const handleClickOutside = (e) => {
    if (!e.target.closest(".action-menu-container")) {
      setActiveDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () =>
      document.removeEventListener(
        "click",
        handleClickOutside
      );
  }, []);

  return (
    <div className='employees-table-container'>
      <div className='table-wrapper'>
        <table className='employees-table'>
          <thead>
            <tr>
              <th className='checkbox-column'>
                <input
                  type='checkbox'
                  className='table-checkbox'
                />
              </th>
              <th>Name</th>
              <th>Employee ID</th>
              <th>Assigned Leads</th>
              <th>Closed Leads</th>
              <th>Status</th>
              <th className='actions-column'></th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td className='checkbox-column'>
                  <input
                    type='checkbox'
                    className='table-checkbox'
                    checked={selectedEmployees.includes(
                      employee.id
                    )}
                    onChange={() =>
                      handleCheckboxChange(employee)
                    }
                  />
                </td>
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
                <td className='employee-id'>
                  {employee.employeeId}
                </td>
                <td className='leads-count'>
                  {employee.assignedLeads}
                </td>
                <td className='leads-count'>
                  {employee.closedLeads}
                </td>
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
                {menuState === "Employees" ? (
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
                              handleEditEmployee(
                                employee._id
                              )
                            }
                          >
                            <span className='dropdown-icon'>
                              ✏️
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
                              🗑️
                            </span>
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeesTable;
