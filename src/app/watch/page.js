"use client";
import SideBarMedia from "@/../components/ui/sideBarMedia"
import SideBarDesktop from "@/../components/ui/sideBarDesktop"
import { projectTypes, subjectAreas } from '../../../components/data/interestArea';
import { useState, useEffect } from "react";
import { Heart, Eye, Calendar, User, FileText, Play, X, Loader2, Search } from 'lucide-react';

export default function Watch() {

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [loading, setLoading] = useState(true); // 添加加載狀態
  const [formData, setFormData] = useState({
    projectType: "所有類型",
    subject: "所有領域",
    sortBy: "date-asc"
  })
  const [getData, setGetData] = useState({})
  
  // 模擬數據
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // 開始加載
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
        setLoading(false); // 結束加載
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

  // 獲取檔案名稱
  const getFileName = (filePath) => {
    return filePath.split('/').pop().split('_').slice(1).join('_');
  };

  // 媒體查看器
  const MediaViewer = ({ media, onClose }) => {
    if (!media) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
        <div className="relative max-w-4xl max-h-full">
          <button
            onClick={onClose}
            className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
          >
            <X size={32} />
          </button>
          
          {media.type === 'image' ? (
            <img
              src={media.src}
              alt="預覽"
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
          ) : (
            <video
              src={media.src}
              controls
              className="max-w-full max-h-[80vh] rounded-lg"
              autoPlay
            />
          )}
        </div>
      </div>
    );
  };

  // 加載中組件
  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="animate-spin text-blue-500 mb-4" size={48} />
      <p className="text-gray-500 text-lg">載入中...</p>
    </div>
  );

  // 無結果組件
  const NoResults = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Search className="text-gray-400" size={48} />
      </div>
      <h3 className="text-xl font-medium text-gray-900 mb-2">沒有找到符合條件的專案</h3>
      <p className="text-gray-500 text-center max-w-md">
        請嘗試調整篩選條件，或檢查是否有其他可用的專案類型和領域。
      </p>
    </div>
  );

  // 渲染媒體網格
  const renderMediaGrid = (images, videos) => {
    const allMedia = [
      ...images.map(img => ({ type: 'image', src: img })),
      ...videos.map(vid => ({ type: 'video', src: vid }))
    ];

    if (allMedia.length === 0) return null;

    const gridClass = allMedia.length === 1 ? 'grid-cols-1' :
                      allMedia.length === 2 ? 'grid-cols-2' :
                      allMedia.length === 3 ? 'grid-cols-2' :
                      'grid-cols-2';

    return (
      <div className={`grid ${gridClass} gap-2 mt-3 rounded-lg overflow-hidden`}>
        {allMedia.map((media, index) => {
          const isThird = allMedia.length === 3 && index === 2;
          const spanClass = isThird ? 'col-span-2' : '';
          
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
                  className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
                />
              ) : (
                <div className="relative">
                  <video
                    src={media.src}
                    className="w-full h-48 object-cover"
                    muted
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center group-hover:bg-opacity-20 transition-all">
                    <Play className="text-white" size={32} />
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
      <SideBarMedia sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <SideBarDesktop />

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8">
              {/* 篩選器區域 */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">成果類型</label>
                    <select
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loading}
                    >
                      <option value="date-asc">最新上傳</option>
                      <option value="date-desc">最早上傳</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 專案展示區域 */}
              <div className="space-y-4">
                {loading ? (
                  <LoadingSpinner />
                ) : getData?.data && getData.data.length > 0 ? (
                  getData.data.map((project) => (
                    <div key={project.project_id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                      {/* 頭部信息 */}
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                              <User className="text-white" size={20} />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{project.author}</h3>
                              <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <Calendar size={14} />
                                <span>{formatDate(project.date)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {project.type}
                            </span>
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              {project.section}
                            </span>
                          </div>
                        </div>
                        
                        {/* 標題和描述 */}
                        <div className="mt-3">
                          <h2 className="text-lg font-semibold text-gray-900 mb-1">
                            {project.title}
                          </h2>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {project.description}
                          </p>
                        </div>
                      </div>

                      {/* 媒體內容 */}
                      {renderMediaGrid(project.files.image || [], project.files.video || [])}

                      {/* PDF 檔案 */}
                      {project.files.pdf && project.files.pdf.length > 0 && (
                        <div className="px-4 py-3 border-t border-gray-100">
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
                                <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                                  <FileText className="text-red-600" size={16} />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900">
                                    {getFileName(pdfPath)}
                                  </p>
                                  <p className="text-xs text-gray-500">PDF 檔案</p>
                                </div>
                                <div className="text-blue-600 text-sm font-medium">
                                  開啟
                                </div>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 互動按鈕 */}
                      <div className="px-4 py-3 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-6">
                            <button className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors">
                              <Heart size={18} />
                              <span className="text-sm">{project.love}</span>
                            </button>
                            <div className="flex items-center space-x-2 text-gray-500">
                              <Eye size={18} />
                              <span className="text-sm">{project.view}</span>
                            </div>
                          </div>
                          <div className="text-xs text-gray-400">
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

      {/* 媒體查看器 */}
      <MediaViewer 
        media={selectedMedia} 
        onClose={() => setSelectedMedia(null)} 
      />
    </div>
  );
};