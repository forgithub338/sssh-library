"use client";

import { useState } from 'react';
import { ChartBarIcon, UserGroupIcon, PhotoIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { BellIcon } from "@heroicons/react/24/outline";
import { AcademicCapIcon, BookOpenIcon, ClockIcon, HeartIcon, StarIcon, EyeIcon } from "@heroicons/react/24/outline";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#FAF3E0]">
      {/* 侧边栏 - 移动端 */}
      <div className={`fixed inset-0 z-40 flex md:hidden ${sidebarOpen ? 'visible' : 'invisible'}`} role="dialog" aria-modal="true">
        <div className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`} 
          aria-hidden="true" onClick={() => setSidebarOpen(false)}></div>
        
        <div className={`relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white transition transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">关闭侧边栏</span>
              <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>

          <div className="flex-shrink-0 flex items-center px-4">
            <h1 className="text-2xl font-bold text-[#1E3A8A]">學習成果分享平台</h1>
          </div>
          <div className="mt-5 flex-1 h-0 overflow-y-auto">
            <nav className="px-2 space-y-1">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="group flex items-center px-4 py-3 text-base font-medium rounded-xl text-[#333333] hover:bg-[#FAF3E0] hover:text-[#1E3A8A] transition-colors"
                >
                  <item.icon className="mr-4 h-6 w-6 text-[#B0B0B0] group-hover:text-[#1E3A8A] transition-colors" aria-hidden="true" />
                  {item.name}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* 侧边栏 - 桌面端 */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1">
            <div style={{background: 'linear-gradient(to right, #1E3A8A, #2D4A9A)'}} className="flex items-center h-16 flex-shrink-0 px-6 text-white">
              <h1 className="text-2xl font-bold">學習成果平台</h1>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto bg-white border-r border-gray-200">
              <nav className="flex-1 px-4 py-6 space-y-2">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="group flex items-center px-4 py-3 text-base font-medium rounded-xl text-[#333333] hover:bg-[#FAF3E0] hover:text-[#1E3A8A] transition-colors"
                  >
                    <item.icon className="mr-3 h-6 w-6 text-[#B0B0B0] group-hover:text-[#1E3A8A] transition-colors" aria-hidden="true" />
                    {item.name}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            className="px-4 border-r border-gray-200 text-gray-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">打开侧边栏</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <div className="w-full flex md:ml-0">
                <label htmlFor="search-field" className="sr-only">搜索</label>
                <div className="relative w-full text-[#B0B0B0] focus-within:text-[#1E3A8A]">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-3">
                    <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <input
                    id="search-field"
                    className="block w-full h-full pl-10 pr-3 py-2 border-transparent text-[#333333] placeholder-[#B0B0B0] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent rounded-xl sm:text-sm"
                    placeholder="搜尋學習成果"
                    type="search"
                  />
                </div>
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <button className="p-2 rounded-full text-[#B0B0B0] hover:text-[#1E3A8A] hover:bg-[#FAF3E0] focus:outline-none transition-colors relative">
                <span className="sr-only">查看通知</span>
                <BellIcon className="h-6 w-6" aria-hidden="true" />
                <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-[#9B1B30] text-xs text-white flex items-center justify-center">2</span>
              </button>

              <div className="ml-3 relative">
                <div className="h-9 w-9 rounded-full bg-[#1E3A8A] hover:bg-[#9B1B30] flex items-center justify-center transition-colors cursor-pointer">
                  <span className="text-sm font-medium text-white">王</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none p-6">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-bold text-[#333333]">我的學習空間</h1>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              
              {/* 1. 使用者資訊區塊 */}
              <div className="mt-8 bg-white overflow-hidden shadow rounded-xl border border-gray-100">
                <div style={{background: 'linear-gradient(to right, #1E3A8A, #2D4A9A)'}} className="p-6">
                  <div className="flex items-center">
                    <div className="h-20 w-20 rounded-full bg-white p-1">
                      <div className="h-full w-full rounded-full bg-[#9B1B30] flex items-center justify-center text-white text-2xl font-bold">
                        王
                      </div>
                    </div>
                    <div className="ml-6">
                      <h2 className="text-xl font-bold text-white">王小明</h2>
                      <div className="flex items-center mt-2">
                        <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm flex items-center">
                          <AcademicCapIcon className="h-4 w-4 mr-1" />
                          多媒體設計學生
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#FAF3E0] rounded-xl p-4 border border-gray-100">
                      <h3 className="text-sm font-medium text-[#B0B0B0]">關注領域</h3>
                      <p className="text-lg font-medium text-[#333333] mt-2">互動設計</p>
                      <p className="text-sm text-[#1E3A8A] mt-1">UI/UX 與前端開發</p>
                    </div>
                    <div className="bg-[#FAF3E0] rounded-xl p-4 border border-gray-100">
                      <h3 className="text-sm font-medium text-[#B0B0B0]">總分享數</h3>
                      <p className="text-lg font-medium text-[#333333] mt-2">12 個專案</p>
                      <p className="text-sm text-[#1E3A8A] mt-1">累積 58 個讚</p>
                    </div>
                    <div className="bg-[#FAF3E0] rounded-xl p-4 border border-gray-100">
                      <h3 className="text-sm font-medium text-[#B0B0B0]">最近活動</h3>
                      <p className="text-lg font-medium text-[#333333] mt-2">3 天前更新</p>
                      <p className="text-sm text-[#1E3A8A] mt-1">互動網頁設計作品</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. 分享統計與成果展示 */}
              <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {statCards.map((card) => (
                  <div key={card.name} className="bg-white overflow-hidden shadow rounded-xl border border-gray-100 hover:shadow-lg transition-all transform hover:-translate-y-1 duration-300">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-[#FAF3E0] p-3 rounded-lg">
                          <card.icon className="h-6 w-6 text-[#1E3A8A]" aria-hidden="true" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-[#B0B0B0] truncate">{card.name}</dt>
                            <dd>
                              <div className="text-lg font-medium text-[#333333]">{card.amount}</div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-[#1E3A8A] to-[#2D4A9A] px-5 py-3">
                      <div className="text-sm">
                        <a href="#" className="font-medium text-white hover:text-white/80 flex justify-between items-center">
                          查看詳情
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 最近分享的作品 */}
              <div className="mt-8">
                <div className="bg-white shadow rounded-xl border border-gray-100 overflow-hidden">
                  <div style={{background: 'linear-gradient(to right, #1E3A8A, #2D4A9A)'}} className="px-5 py-4 text-white">
                    <h3 className="text-lg font-medium">最近分享的作品</h3>
                  </div>
                  <ul className="divide-y divide-gray-200">
                    {recentProjects.map((project) => (
                      <li key={project.id} className="px-5 py-5 hover:bg-[#FAF3E0]/30 transition-colors cursor-pointer">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${project.typeColor}`}>
                              <project.icon className="h-6 w-6 text-white" aria-hidden="true" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#333333] truncate">{project.title}</p>
                            <p className="text-sm text-[#B0B0B0] truncate">{project.type}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-[#9B1B30]">{project.date}</p>
                            <div className="flex items-center mt-1 justify-end">
                              <HeartIcon className="h-4 w-4 text-red-500 mr-1" />
                              <span className="text-xs text-[#333333]">{project.likes}</span>
                              <EyeIcon className="h-4 w-4 text-blue-500 ml-2 mr-1" />
                              <span className="text-xs text-[#333333]">{project.views}</span>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="bg-gray-50 px-5 py-3">
                    <a href="#" className="text-sm font-medium text-[#1E3A8A] hover:text-[#9B1B30] transition-colors flex justify-center items-center">
                      查看所有作品
                      <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* 3. 社群互動與回饋 */}
              <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
                <div className="bg-white overflow-hidden shadow rounded-xl border border-gray-100">
                  <div style={{background: 'linear-gradient(to right, #1E3A8A, #2D4A9A)'}} className="p-4 text-white">
                    <h3 className="text-lg font-medium">最近獲得的回饋</h3>
                  </div>
                  <div className="p-5 divide-y divide-gray-200">
                    {feedbacks.map((feedback) => (
                      <div key={feedback.id} className="py-4 first:pt-0 last:pb-0">
                        <div className="flex items-start">
                          <div className={`flex-shrink-0 h-8 w-8 rounded-full ${feedback.bgColor} flex items-center justify-center`}>
                            <feedback.icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-[#333333]">{feedback.title}</p>
                            <p className="mt-1 text-sm text-[#B0B0B0]">{feedback.content}</p>
                            <div className="mt-2 flex items-center">
                              <span className="text-xs text-[#9B1B30]">{feedback.date}</span>
                              <span className="mx-2 text-gray-300">•</span>
                              <span className="text-xs text-[#1E3A8A]">{feedback.from}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-gray-50 px-5 py-3">
                    <a href="#" className="text-sm font-medium text-[#1E3A8A] hover:text-[#9B1B30] transition-colors flex justify-center items-center">
                      查看所有回饋
                      <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-xl border border-gray-100">
                  <div style={{background: 'linear-gradient(to right, #1E3A8A, #2D4A9A)'}} className="p-4 text-white">
                    <h3 className="text-lg font-medium">創作靈感</h3>
                  </div>
                  <div className="p-5 divide-y divide-gray-200">
                    {inspirations.map((item) => (
                      <div key={item.id} className="py-4 first:pt-0 last:pb-0">
                        <div className="flex items-start">
                          <div className={`flex-shrink-0 h-8 w-8 rounded-full ${item.bgColor} flex items-center justify-center`}>
                            <item.icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-[#333333]">{item.title}</p>
                            <p className="mt-1 text-sm text-[#B0B0B0]">{item.content}</p>
                            <div className="mt-2">
                              {item.tags.map((tag, idx) => (
                                <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FAF3E0] text-[#1E3A8A] mr-2">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-gray-50 px-5 py-3">
                    <a href="#" className="text-sm font-medium text-[#1E3A8A] hover:text-[#9B1B30] transition-colors flex justify-center items-center">
                      探索更多靈感
                      <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* 4. 快速操作區 */}
              <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <button 
                  style={{background: 'linear-gradient(to right, #1E3A8A, #2D4A9A)'}}
                  className="relative overflow-hidden group px-6 py-5 text-white rounded-xl transition-all duration-500 shadow-lg hover:shadow-2xl flex items-center justify-center font-medium text-lg"
                  onMouseOver={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #9B1B30, #9B1B30)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #1E3A8A, #2D4A9A)'}
                >
                  <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-80 group-hover:h-80 opacity-10"></span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 transform group-hover:-translate-y-1 transition-transform duration-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  分享新作品
                </button>
                
                <button 
                  className="relative overflow-hidden group px-6 py-5 text-[#1E3A8A] bg-white rounded-xl transition-all duration-500 shadow-lg hover:shadow-2xl flex items-center justify-center font-medium text-lg border-2 border-[#1E3A8A] hover:text-[#9B1B30] hover:border-[#9B1B30]"
                >
                  <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-[#FAF3E0] rounded-full group-hover:w-80 group-hover:h-80 opacity-50"></span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                  </svg>
                  瀏覽我的作品集
                </button>
              </div>

              {/* 興趣領域篩選區 */}
              <div className="mt-8 bg-white rounded-xl p-6 shadow border border-gray-100">
                <h3 className="text-lg font-medium text-[#333333] mb-4">探索學習領域</h3>
                <div className="flex flex-wrap gap-3">
                  {interestAreas.map((area) => (
                    <button key={area} className="px-4 py-2 rounded-full text-sm text-[#1E3A8A] bg-[#FAF3E0] hover:bg-[#1E3A8A] hover:text-white transition-colors duration-300 border border-transparent hover:border-blue-100">
                      {area}
                    </button>
                  ))}
                </div>
                <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#B0B0B0] mb-2">作品類型</label>
                    <select className="w-full rounded-lg border border-gray-200 px-4 py-2.5 bg-white focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent">
                      <option value="">所有類型</option>
                      <option value="web">網頁設計</option>
                      <option value="graphic">平面設計</option>
                      <option value="uxui">UI/UX</option>
                      <option value="video">影片製作</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#B0B0B0] mb-2">分享時間</label>
                    <select className="w-full rounded-lg border border-gray-200 px-4 py-2.5 bg-white focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent">
                      <option value="">所有時間</option>
                      <option value="week">本週</option>
                      <option value="month">本月</option>
                      <option value="year">今年</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#B0B0B0] mb-2">排序方式</label>
                    <select className="w-full rounded-lg border border-gray-200 px-4 py-2.5 bg-white focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent">
                      <option value="latest">最新上傳</option>
                      <option value="popular">最多讚好</option>
                      <option value="views">最多瀏覽</option>
                    </select>
                  </div>
                </div>
                <div className="mt-5 flex justify-end">
                  <button className="px-5 py-2 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#9B1B30] transition-colors duration-300 flex items-center">
                    <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                    探索作品
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// 导航项目
const navigation = [
  { name: '探索空間', href: '#', icon: ChartBarIcon },
  { name: '分享作品', href: '#', icon: DocumentTextIcon },
  { name: '我的作品集', href: '#', icon: PhotoIcon },
  { name: '個人資料', href: '#', icon: UserGroupIcon },
];

// 統計數據卡片
const statCards = [
  { name: '已分享作品', href: '#', amount: '12', icon: DocumentTextIcon },
  { name: '獲得讚好', href: '#', amount: '58', icon: HeartIcon },
  { name: '作品瀏覽量', href: '#', amount: '254', icon: EyeIcon },
];

// 最近分享的作品
const recentProjects = [
  {
    id: 1,
    title: '互動式網頁設計作品',
    type: '網頁設計',
    date: '3 天前',
    likes: 18,
    views: 86,
    typeColor: 'bg-[#1E3A8A]',
    icon: DocumentTextIcon
  },
  {
    id: 2,
    title: '行動應用介面設計',
    type: 'UI/UX 設計',
    date: '1 週前',
    likes: 24,
    views: 102,
    typeColor: 'bg-purple-500',
    icon: DocumentTextIcon
  },
  {
    id: 3,
    title: '品牌識別設計專案',
    type: '平面設計',
    date: '2 週前',
    likes: 12,
    views: 45,
    typeColor: 'bg-[#9B1B30]',
    icon: DocumentTextIcon
  },
  {
    id: 4,
    title: '產品宣傳短片',
    type: '影片製作',
    date: '3 週前',
    likes: 9,
    views: 33,
    typeColor: 'bg-green-500',
    icon: DocumentTextIcon
  },
];

// 創作回饋
const feedbacks = [
  {
    id: 1,
    title: '互動式網頁設計作品',
    content: '視覺元素的動畫效果非常吸引人，讓網站更具生命力！',
    date: '2 天前',
    from: '李同學',
    icon: HeartIcon,
    bgColor: 'bg-[#9B1B30]'
  },
  {
    id: 2,
    title: '行動應用介面設計',
    content: '介面設計簡潔直觀，用戶體驗非常好，期待看到實際應用。',
    date: '5 天前',
    from: '張教授',
    icon: StarIcon,
    bgColor: 'bg-[#1E3A8A]'
  },
  {
    id: 3,
    title: '品牌識別設計專案',
    content: '色彩選擇和標誌設計完美地表達了品牌理念，很專業！',
    date: '1 週前',
    from: '陳同學',
    icon: HeartIcon,
    bgColor: 'bg-green-500'
  },
];

// 創作靈感
const inspirations = [
  {
    id: 1,
    title: '探索最新設計趨勢',
    content: '2023年網頁設計採用更多的3D元素和沉浸式體驗，嘗試在你的下一個專案中加入這些元素。',
    tags: ['設計趨勢', '3D', '沉浸式'],
    icon: StarIcon,
    bgColor: 'bg-[#1E3A8A]'
  },
  {
    id: 2,
    title: '學習新技術',
    content: '考慮學習Three.js或WebGL來為你的作品添加令人驚艷的視覺效果和互動體驗。',
    tags: ['Three.js', 'WebGL', '互動'],
    icon: AcademicCapIcon,
    bgColor: 'bg-[#9B1B30]'
  },
  {
    id: 3,
    title: '尋找合作機會',
    content: '與其他領域的同學合作，將你的設計技能與他們的專業知識結合，創造跨領域作品。',
    tags: ['合作', '跨領域', '創新'],
    icon: UserGroupIcon,
    bgColor: 'bg-green-500'
  },
];

// 興趣領域
const interestAreas = [
  '網頁設計', 'UI/UX', '平面設計', '品牌設計', '影片製作', 
  '動畫', '遊戲設計', '攝影', '插畫', '3D 建模'
];
