import React from "react";
import {
  FaDownload,
  FaPlus,
  FaTrash,
  FaQrcode,
  
  FaFilter,
  FaPalette,
  FaFont,
  FaArrowsAlt,
} from "react-icons/fa";

const QrFrameStep = () => {

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth" // Smooth scrolling animation
    });
  };
  
  return (
    <div className="max-w-4xl p-6 mx-auto bg-white shadow-md rounded-xl">
      <h1 className="mb-8 text-3xl font-bold text-center text-blue-600">
        QR Code Frame Composer Guide
      </h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Left Column - Main Steps */}
        <div className="space-y-8">
          {/* Step 1 */}
          <div className="p-5 border-l-4 border-blue-500 rounded-lg bg-blue-50">
            <div className="flex items-center mb-3">
              <div className="flex items-center justify-center w-8 h-8 mr-3 text-white bg-blue-500 rounded-full">
                1
              </div>
              <h2 className="text-xl font-semibold text-blue-700">
                Getting Started
              </h2>
            </div>
            <p className="text-gray-700">
              Open the QR Code Frame Composer to begin customizing your QR code
              with beautiful frames and text.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-5 border-l-4 border-purple-500 rounded-lg bg-purple-50">
            <div className="flex items-center mb-3">
              <div className="flex items-center justify-center w-8 h-8 mr-3 text-white bg-purple-500 rounded-full">
                2
              </div>
              <h2 className="text-xl font-semibold text-purple-700">
                Choose a Frame
              </h2>
            </div>
            <div className="flex items-center mb-2 text-sm">
              <FaFilter className="mr-2 text-purple-600" />
              <span>Use filters to find the perfect frame</span>
            </div>
            <ul className="pl-5 space-y-1 text-gray-700 list-disc">
              <li>Browse available frames</li>
              <li>Filter by shape or text compatibility</li>
              <li>Click to select your frame</li>
            </ul>
          </div>

          {/* Step 3 */}
          <div className="p-5 border-l-4 border-green-500 rounded-lg bg-green-50">
            <div className="flex items-center mb-3">
              <div className="flex items-center justify-center w-8 h-8 mr-3 text-white bg-green-500 rounded-full">
                3
              </div>
              <h2 className="text-xl font-semibold text-green-700">
                Upload QR Code
              </h2>
            </div>
            <div className="flex items-center mb-2 text-sm">
              <FaQrcode className="mr-2 text-green-600" />
              <span>Add your QR code image</span>
            </div>
            <p className="text-gray-700">
              Click the upload button and select your QR code image file.
            </p>
          </div>
        </div>

        {/* Right Column - Main Steps */}
        <div className="space-y-8">
          {/* Step 4 */}
          <div className="p-5 border-l-4 border-yellow-500 rounded-lg bg-yellow-50">
            <div className="flex items-center mb-3">
              <div className="flex items-center justify-center w-8 h-8 mr-3 text-white bg-yellow-500 rounded-full">
                4
              </div>
              <h2 className="text-xl font-semibold text-yellow-700">
                Customize Appearance
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="flex items-center text-sm">
                <FaPalette className="mr-2 text-yellow-600" />
                <span>Frame Color</span>
              </div>
              <div className="flex items-center text-sm">
                <FaFont className="mr-2 text-yellow-600" />
                <span>Text Options</span>
              </div>
              <div className="flex items-center text-sm">
                <FaArrowsAlt className="mr-2 text-yellow-600" />
                <span>Positioning</span>
              </div>
            </div>
            <p className="text-gray-700">
              Use the color picker, text editors, and positioning sliders to
              perfect your design.
            </p>
          </div>

          {/* Step 5 */}
          <div className="p-5 border-l-4 border-red-500 rounded-lg bg-red-50">
            <div className="flex items-center mb-3">
              <div className="flex items-center justify-center w-8 h-8 mr-3 text-white bg-red-500 rounded-full">
                5
              </div>
              <h2 className="text-xl font-semibold text-red-700">
                Add Text Elements
              </h2>
            </div>
            <div className="flex items-center mb-2 text-sm">
              <FaPlus className="mr-2 text-red-600" />
              <span>Add multiple text fields</span>
            </div>
            <ul className="pl-5 space-y-1 text-gray-700 list-disc">
              <li>Click "Add Text Field"</li>
              <li>Customize font, size, and color</li>
              <li>Position text with sliders</li>
              <li>
                Remove with <FaTrash className="inline ml-1 text-red-500" />
              </li>
            </ul>
          </div>

          {/* Step 6 */}
          <div className="p-5 border-l-4 border-indigo-500 rounded-lg bg-indigo-50">
            <div className="flex items-center mb-3">
              <div className="flex items-center justify-center w-8 h-8 mr-3 text-white bg-indigo-500 rounded-full">
                6
              </div>
              <h2 className="text-xl font-semibold text-indigo-700">
                Download Your Design
              </h2>
            </div>
            <div className="flex items-center mb-2 text-sm">
              <FaDownload className="mr-2 text-indigo-600" />
              <span>Save your final creation</span>
            </div>
            <p className="text-gray-700">
              When satisfied, click the download button to save your customized
              QR code.
            </p>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="p-5 mt-10 border-t-4 border-gray-300 rounded-lg bg-gray-50">
        <h2 className="flex items-center mb-3 text-xl font-semibold text-gray-800">
          <svg
            className="w-5 h-5 mr-2 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Pro Tips for Best Results
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex items-start">
            <div className="p-2 mr-3 bg-blue-100 rounded-full">
              <svg
                className="w-4 h-4 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-700">
              Ensure QR code remains scannable by keeping it unobstructed
            </p>
          </div>
          <div className="flex items-start">
            <div className="p-2 mr-3 bg-blue-100 rounded-full">
              <svg
                className="w-4 h-4 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-700">
              Use high contrast between QR code and frame colors
            </p>
          </div>
          <div className="flex items-start">
            <div className="p-2 mr-3 bg-blue-100 rounded-full">
              <svg
                className="w-4 h-4 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-700">
              Text-friendly frames have more space for customization
            </p>
          </div>
          <div className="flex items-start">
            <div className="p-2 mr-3 bg-blue-100 rounded-full">
              <svg
                className="w-4 h-4 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-700">
              Preview on mobile before finalizing your design
            </p>
          </div>
        </div>
      </div>

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
};

export default QrFrameStep;
