"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bars3Icon } from '@heroicons/react/24/outline';

import SideBarMedia from '../../../components/ui/sideBarMedia';
import SideBarDesktop from '../../../components/ui/sideBarDesktop';
import NavBar from '../../../components/ui/navBar';
import UserInformation from '../../../components/ui/userInformation';
import UserStatics from '../../../components/ui/userStatics';
import UserLatestFile from '../../../components/ui/userLatestFIle';
import UserFeedback from '../../../components/ui/userFeedback';
import UserInspiration from '../../../components/ui/userInspiration';
import QuickActions from '../../../components/ui/quickActions';
import ExploreSection from '../../../components/ui/exploreSection';
import getUserEmail from '../../../lib/getUserEmail';
import getUserPosition from '../../../lib/getUserPosition';

export default function Dashboard() {
  const router = useRouter();
  const email = getUserEmail();
  const position = getUserPosition();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch("/api/getUserData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setUserData(data);
    }
    fetchUserData();
  }, []);

  return (
    <div className="flex h-screen bg-[#FAF3E0]">
      <SideBarMedia sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} position={position} />
      <SideBarDesktop position={position} />

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* 手機版頂部導航欄 */}
        <div className="md:hidden bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-[#1E3A8A] hover:bg-[#FAF3E0] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#1E3A8A]"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">打開選單</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
            <h1 className="text-lg font-bold text-[#1E3A8A]">學習成果平台</h1>
            <div className="w-10"></div> {/* 占位符保持標題居中 */}
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-4 md:py-6">
            {/* 頁面標題 - 桌面版 */}
            <div className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-6">
              <h1 className="text-2xl font-bold text-[#333333]">我的學習空間</h1>
            </div>

            {/* 手機版頁面標題 */}
            <div className="md:hidden px-4 mb-4">
              <h1 className="text-xl font-bold text-[#333333]">我的學習空間</h1>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {console.log(userData)}
              
              {/* 用戶信息卡片 */}
              <UserInformation 
                name={userData ? userData?.name : ""}  
                project={userData ? userData?.project : 0} 
                love={userData ? userData?.love : 0}
                type={userData ? userData?.type : "student"}
                latestDate={userData ? userData?.latestDate : ""}
                latestProject={userData ? userData?.latestProject1?.title : ""}
              />

              {/* 統計數據 */}
              <UserStatics 
                project={userData ? userData.project : 0} 
                love={userData ? userData.love : 0}
                view={userData ? userData.view : 0}
              />

              {/* 最新作品 */}
              <UserLatestFile 
                latestProject1={userData ? userData.latestProject1 : ""}
                latestProject2={userData ? userData.latestProject2 : ""}
                latestProject3={userData ? userData.latestProject3 : ""}
                latestProject4={userData ? userData.latestProject4 : ""}
              />

              {/* 快速操作按鈕 */}
              <QuickActions />

              {/* 添加底部間距，避免內容被遮擋 */}
              <div className="h-4 md:h-0"></div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}