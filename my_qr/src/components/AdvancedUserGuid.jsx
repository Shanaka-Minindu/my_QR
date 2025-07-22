import { useState } from "react";

const ComprehensiveUserGuide = () => {
// Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth" // Smooth scrolling animation
    });
  };
  
  return (
    <div className="mt-16 overflow-hidden bg-white border border-gray-200 shadow-lg rounded-xl">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-500">
        <h2 className="text-2xl font-bold text-white">Complete QR Code Generator Guide</h2>
        <p className="mt-2 text-blue-100">Everything you need to create perfect QR codes</p>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-8">
        {/* Section 1: Basic Setup */}
        <div className="p-5 border border-blue-100 rounded-lg bg-blue-50">
          <div className="flex items-center mb-4">
            <div className="flex items-center justify-center w-8 h-8 mr-3 text-white bg-blue-600 rounded-full">
              1
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Basic Setup</h3>
          </div>
          
          <div className="space-y-6 ml-11">
            {/* Content Entry */}
            <div className="flex flex-col gap-6 md:flex-row">
              <div className="md:w-1/3">
                <div className="flex items-start">
                  <div className="p-1 mt-1 mr-3 bg-blue-100 rounded-full">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Enter Your Content</h4>
                  </div>
                </div>
              </div>
              <div className="md:w-2/3">
                <p className="text-gray-600">
                  In the "URL or Text" field at the top of the generator, enter the website URL or text you want to encode. 
                  For websites, always include <span className="font-mono text-blue-600">https://</span> or <span className="font-mono text-blue-600">http://</span>. 
                  The QR code preview updates in real-time as you type.
                </p>
                <div className="p-3 mt-3 text-sm border border-gray-200 rounded-md bg-gray-50">
                  <span className="font-medium">Example:</span> <span className="font-mono">https://yourwebsite.com</span> or <span className="font-mono">Your contact info</span>
                </div>
              </div>
            </div>
            
            {/* Logo Upload */}
            <div className="flex flex-col gap-6 md:flex-row">
              <div className="md:w-1/3">
                <div className="flex items-start">
                  <div className="p-1 mt-1 mr-3 bg-blue-100 rounded-full">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Add a Logo</h4>
                  </div>
                </div>
              </div>
              <div className="md:w-2/3">
                <p className="text-gray-600">
                  Click the "Choose File" button under the Logo section to upload an image file (PNG, JPG, or SVG). 
                  The logo will appear centered in your QR code. For best results:
                </p>
                <ul className="mt-2 ml-5 space-y-1 text-gray-600 list-disc">
                  <li>Use images with transparent backgrounds</li>
                  <li>Keep logos simple (avoid complex details)</li>
                  <li>Square images work best</li>
                </ul>
                <div className="flex items-center mt-3 space-x-4">
                  <div className="p-2 border border-gray-200 rounded-md bg-gray-50">
                    <div className="mb-1 text-xs text-gray-500">Ideal logo</div>
                    <div className="flex items-center justify-center w-16 h-16 bg-white">
                      <div className="w-12 h-12 bg-blue-500 rounded-md"></div>
                    </div>
                  </div>
                  <div className="p-2 border border-gray-200 rounded-md bg-gray-50">
                    <div className="mb-1 text-xs text-gray-500">Too complex</div>
                    <div className="flex items-center justify-center w-16 h-16 bg-white">
                      <div className="flex items-center justify-center w-12 h-12 p-1 text-xs text-center text-white rounded-md bg-gradient-to-r from-blue-500 to-purple-500">Detailed Text Logo</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Logo Size */}
            <div className="flex flex-col gap-6 md:flex-row">
              <div className="md:w-1/3">
                <div className="flex items-start">
                  <div className="p-1 mt-1 mr-3 bg-blue-100 rounded-full">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Adjust Logo Size</h4>
                  </div>
                </div>
              </div>
              <div className="md:w-2/3">
                <p className="text-gray-600">
                  Use the "Image Size" slider to control how much space your logo occupies within the QR code. 
                  Recommended sizes are between 20-30% for optimal scannability.
                </p>
                <div className="grid grid-cols-3 gap-4 mt-3 text-xs text-center">
                  <div>
                    <div className="flex items-center justify-center w-16 h-16 mx-auto border-2 border-blue-500">
                      <div className="w-6 h-6 bg-blue-500"></div>
                    </div>
                    <div className="mt-1">20% (Recommended)</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center w-16 h-16 mx-auto border-2 border-blue-300">
                      <div className="w-10 h-10 bg-blue-500"></div>
                    </div>
                    <div className="mt-1">30% (Max Recommended)</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center w-16 h-16 mx-auto border-2 border-red-300">
                      <div className="bg-blue-500 w-14 h-14"></div>
                    </div>
                    <div className="mt-1">50% (May not scan)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Customization */}
        <div className="p-5 border border-purple-100 rounded-lg bg-purple-50">
          <div className="flex items-center mb-4">
            <div className="flex items-center justify-center w-8 h-8 mr-3 text-white bg-purple-600 rounded-full">
              2
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Advanced Customization</h3>
          </div>
          
          <div className="space-y-6 ml-11">
            {/* Dots Customization */}
            <div className="flex flex-col gap-6 md:flex-row">
              <div className="md:w-1/3">
                <div className="flex items-start">
                  <div className="p-1 mt-1 mr-3 bg-purple-100 rounded-full">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Dots Customization</h4>
                  </div>
                </div>
              </div>
              <div className="md:w-2/3">
                <p className="text-gray-600">
                  Customize the appearance of the QR code dots in the "Advanced Styling" tab:
                </p>
                <div className="grid grid-cols-2 gap-4 mt-3 md:grid-cols-3">
                  {['square', 'rounded', 'dots', 'classy', 'extra-rounded'].map((type) => (
                    <div key={type} className="text-center">
                      <div className="flex items-center justify-center w-16 h-16 mx-auto bg-white border border-gray-200">
                        <div className={`w-8 h-8 bg-purple-600 ${
                          type === 'square' ? 'rounded-none' : 
                          type === 'rounded' ? 'rounded-md' :
                          type === 'dots' ? 'rounded-full' :
                          type === 'classy' ? 'rounded-tl-md rounded-br-md' :
                          'rounded-lg'
                        }`}></div>
                      </div>
                      <div className="mt-1 text-xs capitalize">{type.replace('-', ' ')}</div>
                    </div>
                  ))}
                </div>
                <div className="p-3 mt-3 text-sm border border-gray-200 rounded-md bg-gray-50">
                  <span className="font-medium">Tip:</span> "Square" dots scan most reliably, while "Rounded" and "Classy" offer more design flexibility.
                </div>
              </div>
            </div>
            
            {/* Corners Customization */}
            <div className="flex flex-col gap-6 md:flex-row">
              <div className="md:w-1/3">
                <div className="flex items-start">
                  <div className="p-1 mt-1 mr-3 bg-purple-100 rounded-full">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Corner Markers</h4>
                  </div>
                </div>
              </div>
              <div className="md:w-2/3">
                <p className="text-gray-600">
                  The three square markers in QR code corners help scanners identify and orient the code. 
                  Customize both the outer square and inner dot separately:
                </p>
                <div className="grid grid-cols-2 gap-4 mt-3 md:grid-cols-4">
                  {[
                    { outer: 'square', inner: 'square' },
                    { outer: 'rounded', inner: 'dot' },
                    { outer: 'extra-rounded', inner: 'rounded' },
                    { outer: 'dots', inner: 'square' }
                  ].map((style, i) => (
                    <div key={i} className="text-center">
                      <div className="relative flex items-center justify-center w-16 h-16 mx-auto bg-white border border-gray-200">
                        <div className={`absolute top-2 left-2 w-12 h-12 border-4 ${
                          style.outer === 'square' ? 'rounded-none' :
                          style.outer === 'rounded' ? 'rounded-md' :
                          style.outer === 'extra-rounded' ? 'rounded-lg' :
                          'border-dotted'
                        } border-purple-600 flex items-center justify-center`}>
                          <div className={`w-4 h-4 bg-purple-600 ${
                            style.inner === 'square' ? 'rounded-none' :
                            style.inner === 'dot' ? 'rounded-full' :
                            'rounded-sm'
                          }`}></div>
                        </div>
                      </div>
                      <div className="mt-1 text-xs">
                        {style.outer.replace('-', ' ')} / {style.inner}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Color Customization */}
            <div className="flex flex-col gap-6 md:flex-row">
              <div className="md:w-1/3">
                <div className="flex items-start">
                  <div className="p-1 mt-1 mr-3 bg-purple-100 rounded-full">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Color Selection</h4>
                  </div>
                </div>
              </div>
              <div className="md:w-2/3">
                <p className="text-gray-600">
                  Change colors for all elements independently. For best scanning results:
                </p>
                <ul className="mt-2 ml-5 space-y-1 text-gray-600 list-disc">
                  <li>Maintain high contrast between dots and background</li>
                  <li>Dark colors on light background work best</li>
                  <li>Avoid red/black combinations which may not scan well</li>
                </ul>
                <div className="grid grid-cols-2 gap-4 mt-3 md:grid-cols-3">
                  {[
                    { dots: 'black', bg: 'white' },
                    { dots: '#2563eb', bg: '#f8fafc' },
                    { dots: '#059669', bg: '#ecfdf5' },
                    { dots: '#7c3aed', bg: '#f5f3ff' },
                    { dots: '#0f172a', bg: '#f1f5f9' },
                    { dots: '#9d174d', bg: '#fce7f3' }
                  ].map((color, i) => (
                    <div key={i} className="text-center">
                      <div 
                        className="flex items-center justify-center w-16 h-16 mx-auto"
                        style={{ backgroundColor: color.bg }}
                      >
                        <div 
                          className="w-8 h-8"
                          style={{ backgroundColor: color.dots }}
                        ></div>
                      </div>
                      <div className="mt-1 text-xs">
                        <span style={{ color: color.dots }}>■</span> on <span style={{ color: color.bg }}>■</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Download & Presets */}
        <div className="p-5 border border-green-100 rounded-lg bg-green-50">
          <div className="flex items-center mb-4">
            <div className="flex items-center justify-center w-8 h-8 mr-3 text-white bg-green-600 rounded-full">
              3
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Download & Presets</h3>
          </div>
          
          <div className="space-y-6 ml-11">
            {/* Download Options */}
            <div className="flex flex-col gap-6 md:flex-row">
              <div className="md:w-1/3">
                <div className="flex items-start">
                  <div className="p-1 mt-1 mr-3 bg-green-100 rounded-full">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Download Options</h4>
                  </div>
                </div>
              </div>
              <div className="md:w-2/3">
                <p className="text-gray-600">
                  Before downloading, select your preferred format and size:
                </p>
                <div className="grid grid-cols-2 gap-4 mt-3 md:grid-cols-4">
                  {['PNG', 'JPEG', 'SVG', 'WEBP'].map((format) => (
                    <div key={format} className="text-center">
                      <div className="flex items-center justify-center w-12 h-12 mx-auto bg-white border border-gray-200 rounded-md">
                        <span className="text-xs font-medium">{format}</span>
                      </div>
                      <div className="mt-1 text-xs">
                        {format === 'PNG' && 'Best quality'}
                        {format === 'JPEG' && 'Smaller files'}
                        {format === 'SVG' && 'Vector format'}
                        {format === 'WEBP' && 'Modern format'}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 mt-3 text-sm border border-gray-200 rounded-md bg-gray-50">
                  <span className="font-medium">Size recommendations:</span> 300px for web, 1000px+ for print materials
                </div>
              </div>
            </div>
            
            {/* Presets */}
            <div className="flex flex-col gap-6 md:flex-row">
              <div className="md:w-1/3">
                <div className="flex items-start">
                  <div className="p-1 mt-1 mr-3 bg-green-100 rounded-full">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Save Presets</h4>
                  </div>
                </div>
              </div>
              <div className="md:w-2/3">
                <p className="text-gray-600">
                  Save your favorite designs as presets to reuse later. Your presets are saved in your browser's storage.
                </p>
                <div className="p-3 mt-3 bg-white border border-gray-200 rounded-md">
                  <div className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
                    <div className="font-medium">Classic Black</div>
                    <button className="text-gray-400 hover:text-red-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
                    <div className="font-medium">Rounded Blue</div>
                    <button className="text-gray-400 hover:text-red-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  Click "Save Preset" to add your current design to this list
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Pro Tips */}
        <div className="p-6 border-l-4 border-yellow-400 rounded-r-lg bg-yellow-50">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-yellow-800">Professional Tips & Best Practices</h3>
              <div className="grid grid-cols-1 gap-6 mt-4 md:grid-cols-2">
                <div>
                  <h4 className="mb-2 font-medium text-gray-800">Scannability</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <svg className="flex-shrink-0 w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="ml-2">Always test with multiple scanner apps</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="flex-shrink-0 w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="ml-2">Minimum size: 1x1 inch (2.5x2.5 cm) for print</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="flex-shrink-0 w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="ml-2">Higher error correction = better reliability</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="mb-2 font-medium text-gray-800">Design</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <svg className="flex-shrink-0 w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="ml-2">Match colors to your brand identity</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="flex-shrink-0 w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="ml-2">Use SVG format for crisp printing</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="flex-shrink-0 w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="ml-2">Add whitespace around QR codes in print materials</span>
                    </li>
                  </ul>
                </div>
              </div>
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
    </div>
  );
};

export default ComprehensiveUserGuide;