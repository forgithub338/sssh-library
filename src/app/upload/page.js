"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";

const UploadPage = () => {
  const [title, setTitle] = useState("1");
  const [description, setDescription] = useState("1");
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
      <div className="max-w-4xl mx-auto p-8 bg-white shadow-xl rounded-2xl border border-gray-100">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800 relative">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">學習成果上傳</span>
          <div className="absolute h-1 w-24 bg-gradient-to-r from-blue-400 to-indigo-500 bottom-0 left-1/2 transform -translate-x-1/2 rounded-full mt-2"></div>
        </h2>
        
        {/* 標題和描述 */}
        <div className="space-y-6 mb-10">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">標題</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
              placeholder="請輸入標題"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">描述</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3.5 border border-gray-200 rounded-xl h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
              placeholder="請輸入描述"
            />
          </div>
        </div>

        {/* 檔案上傳區域 */}
        <div className="space-y-10">
          {/* 圖片上傳 */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              上傳圖片
            </h3>
            <div className="relative mb-6 group">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFileChange(e, "image")}
                className="w-full cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition"
              />
              <div className="mt-2 text-xs text-gray-500">支持多張圖片上傳</div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative group overflow-hidden rounded-xl shadow-md transition-transform hover:scale-105 duration-300">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index}`}
                    className="w-full h-40 object-cover"
                  />
                  <button
                    onClick={() => removeFile(index, "image")}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                    <p className="text-white text-xs truncate">{image.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 影片上傳 */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
              上傳影片
            </h3>
            <div className="relative mb-6 group">
              <input
                type="file"
                accept="video/*"
                multiple
                onChange={(e) => handleFileChange(e, "video")}
                className="w-full cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition"
              />
              <div className="mt-2 text-xs text-gray-500">支持多部影片上傳</div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {videos.map((video, index) => (
                <div key={index} className="relative group overflow-hidden rounded-xl shadow-md bg-gray-800">
                  <video
                    src={URL.createObjectURL(video)}
                    controls
                    className="w-full rounded-lg"
                  />
                  <button
                    onClick={() => removeFile(index, "video")}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                    <p className="text-white text-xs truncate">{video.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PDF上傳 */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
              上傳 PDF
            </h3>
            <div className="relative mb-6 group">
              <input
                type="file"
                accept=".pdf"
                multiple
                onChange={(e) => handleFileChange(e, "pdf")}
                className="w-full cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition"
              />
              <div className="mt-2 text-xs text-gray-500">支持多個 PDF 文件上傳</div>
            </div>
            <div className="space-y-3">
              {pdfs.map((pdf, index) => (
                <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-100 shadow-sm group hover:bg-blue-50 transition-colors">
                  <div className="flex items-center">
                    <FontAwesomeIcon className="text-red-500" icon={faFilePdf} />
                    <span className="text-sm text-gray-700">{pdf.name}</span>
                  </div>
                  <button
                    onClick={() => removeFile(index, "pdf")}
                    className="text-gray-400 hover:text-red-500 p-1.5 rounded-full hover:bg-red-50 transition-colors"
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

        {/* 上傳按鈕 */}
        <button
          onClick={handleUpload}
          className="w-full mt-10 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 px-6 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center font-medium text-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          上傳學習成果
        </button>
      </div>
    </div>
  );
};

export default UploadPage;
