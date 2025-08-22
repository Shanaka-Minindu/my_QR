

const SubscriptionInfo = ({qrCodes }) => {
  // Find the All_QR subscription from qrCodes
//  const allQrSubscription = qrCodes.find(qr => qr.package === "All_QR");
  
  if (!qrCodes) return null;
  
  // Format dates
  const subscribedDate = new Date(qrCodes.sub_data).toLocaleDateString();
  const expirationDate = new Date(qrCodes.exp_data).toLocaleDateString();
  
  return (
    <div className="p-6 mb-6 border border-blue-200 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
      <h2 className="mb-4 text-xl font-semibold text-gray-800">Your Subscription</h2>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <h3 className="mb-1 text-sm font-medium text-gray-500">Package Type</h3>
          <p className="text-lg font-semibold text-blue-600">All QR {qrCodes.all_ptype}</p>
        </div>
        
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <h3 className="mb-1 text-sm font-medium text-gray-500">Remaining Scans</h3>
          <p className="text-4xl font-bold text-blue-800">{qrCodes.scan_count}</p>
        </div>
        
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <h3 className="mb-1 text-sm font-medium text-gray-500">Subscription Period</h3>
          <p className="font-medium text-gray-800 text-md">
            {subscribedDate} to {expirationDate}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionInfo;