"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
  
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#FAF3E0]">
      <SideBarMedia sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <SideBarDesktop />

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none p-6">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-bold text-[#333333]">我的學習空間</h1>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              
              <UserInformation />

              <UserStatics />

              <UserLatestFile />

              <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
                <UserFeedback />
                <UserInspiration />
              </div>

              <QuickActions />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}