"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SideBarMedia from '../../../../components/ui/sideBarMedia';
import SideBarDesktop from '../../../../components/ui/sideBarDesktop';
import getUserEmail from '../../../../lib/getUserEmail';
import {
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  DocumentTextIcon,
  PhotoIcon,
  VideoCameraIcon
} from "@heroicons/react/24/outline";

export default function ReviewProjects() {
  const router = useRouter();
  const email = getUserEmail();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [currentProject, setCurrentProject] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [action, setAction] = useState(null); // 'approve' or 'reject'
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    if (!email) {
      router.push('/login');
      return;
    }

    const checkAdminAccess = async () => {
      try {
        const response = await fetch(`/api/checkRole?email=${email}`);
        const data = await response.json();
        
        console.log("User role check:", data); // 除錯用
        
        setUserRole(data.position || ""); 
        
        if (response.ok && data.position === '管理者') {
          fetchPendingProjects();
        } else {
          console.error("Access denied: not an admin");
          router.push('/dashboard');
        }
      } catch (error) {
        console.error("Error checking admin access:", error);
        router.push('/dashboard');
      }
    };

    checkAdminAccess();
  }, [email, router]);

  const fetchPendingProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/pending-projects');
      const data = await response.json();
      
      if (response.ok) {
        setProjects(data.projects || []);
      } else {
        console.error("Failed to fetch pending projects:", data.error);
      }
    } catch (error) {
      console.error("Error fetching pending projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (project, action) => {
    setCurrentProject(project);
    setAction(action);
    setIsModalOpen(true);
    if (action === 'reject') {
      setRejectReason('');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentProject(null);
    setAction(null);
    setRejectReason('');
  };

  const handleProjectAction = async () => {
    if (!currentProject) return;

    setProcessingId(currentProject.project_id);
    
    try {
      const response = await fetch('/api/admin/review-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: currentProject.project_id,
          action: action,
          reason: action === 'reject' ? rejectReason : '',
          reviewedBy: email
        }),
      });

      const data = await response.json();
      console.log(data)
      
      if (response.ok) {
        closeModal();
        fetchPendingProjects(); // 重新加載待審核專案
      } else {
        alert(`操作失敗: ${data.error}`);
      }
    } catch (error) {
      console.error(`Error ${action}ing project:`, error);
      alert(`操作過程中發生錯誤，請稍後再試`);
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '未知日期';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('zh-TW', options);
  };

  // 只有在確認為管理員身份後才渲染頁面內容
  if (!userRole) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1E3A8A]"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      <SideBarMedia sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <SideBarDesktop />

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none p-6">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold text-[#333333]">待審核專案</h1>
              <p className="mt-1 text-sm text-[#B0B0B0]">審核用戶上傳的專案，決定是否批准發布</p>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1E3A8A]"></div>
                </div>
              ) : projects.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow">
                  <DocumentTextIcon className="mx-auto h-12 w-12 text-[#B0B0B0]" />
                  <h3 className="mt-2 text-lg font-medium text-[#333333]">沒有待審核的專案</h3>
                  <p className="mt-1 text-[#B0B0B0]">目前沒有需要審核的專案</p>
                </div>
              ) : (
                <div className="bg-white shadow rounded-xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-[#333333]">待審核專案清單 ({projects.length})</h2>
                  </div>
                  
                  <ul className="divide-y divide-gray-200">
                    {projects.map((project) => (
                      <li key={project.project_id} className="px-6 py-5 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-medium text-[#333333] truncate">{project.title}</h3>
                            <div className="mt-1 flex items-center">
                              <p className="text-sm text-[#B0B0B0] mr-4">
                                作者: {project.author_name || project.author}
                              </p>
                              <p className="text-sm text-[#B0B0B0]">
                                上傳於: {formatDate(project.date)}
                              </p>
                            </div>
                            <p className="mt-2 text-sm text-[#333333] line-clamp-2">
                              {project.description || '無描述'}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2">
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
                            </div>
                            <div className="mt-3 flex gap-4">
                              <div className="flex items-center text-sm text-[#B0B0B0]">
                                <PhotoIcon className="h-4 w-4 mr-1" />
                                {project.img} 張照片
                              </div>
                              <div className="flex items-center text-sm text-[#B0B0B0]">
                                <VideoCameraIcon className="h-4 w-4 mr-1" />
                                {project.video} 部影片
                              </div>
                              <div className="flex items-center text-sm text-[#B0B0B0]">
                                <DocumentTextIcon className="h-4 w-4 mr-1" />
                                {project.pdf} 份文件
                              </div>
                            </div>
                          </div>
                          <div className="ml-6 flex items-center space-x-3">
                            <button
                              onClick={() => router.push(`/admin/view-project/${project.project_id}`)}
                              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-[#333333] bg-white hover:bg-gray-50 focus:outline-none"
                            >
                              <EyeIcon className="h-4 w-4 mr-1" />
                              查看
                            </button>
                            <button
                              onClick={() => openModal(project, 'approve')}
                              className={`inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none ${processingId === project.project_id ? 'opacity-50 cursor-not-allowed' : ''}`}
                              disabled={processingId === project.project_id}
                            >
                              <CheckCircleIcon className="h-4 w-4 mr-1" />
                              通過
                            </button>
                            <button
                              onClick={() => openModal(project, 'reject')}
                              className={`inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-[#9B1B30] hover:bg-red-700 focus:outline-none ${processingId === project.project_id ? 'opacity-50 cursor-not-allowed' : ''}`}
                              disabled={processingId === project.project_id}
                            >
                              <XCircleIcon className="h-4 w-4 mr-1" />
                              拒絕
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* 審核確認對話框 */}
      {isModalOpen && currentProject && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 ${action === 'approve' ? 'bg-green-100' : 'bg-red-100'}`}>
                    {action === 'approve' ? (
                      <CheckCircleIcon className="h-6 w-6 text-green-600" />
                    ) : (
                      <XCircleIcon className="h-6 w-6 text-[#9B1B30]" />
                    )}
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-[#333333]">
                      {action === 'approve' ? '通過專案' : '拒絕專案'}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-[#B0B0B0]">
                        {action === 'approve' 
                          ? `確定要通過「${currentProject.title}」專案嗎？審核通過後，此專案將對所有用戶可見。` 
                          : `確定要拒絕「${currentProject.title}」專案嗎？請提供拒絕原因，此訊息將發送給作者。`}
                      </p>
                      
                      {action === 'reject' && (
                        <div className="mt-4">
                          <label htmlFor="reject-reason" className="block text-sm font-medium text-[#333333]">
                            拒絕原因
                          </label>
                          <textarea
                            id="reject-reason"
                            rows="3"
                            className="shadow-sm mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A]"
                            placeholder="請說明拒絕此專案的原因..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            required
                          ></textarea>
                          {rejectReason.trim() === '' && (
                            <p className="mt-1 text-sm text-[#9B1B30]">拒絕原因為必填項</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleProjectAction}
                  disabled={action === 'reject' && rejectReason.trim() === '' || processingId !== null}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm ${
                    action === 'approve' 
                      ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' 
                      : 'bg-[#9B1B30] hover:bg-red-700 focus:ring-red-500'
                  } ${(action === 'reject' && rejectReason.trim() === '') || processingId !== null ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {processingId !== null ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      處理中...
                    </>
                  ) : action === 'approve' ? '確認通過' : '確認拒絕'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={processingId !== null}
                  className={`mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-[#333333] hover:bg-gray-50 focus:ring-gray-200 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm ${processingId !== null ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 