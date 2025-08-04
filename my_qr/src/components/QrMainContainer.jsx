import React, { useEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import {Link} from 'react-router-dom';


import SimpleQrSteps from "./SimpleQrSteps";
import { qrFunction } from "../function/qrGenFunction";

const qrCode = new QRCodeStyling({
  width: 2000,
  height: 2000,
  dotsOptions: {
    color: "#000000",
    type: "square",
  },
  imageOptions: {
    crossOrigin: "anonymous",
    margin: 20,
  },
});

function QrMainContainer() {

  
  
  const [url, setUrl] = useState("https://qr.com");
  const [getNewUrl, setNewUrl] = useState("https://qr.com");
  const [fileExt, setFileExt] = useState("png");
  const ref = useRef(null);

 

  useEffect(() => {
    qrCode.append(ref.current);
  }, []);

  useEffect(() => {
    qrCode.update({
      data: getNewUrl,
    });
  }, [getNewUrl]);

  const onUrlChange = (event) => {
    event.preventDefault();
    setUrl(event.target.value);
  };

  const onExtensionChange = (event) => {
    setFileExt(event.target.value);
  };

  const onDownloadClick = async() => {
    const urlID = await qrFunction(url);
    console.log(urlID.id);
    setNewUrl((pre)=>{ return "http://localhost:3000/qrresult/" +urlID.id});
    
    setTimeout(()=>{
      qrCode.download({
      extension: fileExt,
    });
    },5000)
    
  };

  

  return (
    <>
  <div className="py-5 bg-blue-500 lg:p-10 md:py-10">
  <title>Simple QR</title>
    <div className="flex items-center justify-center px-4 sm:px-0">
      {/* Changed to h-auto and min-h-0 for mobile */}
      <div className="w-screen h-auto min-h-0 p-8 sm:h-[450px] md:w-[700px] lg:w-[900px] lg:h-[450px] rounded-lg bg-white justify-center sm:flex items-center">
        <div className="flex-col items-center w-full sm:flex justify-evenly sm:flex-row">
          
          {/* Left Content */}
          <div className="flex flex-col items-center w-full sm:items-start sm:w-auto">
            <h2 className="mb-8 text-4xl font-bold text-center text-gray-600 sm:text-left">
              Simple QR Generator
            </h2>
            <p className="text-center sm:text-left">Website or Page URL</p>
            <input
              className="w-full max-w-md px-2 mb-8 border rounded h-7 sm:rounded-none"
              
              onChange={onUrlChange}
              placeholder="Enter URL"
            />
            <Link to="/advancedQR" 
              className="w-full sm:w-auto relative inline-flex items-center justify-center p-0.5 transform hover:-translate-y-1
                transition-all duration-300 mb-2 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400"
            >
              <span className="relative w-full px-4 sm:px-20 py-2.5 bg-orange-500 rounded-md">
                <span className="hidden sm:inline">Go for Advanced QR Generator ></span>
                <span className="sm:hidden">Advanced Options</span>
              </span>
            </Link>
          </div>

          {/* Vertical Divider - Hidden on mobile */}
          <div className="hidden sm:block border-x-2 border-gray-300 h-[300px] rounded-lg"></div>

          {/* Right Content */}
          <div className="flex flex-col items-center justify-center w-full mt-6 space-y-6 sm:w-auto sm:mt-0">
            <div
              ref={ref}
              className="flex justify-center mx-auto overflow-hidden bg-gray-100 rounded h-36 w-36 md:h-40 md:w-40 sm:bg-transparent"
            />

            <form className="w-full px-4 sm:w-28 sm:px-0">
              <label
                htmlFor="countries"
                className="block mb-2 text-sm font-medium text-center text-gray-900 sm:text-left"
              >
                File Type
              </label>
              <select onChange={onExtensionChange}
                id="countries"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
              >
                <option value="png">PNG</option>
                <option value="jpeg">JPEG</option>
                <option value="svg">SVG</option>
                <option value="webp">WEBP</option>
              </select>
            </form>

            <button onClick={onDownloadClick}
              className="w-full sm:w-auto relative inline-flex items-center justify-center p-0.5 transform hover:-translate-y-1
                transition-all duration-300 mb-2 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-green-900 to-green-400"
            >
              <span className="relative px-5 py-2.5 bg-green-700 rounded-md w-full text-center">
                Download My Free QR
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <SimpleQrSteps/>
</>
  );
}

export default QrMainContainer;
