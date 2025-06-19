import { useState } from "react";
import "./Leads.css";
import { useLeadsContext } from "../../../context/LeadsContext";
import { FaFolderPlus } from "react-icons/fa";
import { CiFileOn } from "react-icons/ci";
import { AiOutlineDelete } from "react-icons/ai";
import {
  buildStyles,
  CircularProgressbar,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function Leads() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDropdown, setActiveDropdown] =
    useState(null);
  const [progress, setProgress] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [leadDistribution, setLeadDistribution] =
    useState(true);
  const [language, setLanguage] = useState(true);
  const [location, setLocation] = useState(true);
  const { leads } = useLeadsContext();
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const percentage = 66;
  const leadsPerPage = 5;
  const totalPages = Math.ceil(leads.length / leadsPerPage);

  const paginatedLeads = leads.slice(
    (currentPage - 1) * leadsPerPage,
    currentPage * leadsPerPage
  );

  const handleUpload = () => {
    if (selectedFile) {
      console.log(
        "Processing CSV file:",
        selectedFile.name
      );
      console.log("Lead Distribution:", leadDistribution);
      console.log("Language:", language);
      console.log("Location:", location);
      // Here you would typically process the CSV file
      handleCloseModal();
    } else {
      alert("Please select a CSV file first");
    }
  };

  const handleAddLead = () => {
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setSelectedFile(null);
    setIsDragOver(false);
  };

  const handleFileSelect = (file) => {
    if (file && file.type === "text/csv") {
      setIsLoadingFile(true);
      setProgress(0);

      let progressValue = 0;
      const interval = setInterval(() => {
        progressValue += 20;
        setProgress(progressValue);
        if (progressValue >= 100) {
          clearInterval(interval);
          setSelectedFile(file); // show file details + toggles
          setIsLoadingFile(false);
        }
      }, 1000);
    } else {
      alert("Please select a valid CSV file");
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleBrowseFiles = () => {
    document.getElementById("csv-file-input").click();
  };

  const handleNext = () => {
    if (selectedFile) {
      console.log(
        "Processing CSV file:",
        selectedFile.name
      );
      // Here you would typically process the CSV file
      handleCloseModal();
    } else {
      alert("Please select a CSV file first");
    }
  };

  const handleDropdownToggle = (leadId) => {
    setActiveDropdown(
      activeDropdown === leadId ? null : leadId
    );
  };

  const handleDeleteLead = (leadId) => {
    console.log("Delete lead:", leadId);
    setActiveDropdown(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (e) => {
    if (!e.target.closest(".action-menu-container")) {
      setActiveDropdown(null);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      parseFloat((bytes / Math.pow(k, i)).toFixed(2)) +
      " " +
      sizes[i]
    );
  };

  // Add event listener for clicking outside
  useState(() => {
    document.addEventListener("click", handleClickOutside);
    return () =>
      document.removeEventListener(
        "click",
        handleClickOutside
      );
  }, []);

  return (
    <div className='leads-page'>
      <div className='leads-header'>
        <button
          className='add-lead-btn'
          onClick={handleAddLead}
        >
          Add Leads
        </button>
      </div>

      <div className='leads-table-container'>
        <div className='table-wrapper'>
          <table className='leads-table'>
            <thead>
              <tr>
                <th>No.</th>
                <th>Name</th>
                <th>Date</th>
                <th>No. of Leads</th>
                <th>Assigned Leads</th>
                <th>Unassigned Leads</th>
                <th className='actions-column'></th>
              </tr>
            </thead>
            <tbody>
              {paginatedLeads.map((lead, i) => (
                <tr key={lead._id}>
                  <td className='lead-no'>{i + 1}</td>
                  <td className='lead-name'>
                    {lead.fileName}
                  </td>
                  <td className='lead-date'>
                    {new Date(lead.Date).toLocaleDateString(
                      "en-GB"
                    )}
                  </td>
                  <td className='lead-count'>
                    {lead.totalLeads}
                  </td>
                  <td className='lead-count'>
                    {lead.assignedLeads}
                  </td>
                  <td className='lead-count'>
                    {lead.unassignedLeads}
                  </td>
                  <td className='actions-column'>
                    <div className='action-menu-container'>
                      <button
                        className='action-menu-btn'
                        onClick={() =>
                          handleDropdownToggle(lead._id)
                        }
                      >
                        <span className='action-dots'>
                          ⋮
                        </span>
                      </button>
                      {activeDropdown === lead._id && (
                        <div className='action-dropdown'>
                          <button
                            className='dropdown-item delete-item'
                            onClick={() =>
                              handleDeleteLead(lead._id)
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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

      {/* CSV Upload Modal */}
      {showAddModal && (
        <>
          <div
            className='modal-overlay'
            onClick={handleCloseModal}
          ></div>
          <div className='csv-upload-modal'>
            <div className='modal-header'>
              <h2 className='modal-title'>CSV Upload</h2>
              <button
                className='modal-close-btn'
                onClick={handleCloseModal}
              >
                ×
              </button>
            </div>

            <div className='modal-content'>
              <p className='upload-subtitle'>
                Add your documents here
              </p>
              {isLoadingFile ? (
                <div className='loading-area'>
                  <div className='loading-content'>
                    <CircularProgressbar
                      styles={buildStyles({
                        textColor: "#000",
                        pathColor: "#000",
                        trailColor: "#d6d6d6",
                        textSize: "25px",
                      })}
                      value={progress}
                      text={`${progress}%`}
                    />
                  </div>
                  <p>Verifying...</p>
                  <button className='loading-cancel-btn'>
                    Cancel
                  </button>
                </div>
              ) : (
                <div
                  className={`upload-area ${
                    isDragOver ? "drag-over" : ""
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type='file'
                    id='csv-file-input'
                    accept='.csv'
                    onChange={handleFileInputChange}
                    style={{ display: "none" }}
                  />

                  <div className='upload-icon'>
                    <FaFolderPlus size={50} />
                  </div>
                  <p className='upload-text'>
                    Drag your file(s) to start uploading
                  </p>
                  <p className='upload-or'>OR</p>
                  <button
                    type='button'
                    className='browse-btn'
                    onClick={handleBrowseFiles}
                  >
                    Browse files
                  </button>
                </div>
              )}

              {/* File Selected State */}
              {isLoadingFile
                ? null
                : selectedFile && (
                    <>
                      <div className='uploaded-file'>
                        <div className='file-icon-container'>
                          <CiFileOn size={30} />
                        </div>
                        <div className='file-details'>
                          <span className='file-name'>
                            {selectedFile.name}
                          </span>
                          <span className='file-size'>
                            {formatFileSize(
                              selectedFile.size
                            )}
                          </span>
                        </div>
                        <button
                          className='remove-file-button'
                          onClick={handleRemoveFile}
                        >
                          <AiOutlineDelete size={20} />
                        </button>
                      </div>

                      {/* Configuration Options */}
                      <div className='config-section'>
                        <div className='config-item'>
                          <span className='config-label'>
                            Lead distribution
                          </span>
                          <label className='toggle-switch'>
                            <input
                              type='checkbox'
                              checked={leadDistribution}
                              onChange={(e) =>
                                setLeadDistribution(
                                  e.target.checked
                                )
                              }
                            />
                            <span className='toggle-slider'></span>
                          </label>
                        </div>

                        <div className='config-item'>
                          <span className='config-label'>
                            Language
                          </span>
                          <label className='toggle-switch'>
                            <input
                              type='checkbox'
                              checked={language}
                              onChange={(e) =>
                                setLanguage(
                                  e.target.checked
                                )
                              }
                            />
                            <span className='toggle-slider'></span>
                          </label>
                        </div>

                        <div className='config-item'>
                          <span className='config-label'>
                            Location
                          </span>
                          <label className='toggle-switch'>
                            <input
                              type='checkbox'
                              checked={location}
                              onChange={(e) =>
                                setLocation(
                                  e.target.checked
                                )
                              }
                            />
                            <span className='toggle-slider'></span>
                          </label>
                        </div>
                      </div>
                    </>
                  )}

              <div className='sample-file-info'>
                <span className='sample-file-text'>
                  Sample File.csv
                </span>
                <button className='download-btn'>
                  <svg
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15'
                      stroke='#6B7280'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M7 10L12 15L17 10'
                      stroke='#6B7280'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M12 15V3'
                      stroke='#6B7280'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </button>
              </div>

              <div className='modal-actions'>
                <button
                  type='button'
                  className='cancel-btn'
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type='button'
                  className={`action-btn ${
                    selectedFile ? "upload-btn" : "next-btn"
                  }`}
                  onClick={
                    selectedFile
                      ? handleUpload
                      : handleBrowseFiles
                  }
                >
                  {selectedFile ? "Upload" : "Next"}
                  {!selectedFile && (
                    <span className='next-arrow'>→</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Leads;
