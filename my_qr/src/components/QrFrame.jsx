import React, { useState, useEffect, useRef } from "react";
import * as fabric from "fabric"; // Use ES Module import
import { saveAs } from "file-saver";
import image1 from "../assets/frames/frame1.png";
import image2 from "../assets/frames/frame2.png";
import QrFrameStep from "./QrFrameSteps";
// Predefined frame URLs (replace with actual URLs)
const frameOptions = [
  {
    id: 1,
    name: "Frame 1",
    url: image1,
    color: "red",
    shape: "square",
    textFriendly: true,
  },
  {
    id: 2,
    name: "Frame 2",
    url: image2,
    color: "blue",
    shape: "circle",
    textFriendly: false,
  },
  {
    id: 3,
    name: "Frame 3",
    url: "/frames/frame3.png",
    color: "black",
    shape: "rectangle",
    textFriendly: true,
  },
  {
    id: 4,
    name: "Frame 4",
    url: "/frames/frame4.png",
    color: "red",
    shape: "circle",
    textFriendly: true,
  },
  {
    id: 5,
    name: "Frame 5",
    url: "/frames/frame5.png",
    color: "blue",
    shape: "square",
    textFriendly: false,
  },
];

// Available font families
const fontOptions = [
  "Arial",
  "Times New Roman",
  "Helvetica",
  "Georgia",
  "Courier New",
];

// Available font weights
const fontWeightOptions = [
  { value: "normal", label: "Normal" },
  { value: "bold", label: "Bold" },
  { value: "lighter", label: "Lighter" },
  { value: "400", label: "Regular (400)" },
  { value: "700", label: "Bold (700)" },
];

// Filter options
const colorFilterOptions = ["All", "Red", "Blue", "Black"];
const shapeFilterOptions = ["All", "Square", "Circle", "Rectangle"];
const textFilterOptions = [
  { value: "all", label: "All" },
  { value: "textFriendly", label: "Text-Friendly" },
  { value: "nonTextFriendly", label: "Non-Text-Friendly" },
];

// Default color options (18 colors)
const defaultColors = [
  '#FF0000', // Red
  '#00FF00', // Green
  '#0000FF', // Blue
  '#FFFF00', // Yellow
  '#FF00FF', // Magenta
  '#00FFFF', // Cyan
  '#FFFFFF', // White
  '#000000', // Black
  '#FFA500', // Orange
  '#800080', // Purple
  '#008000', // Dark Green
  '#FFC0CB', // Pink
  '#A52A2A', // Brown
  '#808080', // Gray
  '#FFD700', // Gold
  '#4B0082', // Indigo
  '#40E0D0', // Turquoise
  '#EE82EE', // Violet
];

const QrFrame = () => {
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [qrImage, setQrImage] = useState(null);
  const [canvas, setCanvas] = useState(null);
  const canvasRef = useRef(null);
  const qrInputRef = useRef(null);
  const [qrPosition, setQrPosition] = useState({ x: 100, y: 100, scale: 1 });
  // Multi-text states with initial text field
  const [texts, setTexts] = useState([
    {
      id: Date.now(),
      content: '',
      fontSize: 40,
      fontFamily: 'Arial',
      fontWeight: 'normal',
      color: '#000000',
      x: 100,
      y: 100,
    },
  ]);
  // Frame color state
  const [frameColor, setFrameColor] = useState('#FFFFFF');
  // Filter states
  const [shapeFilter, setShapeFilter] = useState('All');
  const [textFilter, setTextFilter] = useState('all');
  // Refs to track canvas objects
  const canvasObjects = useRef({ frame: null, qr: null, texts: [] });
  // Track previous QR scale
  const prevQrScale = useRef(qrPosition.scale);

  // Log available filters for debugging
  useEffect(() => {
    if (window.fabric && window.fabric.Image && window.fabric.Image.filters) {
      console.log('Available Fabric.js filters:', Object.keys(window.fabric.Image.filters));
    }
  }, []);

  // Filtered frames based on selected filters
  const filteredFrames = frameOptions.filter((frame) => {
    const matchesShape = shapeFilter === 'All' || frame.shape.toLowerCase() === shapeFilter.toLowerCase();
    const matchesText =
      textFilter === 'all' ||
      (textFilter === 'textFriendly' && frame.textFriendly) ||
      (textFilter === 'nonTextFriendly' && !frame.textFriendly);
    return matchesShape && matchesText;
  });

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current) {
      console.error('Canvas ref is not available');
      return;
    }

    try {
      const fabricCanvas = new window.fabric.Canvas(canvasRef.current, {
        width: 550,
        height: 550,
      });
      setCanvas(fabricCanvas);

      return () => {
        fabricCanvas.dispose();
      };
    } catch (error) {
      console.error('Failed to initialize Fabric.js canvas:', error);
    }
  }, []);

  // Update frame
  useEffect(() => {
    if (!canvas) return;

    if (selectedFrame) {
      if (!canvasObjects.current.frame || canvasObjects.current.frame.url !== selectedFrame.url) {
        if (canvasObjects.current.frame) {
          canvas.remove(canvasObjects.current.frame);
        }
        window.fabric.Image.fromURL(
          selectedFrame.url,
          (img) => {
            img.set({ left: 0, top: 0, selectable: false });
            img.scaleToWidth(550);
            // Apply BlendColor filter
            if (window.fabric.Image.filters.BlendColor) {
              img.filters = img.filters || [];
              img.filters.push(
                new window.fabric.Image.filters.BlendColor({
                  color: frameColor,
                  mode: 'tint',
                  alpha: 0.5,
                })
              );
              img.applyFilters();
            } else {
              console.warn('BlendColor filter is not available in this Fabric.js version.');
            }
            canvas.add(img);
            canvas.sendToBack(img);
            canvasObjects.current.frame = img;
            canvasObjects.current.frame.url = selectedFrame.url;
            if (canvasObjects.current.qr) {
              canvas.bringToFront(canvasObjects.current.qr);
            }
            canvasObjects.current.texts.forEach((textObj) => {
              canvas.bringToFront(textObj);
            });
            canvas.renderAll();
          },
          { crossOrigin: 'anonymous' }
        );
      } else {
        // Update existing frame's color
        if (window.fabric.Image.filters.BlendColor) {
          canvasObjects.current.frame.filters = canvasObjects.current.frame.filters || [];
          const blendFilter = canvasObjects.current.frame.filters.find(
            (filter) => filter instanceof window.fabric.Image.filters.BlendColor
          );
          if (blendFilter) {
            blendFilter.color = frameColor;
            blendFilter.alpha = 0.5;
          } else {
            canvasObjects.current.frame.filters.push(
              new window.fabric.Image.filters.BlendColor({
                color: frameColor,
                mode: 'tint',
                alpha: 0.5,
              })
            );
          }
          canvasObjects.current.frame.applyFilters();
          canvas.renderAll();
        } else {
          console.warn('BlendColor filter is not available, skipping color update.');
        }
      }
    } else if (canvasObjects.current.frame) {
      canvas.remove(canvasObjects.current.frame);
      canvasObjects.current.frame = null;
      canvas.renderAll();
    }
  }, [canvas, selectedFrame, frameColor]);

  // Update QR code
  useEffect(() => {
    if (!canvas) return;

    if (qrImage) {
      if (!canvasObjects.current.qr || canvasObjects.current.qr.src !== qrImage) {
        if (canvasObjects.current.qr) {
          canvas.remove(canvasObjects.current.qr);
        }
        window.fabric.Image.fromURL(
          qrImage,
          (img) => {
            img.set({
              left: qrPosition.x,
              top: qrPosition.y,
              scaleX: qrPosition.scale,
              scaleY: qrPosition.scale,
            });
            canvas.add(img);
            canvasObjects.current.qr = img;
            canvasObjects.current.qr.src = qrImage;
            canvasObjects.current.texts.forEach((textObj) => {
              canvas.bringToFront(textObj);
            });
            canvas.renderAll();
            prevQrScale.current = qrPosition.scale;
          },
          { crossOrigin: 'anonymous' }
        );
      } else {
        canvasObjects.current.qr.set({
          left: qrPosition.x,
          top: qrPosition.y,
        });
        if (qrPosition.scale !== prevQrScale.current) {
          canvasObjects.current.qr.set({
            scaleX: qrPosition.scale,
            scaleY: qrPosition.scale,
          });
          prevQrScale.current = qrPosition.scale;
        }
        canvasObjects.current.texts.forEach((textObj) => {
          canvas.bringToFront(textObj);
        });
        canvas.renderAll();
      }
    } else if (canvasObjects.current.qr) {
      canvas.remove(canvasObjects.current.qr);
      canvasObjects.current.qr = null;
      canvas.renderAll();
    }
  }, [canvas, qrImage, qrPosition]);

  // Update multiple texts
  useEffect(() => {
    if (!canvas) return;

    // Remove old text objects
    canvasObjects.current.texts.forEach((textObj) => {
      canvas.remove(textObj);
    });
    canvasObjects.current.texts = [];

    // Add new text objects
    texts.forEach((text) => {
      if (text.content) {
        const textObj = new window.fabric.Text(text.content, {
          left: text.x,
          top: text.y,
          fontSize: text.fontSize,
          fontFamily: text.fontFamily,
          fontWeight: text.fontWeight,
          fill: text.color,
          selectable: false,
        });
        canvas.add(textObj);
        canvas.bringToFront(textObj);
        canvasObjects.current.texts.push(textObj);
      }
    });

    canvas.renderAll();
  }, [canvas, texts]);

  // Handle frame selection
  const handleFrameSelect = (frame) => {
    setSelectedFrame(frame);
  };

  // Handle QR code upload
  const handleQRCodeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setQrImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle QR position and scale updates
  const updateQRPosition = (key, value) => {
    setQrPosition((prev) => ({ ...prev, [key]: value }));
  };

  // Add new text field
  const addTextField = () => {
    setTexts((prev) => [
      ...prev,
      {
        id: Date.now(),
        content: '',
        fontSize: 40,
        fontFamily: 'Arial',
        fontWeight: 'normal',
        color: '#000000',
        x: 100,
        y: 100,
      },
    ]);
  };

  // Update text field
  const updateTextField = (id, field, value) => {
    setTexts((prev) =>
      prev.map((text) =>
        text.id === id ? { ...text, [field]: value } : text
      )
    );
  };

  // Remove text field
  const removeTextField = (id) => {
    setTexts((prev) => prev.filter((text) => text.id !== id));
  };

  // Handle color swatch selection
  const handleColorSwatchSelect = (color) => {
    setFrameColor(color);
  };

  // Download the final result
  const handleDownload = () => {
    if (canvas) {
      try {
        // Create a temporary canvas for 550x550 output
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = 550;
        tempCanvas.height = 550;
        const tempContext = tempCanvas.getContext('2d');

        // Get the 1000x1000 canvas data
        const dataURL = canvas.toDataURL({
          format: 'png',
          quality: 1,
        });

        // Draw scaled image onto temporary canvas
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          tempContext.drawImage(img, 0, 0, 550, 550);
          tempCanvas.toBlob((blob) => {
            saveAs(blob, 'qr-with-frame.png');
          }, 'image/png', 1);
        };
        img.src = dataURL;
      } catch (error) {
        console.error('Failed to download image:', error);
      }
    }
  };

  return (
    <div className="container p-4 mx-auto">
      <h2 className="mb-6 text-2xl font-bold text-center">QR Code Frame Composer</h2>

      {/* Frame Selection with Filters */}
      <div className="mb-8">
        <h3 className="mb-4 text-lg font-semibold text-center">Choose a Frame</h3>
        {/* Filter Controls */}
        <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2">
          <div>
            <label className="block mb-1 text-sm font-medium">Filter by Shape</label>
            <select
              value={shapeFilter}
              onChange={(e) => setShapeFilter(e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            >
              {shapeFilterOptions.map((shape) => (
                <option key={shape} value={shape}>
                  {shape}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Text Compatibility</label>
            <select
              value={textFilter}
              onChange={(e) => setTextFilter(e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            >
              {textFilterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Slidable Frame Selection */}
        <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          {filteredFrames.length > 0 ? (
            filteredFrames.map((frame) => (
              <div
                key={frame.id}
                className="flex-none mx-2 snap-center"
                style={{ minWidth: '120px' }}
              >
                <button
                  onClick={() => handleFrameSelect(frame)}
                  className={`border-2 p-3 rounded-lg transition-colors w-full ${
                    selectedFrame?.id === frame.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  <img
                    src={frame.url}
                    alt={frame.name}
                    className="object-contain w-20 h-20 mx-auto mb-2"
                  />
                  <p className="text-sm text-center">{frame.name}</p>
                </button>
              </div>
            ))
          ) : (
            <p className="mx-auto text-sm text-gray-500">No frames match the selected filters.</p>
          )}
        </div>
      </div>

      {/* QR Code Upload */}
      <div className="p-4 mb-8 border border-gray-200 rounded-lg bg-gray-50">
        <h3 className="mb-2 text-lg font-semibold text-center">Upload QR Code</h3>
        <input
          type="file"
          accept="image/*"
          ref={qrInputRef}
          onChange={handleQRCodeUpload}
          className="block w-full max-w-md mx-auto text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      {/* Preview and Options Layout */}
      <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-2">
        {/* Canvas Preview */}
        <div className="flex justify-center items-start min-h-[50vh] md:min-h-0">
          <div className="w-[90vw] sm:w-[60vw] md:w-[500px] md:h-[500px] max-w-[600px] aspect-square">
            <h3 className="mb-2 text-lg font-semibold text-center">Preview</h3>
            <canvas
              ref={canvasRef}
              className="w-full h-full border border-gray-300 shadow-md"
            />
          </div>
        </div>

        {/* Text and QR Options */}
        <div className="flex flex-col gap-4">
          {/* Frame Color Section */}
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="mb-4 text-lg font-semibold text-center">Frame Color</h3>
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">Custom Color</label>
              <input
                type="color"
                value={frameColor}
                onChange={(e) => setFrameColor(e.target.value)}
                className="w-full h-10 border border-gray-300 rounded cursor-pointer"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Default Colors</label>
              <div className="grid grid-cols-5 gap-2">
                {defaultColors.map((color) => (
                  <div
                    key={color}
                    className={`w-8 h-8 rounded cursor-pointer border-2 ${
                      frameColor === color ? 'border-blue-500' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorSwatchSelect(color)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* QR Adjustments Section */}
          {qrImage && (
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="mb-4 text-lg font-semibold text-center">QR Code Adjustments</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block mb-1 text-sm font-medium">X Position</label>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={qrPosition.x}
                    onChange={(e) => updateQRPosition('x', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">Y Position</label>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={qrPosition.y}
                    onChange={(e) => updateQRPosition('y', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">Scale</label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={qrPosition.scale}
                    onChange={(e) => updateQRPosition('scale', parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Text Customization Section */}
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="mb-4 text-lg font-semibold text-center">Text Customization</h3>
            {/* Add Text Button */}
            <button
              onClick={addTextField}
              className="w-full px-4 py-2 mb-4 text-sm font-semibold text-white transition-colors bg-blue-500 rounded hover:bg-blue-600"
            >
              Add Text Field
            </button>
            {/* Text Fields */}
            {texts.map((text) => (
              <div key={text.id} className="p-4 mb-4 bg-white border rounded-lg">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block mb-1 text-sm font-medium">Text Content</label>
                    <input
                      type="text"
                      value={text.content}
                      onChange={(e) => updateTextField(text.id, 'content', e.target.value)}
                      placeholder="Enter text"
                      className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">Font Family</label>
                    <select
                      value={text.fontFamily}
                      onChange={(e) => updateTextField(text.id, 'fontFamily', e.target.value)}
                      className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    >
                      {fontOptions.map((font) => (
                        <option key={font} value={font}>
                          {font}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">Font Weight</label>
                    <select
                      value={text.fontWeight}
                      onChange={(e) => updateTextField(text.id, 'fontWeight', e.target.value)}
                      className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    >
                      {fontWeightOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">Font Size ({text.fontSize}px)</label>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      value={text.fontSize}
                      onChange={(e) => updateTextField(text.id, 'fontSize', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">Text Color</label>
                    <input
                      type="color"
                      value={text.color}
                      onChange={(e) => updateTextField(text.id, 'color', e.target.value)}
                      className="w-full h-10 border border-gray-300 rounded cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">Text X Position</label>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={text.x}
                      onChange={(e) => updateTextField(text.id, 'x', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">Text Y Position</label>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={text.y}
                      onChange={(e) => updateTextField(text.id, 'y', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
                <button
                  onClick={() => removeTextField(text.id)}
                  className="w-full px-4 py-2 mt-2 text-sm font-semibold text-white transition-colors bg-red-500 rounded hover:bg-red-600"
                >
                  Remove Text
                </button>
              </div>
            ))}
          </div>

          {/* Download Button */}
          <div className="flex justify-center">
            <button
              onClick={handleDownload}
              disabled={!selectedFrame || !qrImage}
              className="px-6 py-2 text-sm font-semibold text-white transition-transform bg-green-500 rounded disabled:bg-gray-400 hover:bg-green-600 hover:scale-105"
            >
              Download Result
            </button>
          </div>
        </div>
      </div>
      <QrFrameStep/>
    </div>
  );
};

export default QrFrame;
