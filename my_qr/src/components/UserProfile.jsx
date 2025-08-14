import { useState, useEffect } from "react";
import {
  FiEdit,
  FiX,
  FiUser,
  FiExternalLink,
  FiLock,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
   const navigate = useNavigate();
  // Sample user data - replace with actual data from your auth context
  const [editMode, setEditMode] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [qrCodes, setQrCodes] = useState([]);
  const [editingQr, setEditingQr] = useState(null);
  const [newUrl, setNewUrl] = useState("");

  const [getUserData, setUserData] = useState({
    name: "",
    email: "",
    subscription: "",
    createdAt: "",
  });
useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const uName = params.get("uName");
    const email = params.get("email");

    if (uName && email) {
      localStorage.setItem("user", JSON.stringify({ uName, email }));
    } else {
      
    }
  }, []);
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/shanaka", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        //set navigation to login page
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      console.log(data);

      setUserData(data.user);
      setQrCodes(data.qrData);
    } catch (err) {
      console.error("Error fetching protected data:", err);
      throw err;
    }
  };

  const sampleUser = {
    name: getUserData.userName,
    email: getUserData.userEmail,
    subscription: "All_QR",
    createdAt: getUserData.createAt,
  };

  // Subscription packages with display names and colors
  const subscriptionPackages = {
    Free: { name: "Free", color: "bg-gray-200 text-gray-800" },
    All_QR: { name: "All_QR", color: "bg-blue-100 text-blue-800" },
    Single_QR: { name: "Single_QR", color: "bg-purple-100 text-purple-800" },
    Multi_QR: { name: "Multi_QR", color: "bg-green-100 text-green-800" },
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handleSaveProfile = async () => {
    // Validate passwords if changing
    if (showPasswordFields) {
      if (profileData.password) {
        if (
          profileData.newPassword &&
          profileData.newPassword !== profileData.confirmPassword
        ) {
          alert("New passwords don't match!");
          return;
        }
      } else {
        alert("Current pasword is required");
        return;
      }
    }

    // In a real app, you would call updateUser from useAuth here
    console.log(profileData);

    try {
      const response = await fetch("http://localhost:3001/api/userupdare", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error("Update failed");
      }
      
      const data = await response.json();
      console.log("Update successful:", data);
    } catch (err) {
      console.log(err)
    }

    setEditMode(false);
    setShowPasswordFields(false);
  };

  const handleEditQr = (qr) => {
    setEditingQr(qr);
    setNewUrl(qr.url);
  };

  const handleSaveQrUrl = async () => {
    // Update the QR code URL in the local state
    const updatedQR = {
      id :editingQr.id,
      oldUrl :editingQr.url,
      newUrl
    }

     try {
      const response = await fetch("http://localhost:3001/api/updateurl", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedQR),
      });

      if (!response.ok) {
        throw new Error("Update failed");
      }
       await fetchUserData();
      const data = await response.json();
      console.log("Update successful:", data);
    } catch (err) {
      console.log(err)
    }

    console.log(updatedQR)
   
   // setQrCodes(updatedQrCodes);
    setEditingQr(null);

    // In a real app, you would call an API to save this change
    console.log("Updated QR URL:", { id: editingQr.id, newUrl });
  };

  return (
    <div className="max-w-6xl p-6 mx-auto">
      <title>Profile</title>
      {/* Profile Header */}
      <div className="flex flex-col items-start justify-between mb-8 md:flex-row md:items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="flex items-center justify-center w-16 h-16 mr-4 bg-blue-100 rounded-full">
            <FiUser className="text-2xl text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {sampleUser.name}
            </h1>
            <p className="text-gray-600">{sampleUser.email}</p>
            <p className="text-sm text-gray-500">
              Member since:{" "}
              {new Date(sampleUser.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              subscriptionPackages[sampleUser.subscription].color
            }`}
          >
            {subscriptionPackages[sampleUser.subscription].name}
          </div>

          <button
            onClick={() => setEditMode(!editMode)}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
          >
            <FiEdit className="mr-2" />
            {editMode ? "Cancel" : "Edit Profile"}
          </button>
        </div>
      </div>

      {/* Edit Profile Section */}
      {editMode && (
        <div className="p-6 mb-8 bg-white shadow-md rounded-xl">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Edit Profile
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={sampleUser.email}
                disabled
                className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-500">
                Email cannot be changed
              </p>
            </div>
          </div>

          {/* Password Change Toggle */}
          <div className="mt-6">
            <button
              onClick={() => setShowPasswordFields(!showPasswordFields)}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <FiLock className="mr-2" />
              {showPasswordFields ? "Hide Password Change" : "Change Password"}
              {showPasswordFields ? (
                <FiChevronUp className="ml-2" />
              ) : (
                <FiChevronDown className="ml-2" />
              )}
            </button>
          </div>

          {/* Password Change Fields (Conditional) */}
          {showPasswordFields && (
            <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={profileData.password}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={profileData.newPassword}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter new password"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={profileData.confirmPassword}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Confirm new password"
                />
                {profileData.newPassword &&
                  profileData.newPassword !== profileData.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      Passwords don't match
                    </p>
                  )}
              </div>
            </div>
          )}

          <div className="flex justify-end mt-6 space-x-3">
            <button
              onClick={() => {
                setEditMode(false);
                setShowPasswordFields(false);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveProfile}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* QR Codes Table */}
      <div className="p-6 bg-white shadow-md rounded-xl">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Your QR Codes
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  QR
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  URL
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Scan Count
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Package
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {qrCodes.map((qr, index) => (
                <tr key={qr.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                    <a
                      href={qr.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      {qr.url.length > 30
                        ? `${qr.url.substring(0, 30)}...`
                        : qr.url}
                      <FiExternalLink className="ml-1" />
                    </a>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {qr.scancount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        subscriptionPackages[qr.package].color
                      }`}
                    >
                      {subscriptionPackages[qr.package].name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                    <button
                      onClick={() => handleEditQr(qr)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <FiEdit />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit QR URL Modal */}
      {editingQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white shadow-xl rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Edit QR Code URL
              </h3>
              <button
                onClick={() => setEditingQr(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                New URL
              </label>
              <input
                type="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setEditingQr(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveQrUrl}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
