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
                    <h2 className="text-lg font-medium text-[#333333]">共 {projects.length} 個作品</h2>
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
                    {projects.map((project) => (
                      <div key={project.project_id} className="bg-white rounded-xl shadow overflow-hidden hover:shadow-lg transition-all transform hover:-translate-y-1 duration-300">
                        <div style={{background: 'linear-gradient(to right, #1E3A8A, #2D4A9A)'}} className="p-4 text-white">
                          <h3 className="font-medium truncate">{project.title}</h3>
                        </div>
                        
                        <div className="p-4">
                          <p className="text-[#B0B0B0] text-sm mb-3">上傳於 {formatDate(project.date)} {new Date(project.date).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}</p>
                          <p className="text-[#333333] line-clamp-2 h-10">{project.description || '無描述'}</p>
                          <div className="flex gap-4 mt-4">
                            <div className="flex items-center text-sm text-[#B0B0B0]">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                              </svg>
                              {project.image} 張照片
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
                          
                          <div className="flex gap-3 mt-3 pt-3 border-t border-gray-100">
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
                          
                          <div className="flex flex-wrap gap-2 mt-3">
                            {project.type && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FAF3E0] text-[#1E3A8A]">
                                {project.type}
                              </span>
                            )}
                            {project.subject && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-[#1E3A8A]">
                                {project.subject}
                              </span>
                            )}
                          </div>
                          
                          <div className="mt-4 flex justify-between">
                            
                            <button 
                              onClick={() => {router.push(`/projects/projectOverview/${project.project_id}?email=${email}`)}}
                              className="text-[#1E3A8A] text-sm hover:text-[#9B1B30] transition-colors flex items-center"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                              </svg>
                              查看詳情
                            </button>
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