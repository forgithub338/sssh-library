"use client";
import SideBarMedia from "@/../components/ui/sideBarMedia"
import SideBarDesktop from "@/../components/ui/sideBarDesktop"
import { projectTypes, subjectAreas } from '../../../components/data/interestArea';
import { useState, useEffect } from "react";
import { Heart, Eye, Calendar, User, FileText, Play, X, Loader2, Search, Menu, Filter } from 'lucide-react';
import getUserPosition from '../../../lib/getUserPosition';

export default function Watch() {
  const position = getUserPosition();
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false); // 手機版篩選器顯示狀態
  const [formData, setFormData] = useState({
    projectType: "所有類型",
    subject: "所有領域",
    sortBy: "date-asc"
  })
  const [getData, setGetData] = useState({})
  
  // 模擬數據
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/watch", {
          method: "POST",
          body: JSON.stringify(formData)
        });
        
        const data = await response.json()

        setGetData(data)
        console.log(data)
      } catch(error) {
        console.log(error)
      } finally {
        setLoading(false);
      }
    }
    fetchData()
  }, [formData])

  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 格式化日期 - 手機版簡化版本
  const formatDateMobile = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 獲取檔案名稱
  const getFileName = (filePath) => {
    return filePath.split('/').pop().split('_').slice(1).join('_');
  };

  // 媒體查看器
  const MediaViewer = ({ media, onClose }) => {
    if (!media) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
        <div className="relative max-w-4xl max-h-full w-full">
          <button
            onClick={onClose}
            className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors z-10"
          >
            <X size={32} />
          </button>
          
          {media.type === 'image' ? (
            <img
              src={media.src}
              alt="預覽"
              className="max-w-full max-h-[80vh] object-contain rounded-lg mx-auto"
            />
          ) : (
            <video
              src={media.src}
              controls
              className="max-w-full max-h-[80vh] rounded-lg mx-auto"
              autoPlay
            />
          )}
        </div>
      </div>
    );
  };

  // 加載中組件
  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center py-8 md:py-12">
      <Loader2 className="animate-spin text-blue-500 mb-4" size={36} />
      <p className="text-gray-500 text-base md:text-lg">載入中...</p>
    </div>
  );

  // 無結果組件
  const NoResults = () => (
    <div className="flex flex-col items-center justify-center py-8 md:py-12 px-4">
      <div className="w-16 h-16 md:w-24 md:h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Search className="text-gray-400" size={32} />
      </div>
      <h3 className="text-lg md:text-xl font-medium text-gray-900 mb-2 text-center">沒有找到符合條件的專案</h3>
      <p className="text-gray-500 text-center max-w-md text-sm md:text-base">
        請嘗試調整篩選條件，或檢查是否有其他可用的專案類型和領域。
      </p>
    </div>
  );

  // 手機版篩選器
  const MobileFilters = () => (
    <div className={`md:hidden fixed inset-0 z-40 ${showFilters ? 'visible' : 'invisible'}`}>
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity ${showFilters ? 'opacity-100' : 'opacity-0'}`}
        onClick={() => setShowFilters(false)}
      />
      <div className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 transform transition-transform ${showFilters ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">篩選條件</h3>
          <button
            onClick={() => setShowFilters(false)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">成果類型</label>
            <select
              value={formData.projectType}
              onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[#000]"
              disabled={loading}
            >
              <option value="所有類型">所有類型</option>
              {projectTypes.map((type) => (
                <option key={type.id} value={type.name}>{type.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">成果領域</label>
            <select
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[#000]"
              disabled={loading}
            >
              <option value="所有領域">所有領域</option>
              {subjectAreas.map((area) => (
                <option key={area.subjectId} value={area.subject}>{area.subject}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">排序方式</label>
            <select
              value={formData.sortBy}
              onChange={(e) => setFormData({ ...formData, sortBy: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[#000]"
              disabled={loading}
            >
              <option value="date-asc">最新上傳</option>
              <option value="date-desc">最早上傳</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => setShowFilters(false)}
          className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          套用篩選
        </button>
      </div>
    </div>
  );

  // 渲染媒體網格 - 響應式版本
  const renderMediaGrid = (images, videos) => {
    const allMedia = [
      ...images.map(img => ({ type: 'image', src: img })),
      ...videos.map(vid => ({ type: 'video', src: vid }))
    ];

    if (allMedia.length === 0) return null;

    // 手機版統一使用單列，桌面版保持原邏輯
    const gridClass = `grid gap-2 mt-3 rounded-lg overflow-hidden ${
      window.innerWidth < 768 ? 'grid-cols-1' : 
      allMedia.length === 1 ? 'grid-cols-1' :
      allMedia.length === 2 ? 'grid-cols-2' :
      allMedia.length === 3 ? 'grid-cols-2' :
      'grid-cols-2'
    }`;

    return (
      <div className={gridClass}>
        {allMedia.map((media, index) => {
          const isThird = allMedia.length === 3 && index === 2;
          const spanClass = isThird && window.innerWidth >= 768 ? 'col-span-2' : '';
          
          return (
            <div
              key={index}
              className={`relative cursor-pointer group ${spanClass}`}
              onClick={() => setSelectedMedia(media)}
            >
              {media.type === 'image' ? (
                <img
                  src={media.src}
                  alt={`圖片 ${index + 1}`}
                  className="w-full h-40 md:h-48 object-cover hover:opacity-90 transition-opacity rounded-lg"
                />
              ) : (
                <div className="relative">
                  <video
                    src={media.src}
                    className="w-full h-40 md:h-48 object-cover rounded-lg"
                    muted
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center group-hover:bg-opacity-20 transition-all rounded-lg">
                    <Play className="text-white" size={28} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-[#FAF3E0]">
      <SideBarMedia sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} position={position} />
      <SideBarDesktop position={position} />

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* 手機版頂部導航 */}
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">學習成果</h1>
            <button
              onClick={() => setShowFilters(true)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <Filter size={24} />
            </button>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-4 md:py-6">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8">
              {/* 桌面版篩選器區域 */}
              <div className="hidden md:block bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">成果類型</label>
                    <select
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[#000]"
                      disabled={loading}
                    >
                      <option value="所有類型">所有類型</option>
                      {projectTypes.map((type) => (
                        <option key={type.id} value={type.name}>{type.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">成果領域</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[#000]"
                      disabled={loading}
                    >
                      <option value="所有領域">所有領域</option>
                      {subjectAreas.map((area) => (
                        <option key={area.subjectId} value={area.subject}>{area.subject}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">排序方式</label>
                    <select
                      value={formData.sortBy}
                      onChange={(e) => setFormData({ ...formData, sortBy: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[#000]"
                      disabled={loading}
                    >
                      <option value="date-asc">最新上傳</option>
                      <option value="date-desc">最早上傳</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 專案展示區域 */}
              <div className="space-y-3 md:space-y-4">
                {loading ? (
                  <LoadingSpinner />
                ) : getData?.data && getData.data.length > 0 ? (
                  getData.data.map((project) => (
                    <div key={project.project_id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                      {/* 頭部信息 */}
                      <div className="p-3 md:p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="text-white" size={16} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-medium text-gray-900 text-sm md:text-base truncate">{project.author}</h3>
                              <div className="flex items-center space-x-2 text-xs md:text-sm text-gray-500">
                                <Calendar size={12} />
                                <span className="hidden md:inline">{formatDate(project.date)}</span>
                                <span className="md:hidden">{formatDateMobile(project.date)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col md:flex-row space-y-1 md:space-y-0 md:space-x-2 flex-shrink-0">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full text-center">
                              {project.type}
                            </span>
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full text-center">
                              {project.section}
                            </span>
                          </div>
                        </div>
                        
                        {/* 標題和描述 */}
                        <div className="mt-3">
                          <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-1">
                            {project.title}
                          </h2>
                          <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                            {project.description}
                          </p>
                        </div>
                      </div>

                      {/* 媒體內容 */}
                      {renderMediaGrid(project.files.image || [], project.files.video || [])}

                      {/* PDF 檔案 */}
                      {project.files.pdf && project.files.pdf.length > 0 && (
                        <div className="px-3 md:px-4 py-3 border-t border-gray-100">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">附件檔案</h4>
                          <div className="space-y-2">
                            {project.files.pdf.map((pdfPath, index) => (
                              <a
                                key={index}
                                href={pdfPath}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                              >
                                <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center flex-shrink-0">
                                  <FileText className="text-red-600" size={16} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {getFileName(pdfPath)}
                                  </p>
                                  <p className="text-xs text-gray-500">PDF 檔案</p>
                                </div>
                                <div className="text-blue-600 text-sm font-medium flex-shrink-0">
                                  開啟
                                </div>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 互動按鈕 */}
                      <div className="px-3 md:px-4 py-3 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 md:space-x-6">
                            <button className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors">
                              <Heart size={16} />
                              <span className="text-sm">{project.love}</span>
                            </button>
                            <div className="flex items-center space-x-2 text-gray-500">
                              <Eye size={16} />
                              <span className="text-sm">{project.view}</span>
                            </div>
                          </div>
                          <div className="text-xs text-gray-400 hidden md:block">
                            專案 ID: {project.project_id}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <NoResults />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* 手機版篩選器 */}
      <MobileFilters />

      {/* 媒體查看器 */}
      <MediaViewer 
        media={selectedMedia} 
        onClose={() => setSelectedMedia(null)} 
      />
    </div>
  );
};