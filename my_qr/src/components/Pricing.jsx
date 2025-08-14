import { useState } from 'react';
import { FiCheck, FiX, FiLink, FiLayers, FiDatabase, FiZap } from 'react-icons/fi';

const Priceing = ()=>{
  const [selectedUrl, setSelectedUrl] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');

  const allLinksPlans = [
    {
      name: "500 Scans",
      price: "$9.99",
      scans: "500",
      features: [
        "Up to 10 links",
        "Basic analytics",
        "Email support"
      ],
      icon: <FiDatabase className="mb-4 text-4xl text-blue-500" />
    },
    {
      name: "1000 Scans",
      price: "$14.99",
      scans: "1,000",
      features: [
        "Up to 25 links",
        "Advanced analytics",
        "Priority email support"
      ],
      icon: <FiLayers className="mb-4 text-4xl text-green-500" />
    },
    {
      name: "5000 Scans",
      price: "$29.99",
      scans: "5,000",
      features: [
        "Up to 100 links",
        "Advanced analytics",
        "API access",
        "Phone support"
      ],
      icon: <FiZap className="mb-4 text-4xl text-purple-500" />
    },
    {
      name: "10000 Scans",
      price: "$49.99",
      scans: "10,000",
      features: [
        "Unlimited links",
        "Advanced analytics",
        "API access",
        "Priority phone support",
        "Custom branding"
      ],
      icon: <FiLink className="mb-4 text-4xl text-orange-500" />
    }
  ];

  const singleLinkPlans = [
    {
      name: "500 Scans",
      price: "$4.99",
      scans: "500",
      features: [
        "1 link",
        "Basic analytics",
        "Email support"
      ],
      icon: <FiDatabase className="mb-4 text-4xl text-blue-500" />
    },
    {
      name: "1000 Scans",
      price: "$7.99",
      scans: "1,000",
      features: [
        "1 link",
        "Advanced analytics",
        "Priority email support"
      ],
      icon: <FiLayers className="mb-4 text-4xl text-green-500" />
    },
    {
      name: "5000 Scans",
      price: "$14.99",
      scans: "5,000",
      features: [
        "1 link",
        "Advanced analytics",
        "Phone support"
      ],
      icon: <FiZap className="mb-4 text-4xl text-purple-500" />
    },
    {
      name: "10000 Scans",
      price: "$24.99",
      scans: "10,000",
      features: [
        "1 link",
        "Advanced analytics",
        "Priority phone support",
        "Custom QR design"
      ],
      icon: <FiLink className="mb-4 text-4xl text-orange-500" />
    }
  ];

  const sampleUrls = [
    "https://example.com/product1",
    "https://example.com/product2",
    "https://example.com/special-offer",
    "https://example.com/contact-us"
  ];

  return (
    <div className="min-h-screen px-4 py-12 bg-gray-50 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Flexible Pricing Plans
          </h1>
          <p className="max-w-xl mx-auto mt-5 text-xl text-gray-500">
            Choose the perfect plan for your QR code needs
          </p>
        </div>

        {/* Toggle between All Links and Single Link */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setSelectedPlan('all-links')}
              className={`px-6 py-3 text-sm font-medium rounded-l-lg ${selectedPlan === 'all-links' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              <FiLayers className="inline mr-2" />
              All Links
            </button>
            <button
              onClick={() => setSelectedPlan('single-link')}
              className={`px-6 py-3 text-sm font-medium rounded-r-lg ${selectedPlan === 'single-link' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              <FiLink className="inline mr-2" />
              Single Link
            </button>
          </div>
        </div>

        {/* All Links Pricing */}
        {(selectedPlan === 'all-links' || selectedPlan === '') && (
          <div className="mb-16">
            <h2 className="mb-8 text-2xl font-bold text-center text-gray-800">
              <FiLayers className="inline mr-2 text-indigo-500" />
              All Links Plans
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {allLinksPlans.map((plan, index) => (
                <div key={index} className="overflow-hidden transition-transform bg-white rounded-lg shadow-md hover:scale-105">
                  <div className="p-6 text-center">
                    {plan.icon}
                    <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
                    <div className="flex items-center justify-center mt-4">
                      <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                      <span className="ml-1 text-lg font-medium text-gray-500">/mo</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Up to {plan.scans} scans</p>
                  </div>
                  <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <FiCheck className="flex-shrink-0 w-5 h-5 text-green-500" />
                          <span className="ml-3 text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button className="flex justify-center w-full px-4 py-2 mt-6 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Get started
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Single Link Pricing */}
        {(selectedPlan === 'single-link' || selectedPlan === '') && (
          <div className="mb-16">
            <h2 className="mb-8 text-2xl font-bold text-center text-gray-800">
              <FiLink className="inline mr-2 text-indigo-500" />
              Single Link Plans
            </h2>
            
            {/* URL Selection Dropdown */}
            <div className="max-w-md mx-auto mb-8">
              <label htmlFor="url-select" className="block mb-2 text-sm font-medium text-gray-700">
                Select a URL to generate QR code for:
              </label>
              <select
                id="url-select"
                value={selectedUrl}
                onChange={(e) => setSelectedUrl(e.target.value)}
                className="block w-full py-2 pl-3 pr-10 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select a URL</option>
                {sampleUrls.map((url, index) => (
                  <option key={index} value={url}>{url}</option>
                ))}
              </select>
            </div>

            {/* Pricing Cards */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {singleLinkPlans.map((plan, index) => (
                <div key={index} className="overflow-hidden transition-transform bg-white rounded-lg shadow-md hover:scale-105">
                  <div className="p-6 text-center">
                    {plan.icon}
                    <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
                    <div className="flex items-center justify-center mt-4">
                      <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                      <span className="ml-1 text-lg font-medium text-gray-500">/mo</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Up to {plan.scans} scans</p>
                  </div>
                  <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <FiCheck className="flex-shrink-0 w-5 h-5 text-green-500" />
                          <span className="ml-3 text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button 
                      disabled={!selectedUrl}
                      className={`mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${selectedUrl ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-300 cursor-not-allowed'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                    >
                      {selectedUrl ? 'Generate QR Code' : 'Select URL First'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Priceing;