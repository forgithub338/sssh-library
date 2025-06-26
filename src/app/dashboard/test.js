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

export default function Dashboard() {
  const router = useRouter();
  const email = getUserEmail();

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
      <SideBarMedia sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <SideBarDesktop />

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">打開側邊欄</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
            <h1 className="text-lg font-bold text-[#1E3A8A]">學習成果平台</h1>
            <div className="w-10"></div> {/* Spacer for centering */}
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          {/* Desktop padding - reduced on mobile */}
          <div className="py-4 md:py-6">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8">
              {/* Page title - hidden on mobile since it's in header */}
              <h1 className="hidden md:block text-2xl font-bold text-[#333333] mb-6">我的學習空間</h1>
              
              {console.log(userData)}
              
              {/* Mobile optimized layout */}
              <div className="space-y-4 md:space-y-6">
                {/* User Information - mobile friendly */}
                <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
                  <UserInformation 
                    name={userData ? userData?.name : ""}  
                    project={userData ? userData?.project : 0} 
                    love={userData ? userData?.love : 0}
                    type={userData ? userData?.type : "student"}
                    latestDate={userData ? userData?.latestDate : ""}
                    latestProject={userData ? userData?.latestProject1?.title : ""}
                  />
                </div>

                {/* User Statistics - responsive grid */}
                <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
                  <UserStatics 
                    project={userData ? userData.project : 0} 
                    love={userData ? userData.love : 0}
                    view={userData ? userData.view : 0}
                  />
                </div>

                {/* Latest Files - mobile scroll if needed */}
                <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
                  <h2 className="text-lg font-semibold text-[#333333] mb-4">最新檔案</h2>
                  <UserLatestFile 
                    latestProject1={userData ? userData.latestProject1 : ""}
                    latestProject2={userData ? userData.latestProject2 : ""}
                    latestProject3={userData ? userData.latestProject3 : ""}
                    latestProject4={userData ? userData.latestProject4 : ""}
                  />
                </div>

                {/* Feedback and Inspiration - stacked on mobile */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                  <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
                    <UserFeedback />
                  </div>
                  <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
                    <UserInspiration />
                  </div>
                </div>

                {/* Quick Actions - mobile optimized */}
                <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
                  <QuickActions />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation (optional) */}
      <div className="md:hidden bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around">
          <button className="flex flex-col items-center py-2 px-3 text-xs text-gray-600">
            <div className="w-6 h-6 bg-[#1E3A8A] rounded mb-1"></div>
            首頁
          </button>
          <button className="flex flex-col items-center py-2 px-3 text-xs text-gray-400">
            <div className="w-6 h-6 bg-gray-300 rounded mb-1"></div>
            檔案
          </button>
          <button className="flex flex-col items-center py-2 px-3 text-xs text-gray-400">
            <div className="w-6 h-6 bg-gray-300 rounded mb-1"></div>
            探索
          </button>
          <button className="flex flex-col items-center py-2 px-3 text-xs text-gray-400">
            <div className="w-6 h-6 bg-gray-300 rounded mb-1"></div>
            設定
          </button>
        </div>
      </div>
    </div>
  );
}