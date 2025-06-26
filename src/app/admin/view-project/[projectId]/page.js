"use client";
import { useParams, useRouter } from "next/navigation";
import getUserEmail from "@/../lib/getUserEmail";
import { useState, useEffect } from "react";
import SideBarMedia from '@/../components/ui/sideBarMedia';
import SideBarDesktop from '@/../components/ui/sideBarDesktop';
import { Bars3Icon } from '@heroicons/react/24/outline';

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId;
  const email = getUserEmail();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/projectOverview?email=${encodeURIComponent(email)}&projectId=${projectId}&method=admin`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch project: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(data)

        if(data.method !== 'admin'){
          if (data.project && data.project.author !== email) {
            throw new Error("You don't have permission to view this project");
          }
        }
        
        setProject(data.project);
        console.log(data.project);
      } catch (err) {
        console.error("Error fetching project:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (email) {
      fetchProjectDetails();
    } else {
      router.push('/login');
    }
  }, [email, projectId, router]);

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('zh-TW', options);
  };

  return (
    <div className="flex h-screen bg-[#FAF3E0]">
      <SideBarMedia sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <SideBarDesktop />

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Mobile header */}
        <div className="md:hidden bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
        <button
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#1E3A8A]"
              onClick={() => setSidebarOpen(true)}
            >
              
              <span className="sr-only">打開導航選單</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
            <h1 className="text-lg font-semibold text-[#1E3A8A]">作品詳情</h1>
            <div className="w-10"></div> {/* Spacer for centering */}
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-4 md:py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <h1 className="text-xl md:text-2xl font-bold text-[#333333]">作品詳情</h1>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-4 md:mt-6">
              {loading ? (
                <div className="bg-white p-6 md:p-8 rounded-xl shadow text-center">
                  <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-[#1E3A8A] mx-auto"></div>
                  <p className="mt-4 text-[#333333]">載入中...</p>
                </div>
              ) : error ? (
                <div className="bg-white p-6 md:p-8 rounded-xl shadow">
                  <div className="text-[#9B1B30] p-4 bg-red-50 rounded-lg">
                    <p className="text-sm md:text-base">無法載入專案: {error}</p>
                    <button 
                      onClick={() => window.location.reload()}
                      className="mt-4 px-4 py-2 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#9B1B30] transition-colors text-sm md:text-base"
                    >
                      重試
                    </button>
                  </div>
                </div>
              ) : project ? (
                <div className="bg-white rounded-xl shadow overflow-hidden">
                  <div style={{background: 'linear-gradient(to right, #1E3A8A, #2D4A9A)'}} className="p-4 md:p-6 text-white">
                    <h2 className="text-lg md:text-xl font-semibold break-words">{project.title}</h2>
                    <p className="mt-2 text-white opacity-80 text-sm md:text-base">作者: {project.author}</p>
                    <p className="text-white opacity-80 text-sm md:text-base">
                      上傳於 {formatDate(project.date)} {new Date(project.date).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    
                    <div className="flex flex-wrap items-center mt-3 gap-2">
                      <div className="bg-white/20 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm backdrop-blur-sm flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span className="truncate">{project.type || '未分類'}</span>
                      </div>
                      <div className="bg-white/20 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm backdrop-blur-sm flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span className="truncate">{project.section || '未分類'}</span>
                      </div>
                      {project.status && (
                        <div className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium flex items-center ${
                          project.status === '審核中' ? 'bg-yellow-500/80 text-white' :
                          project.status === '審核通過' ? 'bg-green-500/80 text-white' : 
                          project.status === '審核未通過' ? 'bg-red-500/80 text-white' : 
                          'bg-gray-500/80 text-white'
                        }`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {project.status}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-4 md:p-6">
                    <div className="mb-6">
                      <h3 className="text-base md:text-lg font-medium text-[#333333] mb-2">專案描述</h3>
                      <p className="text-[#666666] text-sm md:text-base break-words">{project.description || '無描述'}</p>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-base md:text-lg font-medium text-[#333333] mb-4">專案內容</h3>
                      
                      {/* Images */}
                      {project.files?.filter(file => file.type === 'image').length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-sm md:text-md font-medium text-[#1E3A8A] mb-3 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                            圖片 ({project.files.filter(file => file.type === 'image').length})
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                            {project.files
                              .filter(file => file.type === 'image')
                              .map((file, index) => (
                                <div key={index} className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                  <a href={file.url} target="_blank" rel="noopener noreferrer">
                                    <img 
                                      src={file.url} 
                                      alt={file.url.split("_")[1]} 
                                      className="w-full h-40 md:h-48 object-cover"
                                    />
                                  </a>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Videos */}
                      {project.files?.filter(file => file.type === 'video').length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-sm md:text-md font-medium text-[#1E3A8A] mb-3 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                            </svg>
                            影片 ({project.files.filter(file => file.type === 'video').length})
                          </h4>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                            {project.files
                              .filter(file => file.type === 'video')
                              .map((file, index) => (
                                <div key={index} className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                  <video 
                                    controls 
                                    className="w-full h-auto"
                                    poster={file.thumbnail || ''}
                                  >
                                    <source src={file.url} type="video/mp4" />
                                    {file.url.split("_")[1]} 
                                  </video>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                      
                      {/* PDFs */}
                      {project.files?.filter(file => file.type === 'pdf').length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-sm md:text-md font-medium text-[#1E3A8A] mb-3 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                            </svg>
                            文件 ({project.files.filter(file => file.type === 'pdf').length})
                          </h4>
                          <div className="space-y-3">
                            {project.files
                              .filter(file => file.type === 'pdf')
                              .map((file, index) => (
                                <div key={index} className="bg-gray-50 p-3 md:p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                  <a 
                                    href={file.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center text-[#1E3A8A] hover:text-[#9B1B30] transition-colors text-sm md:text-base"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    <span className="break-all flex-1">{file.url.split('_')[1]}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 ml-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                  </a>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button 
                          onClick={() => router.back()}
                          className="px-4 py-2 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#9B1B30] transition-colors text-sm md:text-base text-center"
                        >
                          返回作品列表
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-6 md:p-8 rounded-xl shadow text-center">
                  <p className="text-[#333333] text-sm md:text-base">找不到此專案</p>
                  <button 
                    onClick={() => router.push('/projects')}
                    className="mt-4 px-4 py-2 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#9B1B30] transition-colors text-sm md:text-base"
                  >
                    返回作品列表
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

