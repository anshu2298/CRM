import { useState } from "react";
import "./Employees.css";
import {
  languages,
  locations,
} from "../../../utils/data.js";
import EmployeesTable from "../../EmployeesTable/EmployeesTable.jsx";
// import { employees } from "../../../utils/data.js";
import { useEmployeesContext } from "../../../context/EmployeeContext.jsx";

const Employees = ({ menuState }) => {
  const { employees } = useEmployeesContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    firstName: "",
    lastName: "",
    email: "",
    location: "Karnataka",
    preferredLanguage: "Tamil",
  });

  const employeesPerPage = 8;
  const totalPages = Math.ceil(
    employees.length / employeesPerPage
  );

  const paginatedEmployees = employees.slice(
    (currentPage - 1) * employeesPerPage,
    currentPage * employeesPerPage
  );

  // const handleCheckboxChange = (employeeId) => {
  //   setSelectedEmployees((prev) =>
  //     prev.includes(employeeId)
  //       ? prev.filter((id) => id !== employeeId)
  //       : [...prev, employeeId]
  //   );
  // };

  const handleAddEmployee = () => {
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setNewEmployee({
      firstName: "",
      lastName: "",
      email: "",
      location: "Karnataka",
      preferredLanguage: "English",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEmployee = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "http://localhost:3000/api/employee/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newEmployee),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || "Failed to add employee"
        );
      }

      const data = await res.json();
      console.log("Employee added:", data);

      // Optionally show a success toast or refresh list here

      handleCloseModal();
    } catch (error) {
      console.error(
        "Error adding employee:",
        error.message
      );
      alert("Failed to add employee");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // const handleEditEmployee = (employeeId) => {
  //   console.log("Edit employee:", employeeId);
  //   setActiveDropdown(null);
  // };

  return (
    <div className='employees-page'>
      <div className='employees-header'>
        <button
          className='add-employee-btn'
          onClick={handleAddEmployee}
        >
          Add Employees
        </button>
      </div>

      <EmployeesTable
        menuState={menuState}
        employees={paginatedEmployees}
        // handleCheckboxChange={handleCheckboxChange}

        // handleEditEmployee={handleEditEmployee}
      />

      <div className='pagination'>
        <button
          className='pagination-btn pagination-prev'
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <span className='pagination-arrow'>←</span>
          Previous
        </button>

        <div className='pagination-numbers'>
          {Array.from(
            { length: totalPages },
            (_, index) => index + 1
          ).map((page) => (
            <button
              key={page}
              className={`pagination-number ${
                currentPage === page ? "active" : ""
              }`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          className='pagination-btn pagination-next'
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
          <span className='pagination-arrow'>→</span>
        </button>
      </div>

      {showAddModal && (
        <>
          <div
            className='modal-overlay'
            onClick={handleCloseModal}
          ></div>
          <div className='add-employee-modal'>
            <div className='modal-header'>
              <h2 className='modal-title'>
                Add New Employee
              </h2>
              <button
                className='modal-close-btn'
                onClick={handleCloseModal}
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleSaveEmployee}
              className='modal-form'
            >
              <div className='form-group'>
                <label
                  htmlFor='firstName'
                  className='form-label'
                >
                  First name
                </label>
                <input
                  type='text'
                  id='firstName'
                  name='firstName'
                  value={newEmployee.firstName}
                  onChange={handleInputChange}
                  className='form-input'
                  placeholder='Sarthak'
                  required
                />
              </div>

              <div className='form-group'>
                <label
                  htmlFor='lastName'
                  className='form-label'
                >
                  Last name
                </label>
                <input
                  type='text'
                  id='lastName'
                  name='lastName'
                  value={newEmployee.lastName}
                  onChange={handleInputChange}
                  className='form-input'
                  placeholder='Pal'
                  required
                />
              </div>

              <div className='form-group'>
                <label
                  htmlFor='email'
                  className='form-label'
                >
                  Email
                </label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  value={newEmployee.email}
                  onChange={handleInputChange}
                  className='form-input'
                  placeholder='Sarthakpal08@gmail.com'
                  required
                />
              </div>

              <div className='form-group'>
                <label
                  htmlFor='location'
                  className='form-label'
                >
                  Location
                </label>
                <div className='select-wrapper'>
                  <select
                    id='location'
                    name='location'
                    value={newEmployee.location}
                    onChange={handleInputChange}
                    className='form-select'
                    required
                  >
                    {locations.map((location) => (
                      <option
                        key={location}
                        value={location}
                      >
                        {location}
                      </option>
                    ))}
                  </select>
                  <div className='select-arrow'>▼</div>
                </div>
                <div className='form-hint'>
                  <span className='hint-icon'>ℹ</span>
                  Lead will be assigned on basis of location
                </div>
              </div>

              <div className='form-group'>
                <label
                  htmlFor='preferredLanguage'
                  className='form-label'
                >
                  Preferred Language
                </label>
                <div className='select-wrapper'>
                  <select
                    id='preferredLanguage'
                    name='preferredLanguage'
                    value={newEmployee.preferredLanguage}
                    onChange={handleInputChange}
                    className='form-select'
                    required
                  >
                    {languages.map((language) => (
                      <option
                        key={language}
                        value={language}
                      >
                        {language}
                      </option>
                    ))}
                  </select>
                  <div className='select-arrow'>▼</div>
                </div>
                <div className='form-hint'>
                  <span className='hint-icon'>ℹ</span>
                  Lead will be assigned on basis of language
                </div>
              </div>

              <div className='form-actions'>
                <button
                  type='submit'
                  className='save-btn'
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default Employees;
