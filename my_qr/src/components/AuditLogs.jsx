import { useEffect, useState } from "react";
import {
  MagnifyingGlassIcon,
  EyeIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  FunnelIcon, // Using FunnelIcon instead of FilterIcon
  XMarkIcon,
} from "@heroicons/react/24/solid";

const AuditLogs = () => {
  const [auditData, setAuditData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    qr_id: "",
    change_type: "",
    start_date: "",
    end_date: "",
  });

  const ITEMS_PER_PAGE = 20;

  const fetchAuditLogs = async (page = 1, filterParams = {}) => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page,
        limit: ITEMS_PER_PAGE,
        ...filterParams,
      }).toString();

      const response = await fetch(
        `http://localhost:3001/api/audit-logs?${queryParams}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch audit logs");
      }

      const result = await response.json();
      setAuditData(result.data || []);
      setTotalPages(result.totalPages || 1);
      setCurrentPage(result.currentPage || 1);
    } catch (error) {
      console.error("Fetch error:", error);
      setAuditData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs(1, filters);
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    setCurrentPage(1);
    fetchAuditLogs(1, filters);
  };

  const clearFilters = () => {
    setFilters({
      qr_id: "",
      change_type: "",
      start_date: "",
      end_date: "",
    });
    setCurrentPage(1);
    fetchAuditLogs(1, {});
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchAuditLogs(newPage, filters);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <title>Audit Logs</title>

      <h1 className="mb-6 text-2xl font-bold text-gray-800">Audit Logs</h1>

      {/* Filters */}
      <div className="p-4 mb-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center mb-4">
          <FunnelIcon className="w-5 h-5 mr-2 text-gray-600" />
          <h2 className="text-lg font-semibold">Filters</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              QR ID
            </label>
            <input
              type="text"
              name="qr_id"
              value={filters.qr_id}
              onChange={handleFilterChange}
              placeholder="Enter QR ID"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Change Type
            </label>
            <select
              name="change_type"
              value={filters.change_type}
              onChange={handleFilterChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            >
              <option value="">All Types</option>
              <option value="UPDATE">Update</option>
              <option value="UPDATE_ATTEMPT">Update Attempt</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              name="start_date"
              value={filters.start_date}
              onChange={handleFilterChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              name="end_date"
              value={filters.end_date}
              onChange={handleFilterChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={applyFilters}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Apply Filters
          </button>
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="w-12 h-12 border-b-2 border-blue-500 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Audit Logs Table */}
      {!isLoading && (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    QR ID
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Changes
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Changed By
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Change Date
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Type
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {auditData.map((log) => (
                  <tr key={log.audit_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      <div className="font-mono text-xs">{log.qr_id}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div>
                        {log.old_scan_count !== null && (
                          <div>
                            Scans: {log.old_scan_count} → {log.new_scan_count}
                          </div>
                        )}
                        {log.old_package_type && (
                          <div>
                            Package: {log.old_package_type} →{" "}
                            {log.new_package_type}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {log.changed_by}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {formatDate(log.change_date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-full">
                        {log.change_type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {auditData.length === 0 && !isLoading && (
              <div className="py-8 text-center text-gray-500">
                No audit logs found.
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

export default AuditLogs;
