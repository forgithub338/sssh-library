"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import getUserEmail from "@/../lib/getUserEmail";
export default function UploadPage() {
  const email = getUserEmail() || "";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [pdfs, setPdfs] = useState([]);

  const handleFileChange = (event, type) => {
    const files = Array.from(event.target.files);
    
    switch (type) {
      case "image":
        setImages(prevImages => [...prevImages, ...files]);
        break;
      case "video":
        setVideos(prevVideos => [...prevVideos, ...files]);
        break;
      case "pdf":
        setPdfs(prevPdfs => [...prevPdfs, ...files]);
        break;
    }
  };

  const removeFile = (index, type) => {
    switch (type) {
      case "image":
        setImages(prevImages => prevImages.filter((_, i) => i !== index));
        break;
      case "video":
        setVideos(prevVideos => prevVideos.filter((_, i) => i !== index));
        break;
      case "pdf":
        setPdfs(prevPdfs => prevPdfs.filter((_, i) => i !== index));
        break;
    }
  };

  const handleUpload = async () => {
    if (!title || !description) {
      alert("請填寫標題和描述！");
      return;
    }

    const formData = new FormData();
    formData.append("author", email);
    formData.append("title", title);
    formData.append("description", description);
    images.forEach(image => formData.append("images", image));
    videos.forEach(video => formData.append("videos", video));
    pdfs.forEach(pdf => formData.append("pdfs", pdf));

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log(data.message);
      if (res.ok) {
        alert("上傳成功！");
        // 清空表單
        setTitle("");
        setDescription("");
        setImages([]);
        setVideos([]);
        setPdfs([]);
      } else {
        alert("上傳失敗: " + data.error);
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("發生錯誤：" + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF3E0] py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl border border-gray-100 overflow-hidden">
        {/* Header section with blue gradient background */}
        <div style={{background: 'linear-gradient(to right, #1E3A8A, #2D4A9A)'}} className="p-8 text-white">
          <h2 className="text-3xl font-bold text-center relative inline-flex flex-col items-center">
            學習成果上傳
            <span className="h-1 w-24 bg-white/70 mt-2 rounded-full"></span>
          </h2>
          <p className="text-white text-center mt-2">分享您的學習旅程和成就</p>
        </div>
        
        <div className="p-8">
          {/* 標題和描述 */}
          <div className="space-y-6 mb-10">
            <div className="group">
              <label className="block text-sm font-medium text-[#333333] mb-2 group-focus-within:text-[#1E3A8A] transition-colors">標題</label>
              <div className="relative">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-4 rounded-xl shadow-sm bg-gray-50 focus:bg-white border border-gray-200"
                  placeholder="請輸入標題"
                />
              </div>
            </div>
            
            <div className="group">
              <label className="block text-sm font-medium text-[#333333] mb-2 group-focus-within:text-[#1E3A8A] transition-colors">描述</label>
              <div className="relative">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-4 rounded-xl h-32 shadow-sm bg-gray-50 resize-none border border-gray-200"
                  placeholder="請輸入描述"
                />
              </div>
            </div>
          </div>

          {/* 檔案上傳區域 */}
          <div className="space-y-10">
            {/* 圖片上傳 */}
            <div className="rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl border border-gray-200">
              <div style={{background: 'linear-gradient(to right, #1E3A8A, #2D4A9A)'}} className="p-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  上傳圖片
                </h3>
              </div>
              <div style={{background: 'linear-gradient(to bottom, #FAF3E0, white)'}} className="p-6">
                <div className="relative mb-6 group">
                  <div className="border-2 border-dashed border-[#B0B0B0] rounded-xl p-4 text-center transition-all hover:border-[#1E3A8A] bg-white">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files);
                        const validFiles = files.filter(file => {
                          if(file.size > 10 * 1024 * 1024) {
                            alert(`檔案 ${file.name} 超過10MB限制`);
                            return false;
                          }
                          return true;
                        });
                        if(validFiles.length > 0) {
                          handleFileChange({target: {files: validFiles}}, "image");
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-[#1E3A8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-2 text-sm font-medium text-[#1E3A8A]">點擊或拖放圖片至此處</p>
                    <p className="text-xs text-[#B0B0B0] mt-1">支持多張圖片上傳 (每個檔案需小於10MB)</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index}`}
                        className="w-full h-40 object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <button
                        onClick={() => removeFile(index, "image")}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0"
                      >
                        ✕
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <p className="text-white text-xs font-medium truncate">{image.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 影片上傳 */}
            <div className="rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl border border-gray-200">
              <div style={{background: 'linear-gradient(to right, #1E3A8A, #2D4A9A)'}} className="p-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                  </svg>
                  上傳影片
                </h3>
              </div>
              <div style={{background: 'linear-gradient(to bottom, #FAF3E0, white)'}} className="p-6">
                <div className="relative mb-6 group">
                  <div className="border-2 border-dashed border-[#B0B0B0] rounded-xl p-4 text-center transition-all hover:border-[#1E3A8A] bg-white">
                    <input
                      type="file"
                      accept="video/*"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files);
                        const validFiles = files.filter(file => {
                          if(file.size > 50 * 1024 * 1024) {
                            alert(`檔案 ${file.name} 超過50MB限制`);
                            return false;
                          }
                          return true;
                        });
                        if(validFiles.length > 0) {
                          handleFileChange({target: {files: validFiles}}, "video");
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-[#1E3A8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-2 text-sm font-medium text-[#1E3A8A]">點擊或拖放影片至此處</p>
                    <p className="text-xs text-[#B0B0B0] mt-1">支持多部影片上傳 (每個檔案需小於50MB)</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  {videos.map((video, index) => (
                    <div key={index} className="relative rounded-xl overflow-hidden shadow-md group transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
                      <video
                        src={URL.createObjectURL(video)}
                        controls
                        className="w-full rounded-lg"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      <button
                        onClick={() => removeFile(index, "video")}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 z-10"
                      >
                        ✕
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/50 backdrop-blur-sm translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-white text-xs font-medium truncate">{video.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* PDF上傳 */}
            <div className="rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl border border-gray-200">
              <div style={{background: 'linear-gradient(to right, #1E3A8A, #2D4A9A)'}} className="p-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                  上傳 PDF
                </h3>
              </div>
              <div style={{background: 'linear-gradient(to bottom, #FAF3E0, white)'}} className="p-6">
                <div className="relative mb-6 group">
                  <div className="border-2 border-dashed border-[#B0B0B0] rounded-xl p-4 text-center transition-all hover:border-[#1E3A8A] bg-white">
                    <input
                      type="file"
                      accept=".pdf"
                      multiple
                      onChange={(e) => handleFileChange(e, "pdf")}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <FontAwesomeIcon icon={faFilePdf} className="h-10 w-10 mx-auto text-[#1E3A8A]" />
                    <p className="mt-2 text-sm font-medium text-[#1E3A8A]">點擊或拖放 PDF 至此處</p>
                    <p className="text-xs text-[#B0B0B0] mt-1">支持多個 PDF 文件上傳</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {pdfs.map((pdf, index) => (
                    <div key={index} className="flex items-center justify-between bg-white p-4 rounded-xl border border-[#B0B0B0] shadow-sm hover:shadow-md transition-all duration-300 hover:border-[#1E3A8A] group">
                      <div className="flex items-center space-x-3">
                        <div className="bg-[#E8EDF8] p-2.5 rounded-lg text-[#1E3A8A]">
                          <FontAwesomeIcon icon={faFilePdf} size="lg" />
                        </div>
                        <div>
                          <span className="text-sm font-medium text-[#333333] group-hover:text-[#1E3A8A] transition-colors">{pdf.name}</span>
                          <p className="text-xs text-[#B0B0B0]">{(pdf.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(index, "pdf")}
                        className="text-[#B0B0B0] hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 上傳按鈕 */}
          <button
            onClick={handleUpload}
            style={{background: 'linear-gradient(to right, #1E3A8A, #2D4A9A)'}}
            className="w-full mt-10 text-white py-4 px-6 rounded-xl transition-all duration-500 shadow-lg hover:shadow-2xl flex items-center justify-center font-medium text-lg"
            onMouseOver={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #9B1B30, #9B1B30)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #1E3A8A, #2D4A9A)'}
          >
            <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-80 group-hover:h-80 opacity-10"></span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 transform group-hover:-translate-y-1 transition-transform duration-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            上傳學習成果
          </button>
        </div>
      </div>
    </div>
  );
};


