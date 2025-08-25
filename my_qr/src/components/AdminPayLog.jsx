import { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const PaymentLog = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPayments, setTotalPayments] = useState(0);
  const [revenueStats, setRevenueStats] = useState({
    total: 0,
    weekly: 0,
    monthly: 0,
    yearly: 0,
    byPackage: {}
  });
  const [filters, setFilters] = useState({
    timeframe: 'all',
    package: 'all'
  });

  const itemsPerPage = 20;

  // Fetch payment data from backend
  const fetchPaymentData = async (page = 1, search = '', timeframe = 'all', packageFilter = 'all') => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page,
        limit: itemsPerPage,
        search: search,
        timeframe: timeframe,
        package: packageFilter
      });

      const response = await fetch(
        `http://localhost:3001/api/adminpaylog?${params}`,{
                method: "GET",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
              }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch payment data');
      }
      
      const data = await response.json();
      setPayments(data.payments);
      setRevenueStats(data.revenueStats);
      setTotalPages(data.totalPages);
      setTotalPayments(data.totalCount);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching payment data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and when filters change
  useEffect(() => {
    fetchPaymentData(currentPage, searchTerm, filters.timeframe, filters.package);
  }, [currentPage, filters]);

  // Handle search with debounce
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Apply search (called with button click)
  const applySearch = () => {
    setCurrentPage(1);
    fetchPaymentData(1, searchTerm, filters.timeframe, filters.package);
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  if (loading && payments.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
    <title>Payment Log</title>
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">Payment Log & Revenue Dashboard</h1>
        
        {/* Revenue Statistics Cards */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="p-6 text-white rounded-lg shadow-lg bg-gradient-to-r from-blue-500 to-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(revenueStats.total)}</p>
              </div>
              <CurrencyDollarIcon className="w-8 h-8 opacity-80" />
            </div>
          </div>

          <div className="p-6 text-white rounded-lg shadow-lg bg-gradient-to-r from-green-500 to-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Weekly Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(revenueStats.weekly)}</p>
              </div>
              <CalendarDaysIcon className="w-8 h-8 opacity-80" />
            </div>
          </div>

          <div className="p-6 text-white rounded-lg shadow-lg bg-gradient-to-r from-purple-500 to-purple-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Monthly Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(revenueStats.monthly)}</p>
              </div>
              <ChartBarIcon className="w-8 h-8 opacity-80" />
            </div>
          </div>

          <div className="p-6 text-white rounded-lg shadow-lg bg-gradient-to-r from-orange-500 to-orange-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Yearly Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(revenueStats.yearly)}</p>
              </div>
              <CalendarDaysIcon className="w-8 h-8 opacity-80" />
            </div>
          </div>
        </div>

        {/* Package-wise Revenue */}
        <div className="p-6 mb-8 rounded-lg bg-gray-50">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">Revenue by Package</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Object.entries(revenueStats.byPackage).map(([pkg, amount]) => (
              <div key={pkg} className="p-4 bg-white rounded-lg shadow">
                <p className="text-sm text-gray-600">{pkg}</p>
                <p className="text-lg font-bold text-gray-800">{formatCurrency(amount)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col gap-4 mb-6 lg:flex-row">
          <div className="flex flex-col flex-1 gap-4 sm:flex-row">
            <select
              value={filters.timeframe}
              onChange={(e) => handleFilterChange('timeframe', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>

            <select
              value={filters.package}
              onChange={(e) => handleFilterChange('package', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Packages</option>
              {Object.keys(revenueStats.byPackage).map((pkg) => (
                <option key={pkg} value={pkg}>{pkg}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by email..."
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={handleSearch}
                onKeyPress={(e) => e.key === 'Enter' && applySearch()}
              />
            </div>
            <button
              onClick={applySearch}
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Search
            </button>
          </div>
        </div>

        {error && (
          <div className="px-4 py-3 mb-6 text-red-700 bg-red-100 border border-red-400 rounded">
            {error}
          </div>
        )}

        {/* Payments Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Package
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Price
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                    {payment.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {payment.sub_package}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-green-600 whitespace-nowrap">
                    {formatCurrency(payment.price)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {formatDate(payment.date)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {payments.length === 0 && !loading && (
            <div className="py-12 text-center text-gray-500">
              No payments found matching your criteria.
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 mt-6 bg-white border-t border-gray-200 sm:px-6">
            <div className="flex justify-between flex-1 sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalPayments)}</span> of{' '}
                  <span className="font-medium">{totalPayments}</span> results
                </p>
              </div>
              
              <div>
                <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronLeftIcon className="w-5 h-5" />
                  </button>
                  
                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === page
                          ? 'z-10 bg-blue-600 border-blue-600 text-white'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronRightIcon className="w-5 h-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentLog;