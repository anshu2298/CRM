import { useMemo, useState, useEffect } from "react";
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
import { FaDownload } from "react-icons/fa6";

function Leads() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDropdown, setActiveDropdown] =
    useState(null);
  const [progress, setProgress] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoadingFile, setIsLoadingFile] = useState(false);

  const { csvStats } = useLeadsContext();

  const leadsPerPage = 5;
  const totalPages = Math.ceil(
    csvStats.length / leadsPerPage
  );

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a CSV file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    `.single("file")`;

    try {
      const res = await fetch(
        "http://localhost:3000/api/csv/upload-leads",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await res.json();
      console.log("Upload Response:", result);

      // Optional: Close modal and reset
      handleCloseModal();
    } catch (err) {
      console.error("Upload failed:", err);
    }
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

  const sortedStats = useMemo(() => {
    const sorted = [...csvStats];
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
  }, [csvStats, sortConfig]);

  const paginatedLeads = sortedStats.slice(
    (currentPage - 1) * leadsPerPage,
    currentPage * leadsPerPage
  );

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
          setSelectedFile(file);
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

  useEffect(() => {
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
                <th onClick={() => handleSort("fileName")}>
                  Name{" "}
                  {sortConfig.key === "fileName"
                    ? sortConfig.direction === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
                <th onClick={() => handleSort("Date")}>
                  Date{" "}
                  {sortConfig.key === "Date"
                    ? sortConfig.direction === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
                <th
                  onClick={() => handleSort("totalLeads")}
                >
                  No. of Leads{" "}
                  {sortConfig.key === "totalLeads"
                    ? sortConfig.direction === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
                <th
                  onClick={() =>
                    handleSort("assignedLeads")
                  }
                >
                  Assigned Leads{" "}
                  {sortConfig.key === "assignedLeads"
                    ? sortConfig.direction === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
                <th
                  onClick={() =>
                    handleSort("unassignedLeads")
                  }
                >
                  Unassigned Leads{" "}
                  {sortConfig.key === "unassignedLeads"
                    ? sortConfig.direction === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
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
          Next <span className='pagination-arrow'>→</span>
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

              {isLoadingFile
                ? null
                : selectedFile && (
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
                  )}

              <div className='sample-file-info'>
                <span className='sample-file-text'>
                  Sample File.csv
                </span>
                <button className='download-btn'>
                  <FaDownload size={20} />
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
                  disabled={isLoadingFile}
                  type='button'
                  onClick={
                    selectedFile
                      ? handleUpload
                      : handleBrowseFiles
                  } // 👈 Hook it up
                  className={`action-btn ${
                    selectedFile ? "upload-btn" : "next-btn"
                  }`}
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
