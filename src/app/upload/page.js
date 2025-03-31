"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { XMarkIcon, DocumentIcon, PhotoIcon, VideoCameraIcon } from '@heroicons/react/24/outline';
import SideBarMedia from '../../../components/ui/sideBarMedia';
import SideBarDesktop from '../../../components/ui/sideBarDesktop';
import getUserEmail from '../../../lib/getUserEmail';
import { projectTypes, subjectAreas } from '../../../components/data/interestArea';

export default function Upload() {
  const router = useRouter();
  const email = getUserEmail();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // 檔案上傳參考
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const pdfInputRef = useRef(null);
  
  // 選擇的學科和相關的興趣選項
  const [selectedSubject, setSelectedSubject] = useState("");
  const [interestOptions, setInterestOptions] = useState([]);
  
  // 表單數據
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectType: "",
    subject: "",
    interest: "",
    images: [],
    videos: [],
    pdfs: []
  });
  
  // 驗證和錯誤訊息
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 當學科選擇改變時，更新興趣選項
  useEffect(() => {
    if (selectedSubject) {
      const subject = subjectAreas.find(
        (item) => item.subject === selectedSubject
      );
      if (subject) {
        setInterestOptions(subject.interests);
      } else {
        setInterestOptions([]);
      }
    } else {
      setInterestOptions([]);
    }
  }, [selectedSubject]);

  // 處理表單字段變化
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // 當學科選擇變化時，更新選擇的學科和重置興趣
    if (name === "subject") {
      setSelectedSubject(value);
      setFormData(prev => ({ ...prev, interest: "" }));
    }
    
    // 清除錯誤
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // 格式化檔案大小
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // 驗證文件大小
  const validateFileSize = (file, maxSize) => {
    return file.size <= maxSize;
  };

  // 處理圖片上傳
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    const newErrors = { ...errors };
    
    files.forEach(file => {
      // 檢查檔案類型
      if (!file.type.startsWith('image/')) {
        newErrors.images = "只能上傳圖片文件";
        return;
      }
      
      // 檢查文件大小 (5MB = 5 * 1024 * 1024 bytes)
      if (!validateFileSize(file, 5 * 1024 * 1024)) {
        newErrors.images = "圖片大小不能超過 5MB";
        return;
      }
      
      validFiles.push(file);
    });
    
    if (validFiles.length > 0) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...validFiles]
      }));
      delete newErrors.images;
    }
    
    setErrors(newErrors);
    e.target.value = null; // 重置輸入以允許再次上傳相同的文件
  };

  // 處理視頻上傳
  const handleVideoUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    const newErrors = { ...errors };
    
    files.forEach(file => {
      // 檢查檔案類型
      if (!file.type.startsWith('video/')) {
        newErrors.videos = "只能上傳視頻文件";
        return;
      }
      
      // 檢查文件大小 (100MB = 100 * 1024 * 1024 bytes)
      if (!validateFileSize(file, 100 * 1024 * 1024)) {
        newErrors.videos = "視頻大小不能超過 100MB";
        return;
      }
      
      validFiles.push(file);
    });
    
    if (validFiles.length > 0) {
      setFormData(prev => ({
        ...prev,
        videos: [...prev.videos, ...validFiles]
      }));
      delete newErrors.videos;
    }
    
    setErrors(newErrors);
    e.target.value = null; // 重置輸入以允許再次上傳相同的文件
  };

  // 處理PDF上傳
  const handlePdfUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    const newErrors = { ...errors };
    
    files.forEach(file => {
      // 檢查檔案類型
      if (file.type !== 'application/pdf') {
        newErrors.pdfs = "只能上傳PDF文件";
        return;
      }
      
      // 檢查文件大小 (20MB = 20 * 1024 * 1024 bytes)
      if (!validateFileSize(file, 20 * 1024 * 1024)) {
        newErrors.pdfs = "PDF大小不能超過 20MB";
        return;
      }
      
      validFiles.push(file);
    });
    
    if (validFiles.length > 0) {
      setFormData(prev => ({
        ...prev,
        pdfs: [...prev.pdfs, ...validFiles]
      }));
      delete newErrors.pdfs;
    }
    
    setErrors(newErrors);
    e.target.value = null; // 重置輸入以允許再次上傳相同的文件
  };

  // 移除檔案
  const removeFile = (type, index) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  // 提交表單
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // 檢驗表單
      const newErrors = {};
      if (!formData.title) newErrors.title = "標題不能為空";
      if (!formData.projectType) newErrors.projectType = "請選擇成果類型";
      if (!formData.subject) newErrors.subject = "請選擇成果領域";
      if (!formData.interest) newErrors.interest = "請選擇專業領域";
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      
      // 構建表單數據
      const form = new FormData();
      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("author", email);
      form.append("projectType", formData.projectType);
      form.append("subject", formData.subject);
      form.append("interest", formData.interest);
      
      // 添加文件
      formData.images.forEach(image => {
        form.append("images", image);
      });
      
      formData.videos.forEach(video => {
        form.append("videos", video);
      });
      
      formData.pdfs.forEach(pdf => {
        form.append("pdfs", pdf);
      });
      
      // 發送到服務器
      const response = await fetch("/api/upload", {
        method: "POST",
        body: form
      });
      
      const result = await response.json();
      console.log(result);
      if (response.ok) {
        // 上傳成功後重定向到項目頁面
        router.push(`/projects`);
      } else {
        throw new Error(result.error || "上傳失敗");
      }
    } catch (error) {
      console.error("上傳錯誤:", error);
      setErrors({ submit: error.message || "上傳時發生錯誤，請稍後再試" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!email) {
    return <div className="text-center p-10">請先登入</div>;
  }

  return (
    <div className="flex h-screen bg-[#FAF3E0]">
      <SideBarMedia sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <SideBarDesktop />

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8">
              {/* 整合標題和表單，使用相同的背景色 */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* 標題區域 */}
                <div style={{background: 'linear-gradient(to right, #1E3A8A, #2D4A9A)'}} className="p-6 text-white">
                  <h1 className="text-2xl font-bold text-center">學習成果上傳</h1>
                  <div className="h-1 w-24 bg-white/50 mt-2 mx-auto rounded-full"></div>
                  <p className="text-white text-center mt-2">分享您的學習旅程和成就</p>
                </div>
                
                {/* 表單區域 */}
                <div className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 標題和描述 */}
                    <div>
                      <label className="block text-sm font-medium text-[#333333] mb-2">作品標題</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                        placeholder="請輸入作品標題"
                      />
                      {errors.title && (
                        <p className="mt-1 text-sm text-[#9B1B30]">{errors.title}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-[#333333] mb-2">作品描述</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                        placeholder="請描述您的作品..."
                      />
                    </div>
                    
                    {/* 成果類型獨立一排 */}
                    <div>
                      <label className="block text-sm font-medium text-[#333333] mb-2">成果類型</label>
                      <select
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                      >
                        <option value="">請選擇成果類型</option>
                        {projectTypes.map((type) => (
                          <option key={type.id} value={type.name}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                      {errors.projectType && (
                        <p className="mt-1 text-sm text-[#9B1B30]">{errors.projectType}</p>
                      )}
                    </div>
                    
                    {/* 成果領域和專業領域一排 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#333333] mb-2">成果領域</label>
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                        >
                          <option value="">請選擇學科領域</option>
                          {subjectAreas.map((subject) => (
                            <option key={subject.subjectId} value={subject.subject}>
                              {subject.subject}
                            </option>
                          ))}
                        </select>
                        {errors.subject && (
                          <p className="mt-1 text-sm text-[#9B1B30]">{errors.subject}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-[#333333] mb-2">專業領域</label>
                        <select
                          name="interest"
                          value={formData.interest}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                          disabled={!selectedSubject}
                          style={{backgroundColor: selectedSubject ? 'white' : '#666'}}
                        >
                          <option value="">請選擇專業領域</option>
                          {interestOptions.map((interest) => (
                            <option key={interest.id} value={interest.name}>
                              {interest.name}
                            </option>
                          ))}
                        </select>
                        {errors.interest && (
                          <p className="mt-1 text-sm text-[#9B1B30]">{errors.interest}</p>
                        )}
                      </div>
                    </div>
                    
                    {/* 圖片上傳區塊 */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4 transition-all hover:shadow-md">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <PhotoIcon className="h-5 w-5 text-[#1E3A8A] mr-2" />
                          <h3 className="font-medium text-[#333333]">圖片檔案</h3>
                        </div>
                        <span className="text-xs text-gray-500">最大 5MB/張</span>
                      </div>
                      
                      <div 
                        onClick={() => imageInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <input
                          ref={imageInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                        <PhotoIcon className="h-8 w-8 mx-auto text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">點擊上傳圖片</p>
                        <p className="text-xs text-gray-400 mt-1">支援 JPEG, PNG, GIF 等格式</p>
                      </div>
                      
                      {errors.images && (
                        <p className="mt-2 text-sm text-[#9B1B30]">{errors.images}</p>
                      )}
                      
                      {formData.images.length > 0 && (
                        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {formData.images.map((file, index) => (
                            <div key={index} className="relative group">
                              <img 
                                src={URL.createObjectURL(file)} 
                                alt={file.name}
                                className="h-24 w-full object-cover rounded-md" 
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                                <button
                                  type="button"
                                  onClick={() => removeFile('images', index)}
                                  className="text-white hover:text-red-300 p-1"
                                >
                                  <XMarkIcon className="h-6 w-6" />
                                </button>
                              </div>
                              <p className="text-xs text-gray-500 truncate mt-1">{file.name}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* 視頻上傳區塊 */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4 transition-all hover:shadow-md">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <VideoCameraIcon className="h-5 w-5 text-[#1E3A8A] mr-2" />
                          <h3 className="font-medium text-[#333333]">影片檔案</h3>
                        </div>
                        <span className="text-xs text-gray-500">最大 100MB/個</span>
                      </div>
                      
                      <div 
                        onClick={() => videoInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <input
                          ref={videoInputRef}
                          type="file"
                          accept="video/*"
                          multiple
                          className="hidden"
                          onChange={handleVideoUpload}
                        />
                        <VideoCameraIcon className="h-8 w-8 mx-auto text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">點擊上傳影片</p>
                        <p className="text-xs text-gray-400 mt-1">支援 MP4, MOV, AVI 等格式</p>
                      </div>
                      
                      {errors.videos && (
                        <p className="mt-2 text-sm text-[#9B1B30]">{errors.videos}</p>
                      )}
                      
                      {formData.videos.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-[#333333] mb-2">已選擇的影片：</p>
                          <div className="space-y-2">
                            {formData.videos.map((file, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                                <div className="flex items-center overflow-hidden">
                                  <VideoCameraIcon className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                                  <p className="text-sm text-gray-500 truncate">{file.name}</p>
                                </div>
                                <div className="flex items-center ml-2">
                                  <span className="text-xs text-gray-400 mr-2">{formatFileSize(file.size)}</span>
                                  <button
                                    type="button"
                                    onClick={() => removeFile('videos', index)}
                                    className="text-[#9B1B30] hover:text-red-700 p-1"
                                  >
                                    <XMarkIcon className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* PDF上傳區塊 */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4 transition-all hover:shadow-md">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <DocumentIcon className="h-5 w-5 text-[#1E3A8A] mr-2" />
                          <h3 className="font-medium text-[#333333]">文件檔案</h3>
                        </div>
                        <span className="text-xs text-gray-500">最大 20MB/個</span>
                      </div>
                      
                      <div 
                        onClick={() => pdfInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <input
                          ref={pdfInputRef}
                          type="file"
                          accept="application/pdf"
                          multiple
                          className="hidden"
                          onChange={handlePdfUpload}
                        />
                        <DocumentIcon className="h-8 w-8 mx-auto text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">點擊上傳PDF文件</p>
                        <p className="text-xs text-gray-400 mt-1">僅支援PDF格式</p>
                      </div>
                      
                      {errors.pdfs && (
                        <p className="mt-2 text-sm text-[#9B1B30]">{errors.pdfs}</p>
                      )}
                      
                      {formData.pdfs.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-[#333333] mb-2">已選擇的文件：</p>
                          <div className="space-y-2">
                            {formData.pdfs.map((file, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                                <div className="flex items-center overflow-hidden">
                                  <DocumentIcon className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                                  <p className="text-sm text-gray-500 truncate">{file.name}</p>
                                </div>
                                <div className="flex items-center ml-2">
                                  <span className="text-xs text-gray-400 mr-2">{formatFileSize(file.size)}</span>
                                  <button
                                    type="button"
                                    onClick={() => removeFile('pdfs', index)}
                                    className="text-[#9B1B30] hover:text-red-700 p-1"
                                  >
                                    <XMarkIcon className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* 提交錯誤 */}
                    {errors.submit && (
                      <div className="bg-red-50 text-[#9B1B30] p-3 rounded-md">
                        {errors.submit}
                      </div>
                    )}
                    
                    {/* 提交按鈕 */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        style={{background: isSubmitting ? '#B0B0B0' : 'linear-gradient(to right, #1E3A8A, #2D4A9A)'}}
                        className="w-full py-3 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
                        onMouseOver={(e) => !isSubmitting && (e.currentTarget.style.background = 'linear-gradient(to right, #9B1B30, #9B1B30)')}
                        onMouseOut={(e) => !isSubmitting && (e.currentTarget.style.background = 'linear-gradient(to right, #1E3A8A, #2D4A9A)')}
                      >
                        <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-80 group-hover:h-80 opacity-10"></span>
                        {isSubmitting ? '上傳中...' : '上傳作品'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}


