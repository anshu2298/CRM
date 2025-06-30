import { useState } from "react";
import "./Employees.css";
import {
  languages,
  locations,
} from "../../../utils/data.js";
import EmployeesTable from "../../EmployeesTable/EmployeesTable.jsx";
import { useEmployeesContext } from "../../../context/EmployeeContext.jsx";

const Employees = ({ menuState }) => {
  const {
    employees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
  } = useEmployeesContext();

  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] =
    useState(false);
  const [employeeToDelete, setEmployeeToDelete] =
    useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] =
    useState(null);

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

  const handleAddEmployee = () => {
    setIsEditMode(false);
    setNewEmployee({
      firstName: "",
      lastName: "",
      email: "",
      location: "Karnataka",
      preferredLanguage: "Tamil",
    });
    setShowAddModal(true);
  };

  const onEditEmployee = (employee) => {
    const [firstName, ...lastNameParts] =
      employee.name.split(" ");
    const lastName = lastNameParts.join(" ");

    setNewEmployee({
      firstName: firstName || "",
      lastName: lastName || "",
      email: employee.email,
      location: employee.location,
      preferredLanguage: employee.preferredLanguage,
    });

    setEmployeeToEdit(employee._id); // Save ID to use during update
    setIsEditMode(true);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setIsEditMode(false);
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
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEmployee = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await updateEmployee(employeeToEdit, newEmployee);
      } else {
        await addEmployee(newEmployee);
      }
      handleCloseModal();
    } catch (error) {
      console.log(error);
      alert("Something went wrong!");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteEmployee(employeeToDelete);
      setShowDeleteModal(false);
      setEmployeeToDelete(null);
    } catch (error) {
      console.log(error);
      alert("Failed to delete employee");
    }
  };

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
        setShowDeleteModal={setShowDeleteModal}
        setEmployeeToDelete={setEmployeeToDelete}
        onEditEmployee={onEditEmployee}
      />

      {/* Pagination */}
      <div className='pagination'>
        <button
          className='pagination-btn pagination-prev'
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <span className='pagination-arrow'>←</span>{" "}
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
          Next <span className='pagination-arrow'>→</span>
        </button>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className='delete-modal-overlay'>
          <div className='delete-modal-content'>
            <p className='modal-message'>
              All the Leads will be distributed among other
              employees equally. Do you want to delete this
              employee?
            </p>
            <div className='delete-modal-actions'>
              <button
                className='modal-button modal-button-cancel'
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className='modal-button modal-button-confirm'
                onClick={handleConfirmDelete}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <>
          <div
            className='modal-overlay'
            onClick={handleCloseModal}
          ></div>
          <div className='add-employee-modal'>
            <div className='modal-header'>
              <h2 className='modal-title'>
                {isEditMode
                  ? "Edit Employee"
                  : "Add New Employee"}
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
              {["firstName", "lastName", "email"].map(
                (field) => (
                  <div
                    className='form-group'
                    key={field}
                  >
                    <label
                      htmlFor={field}
                      className='form-label'
                    >
                      {field.replace(/([A-Z])/g, " $1")}
                    </label>
                    <input
                      type={
                        field === "email" ? "email" : "text"
                      }
                      id={field}
                      name={field}
                      value={newEmployee[field]}
                      onChange={handleInputChange}
                      className='form-input'
                      required
                    />
                  </div>
                )
              )}

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
                    disabled={isEditMode}
                  >
                    {locations.map((loc) => (
                      <option
                        key={loc}
                        value={loc}
                      >
                        {loc}
                      </option>
                    ))}
                  </select>
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
                    disabled={isEditMode}
                  >
                    {languages.map((lang) => (
                      <option
                        key={lang}
                        value={lang}
                      >
                        {lang}
                      </option>
                    ))}
                  </select>
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
