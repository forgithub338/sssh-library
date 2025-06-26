"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SideBarMedia from '../../../components/ui/sideBarMedia';
import SideBarDesktop from '../../../components/ui/sideBarDesktop';
import getUserEmail from '../../../lib/getUserEmail';
import { DocumentTextIcon } from "@heroicons/react/24/outline";

export default function ProjectsPage() {
  const router = useRouter();
  const email = getUserEmail();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sortOption, setSortOption] = useState('date-desc');
  const [loadingProjectId, setLoadingProjectId] = useState(null);
  
  useEffect(() => {
    if (!email) {
      router.push('/login');
      return;
    }

    async function fetchProjects() {
      try {
        setLoading(true);
        const response = await fetch(`/api/projects?email=${encodeURIComponent(email)}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch projects: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(data);
        setProjects(data.projects || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProjects();
  }, [email, router]);

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('zh-TW', options);
  };

  // Function to handle sorting
  const handleSort = (option) => {
    setSortOption(option);
  };

  // Function to get sorted projects
  const getSortedProjects = () => {
    if (!projects.length) return [];
    
    const sortedProjects = [...projects];
    
    switch (sortOption) {
      case 'date-desc':
        return sortedProjects.sort((a, b) => new Date(b.date) - new Date(a.date));
      case 'date-asc':
        return sortedProjects.sort((a, b) => new Date(a.date) - new Date(b.date));
      case 'love-desc':
        return sortedProjects.sort((b, a) => (a.love || 0) - (b.love || 0));
      case 'love-asc':
        return sortedProjects.sort((a, b) => (a.love || 0) - (b.love || 0));
      default:
        return sortedProjects;
    }
  };
  
  return (
    <div className="flex h-screen bg-[#FAF3E0]">
      <SideBarMedia sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <SideBarDesktop />

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none p-6">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-bold text-[#333333]">我的作品集</h1>
              <p className="mt-2 text-[#B0B0B0]">查看並管理您的已上傳作品</p>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
      {loading ? (
                <div className="bg-white p-8 rounded-xl shadow text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E3A8A] mx-auto"></div>
                  <p className="mt-4 text-[#333333]">載入中...</p>
                </div>
              ) : error ? (
                <div className="bg-white p-8 rounded-xl shadow">
                  <div className="text-[#9B1B30] p-4 bg-red-50 rounded-lg">
                    <p>無法載入專案: {error}</p>
                    <button 
                      onClick={() => window.location.reload()}
                      className="mt-4 px-4 py-2 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#9B1B30] transition-colors"
                    >
                      重試
                    </button>
                  </div>
                </div>
      ) : projects.length === 0 ? (
                <div className="bg-white p-8 rounded-xl shadow text-center">
                  <div className="w-24 h-24 bg-[#FAF3E0] rounded-full flex items-center justify-center mx-auto">
                    <DocumentTextIcon className="h-12 w-12 text-[#1E3A8A]" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-[#333333]">尚未上傳作品</h3>
                  <p className="mt-2 text-[#B0B0B0]">您還沒有上傳任何作品</p>
                  <button 
                    onClick={() => router.push(`/upload?email=${email}`)}
                    style={{background: 'linear-gradient(to right, #1E3A8A, #2D4A9A)'}}
                    className="mt-6 px-6 py-3 text-white rounded-xl hover:shadow-lg transition-all group relative overflow-hidden"
                    onMouseOver={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #9B1B30, #9B1B30)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #1E3A8A, #2D4A9A)'}
                  >
                    <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
                    立即上傳新作品
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                      <h2 className="text-lg font-medium text-[#333333]">共 {projects.length} 個作品</h2>
                      <div className="ml-4">
                        <select 
                          value={sortOption}
                          onChange={(e) => handleSort(e.target.value)}
                          className="bg-white border border-gray-200 text-[#333333] py-1 px-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                        >
                          <option value="date-desc">最新上傳</option>
                          <option value="date-asc">最早上傳</option>
                          <option value="love-desc">最多喜歡</option>
                          <option value="love-asc">最少喜歡</option>
                        </select>
                      </div>
                    </div>
                    <button 
                      onClick={() => router.push(`/upload?email=${email}`)}
                      className="px-4 py-2 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#9B1B30] transition-colors flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      上傳新作品
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getSortedProjects().map((project) => (
                      <div key={project.project_id} className="bg-white rounded-xl shadow overflow-hidden hover:shadow-lg transition-all transform hover:-translate-y-1 duration-300">
                        <div style={{background: 'linear-gradient(to right, #1E3A8A, #2D4A9A)'}} className="p-4 text-white">
                          <h3 className="font-medium truncate">{project.title}</h3>
                          <div className="flex items-center mt-2 flex-wrap gap-2">
                            {project.type && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FAF3E0] text-[#1E3A8A]">
                                {project.type}
                              </span>
                            )}
                            {project.section && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-[#1E3A8A]">
                                {project.section}
                              </span>
                            )}
                            
                            {project.status && (
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                ${project.status === '審核中' ? 'bg-yellow-100 text-yellow-800' : 
                                 project.status === '審核通過' ? 'bg-green-100 text-green-800' : 
                                 'bg-red-100 text-red-800'}`}
                              >
                                {project.status}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="p-4 flex flex-col h-[calc(100%-4rem)]">
                          <p className="text-[#B0B0B0] text-sm mb-3">上傳於 {formatDate(project.date)} {new Date(project.date).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}</p>
                          <p className="text-[#333333] line-clamp-2 h-10">{project.description || '無描述'}</p>

                          

                          {/* 將下方的媒體計數、檢視、喜歡等資訊固定到卡片底部 */}
                          <div className="mt-3 pt-4">
                            <div className="flex gap-4 mb-4">
                              <div className="flex items-center text-sm text-[#B0B0B0]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                </svg>
                                {project.img} 張照片
                              </div>
                              <div className="flex items-center text-sm text-[#B0B0B0]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                </svg>
                                {project.video} 部影片
                              </div>
                              <div className="flex items-center text-sm text-[#B0B0B0]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                </svg>
                                {project.pdf} 份文件
                              </div>
                            </div>
                            
                            <div className="flex justify-between">
                              <div className="flex gap-3">
                                <div className="flex items-center bg-[#FAF3E0]/50 px-3 py-1.5 rounded-lg">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-[#1E3A8A]" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                  </svg>
                                  <span className="text-sm font-medium text-[#333333]">{project.view || 0} 次檢視</span>
                                </div>
                                <div className="flex items-center bg-red-50 px-3 py-1.5 rounded-lg">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-[#9B1B30]" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                  </svg>
                                  <span className="text-sm font-medium text-[#333333]">{project.love || 0} 個喜歡</span>
                                </div>
                              </div>
                              
                              <button 
                                onClick={() => {
                                  setLoadingProjectId(project.project_id);
                                  setTimeout(() => {
                                    router.push(`/projects/projectOverview/${project.project_id}`);
                                  }, 300);
                                }}
                                disabled={loadingProjectId === project.project_id}
                                className="text-[#1E3A8A] text-sm hover:text-[#9B1B30] transition-colors flex items-center"
                              >
                                {loadingProjectId === project.project_id ? (
                                  <>
                                    <div className="h-4 w-4 mr-1 animate-spin rounded-full border-2 border-t-transparent border-[#1E3A8A]"></div>
                                    跳轉中...
                                  </>
                                ) : (
                                  <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                    </svg>
                                    查看詳情
                                  </>
                                )}
                              </button>
                            </div>
                            {/* 添加審核相關信息 - 放在專案描述下方 */}
                            <div className="mt-2 text-xs text-gray-500">
                            {project.status !== '審核中' ? '審核者：' + project.reviewed_by : '未審核'}
                            </div>

                          {/* 未通過審核的案件顯示原因和修改按鈕 */}
                          {project.status === '審核未通過' && (
                            <div className="mt-3 p-3 bg-red-50 rounded-md border border-red-200">
                              <div className="flex justify-between items-start">
                                <div className="text-sm text-red-800 font-medium">未通過原因：</div>
                                <button 
                                  onClick={() => router.push(`/edit-project?projectId=${project.project_id}`)}
                                  className="inline-flex items-center px-3 py-1.5 text-sm border border-red-300 bg-white text-red-700 rounded-md hover:bg-red-50 transition-colors ml-2"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                  修改專案
                                </button>
                              </div>
                              <div className="mt-1 relative">
                                <input type="checkbox" className="absolute inset-0 opacity-0 z-10 h-8 w-full cursor-pointer peer" />
                                <p className="text-sm text-red-700 line-clamp-1 peer-checked:line-clamp-none">{project.rejection_reason || '未提供原因'}</p>
                                <div className="absolute right-0 bottom-0 text-xs text-red-500 peer-checked:hidden">展開</div>
                                <div className="hidden peer-checked:block text-xs text-red-500 text-right">收起</div>
                              </div>
                            </div>
                          )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}