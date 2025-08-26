import { useEffect, useState, useCallback, useRef } from "react";
import {
  PencilSquareIcon,
  CheckIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  XCircleIcon,
  EyeIcon ,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";
import { useNavigate } from 'react-router-dom';

const QRDataManagement = () => {
  const navigate = useNavigate();
  
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    scan_count: 0,
    package_type: "",
    email: "",
    redirect_url: "",
  });
  const [expandedRow, setExpandedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationData, setVerificationData] = useState(null);
  const [showVerification, setShowVerification] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  const ITEMS_PER_PAGE = 20;
  const searchTimeoutRef = useRef(null);

  const showNotification = (message, type = "info") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  const fetchQRData = useCallback(async (page = 1, search = "") => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3001/api/adminqrdata?search=${encodeURIComponent(search)}&page=${page}&limit=${ITEMS_PER_PAGE}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch QR data");
      }

      const result = await response.json();
      setData(result.data || []);
      setTotalPages(result.totalPages || 1);
      setCurrentPage(result.currentPage || 1);
    } catch (error) {
      console.error("Fetch error:", error);
      showNotification(error.message || "Failed to load QR data", "error");
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search effect
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setCurrentPage(1);
      fetchQRData(1, searchTerm);
    }, 500); // 500ms delay

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm, fetchQRData]);

  useEffect(() => {
    fetchQRData(1, "");
  }, [fetchQRData]);

  const handleEditClick = (item) => {
    setEditingId(item.id);
    setEditFormData({
      scan_count: item.scan_count,
      package_type: item.package_type,
      email: item.email,
      redirect_url: item.redirect_url,
    });
    setVerificationData(item);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: name === "scan_count" ? parseInt(value) || 0 : value,
    });
  };

  const handleCancelClick = () => {
    setEditingId(null);
    setVerificationData(null);
    setShowVerification(false);
  };

  const handleSaveClick = async () => {
    if (editFormData.package_type !== verificationData.package_type) {
      setShowVerification(true);
      return;
    }

    await performUpdate();
  };

  const performUpdate = async () => {
    try {
      console.log("Sending update:", { id: editingId, data: editFormData });

      const response = await fetch(
        `http://localhost:3001/api/adminupqr?id=${editingId}`,
        {
          method: "PUT",
          credentials: "include",
          body: JSON.stringify({
            scan_count: editFormData.scan_count,
            package_type: editFormData.package_type
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const responseData = await response.json();
      console.log("Update response:", responseData);

      if (!response.ok) {
        throw new Error(responseData.message || `Update failed with status ${response.status}`);
      }

      showNotification("QR data updated successfully!", "success");
      
      setEditingId(null);
      setShowVerification(false);
      setVerificationData(null);
      fetchQRData(currentPage, searchTerm);
    } catch (error) {
      console.error("Update error:", error);
      showNotification(error.message || "Failed to update QR data", "error");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchQRData(newPage, searchTerm);
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const toggleRowExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchQRData(1, searchTerm);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
    fetchQRData(1, "");
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <title>Admin QR Data</title>
      
      {/* Custom Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-md shadow-lg border-l-4 ${
          notification.type === "error" 
            ? "bg-red-100 border-red-500 text-red-700" 
            : "bg-green-100 border-green-500 text-green-700"
        }`}>
          <div className="flex items-center">
            {notification.type === "error" ? (
              <XCircleIcon className="w-5 h-5 mr-2" />
            ) : (
              <CheckCircleIcon className="w-5 h-5 mr-2" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

     <div className="flex items-center justify-between mb-6">
  <h1 className="text-2xl font-bold text-gray-800">
    QR Data Management
  </h1>
  <button
    onClick={() => navigate('/auditlogs')}
    className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
  >
    <EyeIcon className="w-5 h-5 mr-2" />
    View Audit Logs
  </button>
</div>
      {/* Search Bar */}
      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by package, email, or URL..."
            className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 flex items-center px-2 text-gray-400 right-2 hover:text-gray-600"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Verification Modal */}
      {showVerification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg shadow-xl">
            <div className="flex items-center mb-4">
              <ExclamationTriangleIcon className="w-8 h-8 mr-2 text-yellow-500" />
              <h3 className="text-lg font-semibold">Confirm Package Change</h3>
            </div>
            <p className="mb-4 text-gray-600">
              You are about to change the package type from{" "}
              <strong>{verificationData.package_type}</strong> to{" "}
              <strong>{editFormData.package_type}</strong>. This is a critical change.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowVerification(false)}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={performUpdate}
                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Confirm Change
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="w-12 h-12 border-b-2 border-blue-500 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Desktop Table */}
      {!isLoading && (
        <>
          <div className="hidden overflow-x-auto bg-white rounded-lg shadow-md md:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Scans
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Package
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Redirect URL
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Created Date
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    {editingId === item.id ? (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            name="scan_count"
                            value={editFormData.scan_count}
                            onChange={handleEditFormChange}
                            className="w-20 px-2 py-1 border border-gray-300 rounded"
                            min="0"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            name="package_type"
                            value={editFormData.package_type}
                            onChange={handleEditFormChange}
                            className="px-2 py-1 border border-gray-300 rounded"
                          >
                            <option value="All_QR">All_QR</option>
                            <option value="Single_QR">Single_QR</option>
                            <option value="Free">Free</option>
                            <option value="Premium">Premium</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {item.email}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {item.redirect_url}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {item.scan_count}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            item.package_type === "Premium" ? "bg-purple-100 text-purple-800" :
                            item.package_type === "All_QR" ? "bg-blue-100 text-blue-800" :
                            "bg-green-100 text-green-800"
                          }`}>
                            {item.package_type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {item.email}
                        </td>
                        <td className="max-w-xs px-6 py-4 text-sm text-gray-500 truncate whitespace-nowrap">
                          <a
                            href={item.redirect_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                            title={item.redirect_url}
                          >
                            {item.redirect_url}
                          </a>
                        </td>
                      </>
                    )}

                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {formatDate(item.created_date)}
                    </td>

                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                      {editingId === item.id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={handleSaveClick}
                            className="text-green-600 hover:text-green-900"
                            title="Save"
                          >
                            <CheckIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={handleCancelClick}
                            className="text-red-600 hover:text-red-900"
                            title="Cancel"
                          >
                            <XMarkIcon className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEditClick(item)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <PencilSquareIcon className="w-5 h-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {data.length === 0 && !isLoading && (
              <div className="py-8 text-center text-gray-500">
                No QR data found{searchTerm ? ` for "${searchTerm}"` : ''}.
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center px-3 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-1" />
                Previous
              </button>
              
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center px-3 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
              >
                Next
                <ArrowRightIcon className="w-4 h-4 ml-1" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QRDataManagement;