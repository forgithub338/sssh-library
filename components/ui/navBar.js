import { Bars3Icon } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { BellIcon } from "@heroicons/react/24/outline";

export default function NavBar(props) {
  return (
    <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
      {/* 側邊欄按鈕 */}
      <button
        className="px-4 border-r border-gray-200 text-gray-500 md:hidden"
        onClick={() => props.setSidebarOpen(true)}
      >
        <span className="sr-only">打开侧边栏</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* 搜索框 */}
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

        {/* 通知按鈕 */}
        <div className="ml-4 flex items-center md:ml-6">
          <button className="p-2 rounded-full text-[#B0B0B0] hover:text-[#1E3A8A] hover:bg-[#FAF3E0] focus:outline-none transition-colors relative">
            <span className="sr-only">查看通知</span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-[#9B1B30] text-xs text-white flex items-center justify-center">2</span>
          </button>

          {/* 用戶頭像 */}
          <div className="ml-3 relative">
            <div className="h-9 w-9 rounded-full bg-[#1E3A8A] hover:bg-[#9B1B30] flex items-center justify-center transition-colors cursor-pointer">
              <span className="text-sm font-medium text-white">王</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
