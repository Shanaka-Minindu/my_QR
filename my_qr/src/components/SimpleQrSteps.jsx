import React from "react";
import { FaQrcode, FaLink, FaDownload, FaCog, FaCheckCircle } from "react-icons/fa";

function SimpleQrSteps(){
 // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth" // Smooth scrolling animation
    });
  };
          return (
    <div className="max-w-4xl p-6 mx-auto bg-white rounded-lg shadow-md">
      <div className="mb-8 text-center">
        <h1 className="flex items-center justify-center gap-2 text-3xl font-bold text-blue-600">
          <FaQrcode className="inline-block" /> Simple QR Generator Guide
        </h1>
        <p className="mt-2 text-gray-600">Create and download QR codes in just 4 steps!</p>
      </div>

      {/* Steps Container */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Step 1 */}
        <div className="flex items-start gap-4 p-4 rounded-lg bg-blue-50">
          <div className="flex-shrink-0 p-3 text-white bg-blue-600 rounded-full">
            <span className="text-xl font-bold">1</span>
          </div>
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <FaLink className="text-blue-600" /> Enter Your URL
            </h3>
            <p className="mt-1 text-gray-700">
              Type or paste any website link in the input box. The QR code updates automatically!
            </p>
            <div className="px-3 py-2 mt-2 text-sm italic bg-white border border-blue-200 rounded">
              Example: https://yourwebsite.com
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex items-start gap-4 p-4 rounded-lg bg-green-50">
          <div className="flex-shrink-0 p-3 text-white bg-green-600 rounded-full">
            <span className="text-xl font-bold">2</span>
          </div>
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <FaQrcode className="text-green-600" /> Preview QR Code
            </h3>
            <p className="mt-1 text-gray-700">
              Watch your QR code appear instantly on the right side as you type.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex items-start gap-4 p-4 rounded-lg bg-purple-50">
          <div className="flex-shrink-0 p-3 text-white bg-purple-600 rounded-full">
            <span className="text-xl font-bold">3</span>
          </div>
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <FaCog className="text-purple-600" /> Choose File Format
            </h3>
            <p className="mt-1 text-gray-700">
              Select from PNG, JPEG, SVG, or WEBP using the dropdown menu.
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-2 py-1 text-xs bg-white border rounded">PNG</span>
              <span className="px-2 py-1 text-xs bg-white border rounded">JPEG</span>
              <span className="px-2 py-1 text-xs bg-white border rounded">SVG</span>
              <span className="px-2 py-1 text-xs bg-white border rounded">WEBP</span>
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="flex items-start gap-4 p-4 rounded-lg bg-orange-50">
          <div className="flex-shrink-0 p-3 text-white bg-orange-600 rounded-full">
            <span className="text-xl font-bold">4</span>
          </div>
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <FaDownload className="text-orange-600" /> Download
            </h3>
            <p className="mt-1 text-gray-700">
              Click the download button to save your QR code to your device.
            </p>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="p-6 mt-10 border-l-4 border-yellow-400 rounded-lg bg-yellow-50">
        <h2 className="flex items-center gap-2 text-xl font-bold text-yellow-800">
          <FaCheckCircle className="inline-block" /> Pro Tips
        </h2>
        <ul className="mt-3 space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-yellow-600">✓</span> Use <strong>short URLs</strong> for better scan reliability
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-600">✓</span> Choose <strong>SVG/PNG</strong> for high-quality printing
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-600">✓</span> Test with your phone camera before sharing
          </li>
        </ul>
      </div>

      {/* CTA */}
      <div className="mt-8 text-center">
        <button 
          onClick={scrollToTop}
          className="px-6 py-3 font-medium text-white transition-colors bg-blue-600 rounded-lg shadow-md hover:bg-blue-700"
        >
          Start Generating QR Codes Now
        </button>
      </div>
    </div>
  );

}

export default SimpleQrSteps;