"use client";
import { useParams, useRouter } from "next/navigation";
import getUserEmail from "@/../lib/getUserEmail";
import { useState, useEffect } from "react";
import SideBarMedia from '@/../components/ui/sideBarMedia';
import SideBarDesktop from '@/../components/ui/sideBarDesktop';

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId;
  const email = getUserEmail();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        console.log(projectId);
        const response = await fetch(`/api/projectOverview?email=${encodeURIComponent(email)}&projectId=${projectId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch project: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.project && data.project.author !== email) {
          throw new Error("You don't have permission to view this project");
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

  // Function to delete project
  const deleteProject = async () => {
    if (window.confirm('確定要刪除此專案嗎？此操作無法復原。')) {
      try {
        setIsDeleting(true);
        const response = await fetch(`/api/deleteProject?project=${JSON.stringify(project)}`, {
          method: 'POST', 
        });

        if (!response.ok) {
          throw new Error(`刪除失敗: ${response.status}`);
        }

        // Redirect to projects page after successful deletion
        router.push('/projects');
      } catch (err) {
        console.error("Error deleting project:", err);
        alert(`刪除失敗: ${err.message}`);
      } finally {
        setIsDeleting(false);
      }
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
              
              <h1 className="text-2xl font-bold text-[#333333]">作品詳情</h1>
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
              ) : project ? (
                <div className="bg-white rounded-xl shadow overflow-hidden">
                  <div style={{background: 'linear-gradient(to right, #1E3A8A, #2D4A9A)'}} className="p-6 text-white">
                    <h2 className="text-xl font-semibold">{project.title}</h2>
                    <p className="mt-2 text-white opacity-80">作者: {project.author}</p>
                    <p className="text-white opacity-80">上傳於 {formatDate(project.date)} {new Date(project.date).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-[#333333] mb-2">專案描述</h3>
                      <p className="text-[#666666]">{project.description || '無描述'}</p>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-[#333333] mb-4">專案內容</h3>
                      
                      {/* Images */}
                      {project.files?.filter(file => file.type === 'image').length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-md font-medium text-[#1E3A8A] mb-3 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                            圖片 ({project.files.filter(file => file.type === 'image').length})
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {project.files
                              .filter(file => file.type === 'image')
                              .map((file, index) => (
                                <div key={index} className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                  <a href={file.url} target="_blank" rel="noopener noreferrer">
                                    <img 
                                      src={file.url} 
                                      alt={`Project image ${index+1}`} 
                                      className="w-full h-48 object-cover"
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
                          <h4 className="text-md font-medium text-[#1E3A8A] mb-3 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                            </svg>
                            影片 ({project.files.filter(file => file.type === 'video').length})
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                    您的瀏覽器不支援影片播放
                                  </video>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                      
                      {/* PDFs */}
                      {project.files?.filter(file => file.type === 'pdf').length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-md font-medium text-[#1E3A8A] mb-3 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                            </svg>
                            文件 ({project.files.filter(file => file.type === 'pdf').length})
                          </h4>
                          <div className="space-y-3">
                            {project.files
                              .filter(file => file.type === 'pdf')
                              .map((file, index) => (
                                <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                  <a 
                                    href={file.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center text-[#1E3A8A] hover:text-[#9B1B30] transition-colors"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    PDF 文件 {index+1}
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
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
                      <button 
                        onClick={() => router.back()}
                        className="px-4 py-2 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#9B1B30] transition-colors mr-4"
                      >
                        返回作品列表
                      </button>
                      <a 
                        href={`/api/download/${project.project_id}`} 
                        className="px-4 py-2 bg-gray-100 text-[#333333] rounded-lg hover:bg-gray-200 transition-colors inline-flex items-center mr-4"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        下載所有檔案
                      </a>
                      <button 
                        onClick={() => deleteProject()} 
                        disabled={isDeleting}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors inline-flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {isDeleting ? '刪除中...' : '刪除專案'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-8 rounded-xl shadow text-center">
                  <p className="text-[#333333]">找不到此專案</p>
                  <button 
                    onClick={() => router.push('/projects')}
                    className="mt-4 px-4 py-2 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#9B1B30] transition-colors"
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

