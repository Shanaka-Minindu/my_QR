import { useState } from 'react';
import { PencilSquareIcon, CheckIcon, XMarkIcon, MagnifyingGlassIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';

const QRDataManagement = () => {
  // Sample data
  const initialData = [
    {
      id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
      scan_count: 42,
      package_type: 'Premium',
      email: 'user1@example.com',
      redirect_url: 'https://example.com/product1',
      created_url: 'https://qrservice.com/qr/abc123',
      created_date: '2023-05-15T10:30:00Z'
    },
    {
      id: '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
      scan_count: 18,
      package_type: 'Basic',
      email: 'user2@example.com',
      redirect_url: 'https://example.com/product2',
      created_url: 'https://qrservice.com/qr/def456',
      created_date: '2023-06-20T14:45:00Z'
    },
    {
      id: '3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r',
      scan_count: 75,
      package_type: 'Enterprise',
      email: 'user3@example.com',
      redirect_url: 'https://example.com/product3',
      created_url: 'https://qrservice.com/qr/ghi789',
      created_date: '2023-07-10T09:15:00Z'
    },
  ];

  const [data, setData] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    scan_count: 0,
    package_type: '',
    email: '',
    redirect_url: '',
  });
  const [expandedRow, setExpandedRow] = useState(null);

  // Filter data based on search term
  const filteredData = data.filter(item => {
    return (
      item.package_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.redirect_url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.created_url.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Handle edit click
  const handleEditClick = (item) => {
    setEditingId(item.id);
    setEditFormData({
      scan_count: item.scan_count,
      package_type: item.package_type,
      email: item.email,
      redirect_url: item.redirect_url,
    });
  };

  // Handle edit form change
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: name === 'scan_count' ? parseInt(value) || 0 : value
    });
  };

  // Handle cancel click
  const handleCancelClick = () => {
    setEditingId(null);
  };

  // Handle save click
  const handleSaveClick = () => {
    const updatedData = data.map(item => {
      if (item.id === editingId) {
        return {
          ...item,
          ...editFormData
        };
      }
      return item;
    });
    
    setData(updatedData);
    setEditingId(null);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Toggle row expansion on mobile
  const toggleRowExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">QR Data Management</h1>
      
      {/* Search Bar */}
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by package, email, or URL..."
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Desktop Table (hidden on mobile) */}
      <div className="hidden md:block bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scans</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Redirect URL</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                {editingId === item.id ? (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        name="scan_count"
                        value={editFormData.scan_count}
                        onChange={handleEditFormChange}
                        className="border border-gray-300 rounded px-2 py-1 w-16"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        name="package_type"
                        value={editFormData.package_type}
                        onChange={handleEditFormChange}
                        className="border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="Basic">Basic</option>
                        <option value="Premium">Premium</option>
                        <option value="Enterprise">Enterprise</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="email"
                        name="email"
                        value={editFormData.email}
                        onChange={handleEditFormChange}
                        className="border border-gray-300 rounded px-2 py-1 w-48"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="url"
                        name="redirect_url"
                        value={editFormData.redirect_url}
                        onChange={handleEditFormChange}
                        className="border border-gray-300 rounded px-2 py-1 w-64"
                      />
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.scan_count}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.package_type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">
                      <a href={item.redirect_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {item.redirect_url}
                      </a>
                    </td>
                  </>
                )}
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(item.created_date)}</td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {editingId === item.id ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveClick}
                        className="text-green-600 hover:text-green-900"
                        title="Save"
                      >
                        <CheckIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={handleCancelClick}
                        className="text-red-600 hover:text-red-900"
                        title="Cancel"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEditClick(item)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Edit"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredData.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No QR data found matching your search criteria.
          </div>
        )}
      </div>
      
      {/* Mobile Cards (shown on mobile) */}
      <div className="md:hidden space-y-4">
        {filteredData.map((item) => (
          <div key={item.id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <div 
              className="p-4 flex justify-between items-center cursor-pointer"
              onClick={() => toggleRowExpand(item.id)}
            >
              <div>
                <div className="font-medium text-gray-900">{item.package_type}</div>
                <div className="text-sm text-gray-500">{item.email}</div>
              </div>
              <div>
                {expandedRow === item.id ? (
                  <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                )}
              </div>
            </div>
            
            {expandedRow === item.id && (
              <div className="border-t border-gray-200 p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-medium text-gray-500">Scans</div>
                    <div className="text-sm text-gray-900">{item.scan_count}</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500">Created</div>
                    <div className="text-sm text-gray-900">{formatDate(item.created_date)}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-xs font-medium text-gray-500">Redirect URL</div>
                    <a 
                      href={item.redirect_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm text-blue-600 hover:underline break-all"
                    >
                      {item.redirect_url}
                    </a>
                  </div>
                  <div className="col-span-2">
                    <div className="text-xs font-medium text-gray-500">Created URL</div>
                    <a 
                      href={item.created_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm text-blue-600 hover:underline break-all"
                    >
                      {item.created_url}
                    </a>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  {editingId === item.id ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveClick}
                        className="text-green-600 hover:text-green-900"
                        title="Save"
                      >
                        <CheckIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={handleCancelClick}
                        className="text-red-600 hover:text-red-900"
                        title="Cancel"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEditClick(item)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Edit"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
        
        {filteredData.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No QR data found matching your search criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default QRDataManagement;