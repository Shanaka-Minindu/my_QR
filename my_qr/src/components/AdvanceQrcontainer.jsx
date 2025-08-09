import React, { useState, useRef, useEffect } from "react";
import QRCodeStyling from "qr-code-styling";
import UserGuideSection from "./AdvancedUserGuid";
import { qrFunctionWithAuth } from "../function/qrGenFunction";
import { useAuth } from "../store/user_auth_context";
import AuthPopup from "./AuthPopup";


const QRCodeGenerator = () => {

  const { user } = useAuth();
  const [showAuthPopup, setShowAuthPopup] = useState(false);

  
  // Refs
  const qrContainerRef = useRef(null);
  const qrCodeRef = useRef(null);
  const downloadQrCodeRef = useRef(null);
  const presetNameRef = useRef(null);

  // State
  
  const [isDownloading, setIsDownloading] = useState(false);
  const [qrData, setQrData] = useState("https://example.com");
  const [newQrData, setNewQrData] = useState("");
  const [qrOptions, setQrOptions] = useState({
    previewOptions: { width: 250, height: 250 },
    downloadOptions: {
      width: 300,
      height: 300,
      type: "svg",
      data: "https://example.com",
      margin: 10,
      qrOptions: { typeNumber: 0, mode: "Byte", errorCorrectionLevel: "Q" },
      dotsOptions: { color: "#000000", type: "square", gradient: null },
      cornersSquareOptions: {
        type: "square",
        color: "#000000",
        gradient: null,
      },
      cornersDotOptions: { type: "square", color: "#000000", gradient: null },
      backgroundOptions: { color: "#ffffff", gradient: null },
      image: "",
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.4,
        margin: 5,
        crossOrigin: "anonymous",
      },
    },
  });

  // UI States
  const [fileExt, setFileExt] = useState("png");
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [activeTab, setActiveTab] = useState("basic");
  const [presets, setPresets] = useState(() => {
    const saved = localStorage.getItem("qrPresets");
    return saved
      ? JSON.parse(saved)
      : [
          {
            name: "Classic Black",
            options: {
              dotsOptions: { color: "#000000", type: "square" },
              cornersSquareOptions: { color: "#000000", type: "square" },
              backgroundOptions: { color: "#ffffff" },
            },
          },
          {
            name: "Rounded Blue",
            options: {
              dotsOptions: { color: "#2563eb", type: "rounded" },
              cornersSquareOptions: { color: "#2563eb", type: "extra-rounded" },
              backgroundOptions: { color: "#f8fafc" },
            },
          },
        ];
  });
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [gradientEditMode, setGradientEditMode] = useState(null);
  const [gradientStops, setGradientStops] = useState([
    { offset: 0, color: "#000000" },
    { offset: 1, color: "#ffffff" },
  ]);
  const [gradientType, setGradientType] = useState("linear");
  const [gradientRotation, setGradientRotation] = useState(0);
  const [tempGradient, setTempGradient] = useState(null);

  // Initialize QR codes
  useEffect(() => {
    const commonOptions = {
      ...qrOptions.downloadOptions,
      data: qrData, // Use the state directly
    };

    const previewQrCode = new QRCodeStyling({
      ...commonOptions,
      width: qrOptions.previewOptions.width,
      height: qrOptions.previewOptions.height,
    });

    const downloadQrCode = new QRCodeStyling(commonOptions);

    qrCodeRef.current = previewQrCode;
    downloadQrCodeRef.current = downloadQrCode;

    previewQrCode.append(qrContainerRef.current);

    const savedPrefs = localStorage.getItem("qrPreferences");
    if (savedPrefs) {
      try {
        const prefs = JSON.parse(savedPrefs);
        setQrOptions((prev) => ({
          ...prev,
          downloadOptions: { ...prev.downloadOptions, ...prefs },
        }));
        if (prefs.data) setNewQrData(prefs.data);
        if (prefs.image) setLogoPreview(prefs.image);
      } catch (e) {
        console.error("Failed to load preferences", e);
      }
    }

    return () => {
      if (qrContainerRef.current) {
        qrContainerRef.current.innerHTML = "";
      }
    };
  }, []);

  // Update QR codes when options change
  useEffect(() => {
    if (qrCodeRef.current && downloadQrCodeRef.current) {
      const previewOptions = {
        ...qrOptions.downloadOptions,
        width: qrOptions.previewOptions.width,
        height: qrOptions.previewOptions.height,
      };

      // Apply temporary gradient if editing
      if (gradientEditMode && tempGradient) {
        previewOptions[`${gradientEditMode}Options`] = {
          ...previewOptions[`${gradientEditMode}Options`],
          gradient: tempGradient,
        };
      }

      qrCodeRef.current.update(previewOptions);
      downloadQrCodeRef.current.update(qrOptions.downloadOptions);
    }
  }, [qrOptions, tempGradient, gradientEditMode]);

  // Save preferences to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(
        "qrPreferences",
        JSON.stringify(qrOptions.downloadOptions)
      );
      localStorage.setItem("qrPresets", JSON.stringify(presets));
    }, 500);
    return () => clearTimeout(timer);
  }, [qrOptions, presets]);

  // Update temp gradient when gradient stops change
  useEffect(() => {
    if (gradientEditMode) {
      setTempGradient({
        type: gradientType,
        rotation: gradientRotation,
        colorStops: [...gradientStops],
      });
    }
  }, [gradientStops, gradientType, gradientRotation, gradientEditMode]);

  // Handlers
  const handleUrlChange = (e) => {
    const newUrl = e.target.value;
    setNewQrData(newUrl);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLogoFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const logoUrl = event.target.result;
      setLogoPreview(logoUrl);
      setQrOptions((prev) => ({
        ...prev,
        downloadOptions: { ...prev.downloadOptions, image: logoUrl },
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleDownload =  async() => {

    if (!user) {
      setShowAuthPopup(true);
      return;
    }
 try {
      // Get fresh data
      const result = await qrFunctionWithAuth(newQrData);
      const downloadUrl = `http://localhost:3000/qrresult/${result.id}`;

      // Create brand new instance to ensure no stale data
      const downloadQr = new QRCodeStyling({
        ...qrOptions.downloadOptions,
        data: downloadUrl,
      });

      // Update preview
      qrCodeRef.current.update({
        ...qrOptions.downloadOptions,
        data: downloadUrl,
        width: qrOptions.previewOptions.width,
        height: qrOptions.previewOptions.height,
      });

      // Download fresh instance
      downloadQr.download({
        name: "qr-code",
        extension: fileExt,
      });

      // Update state
      setQrData(downloadUrl);
      setQrOptions((prev) => ({
        ...prev,
        downloadOptions: {
          ...prev.downloadOptions,
          data: downloadUrl,
        },
      }));
    } catch (error) {
      console.error("Download failed:", error);
      // Add error notification here
    }

  };

  const handleLoginSuccess = async () => {
    

   


    
  };
  
  const handleStyleChange = (property, value) => {
    setQrOptions((prev) => {
      const newOptions = { ...prev };

      if (property.includes(".")) {
        const [parent, child] = property.split(".");
        newOptions.downloadOptions[parent] = {
          ...newOptions.downloadOptions[parent],
          [child]: value,
        };

        if (child === "color" && newOptions.downloadOptions[parent].gradient) {
          newOptions.downloadOptions[parent].gradient = null;
        }
      } else {
        newOptions.downloadOptions[property] = value;
      }

      return newOptions;
    });
  };

  const applyPreset = (preset) => {
    setQrOptions((prev) => {
      const newOptions = { ...prev };
      Object.keys(preset.options).forEach((key) => {
        newOptions.downloadOptions[key] = {
          ...newOptions.downloadOptions[key],
          ...preset.options[key],
        };
      });
      return newOptions;
    });
  };

  const savePreset = () => {
    const name = presetNameRef.current.value.trim();
    if (!name) return;

    const newPreset = {
      name,
      options: {
        dotsOptions: { ...qrOptions.downloadOptions.dotsOptions },
        cornersSquareOptions: {
          ...qrOptions.downloadOptions.cornersSquareOptions,
        },
        cornersDotOptions: { ...qrOptions.downloadOptions.cornersDotOptions },
        backgroundOptions: { ...qrOptions.downloadOptions.backgroundOptions },
      },
    };

    setPresets((prev) => [...prev, newPreset]);
    setShowPresetModal(false);
    presetNameRef.current.value = "";
  };

  const removePreset = (index) => {
    setPresets((prev) => prev.filter((_, i) => i !== index));
  };

  const startGradientEdit = (target) => {
    setGradientEditMode(target);
    const currentGradient =
      qrOptions.downloadOptions[`${target}Options`].gradient;
    if (currentGradient) {
      setGradientStops(currentGradient.colorStops);
      setGradientType(currentGradient.type);
      setGradientRotation(currentGradient.rotation || 0);
      setTempGradient(currentGradient);
    } else {
      setGradientStops([
        { offset: 0, color: "#000000" },
        { offset: 1, color: "#ffffff" },
      ]);
      setGradientType("linear");
      setGradientRotation(0);
      setTempGradient({
        type: "linear",
        rotation: 0,
        colorStops: [
          { offset: 0, color: "#000000" },
          { offset: 1, color: "#ffffff" },
        ],
      });
    }
  };

  const applyGradient = () => {
    if (!gradientEditMode) return;

    const gradient = {
      type: gradientType,
      rotation: gradientRotation,
      colorStops: [...gradientStops],
    };

    setQrOptions((prev) => ({
      ...prev,
      downloadOptions: {
        ...prev.downloadOptions,
        [`${gradientEditMode}Options`]: {
          ...prev.downloadOptions[`${gradientEditMode}Options`],
          gradient,
          color: gradientStops[0].color,
        },
      },
    }));

    setGradientEditMode(null);
    setTempGradient(null);
  };

  const cancelGradientEdit = () => {
    setGradientEditMode(null);
    setTempGradient(null);
  };

  const addGradientStop = () => {
    setGradientStops((prev) => {
      const newStops = [...prev];
      const index = Math.floor(newStops.length / 2);
      newStops.splice(index, 0, {
        offset:
          (newStops[index - 1]?.offset + newStops[index]?.offset) / 2 || 0.5,
        color: "#888888",
      });
      return newStops;
    });
  };

  const removeGradientStop = (index) => {
    if (gradientStops.length <= 2) return;
    setGradientStops((prev) => prev.filter((_, i) => i !== index));
  };

  const updateGradientStop = (index, property, value) => {
    setGradientStops((prev) => {
      const newStops = [...prev];
      newStops[index] = { ...newStops[index], [property]: value };
      return newStops;
    });
  };

  // Gradient editor component
  const GradientEditor = () => (
    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
      <h3 className="mb-3 font-medium">Editing {gradientEditMode} gradient</h3>

      <div className="mb-4">
        <div
          className="h-8 mb-2 rounded"
          style={{
            background:
              gradientType === "linear"
                ? `linear-gradient(${gradientRotation}deg, ${gradientStops
                    .map((stop) => stop.color)
                    .join(", ")})`
                : `radial-gradient(${gradientStops
                    .map((stop) => stop.color)
                    .join(", ")})`,
          }}
        />

        <div className="flex justify-between mb-2">
          <label className="text-sm text-gray-700">Type:</label>
          <select
            value={gradientType}
            onChange={(e) => setGradientType(e.target.value)}
            className="p-1 text-sm border rounded"
          >
            <option value="linear">Linear</option>
            <option value="radial">Radial</option>
          </select>
        </div>

        {gradientType === "linear" && (
          <div className="flex justify-between mb-2">
            <label className="text-sm text-gray-700">Rotation:</label>
            <input
              type="range"
              min="0"
              max="360"
              value={gradientRotation}
              onChange={(e) => setGradientRotation(parseInt(e.target.value))}
              className="w-32"
            />
            <span className="w-8 text-sm text-right">{gradientRotation}°</span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {gradientStops.map((stop, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={stop.offset}
              onChange={(e) =>
                updateGradientStop(index, "offset", parseFloat(e.target.value))
              }
              className="flex-1"
            />
            <input
              type="color"
              value={stop.color}
              onChange={(e) =>
                updateGradientStop(index, "color", e.target.value)
              }
              className="w-8 h-8"
            />
            {gradientStops.length > 2 && (
              <button
                onClick={() => removeGradientStop(index)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-4">
        <button
          onClick={addGradientStop}
          className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
        >
          Add Color Stop
        </button>
        <div className="space-x-2">
          <button
            onClick={cancelGradientEdit}
            className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={applyGradient}
            className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Apply Gradient
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-50 sm:px-6 lg:px-8">
      <title>Advanced QR</title>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Advanced QR Code Generator
          </h1>
          <p className="max-w-2xl mx-auto mt-3 text-xl text-gray-500 sm:mt-4">
            Create custom QR codes with logos, colors, and gradients
          </p>
        </div>

        {/* Main Content */}
        <div className="overflow-hidden bg-white rounded-lg shadow-xl">
          <div className="flex flex-col lg:flex-row">
            {/* Preview Panel */}
            <div className="p-6 border-r border-gray-200 lg:w-1/3 bg-gray-50">
              <div className="sticky top-6">
                <div className="flex flex-col items-center">
                  {/* QR Code Display */}
                  <div
                    ref={qrContainerRef}
                    className="flex items-center justify-center w-64 h-64 p-4 mb-6 bg-white border border-gray-200 rounded-lg shadow-sm"
                  />

                  {/* Download Controls */}
                  <div className="w-full space-y-4">
                    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <h3 className="mb-3 font-medium text-gray-800">
                        Download Settings
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">
                            Format
                          </label>
                          <select
                            value={fileExt}
                            onChange={(e) => setFileExt(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="png">PNG</option>
                            <option value="jpeg">JPEG</option>
                            <option value="webp">WEBP</option>
                            <option value="svg">SVG</option>
                          </select>
                        </div>

                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">
                            Size: {qrOptions.downloadOptions.width}px
                          </label>
                          <input
                            type="range"
                            min="100"
                            max="1000"
                            value={qrOptions.downloadOptions.width}
                            onChange={(e) => {
                              const size = parseInt(e.target.value);
                              handleStyleChange("width", size);
                              handleStyleChange("height", size);
                            }}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>

                        <button
                          onClick={handleDownload}
                          disabled={isDownloading}
                          className={`flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                            isDownloading ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          {isDownloading ? (
                            <svg
                              className="w-5 h-5 mr-2 animate-spin"
                              viewBox="0 0 24 24"
                            >
                              {/* Loading spinner SVG */}
                            </svg>
                          ) : (
                            <svg
                              className="w-5 h-5 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              {/* Download icon SVG */}
                            </svg>
                          )}
                          {isDownloading ? "Generating..." : "Download QR Code"}
                        </button>
                        {showAuthPopup && (
        <AuthPopup
          onClose={() => setShowAuthPopup(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
                      </div>
                    </div>

                    {/* Presets Section */}
                    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-800">Presets</h3>
                        <button
                          onClick={() => setShowPresetModal(true)}
                          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                          Save Preset
                        </button>
                      </div>

                      <div className="space-y-2 overflow-y-auto max-h-60">
                        {presets.map((preset, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 rounded hover:bg-gray-50"
                          >
                            <button
                              onClick={() => applyPreset(preset)}
                              className="flex-1 text-sm text-left hover:text-blue-600"
                            >
                              {preset.name}
                            </button>
                            <button
                              onClick={() => removePreset(index)}
                              className="ml-2 text-gray-400 hover:text-red-500"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Configuration Panel */}
            <div className="p-6 lg:w-2/3">
              <div className="mb-6 border-b border-gray-200">
                <nav className="flex -mb-px space-x-8">
                  <button
                    onClick={() => setActiveTab("basic")}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "basic"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Basic Settings
                  </button>
                  <button
                    onClick={() => setActiveTab("advanced")}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "advanced"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Advanced Styling
                  </button>
                  <button
                    onClick={() => setActiveTab("gradient")}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "gradient"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Gradients
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div>
                {activeTab === "basic" && (
                  <div className="space-y-6">
                    <div className="p-4 rounded-lg bg-gray-50">
                      <h3 className="mb-3 font-medium text-gray-800">
                        Content
                      </h3>
                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          URL or Text
                        </label>
                        <input
                          type="text"
                          onChange={handleUrlChange}
                          placeholder="https://example.com"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-gray-50">
                      <h3 className="mb-3 font-medium text-gray-800">Logo</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">
                            Upload Logo
                          </label>
                          <div className="flex items-center">
                            <label className="flex-1 cursor-pointer">
                              <div className="flex items-center justify-center px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">
                                <svg
                                  className="w-5 h-5 mr-2 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                                Choose an image
                                <input
                                  type="file"
                                  className="sr-only"
                                  onChange={handleLogoUpload}
                                  accept="image/*"
                                />
                              </div>
                            </label>
                            {logoPreview && (
                              <button
                                onClick={() => {
                                  setLogoPreview("");
                                  setLogoFile(null);
                                  handleStyleChange("image", "");
                                }}
                                className="inline-flex items-center px-3 py-2 ml-3 text-sm font-medium leading-4 text-red-700 bg-red-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                          {logoPreview && (
                            <div className="flex items-center mt-2">
                              <img
                                src={logoPreview}
                                alt="Logo preview"
                                className="object-contain w-12 h-12 border border-gray-200 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-500">
                                Logo preview
                              </span>
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">
                            Logo Size:{" "}
                            {(
                              qrOptions.downloadOptions.imageOptions.imageSize *
                              100
                            ).toFixed(0)}
                            %
                          </label>
                          <input
                            type="range"
                            min="0.1"
                            max="0.5"
                            step="0.05"
                            value={
                              qrOptions.downloadOptions.imageOptions.imageSize
                            }
                            onChange={(e) =>
                              handleStyleChange(
                                "imageOptions.imageSize",
                                parseFloat(e.target.value)
                              )
                            }
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-gray-50">
                      <h3 className="mb-3 font-medium text-gray-800">Layout</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">
                            Margin: {qrOptions.downloadOptions.margin}px
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="20"
                            value={qrOptions.downloadOptions.margin}
                            onChange={(e) =>
                              handleStyleChange(
                                "margin",
                                parseInt(e.target.value)
                              )
                            }
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "advanced" && (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Dots Style */}
                    <div className="p-4 rounded-lg bg-gray-50">
                      <h3 className="mb-3 font-medium text-gray-800">
                        Dots Style
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">
                            Shape
                          </label>
                          <select
                            value={qrOptions.downloadOptions.dotsOptions.type}
                            onChange={(e) =>
                              handleStyleChange(
                                "dotsOptions.type",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="square">Square</option>
                            <option value="rounded">Rounded</option>
                            <option value="dots">Dots</option>
                            <option value="classy">Classy</option>
                            <option value="classy-rounded">
                              Classy Rounded
                            </option>
                            <option value="extra-rounded">Extra Rounded</option>
                          </select>
                        </div>

                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">
                            Color
                          </label>
                          <div className="flex items-center">
                            <input
                              type="color"
                              value={
                                qrOptions.downloadOptions.dotsOptions.color
                              }
                              onChange={(e) =>
                                handleStyleChange(
                                  "dotsOptions.color",
                                  e.target.value
                                )
                              }
                              className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                            />
                            <span className="ml-2 text-sm text-gray-500">
                              {qrOptions.downloadOptions.dotsOptions.color}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Corners Square */}
                    <div className="p-4 rounded-lg bg-gray-50">
                      <h3 className="mb-3 font-medium text-gray-800">
                        Corners Square
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">
                            Shape
                          </label>
                          <select
                            value={
                              qrOptions.downloadOptions.cornersSquareOptions
                                .type
                            }
                            onChange={(e) =>
                              handleStyleChange(
                                "cornersSquareOptions.type",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="square">Square</option>
                            <option value="dot">Dot</option>
                            <option value="rounded">Rounded</option>
                            <option value="extra-rounded">Extra Rounded</option>
                            <option value="dots">Dots</option>
                            <option value="classy">Classy</option>
                            <option value="classy-rounded">
                              Classy Rounded
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">
                            Color
                          </label>
                          <div className="flex items-center">
                            <input
                              type="color"
                              value={
                                qrOptions.downloadOptions.cornersSquareOptions
                                  .color
                              }
                              onChange={(e) =>
                                handleStyleChange(
                                  "cornersSquareOptions.color",
                                  e.target.value
                                )
                              }
                              className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                            />
                            <span className="ml-2 text-sm text-gray-500">
                              {
                                qrOptions.downloadOptions.cornersSquareOptions
                                  .color
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Corners Dot */}
                    <div className="p-4 rounded-lg bg-gray-50">
                      <h3 className="mb-3 font-medium text-gray-800">
                        Corners Dot
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">
                            Shape
                          </label>
                          <select
                            value={
                              qrOptions.downloadOptions.cornersDotOptions.type
                            }
                            onChange={(e) =>
                              handleStyleChange(
                                "cornersDotOptions.type",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="square">Square</option>
                            <option value="dot">Dot</option>
                            <option value="rounded">Rounded</option>
                            <option value="extra-rounded">Extra Rounded</option>
                            <option value="dots">Dots</option>
                            <option value="classy">Classy</option>
                            <option value="classy-rounded">
                              Classy Rounded
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">
                            Color
                          </label>
                          <div className="flex items-center">
                            <input
                              type="color"
                              value={
                                qrOptions.downloadOptions.cornersDotOptions
                                  .color
                              }
                              onChange={(e) =>
                                handleStyleChange(
                                  "cornersDotOptions.color",
                                  e.target.value
                                )
                              }
                              className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                            />
                            <span className="ml-2 text-sm text-gray-500">
                              {
                                qrOptions.downloadOptions.cornersDotOptions
                                  .color
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Background & Error Correction */}
                    <div className="p-4 rounded-lg bg-gray-50">
                      <h3 className="mb-3 font-medium text-gray-800">
                        Background
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">
                            Color
                          </label>
                          <div className="flex items-center">
                            <input
                              type="color"
                              value={
                                qrOptions.downloadOptions.backgroundOptions
                                  .color
                              }
                              onChange={(e) =>
                                handleStyleChange(
                                  "backgroundOptions.color",
                                  e.target.value
                                )
                              }
                              className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                            />
                            <span className="ml-2 text-sm text-gray-500">
                              {
                                qrOptions.downloadOptions.backgroundOptions
                                  .color
                              }
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">
                            Error Correction
                          </label>
                          <select
                            value={
                              qrOptions.downloadOptions.qrOptions
                                .errorCorrectionLevel
                            }
                            onChange={(e) =>
                              handleStyleChange(
                                "qrOptions.errorCorrectionLevel",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="L">Low (7%)</option>
                            <option value="M">Medium (15%)</option>
                            <option value="Q">Quartile (25%)</option>
                            <option value="H">High (30%)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "gradient" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <button
                        onClick={() => startGradientEdit("dots")}
                        className={`p-4 rounded-lg border ${
                          qrOptions.downloadOptions.dotsOptions.gradient
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        <div className="mb-2 text-sm font-medium text-gray-800">
                          Dots Gradient
                        </div>
                        {qrOptions.downloadOptions.dotsOptions.gradient ? (
                          <div
                            className="h-4 rounded"
                            style={{
                              background:
                                qrOptions.downloadOptions.dotsOptions.gradient
                                  .type === "linear"
                                  ? `linear-gradient(${
                                      qrOptions.downloadOptions.dotsOptions
                                        .gradient.rotation
                                    }deg, ${qrOptions.downloadOptions.dotsOptions.gradient.colorStops
                                      .map((stop) => stop.color)
                                      .join(", ")})`
                                  : `radial-gradient(${qrOptions.downloadOptions.dotsOptions.gradient.colorStops
                                      .map((stop) => stop.color)
                                      .join(", ")})`,
                            }}
                          />
                        ) : (
                          <div className="text-xs text-gray-500">
                            Click to add gradient
                          </div>
                        )}
                      </button>

                      <button
                        onClick={() => startGradientEdit("cornersSquare")}
                        className={`p-4 rounded-lg border ${
                          qrOptions.downloadOptions.cornersSquareOptions
                            .gradient
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        <div className="mb-2 text-sm font-medium text-gray-800">
                          Corners Square Gradient
                        </div>
                        {qrOptions.downloadOptions.cornersSquareOptions
                          .gradient ? (
                          <div
                            className="h-4 rounded"
                            style={{
                              background:
                                qrOptions.downloadOptions.cornersSquareOptions
                                  .gradient.type === "linear"
                                  ? `linear-gradient(${
                                      qrOptions.downloadOptions
                                        .cornersSquareOptions.gradient.rotation
                                    }deg, ${qrOptions.downloadOptions.cornersSquareOptions.gradient.colorStops
                                      .map((stop) => stop.color)
                                      .join(", ")})`
                                  : `radial-gradient(${qrOptions.downloadOptions.cornersSquareOptions.gradient.colorStops
                                      .map((stop) => stop.color)
                                      .join(", ")})`,
                            }}
                          />
                        ) : (
                          <div className="text-xs text-gray-500">
                            Click to add gradient
                          </div>
                        )}
                      </button>

                      <button
                        onClick={() => startGradientEdit("background")}
                        className={`p-4 rounded-lg border ${
                          qrOptions.downloadOptions.backgroundOptions.gradient
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        <div className="mb-2 text-sm font-medium text-gray-800">
                          Background Gradient
                        </div>
                        {qrOptions.downloadOptions.backgroundOptions
                          .gradient ? (
                          <div
                            className="h-4 rounded"
                            style={{
                              background:
                                qrOptions.downloadOptions.backgroundOptions
                                  .gradient.type === "linear"
                                  ? `linear-gradient(${
                                      qrOptions.downloadOptions
                                        .backgroundOptions.gradient.rotation
                                    }deg, ${qrOptions.downloadOptions.backgroundOptions.gradient.colorStops
                                      .map((stop) => stop.color)
                                      .join(", ")})`
                                  : `radial-gradient(${qrOptions.downloadOptions.backgroundOptions.gradient.colorStops
                                      .map((stop) => stop.color)
                                      .join(", ")})`,
                            }}
                          />
                        ) : (
                          <div className="text-xs text-gray-500">
                            Click to add gradient
                          </div>
                        )}
                      </button>
                    </div>

                    {gradientEditMode && <GradientEditor />}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preset Save Modal */}
      {showPresetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md mx-4 bg-white rounded-lg shadow-xl">
            <div className="p-6">
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                Save Current Settings as Preset
              </h3>
              <input
                ref={presetNameRef}
                type="text"
                placeholder="Enter preset name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="flex justify-end mt-6 space-x-3">
                <button
                  onClick={() => setShowPresetModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={savePreset}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save Preset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="m-auto">
          <UserGuideSection />
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
